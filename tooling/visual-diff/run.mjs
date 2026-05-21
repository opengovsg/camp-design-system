#!/usr/bin/env node
// Visual diff: local Storybook vs production Storybook at design.open.gov.sg.
// See README.md.

import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync, createReadStream, readFileSync } from 'node:fs';
import { extname, join, dirname, resolve, relative, posix } from 'node:path';
import { URL, fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { chromium } from 'playwright';

// ---- constants ----

const REPO_ROOT = resolve(fileURLToPath(import.meta.url), '..', '..', '..');
const STORYBOOK_BASE_DIR = 'packages/camp'; // matches chromatic.yml's storybookBaseDir
const SHARED_SUBDIRS = new Set(['hooks', 'icons', 'theme', 'types', 'utils']);
const STATIC_MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
};

// ---- args ----

function parseArgs(argv) {
  const args = {
    base: 'https://design.open.gov.sg',
    localStorybook: join(REPO_ROOT, STORYBOOK_BASE_DIR, 'storybook-static'),
    skipBuild: false,
    out: join(REPO_ROOT, '.context', 'visual-diff'),
    viewportW: 1280,
    viewportH: 720,
    baseRef: 'origin/main',
    all: false,
    filter: null,
    concurrency: 4,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case '--base': args.base = next(); break;
      case '--local-storybook': args.localStorybook = resolve(next()); break;
      case '--skip-build': args.skipBuild = true; break;
      case '--out': args.out = resolve(next()); break;
      case '--viewport': {
        const [w, h] = next().split('x').map(Number);
        if (!w || !h) die(`--viewport expects WxH (got "${argv[i]}")`);
        args.viewportW = w; args.viewportH = h; break;
      }
      case '--base-ref': args.baseRef = next(); break;
      case '--all': args.all = true; break;
      case '--filter': args.filter = next(); break;
      case '--concurrency': args.concurrency = Number(next()) || 4; break;
      case '-h': case '--help':
        console.log(readFileSyncSafe(join(dirname(fileURLToPath(import.meta.url)), 'README.md')) || 'See README.md');
        process.exit(0);
      default:
        die(`Unknown arg: ${a}`);
    }
  }
  args.base = args.base.replace(/\/$/, '');
  return args;
}

function readFileSyncSafe(p) {
  try { return readFileSync(p, 'utf8'); } catch { return null; }
}

// ---- logging ----

const log = {
  info: (m) => console.log(m),
  step: (m) => console.log(`\n→ ${m}`),
  ok: (m) => console.log(`  ✓ ${m}`),
  warn: (m) => console.warn(`  ! ${m}`),
};
function die(msg, code = 1) {
  console.error(`\nError: ${msg}\n`);
  process.exit(code);
}

// ---- step 1: build storybook (or skip) ----

async function buildStorybook(args) {
  if (args.skipBuild) {
    log.step('Skipping Storybook build (--skip-build)');
    if (!existsSync(args.localStorybook)) {
      die(`--skip-build set but ${args.localStorybook} does not exist. Run without --skip-build first.`);
    }
    if (!existsSync(join(args.localStorybook, 'index.json'))) {
      die(`${args.localStorybook}/index.json is missing. The build may be incomplete; rebuild without --skip-build.`);
    }
    return;
  }
  log.step('Building local Storybook (packages/camp)');
  const result = spawnSync('npm', ['run', 'build-storybook'], {
    cwd: join(REPO_ROOT, STORYBOOK_BASE_DIR),
    stdio: 'inherit',
  });
  if (result.status !== 0) die(`Storybook build failed (exit ${result.status}). See output above.`);
  if (!existsSync(join(args.localStorybook, 'index.json'))) {
    die(`Storybook built but ${args.localStorybook}/index.json is missing. Storybook version may not be 7+.`);
  }
  log.ok(`Built to ${relative(REPO_ROOT, args.localStorybook)}`);
}

// ---- step 2: serve local storybook ----

async function serveLocal(rootDir) {
  const server = createServer(async (req, res) => {
    try {
      let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (urlPath.endsWith('/')) urlPath += 'index.html';
      const filePath = resolve(rootDir, '.' + urlPath);
      if (!filePath.startsWith(rootDir)) { res.writeHead(403).end(); return; }
      const s = await stat(filePath).catch(() => null);
      if (!s || !s.isFile()) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': STATIC_MIME[extname(filePath)] || 'application/octet-stream', 'Content-Length': s.size });
      createReadStream(filePath).pipe(res);
    } catch (e) {
      res.writeHead(500).end(String(e));
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const url = `http://127.0.0.1:${port}`;
  log.ok(`Local Storybook served at ${url}`);
  return { url, close: () => new Promise((r) => server.close(() => r())) };
}

// ---- step 3: fetch index.json ----

async function fetchIndex(url, label) {
  let res;
  try {
    res = await fetch(`${url}/index.json`);
  } catch (e) {
    die(`Failed to reach ${label} Storybook at ${url}: ${e.message}`);
  }
  if (!res.ok) die(`${label} Storybook returned HTTP ${res.status} for /index.json`);
  const json = await res.json();
  if (!json.entries || typeof json.entries !== 'object') {
    die(`${label} /index.json has unexpected shape (no .entries). Storybook 7+ expected.`);
  }
  const stories = Object.values(json.entries).filter((e) => e.type === 'story');
  log.ok(`${label}: ${stories.length} stories in index.json`);
  return stories;
}

// ---- step 4: affected-story scoping ----

function gitOutput(args) {
  const r = spawnSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' });
  if (r.status !== 0) die(`git ${args.join(' ')} failed: ${r.stderr.trim()}`);
  return r.stdout;
}

function getChangedFiles(baseRef) {
  // Committed changes on this branch
  const diffed = gitOutput(['diff', '--name-only', `${baseRef}...HEAD`, '--', `${STORYBOOK_BASE_DIR}/src/`])
    .split('\n').map((s) => s.trim()).filter(Boolean);
  // Uncommitted/WIP (staged + unstaged + untracked). Format: "XY <path>" (2-char status, space, path).
  // Renames show as "R  <old> -> <new>"; keep only the destination.
  const status = gitOutput(['status', '--porcelain', '--', `${STORYBOOK_BASE_DIR}/src/`])
    .split('\n').filter(Boolean)
    .map((line) => line.slice(3).replace(/^.*->\s+/, ''));
  return [...new Set([...diffed, ...status])];
}

function classifyChange(filePath) {
  // filePath is repo-relative, e.g. packages/camp/src/Avatar/Avatar.tsx
  const rel = filePath.replace(new RegExp(`^${STORYBOOK_BASE_DIR}/src/`), '');
  const firstSeg = rel.split('/')[0];
  if (!firstSeg) return { kind: 'shared', reason: 'top-level file in src/' };
  if (SHARED_SUBDIRS.has(firstSeg)) return { kind: 'shared', reason: `src/${firstSeg}/ is shared` };
  // Capitalized → component dir
  if (/^[A-Z]/.test(firstSeg)) {
    const isStory = /\.stories\.(ts|tsx|mdx)$/.test(rel);
    return { kind: isStory ? 'story' : 'component', component: firstSeg, importPath: `./src/${rel}` };
  }
  return { kind: 'shared', reason: `unrecognized path: ${rel}` };
}

function storyMatchesComponent(story, component) {
  // story.importPath is like ./src/Avatar/Avatar.stories.tsx
  return story.importPath?.startsWith(`./src/${component}/`);
}

function storyMatchesFile(story, importPath) {
  return story.importPath === importPath;
}

function scopeStories(stories, changedFiles) {
  if (changedFiles.length === 0) {
    return { scoped: [], expanded: false, classifications: [], reason: 'no changes detected against base ref' };
  }
  const classifications = changedFiles.map((f) => ({ file: f, ...classifyChange(f) }));
  const hasShared = classifications.some((c) => c.kind === 'shared');
  if (hasShared) {
    return { scoped: stories, expanded: true, classifications };
  }
  const ids = new Set();
  for (const c of classifications) {
    if (c.kind === 'story') {
      for (const s of stories) if (storyMatchesFile(s, c.importPath)) ids.add(s.id);
    } else if (c.kind === 'component') {
      for (const s of stories) if (storyMatchesComponent(s, c.component)) ids.add(s.id);
    }
  }
  return { scoped: stories.filter((s) => ids.has(s.id)), expanded: false, classifications };
}

function applyFilter(stories, filterGlob) {
  if (!filterGlob) return stories;
  const re = globToRegex(filterGlob);
  return stories.filter((s) => re.test(s.id));
}

function globToRegex(glob) {
  const pattern = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${pattern}$`, 'i');
}

// ---- step 5: screenshot + diff ----

async function screenshotAndDiff({ baseUrl, localUrl, stories, viewport, concurrency, outDir }) {
  const browser = await chromium.launch();
  try {
    const queue = [...stories];
    const results = [];
    const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
      const ctx = await browser.newContext({ viewport: { width: viewport.w, height: viewport.h } });
      try {
        const page = await ctx.newPage();
        while (queue.length) {
          const story = queue.shift();
          try {
            const r = await processStory(page, story, baseUrl, localUrl, outDir);
            results.push(r);
            log.ok(`${story.id} — ${r.changedPixels === 0 ? 'no diff' : `${r.changedPixels} px diff`}`);
          } catch (e) {
            log.warn(`${story.id} — failed: ${e.message}`);
            results.push({ story, error: e.message, changedPixels: 0, totalPixels: 0 });
          }
        }
        await page.close();
      } finally {
        await ctx.close();
      }
    });
    await Promise.all(workers);
    return results;
  } finally {
    await browser.close();
  }
}

async function processStory(page, story, baseUrl, localUrl, outDir) {
  const storyDir = join(outDir, 'stories', sanitizeId(story.id));
  await mkdir(storyDir, { recursive: true });
  const baseShot = await captureStory(page, baseUrl, story.id);
  const headShot = await captureStory(page, localUrl, story.id);
  await writeFile(join(storyDir, 'base.png'), baseShot);
  await writeFile(join(storyDir, 'head.png'), headShot);
  const basePng = PNG.sync.read(baseShot);
  const headPng = PNG.sync.read(headShot);
  // pixelmatch requires matching dimensions; if they differ, pad both to the larger box
  const { a: padBase, b: padHead, width, height, sizeMismatch } = padToMatch(basePng, headPng);
  const diff = new PNG({ width, height });
  const changedPixels = pixelmatch(padBase.data, padHead.data, diff.data, width, height, { threshold: 0.1 });
  const totalPixels = width * height;
  let diffPath = null;
  if (changedPixels > 0) {
    diffPath = join(storyDir, 'diff.png');
    await writeFile(diffPath, PNG.sync.write(diff));
  }
  return { story, changedPixels, totalPixels, sizeMismatch, basePath: join(storyDir, 'base.png'), headPath: join(storyDir, 'head.png'), diffPath };
}

async function captureStory(page, sbUrl, storyId) {
  const url = `${sbUrl}/iframe.html?viewMode=story&id=${encodeURIComponent(storyId)}`;
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await page.waitForSelector('#storybook-root', { timeout: 15000 });
  // Stability wait: poll for #storybook-root layout to stop changing
  await waitForStable(page);
  return await page.screenshot({ fullPage: false, animations: 'disabled' });
}

async function waitForStable(page, { quietMs = 500, maxMs = 5000 } = {}) {
  const start = Date.now();
  let lastSig = null;
  let lastChange = Date.now();
  while (Date.now() - start < maxMs) {
    const sig = await page.evaluate(() => {
      const root = document.querySelector('#storybook-root');
      if (!root) return '';
      const r = root.getBoundingClientRect();
      return `${r.width}x${r.height}:${root.children.length}:${root.innerHTML.length}`;
    });
    if (sig !== lastSig) { lastSig = sig; lastChange = Date.now(); }
    else if (Date.now() - lastChange >= quietMs) return;
    await page.waitForTimeout(50);
  }
}

function padToMatch(a, b) {
  if (a.width === b.width && a.height === b.height) return { a, b, width: a.width, height: a.height, sizeMismatch: false };
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  return { a: padPng(a, width, height), b: padPng(b, width, height), width, height, sizeMismatch: true };
}

function padPng(src, width, height) {
  if (src.width === width && src.height === height) return src;
  const out = new PNG({ width, height });
  // fill transparent white
  for (let i = 0; i < out.data.length; i += 4) {
    out.data[i] = 255; out.data[i+1] = 255; out.data[i+2] = 255; out.data[i+3] = 0;
  }
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const si = (src.width * y + x) * 4;
      const di = (width * y + x) * 4;
      out.data[di]   = src.data[si];
      out.data[di+1] = src.data[si+1];
      out.data[di+2] = src.data[si+2];
      out.data[di+3] = src.data[si+3];
    }
  }
  return out;
}

function sanitizeId(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, '_');
}

// ---- step 6: summary.md ----

async function writeSummary({ outDir, args, scoping, addedOnlyLocal, removedOnlyBase, results, baseUrl, localUrl, totalStories, gitInfo }) {
  await mkdir(outDir, { recursive: true });
  const lines = [];
  lines.push(`# Visual diff summary`);
  lines.push('');
  lines.push(`- Base: ${args.base}  (origin: ${baseUrl})`);
  lines.push(`- Local: ${relative(REPO_ROOT, args.localStorybook)}  (served from ${localUrl})`);
  lines.push(`- Viewport: ${args.viewportW}×${args.viewportH}`);
  lines.push(`- Branch: \`${gitInfo.branch}\` @ ${gitInfo.sha}${gitInfo.dirty ? ' (dirty)' : ''}`);
  lines.push(`- Base ref: \`${args.baseRef}\``);
  lines.push(`- Total intersected stories: ${totalStories}`);
  lines.push('');
  // Scoping section
  lines.push(`## Scope`);
  lines.push('');
  if (args.all) {
    lines.push(`Scoped to **all** intersected stories (\`--all\`).`);
  } else if (scoping.classifications.length === 0) {
    lines.push(`No changed files under \`${STORYBOOK_BASE_DIR}/src/\` (relative to \`${args.baseRef}\`).`);
  } else {
    lines.push(`Changed files (vs \`${args.baseRef}\` + working tree):`);
    lines.push('');
    for (const c of scoping.classifications) {
      const tag = c.kind === 'shared' ? `_shared_ — ${c.reason}` : `_${c.kind}_ — ${c.component}`;
      lines.push(`- \`${c.file}\` (${tag})`);
    }
    lines.push('');
    if (scoping.expanded) {
      lines.push(`Shared file changes detected → scope expanded to **all** stories. Pass \`--filter\` to narrow.`);
    } else {
      lines.push(`Resolved to ${scoping.scoped.length} affected stories.`);
    }
  }
  if (args.filter) lines.push(`\nFurther narrowed by \`--filter ${args.filter}\`.`);
  lines.push('');

  // Results
  const withDiff = results.filter((r) => r.changedPixels > 0).sort((a, b) => b.changedPixels - a.changedPixels);
  const errored = results.filter((r) => r.error);
  lines.push(`## Results`);
  lines.push('');
  lines.push(`- Diffed: ${results.length}`);
  lines.push(`- With diff: ${withDiff.length}`);
  lines.push(`- Errored: ${errored.length}`);
  lines.push(`- Added (only local): ${addedOnlyLocal.length}`);
  lines.push(`- Removed (only base): ${removedOnlyBase.length}`);
  lines.push('');

  if (withDiff.length) {
    lines.push(`## Stories with diffs`);
    lines.push('');
    for (const r of withDiff) {
      const pct = ((r.changedPixels / r.totalPixels) * 100).toFixed(2);
      lines.push(`### ${r.story.title} — ${r.story.name}`);
      lines.push('');
      lines.push(`- ID: \`${r.story.id}\``);
      lines.push(`- Changed pixels: **${r.changedPixels}** (${pct}% of ${r.totalPixels})${r.sizeMismatch ? ' — _viewport size mismatch, padded to match_' : ''}`);
      lines.push(`- base: \`${relative(REPO_ROOT, r.basePath)}\``);
      lines.push(`- head: \`${relative(REPO_ROOT, r.headPath)}\``);
      if (r.diffPath) lines.push(`- diff: \`${relative(REPO_ROOT, r.diffPath)}\``);
      lines.push('');
    }
  }

  if (errored.length) {
    lines.push(`## Stories with errors`);
    lines.push('');
    for (const r of errored) {
      lines.push(`- \`${r.story.id}\` — ${r.error}`);
    }
    lines.push('');
  }

  if (addedOnlyLocal.length) {
    lines.push(`## Added (only in local)`);
    lines.push('');
    for (const s of addedOnlyLocal) lines.push(`- \`${s.id}\` — ${s.title} / ${s.name}`);
    lines.push('');
  }
  if (removedOnlyBase.length) {
    lines.push(`## Removed (only in base)`);
    lines.push('');
    for (const s of removedOnlyBase) lines.push(`- \`${s.id}\` — ${s.title} / ${s.name}`);
    lines.push('');
  }

  const summaryPath = join(outDir, 'summary.md');
  await writeFile(summaryPath, lines.join('\n'));
  return summaryPath;
}

function getGitInfo() {
  const branch = gitOutput(['rev-parse', '--abbrev-ref', 'HEAD']).trim();
  const sha = gitOutput(['rev-parse', '--short', 'HEAD']).trim();
  const dirty = gitOutput(['status', '--porcelain']).trim().length > 0;
  return { branch, sha, dirty };
}

// ---- main ----

async function main() {
  const args = parseArgs(process.argv.slice(2));
  log.info(`Visual diff: local vs ${args.base}`);

  await buildStorybook(args);

  log.step('Starting local static server');
  const server = await serveLocal(args.localStorybook);

  try {
    log.step('Fetching index.json from both sides');
    const [baseStories, localStories] = await Promise.all([
      fetchIndex(args.base, 'Base'),
      fetchIndex(server.url, 'Local'),
    ]);

    const baseIds = new Set(baseStories.map((s) => s.id));
    const localIds = new Set(localStories.map((s) => s.id));
    const intersected = localStories.filter((s) => baseIds.has(s.id));
    const addedOnlyLocal = localStories.filter((s) => !baseIds.has(s.id));
    const removedOnlyBase = baseStories.filter((s) => !localIds.has(s.id));

    log.step('Scoping to affected stories');
    let scoped;
    let scoping;
    if (args.all) {
      scoping = { scoped: intersected, expanded: false, classifications: [] };
      scoped = intersected;
      log.ok(`--all set: diffing all ${scoped.length} intersected stories`);
    } else {
      const changedFiles = getChangedFiles(args.baseRef);
      scoping = scopeStories(intersected, changedFiles);
      if (scoping.classifications.length === 0) {
        log.ok('No changes vs base ref; nothing to diff. Pass --all to force.');
      } else {
        for (const c of scoping.classifications) {
          log.info(`    • ${c.file}  → ${c.kind}${c.component ? ' / ' + c.component : ''}${c.reason ? ' (' + c.reason + ')' : ''}`);
        }
        if (scoping.expanded) log.warn(`Shared changes detected — expanding scope to all ${intersected.length} stories.`);
      }
      scoped = scoping.scoped;
    }
    scoped = applyFilter(scoped, args.filter);
    log.ok(`Scoped story count: ${scoped.length}${args.filter ? ` (after --filter ${args.filter})` : ''}`);

    let results = [];
    if (scoped.length > 0) {
      log.step(`Screenshotting + diffing (${scoped.length} stories, concurrency=${args.concurrency})`);
      results = await screenshotAndDiff({
        baseUrl: args.base,
        localUrl: server.url,
        stories: scoped,
        viewport: { w: args.viewportW, h: args.viewportH },
        concurrency: args.concurrency,
        outDir: args.out,
      });
    }

    log.step('Writing summary');
    const gitInfo = getGitInfo();
    const summaryPath = await writeSummary({
      outDir: args.out,
      args,
      scoping,
      addedOnlyLocal,
      removedOnlyBase,
      results,
      baseUrl: args.base,
      localUrl: server.url,
      totalStories: intersected.length,
      gitInfo,
    });
    log.ok(`Summary written to ${relative(REPO_ROOT, summaryPath)}`);

    const withDiff = results.filter((r) => r.changedPixels > 0).length;
    log.info(`\nDone: ${withDiff} stories with diffs, ${results.filter((r) => r.error).length} errors.`);
  } finally {
    await server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
