console.log("BUNDLE TOOL - LIVE FILE VERSION");

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// ---------------- CLI args ----------------

const argv = process.argv.slice(2);

function getArgVal(name, def = undefined) {
  const i = argv.findIndex((a) => a === name || a.startsWith(name + "="));
  if (i === -1) return def;
  const eq = argv[i].indexOf("=");
  if (eq > -1) return argv[i].slice(eq + 1);
  if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) return argv[i + 1];
  return true;
}

const entryArg = getArgVal("--entry");
const outArg = getArgVal("--out");
const mode = getArgVal("--mode", "bundle");
const debug = !!getArgVal("--debug", false);

function log(...args) {
  if (debug) console.log(...args);
}

if (!entryArg) {
  console.error("ERROR: --entry <path/to/TravelProfile.schema.json> is required");
  process.exit(1);
}
if (!outArg) {
  console.error("ERROR: --out <path/to/output.json> is required");
  process.exit(1);
}
if (mode !== "bundle") {
  console.warn(`[bundle] Note: --mode ${mode} is currently ignored (default = bundle).`);
}

// ---------------- Root / packages dir derivation ----------------

const entryPath = path.resolve(process.cwd(), entryArg);
const outPath = path.resolve(process.cwd(), outArg);

// Derive packagesDir from entry path if possible (find "packages" in the path).
let packagesDir = getArgVal("--packagesDir", null);
if (!packagesDir) {
  const parts = entryPath.split(path.sep);
  const idx = parts.lastIndexOf("packages");
  if (idx !== -1) {
    packagesDir = parts.slice(0, idx + 1).join(path.sep);
  } else {
    // fallback: assume ./packages at project root
    packagesDir = path.resolve(process.cwd(), "packages");
  }
} else {
  packagesDir = path.resolve(process.cwd(), packagesDir);
}

log(`[bundle] entry: ${entryPath}`);
log(`[bundle] out:   ${outPath}`);
log(`[bundle] packagesDir: ${packagesDir}`);

// ---------------- File & schema registry helpers ----------------

function walkDir(dir, matcher) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full, matcher));
    } else if (entry.isFile() && matcher(full)) {
      results.push(full);
    }
  }
  return results;
}

// Registry keyed by $id and by file path
const schemaRegistry = {
  byId: new Map(),   // $id -> schema
  byFile: new Map(), // filePath -> schema
};

function loadAllSchemas(rootDir) {
  const matcher = (file) =>
    file.endsWith(".schema.json") &&
    file.includes(path.sep + "json" + path.sep + "schemas" + path.sep);

  const files = walkDir(rootDir, matcher);
  for (const filePath of files) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const schema = JSON.parse(raw);
      if (!schema || typeof schema !== "object") {
        console.warn(`[bundle] WARNING: ${filePath} is not an object schema`);
        continue;
      }
      if (!schema.$id) {
        console.warn(`[bundle] WARNING: missing $id in ${filePath}`);
        continue;
      }
      schemaRegistry.byId.set(schema.$id, schema);
      schemaRegistry.byFile.set(filePath, schema);
    } catch (err) {
      console.warn(
        `[bundle] WARNING: failed to load ${filePath}: ${err.message}`
      );
    }
  }
  console.log(
    `[bundle] Loaded ${schemaRegistry.byId.size} schemas from ${rootDir}`
  );
}

// ---------------- $ref & allOf resolution ----------------------

function resolveRef(ref) {
  if (typeof ref !== "string" || !ref.length) return {};
  const [idPart, pointerPart] = ref.split("#", 2);

  const baseSchema = schemaRegistry.byId.get(idPart);
  if (!baseSchema) {
    console.warn(`[bundle] WARNING: cannot resolve $ref base '${idPart}'`);
    return {};
  }

  if (!pointerPart) return baseSchema;

  if (!pointerPart.startsWith("/")) {
    console.warn(
      `[bundle] WARNING: unsupported JSON Pointer fragment in $ref '${ref}'`
    );
    return baseSchema;
  }

  const segments = pointerPart
    .split("/")
    .slice(1)
    .map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));

  let node = baseSchema;
  for (const seg of segments) {
    if (node && typeof node === "object" && seg in node) {
      node = node[seg];
    } else {
      console.warn(
        `[bundle] WARNING: Pointer '${pointerPart}' not found in $ref '${ref}'`
      );
      return baseSchema;
    }
  }
  return node;
}

// shallow merge: properties from `b` override `a`
function mergeShallow(a, b) {
  const out = { ...(a || {}) };
  if (!b || typeof b !== "object") return out;
  for (const [k, v] of Object.entries(b)) {
    if (k === "allOf") continue; // handled separately
    if (k === "$id") continue;   // keep root $id
    out[k] = v;
  }
  return out;
}

// shallow merge for arrays that represent "union" (e.g., required)
function unionArray(a, b) {
  const set = new Set();
  if (Array.isArray(a)) a.forEach((x) => set.add(x));
  if (Array.isArray(b)) b.forEach((x) => set.add(x));
  return Array.from(set);
}

/**
 * Recursively resolve a schema fragment:
 *   - Replaces $ref with the referenced schema (merged with local overrides)
 *   - Merges allOf shallowly
 *   - Recurses into properties/items
 *   - Tracks $ref *per path* (refStack) to only warn on real recursion
 */
function resolveSchema(schema, refStack = []) {
  if (!schema || typeof schema !== "object") return schema;

  let resolved = { ...schema };

  // 1) Handle $ref
  if (resolved.$ref) {
    const ref = resolved.$ref;

    // True recursion: we are trying to follow the same $ref again
    // on the current resolution chain.
    if (refStack.includes(ref)) {
      console.warn(`[bundle] WARNING: cycle detected at $ref '${ref}'`);
      // Leave this $ref as-is to avoid infinite expansion.
      return resolved;
    }

    const target = resolveRef(ref);
    const { $ref, ...rest } = resolved;
    const merged = mergeShallow(target, rest);

    // Continue resolution with this ref added to the current path.
    const newStack = [...refStack, ref];
    resolved = resolveSchema(merged, newStack);
  }

  // 2) Handle allOf (shallow merge)
  if (Array.isArray(resolved.allOf) && resolved.allOf.length > 0) {
    const { allOf, ...base } = resolved;
    let acc = { ...base };
    let accRequired = acc.required || [];

    for (const sub of allOf) {
      const subResolved = resolveSchema(sub, refStack);
      acc = mergeShallow(acc, subResolved);
      if (Array.isArray(subResolved.required)) {
        accRequired = unionArray(accRequired, subResolved.required);
      }
    }

    if (accRequired.length) {
      acc.required = accRequired;
    }
    resolved = acc;
  }

  // 3) Recurse into nested schemas
  if (resolved.properties && typeof resolved.properties === "object") {
    const newProps = {};
    for (const [pName, pSchema] of Object.entries(resolved.properties)) {
      newProps[pName] = resolveSchema(pSchema, refStack);
    }
    resolved.properties = newProps;
  }

  if (resolved.patternProperties && typeof resolved.patternProperties === "object") {
    const newPP = {};
    for (const [pName, pSchema] of Object.entries(resolved.patternProperties)) {
      newPP[pName] = resolveSchema(pSchema, refStack);
    }
    resolved.patternProperties = newPP;
  }

  if (resolved.items) {
    resolved.items = resolveSchema(resolved.items, refStack);
  }

  if (Array.isArray(resolved.anyOf)) {
    resolved.anyOf = resolved.anyOf.map((s) => resolveSchema(s, refStack));
  }
  if (Array.isArray(resolved.oneOf)) {
    resolved.oneOf = resolved.oneOf.map((s) => resolveSchema(s, refStack));
  }
  if (Array.isArray(resolved.allOf)) {
    resolved.allOf = resolved.allOf.map((s) => resolveSchema(s, refStack));
  }

  if (resolved.$defs && typeof resolved.$defs === "object") {
    const newDefs = {};
    for (const [k, v] of Object.entries(resolved.$defs)) {
      newDefs[k] = resolveSchema(v, refStack);
    }
    resolved.$defs = newDefs;
  }

  return resolved;
}

// ---------------- Main bundling logic ------------------------

function main() {
  // 1. Load all schemas into registry
  loadAllSchemas(packagesDir);

  // 2. Load the entry schema (TravelProfile.schema.json)
  if (!fs.existsSync(entryPath)) {
    console.error(`[bundle] ERROR: entry schema not found: ${entryPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(entryPath, "utf-8");
  let rootSchema;
  try {
    rootSchema = JSON.parse(raw);
  } catch (err) {
    console.error(
      `[bundle] ERROR: failed to parse entry schema ${entryPath}: ${err.message}`
    );
    process.exit(1);
  }

  // If the entry schema hasn't been registered yet (e.g., outside packagesDir),
  // put it in the registry so $id-based refs still work.
  if (rootSchema.$id && !schemaRegistry.byId.has(rootSchema.$id)) {
    schemaRegistry.byId.set(rootSchema.$id, rootSchema);
  }

  console.log(`[bundle] Bundling from entry schema: ${entryPath}`);
  const bundled = resolveSchema(rootSchema);

  // Optionally tweak $id to indicate this is a bundled artifact.
  if (bundled.$id && typeof bundled.$id === "string") {
    const id = bundled.$id;
    if (!id.endsWith(".bundled.schema.json")) {
      bundled.$id = id.replace(/(\.schema\.json)?$/, ".bundled.schema.json");
    }
  }

  // 3. Write output
  const outDir = path.dirname(outPath);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(bundled, null, 2), "utf-8");

  console.log(`[bundle] Wrote bundled schema to: ${outPath}`);
}

main();
