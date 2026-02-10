#!/usr/bin/env node
// validate-enums-patterns.mjs
//
// Walks all generated enum JSON files under packages/**/json/enums/**,
// and validates that every enum value matches the file's `pattern` (if present).
//
// Usage:
//   node tools/validate-enums-patterns.mjs \
//     --baseDir . \
//     --packagesDir packages \
//     [--segment core] \
//     [--debug]
//
// Exit codes:
//   0 = all enums with a pattern are consistent
//   1 = at least one enum value fails its pattern, or a pattern is invalid

import fs from "fs";
import path from "path";
import process from "process";

const argv = process.argv.slice(2);

function getArgVal(name, def = undefined) {
  const i = argv.findIndex(a => a === name || a.startsWith(name + "="));
  if (i === -1) return def;
  const eq = argv[i].indexOf("=");
  if (eq > -1) return argv[i].slice(eq + 1);
  if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) return argv[i + 1];
  return true;
}

const debug = !!getArgVal("--debug", false);
function logDebug(...args) {
  if (debug) console.log(...args);
}

const baseDir = path.resolve(String(getArgVal("--baseDir", ".")));
const packagesDir = String(getArgVal("--packagesDir", "packages")).trim();
const segmentFilter = getArgVal("--segment", null); // e.g. core, name, travelProfile

const packagesRoot = path.join(baseDir, packagesDir);

function listEnumJsonFiles(root) {
  const out = [];
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(p);
      } else if (e.isFile() && e.name.toLowerCase().endsWith(".json")) {
        // Only consider paths containing /json/enums/
        const rel = path.relative(root, p).replace(/\\/g, "/");
        if (rel.includes("/json/enums/")) {
          if (segmentFilter) {
            const seg = rel.split("/")[0];
            if (seg !== segmentFilter) continue;
          }
          out.push(p);
        }
      }
    }
  }
  walk(root);
  return out;
}

function validateEnumFile(filePath) {
  const rel = path.relative(baseDir, filePath).replace(/\\/g, "/");
  let json;
  try {
    const text = fs.readFileSync(filePath, "utf-8");
    json = JSON.parse(text);
  } catch (err) {
    console.error(`✗ ERROR: Failed to read/parse JSON: ${rel}`);
    console.error(`  ${err.message}`);
    return { errors: [`Invalid JSON in ${rel}`], warnings: [] };
  }

  const pattern = json.pattern;
  const values = json.enum;

  if (!pattern || !Array.isArray(values) || !values.length) {
    logDebug(`(skip) ${rel} — no pattern and/or enum array`);
    return { errors: [], warnings: [] };
  }

  let re;
  try {
    re = new RegExp(String(pattern));
  } catch (err) {
    console.error(`✗ ERROR: Invalid regex pattern in ${rel}: "${pattern}"`);
    console.error(`  ${err.message}`);
    return { errors: [`Invalid regex pattern: ${pattern}`], warnings: [] };
  }

  const errors = [];
  const warnings = [];

  for (const v of values) {
    if (typeof v !== "string" && typeof v !== "number") {
      warnings.push(
        `Non-string/number enum value (${JSON.stringify(v)}); treated as "${String(
          v
        )}" for pattern check.`
      );
    }
    const s = String(v);
    if (!re.test(s)) {
      errors.push(`Value "${s}" does NOT match pattern "${pattern}"`);
    }
  }

  if (errors.length) {
    console.error(`✗ FAIL: ${rel}`);
    errors.forEach(e => console.error(`  - ${e}`));
    if (warnings.length && debug) {
      warnings.forEach(w => console.warn(`  ! ${w}`));
    }
  } else {
    console.log(`✓ OK:   ${rel}`);
    if (warnings.length && debug) {
      warnings.forEach(w => console.warn(`  ! ${w}`));
    }
  }

  return { errors, warnings };
}

function main() {
  console.log(
    `validate-enums-patterns.mjs — scanning enums under ${path.relative(
      baseDir,
      packagesRoot
    )}${segmentFilter ? ` (segment=${segmentFilter})` : ""}`
  );

  const files = listEnumJsonFiles(packagesRoot);
  if (!files.length) {
    console.warn("No enum JSON files found under", packagesRoot);
    process.exit(0);
  }

  let total = 0;
  let failedFiles = 0;
  let totalErrors = 0;

  for (const f of files) {
    total++;
    const { errors } = validateEnumFile(f);
    if (errors.length) {
      failedFiles++;
      totalErrors += errors.length;
    }
  }

  console.log(
    `\nSummary: checked ${total} enum file(s); ` +
      `${failedFiles ? failedFiles + " file(s) failed, " + totalErrors + " error(s)" : "all passed"}`
  );

  if (failedFiles > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
