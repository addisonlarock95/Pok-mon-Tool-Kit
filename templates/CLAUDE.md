# {{NAME}}

A code-drawn remake of {{SOURCE}} in plain JavaScript: everything on screen is drawn by code. The engine came from
{{REFERENCE}}. {{SOURCE_DECOMP}} is the reference for maps, scripts, text and data.

**General method, lessons and skills live in the tool kit: `addisonlarock95/Pok-mon-Tool-Kit`.** Attach it to the
session if it isn't there (`add_repo`), read its `playbook/README.md` and `playbook/lessons.md`, and file general
lessons there (its `record-lesson` skill). Notes about this game only go in `docs/` here.

**Where the work stands: `docs/STATUS.md`** (read it first in a new session; update it at each stage).

## Working rules
- Work chapter by chapter (badge to badge): maps → story playthrough → art and music → audit → sweep → build →
  commit and push to the working branch. Don't open a PR unless asked.
- Fix things at the highest level that covers them (converter rule > palette theme > tileset override > map override
  > hand-traced grid).
- Reproduce a suspected engine bug in isolation before changing the engine.
- Keep the "28 LOVELAND GAMES" reference: the opening card and the title screen credit.
- Generated files come from the converters: change the converter or its inputs, then rerun it. Don't hand-edit them.

## Quick commands
    node tools/build_single.js            # dist/ single-file build
    (add the converter, mapcheck, audit, story and sweep commands here as they are set up)
