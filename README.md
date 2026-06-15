# HATPro Schema Working Group Repository (HTWG)

> **Status:** Working repository under active development
> **Repository:** `hatpro-schema-htwg`

**Notes:** 
- Project website: https://htwg.identity.foundation/

- Primary contact:
  [Neil Thomson - co-chair DIF Hospitality and Travel WG](mailto:neil.thomson@queryvision.com) 

- [Download the **HATPro Implementation Guide Specification**](https://raw.githubusercontent.com/decentralized-identity/hatpro-schema-htwg/main/docs/ImplementationGuide/HATPro%20Implementation%20Guide.pdf)

- See the following supplemental README documents
  - [Developer README](docs/README_forDEVs.md)
  - [Project State README](docs/README_ProjectState.md)

# Overview

This repository contains exploratory and evolving work related to the Hospitality and Travel Profile (HATPro) initiative.

The project is focused on developing structured, interoperable data models and supporting artifacts for hospitality and travel ecosystems, including:

- traveler profile schemas
- preferences and support needs
- modular JSON Schema structures
- PlantUML domain modeling
- schema generation tooling
- validation tooling
- documentation and implementation guidance

The repository has been reorganized into a more structured long-term engineering and standards-oriented layout.

# Project Goals

Current goals include:

- development of modular JSON Schema models
- support for decentralized/self-managed traveler profile concepts
- interoperability across hospitality and travel systems
- reusable common data components
- generation pipelines between UML and JSON Schema
- tooling and validation support
- schema governance and maintainability

The repository is intended to support ongoing experimentation, modeling, collaboration, and eventual standards-oriented deliverables.

# Repository Structure (Initial)

> This structure is still evolving.

## Major Areas

| Folder      | Purpose                                                 |
| ----------- | ------------------------------------------------------- |
| `packages/` | Core schema/model packages                              |
| `docs/`     | Documentation and developer guidance                    |
| `tools/`    | Validation, generation, and utility tooling             |
| `scripts/`  | Build and automation scripts                            |
| `labs/`     | Experimental or exploratory work                        |
| `working/`  | Local scratch/work-in-progress content (ignored by Git) |

# Current Modeling Areas

Initial modeling areas include:

- traveler identity structures
- names and international naming models
- contact and communication models
- preferences and support needs
- food and dietary preference structures
- substance exposure risk models
- travel profile presentation/query concepts
- reusable common library components

# Technologies and Formats

Current repository technologies include:

- JSON Schema
- PlantUML
- Node.js tooling
- AJV validation
- Markdown documentation

# Repository Governance

This repository is transitioning toward a more structured governance and contribution workflow.

Current practices include:

- feature/topic branches
- pull requests
- squash merges
- modular repository organization
- tracked generated deliverables
- structured cleanup of transient artifacts

# AI-Generated Content Notice

Portions of this repository — including documentation, structural proposals, schema scaffolding, naming suggestions, and workflow guidance — may be partially AI-assisted or AI-generated.

All generated material should be treated as:

- draft engineering content
- subject to human review
- subject to correction and restructuring
- non-authoritative until reviewed and accepted

Repository maintainers are responsible for validating all technical, architectural, governance, and standards-related content.

# Repository Status

This repository is currently:

- under active restructuring
- not yet stable
- subject to significant refactoring
- evolving in both structure and scope

Consumers and contributors should expect:

- naming changes
- folder reorganization
- schema evolution
- tooling updates
- documentation expansion

# Future Areas

Planned or potential future areas may include:

- schema publishing workflows
- CI/CD validation pipelines
- schema bundling
- example catalogs
- implementation guidance
- interoperability testing
- standards coordination artifacts
- contributor onboarding documentation

# Contribution Notes

Contribution guidance is still being developed.

Until formal contribution documentation exists:

- prefer small focused pull requests
- separate unrelated changes
- avoid committing transient local artifacts
- use `/working/` folders for scratch content

# License

License and contribution policies are still under review.

# Contact / Affiliation

This repository is associated with ongoing work in hospitality, travel, digital identity, and interoperable data modeling communities, including exploratory collaboration related to decentralized identity and standards initiatives.

Further governance and affiliation details will be added later.