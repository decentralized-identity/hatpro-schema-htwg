#!/usr/bin/env node
// generate_json-enums-from-puml.mjs  (v1.3 patched)
//
// Generates enum JSON Schema (and optional wrapper *.schema.json) from PlantUML files
// containing SCHEMAHINTS.
//
// Supports v1.2+ keys inside a field block:
//   SCHEMAHINTS v0.1
//     field encoding:
//       enumDefine:
//         enumId: /core/commonLib/SomeEnum
//         type: string
//         enum: [a, b, c]
//         generate: true
//         sourcePath: /core/puml/commonLib/SomeEnum.puml
//         targetPath: /core/json/enums/commonLib/SomeEnum
//
// Patch notes:
//  - Accept both "end note" and "endnote" (and variants) in PlantUML note parsing.
//  - Move provenance from top-level "x-sourcePath" to $defs.meta.$comment to satisfy Ajv strict.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

/** Simple CLI arg parser */
function parseArgs(argv) {
  const args = {
    baseId: undefined,
    packagesDir: "./packages",
    file: undefined
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--baseId") {
      args.baseId = argv[++i];
    } else if (a === "--packagesDir") {
      args.packagesDir = argv[++i];
    } else if (a === "--file") {
      args.file = argv[++i];
    } else if (a === "--help" || a === "-h") {
      args.help = true;
    } else {
      // tolerate positional file as a convenience
      if (!args.file && a && !a.startsWith("-")) args.file = a;
    }
  }
  return args;
}

function usage() {
  console.log(`
Usage:
  node tools/generate_json-enums-from-puml.mjs --baseId <base> --packagesDir <dir> [--file <pumlFile>]

Examples:
  node tools/generate_json-enums-from-puml.mjs --baseId https://schemas.example.org/hatpro/ --packagesDir ./packages
  node tools/generate_json-enums-from-puml.mjs --baseId https://schemas.example.org/hatpro/ --packagesDir ./packages --file packages/physicalLocation/puml/DeliveryContextEnum.puml
`.trim());
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function isPumlFile(file) {
  return file.toLowerCase().endsWith(".puml");
}

/** Walk a directory recursively and return all .puml files */
function listPumlFiles(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && isPumlFile(full)) out.push(full);
    }
  }
  return out;
}

/**
 * Extracts all PlantUML notes "note ... end note/endnote" text blocks.
 * Patch: end\\s*note accepts endnote, end note, end     note.
 */
function extractNoteBlocks(pumlText) {
  // NOTE: This is intentionally permissive. We match:
  //   note right of X
  //   ...
  //   end note
  // as well as "endnote"
  const noteRe = /note\s+(?:right|left|over)\s+of[\s\S]*?end\s*note/gi; // patched
  const matches = pumlText.match(noteRe);
  return matches || [];
}

/**
 * Extract SCHEMAHINTS blocks from note blocks.
 * Returns list of schemahint text (the lines after "SCHEMAHINTS" header).
 */
function extractSchemaHints(noteBlocks) {
  const out = [];
  for (const note of noteBlocks) {
    const idx = note.indexOf("SCHEMAHINTS");
    if (idx < 0) continue;
    // keep from SCHEMAHINTS to end, then strip leading lines before header
    const block = note.slice(idx);
    out.push(block);
  }
  return out;
}

/**
 * Very small "SCHEMAHINTS" parser for enumDefine blocks.
 * It is intentionally conservative and expects YAML-ish indentation.
 * Returns array of { enumDefine: {...} } objects.
 */
function parseEnumDefines(schemaHintBlocks) {
  const results = [];

  for (const block of schemaHintBlocks) {
    const lines = block.split(/\r?\n/);

    // We'll scan for a line that contains "enumDefine:" and parse its indented children
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const m = /^(\s*)enumDefine:\s*$/.exec(line);
      if (!m) continue;

      const baseIndent = m[1].length;
      const ed = {};
      i++;

      for (; i < lines.length; i++) {
        const l = lines[i];
        if (!l.trim()) continue;

        const indent = (l.match(/^(\s*)/)?.[1]?.length) ?? 0;

        // Stop when indentation goes back to enumDefine level or less
        if (indent <= baseIndent) {
          i--; // step back so outer loop continues correctly
          break;
        }

        // Parse "key: value"
        const kv = /^\s*([A-Za-z0-9_.-]+)\s*:\s*(.*)\s*$/.exec(l);
        if (!kv) continue;

        const key = kv[1];
        let val = kv[2];

        // Parse arrays like [a, b, c]
        if (val.startsWith("[") && val.endsWith("]")) {
          const inside = val.slice(1, -1).trim();
          const arr = inside
            ? inside.split(",").map(x => x.trim()).filter(Boolean)
            : [];
          ed[key] = arr;
        } else if (val === "true" || val === "false") {
          ed[key] = (val === "true");
        } else {
          // keep raw string (no quote stripping here)
          ed[key] = val;
        }
      }

      results.push(ed);
    }
  }

  return results;
}

/**
 * Convert enumDefine into:
 *  - enum JSON schema (DeliveryContextEnum.json)
 *  - optional wrapper schema (DeliveryContextEnum.schema.json) referencing the enum schema
 */
function emitEnumFromDefine(ed, originFile, baseId) {
  const enumId = ed.enumId;
  if (!enumId || typeof enumId !== "string") return [];

  const typeName = enumId.split("/").filter(Boolean).pop();
  if (!typeName) return [];

  // Determine output target path (repo-relative) from targetPath
  // targetPath examples:
  //   /core/json/enums/commonLib/CountrySubdivisionEnum
  //   /physicalLocation/json/enums/DeliveryContextEnum
  const targetPath = ed.targetPath;
  if (!targetPath || typeof targetPath !== "string") return [];

  const normTarget = targetPath.startsWith("/") ? targetPath.slice(1) : targetPath;

  const enumJsonRel = `${normTarget}.json`;

  // Compose $id for enum json
  const enumJsonId = new URL(enumJsonRel.replace(/\\/g, "/"), baseId).toString();

  // Extract values
  const values = Array.isArray(ed.enum) ? ed.enum.slice() : [];
  if (!values.length) return []; // generator expects an enum list

  // Build the enum JSON schema node
  const node = {
    $id: enumJsonId,
    title: ed.title || typeName,
    type: (ed.type === "integer" ? "integer" : "string"),
    enum: values
  };

  if (typeof ed.description === "string" && ed.description.trim()) {
    node.description = ed.description.trim();
  }
  if (typeof ed.desc === "string" && ed.desc.trim()) {
    // support desc alias (some files use desc)
    node.description = ed.desc.trim();
  }
  if (typeof ed.pattern === "string" && ed.pattern.trim()) {
    node.pattern = ed.pattern.trim();
  }

  // optional extension values (safe to keep if used)
  if (Array.isArray(ed["x-enumNames"])) {
    node["x-enumNames"] = ed["x-enumNames"].slice();
  }

  // Patch: move provenance into $defs.meta.$comment (Ajv strict-safe)
  if (ed.sourcePath) {
    node.$defs ??= {};
    node.$defs.meta = {
      $comment: JSON.stringify({ sourcePath: String(ed.sourcePath) })
    };
  }

  // Wrapper schema output:
  // If targetPath ends with /json/enums/Name, wrapper usually goes to /json/schemas/Name.schema.json
  // but this tool has historically emitted a wrapper next to schemas if generator wants.
  // We infer it by replacing /json/enums/ with /json/schemas/ and appending .schema.json
  const wrapper = [];
  const wantsWrapper = true;

  if (wantsWrapper) {
    const wrapperRel = enumJsonRel
      .replace(/\/json\/enums\//, "/json/schemas/")
      .replace(/\.json$/, ".schema.json");
    const wrapperId = new URL(wrapperRel.replace(/\\/g, "/"), baseId).toString();

    const wrapperNode = {
      $id: wrapperId,
      title: `${typeName}`,
      allOf: [{ $ref: enumJsonId }]
    };

    // put the same strict-safe provenance on the wrapper too (optional but useful)
    if (ed.sourcePath) {
      wrapperNode.$defs ??= {};
      wrapperNode.$defs.meta = {
        $comment: JSON.stringify({ sourcePath: String(ed.sourcePath) })
      };
    }

    wrapper.push({
      relPath: wrapperRel,
      json: JSON.stringify(wrapperNode, null, 2) + "\n"
    });
  }

  return [
    {
      relPath: enumJsonRel,
      json: JSON.stringify(node, null, 2) + "\n"
    },
    ...wrapper
  ];
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.baseId) {
    usage();
    process.exit(args.help ? 0 : 2);
  }

  const baseId = args.baseId.endsWith("/") ? args.baseId : (args.baseId + "/");
  const packagesDir = args.packagesDir;

  const files = [];
  if (args.file) {
    files.push(args.file);
  } else {
    files.push(...listPumlFiles(packagesDir));
  }

  let wrote = 0;

  for (const f of files) {
    const full = path.isAbsolute(f) ? f : path.resolve(f);
    if (!fs.existsSync(full)) continue;

    const txt = readText(full);
    const notes = extractNoteBlocks(txt);
    if (!notes.length) continue;

    const hints = extractSchemaHints(notes);
    if (!hints.length) continue;

    const enumDefines = parseEnumDefines(hints);
    if (!enumDefines.length) continue;

    for (const ed of enumDefines) {
      // Only generate when explicitly requested
      if (ed.generate !== true && String(ed.generate).toLowerCase() !== "true") continue;

      const outputs = emitEnumFromDefine(ed, full, baseId);
      if (!outputs.length) continue;

      for (const o of outputs) {
        // write outputs under packagesDir root
        const outPath = path.resolve(packagesDir, o.relPath);
        writeText(outPath, o.json);
        wrote++;
      }
    }
  }

  // keep quiet on success (your current convention),
  // but leave a non-zero code only for exceptional failures.
  // If you want visibility, uncomment:
  // console.log(`Generated ${wrote} enum artifacts.`);
}

main();
