---
name: story-testing
description: Drive and debug automated playthroughs of a code-drawn remake. Use when the story driver stalls, "go" finds no path, a battle never ends or keeps being lost, a sweep reports hangs, or a scripted scene misbehaves.
---

# Story testing

Assume the test is wrong until proven otherwise (`playbook/lessons.md`, "Test artefacts vs real bugs").

| Symptom | First check |
| --- | --- |
| `go: no path` | `reach Map x y`: the first unreached cell beside the reached region is the blocker (a rock, a trainer, a missing connection, a mislabelled cell). |
| Ends up on the wrong map | The path crossed a warp cell; `mapinfo` lists warps and their kinds. |
| Multi-floor puzzle | `warproute A x y B x y`. |
| Battle never ends or is lost | `battleprobe TRAINER save --log 80`: read the fight. Usually the test party's moves. |
| Sweep hang | Re-run that one script with `trace`. Is the driver choosing an impossible option? Fix `autoplay.js` or add to `KNOWN` with a reason. |
| Nothing happens on A | `trace` shows no script: the interaction never reached the script or field-move check. Look for an early return in inherited code. |
| Crash on map entry | A load script touching the previous map's state. |

Rules:
- Reproduce an engine bug in isolation (a probe or a tiny test) before changing the engine, then add the test.
- Multi-step probes go in a standalone script, not a long `eval:` chain.
- If you strengthen a test party with `eval`, say so in the saves README.
