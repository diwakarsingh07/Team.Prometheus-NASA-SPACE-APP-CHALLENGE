"""
PROMETHEUS: NASA SPHEREx Mission Exploration & Comparison Engine
Flask Application Backend
"""

import os
import io
import csv
import json
from flask import Flask, request, jsonify, render_template, send_from_directory, Response
from flask_cors import CORS

import spherex_engine

app = Flask(__name__, template_folder=".", static_folder=".")
CORS(app)

# Ensure template reloading for smooth live development
app.config["TEMPLATES_AUTO_RELOAD"] = True


@app.route("/")
def index():
    """Serves the main PROMETHEUS Web Interface."""
    return render_template("comare.html")


@app.route("/comare.html")
def comare_html():
    return render_template("comare.html")


@app.route("/compare.css")
def compare_css():
    """Direct route for CSS to ensure backward and direct file compatibility."""
    return send_from_directory(".", "compare.css", mimetype="text/css")


@app.route("/api/status", methods=["GET"])
def api_status():
    """Returns NASA SPHEREx mission status & orbital telemetry."""
    return jsonify({
        "mission": "SPHEREx (Spectro-Photometer for the History of the Universe, Epoch of Reionization, and Ices Explorer)",
        "agency": "NASA / JPL / Caltech",
        "detector_bands": 6,
        "spectral_channels": 102,
        "wavelength_coverage_um": "0.75 - 5.00",
        "orbit": "Sun-Synchronous Low Earth Orbit (650 km, 97.5° inclination)",
        "instrument_temp_k": 62.4,
        "current_epoch": "Epoch 4 (Active / Primary Mission)",
        "all_sky_coverage_pct": 98.4,
        "epochs": spherex_engine.SPHEREx_EPOCHS,
        "ice_features": spherex_engine.ICE_FEATURES
    })


@app.route("/api/targets", methods=["GET"])
def api_targets():
    """Returns all curated SPHEREx scientific benchmark targets."""
    targets_list = []
    for t_id, meta in spherex_engine.BENCHMARK_TARGETS.items():
        targets_list.append({
            "id": meta["id"],
            "name": meta["name"],
            "designation": meta["designation"],
            "category": meta["category"],
            "ra_deg": meta["ra_deg"],
            "dec_deg": meta["dec_deg"],
            "base_flux_mjy": meta["base_flux_mjy"],
            "variability_type": meta["variability_type"],
            "description": meta["description"],
            "scientific_highlight": meta["scientific_highlight"]
        })
    return jsonify({"status": "success", "count": len(targets_list), "targets": targets_list})


@app.route("/api/target/<target_id>", methods=["GET"])
def api_target_details(target_id):
    """Returns comprehensive target profile, including coordinates, 4 epochs, and ice signatures."""
    target_meta = spherex_engine.BENCHMARK_TARGETS.get(target_id)
    if not target_meta:
        # Check if dynamically resolved target
        search_res = spherex_engine.search_astronomical_target(target_id)
        if search_res.get("status") == "success":
            target_meta = search_res["target"]
        else:
            return jsonify({"status": "error", "message": f"Target '{target_id}' not found"}), 404
            
    # Compute astrometry across all 4 epochs
    pm = target_meta.get("proper_motion", {"pm_ra_mas": 0, "pm_dec_mas": 0})
    epochs_data = []
    for ep in spherex_engine.SPHEREx_EPOCHS:
        coords = spherex_engine.compute_epoch_coordinates(
            target_meta["ra_deg"], target_meta["dec_deg"],
            pm["pm_ra_mas"], pm["pm_dec_mas"],
            ep["mjd"]
        )
        spec = spherex_engine.synthesize_spherex_spectrum(target_meta, ep["id"])
        render = spherex_engine.generate_astronomical_fits_render(target_meta, ep["id"], img_size=256)
        
        epochs_data.append({
            "epoch_id": ep["id"],
            "name": ep["name"],
            "date": ep["date"],
            "mjd": ep["mjd"],
            "coordinates": coords,
            "band_averages": spec["band_averages"],
            "total_flux_mjy": spec["total_integrated_flux_mjy"],
            "render_data_uri": render["image_data_uri"]
        })
        
    return jsonify({
        "status": "success",
        "target": target_meta,
        "epochs": epochs_data,
        "ice_features": spherex_engine.ICE_FEATURES
    })


@app.route("/api/search", methods=["GET"])
def api_search():
    """Search targets by name or RA/Dec coordinates."""
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify({"status": "error", "message": "Query parameter 'q' is required"}), 400
        
    res = spherex_engine.search_astronomical_target(query)
    return jsonify(res)


@app.route("/api/compare", methods=["POST"])
def api_compare():
    """
    Compares two observation epochs for a target:
    Request JSON: {"target_id": "barnard", "epoch_a": "epoch_1", "epoch_b": "epoch_2"}
    """
    data = request.get_json(force=True, silent=True) or {}
    target_id = data.get("target_id", "l1527")
    epoch_a = data.get("epoch_a", "epoch_1")
    epoch_b = data.get("epoch_b", "epoch_2")
    
    target_meta = spherex_engine.BENCHMARK_TARGETS.get(target_id)
    if not target_meta:
        search_res = spherex_engine.search_astronomical_target(target_id)
        if search_res.get("status") == "success":
            target_meta = search_res["target"]
        else:
            return jsonify({"status": "error", "message": f"Target '{target_id}' not found"}), 404
            
    comparison = spherex_engine.compute_epoch_comparison(target_meta, epoch_a, epoch_b)
    return jsonify({"status": "success", "comparison": comparison})


@app.route("/api/spectrum/<target_id>/<epoch_id>", methods=["GET"])
def api_spectrum(target_id, epoch_id):
    """Returns the 102-channel spectrophotometric array for a specific epoch."""
    target_meta = spherex_engine.BENCHMARK_TARGETS.get(target_id)
    if not target_meta:
        search_res = spherex_engine.search_astronomical_target(target_id)
        if search_res.get("status") == "success":
            target_meta = search_res["target"]
        else:
            return jsonify({"status": "error", "message": f"Target '{target_id}' not found"}), 404
            
    spec = spherex_engine.synthesize_spherex_spectrum(target_meta, epoch_id)
    return jsonify({
        "status": "success",
        "target_id": target_id,
        "epoch_id": epoch_id,
        "spectrum": spec
    })


@app.route("/api/export/<target_id>/csv", methods=["GET"])
def api_export_csv(target_id):
    """Exports spectrophotometry table across all epochs in scientific CSV format."""
    target_meta = spherex_engine.BENCHMARK_TARGETS.get(target_id, spherex_engine.BENCHMARK_TARGETS["l1527"])
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Astronomical metadata header
    writer.writerow(["# PROMETHEUS - NASA SPHEREx Mission Spectrophotometric Table"])
    writer.writerow([f"# Target: {target_meta['name']} ({target_meta['designation']})"])
    writer.writerow([f"# Category: {target_meta['category']}"])
    writer.writerow([f"# Base Coordinates: RA {target_meta['ra_deg']} deg, Dec {target_meta['dec_deg']} deg"])
    writer.writerow([])
    
    # Columns
    writer.writerow([
        "channel_index", "wavelength_um", "lvf_band",
        "flux_epoch1_mjy", "err_epoch1_mjy",
        "flux_epoch2_mjy", "err_epoch2_mjy",
        "flux_epoch3_mjy", "err_epoch3_mjy",
        "flux_epoch4_mjy", "err_epoch4_mjy",
        "optical_depth_tau"
    ])
    
    specs = {ep["id"]: spherex_engine.synthesize_spherex_spectrum(target_meta, ep["id"]) for ep in spherex_engine.SPHEREx_EPOCHS}
    
    for i in range(spherex_engine.SPHEREx_CHANNELS):
        c1 = specs["epoch_1"]["channels"][i]
        c2 = specs["epoch_2"]["channels"][i]
        c3 = specs["epoch_3"]["channels"][i]
        c4 = specs["epoch_4"]["channels"][i]
        
        writer.writerow([
            c1["channel_index"], c1["wavelength_um"], c1["band"],
            c1["flux_mjy"], c1["flux_error_mjy"],
            c2["flux_mjy"], c2["flux_error_mjy"],
            c3["flux_mjy"], c3["flux_error_mjy"],
            c4["flux_mjy"], c4["flux_error_mjy"],
            c1["optical_depth_tau"]
        ])
        
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-disposition": f"attachment; filename=prometheus_spherex_{target_id}_spectra.csv"}
    )


if __name__ == "__main__":
    print("=" * 65)
    print("  PROMETHEUS: NASA SPHEREx Observation & Comparison Platform")
    print("  Astropy-Powered Multi-Epoch Spectrophotometry Engine")
    print("  Server launching on: http://127.0.0.1:5000")
    print("=" * 65)
    app.run(host="0.0.0.0", port=5000, debug=True)
