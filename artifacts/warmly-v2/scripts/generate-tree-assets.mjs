/**
 * PNG деревьев Warmly — вид в фас, как на концептах 1/2/4/5.
 * Светлые: мягкий минимализм + природный уют.
 * Тёмные (*-dark.png): сказочный лес / тёплый вечер с огоньками.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../assets/trees");
const SIZE = 768;

fs.mkdirSync(OUT, { recursive: true });

function doc(body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 100 120">
${body}
</svg>`;
}

function ground(isDark) {
  const g = isDark ? "#3A4A38" : "#B8C89A";
  const gd = isDark ? "#2A3828" : "#8FA872";
  return `
  <ellipse cx="50" cy="112" rx="28" ry="4" fill="#000" opacity="${isDark ? 0.25 : 0.1}"/>
  ${isDark ? `<ellipse cx="50" cy="108" rx="32" ry="12" fill="#E8B975" opacity="0.22"/>` : `<ellipse cx="50" cy="108" rx="30" ry="10" fill="#FFE9B8" opacity="0.28"/>`}
  <ellipse cx="50" cy="110" rx="26" ry="5.5" fill="${g}"/>
  <ellipse cx="40" cy="109" rx="8" ry="3" fill="${gd}" opacity="0.5"/>
  <ellipse cx="62" cy="110" rx="7" ry="2.5" fill="${gd}" opacity="0.4"/>
  ${isDark ? "" : `<circle cx="34" cy="108.5" r="1" fill="#E8C878"/><circle cx="68" cy="108.5" r="0.9" fill="#F4EDE4"/>`}`;
}

function lights(seed = 1) {
  const pts = [];
  let s = seed * 9973;
  for (let i = 0; i < 8; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const x = 22 + (s % 56);
    const y = 18 + ((s >> 7) % 58);
    pts.push(`
      <circle cx="${x}" cy="${y}" r="2.8" fill="#E8B975" opacity="0.22"/>
      <circle cx="${x}" cy="${y}" r="1.15" fill="#FFF6E0" opacity="0.95"/>`);
  }
  pts.push(`
    <circle cx="38" cy="104" r="2.4" fill="#E8B975" opacity="0.25"/>
    <circle cx="38" cy="104" r="1" fill="#FFF6E0"/>
    <circle cx="62" cy="105" r="2.2" fill="#E8B975" opacity="0.22"/>
    <circle cx="62" cy="105" r="0.95" fill="#FFF6E0"/>`);
  return pts.join("\n");
}

function trunk(x, y, w, h, color, roots = true) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.35}" fill="${color}"/>`;
  if (roots) {
    s += `<path d="M${x} ${y + h - 2} Q${x - 6} ${y + h + 2} ${x - 10} ${y + h + 3}" stroke="${color}" stroke-width="${w * 0.45}" stroke-linecap="round" fill="none" opacity="0.75"/>`;
    s += `<path d="M${x + w} ${y + h - 2} Q${x + w + 6} ${y + h + 2} ${x + w + 10} ${y + h + 3}" stroke="${color}" stroke-width="${w * 0.45}" stroke-linecap="round" fill="none" opacity="0.75"/>`;
  }
  return s;
}

/** Мягкие комки кроны — главный приём концептов 1 и 2. */
function clumps(parts, mid, hi, sh) {
  return parts
    .map(
      ([cx, cy, r, kind]) => {
        const fill = kind === "hi" ? hi : kind === "sh" ? sh : mid;
        const op = kind === "sh" ? 0.55 : kind === "hi" ? 0.5 : 0.95;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${op}"/>`;
      },
    )
    .join("\n");
}

const species = {
  oak: (d) => {
    const mid = d ? "#4E6848" : "#7FA06F";
    const hi = d ? "#7A9A70" : "#A8C89A";
    const sh = d ? "#334232" : "#5D7D5A";
    const tr = d ? "#5A4030" : "#8B5A3C";
    return doc(`
      ${ground(d)}
      ${trunk(46, 62, 8, 44, tr)}
      ${clumps(
        [
          [30, 52, 18, "sh"],
          [70, 50, 17, "sh"],
          [34, 46, 18, "mid"],
          [66, 44, 17, "mid"],
          [50, 28, 20, "mid"],
          [42, 48, 14, "mid"],
          [58, 46, 13, "mid"],
          [40, 32, 9, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      ${d ? lights(1) : ""}
    `);
  },

  birch: (d) => {
    const mid = d ? "#6A7A58" : "#B5D0A0";
    const hi = d ? "#9AAA74" : "#E0F0C8";
    const sh = d ? "#4A5840" : "#8FB87A";
    const tr = d ? "#E0D8CC" : "#F8F8F8";
    return doc(`
      ${ground(d)}
      ${trunk(47.5, 48, 5, 58, tr)}
      <rect x="48.5" y="58" width="1.2" height="6" rx="0.4" fill="#4A4038" opacity="0.35"/>
      <rect x="50.2" y="74" width="1.2" height="5" rx="0.4" fill="#4A4038" opacity="0.3"/>
      <rect x="48.8" y="90" width="1.1" height="5" rx="0.4" fill="#4A4038" opacity="0.28"/>
      ${clumps(
        [
          [50, 26, 14, "mid"],
          [39, 38, 12, "mid"],
          [61, 40, 12, "mid"],
          [50, 48, 12, "mid"],
          [44, 30, 7, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      ${d ? lights(2) : ""}
    `);
  },

  pine: (d) => {
    const mid = d ? "#3A5544" : "#5D7D5A";
    const hi = d ? "#5A7A64" : "#8FB996";
    const sh = d ? "#283C30" : "#3E5A3C";
    const tr = d ? "#6A4830" : "#A06740";
    return doc(`
      ${ground(d)}
      ${trunk(47.5, 64, 5, 42, tr, false)}
      <path d="M50 12 L64 38 L36 38 Z" fill="${sh}" opacity="0.55"/>
      <path d="M50 14 L62 38 L38 38 Z" fill="${mid}"/>
      <path d="M50 30 L68 58 L32 58 Z" fill="${hi}" opacity="0.85"/>
      <path d="M50 30 L66 58 L34 58 Z" fill="${mid}"/>
      <path d="M50 48 L72 80 L28 80 Z" fill="${sh}" opacity="0.9"/>
      <path d="M50 48 L70 80 L30 80 Z" fill="${mid}" opacity="0.95"/>
      <path d="M50 18 L56 32 L44 32 Z" fill="${hi}" opacity="0.45"/>
      ${d ? lights(3) : ""}
    `);
  },

  spruce: (d) => {
    const mid = d ? "#2A4234" : "#4A6A48";
    const hi = d ? "#4A6354" : "#6A8A64";
    const sh = d ? "#1A2C24" : "#2E4A30";
    const tr = d ? "#3E3228" : "#6A4A34";
    return doc(`
      ${ground(d)}
      ${trunk(47.5, 72, 5, 34, tr, false)}
      <path d="M50 10 L60 30 L40 30 Z" fill="${sh}" opacity="0.6"/>
      <path d="M50 12 L58 30 L42 30 Z" fill="${mid}"/>
      <path d="M50 24 L64 48 L36 48 Z" fill="${mid}"/>
      <path d="M50 40 L68 66 L32 66 Z" fill="${hi}" opacity="0.85"/>
      <path d="M50 40 L66 66 L34 66 Z" fill="${mid}"/>
      <path d="M50 56 L74 88 L26 88 Z" fill="${sh}" opacity="0.92"/>
      <path d="M50 56 L72 88 L28 88 Z" fill="${mid}" opacity="0.95"/>
      ${d ? lights(4) : ""}
    `);
  },

  maple: (d) => {
    const mid = d ? "#A06038" : "#E8A23D";
    const hi = d ? "#C88858" : "#F4C878";
    const sh = d ? "#6A4024" : "#C07828";
    const tr = d ? "#4A3828" : "#8B5A3C";
    return doc(`
      ${ground(d)}
      ${trunk(46.5, 60, 7, 46, tr)}
      <path d="M50 16 C64 20 78 34 74 48 C82 52 76 64 64 66 C60 78 40 78 36 66 C22 64 18 50 26 44 C20 30 36 14 50 16 Z" fill="${sh}" opacity="0.45"/>
      <path d="M50 18 C62 22 74 34 72 46 C78 50 74 60 64 62 C60 72 40 72 36 62 C24 60 22 48 28 42 C24 30 38 16 50 18 Z" fill="${mid}"/>
      <circle cx="38" cy="40" r="11" fill="${hi}" opacity="0.4"/>
      <circle cx="60" cy="44" r="10" fill="${sh}" opacity="0.3"/>
      ${d ? lights(5) : ""}
    `);
  },

  linden: (d) => {
    const mid = d ? "#5A7A48" : "#8FB996";
    const hi = d ? "#88A868" : "#C5E0B8";
    const sh = d ? "#3E5432" : "#5D7D5A";
    const tr = d ? "#5A4634" : "#8B5A3C";
    return doc(`
      ${ground(d)}
      ${trunk(46.5, 60, 7, 46, tr)}
      <circle cx="50" cy="42" r="30" fill="${sh}" opacity="0.25"/>
      <circle cx="50" cy="40" r="28" fill="${mid}"/>
      <circle cx="50" cy="38" r="22" fill="${mid}" opacity="0.55"/>
      <ellipse cx="40" cy="32" rx="11" ry="8" fill="${hi}" opacity="0.45"/>
      ${d ? lights(6) : ""}
    `);
  },

  cherry: (d) => {
    const mid = d ? "#8A5A6A" : "#F4B3C2";
    const hi = d ? "#B88898" : "#FFE0E8";
    const sh = d ? "#5A3E4C" : "#E090A8";
    const tr = d ? "#3E3228" : "#8B5A3C";
    return doc(`
      ${ground(d)}
      ${trunk(46.5, 58, 7, 48, tr)}
      ${clumps(
        [
          [30, 48, 16, "sh"],
          [70, 46, 15, "sh"],
          [34, 42, 16, "mid"],
          [66, 40, 15, "mid"],
          [50, 26, 17, "mid"],
          [44, 44, 12, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      <circle cx="28" cy="72" r="1.4" fill="${hi}" opacity="0.7"/>
      <circle cx="74" cy="68" r="1.2" fill="${hi}" opacity="0.65"/>
      <circle cx="34" cy="84" r="1.1" fill="${mid}" opacity="0.55"/>
      ${d ? lights(7) : ""}
    `);
  },

  apple: (d) => {
    const mid = d ? "#4E6848" : "#7FA06F";
    const hi = d ? "#7A9A6C" : "#A8C89A";
    const sh = d ? "#364832" : "#5D7D5A";
    const tr = d ? "#4A3828" : "#8B5A3C";
    const fruit = d ? "#E88870" : "#D4544A";
    return doc(`
      ${ground(d)}
      ${trunk(46.5, 60, 7, 46, tr)}
      ${clumps(
        [
          [34, 48, 16, "mid"],
          [66, 46, 15, "mid"],
          [50, 30, 17, "mid"],
          [50, 46, 12, "mid"],
          [40, 34, 8, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      <circle cx="38" cy="44" r="2.2" fill="${fruit}"/>
      <circle cx="56" cy="36" r="2.2" fill="${fruit}"/>
      <circle cx="64" cy="50" r="2" fill="${fruit}"/>
      <circle cx="46" cy="52" r="2" fill="${fruit}"/>
      ${d ? lights(8) : ""}
    `);
  },

  bush: (d) => {
    const mid = d ? "#4E6848" : "#7FA06F";
    const hi = d ? "#7A9A6C" : "#A8C89A";
    const sh = d ? "#364832" : "#5D7D5A";
    return doc(`
      ${ground(d)}
      ${clumps(
        [
          [32, 78, 16, "sh"],
          [68, 78, 16, "sh"],
          [36, 72, 16, "mid"],
          [64, 72, 16, "mid"],
          [50, 64, 18, "mid"],
          [50, 76, 13, "mid"],
          [42, 66, 8, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      ${d ? lights(9) : ""}
    `);
  },

  willow: (d) => {
    const mid = d ? "#5A6A50" : "#8FB996";
    const hi = d ? "#849A74" : "#C5E0B8";
    const sh = d ? "#3E4A38" : "#5D7D5A";
    const tr = d ? "#5A4634" : "#8B5A3C";
    return doc(`
      ${ground(d)}
      ${trunk(46.5, 48, 7, 58, tr)}
      <circle cx="50" cy="28" r="16" fill="${mid}"/>
      <ellipse cx="28" cy="58" rx="10" ry="30" fill="${mid}" opacity="0.8"/>
      <ellipse cx="72" cy="60" rx="10" ry="32" fill="${mid}" opacity="0.8"/>
      <ellipse cx="38" cy="68" rx="8" ry="28" fill="${sh}" opacity="0.5"/>
      <ellipse cx="62" cy="70" rx="8" ry="30" fill="${sh}" opacity="0.45"/>
      <ellipse cx="50" cy="74" rx="7" ry="28" fill="${mid}" opacity="0.65"/>
      <ellipse cx="44" cy="24" rx="8" ry="6" fill="${hi}" opacity="0.4"/>
      ${d ? lights(10) : ""}
    `);
  },

  rowan: (d) => {
    const mid = d ? "#4E6448" : "#7FA06F";
    const hi = d ? "#7A8E68" : "#A8C89A";
    const sh = d ? "#364432" : "#5D7D5A";
    const tr = d ? "#5A4634" : "#8B5A3C";
    const berry = d ? "#E87858" : "#D4544A";
    return doc(`
      ${ground(d)}
      ${trunk(46.5, 58, 7, 48, tr)}
      ${clumps(
        [
          [34, 46, 14, "mid"],
          [66, 44, 13, "mid"],
          [50, 30, 15, "mid"],
          [50, 46, 11, "mid"],
          [40, 34, 7, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      <circle cx="40" cy="48" r="2.1" fill="${berry}"/>
      <circle cx="44" cy="52" r="1.8" fill="${berry}"/>
      <circle cx="58" cy="40" r="2" fill="${berry}"/>
      <circle cx="62" cy="46" r="1.8" fill="${berry}"/>
      <circle cx="50" cy="50" r="1.9" fill="${berry}"/>
      ${d ? lights(11) : ""}
    `);
  },
};

for (const [name, build] of Object.entries(species)) {
  for (const dark of [false, true]) {
    const file = dark ? `${name}-dark.png` : `${name}.png`;
    const out = path.join(OUT, file);
    await sharp(Buffer.from(build(dark)))
      .resize(SIZE, SIZE)
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log(file, `${(fs.statSync(out).size / 1024).toFixed(1)}KB`);
  }
}
console.log("ok", OUT);
