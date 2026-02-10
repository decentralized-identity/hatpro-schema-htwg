---
schemahints_version: 1.3
status: current
last_updated: 2026-01-08
---

# SCHEMAHINTS Cheatsheet — v1.3 (aligned with tooling)

## Minimal class note

```puml
note right of SomeClass
SCHEMAHINTS
  title: SomeClass
  additionalProperties: false
  required:[a,b]

  field a:
    type: string
    minLength: 1

  field b:
    $ref: /core/commonLib/OtherClass
end note
```

## Common field tokens
- `type: string|number|integer|boolean|object|array`
- `$ref: /seg/sub/Name` → `$ref: <baseId>seg/sub/Name.schema.json`
- `desc: ...` → `description`
- `default: ...`
- `const: ...`
- `format: date|date-time|email|uri|...`
- `range:[min,max]` → `minimum` / `maximum`
- `minLength`, `maxLength`
- `pattern: <regex>`

## Arrays

```puml
field codes:
  type: array
  items:
    type: string
```

Array of referenced objects:

```puml
field names:
  type: array
  items:
    $ref: /core/identity/TravelerName
```

## Root helpers (optional)
- `xor: [[a,b],[c,d,e]]`
- `atleastone: (a|b|c)` or `atleastone: [a,b,c]`
- `oneOf: ["/core/A", "/core/B"]`
- `anyOf: [...]`
- `allOf: [...]`

## Enums (canonical): enumDefine

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

Behavior:
- Class schema `$ref` → `<baseId>core/commonLib/TextEncodingEnum.json`
- Enum generator emits enum JSON at `packages/<seg>/json/enums/...` plus optional wrapper `.../schemas/...Enum.schema.json`

## Enums (lightweight): enumValuesFrom

```puml
field encoding:
  type: string
  enumValuesFrom: /core/commonLib/TextEncodingEnum
```

Emits:
- `type`
- `x-enumValuesFrom` (derived enum JSON path)

## Lint
Run `tools/lint-schemahints.mjs` (optionally with `--forbidEnumFrom`) to enforce policy and catch typos in enum definitions.
