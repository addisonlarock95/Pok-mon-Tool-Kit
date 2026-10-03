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

## Inherited engine code

The engine is carried from game to game, so old-game assumptions hide in shared code paths.

- **Old-region code paths can silently skip the new region.** (E) A field-interaction function returned early
  when a cell had no Kanto "quad", so Surf never offered itself on Hoenn water. When a field action does nothing,
  look for an early return on old-game data first.
- **Code run during a map load sees the previous map's state.** (E) Specials run by a map's load script redrew
  `ow.render`, which still belonged to the previous map, and crashed. Redraws during a load now just drop the
  cache, and the load builds the new render afterwards.

## Data conversion

- **Spot-test every data converter by counting something that must be true.** (E) A regex silently dropped second
  types and second abilities for four chapters. It was found only when Shock Wave hit Marshtomp "super
  effectively". After any converter change, count e.g. dual-typed species.
- **Generated files are never hand-edited.** Change the converter or its JSON inputs and rerun it; otherwise the
  next conversion silently undoes the fix.
- **Paraphrase dialogue, keep the beats.** (R) Every text label exists with new wording that follows the original
  line by line, so scripts keep working by label.

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
- **Long work in an ephemeral cloud container:** commit and push at every chapter boundary, and keep lessons in a
  repo (this one), never only in the session.
