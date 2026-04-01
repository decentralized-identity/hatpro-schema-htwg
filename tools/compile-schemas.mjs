#!/usr/bin/env node
// compile-schemas.mjs
// Compile all JSON Schemas with AJV, resolving $ref across schemas + enums.
//
// Usage:
//   node tools/compile-schemas.mjs
//   node tools/compile-schemas.mjs --segment core
//   node tools/compile-schemas.mjs --segment travelProfile/root
//
// Behaviour:
//   • Loads ALL schemas + enums into a single Ajv instance.
//   • Uses --segment ONLY to choose which schemas to compile/report as targets.
//   • Adds whitespace and separators between FAIL blocks for readability.

import fs from "fs";
import path from "path";
import process from "process";
import { globby } from "globby";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import ajvErrors from "ajv-errors";

const argv = process.argv.slice(2);
function getArgVal(name, def = undefined) {
  const i = argv.findIndex(a => a === name || a.startsWith(name + "="));
  if (i === -1) return def;
  const eq = argv[i].indexOf("=");
  if (eq > -1) return argv[i].slice(eq + 1);
  if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) return argv[i + 1];
  return true;
}

const segment = getArgVal("--segment", null);   // e.g. "core", "travelProfile", "travelProfile/root"
const debug   = !!getArgVal("--debug", false);

function log(...args) {
  if (debug) console.log(...args);
}

// Globs
const SCHEMAS_GLOB = "packages/**/json/schemas/**/*.schema.json";
const ENUMS_GLOB   = "packages/**/json/enums/**/*.json";

function normalize(p) {
  return p.replace(/\\/g, "/");
}

function matchesSegment(filePath, seg) {
  if (!seg) return true;
  const norm = normalize(filePath);
  const prefix = "packages/" + seg.replace(/^[\\/]+/, "").replace(/\\/g, "/") + "/";
  return norm.startsWith(prefix);
}

async function main() {
  const cwd = process.cwd();
  log("cwd:", cwd);

  // 1) Discover all schemas and enums (unfiltered)
  const allSchemaPaths = await globby(SCHEMAS_GLOB, { cwd });
  const allEnumPaths   = await globby(ENUMS_GLOB, { cwd });

  // Filtered lists only for reporting / target selection
  let effectiveSegment = segment;
  const filteredSchemaPaths = (segment
    ? allSchemaPaths.filter(p => matchesSegment(p, segment))
    : allSchemaPaths);
  const filteredEnumPaths = (segment
    ? allEnumPaths.filter(p => matchesSegment(p, segment))
    : allEnumPaths);

  log("Unfiltered schemas:", allSchemaPaths.length, "Unfiltered enums:", allEnumPaths.length);
  log("Segment:", segment || "(none)");
  log("Filtered schemas:", filteredSchemaPaths.length, "Filtered enums:", filteredEnumPaths.length);

  // If a --segment is provided but matches nothing, fall back to compiling everything.
  if (segment && !filteredSchemaPaths.length && allSchemaPaths.length) {
    console.warn(`[compile-schemas] WARNING: No schema files matched segment "${segment}". Falling back to unfiltered set for this run.`);
    console.warn("Inspect matchesSegment() or your segment argument if this is unexpected.");
    effectiveSegment = null; // compile all schemas as targets
  }

  if (!allSchemaPaths.length) {
    console.warn("No schema files found under", SCHEMAS_GLOB);
    return;
  }

  log("Found", allSchemaPaths.length, "schema files");
  log("Found", allEnumPaths.length, "enum files");

  // 2) Create one AJV instance for everything
  const ajv = new Ajv2020({
    allErrors: true,
    strict: false,
    strictSchema: false,
  });
  addFormats(ajv);
  ajvErrors(ajv);

  let loadedSchemas = 0;
  let loadedEnums = 0;

  // 3) Load ALL enum JSON files first (they may be referenced by schemas)
  for (const relPath of allEnumPaths) {
    const absPath = path.resolve(cwd, relPath);
    const raw = fs.readFileSync(absPath, "utf-8");
    let schema;
    try {
      schema = JSON.parse(raw);
    } catch (e) {
      console.error();
      console.error("------------------------------------------------------------");
      console.error(`FAIL  ${relPath}  parse error in enum JSON`);
      console.error("  Error:", e.message || e);
      process.exitCode = 1;
      continue;
    }

    try {
      if (Array.isArray(schema.enum) && schema.enum.length === 0) {
        console.warn(`SKIP empty enum: ${relPath}`);
      } else {
        ajv.addSchema(schema); // uses $id in the enum file
        loadedEnums++;
        log("Loaded enum:", relPath, "($id:", schema.$id, ")");
      }
    } catch (e) {
      console.error();
      console.error("------------------------------------------------------------");
      console.error(`FAIL  ${relPath}  addSchema error for enum`);
      console.error("  Error:", e.message || e);
      process.exitCode = 1;
    }
  }

  // 4) Load ALL schema JSON files so $ref by $id can be resolved
  const schemaEntries = [];
  for (const relPath of allSchemaPaths) {
    const absPath = path.resolve(cwd, relPath);
    const raw = fs.readFileSync(absPath, "utf-8");
    let schema;
    try {
      schema = JSON.parse(raw);
    } catch (e) {
      console.error();
      console.error("------------------------------------------------------------");
      console.error(`FAIL  ${relPath}  parse error in schema JSON`);
      console.error("  Error:", e.message || e);
      process.exitCode = 1;
      continue;
    }

    const id = schema.$id || `urn:local:${normalize(relPath)}`;
    try {
      ajv.addSchema(schema, id);
      loadedSchemas++;
      schemaEntries.push({ relPath, schema, id });
      log("Loaded schema:", relPath, "($id:", id, ")");
    } catch (e) {
      console.error();
      console.error("------------------------------------------------------------");
      console.error(`FAIL  ${relPath}  addSchema error`);
      console.error("  Error:", e.message || e);
      process.exitCode = 1;
    }
  }

  log("Total loaded schemas:", loadedSchemas, "enums:", loadedEnums);

  // 5) Compile each schema (optionally filtered by effectiveSegment)
  let failed = 0;
  for (const { relPath, schema, id } of schemaEntries) {
    if (!matchesSegment(relPath, effectiveSegment)) {
      // Not part of requested segment; still preloaded for $ref resolution, but skip as a "target".
      continue;
    }

    try {
      // getSchema will compile lazily if needed
      const validate = ajv.getSchema(id) || ajv.compile(schema);
      if (typeof validate !== "function") {
        throw new Error("Ajv did not return a validator function");
      }
      console.log(`✓ ${relPath}`);
    } catch (e) {
      failed++;
      // Add whitespace + separator before each FAIL block (more readable).
      console.error();
      console.error("------------------------------------------------------------");
      console.error(`FAIL  ${relPath}  compile error`);
      if (e && e.message) {
        console.error("  Error:", e.message);
      } else {
        console.error("  Error:", e);
      }
      if (e && e.errors) {
        console.error("  AJV errors:", JSON.stringify(e.errors, null, 2));
      }
    }
  }

  if (failed > 0) {
    console.error();
    console.error(`✗ ${failed} schema(s) failed to compile.`);
    process.exit(1);
  } else {
    console.log();
    console.log("✔ All schemas compiled successfully.");
  }
}

main().catch(err => {
  console.error();
  console.error("------------------------------------------------------------");
  console.error("Unexpected error in compile-schemas.mjs:", err);
  process.exit(1);
});
