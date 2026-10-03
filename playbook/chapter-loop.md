# The chapter loop

The order that works, with exit criteria. A chapter is one badge's worth of story.

1. **Scope.** List the chapter's maps in story order (towns, routes, caves and their interiors). Add them to the map
   converter's list. Fetch any missing source assets (for a decomp in a sparse checkout, `git sparse-checkout add`).
2. **Maps.** Render ours beside the original for several maps per command (`mapcheck`). Fix at the highest level
   that covers the problem:
   1. a **general converter rule** (fixes every map, including ones not looked at yet),
   2. a **palette theme** (restyles a whole region with a few colour ramps, no new drawing code),
   3. a **tileset override** (one metatile id → label, for every map on that tileset),
   4. a **map override** (building boxes, label rectangles, per-map ids),
   5. a **hand-traced grid** (last resort, for rooms the classifier can't read).

   Exit: each map reads like the original at a glance, with no unexplained label/collision disagreements.
3. **Audit** the chapter (`audit <regex>`). Its list *is* the to-do list: missing specials, script commands, cast
   sprites, portraits, species art (including evolutions), songs, warps to unconverted maps. Exit: only link-cable
   and later-chapter items remain.
4. **Play the story through** with the story driver from the previous chapter's save, saving milestones. When it
   stalls, diagnose with `reach` (no path), `warproute` (multi-floor routes), `battleprobe` (a battle that won't
   end or keeps being lost) and `mapinfo` (where things are). Prove an engine bug in isolation before changing the
   engine. Exit: the badge and the chapter's key items are received.
5. **Sweep.** Talk to every NPC and sign in the chapter (`talksweep <regex> <save>`), then the whole game (`.`).
   Exit: zero problems outside the written list of known test-only hangs.
6. **Ship.** Run the feature tests, build the single-file version, commit with a message describing the chapter,
   push, and republish the test link if there is one.
7. **Learn.** Anything that took over an hour goes into `lessons.md` here (or the game's own notes), with an audit
   check if one could have caught it.
