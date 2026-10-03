# Gen 1 notes (from Claude Red)

Claude Red (`addisonlarock95/pok-mon-red01`, a copy of `levy-street/pokemon-claude-red`) was the first game and the
origin of the engine: the shape rasteriser, all 151 Pokémon as lists of shapes, the label painters, battle VFX and
music.

- Source: pret's `pokered`. Maps are built from 2x2 "quads" of 8x8 tiles; labels are one per quad
  (`docs/tile-label-notes.md` there lists them by tileset). Several quads are shared by maps that show different
  things, so a few maps need per-map overrides.
- Story scripts were hand-written per map in `src/scripts/` from the `.asm` (Gen 1 has no script bytecode worth
  interpreting). From Gen 3 on, convert and interpret the scripts instead.
- Dialogue: every original text label exists with paraphrased wording, extracted with `tools/extract_text.js` as
  a reference kept out of the repo.
- Kanto code paths still live in the Emerald engine; see the "Inherited engine code" lessons.
