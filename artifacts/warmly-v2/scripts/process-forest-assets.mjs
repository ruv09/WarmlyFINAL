/**
 * Готовит иллюстрированные PNG деревьев:
 * — убирает кремовый/белый/чёрный фон → прозрачность
 * — кладёт в assets/forest/trees/{species}/{species}_0N.png
 * — делает *_dark.png со светлячками
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_ROOT = path.join(__dirname, "../assets/forest/trees");
const SRC_DIR =
  process.env.WARMLY_TREE_SRC ||
  (fs.existsSync(path.join(__dirname, "../assets/forest/sources"))
    ? path.join(__dirname, "../assets/forest/sources")
    : "/opt/cursor/artifacts/assets");
const SIZE = 640;

/** @type {Record<string, { file: string; variant: number }[]>} */
const SOURCES = {
  oak: [
    { file: "warmly-oak-ref.png", variant: 1 },
    { file: "warmly-oak-v2-src.png", variant: 2 },
  ],
  birch: [{ file: "warmly-birch-src.png", variant: 1 }],
  pine: [{ file: "warmly-pine-src.png", variant: 1 }],
  spruce: [{ file: "warmly-spruce-src.png", variant: 1 }],
  maple: [{ file: "warmly-maple-src.png", variant: 1 }],
  linden: [{ file: "warmly-linden-src.png", variant: 1 }],
  sakura: [{ file: "warmly-sakura-src.png", variant: 1 }],
  apple: [{ file: "warmly-apple-src.png", variant: 1 }],
  bush: [{ file: "warmly-bush-src.png", variant: 1 }],
  willow: [{ file: "warmly-willow-src.png", variant: 1 }],
  rowan: [{ file: "warmly-rowan-src.png", variant: 1 }],
};

function sampleCorners(data, w, h, ch) {
  const pts = [
    [2, 2],
    [w - 3, 2],
    [2, h - 3],
    [w - 3, h - 3],
    [(w / 2) | 0, 2],
    [2, (h / 2) | 0],
  ];
  return pts.map(([x, y]) => {
    const o = (y * w + x) * ch;
    return [data[o], data[o + 1], data[o + 2]];
  });
}

function colorDist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

async function removeBackground(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;
  const out = Buffer.from(data);
  const corners = sampleCorners(data, w, h, ch);
  const bg = corners[0];
  const bgLum = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2];

  for (let i = 0; i < w * h; i++) {
    const o = i * ch;
    const r = out[o];
    const g = out[o + 1];
    const b = out[o + 2];
    const a = out[o + 3];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    let kill = false;

    if (colorDist([r, g, b], bg) < 28) kill = true;
    if (bgLum < 40) {
      if (lum < 28 && sat < 0.25) kill = true;
      if (lum < 45 && sat < 0.12) kill = true;
    } else {
      if (lum > 205 && sat < 0.2) kill = true;
      if (lum > 190 && sat < 0.12) kill = true;
      if (r > 220 && g > 210 && b > 190 && sat < 0.25) kill = true;
    }

    if (kill) {
      out[o + 3] = 0;
    } else if (bgLum >= 40 && lum > 180 && sat < 0.3) {
      const t = Math.min(1, (lum - 180) / 60);
      out[o + 3] = Math.round(a * (1 - t * 0.85));
    } else if (bgLum < 40 && lum < 55 && sat < 0.2) {
      const t = Math.min(1, (55 - lum) / 40);
      out[o + 3] = Math.round(a * (1 - t * 0.9));
    }
  }

  const trimmed = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .trim({ threshold: 10 })
    .png()
    .toBuffer();

  const meta = await sharp(trimmed).metadata();
  const tw = meta.width ?? SIZE;
  const th = meta.height ?? SIZE;
  const scale = Math.min((SIZE * 0.9) / tw, (SIZE * 0.92) / th);
  const nw = Math.max(1, Math.round(tw * scale));
  const nh = Math.max(1, Math.round(th * scale));
  const left = Math.floor((SIZE - nw) / 2);
  const top = Math.floor(SIZE - nh - SIZE * 0.04);

  return sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: await sharp(trimmed).resize(nw, nh, { fit: "fill" }).png().toBuffer(),
        left,
        top,
      },
    ])
    .png()
    .toBuffer();
}

function fireflySvg(seed) {
  let s = seed * 9973;
  const dots = [];
  for (let i = 0; i < 10; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const x = 120 + (s % 400);
    const y = 70 + ((s >> 8) % 360);
    const r = 3 + (i % 3);
    dots.push(`
      <circle cx="${x}" cy="${y}" r="${r * 2.2}" fill="#E8B975" opacity="0.18"/>
      <circle cx="${x}" cy="${y}" r="${r}" fill="#FFF6E0" opacity="0.92"/>`);
  }
  return `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <ellipse cx="320" cy="600" rx="130" ry="30" fill="#E8B975" opacity="0.16"/>
  ${dots.join("\n")}
</svg>`;
}

async function makeDark(lightPng, seed) {
  const deepened = await sharp(lightPng)
    .modulate({ brightness: 0.9, saturation: 1.06 })
    .png()
    .toBuffer();
  const lights = await sharp(Buffer.from(fireflySvg(seed))).png().toBuffer();
  return sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: deepened, left: 0, top: 0 },
      { input: lights, left: 0, top: 0, blend: "over" },
    ])
    .png()
    .toBuffer();
}

fs.mkdirSync(OUT_ROOT, { recursive: true });

for (const [species, entries] of Object.entries(SOURCES)) {
  const dir = path.join(OUT_ROOT, species);
  fs.mkdirSync(dir, { recursive: true });
  const produced = [];

  for (const entry of entries) {
    const src = path.join(SRC_DIR, entry.file);
    if (!fs.existsSync(src)) {
      console.warn("missing", src);
      continue;
    }
    const light = await removeBackground(src);
    const lightName = `${species}_${String(entry.variant).padStart(2, "0")}.png`;
    const darkName = `${species}_${String(entry.variant).padStart(2, "0")}_dark.png`;
    await sharp(light).png({ compressionLevel: 9 }).toFile(path.join(dir, lightName));
    await sharp(await makeDark(light, entry.variant + species.length))
      .png({ compressionLevel: 9 })
      .toFile(path.join(dir, darkName));
    console.log("wrote", species, lightName);
    produced.push(light);
  }

  if (produced.length === 1) {
    const flipped = await sharp(produced[0]).flop().png().toBuffer();
    await sharp(flipped).png({ compressionLevel: 9 }).toFile(path.join(dir, `${species}_02.png`));
    await sharp(await makeDark(flipped, 30 + species.length))
      .png({ compressionLevel: 9 })
      .toFile(path.join(dir, `${species}_02_dark.png`));
    console.log("wrote mirror", species, "_02");
  }
}

console.log("ok", OUT_ROOT);
