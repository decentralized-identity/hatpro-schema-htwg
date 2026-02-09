# HATPro - JSON Schema Pipeline: Samples, Tests, Templates

# Introduction
The HATPro project has some key components to creating a large, sophisticated JSON Schema/JSON model of
a Traveler Profile.

Some key elements are:
 - folder structure for GitHub separating different Segments of the profile into mostly self-contained folders (with a top level class) such that segment project teams can work without cross-dependencies other than to agreed common components (core/commonLib) and all asssociated with a top level class (TravelProfile.puml/.schema.json/.json)
 - Use of platform agnostic public, open source tools (e.g., npm, ajv - javaschema verification library, node.js for system commands and general command line executables, ...)
 - leverage GitHub compatible tools, and Git workflows

## Folders
- `json/enums/`      — Enum JSON files (non-empty `enum` arrays).
- `json/schemas/`    — Generated `*.schema.json` files.
- `json/samples/`    — Auto & manual instance docs used to *smoke test* Ajv validation.
  - `json/samples/auto/`   — auto-generated valid/invalid (safe to overwrite)
  - `json/samples/manual/` — hand-written cases (never overwritten)
- `json/tests/manual/` — (optional) hand-written test cases distinct from samples.
- `json/templates/`   — Generated scaffolds to help author manual tests (`*.template.min.json` and `*.template.full.json`).

## Commands (suggested `package.json`)
```json
{
  "scripts": {
    "gen:enums": "node tools/generate-enums.mjs",
    "gen:schemas": "node tools/generate-json-schema-from-puml.mjs --baseId https://schemas.example.org/hatpro/",
    "compile:schemas": "node tools/compile-schemas.mjs",
    "gen:samples": "node tools/generate-samples.mjs --root packages",
    "gen:templates": "node tools/generate-templates.mjs --root packages",
    "validate:samples:auto": "node tools/validate-samples.mjs --root packages --glob 'packages/**/json/samples/auto/**/*.json'",
    "validate:samples:manual": "node tools/validate-samples.mjs --root packages --glob 'packages/**/json/samples/manual/**/*.json'",
    "test:manual": "node tools/validate-samples.mjs --root packages --glob 'packages/**/json/tests/manual/**/*.json'",
    "run:tests": "node tools/run-tests.mjs"
  }
}
```

## Typical workflow
1. `npm run gen:enums -- --segment <seg>`
2. `npm run gen:schemas -- --segment <seg>`
3. `npm run gen:samples` — populate `json/samples/auto` for all schemas.
4. `npm run compile:schemas -- --segment <seg>` — compile with Ajv 2020.
5. `npm run validate:samples:auto` — smoke-check auto samples vs schemas.
6. `npm run gen:templates` — create scaffolds for richer manual tests.
7. Author files under `json/samples/manual/` or `json/tests/manual/` and run `npm run run:tests`.

## Notes
- Auto samples are deliberately *minimal* to ensure Ajv is wired correctly. Complex intent checks belong in manual tests.
- Templates are scaffolds only; adjust or extend for your use-cases.
- The pipeline is segment-agnostic: `compile-schemas.mjs` already supports `--segment` to scope work during refactors.
