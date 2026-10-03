# The approach

- **Everything is drawn by code.** No ripped sprites or tiles: the original game is the *reference* (layouts,
  collision, scripts, text, data), and our renderer paints every cell, character and Pokémon from parameters. That is
  what lets the look be "higher resolution, more mature" while staying faithful.
- **Maps become label grids.** Each metatile turns into one semantic label (`grass`, `cliff`, `roof_house`,
  `vent`...). Collision, elevation, warps, signs and objects come across unchanged. The renderer knows how to paint
  each label and how labels meet (rims, shadows, building groups). New areas mostly need new labels and palette
  themes, not new drawing code.
- **Scripts run, not get rewritten.** The original event scripts are converted to data and interpreted. Engine
  routines they call ("specials") are re-implemented one by one as the audit finds them. A scene the remake stages
  differently replaces one script label and leaves the rest alone.
- **Chapters.** Work goes badge by badge: maps, then story playthrough, then art and music for that stretch, then
  an audit and a sweep, then commit. Each chapter ends with a milestone save, so the next chapter starts from it
  instead of replaying the game.
- **Headless first.** Every check runs in Node without a browser (a VM loads the game's scripts and dumps frames to
  PNG). Claude can play, screenshot and sweep the game by itself.
