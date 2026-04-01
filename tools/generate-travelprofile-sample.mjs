// tools/generate-travelprofile-sample.mjs
//
// Build a composite TravelProfile example JSON from per-segment
// "valid" example files, guided by TravelProfile.bundle.json.
//
// Expected layout:
//   packages/
//     <segment>/
//       json/
//         examples/
//           <SchemaName>.valid.json
//
// Example schemaId:
//   https://schemas.example.org/hatpro/identity/IdentityInfo.schema.json
// Example example path:
//   packages/identity/json/examples/IdentityInfo.valid.json

import fs from "node:fs";
import path from "node:path";

const repoRoot    = path.resolve(new URL(".", import.meta.url).pathname, "..");
const packagesDir = path.join(repoRoot, "packages");

// Location of the manual bundle config
const bundlePath = path.join(
  packagesDir,
  "travelProfile",
  "json",
  "TravelProfile.bundle.json"
);

if (!fs.existsSync(bundlePath)) {
  console.error("❌ TravelProfile.bundle.json not found at", bundlePath);
  process.exit(1);
}

const bundle = JSON.parse(fs.readFileSync(bundlePath, "utf8"));

/**
 * Map a schemaId like:
 *   https://schemas.example.org/hatpro/identity/IdentityInfo.schema.json
 * to an example path like:
 *   packages/identity/json/examples/IdentityInfo.valid.json
 */
function schemaIdToExamplePath(schemaId) {
  let url;
  try {
    url = new URL(schemaId);
  } catch (e) {
    return null;
  }

  const parts = url.pathname.split("/").filter(Boolean); // ["hatpro","identity","IdentityInfo.schema.json"]
  if (parts.length < 3) return null;

  const segment = parts[1]; // identity, contact, preferences, ...
  const file = parts[2].replace(".schema.json", ".valid.json");

  return path.join(packagesDir, segment, "json", "examples", file);
}

const profile = {};
const includedSegments = [];

// Only use properties with include !== false (default is included)
for (const prop of bundle.properties || []) {
  if (prop.include === false) {
    continue;
  }

  const examplePath = schemaIdToExamplePath(prop.schemaId);
  if (!examplePath || !fs.existsSync(examplePath)) {
    console.warn(
      "⚠️ Missing example for",
      prop.jsonPath,
      "schemaId:",
      prop.schemaId,
      "expected at:",
      examplePath
    );
    continue;
  }

  const example = JSON.parse(fs.readFileSync(examplePath, "utf8"));

  // jsonPath is a simple top-level key for now
  profile[prop.jsonPath] = example;
  includedSegments.push(prop.jsonPath);
}

// Optional meta block
profile._profileMeta = {
  bundleId: bundle.bundleId,
  schemaId: bundle.schemaId,
  generatedFrom: "bundle + per-segment valid examples",
  generatedAt: new Date().toISOString()
};

const outPath = path.join(
  packagesDir,
  "travelProfile",
  "json",
  "samples",
  "TravelProfile.valid.json"
);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(profile, null, 2) + "\n");

console.log("✅ Wrote TravelProfile sample:", path.relative(repoRoot, outPath));
console.log(
  "   Included segments:",
  includedSegments.length > 0 ? includedSegments.join(", ") : "(none)"
);
