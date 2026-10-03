---
name: record-lesson
description: File a lesson learned, a new tool or a process improvement where future games will find it. Use after anything took over an hour, after a bug that a check could have caught, when a tool is added or improved, or when the user asks to save what was learned.
---

# Recording a lesson

1. **Decide where it goes.**
   - About porting games in general (testing, rendering, converters, workflow, engine semantics that recur) →
     this tool kit, `playbook/lessons.md` under the right heading (or `chapter-loop.md` / `tools.md` if it
     changes the process or a tool).
   - About one source game's data or engine → the game repo's own notes. If a sibling game (same generation or
     decompilation family) would hit it too, also add a line to `playbook/games/<family>.md`.
   - Both is fine: the general rule here, the specific detail there.
2. **Write it in a few lines:** what happened, why, what to do instead, with the real example and the game
   marked (E), (R)...
3. **Add a check if one could have caught it** (the game's `audit.js`, a test, or a sweep rule), and say so in
   the lesson.
4. **Commit the tool kit** with a message that states the lesson, and push it to its working branch.

Don't record one-off typos or things the code now makes impossible, unless the trap could recur in another game.
