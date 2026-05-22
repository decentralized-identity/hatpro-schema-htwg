# Recommended GitHub Workflow

#### Working environment

- Mac or Windows
- Git
- Git Desktop

## Narrative Workflow

1. Start in GitHub Desktop on `main`.

2. Fetch and pull from `origin` to make sure local `main` matches GitHub.

3. Confirm there are no local changes.

4. Create a new branch for one focused purpose.

5. Make the intended changes locally using VS Code, Typora, Explorer, or other tools.

6. Review the changed files in GitHub Desktop.

7. Commit the changes locally with a clear commit message.

8. Publish the branch from GitHub Desktop. This creates the branch on GitHub/origin.

9. Use GitHub Desktop to preview/create the Pull Request, then complete the PR in the GitHub browser UI.

10. In the GitHub browser, verify:
    - base branch is `main`
    - compare branch is your feature branch
    - changed files are expected

11. Squash merge the PR into `main`.

12. Delete the branch on GitHub/origin when GitHub offers it.

13. Return to GitHub Desktop.

14. Switch back to `main`.

15. Fetch and pull from `origin` so local `main` receives the merged PR.

16. Delete the local feature branch in GitHub Desktop.

17. Confirm final state:
    - current branch is `main`
    - no local changes
    - origin/main synchronized
    - feature branch removed locally and remotely

---

## Tool Responsibility Table

| Step | Operation                  | Preferred Tool              | Notes                                  |
| ---- | -------------------------- | --------------------------- | -------------------------------------- |
| 1    | Switch to `main`           | GitHub Desktop              | Start every task from clean `main`     |
| 2    | Fetch/pull latest `main`   | GitHub Desktop              | Ensures local repo matches GitHub      |
| 3    | Confirm clean working tree | GitHub Desktop              | Should show no local changes           |
| 4    | Create feature branch      | GitHub Desktop              | Use one branch per focused change      |
| 5    | Edit files                 | VS Code / Typora / Explorer | Make only scoped changes               |
| 6    | Review file diffs          | GitHub Desktop              | Check for accidental files             |
| 7    | Commit locally             | GitHub Desktop              | Commit exists only locally at first    |
| 8    | Publish branch             | GitHub Desktop              | Creates branch on GitHub/origin        |
| 9    | Create Pull Request        | GitHub Desktop → Browser    | Desktop opens/starts the PR flow       |
| 10   | Review PR                  | GitHub browser              | Confirm base/compare and changed files |
| 11   | Squash merge PR            | GitHub browser              | Keeps `main` history clean             |
| 12   | Delete remote branch       | GitHub browser              | Removes branch from origin             |
| 13   | Switch back to `main`      | GitHub Desktop              | Do not stay on merged feature branch   |
| 14   | Fetch/pull merged `main`   | GitHub Desktop              | Brings squash merge into local repo    |
| 15   | Delete local branch        | GitHub Desktop              | Only after switching away from it      |
| 16   | Verify final state         | GitHub Desktop / CLI        | Clean `main`, no leftover branch       |

---

## Useful CLI Verification Commands

GitHub Desktop is the main workflow tool, but CLI is useful for checking state.

```bash
git status
git branch -a
git branch -vv
git fetch --prune
git log --oneline --graph -10