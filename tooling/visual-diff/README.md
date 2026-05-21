# visual-diff

Compares the local `packages/camp` Storybook against the production-hosted Storybook
at `https://design.open.gov.sg` and produces per-story pixel diffs.

Built for reviewing the Chakra v2 → v3 migration PR-by-PR without depending on
Chromatic's web UI (whose baseline drifts as `main` updates).

## Setup

From the repo root:

```sh
cd tooling/visual-diff
npm install
npx playwright install chromium
```

## Usage

From the repo root:

```sh
node tooling/visual-diff/run.mjs
```

By default this:

1. Runs `npm run build-storybook` in `packages/camp` (skip with `--skip-build`).
2. Serves the resulting `storybook-static` on an ephemeral local port.
3. Determines which stories your branch touched, by diffing against `origin/main`
   (override with `--base-ref`, or pass `--all` to compare every story).
4. Screenshots each affected story in both the local and production Storybooks,
   pixel-diffs them, and writes results under `.context/visual-diff/`.

Read `.context/visual-diff/summary.md` afterwards — it lists changed stories
sorted by diff magnitude, with paths to `base.png`, `head.png`, and `diff.png`
for each.

### Flags

| Flag | Default | Purpose |
|---|---|---|
| `--base <url>` | `https://design.open.gov.sg` | Production Storybook URL |
| `--local-storybook <dir>` | `packages/camp/storybook-static` | Local Storybook build dir |
| `--skip-build` | off | Reuse the existing local build instead of rebuilding |
| `--out <dir>` | `.context/visual-diff/` | Where to write outputs |
| `--viewport <WxH>` | `1280x720` | Screenshot viewport |
| `--base-ref <ref>` | `origin/main` | Git ref to diff against for affected-story scoping |
| `--all` | off | Skip affected-story scoping; diff every story |
| `--filter <glob>` | none | Additional narrowing on top of scoping (e.g., `*avatar*`) |
| `--concurrency <n>` | `4` | Parallel pages per browser |

### Scoping behaviour

The script identifies affected stories by:

1. Running `git diff --name-only <base-ref>...HEAD` and `git status --porcelain`
   limited to `packages/camp/src/`.
2. For each changed file:
   - **Story file** (`*.stories.@(ts|tsx|mdx)`) → that file's stories.
   - **Component source** → all stories in the same component directory.
   - **Shared file** (under `src/theme/`, `src/utils/`, `src/hooks/`, or
     anything not pinnable to a single component) → expands scope to all
     stories, with a clear log message.

Pass `--all` to bypass scoping. Pass `--filter` to narrow further.

## Troubleshooting

- **`design.open.gov.sg` unreachable** — script exits with the network error.
  Either fix your connection or point `--base` at a different known-good
  Storybook URL.
- **Storybook major-version mismatch** — if `index.json` shape diverges between
  base and local, script exits with a diagnostic. Resolve by aligning Storybook
  versions or by capturing a baseline build of the older Storybook locally.
- **Antialiasing noise** — the script uses `pixelmatch` `threshold: 0.1` which
  ignores subpixel rendering differences. Lower the threshold in `run.mjs`
  if you want stricter comparisons.

## Lifecycle

This tool is scoped to the Chakra v2 → v3 migration. Once the migration
completes, this directory can be removed.
