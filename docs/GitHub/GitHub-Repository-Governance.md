GitHub – HATPro Repository Governance

Author: Steven Soe

V 1.0

Table of Contents

[Introduction](#introduction)

[Roles & Responsibilities](#roles--responsibilities)

[Versioning](#versioning)

[Repository Structure](#repository-structure)

[Branch Protection Rules](#branch-protection-rules)

[CODEOWNERS File](#codeowners-file)

[Pull Request & Issue Templates](#pull-request--issue-templates)

[Pull Request Template](#pull-request-template)

[Issue Template](#issue-template)

[Bug Report (bug_report.md)](#bug-report-bug_reportmd)

[Feature Request (feature_request.md)](#feature-request-feature_requestmd)

[Breaking Change RFC (rfc.md)](#breaking-change-rfc-rfcmd)

[Workflow Model](#workflow-model)

[Standard Contributor Flow](#standard-contributor-flow)

[Breaking Change (RFC) Flow](#breaking-change-rfc-flow)

[Pull Request Validation](#pull-request-validation)

# Introduction

This document proposes a standardised governance framework for managing the HATPro open-source schema repository on GitHub.

It includes how changes are controlled through defined roles, pull request workflows, automated validation, and approval processes for consistency, and traceability.

# Roles & Responsibilities

Clear role definitions ensure accountability across the repository lifecycle. The table below maps each role to its responsibilities and permissions.

| Role                       | Responsibilities                                                                         | Permission       | CODEOWNERS Path           |
|----------------------------|------------------------------------------------------------------------------------------|------------------|---------------------------|
| Core HATPro Steering Group | Approve breaking changes via RFC process, set strategic direction                        | Admin            | All paths                 |
| Core HATPro Technical WG   | Merge PRs, approve RFCs, manage releases, enforce branch rules                           | Admin / Maintain | /schema/\*\*              |
| Docs Team                  | Review and approve example, documentation PRs, maintain changelog, integration scenarios | Write            | /docs/\*\* /examples/\*\* |
| External Contributor       | Submit PRs from forks, raise issues, participate in discussions                          | Read / Triage    | N/A                       |

# Versioning

This project follows Semantic Versioning (SemVer). Version numbers take the form MAJOR.MINOR.PATCH.

| Type            | Version Bump           | RFC Required? | Example                |
|-----------------|------------------------|---------------|------------------------|
| Breaking change | MAJOR  (1.0.0 → 2.0.0) | Yes           | Remove required field  |
| New feature     | MINOR  (1.0.0 → 1.1.0) | No            | Add optional field     |
| Bug fix         | PATCH  (1.0.0 → 1.0.1) | No            | Fix typo in field name |

# Repository Structure

The repository follows a standard layout with protected main, feature branches, and GitHub-specific configuration files under .github/.

main (protected)

feature/\* — new features and enhancements

fix/\* — bug fixes

docs/\* — documentation-only changes

.github/

workflows/ — CI/CD pipeline YAML files

ISSUE_TEMPLATE/ — Bug report & feature request templates

PULL_REQUEST_TEMPLATE.md — Standard PR checklist

schema/ — Core schema files

docs/ — Documentation

examples/ — Use Cases/ Integration examples

CHANGELOG.md — Version history

CODEOWNERS — Automated review assignments

# Branch Protection Rules

The Ruleset configuration for the repository targeting the main branch.

Path: Settings \> Rules \> Rulesets \> New branch ruleset.

Set branch targeting criteria to 'main' and configure the rules as below.

| Rules to enable                                                     | Priority | Remarks                                                                                                             |
|---------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------|
| Restrict deletions                                                  | Critical | Only admins with bypass permission can delete the main branch                                                       |
| Block force pushes                                                  | Critical | Prevents anyone from overwriting history on main                                                                    |
| Require a pull request before merging                               | Critical | Prevents anyone pushing directly to main. Expands to show approval count and code owner settings.                   |
|  → Required approvals: 2                                            | Critical | Level of approval hierarchy required                                                                                |
|  → Dismiss stale pull request approvals when new commits are pushed | High     | Forces re-review if the PR is updated after approval                                                                |
|  → Require review from Code Owners                                  | Critical | Ensures domain experts review their areas (schema, docs, examples)                                                  |
| Require status checks to pass                                       | Critical | Continuous Integration must pass before merge. Add job names: validate-schema, lint, test-examples, check-changelog |
| Require linear history                                              | High     | Enforces squash-only merges — keeps git log clean and readable                                                      |

# CODEOWNERS File

To create a CODEOWNERS file in the repository root or .github/ directory.

GitHub uses this to automatically request reviews from the correct team when files in the mapped paths are changed.

\# Core schema — requires core maintainer sign-off

/schema/\*\* @neiljthomson

\# Documentation — docs team reviews

/docs/\*\* @documentation-team

\# Governance files — steering group must approve

CODEOWNERS @neiljthomson

CHANGELOG.md @neiljthomson

# Pull Request & Issue Templates

## Pull Request Template

To create .github/PULL_REQUEST_TEMPLATE.md with the following content.

This checklist auto-populates on every new PR.

\#\# Summary

\<!-- What does this PR do? Link to the related issue. --\>

Closes \#

\#\# Type of Change

\- [ ] Bug fix (patch)

\- [ ] New feature (minor)

\- [ ] Breaking change (major — requires RFC)

\- [ ] Documentation only

\#\# Checklist

\- [ ] Schema validated against all examples

\- [ ] CHANGELOG.md updated

\- [ ] Tests pass locally

\- [ ] Docs updated (if applicable)

\- [ ] RFC linked (if breaking change)

## Issue Template

To create the following templates under .github/ISSUE_TEMPLATE/ so contributors can raise issues consistently.

### Bug Report (bug_report.md)

name: Bug Report

about: Report a schema or tooling bug

labels: bug

\---

\*\*Describe the bug\*\*

\*\*Steps to reproduce\*\*

\*\*Expected behaviour\*\*

\*\*Schema version affected\*\*

### Feature Request (feature_request.md)

name: Feature Request

about: Suggest a backward-compatible addition

labels: enhancement

\---

\*\*What problem does this solve?\*\*

\*\*Proposed solution\*\*

\*\*Alternatives considered\*\*

### Breaking Change RFC (rfc.md)

name: RFC — Breaking Change Proposal

about: Propose a breaking schema change for Core Steering Group review

labels: RFC, breaking-change

\---

\*\*Problem Statement\*\*

\*\*Proposed Change\*\*

\*\*Impact Assessment\*\*

\*\*Alternatives Considered\*\*

\*\*Target Major Version\*\*

# Workflow Model

## Standard Contributor Flow

| Step | Task                                    | Owner                                  | Type               |
|------|-----------------------------------------|----------------------------------------|--------------------|
| 1    | Create working copy (fork or branch)    | Contributor  (External / Internal)     | Manual             |
| 2    | Make changes (code, schema, docs)       | Contributor                            | Manual             |
| 3    | Run local checks (validation, linting)  | Contributor                            | Manual             |
| 4    | Submit Pull Request (PR)                | Contributor                            | Manual             |
| 5    | Run CI checks (build, validation, lint) | System (GitHub Actions)                | Automated          |
| 6    | Assign reviewers (via CODEOWNERS)       | System (GitHub)                        | Automated          |
| 7    | Review changes                          | Code Owners / Reviewers                | Manual             |
| 8    | Approve PR (min. 2 approvals)           | Code Owners / Reviewers                | Manual             |
| 9    | Merge PR to main                        | Maintainer  (or auto-merge if enabled) | Manual / Automated |

## Breaking Change (RFC) Flow

*(Executed BEFORE the standard workflow)*

| Step | Task                                                                 | Owner                                   | Type               |
|------|----------------------------------------------------------------------|-----------------------------------------|--------------------|
| 1    | Open a GitHub Issue using the RFC: Breaking Change Proposal template | Contributor                             | Manual             |
| 2    | Apply labels (RFC, breaking-change)                                  | Core Maintainer                         | Manual             |
| 3    | Conduct community discussion (minimum xx days)                       | Community (All contributors/ WG)        | Manual             |
| 4    | Vote by Core Steering Group (majority approval required)             | Core Steering Group                     | Manual             |
| 5    | Link approved RFC in the PR description                              | Contributor                             | Manual             |
| 6    | Implement change via standard workflow (Steps 1–9) above             | Contributor + Technical WG + Maintainer | Manual / Automated |
| 7    | Release under next MAJOR version bump                                | Core Maintainer                         | Manual             |

# Pull Request Validation

All of the following status checks must pass before a PR can be merged. These are defined as jobs in .github/workflows/ and must match the required status checks.

| Check Name      | What It Does                                                |
|-----------------|-------------------------------------------------------------|
| validate-schema | Ensures schema files follow the correct structure and rules |
| lint            | Ensures code style and formatting are consistent            |
| test-examples   | Ensures all examples work with the current schema           |
| check-docs      | Ensures documentation is properly formatted                 |
| check-changelog | Ensures the changelog is updated for the change             |
