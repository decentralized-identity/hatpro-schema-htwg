# The Work-in-Progress (WIP) Approach
### Large Change & Prototyping Strategy for HATPro Schema Development

---

## 1. Why This Strategy Exists

Git and GitHub are optimized for:

- Frequent, incremental commits  
- Branches representing continuously evolving work  
- Collaborative, low-risk change cycles  

However, HATPro schema development often involves:

- Large multi-file refactors  
- Experimental modeling that may be abandoned  
- Rapid prototype iterations  
- Major structural changes across packages and segments  

In these cases, pushing unstable work into Git too early creates noise, churn, and unnecessary complexity.

The **Workstation WIP Strategy** provides a local, filesystem-based safety and experimentation layer alongside Git.

---

## 2. Core Principle

This strategy introduces two complementary safety layers:

| Layer                     | Purpose                                         |
| ------------------------- | ----------------------------------------------- |
| Git branches & commits    | Official project history and collaboration      |
| Workstation WIP snapshots | Local experimentation, rollback & stabilization |

Git remains the system of record.  
WIP snapshots are a **personal workstation protection and staging mechanism**.

---

## 3. WIP Snapshot Tools

Two Node-based, cross-platform snapshot tools support this strategy:

| Tool                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| `wrkstn_filesys_snapshot_wip.mjs`  | Filesystem snapshot (no `.git`)                              |
| `wrkstn_filesys_snapshot_repo.mjs` | Full repo filesystem snapshot including `.git` and working tree status |

They are executed via npm:

```bash
npm run snapshot:wip
npm run snapshot:repo
```

## 4. Folder Strategy

Recommended workstation layout:

<Projects Folder>/
│
├── hatpro-schema-temp/         ← Main Git working tree
├── hatpro-schema-temp_WIP/     ← Active sandbox workspace
├── hatpro-schema-temp-WIP-2025-11-27/
├── hatpro-schema-temp-repoSnapshot-2025-11-27/

### Folder Meaning

| Folder                    | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `hatpro-schema-temp/`     | Active Git working tree                    |
| `hatpro-schema-temp_WIP/` | Experimental sandbox workspace             |
| `*-WIP-*`                 | Filesystem safety snapshots                |
| `*-repoSnapshot-*`        | Full repository snapshots including `.git` |

------

## 5. Snapshot Types

### 5.1 Filesystem WIP Snapshot (No Git)

Command:

npm run snapshot:wip

Generates:

hatpro-schema-temp-WIP-YYYY-MM-DD/

Characteristics:

- Does not include `.git`
- Used for rapid rollback
- Ideal during heavy experimentation
- Safe even with broken or incomplete code

Optional labeling:

npm run snapshot:wip -- --label NameRefactor

Produces:

```
hatpro-schema-temp-NameRefactor-YYYY-MM-DD/
```

Includes:

```
workingTreeStatus/
 └── dirty_tree.md
```

`dirty_tree.md` records:

- Whether the working tree was CLEAN or DIRTY
- A full list of modified, added, or deleted files
- Captured from `git status --porcelain=v1`

This is used for:

- Stabilization checkpoints
- Pre-commit forensic capture
- Design milestone preservation

------

## 6. Naming Convention

### Standard Format

```
<repoName>-<type>-YYYY-MM-DD
```

Examples:

```
hatpro-schema-temp-WIP-2025-11-27
hatpro-schema-temp-repoSnapshot-2025-11-27
```

### With Labels

```
hatpro-schema-temp-WIP-NameModelRevamp-2025-11-27
hatpro-schema-temp-repoSnapshot-PreAlphaFreeze-2025-11-27
```

------

## 7. Workflow Diagram

This shows how WIP and Git interact:

```
                      ┌──────────────────────────┐
                      │ Main Git Working Tree    │
                      │  (Active Development)    │
                      └─────────────┬────────────┘
                                    │
                                    │ Large change / prototyping
                                    │
                         ┌──────────▼──────────┐
                         │   Copy to WIP       │
                         │ hatpro-schema-temp_ │
                         │        WIP           │
                         └──────────┬──────────┘
                                    │
                      ┌─────────────▼─────────────┐
                      │   npm run snapshot:wip    │
                      │ (Filesystem safety copy)  │
                      └─────────────┬─────────────┘
                                    │
                         ┌──────────▼───────────┐
                         │   Continue Iteration │
                         └──────────┬───────────┘
                                    │
                      ┌─────────────▼─────────────┐
                      │   npm run snapshot:repo   │
                      │ (Includes working status) │
                      └─────────────┬─────────────┘
                                    │
                      ┌─────────────▼─────────────┐
                      │    Design Stabilizes      │
                      │  Apply back to main repo  │
                      └─────────────┬─────────────┘
                                    │
                      ┌─────────────▼─────────────┐
                      │ Git Commit Series +       │
                      │ Snapshot Branch (Git)     │
                      └───────────────────────────┘
```

------

## 8. Summary

The Workstation WIP Strategy:

- Enables safe large-scale and experimental changes on the workstation
- Provides rollback without Git churn
- Creates structured transition into formal Git history
- Supports your layered protection model:

**Experiment → Snapshot → Experiment → Snapshot → Stabilize → Git commit**

This is purpose-built for complex schema and modeling workflows like HATPro.