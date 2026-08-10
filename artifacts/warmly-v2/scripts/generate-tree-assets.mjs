/**
 * PNG деревьев Warmly — как на концепт-бордах:
 * светлая 1 «Минимализм» + 2 «Природный уют»;
 * тёмная 4 «Сказочный лес» + 5 «Тёплый вечер».
 * Вид строго в фас; без стадий роста.
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
  <defs>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.35"/>
    </filter>
  </defs>
${body}
</svg>`;
}

/** Только мягкая тень — без «горшка»/кольца, как на референсе. */
function ground(isDark) {
  if (isDark) {
    return `
    <ellipse cx="50" cy="112" rx="30" ry="4.5" fill="#000" opacity="0.35"/>
    <ellipse cx="50" cy="110" rx="22" ry="3.2" fill="#E8B975" opacity="0.12"/>`;
  }
  return `
    <ellipse cx="50" cy="112" rx="28" ry="4" fill="#000" opacity="0.08"/>
    <ellipse cx="50" cy="110.5" rx="20" ry="3" fill="#C8D2AE" opacity="0.55"/>`;
}

function lights(seed = 1) {
  const pts = [];
  let s = seed * 9973;
  for (let i = 0; i < 12; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const x = 18 + (s % 64);
    const y = 14 + ((s >> 7) % 62);
    const glow = 2.2 + (i % 3) * 0.4;
    pts.push(`
      <circle cx="${x}" cy="${y}" r="${glow}" fill="#E8B975" opacity="0.28"/>
      <circle cx="${x}" cy="${y}" r="1.05" fill="#FFF8E8" opacity="0.98"/>`);
  }
  return pts.join("\n");
}

function trunk(x, y, w, h, color) {
  const rx = Math.min(w * 0.45, 3.2);
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${color}"/>
    <path d="M${x + 0.5} ${y + h - 1.5} Q${x - 5} ${y + h + 2.5} ${x - 9} ${y + h + 3.5}"
      stroke="${color}" stroke-width="${w * 0.42}" stroke-linecap="round" fill="none" opacity="0.7"/>
    <path d="M${x + w - 0.5} ${y + h - 1.5} Q${x + w + 5} ${y + h + 2.5} ${x + w + 9} ${y + h + 3.5}"
      stroke="${color}" stroke-width="${w * 0.42}" stroke-linecap="round" fill="none" opacity="0.7"/>`;
}

/**
 * Крона из мягких овалов — главный приём концептов 1 и 2.
 * parts: [cx, cy, rx, ry, kind]
 */
function canopy(parts, mid, hi, sh) {
  return parts
    .map(([cx, cy, rx, ry, kind]) => {
      const fill = kind === "hi" ? hi : kind === "sh" ? sh : mid;
      const op = kind === "sh" ? 0.62 : kind === "hi" ? 0.55 : 0.96;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${op}"/>`;
    })
    .join("\n");
}

const species = {
  // Концепт 1: крупные мягкие комки, sage
  oak: (d) => {
    const mid = d ? "#4A6444" : "#8AAD7A";
    const hi = d ? "#6E8E68" : "#B4D0A4";
    const sh = d ? "#2E3E2C" : "#5E7A54";
    const tr = d ? "#5A4030" : "#9A6A48";
    return doc(`
      ${ground(d)}
      ${trunk(45.5, 58, 9, 48, tr)}
      ${canopy(
        [
          [28, 54, 20, 17, "sh"],
          [72, 52, 19, 16, "sh"],
          [32, 46, 20, 18, "mid"],
          [68, 44, 19, 17, "mid"],
          [50, 26, 24, 22, "mid"],
          [42, 48, 16, 14, "mid"],
          [58, 46, 15, 13, "mid"],
          [38, 30, 10, 8, "hi"],
          [56, 28, 9, 7, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      ${d ? lights(1) : ""}
    `);
  },

  birch: (d) => {
    const mid = d ? "#6A7E58" : "#C2DCB0";
    const hi = d ? "#96AA78" : "#E8F4D4";
    const sh = d ? "#465640" : "#9CC488";
    const tr = d ? "#E8E0D4" : "#FAFAF8";
    return doc(`
      ${ground(d)}
      ${trunk(47.2, 46, 5.6, 60, tr)}
      <rect x="48.4" y="56" width="1.3" height="7" rx="0.4" fill="#5A4A40" opacity="0.32"/>
      <rect x="50" y="74" width="1.3" height="6" rx="0.4" fill="#5A4A40" opacity="0.28"/>
      <rect x="48.6" y="92" width="1.2" height="5" rx="0.4" fill="#5A4A40" opacity="0.25"/>
      ${canopy(
        [
          [50, 24, 16, 14, "mid"],
          [36, 36, 14, 12, "mid"],
          [64, 38, 14, 12, "mid"],
          [50, 46, 14, 12, "mid"],
          [42, 28, 8, 6, "hi"],
          [58, 32, 7, 5, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      ${d ? lights(2) : ""}
    `);
  },

  pine: (d) => {
    const mid = d ? "#355244" : "#5F8A68";
    const hi = d ? "#567A64" : "#8FBC96";
    const sh = d ? "#24382C" : "#3E5E42";
    const tr = d ? "#6A4830" : "#A86E48";
    return doc(`
      ${ground(d)}
      ${trunk(47.5, 70, 5, 36, tr)}
      <path d="M50 10 L66 40 L34 40 Z" fill="${sh}" opacity="0.55"/>
      <path d="M50 12 L63 40 L37 40 Z" fill="${mid}"/>
      <path d="M50 28 L72 60 L28 60 Z" fill="${hi}" opacity="0.8"/>
      <path d="M50 28 L69 60 L31 60 Z" fill="${mid}"/>
      <path d="M50 48 L78 86 L22 86 Z" fill="${sh}" opacity="0.9"/>
      <path d="M50 48 L75 86 L25 86 Z" fill="${mid}" opacity="0.96"/>
      <path d="M50 16 L57 32 L43 32 Z" fill="${hi}" opacity="0.5"/>
      ${d ? lights(3) : ""}
    `);
  },

  spruce: (d) => {
    const mid = d ? "#284034" : "#4A6E4C";
    const hi = d ? "#4A6554" : "#6E9270";
    const sh = d ? "#182C24" : "#2E4A32";
    const tr = d ? "#3E3228" : "#6E4E38";
    return doc(`
      ${ground(d)}
      ${trunk(47.5, 76, 5, 30, tr)}
      <path d="M50 8 L61 30 L39 30 Z" fill="${sh}" opacity="0.6"/>
      <path d="M50 10 L59 30 L41 30 Z" fill="${mid}"/>
      <path d="M50 22 L66 50 L34 50 Z" fill="${mid}"/>
      <path d="M50 40 L72 70 L28 70 Z" fill="${hi}" opacity="0.82"/>
      <path d="M50 40 L69 70 L31 70 Z" fill="${mid}"/>
      <path d="M50 58 L78 92 L22 92 Z" fill="${sh}" opacity="0.92"/>
      <path d="M50 58 L75 92 L25 92 Z" fill="${mid}" opacity="0.96"/>
      ${d ? lights(4) : ""}
    `);
  },

  // Концепт 1: пыльный персик / охра
  maple: (d) => {
    const mid = d ? "#A06038" : "#E8A86A";
    const hi = d ? "#C88858" : "#F6D0A0";
    const sh = d ? "#6A4024" : "#C07840";
    const tr = d ? "#4A3828" : "#8B5A3C";
    return doc(`
      ${ground(d)}
      ${trunk(46, 58, 8, 48, tr)}
      ${canopy(
        [
          [30, 52, 18, 16, "sh"],
          [70, 50, 17, 15, "sh"],
          [34, 44, 18, 17, "mid"],
          [66, 42, 17, 16, "mid"],
          [50, 24, 22, 20, "mid"],
          [44, 46, 14, 12, "mid"],
          [56, 44, 13, 11, "mid"],
          [40, 28, 9, 7, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      ${d ? lights(5) : ""}
    `);
  },

  linden: (d) => {
    const mid = d ? "#567848" : "#96C4A0";
    const hi = d ? "#84A868" : "#D0ECCC";
    const sh = d ? "#3A5230" : "#5E8A64";
    const tr = d ? "#5A4634" : "#8B5A3C";
    return doc(`
      ${ground(d)}
      ${trunk(46, 58, 8, 48, tr)}
      ${canopy(
        [
          [50, 42, 32, 30, "sh"],
          [50, 40, 30, 28, "mid"],
          [50, 36, 24, 22, "mid"],
          [38, 30, 12, 9, "hi"],
          [58, 34, 10, 8, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      ${d ? lights(6) : ""}
    `);
  },

  // Концепт 1: dusty rose
  cherry: (d) => {
    const mid = d ? "#8A5A6A" : "#E8A8B8";
    const hi = d ? "#B88898" : "#FFE4EC";
    const sh = d ? "#5A3E4C" : "#D08098";
    const tr = d ? "#3E3228" : "#8B5A3C";
    return doc(`
      ${ground(d)}
      ${trunk(46, 56, 8, 50, tr)}
      ${canopy(
        [
          [28, 50, 18, 16, "sh"],
          [72, 48, 17, 15, "sh"],
          [32, 42, 18, 17, "mid"],
          [68, 40, 17, 16, "mid"],
          [50, 24, 20, 18, "mid"],
          [44, 44, 13, 12, "hi"],
          [58, 38, 11, 9, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      <circle cx="26" cy="70" r="1.5" fill="${hi}" opacity="0.75"/>
      <circle cx="76" cy="66" r="1.3" fill="${hi}" opacity="0.7"/>
      <circle cx="32" cy="82" r="1.2" fill="${mid}" opacity="0.55"/>
      ${d ? lights(7) : ""}
    `);
  },

  apple: (d) => {
    const mid = d ? "#4E6848" : "#86B078";
    const hi = d ? "#7A9A6C" : "#B4D8A8";
    const sh = d ? "#364832" : "#5E8254";
    const tr = d ? "#4A3828" : "#8B5A3C";
    const fruit = d ? "#E88870" : "#E06058";
    return doc(`
      ${ground(d)}
      ${trunk(46, 58, 8, 48, tr)}
      ${canopy(
        [
          [32, 50, 18, 16, "mid"],
          [68, 48, 17, 15, "mid"],
          [50, 28, 20, 18, "mid"],
          [50, 48, 14, 12, "mid"],
          [38, 34, 9, 7, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      <circle cx="36" cy="44" r="2.4" fill="${fruit}"/>
      <circle cx="58" cy="34" r="2.4" fill="${fruit}"/>
      <circle cx="66" cy="50" r="2.2" fill="${fruit}"/>
      <circle cx="46" cy="54" r="2.1" fill="${fruit}"/>
      ${d ? lights(8) : ""}
    `);
  },

  bush: (d) => {
    const mid = d ? "#4E6848" : "#7FAA72";
    const hi = d ? "#7A9A6C" : "#B0D0A0";
    const sh = d ? "#364832" : "#5A7A52";
    return doc(`
      ${ground(d)}
      ${canopy(
        [
          [30, 82, 18, 14, "sh"],
          [70, 82, 18, 14, "sh"],
          [34, 74, 18, 15, "mid"],
          [66, 74, 18, 15, "mid"],
          [50, 64, 20, 17, "mid"],
          [50, 78, 15, 12, "mid"],
          [40, 66, 9, 7, "hi"],
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
    const hi = d ? "#849A74" : "#C8E8C0";
    const sh = d ? "#3E4A38" : "#5D7D5A";
    const tr = d ? "#5A4634" : "#8B5A3C";
    return doc(`
      ${ground(d)}
      ${trunk(46, 46, 8, 60, tr)}
      <ellipse cx="50" cy="26" rx="18" ry="16" fill="${mid}"/>
      <ellipse cx="26" cy="56" rx="11" ry="32" fill="${mid}" opacity="0.82"/>
      <ellipse cx="74" cy="58" rx="11" ry="34" fill="${mid}" opacity="0.82"/>
      <ellipse cx="36" cy="68" rx="9" ry="30" fill="${sh}" opacity="0.48"/>
      <ellipse cx="64" cy="70" rx="9" ry="32" fill="${sh}" opacity="0.44"/>
      <ellipse cx="50" cy="74" rx="8" ry="30" fill="${mid}" opacity="0.68"/>
      <ellipse cx="42" cy="22" rx="9" ry="7" fill="${hi}" opacity="0.45"/>
      ${d ? lights(10) : ""}
    `);
  },

  rowan: (d) => {
    const mid = d ? "#4E6448" : "#82A874";
    const hi = d ? "#7A8E68" : "#B4D0A4";
    const sh = d ? "#364432" : "#5A7A52";
    const tr = d ? "#5A4634" : "#8B5A3C";
    const berry = d ? "#E87858" : "#E05448";
    return doc(`
      ${ground(d)}
      ${trunk(46, 56, 8, 50, tr)}
      ${canopy(
        [
          [32, 48, 16, 14, "mid"],
          [68, 46, 15, 13, "mid"],
          [50, 28, 18, 16, "mid"],
          [50, 48, 13, 11, "mid"],
          [38, 32, 8, 6, "hi"],
        ],
        mid,
        hi,
        sh,
      )}
      <circle cx="38" cy="50" r="2.2" fill="${berry}"/>
      <circle cx="42" cy="54" r="1.9" fill="${berry}"/>
      <circle cx="58" cy="40" r="2.1" fill="${berry}"/>
      <circle cx="64" cy="48" r="1.9" fill="${berry}"/>
      <circle cx="50" cy="52" r="2" fill="${berry}"/>
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
