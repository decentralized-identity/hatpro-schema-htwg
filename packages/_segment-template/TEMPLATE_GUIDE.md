# HATPRO Segment Template Guide (DEV)

This folder is the canonical template for creating new segments or sub-segments
under the `packages/` directory.

## Core invariants

1. Atomic PUML sources: one class or enum per `.puml` file.
2. Explicit `!include` for all diagram dependencies.
3. Canonical `$ref` in SCHEMAHINTS for schema dependencies.
4. Optional local library under `puml/commonLib/` with mirrored JSON outputs.
5. Template JSON files exist only under `json/templates/**`.

## Instantiation

```sh
TARGET=packages/<path>/<NewSegmentName>
cp -R packages/_segment-template "$TARGET"
```

After copying:
- Update `README.md` and `SUBSEGMENTS.md`
- Add atomic `.puml` files
- Use `puml/commonLib/` only if shared components are required

For full modeling rules and review criteria, see:
`docs/SEGMENT_MODELING_MANUAL.md`
