#!/usr/bin/env node
/**
 * scripts/vectorize-logo.mjs
 *
 * Regenerates every brand-identity asset (MARCA-01) from the single official source,
 * `img/logo.png`, in one run:
 *
 *   1. Splits the raster logo into two independent binary masks (white lettering,
 *      lime-green garlic-bulb icon) using pixel thresholds tuned against the real
 *      file (see EXTRACTION_THRESHOLDS below).
 *   2. Traces each mask separately with `potrace`, passing the mask's real brand hex
 *      as the fill color, so the green icon layer survives instead of collapsing into
 *      a black/white silhouette (01-RESEARCH.md Pitfall A).
 *   3. Composes six `public/brand/*.svg` variants (principal, invertido, mono preto,
 *      mono branco, ícone, favicon-source) from those two traced layers, sharing one
 *      viewBox coordinate system derived from the source image dimensions so the
 *      layers register correctly.
 *   4. Rasterises the icon layer into the three Next.js icon-convention files
 *      (`src/app/icon.svg`, `apple-icon.png`, `favicon.ico`) per 01-RESEARCH.md
 *      Pitfall B's strict file-type rules.
 *
 * Every generated SVG carries a provisional-source XML comment (D-01/D-02) — this
 * trace is a faithful approximation of `img/logo.png`, never a replacement for it.
 *
 * Re-run with: `node scripts/vectorize-logo.mjs`
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import potraceModule from "potrace";
import { optimize } from "svgo";

const { Potrace } = potraceModule;

const REPO_ROOT = process.cwd();
const SOURCE_PATH = path.join(REPO_ROOT, "img", "logo.png");
const BRAND_DIR = path.join(REPO_ROOT, "public", "brand");
const APP_DIR = path.join(REPO_ROOT, "src", "app");

// The official seven brand colours (PROJECT.md ## Context). Copied character for
// character — never adjusted, tinted, or substituted with a nearest-named colour.
const PALETTE = {
  limao: "#B8FF00",
  carvao: "#202526",
  preto: "#000000",
  roxo: "#31266B",
  coral: "#FF3B30",
  oliva: "#7D804D",
  branco: "#FFFFFF",
};

// Extraction thresholds tuned against the actual pixel values in img/logo.png
// (1254x1254, 3-channel RGB, no alpha). Sampled this session via a raw-pixel
// dominant-colour scan: the black field clusters at (0,0,0), the lettering at
// (~255,255,255), and the icon at (~184,248,24) — close to the official #B8FF00.
// A later improvement pass should re-sample these before re-tuning.
const EXTRACTION_THRESHOLDS = {
  // Lettering mask: near-white pixels against the black field.
  lettering: { min: 190 }, // r > 190 && g > 190 && b > 190
  // Icon mask: lime-green pixels — high green, mid red, low blue — distinct from
  // both the black field and the white lettering.
  icon: { gMin: 150, rMin: 100, rMax: 230, bMax: 100 },
};

// Even padding (in source-image px) added around the icon's tight bounding box
// when producing the isolated icon variant and the square favicon source.
const ICON_CROP_PADDING = 30;
const FAVICON_SQUARE_PADDING = 50;

const SVGO_CONFIG = {
  multipass: true,
  // svgo v4's preset-default does not include removeViewBox, so the composed
  // viewBox (the thing that makes every variant scale correctly) is never at
  // risk of being stripped — no override needed here.
  plugins: ["preset-default"],
};

function provisionalNotice(variantName) {
  return (
    `<!--\n` +
    `  ARQUIVO PROVISORIO (D-01, D-02) - aproximacao vetorial tracada automaticamente\n` +
    `  a partir de img/logo.png, que permanece a fonte oficial do logo da It's Garlic.\n` +
    `  Este SVG NAO substitui img/logo.png e deve ser trocado quando um vetor\n` +
    `  profissional for entregue pelo cliente - basta sobrescrever este arquivo no\n` +
    `  mesmo caminho, sem alterar nenhum import de componente.\n` +
    `  Variante: ${variantName}. Gerado por scripts/vectorize-logo.mjs (rode\n` +
    `  novamente para regenerar a partir do arquivo fonte).\n` +
    `-->`
  );
}

/** Loads the source PNG as raw RGB pixel data. */
async function loadRawImage(sourcePath) {
  const { data, info } = await sharp(sourcePath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

/** Builds a bilevel PNG mask buffer: black (0,0,0) where `predicate` matches, white elsewhere. */
async function buildMaskBuffer(data, info, predicate) {
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 3);
  for (let i = 0, p = 0; i < data.length; i += channels, p += 3) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const v = predicate(r, g, b) ? 0 : 255;
    out[p] = v;
    out[p + 1] = v;
    out[p + 2] = v;
  }
  return sharp(out, { raw: { width, height, channels: 3 } }).png().toBuffer();
}

/** Scans raw pixel data for the tight bounding box of pixels matching `predicate`. */
function computeBBox(data, info, predicate) {
  const { width, height, channels } = info;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      if (predicate(data[i], data[i + 1], data[i + 2])) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) {
    throw new Error(
      "mask predicate matched no pixels - extraction thresholds need retuning against img/logo.png"
    );
  }
  return { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Loads a mask buffer into a Potrace instance, traced once and reusable across colours. */
function loadTracer(maskBuffer) {
  return new Promise((resolve, reject) => {
    const tracer = new Potrace({ threshold: 128, blackOnWhite: true });
    tracer.loadImage(maskBuffer, (err) => {
      if (err) return reject(err);
      resolve(tracer);
    });
  });
}

function svgDocument({ viewBox, background, paths }) {
  const bgRect = background
    ? `<rect x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.w}" height="${viewBox.h}" fill="${background}"/>`
    : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}">` +
    bgRect +
    paths.join("") +
    `</svg>`
  );
}

function optimizeAndAnnotate(svgSource, variantName) {
  const { data } = optimize(svgSource, SVGO_CONFIG);
  return `${provisionalNotice(variantName)}\n${data}\n`;
}

async function writeVariant(fileName, svgSource, variantLabel) {
  const finalSvg = optimizeAndAnnotate(svgSource, variantLabel);
  const outPath = path.join(BRAND_DIR, fileName);
  await writeFile(outPath, finalSvg, "utf8");
  return { path: outPath, content: finalSvg };
}

function buildIcoContainer(frames) {
  // Minimal ICO container carrying embedded PNG frames (valid since Windows
  // Vista, universally accepted by modern browsers) - avoids the "renamed PNG"
  // trap RESEARCH.md Pitfall B warns against, without pulling in a dedicated
  // ICO-encoding dependency.
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + dirEntrySize * frames.length;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(frames.length, 4); // image count

  const dirEntries = [];
  const imageBuffers = [];
  for (const { size, buffer } of frames) {
    const entry = Buffer.alloc(dirEntrySize);
    const dim = size >= 256 ? 0 : size; // 0 encodes 256px per the ICO spec
    entry.writeUInt8(dim, 0); // width
    entry.writeUInt8(dim, 1); // height
    entry.writeUInt8(0, 2); // colour palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // image data size
    entry.writeUInt32LE(offset, 12); // image data offset
    dirEntries.push(entry);
    imageBuffers.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

async function main() {
  if (!existsSync(SOURCE_PATH)) {
    throw new Error(`Official source logo not found at ${SOURCE_PATH}`);
  }
  await mkdir(BRAND_DIR, { recursive: true });
  await mkdir(APP_DIR, { recursive: true });

  const { data, info } = await loadRawImage(SOURCE_PATH);
  const { width, height } = info;

  const isLettering = (r, g, b) =>
    r > EXTRACTION_THRESHOLDS.lettering.min &&
    g > EXTRACTION_THRESHOLDS.lettering.min &&
    b > EXTRACTION_THRESHOLDS.lettering.min;
  const isIcon = (r, g, b) =>
    g > EXTRACTION_THRESHOLDS.icon.gMin &&
    r > EXTRACTION_THRESHOLDS.icon.rMin &&
    r < EXTRACTION_THRESHOLDS.icon.rMax &&
    b < EXTRACTION_THRESHOLDS.icon.bMax;

  console.log(
    `[vectorize-logo] source: ${SOURCE_PATH} (${width}x${height}, ${info.channels} channels)`
  );
  console.log(
    `[vectorize-logo] extraction thresholds - lettering: r,g,b > ${EXTRACTION_THRESHOLDS.lettering.min}; ` +
      `icon: g > ${EXTRACTION_THRESHOLDS.icon.gMin}, ${EXTRACTION_THRESHOLDS.icon.rMin} < r < ${EXTRACTION_THRESHOLDS.icon.rMax}, b < ${EXTRACTION_THRESHOLDS.icon.bMax}`
  );

  const [letteringMask, iconMask] = await Promise.all([
    buildMaskBuffer(data, info, isLettering),
    buildMaskBuffer(data, info, isIcon),
  ]);

  const [letteringTracer, iconTracer] = await Promise.all([
    loadTracer(letteringMask),
    loadTracer(iconMask),
  ]);

  const iconBBox = computeBBox(data, info, isIcon);
  console.log(
    `[vectorize-logo] icon bounding box: x[${iconBBox.minX},${iconBBox.maxX}] y[${iconBBox.minY},${iconBBox.maxY}] (${iconBBox.width}x${iconBBox.height})`
  );

  const FULL_VIEWBOX = { x: 0, y: 0, w: width, h: height };
  const ICON_VIEWBOX = {
    x: iconBBox.minX - ICON_CROP_PADDING,
    y: iconBBox.minY - ICON_CROP_PADDING,
    w: iconBBox.width + ICON_CROP_PADDING * 2,
    h: iconBBox.height + ICON_CROP_PADDING * 2,
  };
  const faviconSquareSize =
    Math.max(iconBBox.width, iconBBox.height) + FAVICON_SQUARE_PADDING * 2;
  const FAVICON_VIEWBOX = {
    x: iconBBox.minX - (faviconSquareSize - iconBBox.width) / 2,
    y: iconBBox.minY - (faviconSquareSize - iconBBox.height) / 2,
    w: faviconSquareSize,
    h: faviconSquareSize,
  };

  // Two traced layers, reused across variants by re-requesting the path tag
  // with a different fill colour each time (no re-tracing needed).
  const letterPath = (color) => letteringTracer.getPathTag(color);
  const iconPath = (color) => iconTracer.getPathTag(color);

  const variants = {};

  variants["logo-principal.svg"] = await writeVariant(
    "logo-principal.svg",
    svgDocument({
      viewBox: FULL_VIEWBOX,
      background: PALETTE.preto,
      paths: [letterPath(PALETTE.branco), iconPath(PALETTE.limao)],
    }),
    "principal (fundo preto, lettering branco, icone verde-limao)"
  );

  variants["logo-invertido.svg"] = await writeVariant(
    "logo-invertido.svg",
    svgDocument({
      viewBox: FULL_VIEWBOX,
      background: PALETTE.branco,
      paths: [letterPath(PALETTE.carvao), iconPath(PALETTE.limao)],
    }),
    "invertido (fundo branco, lettering carvao, icone verde-limao - para fundos claros)"
  );

  variants["logo-mono-preto.svg"] = await writeVariant(
    "logo-mono-preto.svg",
    svgDocument({
      viewBox: FULL_VIEWBOX,
      background: null,
      paths: [letterPath(PALETTE.preto), iconPath(PALETTE.preto)],
    }),
    "mono preto (uma so cor, fundo transparente)"
  );

  variants["logo-mono-branco.svg"] = await writeVariant(
    "logo-mono-branco.svg",
    svgDocument({
      viewBox: FULL_VIEWBOX,
      background: null,
      paths: [letterPath(PALETTE.branco), iconPath(PALETTE.branco)],
    }),
    "mono branco (uma so cor, fundo transparente - usar sobre campo escuro)"
  );

  variants["logo-icone.svg"] = await writeVariant(
    "logo-icone.svg",
    svgDocument({
      viewBox: ICON_VIEWBOX,
      background: null,
      paths: [iconPath(PALETTE.limao)],
    }),
    "icone isolado (bulbo de alho verde-limao, recortado)"
  );

  const faviconSourceContent = await writeVariant(
    "favicon-source.svg",
    svgDocument({
      viewBox: FAVICON_VIEWBOX,
      background: null,
      paths: [iconPath(PALETTE.limao)],
    }),
    "favicon-source (icone recortado em canvas quadrado, fundo transparente - fonte para os icones raster)"
  );
  variants["favicon-source.svg"] = faviconSourceContent;

  // --- Task 2: Next.js icon-convention files, derived from favicon-source.svg ---

  // `icon.svg` - the only convention that accepts SVG. Same content as the
  // squared favicon source, at its own stable path under src/app/.
  const iconSvgPath = path.join(APP_DIR, "icon.svg");
  await writeFile(iconSvgPath, faviconSourceContent.content, "utf8");

  const faviconSourceSvgBuffer = Buffer.from(faviconSourceContent.content, "utf8");

  // `apple-icon.png` - PNG only, exactly 180x180, composited over the opaque
  // charcoal brand field (transparency renders as a black tile on iOS home
  // screens - RESEARCH.md Pitfall B / Task 2 action).
  const appleIconPath = path.join(APP_DIR, "apple-icon.png");
  await sharp(faviconSourceSvgBuffer)
    .resize(180, 180, { fit: "fill" })
    .flatten({ background: PALETTE.carvao })
    .png()
    .toFile(appleIconPath);

  // `favicon.ico` - .ico only, top-level src/app/ only. Assembled directly
  // from sharp-rasterised PNG frames at conventional legacy sizes (never a
  // renamed PNG, which some browsers reject outright).
  const icoSizes = [16, 32, 48];
  const icoFrames = await Promise.all(
    icoSizes.map(async (size) => ({
      size,
      buffer: await sharp(faviconSourceSvgBuffer)
        .resize(size, size, { fit: "fill" })
        .png()
        .toBuffer(),
    }))
  );
  const favicoPath = path.join(APP_DIR, "favicon.ico");
  await writeFile(favicoPath, buildIcoContainer(icoFrames));

  // --- Fail loudly if anything is missing or empty ---

  const expectedOutputs = [
    ...Object.keys(variants).map((name) => path.join(BRAND_DIR, name)),
    iconSvgPath,
    appleIconPath,
    favicoPath,
  ];
  const problems = [];
  for (const outPath of expectedOutputs) {
    if (!existsSync(outPath)) {
      problems.push(`${outPath} was not written`);
      continue;
    }
    const size = statSync(outPath).size;
    if (size === 0) {
      problems.push(`${outPath} is zero-length`);
    }
  }
  if (problems.length) {
    throw new Error(`vectorize-logo produced incomplete output:\n${problems.join("\n")}`);
  }

  console.log("[vectorize-logo] wrote 6 logo variants to public/brand/:");
  for (const name of Object.keys(variants)) {
    console.log(`  - public/brand/${name}`);
  }
  console.log("[vectorize-logo] wrote 3 Next.js icon-convention files to src/app/:");
  console.log(`  - ${path.relative(REPO_ROOT, iconSvgPath)}`);
  console.log(`  - ${path.relative(REPO_ROOT, appleIconPath)}`);
  console.log(`  - ${path.relative(REPO_ROOT, favicoPath)}`);
}

main().catch((err) => {
  console.error(`[vectorize-logo] FAILED: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
