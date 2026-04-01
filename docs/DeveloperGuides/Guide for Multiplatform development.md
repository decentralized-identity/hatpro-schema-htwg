# Work To Be Done for Multi-Platform Development

This document outlines the tasks and design considerations required to evolve the current WIP_tools into a true **multi-platform toolset** that runs seamlessly on Windows, macOS, and Linux.

---

## 1. Design Goals

- **Single codebase:** All functionality implemented in portable JavaScript/Node.js (no OS-specific logic unless absolutely necessary).  
- **Identical user experience:** Command names, arguments, and outputs must be consistent across all platforms.  
- **No reliance on platform tools:** Avoid platform-specific utilities like `robocopy` or `rsync`. 
   - Using node.js as the command language vs. platform specific command languages is a top requirement  
- **Future maintainability:** Keep the implementation minimal, documented, and CI-tested.  

---

## 2. Functional Requirements (TBD Implementation)

| Feature | Current Status | Multi-Platform Plan |
|----------|----------------|---------------------|
| Install / Update WIP tools | Windows-only via `.bat` | Implement `node WIP_tools/bin/wip-tools.js install` (uses `fs.cp` / `fs-extra`) |
| Preview (dry run) | Windows-only via `robocopy /L` | Add `--dry-run` flag to Node CLI |
| Copy WIP → Repo | Manual robocopy | Implement `node WIP_tools/bin/wip-tools.js copy-wip-to-repo` |
| Snapshot Repo | `.bat` using `robocopy` | Implement JS function to timestamp & copy to `_snapshots/<date>` |
| Logging | Console echo | Cross-platform stdout logging with colorized output (chalk or colorette) |
| Configuration | Implicit pathing | Use `--repo`, `--wip`, or env vars; autodetect via `git rev-parse` |

---

## 3. Technical Implementation Tasks

1. **Create base CLI** (`wip-tools.js`) using Node.js ≥ 20.10:
   - Use `commander` or `yargs` for argument parsing.
   - Use `fs-extra` for recursive file ops.
   - Implement subcommands: `install`, `update`, `preview`, `snapshot`, `copy-wip-to-repo`.

2. **Add cross-platform wrappers** (optional convenience only):
   - `wip-tools.sh` (macOS/Linux wrapper)
   - `wip-tools.cmd` (Windows wrapper)
   - `wip-tools.ps1` (PowerShell wrapper)

3. **Define standard paths:**
   - Default WIP: `<repo-parent>/<repo-name>-WIP/repoCmdFiles`
   - Configurable via environment variable `WIP_ROOT` or CLI `--wip`

4. **Integrate with validation workflow:**
   - Update CI to run WIP_tools smoke tests on all platforms (Windows, Ubuntu, macOS).

5. **Update documentation:**
   - Modify `WIP_tools/README.md` to include Node usage examples.
   - Add troubleshooting guide for common platform-specific issues.

---

## 4. Future Enhancements (Optional)

- Bundle `wip-tools` as a standalone binary with [`pkg`](https://github.com/vercel/pkg) for teams without Node.
- Add optional native fallbacks for large copy operations (e.g., `robocopy`, `rsync`).
- Support configuration file (`wip-tools.config.json`) to store preferred paths and behaviors.
- Extend snapshot to include Git commit metadata.

---

## 5. Dependencies and Tools

- Node.js (≥ 20.10 LTS)
- npm (bundled)
- Packages: `fs-extra`, `commander` or `yargs`, `chalk`
- Git (for path autodetection)

---

## 6. Deliverables Summary

| Milestone | Description |
|------------|--------------|
| Phase 1 | Implement Node CLI with basic copy, update, snapshot functions |
| Phase 2 | Add optional shell wrappers and multi-OS CI |
| Phase 3 | Update docs, remove robocopy dependencies |
| Phase 4 | Optional packaging as standalone binary |

---

**Status:** Planning phase complete. Implementation deferred until core schema and content tasks are stabilized.
