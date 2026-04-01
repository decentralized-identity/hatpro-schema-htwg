import fs from "node:fs";
import path from "node:path";

// Usage:
//   node tools/puml/check-puml-defines.mjs
//   node tools/puml/check-puml-defines.mjs "C:\path\to\repo"
//   node tools/puml/check-puml-defines.mjs --verbose
//   node tools/puml/check-puml-defines.mjs "C:\path\to\repo" --verbose

const args = process.argv.slice(2);
const verbose = args.includes("--verbose");
const rootArg = args.find((a) => a !== "--verbose");
const ROOT = rootArg ? path.resolve(rootArg) : process.cwd();

const EXT = ".puml";
const reBadDefine = /^\s*!define\s+(VIEW_MODE|HIDE_COMMENTS)\b/;

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build"]);

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    if (verbose) console.warn(`WARN: cannot read dir: ${dir} (${e?.message ?? e})`);
    return out;
  }

  for (const ent of entries) {
    const p = path.join(dir, ent.name);

    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      out.push(...walk(p));
    } else if (ent.isFile() && p.toLowerCase().endsWith(EXT)) {
      out.push(p);
    }
  }
  return out;
}

function scanFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);
  const hits = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (reBadDefine.test(line)) {
      hits.push({
        file: filePath,
        lineNo: i + 1,
        lineText: line.trim(),
      });
    }
  }
  return hits;
}

function rel(p) {
  return path.relative(ROOT, p);
}

console.log(`Scanning root: ${ROOT}`);
const files = walk(ROOT);
console.log(`Found ${files.length} .puml files`);

if (verbose && files.length) {
  // Print a few samples so you can see you're in the right tree
  console.log("Sample files:");
  files.slice(0, 10).forEach((f) => console.log(`  ${rel(f)}`));
  if (files.length > 10) console.log(`  ... (${files.length - 10} more)`);
}

const findings = [];
for (const f of files) {
  try {
    findings.push(...scanFile(f));
  } catch (e) {
    console.warn(`WARN: Could not read ${f}: ${e?.message ?? e}`);
  }
}

if (findings.length) {
  console.error("ERROR: Found uncommented PlantUML macro defines (must remain commented out in committed files):");
  for (const hit of findings) {
    console.error(`  ${rel(hit.file)}:${hit.lineNo}: ${hit.lineText}`);
  }
  process.exit(1);
}

console.log("OK: No uncommented VIEW_MODE/HIDE_COMMENTS defines found.");
process.exit(0);
