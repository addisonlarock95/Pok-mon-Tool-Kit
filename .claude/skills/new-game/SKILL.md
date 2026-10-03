---
name: new-game
description: Start a new code-drawn Pokémon remake (or any tile-based RPG remake) from the latest game's engine. Use when asked to "start a new game", "port <game>", "make Claude <Game>", or to set up a new game repo.
---

# Starting a new game

Follow `playbook/new-game.md` in this tool kit. Read `playbook/lessons.md` first; if the source game is a sibling
of one already done, also read its `playbook/games/` note.

1. **Repos.** You need the new game's repo, this tool kit and the engine reference named in `ENGINE.md` in the
   session. Attach any that are missing with `add_repo`; if access is refused, tell the user what the tool said.
2. **Copy the engine.** `node <toolkit>/tools/new_game.js <reference> <new repo> --name "Claude <Game>"`. Review its
   list of game-specific files, then commit the baseline and push to the working branch.
3. **Source reference.** Clone the original's decompilation next to the repo (sparse checkout if large) and record
   the path in the new `CLAUDE.md`.
4. **Bootstrap order:** data converter with a spot test → map converter and `mapcheck` on the first town →
   script converter and `audit` → story driver through the opening → `ch1_` save.
5. **Carry the standing rules:** everything drawn by code; the 28 LOVELAND opening card and title credit.
6. **Then chapters** with the `port-chapter` skill. File lessons with `record-lesson` as you go.

Exit: the new repo builds, boots to its title screen headlessly, has a first-town map that reads like the
original, and a `CLAUDE.md` that points back to this tool kit.
