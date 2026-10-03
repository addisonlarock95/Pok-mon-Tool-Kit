# Tools

All headless, run with Node from the game repo's root. Paths below are as in Claude Emerald (`tools/` holds the
engine-level tools, `tools/<game>/` the ones that read the source game). The code lives in the game repo named in
`ENGINE.md`; `tools/new_game.js` copies it into a new game.

## Engine-level (any game)

| Tool | What it does |
| --- | --- |
| `tools/headless.js` | Loads every `<script>` from `index.html` into a Node VM and saves frames as PNG. Everything else builds on it. |
| `tools/story.js prefix "cmd ..."` | The story driver: `load:` `save:` `go:x,y` `step:dir:n` `face:` `A` `pick:N` `w:N` `eval:` `trace` `log` `shot`. Text boxes advance by themselves; menus take the first option unless `pick:` says otherwise. |
| `tools/autoplay.js` | The shared "play like a person" policy: strongest move with PP left, a healthy switch-in, presses through evolution and forced switches. Every automated player uses it, so a hang is never "the test pressed the wrong button". |
| `tools/build_single.js` | Inlines everything into one offline HTML file (`dist/`), which is what gets published as the test link. |
| `tools/monsheet.js`, `peoplefront.js`, `portraitsheet.js` | Contact sheets for reviewing new Pokémon, overworld people and battle portraits. |

## Source-game tools (one set per source game, same shape each time)

| Tool | Use it when |
| --- | --- |
| `convert_maps.js [filter]` | Maps → label grids. Takes a map filter for fast single-map iteration. |
| `convert_scripts.js`, `convert_data.js`, `convert_music.js` | Event scripts, species/moves/trainers, songs. Generated files are never hand-edited. |
| `mapcheck.js MapA MapB [--no-convert]` | Fixing how maps look: renders the original beside ours for several maps in one image and lists label/collision disagreements with metatile ids. |
| `sheet.js`, `compare.js`, `refmap.js --ids` | Labelling: every metatile a map uses; one map band, big; the raw id grid for tracing building boxes. |
| `audit.js [regex]` | Start of every chapter and before committing. Lists everything the chapter's scripts need that the engine lacks. |
| `mapinfo.js Map` | Before a story leg: exits, warps and their kinds, objects and hide flags, edge cells. |
| `reach.js Map x y [row0 row1]` | `go` says "no path": prints what is reachable; the first unreached cell next to the reached region is the blocker. |
| `warproute.js A x y B x y [regex]` | Puzzles across floors (gym vents, cave holes): the warps to take. |
| `battleprobe.js TRAINER [save] [--party SP:LV,...] [--log N]` | A battle never ends or keeps being lost: fights it in isolation and prints the whole log. |
| `talksweep.js [regex] [save] [--jobs N]` | End of chapter: talks to every NPC and sign in parallel workers; keeps a `KNOWN` list of test-only hangs with reasons. |
| `tests/*.js` | Feature tests for tricky systems (eggs and the Day Care; a cell patch equals a full rebuild). |
| `saves/` | Milestone saves (`chN_*.json`) with a README table. |

## When to build a new tool

When the same diagnosis has been done by hand twice. `mapcheck` exists because look-fix-look round trips, not
conversion speed, were the real cost; `talksweep` went parallel when sweeps passed three minutes.
