Title: git CheatSheet

|                  |                         |
|------------------|-------------------------|
| Document ID:     | **DocID001**            |
| Version:         | **1.0**                 |
| Last Saved:      | **2026-04-15 15:43:00** |
| Document Status: | **Draft**               |
| Author:          | **Neil Thomson**        |
| Product/Release  |                         |

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 83%" />
</colgroup>
<tbody>
<tr>
<td><p>Abstract:</p>
<p>(Comments)</p></td>
<td>&lt;Enter the abstract in Properties/Summary/Comments&gt;</td>
</tr>
</tbody>
</table>

## Detailed History of Changes

| Ver. | Date       | Who  | Detailed description of Changes |
| ---- | ---------- | ---- | ------------------------------- |
| 1.0  | 2026-04-15 | NJT  | Created                         |

## Table of Contents

<!-- toc -->

- [Git Newbie’s cheatsheet to everyday operations](#git-newbies-cheatsheet-to-everyday-operations)
  * [The 3 places to think about](#the-3-places-to-think-about)
- [Command cheat sheet](#command-cheat-sheet)
  * [Read-only / inspection commands](#read-only--inspection-commands)
  * [Commands that update your local knowledge of GitHub](#commands-that-update-your-local-knowledge-of-github)
  * [Commands that affect your working files](#commands-that-affect-your-working-files)
  * [Commands that stage and save your work locally](#commands-that-stage-and-save-your-work-locally)
  * [Commands that move your local commits to GitHub](#commands-that-move-your-local-commits-to-github)
  * [Commands that bring remote changes into your current branch](#commands-that-bring-remote-changes-into-your-current-branch)
  * [Commands for temporary interruption handling](#commands-for-temporary-interruption-handling)
- [What each command touches: one-line summary](#what-each-command-touches-one-line-summary)
- [Practical mental model for the main commands](#practical-mental-model-for-the-main-commands)
- [4. Everyday command sequences](#4-everyday-command-sequences)
  * [A. “I am confused. Show me where I am.”](#a-i-am-confused-show-me-where-i-am)
  * [B. “I changed files and want a safe local checkpoint.”](#b-i-changed-files-and-want-a-safe-local-checkpoint)
  * [C. “I want to back up my branch to GitHub.”](#c-i-want-to-back-up-my-branch-to-github)
  * [D. “I want the latest GitHub information, but I do not want my files changed.”](#d-i-want-the-latest-github-information-but-i-do-not-want-my-files-changed)
  * [E. “I want to compare my current branch to GitHub main.”](#e-i-want-to-compare-my-current-branch-to-github-main)
  * [F. “I want to switch branches safely.”](#f-i-want-to-switch-branches-safely)
  * [G. “I want to update local main from GitHub.”](#g-i-want-to-update-local-main-from-github)
  * [H. “I want to bring the latest main into my working branch.”](#h-i-want-to-bring-the-latest-main-into-my-working-branch)
  * [I. “I want to discard my unstaged edits to one file.”](#i-i-want-to-discard-my-unstaged-edits-to-one-file)
  * [J. “I accidentally staged something. Unstage it.”](#j-i-accidentally-staged-something-unstage-it)
  * [K. “I deleted files and want Git to record the deletions.”](#k-i-deleted-files-and-want-git-to-record-the-deletions)
  * [L. “I want to see what is different but not yet committed.”](#l-i-want-to-see-what-is-different-but-not-yet-committed)
  * [M. “I want to see what will be committed next.”](#m-i-want-to-see-what-will-be-committed-next)
- [Recommended working habits for your kind of repo reconciliation](#recommended-working-habits-for-your-kind-of-repo-reconciliation)
  * [Best habits](#best-habits)
  * [Avoid when stressed or tired](#avoid-when-stressed-or-tired)
- [Your practical “minimal Git routine”](#your-practical-minimal-git-routine)
    + [Start of session](#start-of-session)
    + [Before switching branches](#before-switching-branches)
    + [Before comparing to GitHub main](#before-comparing-to-github-main)
    + [End of session](#end-of-session)
    + [Clean up local folder to match Origin](#clean-up-local-folder-to-match-origin)
- [Fast “what happens where” summary](#fast-what-happens-where-summary)
- [The single most important distinction](#the-single-most-important-distinction)
- [What that really means (important clarity)](#what-that-really-means-important-clarity)
- [The 3-layer model (mapped to your machine)](#the-3-layer-model-mapped-to-your-machine)
  * [Local disk (working folder)](#local-disk-working-folder)
  * [Local repo (.git)](#local-repo-git)
  * [Remote repo (GitHub)](#remote-repo-github)
- [What lives in .git (conceptually)](#what-lives-in-git-conceptually)
- [What does NOT live in .git](#what-does-not-live-in-git)
- [Why this matters (connects to your confusion)](#why-this-matters-connects-to-your-confusion)
  * [git fetch origin](#git-fetch-origin)
  * [git switch main](#git-switch-main)
  * [git add](#git-add)
  * [git commit](#git-commit)
  * [git push](#git-push)
- [One very important insight](#one-very-important-insight)
- [Simple analogy](#simple-analogy)
- [Bottom line](#bottom-line)
- [ICQ’s](#icqs)
  * [What “staging” actually is (no theory fluff)](#what-staging-actually-is-no-theory-fluff)
  * [What a “checkpoint” (commit) really is](#what-a-checkpoint-commit-really-is)
  * [Why staging exists (practical reason)](#why-staging-exists-practical-reason)
  * [The simple rule you should use](#the-simple-rule-you-should-use)
  * [What problem this solves](#what-problem-this-solves)
  * [Branch switching — where this matters](#branch-switching--where-this-matters)
    + [Situation: you are working on RECONCILE](#situation-you-are-working-on-reconcile)
    + [WRONG way (what causes confusion)](#wrong-way-what-causes-confusion)
    + [RIGHT way](#right-way)
      - [Step 1 — checkpoint](#step-1--checkpoint)
      - [Step 2 — switch](#step-2--switch)
  * [Why this works](#why-this-works)
  * [What happens if you DON’T commit](#what-happens-if-you-dont-commit)
  * [Staging vs committing (clear distinction)](#staging-vs-committing-clear-distinction)
  * [Do you need fine-grained staging?](#do-you-need-fine-grained-staging)
  * [Your ideal daily workflow](#your-ideal-daily-workflow)
    + [While working](#while-working)
    + [When switching branches](#when-switching-branches)
    + [When coming back](#when-coming-back)
  * [When to use stash (rarely)](#when-to-use-stash-rarely)
  * [What a “good checkpoint” looks like](#what-a-good-checkpoint-looks-like)
  * [What you gain from this approach](#what-you-gain-from-this-approach)
  * [One sentence to remember](#one-sentence-to-remember)
  * [What matters most for you right now](#what-matters-most-for-you-right-now)
- [Changing Branches – the complete picture](#changing-branches-%E2%80%93-the-complete-picture)
- [Local vs remote/origin actions](#local-vs-remoteorigin-actions)
- [What “origin workflows” are](#what-origin-workflows-are)
- [Appendix](#appendix)
  * [Additional Commands](#additional-commands)
    + [git clean](#git-clean)
    + [Why -X is the right first choice](#why--x-is-the-right-first-choice)
    + [Re-check](#re-check)
    + [Ignored vs untracked](#ignored-vs-untracked)
    + [Complete set (git clean -h)](#complete-set-git-clean--h)

<!-- tocstop -->

# Git Newbie’s cheatsheet to everyday operations

## The 3 places to think about

| **Label** | **What it is** | **What you can think of it as** |
|-----------------|--------------------------------------|-----------------|
| **GitHub / origin** | The remote repo on GitHub | Shared copy |
| **Local Git repo (.git)** | Your local Git database: commits, branches, staging, remote-tracking refs | Git’s memory |
| **Local disk / working folder** | The actual files you open and edit | Your working copy |

A useful shorthand:

- **origin** = GitHub

- **local repo** = .git

- **working tree** = files on disk

------------------------------------------------------------------------

# Command cheat sheet

## Read-only / inspection commands

| **Command** | **What it does** | **Reads from** | **Changes what?** | **Typical use** |
|----------------------|------------------|---------|---------|---------------|
| **git status** | Shows current branch, modified files, staged files, untracked files | local repo + local disk | nothing | First command when confused |
| **git branch --show-current** | Shows current branch name | local repo | nothing | Confirm where you are |
| **git branch** | Lists local branches | local repo | nothing | See what branches exist locally |
| **git branch -a** | Lists local and remote-tracking branches | local repo | nothing | See local plus origin/\* branches |
| **git log --oneline --graph --decorate -10** | Shows recent commit history | local repo | nothing | See recent work |
| **git diff** | Shows unstaged changes | local repo + local disk | nothing | What changed but not staged |
| **git diff --staged** | Shows staged changes | local repo + staging area | nothing | What will go into next commit |
| **git diff origin/main..HEAD** | Shows committed differences between your branch and remote main | local repo | nothing | Compare your branch to GitHub main after fetch |
| **git remote -v** | Shows remotes like origin | local repo | nothing | Confirm remote URL |

------------------------------------------------------------------------

## Commands that update your local knowledge of GitHub

| **Command** | **What it does** | **Moves content from** | **Moves content to** | **Changes local files on disk?** |
|-------------|--------------------|------------|-----------|----------------|
| **git fetch origin** | Downloads latest remote commits/refs | GitHub | local repo | **No** |
| **git fetch --all** | Fetches from all remotes | GitHub remotes | local repo | **No** |

Key point: fetch updates your local Git memory, not your working files.

------------------------------------------------------------------------

## Commands that affect your working files

| **Command** | **What it does** | **Moves content from** | **Moves content to** | **Notes** |
|----------------|------------------|-----------|-----------|-----------------|
| **git switch main** | Changes your working folder to the main branch content | local repo | local disk | May fail if uncommitted changes conflict |
| **git switch my-branch** | Changes to another branch | local repo | local disk | Same folder, different checked-out branch |
| **git restore file.txt** | Discards local unstaged edits to a file | local repo | local disk | Reverts file to last committed state |
| **git restore --staged file.txt** | Unstages a file | staging area/local repo | unstaged working state | Leaves disk file unchanged |
| **git reset --hard HEAD** | Discards all local working changes and staged changes | local repo | local disk + staging | Dangerous if unsure |

------------------------------------------------------------------------

## Commands that stage and save your work locally

| **Command** | **What it does** | **Moves content from** | **Moves content to** | **Notes** |
|---------------|------------------------|----------|-----------|-------------|
| **git add file.txt** | Stages one file | local disk | local repo staging area | Selective staging |
| **git add folder/** | Stages a folder | local disk | local repo staging area |  |
| **git add -A** | Stages all tracked/untracked/deleted changes | local disk | local repo staging area | Good for checkpoint commits |
| **git rm file.txt** | Removes file from disk and stages deletion | local disk | local repo staging area | Git-aware delete |
| **git commit -m "message"** | Saves staged snapshot as a commit | staging area | local repo commit history | Does not touch GitHub |

------------------------------------------------------------------------

## Commands that move your local commits to GitHub

| **Command** | **What it does** | **Moves content from** | **Moves content to** | **Notes** |
|-----------------|----------------------|-----------|----------|-------------|
| **git push** | Sends current branch commits to its upstream remote branch | local repo | GitHub | Requires upstream set |
| **git push -u origin my-branch** | Pushes branch and sets upstream | local repo | GitHub | First push of a new branch |
| **git push origin main** | Pushes local main to GitHub main | local repo | GitHub | Explicit form |

------------------------------------------------------------------------

## Commands that bring remote changes into your current branch

| **Command** | **What it does** | **Moves content from** | **Moves content to** | **Changes local files on disk?** |
|---------------|---------------------|-------------|-----------|--------------|
| **git pull** | Fetches, then merges remote branch into current branch | GitHub → local repo → local disk | current branch | **Yes** |
| **git pull origin main** | Fetches and merges origin/main into current branch | GitHub → local repo → local disk | current branch | **Yes** |
| **git merge origin/main** | Merges fetched origin/main into your current branch | local repo | current branch + local disk | Requires prior fetch for freshness |

Important: pull is not just download. It modifies your current branch
and files.

------------------------------------------------------------------------

## Commands for temporary interruption handling

| **Command** | **What it does** | **Moves content from** | **Moves content to** | **Notes** |
|-----------------|-----------------------|-------------|-----------|---------|
| **git stash push -m "note"** | Saves current unstaged/staged work aside temporarily | local disk/staging | local repo stash stack | Use sparingly |
| **git stash list** | Lists saved stashes | local repo | nothing |  |
| **git stash show -p stash@{0}** | Shows what is in a stash | local repo | nothing |  |
| **git stash pop** | Reapplies last stash and removes it from stash stack | local repo stash | local disk | Can conflict |

Best practice: prefer commits over stash for real work.

------------------------------------------------------------------------

# What each command touches: one-line summary

| **Command** | **GitHub** | **.git local repo** | **Local disk** |
|------------------|-----------------|-------------|----------|
| **git status** | read only indirectly | reads | reads |
| **git fetch origin** | reads/downloads from | writes | no |
| **git switch branch** | no | reads | writes |
| **git add** | no | writes | reads |
| **git commit** | no | writes | no |
| **git push** | writes to | reads | no |
| **git pull** | reads/downloads from | writes | writes |
| **git merge** | no | writes | writes |
| **git restore** | no | reads | writes |
| **git stash** | no | writes | writes |

------------------------------------------------------------------------

# Practical mental model for the main commands

| **Command** | **Plain-English meaning** |
|-----------------|----------------------------------------------|
| **git fetch origin** | Update my local knowledge of GitHub, but don’t touch my files |
| **git switch X** | Show me branch X in my folder |
| **git add** | Mark these file changes for the next commit |
| **git commit** | Save the staged changes into local history |
| **git push** | Send my local commits to GitHub |
| **git pull** | Bring remote changes into the branch I’m on now |
| **git stash** | Put my current unfinished edits on a temporary shelf |

------------------------------------------------------------------------

# 4. Everyday command sequences

## A. “I am confused. Show me where I am.”

**git status
git branch --show-current
git log --oneline --graph --decorate -10**

Use this first whenever lost.

------------------------------------------------------------------------

## B. “I changed files and want a safe local checkpoint.”

**git status
git add -A
git commit -m "WIP: brief description"**

This saves your work locally. No GitHub involved yet.

------------------------------------------------------------------------

## C. “I want to back up my branch to GitHub.”

**git status
git push**

If first push of that branch:

**git push -u origin my-branch**

------------------------------------------------------------------------

## D. “I want the latest GitHub information, but I do not want my files changed.”

**git fetch origin
git log --oneline --decorate origin/main -5**

Safe. No working-file changes.

------------------------------------------------------------------------

## E. “I want to compare my current branch to GitHub main.”

**git fetch origin
git diff --name-status origin/main..HEAD**

For only .mjs files:

**git diff --name-status origin/main..HEAD -- "\*.mjs"**

------------------------------------------------------------------------

## F. “I want to switch branches safely.”

Preferred approach:

**git status
git add -A
git commit -m "WIP: checkpoint before switching"
git switch main**

If you truly do not want a commit:

**git stash push -m "mid-edit checkpoint"
git switch main**

## G. “I want to update local main from GitHub.”

**git switch main
git pull**

This changes your local main files to include remote updates.

Safer/more explicit version:

**git switch main
git fetch origin
git merge origin/main**

## H. “I want to bring the latest main into my working branch.”

**git switch my-branch
git fetch origin
git merge origin/main**

That merges current GitHub main into your current branch.

------------------------------------------------------------------------

## I. “I want to discard my unstaged edits to one file.”

**git restore path/to/file**

Be careful: this overwrites your local file with the last committed
version.

------------------------------------------------------------------------

## J. “I accidentally staged something. Unstage it.”

**git restore --staged path/to/file**

------------------------------------------------------------------------

## K. “I deleted files and want Git to record the deletions.”

If already deleted in Explorer:

**git add -A**

If deleting through Git:

**git rm path/to/file**

## L. “I want to see what is different but not yet committed.”

**git diff**

## M. “I want to see what will be committed next.”

**git diff --staged**

------------------------------------------------------------------------

# Recommended working habits for your kind of repo reconciliation

## Best habits

| **Habit** | **Why** |
|--------------------------------------------|----------------------------|
| **Run git status** constantly | Keeps you oriented |
| Make small WIP commits | Better than relying on stash or memory |
| Use **git fetch origin** before branch-vs-main comparisons | Keeps remote references current |
| Keep branch switching intentional | Avoid confusion |
| Treat **git pull** as a file-changing command | Because it is |

## Avoid when stressed or tired

| **Avoid** | **Why** |
|-------------------------------------|------------------------|
| **git reset --hard** | Easy to lose work |
| Long-lived unstaged edits across branch switches | Creates confusion |
| Too many unnamed stashes | Hard to track |
| Blind **git pull** on the wrong branch | Can change files unexpectedly |

------------------------------------------------------------------------

# Your practical “minimal Git routine”

For daily work, this is enough:

### Start of session

**git status
git branch --show-current
git log --oneline --graph --decorate -5**

### Before switching branches

**git status
git add -A
git commit -m "WIP: checkpoint"
git switch other-branch**

### Before comparing to GitHub main

**git fetch origin
git diff --name-status origin/main..HEAD**

### End of session

**git status
git add -A
git commit -m "WIP: end-of-day checkpoint"
git push**

### Clean up local folder to match Origin

**git clean**

# Fast “what happens where” summary

**git fetch origin : GitHub -\> local repo (.git)
git add : local disk -\> local repo staging
git commit : staging -\> local repo history
git push : local repo -\> GitHub
git switch branch : local repo -\> local disk
git pull : GitHub -\> local repo -\> local disk
git stash : local disk -\> local repo stash**

# The single most important distinction

There are only three questions:

1.  **Am I just inspecting?**
    Use **status, log, diff, branch**.

2.  **Am I saving locally?**
    Use **add, commit.**

3.  **Am I syncing with GitHub?**
    Use **fetch, pull, push.**

If you identify which of those three you mean, the right command becomes
much easier.

If you want, I can turn this into a one-page Markdown handout you can
keep beside your repo work.

local repo = local .git folder?

Yes — **exactly**.

👉 **“local repo” = the .git folder (and its contents)**

------------------------------------------------------------------------

# What that really means (important clarity)

When we say:

**local repo**

we mean:

C:\Users\nthomson\Projects\hatpro-schema-htwg

That folder contains:

- all commits

- all branches

- staging area (index)

- remote tracking branches (e.g. origin/main)

- history of everything you’ve done locally

------------------------------------------------------------------------

# The 3-layer model (mapped to your machine)

## Local disk (working folder)

hatpro-schema-htwg\\
├── packages\\
├── tools\\
├── package.json

👉 What you edit

------------------------------------------------------------------------

## Local repo (.git)

hatpro-schema-htwg\\

👉 What Git manages internally

------------------------------------------------------------------------

## Remote repo (GitHub)

https://github.com/decentralized-identity/hatpro-schema-htwg

👉 Shared version

# What lives in .git (conceptually)

You don’t need internals, but conceptually:

| **Thing**                           | **Stored in .git?** |
|-------------------------------------|---------------------|
| Commit history                      | ✔                   |
| Branch pointers (main, wip-sync-\*) | ✔                   |
| Remote branches (origin/main)       | ✔                   |
| Staging area (index)                | ✔                   |
| File snapshots (content blobs)      | ✔                   |

------------------------------------------------------------------------

# What does NOT live in .git

| **Thing**                     | **Location** |
|-------------------------------|--------------|
| Actual working files you edit | your folder  |
| Temporary edits not staged    | your folder  |
| Untracked files               | your folder  |

------------------------------------------------------------------------

# Why this matters (connects to your confusion)

Now this becomes clear:

## git fetch origin

- updates .git

- adds/updates origin/main

- **does NOT touch your working files**

------------------------------------------------------------------------

## git switch main

- reads from .git

- writes to your working folder

------------------------------------------------------------------------

## git add

- takes changes from working folder

- stores them in .git staging area

------------------------------------------------------------------------

## git commit

- takes staged content in .git

- saves it permanently in .git

------------------------------------------------------------------------

## git push

- takes commits from .git

- sends them to GitHub

------------------------------------------------------------------------

# One very important insight

👉 **Your working folder is NOT the repository**

It is just:

a **temporary checked-out view** of what’s in .git

------------------------------------------------------------------------

# Simple analogy

Think of .git as:

📚 a full archive of your project

Your working folder is:

📖 one open page from that archive

------------------------------------------------------------------------

# Bottom line

✔ Yes — “local repo” = .git
✔ .git is the real source of truth locally
✔ your working files are just a view of it

# ICQ’s

Question: How do Staging and Checkpoints fit in the workflow

Add -\> *Staging* -\> Commit

Staging selects changes. Commit saves them. Commit before switching
branches.

## What “staging” actually is (no theory fluff)

Think of staging as a **selection step**

You have changes in your files.

👉 git add = **“these are the changes I want in my next checkpoint”**

------------------------------------------------------------------------

The flow

Your edits (disk)
↓
git add
↓
Staging area (in .git)
↓
git commit
↓
Saved checkpoint (in .git history)

------------------------------------------------------------------------

## What a “checkpoint” (commit) really is

A commit is:

a **snapshot of exactly what was staged**

Not:

- “everything you changed”

- not “whatever is in your folder”

Only what you staged.

------------------------------------------------------------------------

## Why staging exists (practical reason)

It lets you:

- include some changes

- exclude others

- build clean checkpoints

But for your work right now:

👉 you can safely treat it as:

“stage everything → commit everything”

------------------------------------------------------------------------

## The simple rule you should use

For your workflow:

git add -A
git commit -m "WIP: \<what you just did\>"

👉 That creates a **checkpoint of your current state**

------------------------------------------------------------------------

## What problem this solves

Without committing:

- changes live only in your working folder

- they can block branch switching

- they are easy to lose track of

With committing:

- changes are safely stored in .git

- you can switch branches safely

- you can always see history

------------------------------------------------------------------------

## Branch switching — where this matters

### Situation: you are working on Branch: X

You’ve:

- deleted files

- modified scripts

- added new docs

Now you want to switch to main.

------------------------------------------------------------------------

### WRONG way (what causes confusion)

git switch main

Git may:

- block you

- or mix changes

- or confuse you

------------------------------------------------------------------------

### RIGHT way

#### Step 1 — checkpoint

git add -A
git commit -m "WIP: reconcile progress"

#### Step 2 — switch

git switch main

👉 Clean switch, no surprises

------------------------------------------------------------------------

## Why this works

Because:

👉 commits live in .git
👉 switching branches rewrites your working folder
👉 but your commits stay safe

------------------------------------------------------------------------

## What happens if you DON’T commit

Your changes are:

- only in the working folder

- not tracked as a snapshot

So when switching:

- Git may refuse

- or carry changes across branches

- or create confusion

------------------------------------------------------------------------

## Staging vs committing (clear distinction)

| **Step**   | **Meaning**         |
|------------|---------------------|
| git add    | choose changes      |
| git commit | save chosen changes |

------------------------------------------------------------------------

## Do you need fine-grained staging?

Not for now.

Ignore:

- git add -p

- partial staging

Use:

git add -A

------------------------------------------------------------------------

## Your ideal daily workflow

### While working

Repeat this often:

git status
git add -A
git commit -m "WIP: \<what changed\>"

------------------------------------------------------------------------

### When switching branches

git status
git add -A
git commit -m "WIP: checkpoint before switching"
git switch main

------------------------------------------------------------------------

### When coming back

git switch wip-sync-2026-02-09
git log --oneline -5

👉 You immediately see where you left off

------------------------------------------------------------------------

## When to use stash (rarely)

Only when:

- you don’t want a commit

- and need a quick interruption

Example:

git stash push -m "mid-edit"
git switch main

But:

👉 For your work, commits are better than stash

------------------------------------------------------------------------

## What a “good checkpoint” looks like

Examples:

WIP: removed generated puml artifacts
WIP: updated validation scripts
WIP: reconciling tools directory
WIP: investigating lockfile differences

Not perfect — just descriptive enough.

------------------------------------------------------------------------

## What you gain from this approach

You no longer need to remember:

- what you changed

- where you were

- what branch had what

Because:

👉 Git history becomes your memory

------------------------------------------------------------------------

## One sentence to remember

**Staging selects changes. Commit saves them. Commit before switching
branches.**

------------------------------------------------------------------------

## What matters most for you right now

Given your reconciliation work:

✔ commit frequently
✔ use git add -A
✔ treat commits as checkpoints
✔ avoid long uncommitted sessions

# Changing Branches – the complete picture

In branch “A”, another branch “Main”.

git status //chec the current state
git add -A // push all changed files to staging
git commit -m "WIP checkpoint before switch" // commit
git push // (optional) push to .com repo
git switch main // switch to branch main
git status // check status after branch switch

How to create a Branch to the “origin” (.com server)

git switch New // switch locally to branch “New”
git add -A // add changes
git commit -m "WIP: whatever changed" // commit changes locally
git push -u origin New // push to origin server as a new Branch

# Local vs remote/origin actions

Almost all operations can be done locally, up to and including a push.
However, the Pull Request to merge a Branch to main has to be done on
the server and is subject to an “origin” verification workflow.

The missing layer: “origin workflows”

You can think of your system as having **4 layers**, not 3:

Local disk → your files
.git (local repo) → commits/branches
origin (GitHub) → shared repo
origin workflows → automation + rules on GitHub

------------------------------------------------------------------------

# What “origin workflows” are

These are:

- **GitHub Actions workflows** (.github/workflows/\*.yml)

- automated processes that run on:

  - push

  - pull request

  - merge attempt

Examples:

- schema validation

- build checks

- test runs

- linting

- security scans

# Appendix

## Additional Commands

### git clean

Since your unexpected files appear to be ignored leftovers, start with a
safe preview:

git clean -fdXn

That means:

- -f force

- -d include directories

- <span class="mark">-X remove **ignored (.gitignore) files
  only**</span>

- -n preview only

If it shows exactly the things you want removed, then run:

git clean -fdX

That should remove things like:

- ajv.log

- ignored schema folders

- ignored old package folders

### Why -X is the right first choice

(-X vs -x) Because your problem appears to be mostly **ignored**
residue.

This is safer than:

git clean -fdx

because -<span class="mark">fdx removes **all** untracked files,
including non-ignored ones.</span>

So use -fdX first.

------------------------------------------------------------------------

###  Re-check

git status --ignored

You should see much less noise.

### Ignored vs untracked

If folders or files are **not** ignored but merely untracked, then -fdX
will not remove them.

If that happens, preview with:

git clean -fdn

and then, if appropriate:

git clean -fd

### Complete set (git clean -h)

git clean \[-d\] \[-f\] \[-i\] \[-n\] \[-q\] \[-e \<pattern\>\] \[-x \|
-X\] \[--\] \[\<pathspec\>...\]

-q, --\[no-\]quiet do not print names of files removed

-n, --\[no-\]dry-run dry run (preview)

-f, --\[no-\]force force

-i, --\[no-\]interactive

interactive cleaning

-d remove whole directories

-e, --exclude \<pattern\>

add \<pattern\> to ignore rules

-x remove ignored files, too

-X remove only ignored files
