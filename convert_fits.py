"""
=============================================================================
SPHEREx FITS to Web Image Extraction Pipeline
Step 2: Convert Real NASA SPHEREx Level 2 FITS Data into Web-Ready PNGs
=============================================================================
"""

import os
import urllib.request
import numpy as np
from astropy.io import fits
from PIL import Image

def download_and_convert_fits(fits_url, output_png_path, label="Epoch"):
    print(f"\n[SPHEREx Pipeline] Processing {label}...")
    temp_fits = "temp_download.fits"

    # Streaming download of FITS file
    print(f"Downloading from NASA IRSA: {fits_url}")
    req = urllib.request.Request(fits_url, headers={'User-Agent': 'Mozilla/5.0'})
    
    # Download the essential FITS image HDUs (first 25 MB contains primary + ext 1 image data)
    req.add_header('Range', 'bytes=0-26214399')
    with urllib.request.urlopen(req) as resp, open(temp_fits, 'wb') as out_f:
        out_f.write(resp.read())
        # Pad to next 2880 block to satisfy FITS standard parser
        pad = (2880 - (out_f.tell() % 2880)) % 2880
        out_f.write(b'\x00' * pad)

    try:
        with fits.open(temp_fits, ignore_missing_end=True) as hdul:
            print(f"HDU List: {[h.name for h in hdul]}")
            # Extension 1 contains the 2D calibrated spectral image matrix (2040 x 2040)
            data = hdul[1].data if len(hdul) > 1 else hdul[0].data
            print(f"Extracted Image Shape: {data.shape}, DataType: {data.dtype}")

            # Center cutout 512x512
            h, w = data.shape
            ch, cw = 512, 512
            y0, x0 = (h - ch) // 2, (w - cw) // 2
            cutout = data[y0:y0+ch, x0:x0+cw].astype(np.float32)

            # Clean NaNs and Inf values
            cutout = np.nan_to_num(cutout, nan=0.0, posinf=0.0, neginf=0.0)

            # Astronomical Asinh / ZScale histogram stretch
            p_low = np.percentile(cutout, 2)
            p_high = np.percentile(cutout, 98)
            if p_high <= p_low:
                p_high = p_low + 1.0

            stretched = np.arcsinh((cutout - p_low) / (p_high - p_low) * 3.0)
            stretched = (stretched - stretched.min()) / (stretched.max() - stretched.min() + 1e-6)
            pixel_array = (stretched * 255.0).astype(np.uint8)

            img = Image.fromarray(pixel_array)
            img.save(output_png_path)
            print(f"[SUCCESS] Saved calibrated web image -> {output_png_path}")

    finally:
        if os.path.exists(temp_fits):
            os.remove(temp_fits)

if __name__ == "__main__":
    os.makedirs("D:/nasa", exist_ok=True)

    # Real SPHEREx QR2 Observation URLs from NASA IRSA archive
    url_epoch1 = "https://irsa.ipac.caltech.edu/ibe/data/spherex/qr2/level2/2026W08_2A/l2b-v24-2026-089/5/level2_2026W08_2A_0157_1D5_spx_l2b-v24-2026-089.fits"
    url_epoch2 = "https://irsa.ipac.caltech.edu/ibe/data/spherex/qr2/level2/2026W07_2A/l2b-v24-2026-089/6/level2_2026W07_2A_0400_4D6_spx_l2b-v24-2026-089.fits"

    # Step 2: Save directly in root project folder as sky_epoch1.png and sky_epoch2.png
    download_and_convert_fits(url_epoch1, "D:/nasa/sky_epoch1.png", "Epoch 1 (2026W08_2A)")
    download_and_convert_fits(url_epoch2, "D:/nasa/sky_epoch2.png", "Epoch 2 (2026W07_2A)")

    # Compute difference subtraction image
    e1 = np.array(Image.open("D:/nasa/sky_epoch1.png"), dtype=np.float32)
    e2 = np.array(Image.open("D:/nasa/sky_epoch2.png"), dtype=np.float32)
    diff = np.clip(128.0 + (e2 - e1) * 1.5, 0, 255).astype(np.uint8)
    Image.fromarray(diff).save("D:/nasa/sky_diff.png")
    print("[SUCCESS] Saved difference image -> D:/nasa/sky_diff.png")
