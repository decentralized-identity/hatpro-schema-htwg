// tools/test-templates.mjs
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
let packagesDir = "./packages";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--packagesDir" && args[i + 1]) {
    packagesDir = args[i + 1];
    i++;
  }
}

console.log(`[test:templates] Using packagesDir = ${packagesDir}`);

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

const templateFiles = walkDir(packagesDir, (p) =>
  p.endsWith(".template.json") && p.includes(path.join("json", "templates"))
);

if (templateFiles.length === 0) {
  console.error("[test:templates] No *.template.json files found");
  process.exit(1);
}

let okCount = 0;

for (const filePath of templateFiles) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    JSON.parse(raw);
    okCount++;
  } catch (e) {
    console.error(
      `[test:templates] FAILED to parse ${filePath}:`,
      e.message
    );
    process.exit(1);
  }
}

console.log(
  `[test:templates] All ${okCount} templates parsed successfully. ✅`
);
