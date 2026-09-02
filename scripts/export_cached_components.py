#!/usr/bin/env python3
"""Expand browser assets from a previously fitted deterministic PCA cache."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image

SIZE = 128
EXPOSED_COMPONENTS = 24


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_float32(path: Path, values: np.ndarray) -> str:
    path.write_bytes(np.asarray(values, dtype="<f4").reshape(-1).tobytes())
    return sha256(path)


def save_gray(path: Path, values: np.ndarray) -> None:
    pixels = np.rint(np.clip(values, 0.0, 1.0) * 255.0).astype(np.uint8)
    Image.fromarray(pixels).save(path, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--basis", type=Path, required=True)
    parser.add_argument("--weights", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    manifest = json.loads(args.manifest.read_text())
    pixel_count = manifest["width"] * manifest["height"]
    if pixel_count != SIZE * SIZE:
        raise RuntimeError(f"Expected {SIZE}×{SIZE} assets, received {manifest['width']}×{manifest['height']}")

    components = np.fromfile(args.basis, dtype="<f4")
    weights = np.fromfile(args.weights, dtype="<f4")
    expected_basis = manifest["maxDimensions"] * pixel_count
    if components.size != expected_basis:
        raise RuntimeError(f"Expected {expected_basis} basis values, received {components.size}")
    if weights.size != manifest["maxDimensions"]:
        raise RuntimeError(f"Expected {manifest['maxDimensions']} weights, received {weights.size}")
    if not np.isfinite(components).all() or not np.isfinite(weights).all():
        raise RuntimeError("Cached PCA arrays must contain only finite values")
    components = components.reshape(manifest["maxDimensions"], pixel_count)

    existing = manifest["components"]
    totals = [
        record["eigenvalue"] / record["explainedVariance"]
        for record in existing
        if record["explainedVariance"] > 0
    ]
    total_variance = float(np.mean(totals))
    relative_spread = (max(totals) - min(totals)) / total_variance
    if relative_spread > 1e-5:
        raise RuntimeError("Existing eigenvalues are inconsistent with the explained-variance curve")

    cumulative = manifest["cumulativeExplainedVariance"]
    args.output.mkdir(parents=True, exist_ok=True)
    records = []
    previous = 0.0
    for index in range(EXPOSED_COMPONENTS):
        explained = float(cumulative[index] - previous)
        previous = float(cumulative[index])
        eigenvalue = explained * total_variance
        if eigenvalue <= 0:
            raise RuntimeError(f"Component {index + 1} has a non-positive eigenvalue")

        vector = components[index]
        amplitude = float(np.max(np.abs(vector))) or 1.0
        thumbnail = 0.5 + 0.5 * vector.reshape(SIZE, SIZE) / amplitude
        thumbnail_path = args.output / f"pc-{index + 1:02d}.png"
        vector_path = args.output / f"pc-{index + 1:02d}.f32"
        save_gray(thumbnail_path, thumbnail)
        records.append(
            {
                "index": index + 1,
                "eigenvalue": eigenvalue,
                "explainedVariance": explained,
                "baselineWeight": float(weights[index]),
                "baselineZ": float(weights[index] / math.sqrt(eigenvalue)),
                "vector": f"/eigenfaces/{vector_path.name}",
                "vectorSha256": write_float32(vector_path, vector),
                "thumbnail": f"/eigenfaces/{thumbnail_path.name}",
            }
        )

    manifest["components"] = records
    manifest["exposedComponentCount"] = EXPOSED_COMPONENTS
    args.manifest.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Wrote {EXPOSED_COMPONENTS} component records and browser assets")


if __name__ == "__main__":
    main()
