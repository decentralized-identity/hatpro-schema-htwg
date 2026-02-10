// tools/generate-templates-from-schemas.mjs
//
// Generate *.template.json files from compiled JSON Schemas.
//
// Usage:
//   node tools/generate-templates-from-schemas.mjs --packagesDir ./packages
//
// Behaviour (per Neil's 4 Dec 2025 rules):
// - Reads all *.schema.json files under **/json/schemas.
// - Builds a registry by $id for $ref resolution.
// - For each schema, produces <name>.template.json under ../templates.
// - Template generation rules:
//    * If a property has `default`, use that value.
//    * Else if type === "string", use "" (blank string).
//    * Else if type === "integer" or type === "number", omit property.
//    * For objects: recurse into properties.
//    * For arrays: emit a single-element array using the item schema.
//    * For enums: we DO NOT look at the enum JSON file – we rely on
//      `default` (which is required for enum-backed fields).
//
// This keeps enums external, but still gives concrete sample values
// in TravelProfile.template.json et al.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// ---------------- CLI args -------------------------------------------------

const argv = process.argv.slice(2);
let packagesDir = "./packages";

for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--packagesDir" && argv[i + 1]) {
    packagesDir = argv[i + 1];
    i++;
  }
}

console.log(`[gen:templates] Using packagesDir = ${packagesDir}`);

// ---------------- Small utilities -----------------------------------------

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

function deepClone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

// ---------------- Schema registry & $ref helpers --------------------------

/**
 * Registry keyed by $id and by file path.
 * We assume `compile-schemas.mjs` already gave every schema a unique $id.
 */
const schemaRegistry = {
  byId: new Map(),   // $id -> schema object
  byFile: new Map(), // filePath -> schema object
};

function loadSchemasUnderPackagesDir(rootDir) {
  //
  // 1) Load all *.schema.json under .../json/schemas/ as “root” schemas
  //
  const schemaFiles = walkDir(
    rootDir,
    (file) =>
      file.endsWith(".schema.json") &&
      file.includes(path.sep + "json" + path.sep + "schemas" + path.sep)
  );

  for (const filePath of schemaFiles) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const schema = JSON.parse(raw);
      if (!schema || typeof schema !== "object") {
        console.warn(
          `[gen:templates] WARNING: ${filePath} is not an object schema (skipping)`
        );
        continue;
      }
      if (!schema.$id) {
        console.warn(
          `[gen:templates] WARNING: schema missing $id: ${filePath} (skipping)`
        );
        continue;
      }
      schemaRegistry.byId.set(schema.$id, schema);
      schemaRegistry.byFile.set(filePath, schema); // only schemas go here
    } catch (err) {
      console.warn(
        `[gen:templates] WARNING: failed to load schema ${filePath}:`,
        err.message
      );
    }
  }

  //
  // 2) Load enum JSON files under .../json/enums/ into byId only
  //
  const enumFiles = walkDir(
    rootDir,
    (file) =>
      file.endsWith(".json") &&
      file.includes(path.sep + "json" + path.sep + "enums" + path.sep)
  );

  let enumCount = 0;
  for (const filePath of enumFiles) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const enumSchema = JSON.parse(raw);
      if (!enumSchema || typeof enumSchema !== "object") {
        console.warn(
          `[gen:templates] WARNING: ${filePath} is not an object enum schema (skipping)`
        );
        continue;
      }
      if (!enumSchema.$id) {
        console.warn(
          `[gen:templates] WARNING: enum missing $id: ${filePath} (skipping)`
        );
        continue;
      }
      // Only byId: we want to resolve $refs to enums,
      // but not generate templates for them as root documents.
      schemaRegistry.byId.set(enumSchema.$id, enumSchema);
      enumCount++;
    } catch (err) {
      console.warn(
        `[gen:templates] WARNING: failed to load enum schema ${filePath}:`,
        err.message
      );
    }
  }

  console.log(
    `[gen:templates] Loaded ${schemaRegistry.byFile.size} schemas and ${enumCount} enums into registry`
  );
}


/**
 * Resolve a $ref string against the registry.
 * Supports:
 *   - Absolute IDs equal to some schema.$id
 *   - Optional JSON Pointer fragment after '#'
 *
 * For now we don't support relative path refs; if we can't resolve,
 * we return {} and log a warning.
 */
function resolveRef(ref) {
  if (typeof ref !== "string" || !ref.length) return {};

  const [idPart, pointerPart] = ref.split("#", 2);
  const baseSchema =
    idPart && schemaRegistry.byId.has(idPart)
      ? schemaRegistry.byId.get(idPart)
      : null;

  if (!baseSchema) {
    console.warn(`[gen:templates] WARNING: could not resolve $ref base '${idPart || "<root>"}'`);
    return {};
  }

  if (!pointerPart) {
    return baseSchema;
  }

  if (!pointerPart.startsWith("/")) {
    console.warn(`[gen:templates] WARNING: unsupported JSON Pointer in $ref '${ref}'`);
    return baseSchema;
  }

  // Basic JSON Pointer resolution
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
        `[gen:templates] WARNING: JSON Pointer '${pointerPart}' not found in $ref '${ref}'`
      );
      return baseSchema;
    }
  }
  return node;
}

/**
 * Merge two schema fragments shallowly, preferring overrides from `b`.
 * Used mainly for merging allOf'd subschemas.
 */
function mergeSchemaFragments(a, b) {
  const out = { ...(a || {}) };
  if (!b || typeof b !== "object") return out;

  for (const [key, value] of Object.entries(b)) {
    if (key === "allOf") continue; // we'll resolve these separately

    // Merge object properties across allOf / $ref overrides.
    if (key === "properties") {
      out.properties = {
        ...(out.properties || {}),
        ...(value || {}),
      };
      continue;
    }

    // Union required lists across allOf / $ref overrides.
    if (key === "required") {
      const req = new Set([...(out.required || []), ...(value || [])]);
      out.required = Array.from(req);
      continue;
    }

    // Default: shallow overwrite (b wins).
    out[key] = value;
  }

  return out;
}


/**
 * Resolve a schema fragment:
 * - Follows $ref once (and merges with local overrides)
 * - Merges allOf subschemas (shallowly)
 */
function resolveSchemaFragment(schema) {
  if (!schema || typeof schema !== "object") return {};

  let resolved = schema;

  // Handle $ref first
  if (resolved.$ref) {
    const fromRef = resolveRef(resolved.$ref);
    const { $ref, ...rest } = resolved;
    resolved = mergeSchemaFragments(fromRef, rest);
  }

  // Handle allOf
  if (Array.isArray(resolved.allOf) && resolved.allOf.length > 0) {
    const { allOf, ...base } = resolved;
    let merged = { ...base };
    for (const sub of allOf) {
      const subResolved = resolveSchemaFragment(sub);
      merged = mergeSchemaFragments(merged, subResolved);
    }
    resolved = merged;
  }

  return resolved;
}

// ---------------- Sample / template generation ----------------------------

/**
 * Decide a sample value for a resolved schema fragment.
 *
 * Rules:
 *  - If `default` is present, ALWAYS use `default` (deep-cloned).
 *  - Otherwise:
 *      * type === "string"  -> ""   (blank)
 *      * type === "integer" -> omit property (caller sees `undefined`)
 *      * type === "number"  -> omit property (caller sees `undefined`)
 *      * type === "boolean" -> false (defensive; not expected in HATPro yet)
 *      * type === "array"   -> [ sample(items) ]  (if items resolvable)
 *      * type === "object"  -> recurse into properties
 */
function sampleForSchema(schema) {
  const resolved = resolveSchemaFragment(schema);

  if ("default" in resolved) {
    return deepClone(resolved.default);
  }

  const type = resolved.type;

  if (!type) {
    // No explicit type: if enum is present, use first enum value as a last resort.
    if (Array.isArray(resolved.enum) && resolved.enum.length > 0) {
      return deepClone(resolved.enum[0]);
    }
    return undefined;
  }

  if (type === "string") {
    return "";
  }

  if (type === "integer" || type === "number") {
    return undefined; // omit from template
  }

  if (type === "boolean") {
    return false;
  }

  if (type === "array") {
    const itemsSchema = resolved.items;
    if (!itemsSchema) return [];
    const itemValue = sampleForSchema(itemsSchema);
    if (itemValue === undefined) return [];
    return [itemValue];
  }

  if (type === "object") {
    const properties = resolved.properties || {};
    const result = {};
    for (const [propName, propSchema] of Object.entries(properties)) {
      const value = sampleForSchema(propSchema);
      if (value !== undefined) {
        result[propName] = value;
      }
    }
    return result;
  }

  // Unknown type: give up quietly
  return undefined;
}

/**
 * Generate a top-level sample for a root schema.
 */
function generateTemplateFromRootSchema(rootSchema) {
  const resolved = resolveSchemaFragment(rootSchema);

  // If the root has `type: "object"`, we build an object.
  if (resolved.type === "object") {
    const properties = resolved.properties || {};
    const result = {};
    for (const [propName, propSchema] of Object.entries(properties)) {
      const value = sampleForSchema(propSchema);
      if (value !== undefined) {
        result[propName] = value;
      }
    }
    return result;
  }

  // For non-object roots, just call sampleForSchema directly.
  return sampleForSchema(resolved);
}

// ---------------- Main ----------------------------------------------------

function main() {
  loadSchemasUnderPackagesDir(packagesDir);

  if (schemaRegistry.byFile.size === 0) {
    console.warn("[gen:templates] No schemas found; nothing to do.");
    return;
  }

  let generatedCount = 0;

  for (const [filePath, schema] of schemaRegistry.byFile.entries()) {
    const sample = generateTemplateFromRootSchema(schema);
    if (sample === undefined) {
      console.warn(
        `[gen:templates] WARNING: could not generate sample for ${filePath}`
      );
      continue;
    }

    const baseName = path.basename(filePath).replace(/\.schema\.json$/, "");
// filePath: .../<pkg>/json/schemas/<subpath>/<name>.schema.json
const schemasDir = path.dirname(filePath);

// Walk up until we find the ".../json/schemas" directory
let schemasRoot = schemasDir;
while (path.basename(schemasRoot) !== "schemas") {
  const parent = path.dirname(schemasRoot);
  if (parent === schemasRoot) {
    throw new Error(`[gen:templates] Could not locate 'schemas' root for ${filePath}`);
  }
  schemasRoot = parent;
}

// schemasRoot: .../<pkg>/json/schemas
const jsonDir = path.dirname(schemasRoot); // .../<pkg>/json
const relSubpath = path.relative(schemasRoot, schemasDir); // e.g., "commonLib" or ""
const templatesDir = path.join(jsonDir, "templates", relSubpath);

fs.mkdirSync(templatesDir, { recursive: true });

const outPath = path.join(templatesDir, `${baseName}.template.json`);

    fs.writeFileSync(outPath, JSON.stringify(sample, null, 2), "utf-8");
    generatedCount++;
    console.log(`[gen:templates] Wrote ${outPath}`);
  }

  console.log(`[gen:templates] Done. Generated ${generatedCount} templates.`);
}

main();
