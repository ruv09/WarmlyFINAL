/**
 * Генерирует PNG-иллюстрации деревьев (512×512, прозрачный фон)
 * в мягком пастельном стиле гайда Warmly — вид в фас.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../assets/trees");
const SIZE = 512;

fs.mkdirSync(OUT, { recursive: true });

function svg(body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="g" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="var(--hi)" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="var(--mid)" stop-opacity="0.92"/>
      <stop offset="100%" stop-color="var(--sh)" stop-opacity="0.9"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFE9B8" stop-opacity="0.45"/>
      <stop offset="60%" stop-color="#FFE9B8" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#FFE9B8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  ${body}
</svg>`;
}

function base(grass = "#A8C89A", grassDeep = "#7FA06F") {
  return `
  <ellipse cx="50" cy="92" rx="22" ry="3.5" fill="#000000" opacity="0.08"/>
  <ellipse cx="50" cy="88" rx="26" ry="10" fill="url(#glow)"/>
  <ellipse cx="50" cy="91" rx="24" ry="5" fill="${grass}" opacity="0.92"/>
  <ellipse cx="42" cy="90" rx="7" ry="2.5" fill="${grassDeep}" opacity="0.45"/>
  <ellipse cx="60" cy="91" rx="6" ry="2.2" fill="${grassDeep}" opacity="0.4"/>
  <circle cx="36" cy="89.5" r="0.9" fill="#F0D48A"/>
  <circle cx="66" cy="89.5" r="0.8" fill="#F8F4EC"/>`;
}

function trunk(x, y, w, h, color, rx = 2) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${color}"/>`;
}

const trees = {
  oak: () => {
    const mid = "#7FA06F";
    const hi = "#A8C89A";
    const sh = "#5D7D5A";
    const tr = "#8B5A3C";
    return svg(`
      <style>:root{--hi:${hi};--mid:${mid};--sh:${sh}}</style>
      ${base()}
      ${trunk(46, 58, 8, 32, tr, 3)}
      <path d="M46 86 Q40 90 36 91" stroke="${tr}" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/>
      <path d="M54 86 Q60 90 64 91" stroke="${tr}" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/>
      <circle cx="32" cy="48" r="16" fill="${sh}" opacity="0.4"/>
      <circle cx="68" cy="46" r="15" fill="${sh}" opacity="0.35"/>
      <circle cx="34" cy="44" r="15" fill="url(#g)"/>
      <circle cx="66" cy="42" r="14" fill="url(#g)"/>
      <circle cx="50" cy="30" r="17" fill="url(#g)"/>
      <circle cx="44" cy="46" r="12" fill="${mid}" opacity="0.85"/>
      <circle cx="58" cy="44" r="11" fill="${mid}" opacity="0.8"/>
      <ellipse cx="40" cy="32" rx="8" ry="6" fill="${hi}" opacity="0.45"/>
    `);
  },

  birch: () => {
    const mid = "#A8C89A";
    const hi = "#D4E8C4";
    const sh = "#7FA06F";
    const tr = "#F8F8F8";
    return svg(`
      <style>:root{--hi:${hi};--mid:${mid};--sh:${sh}}</style>
      ${base()}
      ${trunk(47.5, 42, 5, 48, tr, 2.2)}
      <rect x="48.5" y="52" width="1.1" height="5" rx="0.4" fill="#4A4038" opacity="0.35"/>
      <rect x="50.2" y="66" width="1.1" height="4.5" rx="0.4" fill="#4A4038" opacity="0.3"/>
      <rect x="48.8" y="78" width="1" height="4" rx="0.4" fill="#4A4038" opacity="0.28"/>
      <circle cx="50" cy="26" r="13" fill="url(#g)"/>
      <circle cx="40" cy="36" r="11" fill="url(#g)"/>
      <circle cx="60" cy="38" r="11" fill="url(#g)"/>
      <circle cx="50" cy="44" r="11" fill="${mid}" opacity="0.88"/>
      <ellipse cx="44" cy="28" rx="6" ry="8" fill="${hi}" opacity="0.4"/>
    `);
  },

  pine: () => {
    const mid = "#5D7D5A";
    const hi = "#7FA06F";
    const sh = "#3E5A3C";
    const tr = "#8B5A3C";
    return svg(`
      <style>:root{--hi:${hi};--mid:${mid};--sh:${sh}}</style>
      ${base()}
      ${trunk(47.5, 58, 5, 32, tr, 2)}
      <path d="M50 14 L62 36 L38 36 Z" fill="${sh}" opacity="0.5"/>
      <path d="M50 16 L60 36 L40 36 Z" fill="url(#g)"/>
      <path d="M50 28 L66 52 L34 52 Z" fill="url(#g)" opacity="0.95"/>
      <path d="M50 42 L70 70 L30 70 Z" fill="${mid}" opacity="0.92"/>
      <path d="M50 20 L55 30 L45 30 Z" fill="${hi}" opacity="0.4"/>
    `);
  },

  spruce: () => {
    const mid = "#4A6A48";
    const hi = "#6A8A64";
    const sh = "#2E4A30";
    const tr = "#6A4A34";
    return svg(`
      <style>:root{--hi:${hi};--mid:${mid};--sh:${sh}}</style>
      ${base()}
      ${trunk(47.5, 66, 5, 24, tr, 2)}
      <path d="M50 12 L60 32 L40 32 Z" fill="${sh}" opacity="0.55"/>
      <path d="M50 14 L58 32 L42 32 Z" fill="url(#g)"/>
      <path d="M50 26 L64 48 L36 48 Z" fill="url(#g)"/>
      <path d="M50 40 L68 62 L32 62 Z" fill="${mid}" opacity="0.95"/>
      <path d="M50 52 L72 78 L28 78 Z" fill="${sh}" opacity="0.9"/>
      <path d="M50 16 L54 26 L46 26 Z" fill="${hi}" opacity="0.35"/>
    `);
  },

  maple: () => {
    const mid = "#E8A23D";
    const hi = "#F4C878";
    const sh = "#C07828";
    const tr = "#8B5A3C";
    return svg(`
      <style>:root{--hi:${hi};--mid:${mid};--sh:${sh}}</style>
      ${base()}
      ${trunk(46.5, 56, 7, 34, tr, 2.8)}
      <path d="M50 18 C62 22 74 34 72 46 C78 50 74 60 64 62 C60 72 40 72 36 62 C24 60 22 48 28 42 C24 30 38 16 50 18 Z" fill="url(#g)"/>
      <circle cx="38" cy="40" r="10" fill="${hi}" opacity="0.35"/>
      <circle cx="60" cy="44" r="9" fill="${sh}" opacity="0.3"/>
    `);
  },

  linden: () => {
    const mid = "#8FB996";
    const hi = "#C5E0B8";
    const sh = "#5D7D5A";
    const tr = "#8B5A3C";
    return svg(`
      <style>:root{--hi:${hi};--mid:${mid};--sh:${sh}}</style>
      ${base()}
      ${trunk(46.5, 56, 7, 34, tr, 2.8)}
      <ellipse cx="50" cy="40" rx="28" ry="26" fill="${mid}" opacity="0.18"/>
      <circle cx="50" cy="40" r="26" fill="url(#g)"/>
      <circle cx="50" cy="38" r="20" fill="${mid}" opacity="0.5"/>
      <ellipse cx="40" cy="32" rx="10" ry="8" fill="${hi}" opacity="0.42"/>
    `);
  },

  cherry: () => {
    const mid = "#F4B3C2";
    const hi = "#FFE0E8";
    const sh = "#E090A8";
    const tr = "#8B5A3C";
    return svg(`
      <style>:root{--hi:${hi};--mid:${mid};--sh:${sh}}</style>
      ${base()}
      ${trunk(46.5, 54, 7, 36, tr, 2.8)}
      <circle cx="32" cy="44" r="14" fill="${sh}" opacity="0.3"/>
      <circle cx="68" cy="42" r="13" fill="${sh}" opacity="0.28"/>
      <circle cx="34" cy="40" r="14" fill="url(#g)"/>
      <circle cx="66" cy="38" r="13" fill="url(#g)"/>
      <circle cx="50" cy="26" r="15" fill="url(#g)"/>
      <circle cx="44" cy="42" r="11" fill="${hi}" opacity="0.4"/>
      <circle cx="28" cy="66" r="1.3" fill="${hi}" opacity="0.7"/>
      <circle cx="72" cy="62" r="1.1" fill="${hi}" opacity="0.65"/>
      <circle cx="36" cy="76" r="1" fill="${mid}" opacity="0.55"/>
    `);
  },

  apple: () => {
    const mid = "#7FA06F";
    const hi = "#A8C89A";
    const sh = "#5D7D5A";
    const tr = "#8B5A3C";
    const fruit = "#D4544A";
    return svg(`
      <style>:root{--hi:${hi};--mid:${mid};--sh:${sh}}</style>
      ${base()}
      ${trunk(46.5, 56, 7, 34, tr, 2.8)}
      <circle cx="34" cy="44" r="14" fill="url(#g)"/>
      <circle cx="66" cy="42" r="13" fill="url(#g)"/>
      <circle cx="50" cy="30" r="15" fill="url(#g)"/>
      <circle cx="50" cy="44" r="11" fill="${mid}" opacity="0.8"/>
      <circle cx="38" cy="42" r="2" fill="${fruit}"/>
      <circle cx="56" cy="34" r="2" fill="${fruit}"/>
      <circle cx="64" cy="48" r="1.8" fill="${fruit}"/>
      <circle cx="46" cy="50" r="1.8" fill="${fruit}"/>
      <circle cx="52" cy="42" r="1.6" fill="${fruit}" opacity="0.9"/>
    `);
  },

  bush: () => {
    const mid = "#7FA06F";
    const hi = "#A8C89A";
    const sh = "#5D7D5A";
    return svg(`
      <style>:root{--hi:${hi};--mid:${mid};--sh:${sh}}</style>
      ${base("#A8C89A", "#7FA06F")}
      <circle cx="34" cy="68" r="14" fill="${sh}" opacity="0.35"/>
      <circle cx="66" cy="68" r="14" fill="${sh}" opacity="0.35"/>
      <circle cx="36" cy="64" r="14" fill="url(#g)"/>
      <circle cx="64" cy="64" r="14" fill="url(#g)"/>
      <circle cx="50" cy="58" r="16" fill="url(#g)"/>
      <circle cx="50" cy="68" r="12" fill="${mid}" opacity="0.85"/>
      <ellipse cx="42" cy="58" rx="8" ry="5" fill="${hi}" opacity="0.4"/>
    `);
  },

  willow: () => {
    const mid = "#8FB996";
    const hi = "#C5E0B8";
    const sh = "#5D7D5A";
    const tr = "#8B5A3C";
    return svg(`
      <style>:root{--hi:${hi};--mid:${mid};--sh:${sh}}</style>
      ${base()}
      ${trunk(46.5, 44, 7, 46, tr, 2.8)}
      <circle cx="50" cy="28" r="15" fill="url(#g)"/>
      <ellipse cx="30" cy="52" rx="9" ry="24" fill="${mid}" opacity="0.78"/>
      <ellipse cx="70" cy="54" rx="9" ry="26" fill="${mid}" opacity="0.78"/>
      <ellipse cx="38" cy="60" rx="7" ry="22" fill="${sh}" opacity="0.45"/>
      <ellipse cx="62" cy="62" rx="7" ry="24" fill="${sh}" opacity="0.4"/>
      <ellipse cx="50" cy="66" rx="6" ry="22" fill="${mid}" opacity="0.6"/>
      <ellipse cx="44" cy="24" rx="7" ry="5" fill="${hi}" opacity="0.4"/>
    `);
  },

  rowan: () => {
    const mid = "#7FA06F";
    const hi = "#A8C89A";
    const sh = "#5D7D5A";
    const tr = "#8B5A3C";
    const berry = "#D4544A";
    return svg(`
      <style>:root{--hi:${hi};--mid:${mid};--sh:${sh}}</style>
      ${base()}
      ${trunk(46.5, 54, 7, 36, tr, 2.8)}
      <circle cx="36" cy="44" r="13" fill="url(#g)"/>
      <circle cx="64" cy="42" r="12" fill="url(#g)"/>
      <circle cx="50" cy="30" r="14" fill="url(#g)"/>
      <circle cx="50" cy="44" r="10" fill="${mid}" opacity="0.8"/>
      <circle cx="40" cy="46" r="1.8" fill="${berry}"/>
      <circle cx="44" cy="50" r="1.5" fill="${berry}"/>
      <circle cx="58" cy="40" r="1.7" fill="${berry}"/>
      <circle cx="62" cy="46" r="1.5" fill="${berry}"/>
      <circle cx="50" cy="48" r="1.6" fill="${berry}"/>
    `);
  },
};

for (const [name, build] of Object.entries(trees)) {
  const out = path.join(OUT, `${name}.png`);
  await sharp(Buffer.from(build())).png({ compressionLevel: 9 }).toFile(out);
  const kb = (fs.statSync(out).size / 1024).toFixed(1);
  console.log(`wrote ${name}.png (${kb} KB)`);
}

console.log("done", OUT);
