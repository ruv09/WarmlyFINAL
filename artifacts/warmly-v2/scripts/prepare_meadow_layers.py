#!/usr/bin/env python3
"""Chroma-key magenta tree sprites and compress meadow backgrounds."""

from __future__ import annotations

import glob
import os

import numpy as np
from PIL import Image

SRC = "/opt/cursor/artifacts/assets"
DAY_DST = os.path.join(os.path.dirname(__file__), "..", "assets", "trees", "day")
NIGHT_DST = os.path.join(os.path.dirname(__file__), "..", "assets", "trees", "night")
MEADOW_DST = os.path.join(os.path.dirname(__file__), "..", "assets", "forest", "meadows")

SPECIES = [
    "oak",
    "birch",
    "pine",
    "spruce",
    "maple",
    "linden",
    "sakura",
    "apple",
    "bush",
    "willow",
    "rowan",
]


def key_magenta(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    arr = np.asarray(im).astype(np.float32)
    rgb = arr[:, :, :3]
    corners = np.stack(
        [rgb[2, 2], rgb[2, -3], rgb[-3, 2], rgb[-3, -3]],
        axis=0,
    )
    key = corners.mean(axis=0)
    dist = np.sqrt(((rgb - key) ** 2).sum(axis=2))
    mag = (rgb[:, :, 0] + rgb[:, :, 2]) / 2
    g = rgb[:, :, 1]
    score = mag - g
    alpha = arr[:, :, 3].copy()
    kill = (dist < 48) | ((score > 110) & (g < 85))
    fade = (~kill) & (score > 58) & (g < 140)
    t = np.clip((score - 58) / 70, 0, 1)
    alpha[kill] = 0
    alpha[fade] = alpha[fade] * (1 - t[fade])
    spill = np.maximum(0, np.minimum(rgb[:, :, 0], rgb[:, :, 2]) - g)
    edge = fade | ((spill > 40) & (g < 90) & (~kill))
    rgb = rgb.copy()
    rgb[:, :, 0][edge] = np.clip(rgb[:, :, 0][edge] - spill[edge] * 0.6, 0, 255)
    rgb[:, :, 2][edge] = np.clip(rgb[:, :, 2][edge] - spill[edge] * 0.6, 0, 255)
    out = np.dstack([rgb, alpha]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def plant_square(im: Image.Image, side: int = 640) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    x0, y0, x1, y1 = bbox
    cropped = im.crop((max(0, x0 - 4), max(0, y0 - 4), x1 + 4, y1 + 8))
    cw, ch = cropped.size
    canvas = Image.new("RGBA", (max(cw, ch), max(cw, ch)), (0, 0, 0, 0))
    canvas.paste(cropped, ((canvas.size[0] - cw) // 2, canvas.size[1] - ch), cropped)
    return canvas.resize((side, side), Image.Resampling.LANCZOS)


def process_tree(name: str, kind: str) -> None:
    src = os.path.join(SRC, f"{name}-{kind}.png")
    dest_dir = DAY_DST if kind == "day" else NIGHT_DST
    os.makedirs(dest_dir, exist_ok=True)
    keyed = key_magenta(Image.open(src))
    planted = plant_square(keyed)
    dest = os.path.join(dest_dir, f"{name}.png")
    planted.save(dest, "PNG", optimize=True)
    print(f"{kind:5s} {name:8s} {planted.size} -> {os.path.getsize(dest)//1024}kb")


def compress_meadows() -> None:
    os.makedirs(MEADOW_DST, exist_ok=True)
    for path in glob.glob(os.path.join(MEADOW_DST, "meadow-*.png")):
        im = Image.open(path).convert("RGB")
        dest = path.replace(".png", ".jpg")
        im.save(dest, "JPEG", quality=84, optimize=True)
        os.remove(path)
        print(f"meadow {os.path.basename(dest)} {im.size} {os.path.getsize(dest)//1024}kb")


def main() -> None:
    for name in SPECIES:
        process_tree(name, "day")
        process_tree(name, "night")
    compress_meadows()


if __name__ == "__main__":
    main()
