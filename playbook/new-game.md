# Starting a new game

The engine is never written from scratch: each game starts as a copy of the latest one (Emerald started as a copy
of Red), and old-game code is removed or bypassed only when it gets in the way. `ENGINE.md` names the current
reference repo.

## Steps

1. **Repos.** Create an empty GitHub repo for the game, and start a Claude Code session with it, this tool kit and
   the engine reference repo (or attach them partway through).
2. **Copy the engine.** `node tools/new_game.js <reference repo> <new repo> --name "Claude <Game>"` copies the engine,
   tools and build, drops history, saves and build output, and writes a starting `CLAUDE.md` from `templates/`.
   Commit that as the baseline ("Import the engine from <reference>").
3. **Source reference.** Clone the original game's decompilation (pret's `pokered`, `pokeemerald`, `pokefirered`,
   `pokecrystal`...) next to the repo, sparse if it's big. Record its path in the new `CLAUDE.md`.
4. **Data converter first** (species, moves, trainers, items), with a spot test that counts something that must be
   true (dual types, evolution counts).
5. **Map converter**, then `mapcheck` on the first town until it reads like the original.
6. **Script converter plus audit.** Port specials as the audit lists them.
7. **Story driver on the opening** (intro, first town, starter), then a `ch1_` save.
8. **Then chapters** with the `port-chapter` skill.

## What carries over unchanged, what doesn't

| Usually unchanged | Usually new per game |
| --- | --- |
| `src/core/` (graphics, input, engine loop, audio) | Map/script/data converters (`tools/<game>/`) |
| The shape rasteriser and people/Pokémon renderers | Generated data (`src/data/<region>_*.js`) |
| Label painters, palette themes, interiors | New labels, themes and tileset overrides for the region |
| Battle engine (extend per generation: abilities, held items, doubles) | Specials for the game's scripts |
| Script interpreter, story driver, autoplay, sweep, audit, probes | Cast, portraits, species art for new Pokémon |
| Single-file build | Title screen and opening (keep the 28 LOVELAND card and credit) |

## Same generation vs a new one

- **A sibling game** (FireRed/LeafGreen or Ruby/Sapphire after Emerald) reuses almost everything, including the
  Gen 3 converters: point them at the other decompilation and expect differences in specials and map layouts.
  Read `games/emerald.md` first.
- **A new generation** (Gen 2 or Gen 4) needs new converters and battle mechanics; the method and tools stay the
  same.
