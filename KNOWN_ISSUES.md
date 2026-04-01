# Known Issues

Friday, Feb 13, 2026 Version <MVP "unofficial">

The following are known issues with this version:

- Dependency references for enum files are not resolving correctly due to a file/component referencing bug in the JSON schema/JSON generation automation (2)
- The following components are included
  - core
    - TravelProfile
      - commonLib (various)
  - personalCommInfo
  - contact (1)
  - identity (1)
  - physicalLocation

Notes:

1) The current implementation needs to be updated to a more detailed design
2) In the process of re-validating the existing components and the automation files for turning model/json specification files (.puml) to json schema and json, including valid/invalid test files.
3) There are several components, including the core preference/constraints components, Food Preferences, and SubstanceExposureRisks (Allergies++) prototyped, waiting for an update to GitHub "plumbing" before integrating. 