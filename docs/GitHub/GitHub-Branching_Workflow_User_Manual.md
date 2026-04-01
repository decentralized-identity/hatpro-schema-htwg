# Branching Workflow User Manual

This guide explains **how and when to create branches** in your Git workflow and why the recommended best practice is to **create the branch before making changes**. The examples assume you are using **GitHub Desktop** with optional CLI references for more advanced users.

---

## 1. Why Branch First

Creating the branch **before editing files** avoids all common Git pitfalls such as:
- Lost or stashed changes during branch creation.
- Confusion about which branch contains your edits.
- Files disappearing from GitHub Desktop when switching branches.

### Key Principle
> **A branch only tracks committed changes, not uncommitted edits.**

Uncommitted edits live in your *working directory* — if you switch branches without committing, Git may temporarily stash (hide) them, or Desktop may not bring them across automatically.

---
## Leverage the WIP folder space
Work on files in the WIP folder space, including creating new folders and only move those files if branch (new or existing) exists. **DO NOT edit the files in the repo space and _then_ create a branch**

## 2. The Recommended Workflow (GitHub Desktop)

### Step 1. Update your main branch
1. In GitHub Desktop, select **main** from the branch dropdown.  
2. Click **Fetch origin**, then **Pull origin** (if available).

### Step 2. Create your new branch
1. Go to **Branch → New Branch…**
2. Name it clearly (examples):
   - `docs/update-readmes`
   - `feature/add-schema-validation`
   - `fix/typo-in-readme`
3. Set the base to **main**, then click **Create Branch**.

> 💡 You are now working *on your own branch*. All commits here will stay isolated until you make a Pull Request.

### Step 3. Make your edits
- Add or modify files directly inside the repository folder (the one opened by **Show in Explorer**).
- Check that your changed files appear in the **Changes** tab of Desktop.

### Step 4. Commit your work
1. Review all listed changes.
2. Write a short, clear commit message, e.g.  
   `docs: add README on branching workflow`
3. Click **Commit to <branch-name>**.

### Step 5. Publish your branch
- Click **Publish branch** to push your branch to GitHub.

### Step 6. Open a Pull Request (PR)
1. Desktop will show a banner → click **Create Pull Request**.
2. Confirm base branch = `main`, compare branch = your new branch.
3. Add a title and description.
4. Click **Create Pull Request**.

### Step 7. Merge and clean up
- After checks pass, click **Squash and Merge**.
- Optionally delete the branch afterward (Desktop will prompt you).

### Step 8. Sync local main
1. In Desktop, switch to `main`.
2. Click **Fetch origin** → **Pull origin** to get the merged changes.

---

## 3. Command Line Equivalent

If you prefer the command line, the same workflow looks like this:

```bash
cd path/to/repo
git checkout main
git pull
git switch -c docs/update-readmes
# make changes, then
git add .
git commit -m "docs: add README on branching workflow"
git push -u origin docs/update-readmes
```

Then open GitHub → Create PR → Merge → Delete branch → Pull `main`.

---

## 4. If You Forget to Branch First

If you made edits on `main` already:

1. **Create a branch now** → GitHub Desktop will ask if you want to bring your changes — click **Yes**.  
2. If your files vanish, go to **Repository → Restore Stashed Changes…**  
3. Commit and continue as normal.

---

## 5. Troubleshooting Tips

| Problem | Likely Cause | Fix |
|----------|---------------|------|
| Files disappeared after switching branches | Desktop stashed your changes | Repository → Restore Stashed Changes |
| Files not showing in Changes | You saved them outside the repo folder | Move them into the repo root (use *Show in Explorer* to confirm path) |
| New files ignored | `.gitignore` is excluding them | Edit `.gitignore` or use `git add -f` |
| PR button missing | Branch not yet pushed | Click *Publish branch* |
| Can't delete branch | It’s checked out locally | Switch to `main`, then delete it |

---

## 6. Best Practices Summary

✅ **Always create your branch before editing.**  
✅ **Keep edits inside the repo folder.**  
✅ **Commit small, logical changes often.**  
✅ **Write clear commit messages and PR titles.**  
✅ **Keep branches short-lived — merge and delete after approval.**

---

### Example Naming Conventions

| Purpose | Example Branch Name |
|----------|--------------------|
| Documentation | `docs/add-wip-tools-guide` |
| New feature | `feature/add-json-generator` |
| Bug fix | `fix/schema-mismatch` |
| Experiment | `exp/new-validation-logic` |

---

**Summary:**  
Creating the branch first gives you predictable behavior every time — no stashes, no lost edits, and an easy path to commit, publish, and open a PR.
