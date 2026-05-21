#!/usr/bin/env node
/**
 * audit-storybook-drift.mjs
 *
 * Build two Storybook static builds — one from a base ref (default `main`) and
 * one from the current working tree — then diff `getComputedStyle()` for every
 * story that exists in both. Output a JSON report; exit non-zero if drift is
 * found.
 *
 * Purpose: machine-verify v1 → v2 (or any ref pair) visual fidelity for the
 * design-system migration, replacing manual Chromatic baseline reviews.
 *
 * Usage:
 *   node scripts/audit-storybook-drift.mjs                       # base = main
 *   node scripts/audit-storybook-drift.mjs --base <ref>
 *   node scripts/audit-storybook-drift.mjs --story Badge         # filter by substring
 *   node scripts/audit-storybook-drift.mjs --reuse-baseline      # skip rebuild
 *   node scripts/audit-storybook-drift.mjs --ignore color,font-family
 *
 * Outputs `audit-report.json` next to the script; prints a per-component
 * summary to stdout.
 */

import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CAMP_DIR = resolve(__dirname, '..')
const REPO_ROOT = resolve(CAMP_DIR, '../..')
const BASELINE_WORKTREE = '/tmp/camp-baseline'
const BASELINE_STATIC = join(
  BASELINE_WORKTREE,
  'packages/camp/storybook-static',
)
const HEAD_STATIC = join(CAMP_DIR, 'storybook-static')
const BASELINE_PORT = 6007
const HEAD_PORT = 6008

// CSS properties we capture per element. Curated for "visual identity drift"
// — adding more is harmless but noisier. Browsers expose ~300 properties per
// element; this short list focuses on what design-system recipes actually
// control.
const TRACKED_PROPERTIES = [
  'color',
  'background-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'text-decoration-line',
  'text-decoration-color',
  'text-decoration-style',
  'text-decoration-thickness',
  'text-transform',
  'text-align',
  'opacity',
  'cursor',
  'display',
  'align-items',
  'justify-content',
  'gap',
  'column-gap',
  'row-gap',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'width',
  'height',
  'box-shadow',
  'outline-color',
  'outline-style',
  'outline-width',
  'outline-offset',
  'pointer-events',
]

function parseArgs(argv) {
  const args = {
    base: 'main',
    story: null,
    reuseBaseline: false,
    ignore: new Set(),
    report: join(__dirname, 'audit-report.json'),
    verbose: false,
  }
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--base') args.base = argv[++i]
    else if (arg === '--story') args.story = argv[++i]
    else if (arg === '--reuse-baseline') args.reuseBaseline = true
    else if (arg === '--ignore') {
      for (const p of argv[++i].split(',')) args.ignore.add(p.trim())
    } else if (arg === '--report') args.report = resolve(argv[++i])
    else if (arg === '--verbose') args.verbose = true
    else if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node scripts/audit-storybook-drift.mjs [options]\n' +
          '  --base <ref>             Base ref (default: main)\n' +
          '  --story <substring>      Filter stories by ID substring\n' +
          '  --reuse-baseline         Skip baseline rebuild if /tmp dir exists\n' +
          '  --ignore <p1,p2,...>     CSS property names to ignore\n' +
          '  --report <path>          Output JSON path\n' +
          '  --verbose                Print every drift, not just summary',
      )
      process.exit(0)
    } else {
      console.error(`Unknown argument: ${arg}`)
      process.exit(2)
    }
  }
  return args
}

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    stdio: options.silent ? 'pipe' : 'inherit',
    cwd: options.cwd ?? process.cwd(),
    env: { ...process.env, ...options.env },
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    if (options.silent && result.stderr) console.error(result.stderr)
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`)
  }
  return result
}

function setupBaseline({ base, reuseBaseline }) {
  if (reuseBaseline && existsSync(BASELINE_STATIC)) {
    console.log(`[baseline] reusing existing build at ${BASELINE_STATIC}`)
    return
  }
  console.log(
    `[baseline] setting up worktree at ${BASELINE_WORKTREE} (ref: ${base})`,
  )

  // Remove stale worktree if present
  if (existsSync(BASELINE_WORKTREE)) {
    try {
      run('git', ['worktree', 'remove', '--force', BASELINE_WORKTREE], {
        cwd: REPO_ROOT,
        silent: true,
      })
    } catch {
      // Worktree may not be registered; try a plain rm.
      run('rm', ['-rf', BASELINE_WORKTREE], { silent: true })
    }
  }
  run('git', ['worktree', 'add', '--detach', BASELINE_WORKTREE, base], {
    cwd: REPO_ROOT,
  })

  console.log(
    '[baseline] installing dependencies (this can take a few minutes)',
  )
  run('npm', ['install', '--no-audit', '--no-fund'], { cwd: BASELINE_WORKTREE })

  console.log('[baseline] building storybook')
  run('npm', ['run', 'build-storybook'], {
    cwd: join(BASELINE_WORKTREE, 'packages/camp'),
  })
}

function buildHead() {
  console.log('[head] building storybook')
  run('npm', ['run', 'build-storybook'], { cwd: CAMP_DIR })
}

function startStaticServer(staticDir, port) {
  console.log(`[server] serving ${staticDir} on port ${port}`)
  const proc = spawn(
    'npx',
    ['--yes', 'http-server', staticDir, '-p', String(port), '-s'],
    {
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )
  return proc
}

async function waitForServer(port, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/index.html`)
      if (res.ok) return
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error(`Server on port ${port} did not start within ${timeoutMs}ms`)
}

function readIndex(staticDir) {
  const indexPath = join(staticDir, 'index.json')
  if (!existsSync(indexPath)) {
    throw new Error(`Storybook index not found at ${indexPath}`)
  }
  const data = JSON.parse(readFileSync(indexPath, 'utf8'))
  // Storybook 7+: entries keyed by story id, with `type: 'story'`
  const stories = Object.entries(data.entries ?? {})
    .filter(([, entry]) => entry.type === 'story')
    .map(([id, entry]) => ({ id, title: entry.title, name: entry.name }))
  return stories
}

async function captureStory(page, port, storyId) {
  const url = `http://127.0.0.1:${port}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  // Wait for the story root to render content.
  await page
    .waitForFunction(
      () => {
        const root = document.querySelector('#storybook-root')
        return root && root.children.length > 0
      },
      { timeout: 10000 },
    )
    .catch(() => null)
  // Short settle for fonts + transitions.
  await page.waitForTimeout(150)
  return await page.evaluate((props) => {
    const root = document.querySelector('#storybook-root')
    if (!root || root.children.length === 0) return null
    const capture = (el, selector) => {
      const cs = getComputedStyle(el)
      const out = { selector, tag: el.tagName.toLowerCase() }
      for (const p of props) out[p] = cs.getPropertyValue(p).trim()
      return out
    }
    // Capture #storybook-root's direct children (the story's top-level
    // elements). Limits to first 8 children to keep payload bounded.
    const elements = []
    let idx = 0
    for (const child of Array.from(root.children).slice(0, 8)) {
      elements.push(capture(child, `#storybook-root > *:nth-child(${idx + 1})`))
      idx++
    }
    return elements
  }, TRACKED_PROPERTIES)
}

function diffElements(baselineEls, headEls, ignore) {
  if (!baselineEls && !headEls) return { drifts: [], status: 'both-empty' }
  if (!baselineEls) return { drifts: [], status: 'baseline-empty' }
  if (!headEls) return { drifts: [], status: 'head-empty' }
  const drifts = []
  const max = Math.max(baselineEls.length, headEls.length)
  for (let i = 0; i < max; i++) {
    const b = baselineEls[i]
    const h = headEls[i]
    if (!b) {
      drifts.push({ selector: h.selector, kind: 'added-element', tag: h.tag })
      continue
    }
    if (!h) {
      drifts.push({ selector: b.selector, kind: 'removed-element', tag: b.tag })
      continue
    }
    if (b.tag !== h.tag) {
      drifts.push({
        selector: b.selector,
        kind: 'tag-changed',
        baseline: b.tag,
        head: h.tag,
      })
    }
    for (const prop of TRACKED_PROPERTIES) {
      if (ignore.has(prop)) continue
      if (b[prop] !== h[prop]) {
        drifts.push({
          selector: b.selector,
          kind: 'property-changed',
          property: prop,
          baseline: b[prop],
          head: h[prop],
        })
      }
    }
  }
  return { drifts, status: drifts.length === 0 ? 'match' : 'drift' }
}

function summarize(results) {
  const byComponent = new Map()
  for (const r of results) {
    const componentTitle = r.title?.split('/').pop() ?? r.id
    const bucket = byComponent.get(componentTitle) ?? {
      stories: 0,
      matching: 0,
      drifting: 0,
      orphaned: 0,
    }
    bucket.stories += 1
    if (r.diff.status === 'match') bucket.matching += 1
    else if (r.diff.status === 'drift') bucket.drifting += 1
    else bucket.orphaned += 1
    byComponent.set(componentTitle, bucket)
  }
  return [...byComponent.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([component, stats]) => ({ component, ...stats }))
}

async function main() {
  const args = parseArgs(process.argv)

  setupBaseline(args)
  buildHead()

  const baselineServer = startStaticServer(BASELINE_STATIC, BASELINE_PORT)
  const headServer = startStaticServer(HEAD_STATIC, HEAD_PORT)
  const cleanup = () => {
    try {
      baselineServer.kill('SIGTERM')
    } catch {
      // ignore
    }
    try {
      headServer.kill('SIGTERM')
    } catch {
      // ignore
    }
  }
  process.on('exit', cleanup)
  process.on('SIGINT', () => {
    cleanup()
    process.exit(130)
  })

  await waitForServer(BASELINE_PORT)
  await waitForServer(HEAD_PORT)

  const baselineStories = readIndex(BASELINE_STATIC)
  const headStories = readIndex(HEAD_STATIC)
  const baselineIds = new Set(baselineStories.map((s) => s.id))
  const headIds = new Set(headStories.map((s) => s.id))

  const sharedStories = headStories.filter((s) => {
    if (!baselineIds.has(s.id)) return false
    if (args.story && !s.id.includes(args.story.toLowerCase())) return false
    return true
  })
  const onlyInBaseline = [...baselineIds]
    .filter((id) => !headIds.has(id))
    .filter((id) => !args.story || id.includes(args.story.toLowerCase()))
  const onlyInHead = [...headIds]
    .filter((id) => !baselineIds.has(id))
    .filter((id) => !args.story || id.includes(args.story.toLowerCase()))

  console.log(
    `[diff] ${sharedStories.length} shared stories, ${onlyInBaseline.length} only in baseline, ${onlyInHead.length} only in head`,
  )

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  })
  const baselinePage = await context.newPage()
  const headPage = await context.newPage()

  const results = []
  let processed = 0
  for (const story of sharedStories) {
    processed += 1
    const baselineEls = await captureStory(
      baselinePage,
      BASELINE_PORT,
      story.id,
    )
    const headEls = await captureStory(headPage, HEAD_PORT, story.id)
    const diff = diffElements(baselineEls, headEls, args.ignore)
    results.push({ ...story, diff })
    const tag =
      diff.status === 'match' ? '✓' : diff.status === 'drift' ? '✗' : '∅'
    process.stdout.write(
      `\r[diff] ${processed}/${sharedStories.length} ${tag} ${story.id.padEnd(60).slice(0, 60)}`,
    )
  }
  process.stdout.write('\n')

  await browser.close()
  cleanup()

  const summary = summarize(results)
  const drifting = results.filter((r) => r.diff.status === 'drift')

  const report = {
    base: args.base,
    timestamp: new Date().toISOString(),
    summary,
    onlyInBaseline,
    onlyInHead,
    stories: results,
  }
  mkdirSync(dirname(args.report), { recursive: true })
  writeFileSync(args.report, JSON.stringify(report, null, 2))

  console.log('\n=== Drift summary by component ===')
  for (const row of summary) {
    const flag = row.drifting > 0 ? '✗' : '✓'
    console.log(
      `  ${flag} ${row.component.padEnd(20)} ${row.matching}/${row.stories} match, ${row.drifting} drift, ${row.orphaned} orphaned`,
    )
  }
  if (onlyInBaseline.length) {
    console.log(
      `\nStories on baseline but missing on head (${onlyInBaseline.length}):`,
    )
    for (const id of onlyInBaseline) console.log(`  - ${id}`)
  }
  if (onlyInHead.length) {
    console.log(
      `\nStories on head but missing on baseline (${onlyInHead.length}):`,
    )
    for (const id of onlyInHead) console.log(`  - ${id}`)
  }

  if (args.verbose && drifting.length) {
    console.log('\n=== Drift details ===')
    for (const r of drifting) {
      console.log(`\n${r.id}:`)
      for (const d of r.diff.drifts) {
        if (d.kind === 'property-changed') {
          console.log(
            `  ${d.selector} ${d.property}: ${d.baseline} → ${d.head}`,
          )
        } else {
          console.log(
            `  ${d.selector} ${d.kind} ${d.baseline ?? ''} → ${d.head ?? ''}`,
          )
        }
      }
    }
  }

  console.log(`\nReport written to ${args.report}`)
  if (drifting.length) {
    console.log(`\n✗ ${drifting.length} stories have drift. Exit 1.`)
    process.exit(1)
  } else {
    console.log('\n✓ No drift detected.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
