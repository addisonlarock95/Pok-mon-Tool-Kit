# Gen 3 notes (from Claude Emerald)

For Emerald and its siblings (Ruby, Sapphire, FireRed, LeafGreen): the pret decompilations share formats, so most
of this applies to all of them. The full Emerald specifics live in that repo's `docs/PLAYBOOK.md`.

## Reading the decompilation
- Maps are `data/maps/<Map>/map.json` (events, connections) plus layouts with metatile ids. Metatile behaviour and
  collision come from the tileset's `metatile_attributes.bin` (low byte behaviour); metatiles below 0x200 are the
  primary tileset, from 0x200 the secondary.
- Event scripts are `.inc` macro files (`data/maps/<Map>/scripts.inc`, `data/scripts/*.inc`). Convert them to
  data and interpret the commands; `special Name` calls a C routine in `src/*.c` (often `field_specials.c`) that
  has to be ported by hand.
- Trainers are `src/data/trainers.h` plus `trainer_parties.h`: IVs are 0–255 there and become `iv * 31 / 255`.
- Sparse checkout keeps the clone small: `git sparse-checkout add data/tilesets/secondary/<name>` when a map's
  tileset is missing.

## Engine behaviour worth matching
- Warps on plain ground (`MB_NORMAL`) are inert; door warps ignore collision; arrow warps need the direction.
- `setobjectxyperm` and `setobjectmovementtype` change templates that reload with the next map.
- `ON_TRANSITION` runs before objects spawn, `ON_LOAD` before the first draw, `ON_FRAME` tables each idle frame,
  `ON_WARP_INTO_MAP` after a warp.
- `setmetatile` is followed by `special DrawWholeMapView`; a cheap cell patch is enough for interiors.
- Field moves need the Hoenn badge flags (`FLAG_BADGE0n_GET`), not the old badge names.
- Eggs: a party Pokémon with the steps-to-hatch count and hp 0.

## Map conversion tricks that worked
- Label from behaviour first, then a colour census of the metatile, then overrides: tileset-wide ids, per-map
  `_buildings` boxes, `_rects`, `_ground`, and `_below` (label the cell under a metatile).
- Palette themes per region (`volcanic`, `ash`, `khaki`, `desert`) restyled whole areas without new painters.
- Shallow water became its own label (`shallows`); underground water, waterfalls and lava each needed a painter.
