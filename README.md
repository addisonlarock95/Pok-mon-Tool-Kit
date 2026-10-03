# Pokémon Tool Kit

What we have learned building code-drawn Pokémon remakes ("Claude Red", "Claude Emerald"), kept in one place so
the next game starts faster. Every game repo grows from the previous one. This repo holds what carries over: the
method, the lessons, the Claude Code skills, and a script that starts a new game from the latest one.

| Path | What it is |
| --- | --- |
| `playbook/` | The method. Start with `playbook/README.md`. |
| `playbook/lessons.md` | Lessons that cost the most time, by topic. The most valuable file here. |
| `playbook/games/` | Notes about one source game that would help another game from the same family. |
| `.claude/skills/` | Skills Claude Code loads when this repo is attached to a session. |
| `tools/new_game.js` | Copies the engine and tools from the latest game repo into a new one. |
| `templates/` | Starting files for a new game repo (`CLAUDE.md`). |
| `ENGINE.md` | Which game repo is the current engine reference, and how its code is laid out. |

## Using it

- **When you start a session on a game**, select this repo as well as the game's own repo. Claude can also attach
  it partway through.
- **To start a new game**, ask Claude to "start a new game, porting X". The `new-game` skill runs the setup.
- **As work goes on**, Claude files general lessons here and game-specific notes in the game's repo (the
  `record-lesson` skill).

## Games so far

| Game | Repo | Status |
| --- | --- | --- |
| Claude Red | `addisonlarock95/pok-mon-red01` | Complete Kanto engine; the first game |
| Claude Emerald | `addisonlarock95/Pok-mon-Emerald-01` | In progress (6 badges' worth of story); the current engine reference |
