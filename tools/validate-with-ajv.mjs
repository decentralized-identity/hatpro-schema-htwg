// tools/validate-with-ajv.mjs
import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv/dist/2020.js";

function getArgVal(flag, defVal = null) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return defVal;
  return process.argv[i + 1] || defVal;
}

const repoRoot    = path.resolve(new URL(".", import.meta.url).pathname, "..");
const packagesDir = path.resolve(repoRoot, getArgVal("--packagesDir", "packages"));
const samplesDirName = getArgVal("--samplesDir", "json/samples");
const segment     = getArgVal("--segment", null);

const ajv = new Ajv({
  strict: true,
  allErrors: true
});

// Walk for enum JSON files under .../json/enums/...
function* walkEnumSchemas(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkEnumSchemas(full);
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".json") &&
      full.includes(path.sep + "json" + path.sep + "enums" + path.sep)
    ) {
      yield full;
    }
  }
}

// Walk for *.schema.json
function* walkSchemas(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkSchemas(full);
    } else if (entry.isFile() && entry.name.endsWith(".schema.json")) {
      yield full;
    }
  }
}

// Walk for *.valid.json / *.invalid*.json
function* walkSamples(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkSamples(full);
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      yield full;
    }
  }
}

// Load all enum JSON schemas into Ajv first, so $ref targets like
// https://schemas.example.org/hatpro/core/commonLib/CurrencyTypeEnum.json
// are available.
for (const enumPath of walkEnumSchemas(packagesDir)) {
  // Optional segment filter: only load enums under that subfolder
  if (segment) {
    const relEnum = path.relative(packagesDir, enumPath);
    if (!relEnum.startsWith(segment + path.sep)) continue;
  }

  const enumSchema = JSON.parse(fs.readFileSync(enumPath, "utf8"));
  if (!enumSchema.$id) {
    // Build a local file-based $id if missing (parity with schemas)
    const rel = path.relative(packagesDir, enumPath).replace(/\\/g, "/");
    enumSchema.$id = "file://" + rel;
  }

  ajv.addSchema(enumSchema);
}

// Load all schemas into Ajv
for (const schemaPath of walkSchemas(packagesDir)) {
  // Optional segment filter: only load schemas under that subfolder
  if (segment) {
    const rel = path.relative(packagesDir, schemaPath);
    if (!rel.startsWith(segment + path.sep)) continue;
  }

  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  if (!schema.$id) {
    // Build a local file-based $id if missing
    const rel = path.relative(packagesDir, schemaPath).replace(/\\/g, "/");
    schema.$id = "file://" + rel;
  }

  ajv.addSchema(schema);
}

// Helper: find schemaId from a sample file path
function sampleToSchemaId(samplePath) {
  // packages/<seg>/json/samples/Foo.valid.json
  // -> packages/<seg>/json/schemas/Foo.schema.json
  const rel = path.relative(packagesDir, samplePath);
  const parts = rel.split(path.sep);

  const idxSamples = parts.indexOf("samples");
  if (idxSamples === -1 || idxSamples < 1) return null;

  parts[idxSamples] = "schemas";

  let fileName = parts[parts.length - 1];
  fileName = fileName
    .replace(".valid.json", ".schema.json")
    .replace(".invalid.auto.json", ".schema.json");
  parts[parts.length - 1] = fileName;

  const schemaPath = path.join(packagesDir, ...parts);
  if (!fs.existsSync(schemaPath)) {
    return null;
  }

  // Read its $id (as added to Ajv)
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  return schema.$id || null;
}

let ok = true;

for (const samplePath of walkSamples(path.join(packagesDir))) {
  if (!samplePath.includes(path.sep + samplesDirName + path.sep)) continue;

  if (segment) {
    const rel = path.relative(packagesDir, samplePath);
    if (!rel.startsWith(segment + path.sep)) continue;
  }

  const isValidSample   = samplePath.endsWith(".valid.json");
  const isInvalidSample = samplePath.includes(".invalid.");

  const schemaId = sampleToSchemaId(samplePath);
  if (!schemaId) {
    console.warn("⚠️ No schema found for sample:", path.relative(repoRoot, samplePath));
    ok = false;
    continue;
  }

  const data = JSON.parse(fs.readFileSync(samplePath, "utf8"));
  const valid = ajv.validate(schemaId, data);

  const rel = path.relative(repoRoot, samplePath);
  if (isValidSample) {
    if (valid) {
      console.log("✅ VALID   ", rel, "→", schemaId);
    } else {
      console.error("❌ VALID sample failed:", rel, "→", schemaId);
      console.error(ajv.errors);
      ok = false;
    }
  } else if (isInvalidSample) {
    if (!valid) {
      console.log("✅ INVALID", rel, "rejected as expected");
    } else {
      console.error("❌ INVALID sample was accepted:", rel, "→", schemaId);
      ok = false;
    }
  } else {
    // Neutral files (if any) – just report
    console.log("ℹ️ Sample (no expectation):", rel, "valid?", valid);
  }
}

if (!ok) {
  process.exitCode = 1;
}
