---
name: port-chapter
description: Port the next chapter (badge to badge) of a code-drawn Pokémon remake, or check a chapter for gaps. Use when asked to "do the next chapter", "keep building", "continue the story", "check for gaps", or to fix how a stretch of maps looks or plays. A game repo may have its own port-chapter skill with game-specific paths; use both.
---

# Porting a chapter

Follow `playbook/chapter-loop.md` in this tool kit. Tool paths are in the game repo's `CLAUDE.md`.

1. **Scope.** List the chapter's maps in story order; add them to the map converter; fetch missing source assets.
2. **Maps.** `mapcheck` several maps per command; fix at the highest level (converter rule > theme > tileset
   override > map override > hand-traced grid). Exit: no unexplained label/collision disagreements.
3. **Audit** with the chapter regex. Implement every special, command, cast entry, portrait, species (including
   evolutions) and song it lists. Exit: only link-cable and later-chapter items remain.
4. **Story.** Drive it from the previous chapter's save. Stuck? Use the `story-testing` skill. Save milestones as
   `chN_*.json` and update the saves README. Exit: the badge and the chapter's key items are received.
5. **Sweep** the chapter, then the whole game. Exit: zero problems outside `KNOWN`.
6. **Ship.** Tests, single-file build, commit describing the chapter, push, republish the test link.
7. **Learn.** Use `record-lesson` for anything that took over an hour or would have been caught by a check.

Keep the user posted in a line or two at each step; they follow along from a phone.
