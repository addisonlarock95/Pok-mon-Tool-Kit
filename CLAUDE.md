# Pokémon Tool Kit

The shared knowledge for code-drawn Pokémon remakes. Game repos hold game code; this repo holds what carries over
between games. Read `playbook/README.md` before starting work on any game.

## Rules for every game
- Everything on screen is drawn by code: no ripped sprites, tiles or audio. The original game is the reference for
  maps, scripts, text and data.
- Keep the "28 LOVELAND GAMES" reference in every game: an opening card and a title-screen credit.
- Work chapter by chapter (badge to badge), commit and push to the working branch, and don't open a PR unless asked.

## Keeping this repo useful
- When a lesson is about porting games in general, write it here (`playbook/lessons.md`, or the playbook file it
  belongs to). When it's about one source game, write it in that game's repo, and add it to `playbook/games/` if
  a sibling game would benefit. The `record-lesson` skill has the test.
- A lesson says what happened, why, and what to do instead, in a few lines, with the real example.
- When a tool improves in a game repo and the improvement is general, note it in `playbook/tools.md`. The code
  itself stays in the game repo (`ENGINE.md` names the reference repo), and `tools/new_game.js` copies it forward.
- Update `ENGINE.md` and the README table when a newer game becomes the engine reference.
- Commit messages describe what was learned, not just which files changed.
