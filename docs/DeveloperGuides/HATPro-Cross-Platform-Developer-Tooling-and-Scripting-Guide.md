# HATPro Cross-Platform Developer Tooling & Scripting Guide

**Status:** Draft  
**Project:** HATPro  
**Audience:** Developers, architects, contributors, CI/CD maintainers  
**Last Updated:** 2026-05-06  

---

<!-- toc -->

- [1. Purpose](#1-purpose)
- [2. Guiding Principles](#2-guiding-principles)
  * [2.1 Cross-Platform First](#21-cross-platform-first)
  * [2.2 Avoid Shell-Specific Logic](#22-avoid-shell-specific-logic)
  * [2.3 GitHub Actions Compatibility](#23-github-actions-compatibility)
  * [2.4 Simplicity Over Cleverness](#24-simplicity-over-cleverness)
- [3. Supported Operating Systems](#3-supported-operating-systems)
- [4. Required Developer Tooling](#4-required-developer-tooling)
  * [4.1 Required Tools](#41-required-tools)
  * [4.2 Recommended Tool Versions](#42-recommended-tool-versions)
    + [Node.js](#nodejs)
  * [4.3 Node Version Management](#43-node-version-management)
- [5. Supported Shell Environments](#5-supported-shell-environments)
  * [5.1 Supported Shells](#51-supported-shells)
  * [5.2 Important Clarification](#52-important-clarification)
  * [5.3 Git Bash](#53-git-bash)
  * [5.4 Windows Terminal](#54-windows-terminal)
- [6. Official Scripting Standard](#6-official-scripting-standard)
  * [6.1 Primary Scripting Runtime](#61-primary-scripting-runtime)
  * [6.2 Script Location](#62-script-location)
  * [6.3 npm as the Standard Execution Interface](#63-npm-as-the-standard-execution-interface)
  * [6.4 ES Module Standard](#64-es-module-standard)
- [7. Shell-Specific Scripting Restrictions](#7-shell-specific-scripting-restrictions)
  * [7.1 Avoid Bash-Only Commands](#71-avoid-bash-only-commands)
  * [7.2 Avoid Windows-Specific Commands](#72-avoid-windows-specific-commands)
  * [7.3 Preferred Alternatives](#73-preferred-alternatives)
- [8. Filesystem and Path Guidance](#8-filesystem-and-path-guidance)
  * [8.1 Avoid Hardcoded Paths](#81-avoid-hardcoded-paths)
  * [8.2 Use node:path](#82-use-nodepath)
  * [8.3 Path Separator Guidance](#83-path-separator-guidance)
- [9. Repository Structure Conventions](#9-repository-structure-conventions)
- [10. Git Workflow Guidance](#10-git-workflow-guidance)
  * [10.1 Recommended Basic Workflow](#101-recommended-basic-workflow)
  * [10.2 GitHub Desktop Compatibility](#102-github-desktop-compatibility)
  * [10.3 Branching Strategy](#103-branching-strategy)
- [11. GitHub Actions and CI/CD](#11-github-actions-and-cicd)
  * [11.1 CI/CD Portability Requirement](#111-cicd-portability-requirement)
  * [11.2 GitHub Actions Node Version](#112-github-actions-node-version)
  * [11.3 Future CI/CD Topics](#113-future-cicd-topics)
- [12. Recommended Developer Workflows](#12-recommended-developer-workflows)
  * [12.1 Beginner Windows Workflow](#121-beginner-windows-workflow)
  * [12.2 Advanced Workflow](#122-advanced-workflow)
- [13. Recommended npm Packages](#13-recommended-npm-packages)
- [14. Security and Supply Chain Considerations](#14-security-and-supply-chain-considerations)
- [15. Documentation Standards](#15-documentation-standards)
- [16. Future Tooling Topics](#16-future-tooling-topics)
- [17. Summary](#17-summary)

<!-- tocstop -->

# 1. Purpose

This document defines the standard cross-platform development tooling, scripting conventions, and command-line practices used by the HATPro project.

The goals are to:

- Support development on:
  - Windows 11
  - macOS
  - Linux
  - GitHub Actions CI/CD runners
- Minimize platform-specific scripting issues
- Standardize project automation
- Reduce contributor onboarding complexity
- Avoid shell-specific assumptions
- Provide predictable tooling behavior across environments

This guide applies to:

- Developer tooling
- Repository automation
- Validation scripts
- Schema generation scripts
- CI/CD automation
- Utility scripts
- Git command-line workflows

---

# 2. Guiding Principles

## 2.1 Cross-Platform First

All official project automation must function consistently across supported operating systems.

The project standard is:

- Node.js
- npm
- JavaScript ES Modules (`.mjs`)

Shell environments are considered developer conveniences, not primary runtime dependencies.

---

## 2.2 Avoid Shell-Specific Logic

Official project automation should avoid dependence on:

- Windows-only shell commands
- Bash-only shell commands
- OS-specific filesystem assumptions

Whenever practical:

- Use Node.js APIs instead of shell commands
- Use npm scripts as the public execution interface
- Use cross-platform npm packages where required

---

## 2.3 GitHub Actions Compatibility

All official automation should execute successfully in GitHub Actions Linux runners.

CI/CD compatibility is considered a core portability requirement.

---

## 2.4 Simplicity Over Cleverness

Prefer:

- Readable scripts
- Explicit behavior
- Minimal tooling layers
- Clear dependencies

Avoid:

- Deep shell pipelines
- Complex Bash scripting
- Hidden environmental assumptions
- Overly abstract build systems

---

# 3. Supported Operating Systems

The following operating systems are supported for contributor development:

| Operating System              | Status             |
| ----------------------------- | ------------------ |
| Windows 11                    | Primary            |
| macOS                         | Supported          |
| Linux                         | Supported          |
| GitHub Actions Ubuntu runners | Required CI target |

---

# 4. Required Developer Tooling

## 4.1 Required Tools

| Tool                  | Purpose                      |
| --------------------- | ---------------------------- |
| Git                   | Source control               |
| Node.js               | Script runtime               |
| npm                   | Package and script execution |
| VS Code (recommended) | Development editor           |

---

## 4.2 Recommended Tool Versions

### Node.js

Minimum supported version:

```text
22.x LTS
```

Recommended:

```text
Latest Node.js 22 LTS release
```

Verify installation:

```bash
node --version
npm --version
```

---

## 4.3 Node Version Management

Future topic placeholder.

Potential tooling:

- `.nvmrc`
- `nvm`
- `fnm`
- Volta

---

# 5. Supported Shell Environments

## 5.1 Supported Shells

| Shell           | Status    | Notes                     |
| --------------- | --------- | ------------------------- |
| Windows cmd.exe | Supported | Baseline Windows shell    |
| PowerShell      | Supported | Modern Windows shell      |
| Git Bash        | Supported | Optional Unix-style shell |
| macOS Terminal  | Supported | Native Unix shell         |
| Linux Bash      | Supported | Native Unix shell         |

---

## 5.2 Important Clarification

Git commands are not Bash commands.

Git CLI works in:

- cmd.exe
- PowerShell
- Git Bash
- Linux Bash
- macOS Terminal

Examples:

```bash
git status
git pull
git commit -m "Updated schema refs"
```

---

## 5.3 Git Bash

Git Bash provides:

- Bash shell
- Unix/Linux-style command-line tools
- Git CLI integration on Windows

Git Bash is:

- supported
- optional
- a developer convenience environment

Git Bash is NOT a project dependency.

---

## 5.4 Windows Terminal

Future topic placeholder.

Potential coverage:

- Multi-shell tabs
- PowerShell integration
- Git Bash integration
- Terminal profiles

---

# 6. Official Scripting Standard

## 6.1 Primary Scripting Runtime

Official automation scripts must use:

- Node.js
- JavaScript ES Modules (`.mjs`)

---

## 6.2 Script Location

Recommended repository structure:

```text
/scripts
  validate-schemas.mjs
  generate-templates.mjs
  bundle-schemas.mjs
```

---

## 6.3 npm as the Standard Execution Interface

Use npm scripts as the public interface.

Example:

```json
{
  "scripts": {
    "validate": "node scripts/validate-schemas.mjs",
    "generate": "node scripts/generate-templates.mjs",
    "bundle": "node scripts/bundle-schemas.mjs"
  }
}
```

---

## 6.4 ES Module Standard

Official scripts should use:

```javascript
import fs from 'node:fs';
import path from 'node:path';
```

Avoid legacy CommonJS patterns unless required.

---

# 7. Shell-Specific Scripting Restrictions

## 7.1 Avoid Bash-Only Commands

Avoid requiring commands such as:

```bash
rm
grep
sed
awk
export
chmod
```

unless:

- clearly documented
- optional
- developer convenience only

---

## 7.2 Avoid Windows-Specific Commands

Avoid requiring:

```cmd
del
copy
move
set
```

inside official project automation.

---

## 7.3 Preferred Alternatives

Prefer:

- Node.js filesystem APIs
- cross-platform npm packages

Examples:

| Purpose        | Preferred Approach    |
| -------------- | --------------------- |
| File deletion  | `fs.rm()` or `rimraf` |
| Path handling  | `node:path`           |
| File copying   | `fs.cp()`             |
| File searching | `glob`                |

---

# 8. Filesystem and Path Guidance

## 8.1 Avoid Hardcoded Paths

Avoid:

```text
C:\Users\...
```

Use relative paths and Node path utilities.

---

## 8.2 Use node:path

Example:

```javascript
import path from 'node:path';

const schemaPath = path.join(
  'packages',
  'core',
  'schemas',
  'TravelerProfile.json'
);
```

---

## 8.3 Path Separator Guidance

Prefer:

- forward slashes where practical
- Node path utilities for portability

---

# 9. Repository Structure Conventions

Future topic placeholder.

Potential coverage:

- `/packages`
- `/scripts`
- `/docs`
- `/examples`
- `/working`
- generated vs source assets
- schema generation outputs
- `.gitignore` conventions

---

# 10. Git Workflow Guidance

## 10.1 Recommended Basic Workflow

Example:

```bash
git pull
git status
git add .
git commit -m "Updated schema references"
git push
```

---

## 10.2 GitHub Desktop Compatibility

The project supports contributors using:

- Git CLI
- GitHub Desktop
- mixed workflows

---

## 10.3 Branching Strategy

Future topic placeholder.

Potential coverage:

- feature branches
- release branches
- pull request strategy
- protected branches

---

# 11. GitHub Actions and CI/CD

## 11.1 CI/CD Portability Requirement

All official automation must execute successfully in GitHub Actions.

---

## 11.2 GitHub Actions Node Version

Recommended baseline:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 22
```

---

## 11.3 Future CI/CD Topics

Placeholder topics:

- AJV validation
- schema linting
- automated schema bundling
- release packaging
- artifact generation
- documentation generation

---

# 12. Recommended Developer Workflows

## 12.1 Beginner Windows Workflow

Recommended for less technical contributors:

- GitHub Desktop
- VS Code
- cmd.exe
- npm scripts

---

## 12.2 Advanced Workflow

Optional tooling:

- Git Bash
- PowerShell
- Windows Terminal
- WSL
- advanced Git CLI usage

---

# 13. Recommended npm Packages

Future topic placeholder.

Potential packages:

| Package  | Purpose                         |
| -------- | ------------------------------- |
| AJV      | JSON Schema validation          |
| glob     | File discovery                  |
| fs-extra | Extended filesystem utilities   |
| rimraf   | Cross-platform recursive delete |
| chalk    | Console formatting              |

---

# 14. Security and Supply Chain Considerations

Future topic placeholder.

Potential coverage:

- npm dependency review
- lock file policy
- package signing
- GitHub Dependabot
- supply-chain risk reduction

---

# 15. Documentation Standards

Future topic placeholder.

Potential coverage:

- Markdown conventions
- README structure
- examples
- architecture documentation
- generated documentation

---

# 16. Future Tooling Topics

Placeholder topics for future expansion:

- schema bundling
- schema generation automation
- PlantUML automation
- validation pipelines
- Docker/devcontainer support
- release automation
- package publishing
- monorepo tooling
- VS Code workspace settings
- linting and formatting standards

---

# 17. Summary

The HATPro project standardizes on:

- Git
- Node.js
- npm
- JavaScript ES Modules (`.mjs`)

The project intentionally avoids requiring:

- Bash-only environments
- Windows-only scripting
- OS-specific automation assumptions

This approach provides:

- consistent contributor onboarding
- reliable CI/CD portability
- reduced tooling friction
- maintainable automation
- long-term cross-platform sustainability