# Engine reference

**Current reference: `addisonlarock95/Pok-mon-Emerald-01`, branch `claude/emerald-setup`.** Start new games from
it with `tools/new_game.js`. It contains the whole Red engine plus everything Emerald added (2x hi-res layer, Gen 3
mechanics, script interpreter), so it is the most capable starting point.

## Layout (as in Claude Emerald)

Plain browser JavaScript, no build step and no dependencies. `index.html` lists every script in load order; each
file adds to the global `G`.

| Path | Contents |
| --- | --- |
| `src/core/` | `gfx.js` (surfaces, shapes, the 2x hi-res layer), `font.js`, `input.js`, `engine.js` (scene stack, coroutines), `audio.js` (synth and songs) |
| `src/art/` | Everything drawn: `pokesprite.js` (the shape rasteriser for Pokémon and props), `people.js` and `chars.js` (characters), `terrain.js` and `buildings.js` (outdoor labels), `interior.js` (rooms and caves), `palette.js` (colour ramps and themes), `portraits.js`, `battlebg.js`, `vfx.js` (move effects), `ambient.js` |
| `src/game/` | `map.js` and the region's map loader, `maprender.js` (label grid → layers, themes, cell patches), `overworld.js` (movement, warps, interaction, drawing), `battle.js`, `battlescene.js`, `battleflow.js`, `pokemon.js`, `party.js`, `bag.js`, `menus.js`, `pc.js`, `escript.js` (the script interpreter), `story.js` (scripted-scene helpers, pathfinding), `fieldmoves.js`, then region files (`hoenn*.js`: specials, events, Day Care, berries) |
| `src/data/` | Generated data (`hoenn_maps.js`, `hoenn_scripts.js`, `hoenn_data.js`, `hoenn_music.js`), species shapes (`mons/*.js`), cast and building styles. Generated files come from `tools/emerald/convert_*.js`. |
| `src/main.js` | Boot. |
| `tools/` | Engine-level tools (`headless.js`, `story.js`, `autoplay.js`, `build_single.js`, sheets) |
| `tools/emerald/` | Source-game tools (converters, `mapcheck`, `audit`, `talksweep`, probes, tests, `saves/`) |

Region code is layered over the inherited engine by wrapping functions (`const prev = G.x; G.x = function () {...}`),
so Kanto behaviour keeps working where Hoenn code doesn't override it. That is also why old-region early returns can
hide in shared code (see `playbook/lessons.md`, "Inherited engine code").

## History
- Claude Red: the original engine (`levy-street/pokemon-claude-red`, copied to `addisonlarock95/pok-mon-red01`).
- Claude Emerald: imported Red's engine as its baseline commit, then added the hi-res layer, Gen 3 data, the
  script interpreter and the Hoenn map pipeline.
