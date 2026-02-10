# HATPro Segment Structure

This segment follows the agreed HATPro schema layout for Schema Segments (or Sub-Segments)

```
packages/
  <Segment-Name>/
    puml/
      Name.puml
    json/
      schemas/      # generated JSON Schemas (output)
      enums/        # generated enum JSONs (only if this segment defines enums)
      examples/     # example instances (.json) used for illustration or as test cases used by AJV verification/validation or format test suites
      templates/    # generated JSON templates for creating examples/test cases
    scripts/        # segment-specific scripts
      
```

## Scripts
Scripts (npm) are defined in the GitHub package.json file found in the repository root. For HATPro, npm scripts are primarily built around Node.js (.mjs) executables found in the <repo>/tsegment-specificools folder

Scripts typically have the option of applying to the entire HATPro schema or individual Segments (and possibly sub-segments - later feature)
