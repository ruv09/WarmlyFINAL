/**
 * Готовит иллюстрированные PNG деревьев:
 * — убирает кремовый/белый фон → прозрачность
 * — кладёт в assets/forest/trees/{species}/{species}_0N.png
 * — делает *_dark.png со светлячками
 *
 * Источники: /opt/cursor/artifacts/assets/warmly-*-src.png (и oak-ref)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_ROOT = path.join(__dirname, "../assets/forest/trees");
/** Исходники иллюстраций (локально или из /opt/cursor/artifacts/assets). */
const SRC_DIR = process.env.WARMLY_TREE_SRC
  || (fs.existsSync(path.join(__dirname, "../assets/forest/sources"))
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

function isBackground(r, g, b, a) {
  if (a < 8) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const sat = max === 0 ? 0 : (max - min) / max;
  // Кремовый / молочный фон референсов
  if (lum > 210 && sat < 0.18) return true;
  if (lum > 195 && sat < 0.12) return true;
  if (r > 220 && g > 210 && b > 190 && sat < 0.22) return true;
  // Почти белый
  if (r > 235 && g > 235 && b > 230) return true;
  return false;
}

function edgeFade(r, g, b, a) {
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  if (lum > 185 && sat < 0.28) {
    const t = Math.min(1, (lum - 185) / 55);
    return Math.round(a * (1 - t * 0.85));
  }
  return a;
}

async function removeBackground(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.from(data);

  for (let i = 0; i < width * height; i++) {
    const o = i * channels;
    const r = out[o];
    const g = out[o + 1];
    const b = out[o + 2];
    let a = out[o + 3];
    if (isBackground(r, g, b, a)) {
      out[o + 3] = 0;
    } else {
      out[o + 3] = edgeFade(r, g, b, a);
    }
  }

  // Trim transparent margins, then pad into square canvas
  const trimmed = await sharp(out, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 8 })
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
    const x = 140 + (s % 480);
    const y = 80 + ((s >> 8) % 420);
    const r = 3 + (i % 3);
    dots.push(`
      <circle cx="${x}" cy="${y}" r="${r * 2.2}" fill="#E8B975" opacity="0.18"/>
      <circle cx="${x}" cy="${y}" r="${r}" fill="#FFF6E0" opacity="0.92"/>`);
  }
  return `<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <ellipse cx="384" cy="720" rx="160" ry="36" fill="#E8B975" opacity="0.16"/>
  ${dots.join("\n")}
</svg>`;
}

async function makeDark(lightPng, seed) {
  // Чуть глубже цвета + светлячки / тёплое свечение у основания
  const deepened = await sharp(lightPng)
    .modulate({ brightness: 0.88, saturation: 1.08 })
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

async function mirrorVariant(lightPng) {
  return sharp(lightPng).flop().png().toBuffer();
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
    const lightPath = path.join(dir, lightName);
    const darkPath = path.join(dir, darkName);
    await sharp(light).png({ compressionLevel: 9 }).toFile(lightPath);
    await sharp(await makeDark(light, entry.variant + species.length))
      .png({ compressionLevel: 9 })
      .toFile(darkPath);
    console.log("wrote", path.relative(OUT_ROOT, lightPath), path.relative(OUT_ROOT, darkPath));
    produced.push(light);
  }

  // Второй вариант зеркалом, если есть только один исходник
  if (produced.length === 1) {
    const flipped = await mirrorVariant(produced[0]);
    const lightName = `${species}_02.png`;
    const darkName = `${species}_02_dark.png`;
    await sharp(flipped).png({ compressionLevel: 9 }).toFile(path.join(dir, lightName));
    await sharp(await makeDark(flipped, 20 + species.length))
      .png({ compressionLevel: 9 })
      .toFile(path.join(dir, darkName));
    console.log("wrote mirror", species, "_02");
  }
}

console.log("ok", OUT_ROOT);
