#!/usr/bin/env node
// Start a new game repo from the latest game's engine (see playbook/new-game.md).
//   node tools/new_game.js <reference repo dir> <new repo dir> --name "Claude Crystal" [--source "Pokémon Crystal"] [--dry]
// Copies the reference repo's working tree (engine, tools, build) into the new repo, leaving out git history, build
// output, milestone saves and the old game's CLAUDE.md, skills and playbook, then writes a CLAUDE.md from
// templates/CLAUDE.md. The old game's data and region code are kept (the engine still needs them to boot); it prints
// them as a checklist to replace or bypass as the new game's converters come up.
'use strict';
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2), opt = k => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : null; };
const [src, dst] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && args[i - 1] !== '--dry'));
if (!src || !dst) { console.log('usage: node tools/new_game.js <reference repo> <new repo> --name "Claude <Game>" [--source "<original>"] [--dry]'); process.exit(1); }
const name = opt('name') || 'Claude Game', source = opt('source') || 'the original game', dry = args.includes('--dry');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'out', 'dist', 'saves', '__pycache__', 'data']);
const SKIP_FILES = new Set(['CLAUDE.md', 'README.md', '.DS_Store']);
const SKIP_PATHS = ['.claude/skills', 'docs/PLAYBOOK.md']; // the old game's own guidance; the tool kit replaces it
const rel = p => path.relative(src, p).split(path.sep).join('/');
let files = 0, bytes = 0;
const gameSpecific = [];
function copy(from) {
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const f = path.join(from, e.name), r = rel(f);
    if (SKIP_PATHS.some(s => r === s || r.startsWith(s + '/'))) continue;
    if (e.isDirectory()) {
      // top-level data/ is the old site's database; src/data/ is game data and stays
      if (SKIP_DIRS.has(e.name) && !(e.name === 'data' && r !== 'data')) continue;
      copy(f); continue;
    }
    if (from === src && SKIP_FILES.has(e.name)) continue;
    const to = path.join(dst, r);
    if (!dry) { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(f, to); }
    files++; bytes += fs.statSync(f).size;
    if (/^src\/data\/|^src\/scripts\/|^tools\/[a-z]+\//.test(r) || /\/(hoenn|kanto)[a-z0-9_]*\.js$/.test(r)) gameSpecific.push(r);
  }
}
if (!fs.existsSync(path.join(src, 'index.html'))) { console.log('no index.html in ' + src + ': not a game repo'); process.exit(1); }
if (!dry && fs.existsSync(dst) && fs.readdirSync(dst).some(n => n !== '.git')) { console.log(dst + ' is not empty; refusing to overwrite'); process.exit(1); }
copy(src);
const tpl = fs.readFileSync(path.join(__dirname, '..', 'templates', 'CLAUDE.md'), 'utf8')
  .replace(/\{\{NAME\}\}/g, name).replace(/\{\{SOURCE\}\}/g, source)
  .replace(/\{\{REFERENCE\}\}/g, path.basename(path.resolve(src))).replace(/\{\{SOURCE_DECOMP\}\}/g, 'Its decompilation (path: fill in)');
if (!dry) {
  fs.writeFileSync(path.join(dst, 'CLAUDE.md'), tpl);
  fs.writeFileSync(path.join(dst, 'README.md'), '# ' + name + '\n\nA code-drawn remake of ' + source + '. Engine from ' + path.basename(path.resolve(src)) + '.\n');
}
console.log((dry ? '[dry run] would copy ' : 'copied ') + files + ' files (' + (bytes / 1048576).toFixed(1) + ' MB) to ' + dst);
console.log('\nOld-game data and region code kept so the engine boots; replace or bypass as the new converters arrive:');
const groups = {};
for (const r of gameSpecific) { const d = r.split('/').slice(0, r.startsWith('src/data/mons') ? 3 : 2).join('/'); (groups[d] = groups[d] || []).push(path.basename(r)); }
for (const d of Object.keys(groups).sort()) console.log('  ' + d + '/  ' + groups[d].slice(0, 12).join(' ') + (groups[d].length > 12 ? ' … (' + groups[d].length + ')' : ''));
console.log('\nAlso rename for the new game: the build output name in tools/build_single.js, the page title in index.html,');
console.log('the save key (SAVE_KEY in src/game/menus.js), and the title screen (keep the 28 LOVELAND card and credit).');
console.log('\nNext: commit the baseline, fill in CLAUDE.md, then follow playbook/new-game.md.');
