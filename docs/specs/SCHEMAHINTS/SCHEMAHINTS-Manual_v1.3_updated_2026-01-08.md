---
schemahints_version: 1.3
status: current
last_updated: 2026-01-08
---

# SCHEMAHINTS & ENUMHINTS — Authoring Manual (v1.3 aligned)

This manual explains how to author SCHEMAHINTS blocks in PlantUML so the Node.js tooling can generate JSON Schema (draft‑2020‑12), enum JSON artifacts, and validate everything with AJV.

This version is aligned to the v1.3 tools:
- `tools/generate-json-schema-from-puml.mjs` (class schemas)
- `tools/generate_json-enums-from-puml.mjs` (enum JSON + optional wrappers)
- `tools/validate-with-ajv.mjs`
- `tools/lint-schemahints.mjs`

## 1) Quick start

```puml
class TravelProfile

note right of TravelProfile
SCHEMAHINTS
  title: TravelProfile
  additionalProperties: false
  required:[identity]

  field identity:
    $ref: /core/identity/Identity
end note
```

## 2) How `$id` and `$ref` are formed

Assuming `--baseId https://schemas.example.org/hatpro/`:

- Class schema `$id`:
  - `<baseId><seg>/<subs>/<ClassName>.schema.json`
- Path-like `$ref`:
  - `$ref: /core/commonLib/Foo` → `<baseId>core/commonLib/Foo.schema.json`

Practical rule: treat `$ref` values in hints as **model paths**, not file paths.

## 3) SCHEMAHINTS grammar (tooling-aligned)

### 3.1 Header
The generator enters “hints mode” at the first line matching `SCHEMAHINTS`. Version suffixes are ignored; prefer:

```text
SCHEMAHINTS
```

### 3.2 Root directives
- `title: ...`
- `description: ...`
- `required:[a,b,c]`
- `additionalProperties: true|false`
- `xor: [[a,b],[c,d,e]]`
- `atleastone: (a|b|c)` or `[a,b,c]`
- `oneOf/anyOf/allOf: ["/seg/sub/Name", ...]`

### 3.3 Field blocks
```text
field <name>:
  type: string|number|integer|boolean|object|array
  $ref: /seg/sub/Name
  desc: ...
  default: ...
  const: ...
  format: ...
  range:[min,max]
  minLength: n
  maxLength: n
  pattern: ...
```

### 3.4 Arrays
```text
field members:
  type: array
  items:
    $ref: /core/identity/TravelerName
```

### 3.5 Inline object properties (advanced)
```text
field meta:
  type: object
  properties:
    createdAt: { type: string, format: date-time }
    source:    { type: string }
```

Use this only for small, non-reusable sub-objects.

## 4) Enums: canonical externalization via `enumDefine`

### 4.1 Why externalize
Externalized enums provide stable `$id` / `$ref`, reuse across schemas, and allow enum values to live in dedicated JSON artifacts.

### 4.2 Authoring pattern
```puml
field script:
  enumDefine:
    enumId: /core/common/ScriptEnum
    targetPath: /core/json/enums/common/ScriptEnum
    sourcePath: /core/puml/common/ScriptEnum.puml
    generate: true
    title: "Scripts"
    type: string
    enum:[Latn, Cyrl, Hani]
    x-enumNames:["Latin","Cyrillic","Han"]
    x-enumDescriptions:["Latin scripts","Cyrillic scripts","Han scripts"]
```

### 4.3 Emission behavior
- The class schema generator turns the field into:
  - { "$ref": "<baseId><enumId>.json" }
- The enum generator emits:
  - enum JSON values: `$id = <baseId><enumId>.json`
  - optional wrapper schema: `$id = <baseId><enumId>.schema.json`

### 4.4 Allowed `enumDefine` keys (linted allowlist)
- `enumId` (required), `targetPath`, `sourcePath`, `title`, `type`, `generate`, `enum`
- `x-enumNames`, `x-enumDescriptions`, `x-order`, `x-deprecated`, `x-aliases`
- `description` / `desc`
- `pattern`, `x-standard`, `x-standardRef`
- `valuePattern` (if present, linter checks it is a valid RegExp)

## 5) `enumValuesFrom` (lightweight linkage)

`enumValuesFrom: /seg/sub/EnumName` does **not** create a `$ref`. It annotates the schema with `x-enumValuesFrom` so downstream tooling can locate enum values. Use when you intentionally want a primitive schema (e.g., `type: string`) but still want traceability to an enum source.

## 6) Linting and validation workflow

Recommended local workflow:
```bash
node tools/lint-schemahints.mjs --packagesDir packages
node tools/generate_json-enums-from-puml.mjs --baseId https://schemas.example.org/hatpro/
node tools/generate-json-schema-from-puml.mjs --baseId https://schemas.example.org/hatpro/
node tools/validate-with-ajv.mjs --packagesDir packages
```

## 7) Migration notes (v0.1 → v1.3)

Older v0.1 documentation used:
- `SCHEMAHINTS v0.1` header requirement
- `ref:` / `itemsRef:` tokens
- `type: datetime`

In v1.3 tooling:
- Header is simply `SCHEMAHINTS`
- References use `$ref:` and `items:` blocks
- Date handling is via `type: string` + `format: date-time`

If you have legacy `.puml` hints, treat migration as a mechanical rewrite:
- `ref:` → `$ref:`
- `itemsRef:` → `type: array` + `items: $ref: ...`
- `datetime` → `type: string` + `format: date-time`
