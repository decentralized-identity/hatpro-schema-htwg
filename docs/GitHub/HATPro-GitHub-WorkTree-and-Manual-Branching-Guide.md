# HATPro GitHub WorkTree and Manual Branching Guide

This guide explains the recommended HATPro workflow for:
- local worksheet/WIP development
- GitHub Desktop usage
- managed Git branches
- Pull Requests (PRs)
- when advanced/manual Git workflows are appropriate

The goal is to provide a workflow that:
- minimizes Git complexity
- supports iterative and AI-assisted development
- reduces accidental commits and merge issues
- keeps the repository clean and maintainable

The examples assume you are using GitHub Desktop with optional command-line references for advanced users.

### Table of contents

<!-- toc -->

- [1. Why HATPro Uses a Git Worktree-First Approach](#1-why-hatpro-uses-a-git-worktree-first-approach)
- [2. Recommended HATPro Workflow: Git Worktrees First](#2-recommended-hatpro-workflow-git-worktrees-first)
  * [HATPro Recommended Approach](#hatpro-recommended-approach)
  * [Why This Is Recommended](#why-this-is-recommended)
  * [Important Rule](#important-rule)
- [3. Git Worktrees vs. Manually Created Branches](#3-git-worktrees-vs-manually-created-branches)
  * [Comparison: Worksheets vs. Manual Branches](#comparison-worksheets-vs-manual-branches)
  * [HATPro Recommendation](#hatpro-recommendation)
    + [Preferred Workflow (Most Contributors)](#preferred-workflow-most-contributors)
  * [Avoid Manual Git Branching Unless Necessary](#avoid-manual-git-branching-unless-necessary)
- [4. Key Principles](#4-key-principles)
  * [For Exploratory Work](#for-exploratory-work)
  * [For Formal Repository Contributions](#for-formal-repository-contributions)
- [5. Using `/working` Folders Inside a Worktree](#5-using-working-folders-inside-a-worktree)
  * [Important Rule](#important-rule-1)
- [6. Creating a Git Worktree and Branch](#6-creating-a-git-worktree-and-branch)
- [7. Creating a Git Worktree Using GitHub Desktop](#7-creating-a-git-worktree-using-github-desktop)
  * [Step 1. Update Main](#step-1-update-main)
  * [Step 2. Create the Worktree and Branch](#step-2-create-the-worktree-and-branch)
  * [Step 3. Move Stable Worksheet Content](#step-3-move-stable-worksheet-content)
  * [Step 4. Commit the Changes](#step-4-commit-the-changes)
  * [Step 5. Publish the Branch](#step-5-publish-the-branch)
  * [Step 6. Open a Pull Request](#step-6-open-a-pull-request)
- [8. Creating a Git Worktree Using Command Line Git](#8-creating-a-git-worktree-using-command-line-git)
  * [Step 1. Go to the Repository](#step-1-go-to-the-repository)
  * [Step 2. Update Main](#step-2-update-main)
  * [Step 3. Create the Worktree and Branch](#step-3-create-the-worktree-and-branch)
  * [Step 4. Move Stable Worksheet Content](#step-4-move-stable-worksheet-content)
  * [Step 5. Commit the Changes](#step-5-commit-the-changes)
  * [Step 6. Push the Branch](#step-6-push-the-branch)
  * [Step 7. Create Pull Request](#step-7-create-pull-request)
- [9. Generated Files and Temporary Artifacts](#9-generated-files-and-temporary-artifacts)
- [10. When Manual Branch Management Is Required](#10-when-manual-branch-management-is-required)
  * [Recommendation](#recommendation)
- [11. If You Forget to Branch First](#11-if-you-forget-to-branch-first)
- [12. Troubleshooting Tips](#12-troubleshooting-tips)
- [13. Best Practices Summary](#13-best-practices-summary)
- [14. Example Naming Conventions](#14-example-naming-conventions)
- [Summary](#summary)

<!-- tocstop -->

---

# 1. Why HATPro Uses a Git Worktree-First Approach

Traditional Git workflows often assume:
1. create branch
2. edit files
3. commit
4. merge

While technically correct, this can create unnecessary complexity for:
- exploratory work
- AI-assisted iterations
- temporary generated artifacts
- schema experimentation
- developer scratch work

HATPro therefore recommends a hybrid workflow built around Git Worktrees:
- create isolated Git Worktrees for contribution work
- use local `working/` folders inside the Worktree for experimentation
- keep temporary or generated artifacts isolated from tracked repository content
- use Pull Requests for finalized contribution work

---

# 2. Recommended HATPro Workflow: Git Worktrees First

## HATPro Recommended Approach

For most HATPro contributors, the recommended workflow is:

1. Create a dedicated Git Worktree for the task or feature.
2. Work locally inside repository `working/` folders within that Worktree.
3. Use those folders for:
   - scratch work
   - experiments
   - temporary generated files
   - developer notes
   - AI-assisted iterations
   - partial schema work
   - validation output
4. The Worktree automatically creates and manages the associated branch.
5. Only move finalized content into tracked repository locations when:
   - work is ready for review
   - work will be shared
   - work affects tracked repository content
   - a Pull Request will be created

---

## Why This Is Recommended

The Git Worktree approach:
- avoids unnecessary branch proliferation
- reduces Git complexity
- minimizes accidental commits
- avoids branch synchronization issues
- supports iterative AI-assisted workflows
- keeps experimental work isolated
- aligns with HATPro modular development practices

---

## Important Rule

> The `working/` folders are intentionally excluded from Git tracking through `.gitignore`.

This allows contributors to safely experiment locally inside a Worktree without affecting tracked repository content.

---

# 3. Git Worktrees vs. Manually Created Branches

This is the most important workflow distinction for HATPro contributors.

A Git Worktree workflow:
- automatically creates an isolated working folder
- automatically creates and associates a branch
- keeps work physically separated from other repository work
- reduces branch and checkout confusion
- works extremely well with GitHub Desktop and VS Code
- supports safer experimentation

A manually created branch workflow:
- creates a formal Git branch immediately
- tracks all subsequent changes
- is intended for managed contribution work
- requires more Git discipline and understanding

---

## Comparison: Worksheets vs. Manual Branches

| Topic | Git Worktrees + `/working` folders | Manually Created Branches |
|---|---|---|
| Primary Purpose | Isolated feature development with safe experimentation | Formal tracked development in same repository checkout |
| Complexity | Low to moderate | Moderate to high |
| Git knowledge required | Minimal | Moderate |
| Risk of branch confusion | Very low | Moderate |
| Risk of accidental commits | Very low | Higher |
| Best for experiments | Excellent | Moderate |
| Best for AI-generated iterations | Excellent | Moderate |
| Best for generated artifacts | Excellent | Poor |
| Best for developer notes | Excellent | Poor |
| Supports Pull Requests | No | Yes |
| Visible to collaborators | No | Yes |
| Appropriate for production changes | No | Yes |
| Automatically creates branch | Yes | No |
| Separate physical working folder | Yes | No |
| Risk of branch sprawl | None | Moderate |
| Audit/history tracking | Minimal | Excellent |
| Best for long-running features | Poor | Excellent |
| Best for formal collaboration | Poor | Excellent |

---

## HATPro Recommendation

### Preferred Workflow (Most Contributors)

Use:
- Git Worktrees
- local `working/` folders inside the Worktree
- GitHub Desktop
- short-lived feature branches

This is the preferred workflow for:
- schema exploration
- model experimentation
- AI-assisted generation
- temporary artifacts
- draft documentation
- generated validation output
- developer notes

---

## Avoid Manual Git Branching Unless Necessary

Most contributors should avoid:
- command-line branch management
- rebasing
- cherry-picking
- detached HEAD workflows
- force pushes

GitHub Desktop provides safer workflows for normal HATPro contribution patterns.

---

# 4. Key Principles

## For Exploratory Work

> Use local `working/` folders first.

This keeps experimental or temporary work outside managed Git workflows.

---

## For Formal Repository Contributions

> Create the branch before editing tracked repository content.

This avoids:
- confusion about which branch owns the changes
- accidental commits to `main`
- stash/recovery issues
- merge confusion

---

# 5. Using `/working` Folders Inside a Worktree

Inside each Git Worktree, use local `working/` folders, including:
- creating temporary folders
- creating generated outputs
- creating scratch documentation
- experimenting with schema structures

Only move content into tracked repository structures after:
- the Worktree branch exists
- the work is stable
- the work is intended for contribution

---

## Important Rule

> DO NOT directly edit tracked repository files and then create a branch afterward unless absolutely necessary.

---

# 6. Creating a Git Worktree and Branch

Git Worktrees automatically create:
- a dedicated working folder
- an associated branch

This provides a much simpler and safer workflow than manually creating and managing branches in a single repository checkout.

Inside the Worktree, contributors can still use local `/working` folders for temporary or experimental artifacts that should remain ignored by Git.

This section explains how to do that using:
- GitHub Desktop
- command line Git

---

# 7. Creating a Git Worktree Using GitHub Desktop

This is the recommended approach for most HATPro contributors.

GitHub Desktop Worktrees:
- create a new branch automatically
- create a separate working folder automatically
- isolate changes from other branches
- avoid checkout/stash confusion

---

## Step 1. Update Main

1. Open GitHub Desktop
2. Select the `main` branch
3. Click `Fetch origin`
4. Click `Pull origin` if updates are available

---

## Step 2. Create the Worktree and Branch

1. Select:
   `Branch → New Branch…`

2. Use a clear branch name such as:
   - `docs/update-workflow-guide`
   - `feature/add-schema-validation`
   - `fix/reference-resolution`

3. Base the branch on:
   `main`

4. Click:
   `Create Branch`

You are now working inside an isolated Worktree with its own associated branch and working folder.

---

## Step 3. Move Stable Worksheet Content

Move stable content from:
- local `/working` folders inside the Worktree

into:
- tracked repository folders

Examples:
- schema files
- documentation
- enum definitions
- templates
- examples

Verify the changed files appear in the GitHub Desktop `Changes` tab.

---

## Step 4. Commit the Changes

1. Review the changed files
2. Add a clear commit message
3. Click:
   `Commit to <branch-name>`

Example commit messages:
- `docs: update worksheet workflow guide`
- `schema: add support needs enums`

---

## Step 5. Publish the Branch

Click:
`Publish branch`

This pushes the branch to GitHub.

---

## Step 6. Open a Pull Request

1. Click:
   `Create Pull Request`

2. Confirm:
   - base branch = `main`
   - compare branch = your feature branch

3. Add:
   - title
   - rationale
   - summary

4. Create the PR

---

# 8. Creating a Git Worktree Using Command Line Git

This workflow is intended for more advanced users.

Git Worktrees are one of the safest and most powerful advanced Git capabilities because they:
- isolate work physically
- avoid repeated branch checkout operations
- reduce accidental cross-branch contamination

---

## Step 1. Go to the Repository

```bash
cd path/to/repository
```

---

## Step 2. Update Main

```bash
git checkout main
git pull
```

---

## Step 3. Create the Worktree and Branch

```bash
git worktree add ../hatpro-docs-update -b docs/update-workflow-guide main
```

This command:
- creates a new folder named `hatpro-docs-update`
- creates a new branch named `docs/update-workflow-guide`
- checks out the branch automatically
- isolates the work from the main repository checkout

---

## Step 4. Move Stable Worksheet Content

Move stable content from:
- local `/working` folders inside the Worktree

into:
- tracked repository folders

Then verify the changes:

```bash
git status
```

---

## Step 5. Commit the Changes

```bash
git add .
git commit -m "docs: update worksheet workflow guide"
```

---

## Step 6. Push the Branch

```bash
git push -u origin docs/update-workflow-guide
```

---

## Step 7. Create Pull Request

Open GitHub in the browser and create the Pull Request.

---

# 9. Generated Files and Temporary Artifacts

HATPro intentionally separates:
- source models
- generated artifacts
- experimental outputs
- temporary developer files

Many generated outputs should remain inside local `working/` folders until intentionally promoted into tracked repository structures.

This helps avoid:
- repository pollution
- accidental commits
- noisy Pull Requests
- unstable generated artifacts entering `main`

---

# 10. When Manual Branch Management Is Required

Manual Git operations may be necessary for advanced scenarios such as:

| Scenario | Why Manual Git May Be Needed |
|---|---|
| Complex merge conflict resolution | GitHub Desktop may be insufficient |
| Rebasing feature branches | Desktop has limited rebase tooling |
| Cherry-picking commits | Typically CLI-driven |
| Recovering damaged branch history | Requires advanced Git commands |
| Multi-branch parallel development | Easier from CLI |
| CI/CD debugging | Often requires direct Git commands |
| Advanced repository restructuring | Usually CLI-oriented |
| Maintaining release branches | Requires tighter Git control |
| Submodule management | Better supported in CLI |
| Large-scale refactoring across branches | Advanced workflows required |

---

## Recommendation

> Manual Git workflows should generally be limited to advanced maintainers or contributors already comfortable with Git internals.

---

# 11. If You Forget to Branch First

If you accidentally edited tracked files on `main`:

1. Create a branch immediately.
2. GitHub Desktop will usually ask whether to bring changes across.
3. Click `Yes`.

If files disappear:
- go to:
  `Repository → Restore Stashed Changes`

Then:
- commit normally
- continue the workflow

---

# 12. Troubleshooting Tips

| Problem | Likely Cause | Fix |
|---|---|---|
| Files disappeared after switching branches | Desktop stashed changes | Repository → Restore Stashed Changes |
| Files not showing in Changes | Files saved outside repo | Use Show in Explorer to confirm location |
| New files ignored | `.gitignore` excludes them | Adjust `.gitignore` or use `git add -f` |
| PR button missing | Branch not pushed | Click Publish Branch |
| Cannot delete branch | Branch checked out locally | Switch to `main` first |
| Generated files unexpectedly committed | Working folder not used | Move temporary work to `working/` |

---

# 13. Best Practices Summary

✅ Use local `working/` folders for experimentation  
✅ Keep generated artifacts out of tracked repo areas initially  
✅ Create branches only for contribution-ready work  
✅ Use GitHub Desktop for normal workflows  
✅ Keep commits small and logical  
✅ Write clear commit messages and PR descriptions  
✅ Keep feature branches short-lived  
✅ Merge and delete branches after approval  

---

# 14. Example Naming Conventions

| Purpose | Example Branch Name |
|---|---|
| Documentation | `docs/add-workflow-guide` |
| New feature | `feature/add-json-generator` |
| Bug fix | `fix/schema-reference-resolution` |
| Experiment | `exp/new-validation-logic` |

---

# Summary

HATPro recommends:
1. worksheet-first local development
2. GitHub Desktop managed branches for contribution-ready work
3. manual Git workflows only for advanced scenarios

This hybrid approach:
- reduces Git complexity
- supports iterative AI-assisted development
- minimizes accidental commits
- keeps the repository cleaner
- simplifies contributor onboarding
- improves long-term maintainability

