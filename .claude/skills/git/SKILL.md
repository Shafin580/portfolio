# Git Rules Skill

## Rules (MUST follow)

### No Git Actions — Ever

**NEVER run any git commands in any repository.** This includes:

- `git add`
- `git commit`
- `git push`
- `git checkout`
- `git reset`
- `git stash`
- `git merge`
- `git rebase`
- Any other git subcommand

The user manages all git operations manually. Agents should make file edits on disk and stop there — never stage or commit anything.

### What to do instead

After making file changes, inform the user what files were modified. Do NOT attempt to commit them. Example:

> "Files updated on disk — ready for you to commit when you like."
