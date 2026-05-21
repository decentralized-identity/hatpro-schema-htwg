# Required Platform Installations

This document lists all software dependencies required to work on or contribute to the `hatpro-schema-htwg` project and its tooling (including WIP_tools).

---

## 1. Core Requirements

| Component | Version | Purpose |
|------------|----------|----------|
| **Node.js** | >= 20.10.x | Required for all schema generation, validation, and WIP_tools. |
| **npm** | Bundled with Node | Package manager for Node-based tools. |
| **Git** | Latest stable | Required for version control and repo synchronization. |
| **Visual Studio Code** | Current LTS | Recommended IDE for editing PlantUML, JSON Schema, and Markdown. |

> ⚠️ Node is an absolute requirement. Contributors must use Node 20.10.x (LTS) or higher. Versions outside 20.x may fail preinstall checks.

---

## 2. Recommended Extensions and Tools

| Tool | Function |
|------|-----------|
| **PlantUML Extension** | Diagram rendering and UML editing |
| **Prettier** | Consistent Markdown, JSON, and JS formatting |
| **GitHub Desktop** | Simplified branch and PR management |
| **nvm** / **nvm-windows** | Node version management |
| **fs-extra (npm)** | File operations library used in WIP_tools |
| **commander** or **yargs** | Command-line parsing library |
| **chalk** | Console output formatting |

---

## 3. Optional Utilities

| Tool | Purpose |
|------|----------|
| **pkg** (npm) | Package Node scripts into standalone binaries |
| **jq** | JSON command-line processor (for debugging) |
| **PowerShell 7+** | Modern PowerShell; supports LF endings and cross-platform use |
| **GitHub CLI (`gh`)** | Optional for PR management via command line |

---

## 4. Environment Configuration

1. **Set Node version (recommended)**
   Use `nvm` or `nvm-windows` to install and use Node 20.10.0:
   ```bash
   nvm install 20.10.0
   nvm use 20.10.0
   ```

2. **Verify environment**
   ```bash
   node -v
   npm -v
   git --version
   ```

3. **Install dependencies**
   ```bash
   npm ci
   ```

---

## 5. Continuous Integration (CI) Environment

The GitHub Actions workflows are configured to run on:
- `ubuntu-latest`
- `windows-latest`
- `macos-latest`

Each CI job uses:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20.10.0'
    cache: 'npm'
```

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|----------|--------|-----|
| Node version mismatch | Using Node < 20.10 | Run `nvm use 20.10.0` |
| Permission denied (scripts) | Missing executable flag on Unix | `chmod +x WIP_tools/bin/*.sh` |
| Missing npm package | Local install incomplete | `npm ci` |
| Git line endings issue | OS default mismatch | `.gitattributes` enforces correct endings |

---

**Status:** All platform dependencies standardized as of November 2025.
