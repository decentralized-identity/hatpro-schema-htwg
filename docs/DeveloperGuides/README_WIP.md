# Workstation WIP Strategy – Quick Guide

This project uses a **Workstation Work-in-Progress (WIP) strategy** to support large experimental changes before committing to Git.

---

## Why?

Git works best for small, incremental commits.

But HATPro schema work often requires:

- Multi-day refactors  
- Experimental modeling trials  
- High-risk architectural changes  

The WIP strategy lets you experiment freely without polluting Git history.

---

## Two Snapshot Tools

| Command | Purpose |
|--------|--------|
| `npm run snapshot:wip` | Filesystem snapshot of the <reponame>_WIP folders            |
| `npm run snapshot:repo` | Filesystem snapshot of the <reponame> folders (current state of the repo on the workstation, including + working tree status |

---

## Snapshot Structure

Snapshots are created as sibling folders:

 - hatpro-schema-temp-WIP-YYYY-MM-DD
- hatpro-schema-temp-repoSnapshot-YYYY-MM-DD

With labels:

```bash
npm run snapshot:wip -- --label NameRefactor
```

Produces:

```
hatpro-schema-temp-NameRefactor-YYYY-MM-DD
```

------

## What Repo Snapshots Add

Each repo snapshot includes:

```
workingTreeStatus/
 └── dirty_tree.md
```

This file records:

- Whether your working tree was CLEAN or DIRTY
- Which files were modified, added, or deleted

Essential for audit trails and rollback.

------

## When To Use WIP

Use WIP when:

- Doing major schema/model refactors
- Prototyping new segment structures
- Testing risky changes

Use Git commits only once the design stabilizes.

------

## Mental Model

```
Experiment → Snapshot → Experiment → Snapshot → Stabilize → Git Commit
```

WIP protects large changes/prototyping on your workstation. Git protects your project history.
