---
schemahints_version: 1.3
status: current
last_updated: 2026-01-08
source_of_truth: tools/*.mjs (generate-json-schema-from-puml.mjs, generate_json-enums-from-puml.mjs, lint-schemahints.mjs)
---

# SCHEMAHINTS v1.3 — Developer Specification (PlantUML note DSL)

SCHEMAHINTS is a compact, line-oriented DSL embedded inside PlantUML `note ... end note` blocks. The tooling parses SCHEMAHINTS and generates **JSON Schema draft-2020-12** plus related artifacts (enum JSON, optional enum schema wrappers, samples, and AJV validation).

This document is aligned to the **v1.3 tooling** (see `tools/generate-json-schema-from-puml.mjs` and `tools/generate_json-enums-from-puml.mjs`).

## 1. Placement and extraction

A SCHEMAHINTS block is a PlantUML `note` attached to a class:

```puml
note right of SomeClass
SCHEMAHINTS
  ...directives...
end note
```

Tooling detects a block if any line matches `^\s*SCHEMAHINTS\b` (version suffixes are ignored by the parser; prefer the literal `SCHEMAHINTS`).

## 2. Indentation and comments

- Indentation is significant only for nested objects; **2 spaces** is the project convention.
- Lines starting with a single quote `'` are treated as comments by the generators.
- Blank lines are permitted, but the authoring convention is to keep blocks compact.

## 3. Root (class-level) directives

Supported root directives:

- `title: <string>` — schema title (optional; defaults to class name)
- `description: <string>` — schema description (optional)
- `required:[a,b,c]` — list of required properties (optional)
- `additionalProperties: true|false` — default is tool-defined; project convention is `false`
- Logical/composition helpers:
  - `xor: [[a, b], [c, d, e]]` — mutually-exclusive *groups*
  - `atleastone: (a|b|c)` **or** `atleastone: [a, b, c]` — require at least one field
  - `oneOf: ["/seg/sub/Name", ...]`
  - `anyOf: ["/seg/sub/Name", ...]`
  - `allOf: ["/seg/sub/Name", ...]`

### 3.1 `$ref` resolution for composition lists

For `oneOf/anyOf/allOf`, each entry is treated as a **path-like reference** that is converted to an absolute `$ref`:

- `"/core/commonLib/Foo"` → `$ref: <baseId>core/commonLib/Foo.schema.json`

## 4. Field blocks

Fields are declared using `field <name>:` blocks:

```puml
field code:
  type: string
  pattern: ^[A-Z]{3}$
  desc: 3-letter code
```

Supported field directives (class schema generator):

- `type: <json-schema-type>` — `string|number|integer|boolean|object|array`
- `$ref: <path>` — path-like reference to another class schema
- `desc: <string>` — maps to JSON Schema `description`
- `default: <scalar>` — number/boolean/string (unquoted strings are accepted)
- `const: <scalar>` — fixed value
- `format: <string>` — e.g., `date`, `date-time`, `email`, `uri`
- `range:[min,max]` — numeric min/max (maps to `minimum` / `maximum`)
- `minLength: <int>`, `maxLength: <int>`
- `pattern: <regex>`

### 4.1 Arrays (`items:`)

For arrays, nested `items:` is supported:

```puml
field tags:
  type: array
  items:
    type: string
```

or array of referenced objects:

```puml
field names:
  type: array
  items:
    $ref: /core/identity/TravelerName
```

### 4.2 Inline object shapes (`properties:`)

For nested object definitions, a nested `properties:` object is supported for `type: object`. Use sparingly; prefer first-class classes for reuse.

## 5. Enums

### 5.1 Canonical enum workflow: `enumDefine` (externalized enums)

`enumDefine` is the canonical mechanism for stable, shared enums. It is parsed inside a field block.

```puml
field encoding:
  enumDefine:
    enumId: /core/commonLib/TextEncodingEnum
    targetPath: /core/json/enums/commonLib/TextEncodingEnum
    sourcePath: /core/puml/commonLib/TextEncodingEnum.puml
    generate: true
    title: "Character Encodings"
    type: string
    enum:[UTF-8, UTF-16LE, Windows-1252]
```

**Behavior**
- Class schemas will `$ref` the enum JSON `$id`: `<baseId><enumId>.json`.
- Enum JSON files (values) and optional enum schema wrappers are emitted by `generate_json-enums-from-puml.mjs`.

**Key requirements (enforced by linter policy)**
- `enumId` is required and must start with `/`.
- `enumFrom` is not implemented by generators; avoid it.

### 5.2 `enumValuesFrom` (lightweight linkage)

`enumValuesFrom: /seg/sub/EnumName` marks the field as a primitive typed value backed by an external enum file. The class schema generator emits:
- `type` (default `string` if not provided)
- `x-enumValuesFrom` with the derived enum JSON path

This is intended for downstream tooling, not as a JSON Schema `$ref` linkage.

## 6. Output mapping and `$id` rules

Given a PUML file at:

- `packages/<seg>/puml/<subs>/X.puml`

The class schema generator emits:

- `packages/<seg>/json/schemas/<subs>/<ClassName>.schema.json`
- `$id`: `<baseId><seg>/<subs>/<ClassName>.schema.json`

The enum generator emits (for each `enumDefine` with `generate: true` when enum emission is enabled in your scripts):

- Enum JSON values: `packages/<seg>/json/enums/<subs>/<EnumName>.json`
  - `$id`: `<baseId><enumId>.json`
- Optional enum schema wrapper: `packages/<seg>/json/schemas/<subs>/<EnumName>.schema.json`
  - `$id`: `<baseId><enumId>.schema.json`

Project convention is that class schemas `$ref` the enum JSON values `$id` (the `.json` form).

## 7. Validation with AJV

- All generated `*.schema.json` and emitted enum JSON are validated with AJV.
- `$ref` resolution is based on `$id` (absolute URIs under `--baseId`).

## 8. Linting policy

Use `tools/lint-schemahints.mjs` to enforce:
- `enumDefine` key allowlistP0
list and required fields
- `enumFrom` usage policy (warning by default; can be escalated to error)

## 9. Notes on legacy v0.1 docs

Earlier v0.1 documentation used `SCHEMAHINTS v0.1` headers and `ref:` / `itemsRef:` tokens. Those are not part of the v1.3 tooling surface and should be treated as deprecated.
