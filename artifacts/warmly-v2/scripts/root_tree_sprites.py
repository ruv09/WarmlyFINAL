#!/usr/bin/env python3
"""Strip the circular grass island from painted tree sprites.

Catalog keeps the original painted/ assets. Grove scenes use rooted/
copies so the trunk sits in the painted meadow instead of on a sticker mound.
"""

from __future__ import annotations

import glob
import os
from typing import List, Tuple

from PIL import Image

SRC = os.path.join(os.path.dirname(__file__), "..", "assets", "trees", "painted")
DST = os.path.join(os.path.dirname(__file__), "..", "assets", "trees", "rooted")

Row = Tuple[int, int, int, int, float, float]


def row_stats(im: Image.Image) -> List[Row]:
    w, h = im.size
    px = im.load()
    rows: List[Row] = []
    for y in range(h):
        xs = [x for x in range(w) if px[x, y][3] > 40]
        if not xs:
            rows.append((0, w // 2, w // 2, 0, 0.0, w / 2))
            continue
        span = xs[-1] - xs[0] + 1
        count = len(xs)
        dens = count / span if span else 0.0
        cx = (xs[0] + xs[-1]) / 2
        rows.append((span, xs[0], xs[-1], count, dens, cx))
    return rows


def find_island(rows: List[Row], w: int, h: int) -> Tuple[int, int]:
    last = max(i for i, r in enumerate(rows) if r[0] > 0)
    y = last
    # Skip the feathered tip of the mound, then walk up through solid ground.
    while y > int(h * 0.55) and not (rows[y][0] >= w * 0.28 and rows[y][4] >= 0.78):
        y -= 1
    island_top = y
    while y > int(h * 0.55):
        span, _x0, _x1, _count, dens, _cx = rows[y]
        if span >= w * 0.22 and dens >= 0.78:
            island_top = y
            y -= 1
            continue
        break
    return island_top, last


def trunk_geometry(rows: List[Row], island_top: int, w: int) -> Tuple[float, float]:
    start = max(0, island_top - 40)
    candidates = []
    for y in range(start, island_top):
        span, x0, x1, _count, _dens, cx = rows[y]
        if 6 < span < w * 0.28:
            candidates.append((span, cx, x0, x1))
    if candidates:
        span, cx, _x0, _x1 = min(candidates, key=lambda t: t[0])
        return cx, max(span / 2, 7.0)
    span, x0, x1, _count, _dens, cx = rows[island_top]
    return cx, max(w * 0.04, 8.0)


def is_bark(r: int, g: int, b: int, a: int) -> bool:
    if a < 40:
        return False
    mx, mn = max(r, g, b), min(r, g, b)
    if mx > 140 and (mx - mn) < 45:
        return True
    if r > g + 8 and g > b - 10 and r > 40:
        return True
    if mx < 80 and r >= g and a > 80:
        return True
    return False


def grade(r: int, g: int, b: int, _dark: bool) -> Tuple[int, int, int]:
    # Keep original paint; dark sprites already carry fairy lights.
    return r, g, b


def process(path: str, dest: str) -> None:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    rows = row_stats(im)
    island_top, last = find_island(rows, w, h)
    cx, half = trunk_geometry(rows, island_top, w)
    # Keep a short root tuft so the trunk meets painted grass — not the whole mound.
    root_end = min(last, island_top + max(14, int((last - island_top) * 0.22)))
    dark = "-dark" in os.path.basename(path)
    out = im.copy()
    opx = out.load()

    for y in range(island_top, h):
        if y > root_end:
            for x in range(w):
                r, g, b, a = px[x, y]
                if a:
                    opx[x, y] = (r, g, b, 0)
            continue
        t = (y - island_top) / max(1, root_end - island_top)
        flare = 1.0 + 0.22 * min(t, 0.4) / 0.4
        fade = 1.0 if t <= 0.45 else max(0.0, 1.0 - (t - 0.45) / 0.55)
        keep_half = half * flare
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            dist = abs(x - cx)
            bark = is_bark(r, g, b, a)
            limit = keep_half * (1.25 if bark else 1.0)
            if dist <= limit:
                edge = 1.0
                inner = keep_half * 0.7
                if dist > inner:
                    edge = max(0.0, 1.0 - (dist - inner) / max(1.0, limit - inner))
                nr, ng, nb = grade(r, g, b, dark)
                opx[x, y] = (nr, ng, nb, int(a * fade * edge))
            else:
                opx[x, y] = (r, g, b, 0)

    for y in range(island_top):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            nr, ng, nb = grade(r, g, b, dark)
            opx[x, y] = (nr, ng, nb, a)

    bbox = out.getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        x0 = max(0, x0 - 4)
        y0 = max(0, y0 - 4)
        x1 = min(w, x1 + 4)
        y1 = min(h, y1 + 8)
        out = out.crop((x0, y0, x1, y1))

    cw, ch = out.size
    side = max(cw, ch)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(out, ((side - cw) // 2, side - ch), out)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    square.save(dest, "PNG")
    print(f"{os.path.basename(path):18s} island_y={island_top:3d}/{h} -> {square.size}")


def main() -> None:
    os.makedirs(DST, exist_ok=True)
    for path in sorted(glob.glob(os.path.join(SRC, "*.png"))):
        dest = os.path.join(DST, os.path.basename(path))
        process(path, dest)


if __name__ == "__main__":
    main()
