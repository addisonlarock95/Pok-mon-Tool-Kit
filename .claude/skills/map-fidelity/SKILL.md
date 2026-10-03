---
name: map-fidelity
description: Make converted maps look like the original in a code-drawn remake. Use when a map looks wrong, labels disagree with collision, a region needs its own look, or a script-changed cell draws wrong.
---

# Map fidelity

1. **Look first.** `mapcheck MapA MapB --no-convert` renders the original beside ours and lists label/collision
   disagreements with metatile ids. Look at the image before changing anything.
2. **Find the level that covers the problem**, highest first:
   - Wrong on many maps, or a behaviour-type problem → a **converter rule** (it also fixes maps not looked at yet).
   - Right shapes, wrong colours for a region → a **palette theme** (a few ramps; no new painter).
   - One metatile wrong wherever its tileset is used → a **tileset override**.
   - One map's buildings or areas → a **map override** (`_buildings`, `_rects`, `_ground`, `_below`).
   - A room the classifier can't read → a **hand-traced grid** (last resort).
3. **New label?** Only when no existing label can be themed into it. Add its painter, its ground/blocking
   classification and any animation together.
4. **Rerun the converter**, never edit generated files. Re-check with `mapcheck`.
5. **Script-changed cells** (`setmetatile`): make sure every frame of a changing metatile (doors, switches) maps to
   a sensible label with a tileset override, then check the changed state in a screenshot.
6. **Contrast check.** Look at new art on its real background, at night as well as day.

Exit: each map reads like the original at a glance and no disagreement is unexplained.
