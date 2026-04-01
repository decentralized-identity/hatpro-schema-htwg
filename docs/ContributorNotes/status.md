# Status - hatpro-schema-temp

## Purpose
Push and PR outstanding changes to Main 

---

## 2026-04-01 <Update title>

### Current state
Due to poor Git habits by the developer, the HATPro GitHub repository hatpro-schema-temp has not been updated since sometime in Nov 2025. The biggest mistake was not pushing exploratory work into a separate branch and failing to regularly "push to origin" to share updates. 

A merged on-local-disk version of the latest changes vs the main branch code has been completed and verified

- **Repo folder:** C:\Users\nthomson\Projects\hatpro-schema-temp_RECONCILE
- **Git branch:** wip-sync-2026-02-09

### Changes since last update
- Substantial changes to both the Schema and tooling 

### Current focus
- Get the current project files updated so other contributors can get up to date with the last content
- Ensure that the state of the origin (DIF repository on GitHub.com) is in a working state ready for regular, standard, frequent updates and 

### Open issues/blockers
- Due to bugs in the npm/.mjs development workflow tooling to generate JSON Schema, JSON from .puml source files and verify/validate with valid and invalid tests for each component, plus lack of coverage of functional invalid/valid test cases, the AJV (node.js Java Schema validation and utility library) based validation tests were failing. As this validation step was incorporated into the push/PR workflow to .origin, the push/PR failed, blocking sharing of the content

### Dependencies/Coordination notes
- none

### Next likely step
- Check and understand the current validation and verification workflow, including the criteria for running valid and invalid HATPro schema tests against .json components and .json profile component assemblies

### PR Description

Summary

- Reconciles locally integrated WIP updates into 'main'

What changed

- merged newer schema/model changes
- included tooling and support file updates
- aligned repo state after local verification

Validation

- manually reviewed and verified before commit/push
- local .git snapshots archived before PR creation

Review notes

- this PR is intended as a synchronization/reconciliation baseline rather than a narrow feature change

### Bottom line

Ensure the push/PR flow works and retrieving a new branch to a contributor's machine is successful and functional

PR 