# Lessons that cost the most time

Each lesson: what happened, and what to do instead. Examples are from the game where it happened (E = Emerald,
R = Red). Add new ones at the end of the right section; keep each to a few lines.

## Test artefacts vs real bugs

- **Reproduce in isolation before changing the engine.** Most "hangs" found by automated play are the test's
  fault. In Emerald chapter 5, four of five were the driver: it pressed the first move forever after its PP ran
  out, never pressed A in the evolution scene, pressed B on a forced switch, or answered YES to a prompt that
  offers the same choice forever. Hence one shared play policy (`autoplay.js`) for every automated player.
- **Keep a written list of known test-only hangs** (`KNOWN` in the sweep) with the reason for each, so they are
  hidden but not forgotten.
- **A lost battle is usually the test party, not the engine.** Print the whole fight (`battleprobe --log 80`)
  before suspecting damage or AI code. (E) Norman won because the eval-built Combusken had no Fighting move.
- **Pathfinders must keep warp cells off the route,** the first step included, unless the warp is the goal.
  (E) Starting on one of a pair of room-door warps, the driver stepped onto the other and bounced through the gym.
- **Drive exact routes one cell per press.** Holding a direction for a fixed number of frames sometimes started a
  second step (a walk takes 16 frames, the hold was 18), which broke every precomputed route. (E) `step:N` now holds
  until the step starts, then releases.
- **Puzzles whose state changes as you walk need a state search, not a path.** (E) Fortree Gym's turnstiles: the
  pathfinder found no route at all. A breadth-first search over position plus every gate's orientation, using the
  game's own gate rules, solves it, and proves the port is solvable. Solve from the *live* state and re-solve after
  any interruption: a trainer who walks over to battle stands where the old plan expected floor (`gatego`).
- **Never level a test party by setting its level.** Setting `.level` (an `eval` shortcut) skips the level-up that
  triggers evolution. (E) Combusken sat at 36 unevolved for three chapters, evolved a level late and missed Blaze
  Kick, and I first blamed the test party's "bad luck" on faithful behaviour. A real player's Combusken evolves at 36
  and learns it. Give EXP instead, and keep a check over the milestone saves (`tests/saves.js`: nothing unevolved
  past its evolution level). When a test party looks weaker than a player's would, suspect the test edits first.
- **The autoplayer must ask the engine what is legal.** (E) A "hung" double battle was the test choosing a DISABLEd
  move every turn; its own scoring ignored DISABLE, TAUNT and TORMENT. Score only moves the engine's `usable()`
  accepts, and drop moves that can't work (Dream Eater on an awake foe).
- **A route command stops when the map changes.** (E) `surfgo` to a warp kept walking toward the same numbers on the
  new map and left the player somewhere random. Any goto-by-coordinates in a driver should end on a map change.
- **Test-save hacks leak into later tests.** (E) The saves carried a 9999-step REPEL to keep story runs quiet, so a
  grinding command fought nothing for 4000 steps. Name such hacks in the saves README and undo them where they
  get in the way.
- **Level test parties by EXP, with a grind command, not by editing.** (E) `grind:N` paces in grass or water until N
  wild battles are fought; evolutions and moves happen as for a player.

## Measure before optimising

- **The guessed bottleneck is usually wrong.** (E) Converting all maps took 2 s; the real cost was the number of
  look-fix-look round trips. So `mapcheck` shows many maps per command.
- **Know the real costs.** (E) A full outdoor map render takes 0.4–2 s, an interior 0.05–0.25 s. Hence cell
  patches for interiors and background rebuilds for outdoor maps when a script changes a cell.

## Be faithful to the original's semantics, not just its data

Reading the data right isn't enough: check what the original *engine does* with it.

- **Events can be inert.** (E) A warp event on plain ground does nothing in pokeemerald; it needs a warp-type tile
  behaviour. Treating every warp as active broke the Lavaridge Gym puzzle and showed hidden cave mouths.
- **Don't key things by a value that can repeat.** (E) A map side can have two neighbours (Route 111's west side
  meets Route 113 *and* Route 112). Keying connections by direction alone silently lost Route 113.
- **Check how long a script's effect lasts.** (E) Map-load scripts re-run on every load, so what they set is
  per-visit and must not be saved. `setobjectxyperm` lasts only until another map loads (templates are reloaded
  from the map header); persisting it moved Norman to the gym entrance for good.
- **Check what a check ignores.** (E) A door warp works whatever the cell's collision says (`TryDoorWarp` reads
  only the behaviour). Petalburg Gym's sliding doors are impassable tiles you still walk through.
- **Return values matter.** (E) `specialvar` stores the special's return value, so every special that answers
  must `return` it.
- **Trainer and object types change behaviour.** (E) Buried trainers see in all four directions at range 1 and
  are invisible until they pop out.
- **Check the battle format before tuning difficulty.** (E) Tate & Liza were unwinnable one-on-one because the
  engine only had single battles; every `trainerbattle_double` had quietly run as singles for seven chapters. If the
  original has double battles, port them early: a leader designed for two-on-two is a different fight in singles.
- **A warp within the same map may keep the room as it is.** (E) Mossdeep Gym's pads save the objects
  (`DoMossdeepGymWarp`); reloading them undid the switch puzzle. Read how a warp type loads objects before treating
  all warps alike.
- **Port a puzzle with a solver beside it.** (E) The rotating-tile puzzle has `tools/tilepath.js`, a search over
  the player's cell and every object's position using the game's own rules. Comparing its predicted state with the
  live one after each step found the warp bug above in minutes.

## Inherited engine code

The engine is carried from game to game, so old-game assumptions hide in shared code paths.

- **Old-region code paths can silently skip the new region.** (E) A field-interaction function returned early
  when a cell had no Kanto "quad", so Surf never offered itself on Hoenn water. When a field action does nothing,
  look for an early return on old-game data first.
- **Code run during a map load sees the previous map's state.** (E) Specials run by a map's load script redrew
  `ow.render`, which still belonged to the previous map, and crashed. Redraws during a load now just drop the
  cache, and the load builds the new render afterwards.
- **Test each field move in the new region the chapter it unlocks.** Surf (chapter 6) and Fly (chapter 7) both
  silently used Kanto data in Hoenn: an early return on Kanto tiles, then a Kanto-only destination list and town map.
  A small test per field move (`tests/fly.js`) catches it on the day the HM arrives.
- **Things the original draws as sprites aren't in the map data.** (E) Rotating gates exist only in C tables
  (`rotating_gate.c`); the converted gym was a wide-open room. The audit lists their set-up specials
  (`RotatingGate_InitPuzzle`); treat a special whose name sounds like a puzzle as a missing mechanic, not a no-op.
- **Objects are addressed by name and by number; support both everywhere.** (E) Scripts do
  `setvar VAR_0x8008, LOCALID_X` and then `applymovement VAR_0x8008`: the variable holds the number. Hoenn objects
  had no number, so the lookup failed silently and `removeobject` hid the wrong person (and its hide flag hid a
  whole team of grunts).
- **Generalise an engine from 1v1 to NvN by battler objects, not by copying the loop.** (E) The Gen 3 engine worked on
  `side` objects with a `foe`; doubles became extra battlers sharing the party and side screens, a target set before
  each hit, and a separate turn loop. The single-battle path stayed untouched, so every earlier save still behaves
  the same.

## Data conversion

- **Spot-test every data converter by counting something that must be true.** (E) A regex silently dropped second
  types and second abilities for four chapters. It was found only when Shock Wave hit Marshtomp "super
  effectively". After any converter change, count e.g. dual-typed species.
- **Generated files are never hand-edited.** Change the converter or its JSON inputs and rerun it; otherwise the
  next conversion silently undoes the fix.
- **Paraphrase dialogue, keep the beats.** (R) Every text label exists with new wording that follows the original
  line by line, so scripts keep working by label.
- **Order specific rules before generic ones, and don't trust names.** (E) The water rule matched any behaviour
  containing POND or OCEAN, so `MB_BRIDGE_OVER_POND_*` and `MB_BRIDGE_OVER_OCEAN` became water and Route 119's and
  120's bridges vanished. A cycling-road rule keyed on the same behaviour also needed limiting to its own tileset.
- **A per-map override list can replace detection for the whole map.** (E) Listing the Weather Institute's
  building box made Route 119's house vanish, because a `_buildings` list switches building detection off for that
  map. Know which overrides add and which replace.
- **After any converter change, diff the labels of every other map** against the last commit (`labeldiff`). Only
  the maps you are working on should change; anything else is a regression in a map nobody is looking at.

## Coverage

- **Each surprise teaches the audit a new check.** (E) The audit learned to look for unconverted songs, cast
  without sprites, trainer portraits and evolutions without art. Sceptile, Blaziken and Swampert were reachable at
  level 36 with no art at all.
- **Sweep the whole game before committing,** not just the chapter. (E) A chapter 6 engine change crashed
  Mauville Gym (chapter 4); only the whole-game sweep caught it.

## Rendering

- **Caches must key on everything that changes the output.** (E) Palette themes swap colour ramps around each map
  build; a sprite cache without the theme in its key leaked a themed tree into the next map.
- **Painters that read only labels, never pixels,** let a window of cells be repainted on scratch layers and copied
  back pixel for pixel (`mapRender.patch`; a test proves it equals a full rebuild).
- **Hi-res overlays.** (E) Drawing a low-res pixel on the screen clears hi-res ownership there. That is how overlays
  (darkness, the bike) draw over hi-res sprites, and also why a low-res mount vanishes under a hi-res rider: give
  it a hi-res twin.
- **Contrast against the ground it sits on.** (E) The first surf mount was navy on navy water and unreadable;
  check new sprites on their real background.
- **Invisible means no shadow either.** (E) Kecleon are `MOVEMENT_TYPE_INVISIBLE` until the Devon Scope; drawing
  their soft shadow would have given them away.
- **A region's identity can live in one building type.** (E) Fortree read as an ordinary town until its houses got a
  tree-house style (log walls, a leaf crown) and labels for the deck face, railings and ladders. Compare a town
  against the original for its signature feature before polishing details.
- **Reserve a look for each gameplay signal; texture must never imitate it.** (E) Open sea had random darker patches
  that read like dive spots, while the real dive spots weren't drawn differently at all. Give the signal its own label
  and its own colours (dive spots: the darkest blues), and keep background variation going the other way (lighter).

## Workflow

- **Fix at the highest level that covers the problem** (converter rule > theme > tileset override > map override
  > hand-traced grid). A rule fixes maps nobody has looked at yet.
- **Milestone saves per chapter** turn a 20-minute replay into a one-line `load:`. Note in the saves README when
  test parties were strengthened by `eval`.
- **Write standalone scripts for multi-step probes** rather than long `eval:` chains: the driver splits commands on
  spaces, and strict-mode keywords break inline code.
- **Rename everything that identifies the old game when copying the engine:** title, build output name, and
  above all the save key. (E) Emerald still saved under Red's `localStorage` key, so the two games on one web
  address would overwrite each other's saves. `tools/new_game.js` now lists these.
- **Keep a status file in the game repo (`docs/STATUS.md`)** with the current chapter's stages as a checklist and
  notes for whoever picks the work up. A session can end mid-chapter (time limits, context limits); committing the
  status with each stage means the next session starts from facts, not from a summary.
- **Long work in an ephemeral cloud container:** commit and push at every chapter boundary, and keep lessons in a
  repo (this one), never only in the session.
