# Chakra UI v2 → v3 Defaults Drift Audit

> Reference material for authors of follow-up component-migration specs in
> `@opengovsg/design-system-react`. Not a tutorial. Use this alongside
> `packages/camp/docs/migrating-from-v1-to-v2.md` and the v3 source under
> `node_modules/@chakra-ui/react/dist/esm/theme/`.

## 1. Overview

This document catalogues the differences between Chakra UI v2's defaults
(implicit in our v1 `@opengovsg/design-system-react` source) and Chakra UI v3's
defaults (now in effect via `createSystem(defaultConfig, ourConfig)`). It is
written for authors of the ~40 follow-up component-migration specs that have to
re-author each v1 Chakra theme override against v3's new default recipe library.

The audit was triggered by **three foundation-PR regressions**, each rooted in
silent drift between v2 and v3 defaults:

1. **`radii.base` no longer exists in v3.** v2 had `none/sm/base/md/lg/xl/2xl/3xl/full`;
   v3 renamed/shifted these (see [Section 3 — radii](#radii)).
2. **v3's default Button recipe sets `borderColor: 'transparent'`** in the base.
   When our `clear` variant used the `border: '1px solid'` shorthand, the
   browser CSS shorthand resets `border-color` to `currentColor`, overriding
   v3's `transparent`. We fixed this by switching to `borderWidth` + `borderStyle`
   longhands so v3's `borderColor: 'transparent'` is preserved.
3. **v3's default `globalCss` applies `fontFeatureSettings: '"cv11"'` via the
   `*` selector.** Our v2 wrapper applied it to `body { ... }` and relied on
   inheritance; v3's universal selector breaks that inheritance. We now also
   apply via `*`.

Read this before you author the next component spec. Every default recipe in
v3 is merged on top of our overrides — your recipe is not a clean slate.

---

## 2. How config merging works

Our system is constructed with:

```ts
// packages/camp/src/theme/system.ts
import { createSystem, defaultConfig } from '@chakra-ui/react'
import { config } from './config'

export const system = createSystem(defaultConfig, config)
```

`createSystem` deep-merges `defaultConfig` and `config` in order. The relevant
merge semantics:

| Layer             | Behaviour                                                                                                                                                                                                                                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens.<cat>`    | Per-category replacement is the default; the key-by-key merge has known edge cases. **TODO verify.** Empirically, when you set `theme.tokens.durations` with one entry, v3's `defaultConfig` durations stay present unless our values shadow them. See [Open verification questions](#9-open-verification-questions). |
| `semanticTokens`  | Deep-merge by key path. Our keys win; sibling keys from `defaultConfig` remain.                                                                                                                                                                                                                                       |
| `recipes.<x>`     | When `recipes.button` is set in our config, **Chakra merges it property-by-property in `base`, and variant-by-variant in `variants`**. Our recipe does NOT replace v3's default button recipe; it composes on top. This is the source of most regressions.                                                            |
| `slotRecipes.<x>` | Same: deep-merge by slot/variant.                                                                                                                                                                                                                                                                                     |
| `layerStyles`     | Deep-merge by key. v3 defaults (`fill.solid`, `outline.solid`, `disabled`, ...) remain available.                                                                                                                                                                                                                     |
| `textStyles`      | Deep-merge by key. v3 ships only one default — `xs/sm/md/lg/xl/...` derived from `fontSizes` — but our `textStyles.subhead-1`, `body-1`, etc. supplement them.                                                                                                                                                        |
| `globalCss`       | Merge-by-selector at the top level. If our config has a selector v3 also has (e.g. `*`), the rules are merged property-by-property — our values win on a conflict.                                                                                                                                                    |
| `breakpoints`     | Replaced wholesale by our object. (We override; defaults dropped.)                                                                                                                                                                                                                                                    |

### The recipe merge trap

Concretely, this is what happened with Button. Our `buttonRecipe.base` did not
mention `borderColor`. v3's default `buttonRecipe.base` does:

```js
// node_modules/@chakra-ui/react/dist/esm/theme/recipes/button.js
base: {
  // ...
  borderWidth: "1px",
  borderColor: "transparent",
  // ...
}
```

After merge, the effective base for our Button included **both** our properties
**and** v3's `borderColor: 'transparent'`. The `clear` variant then used
`border: '1px solid'` (shorthand without color), which the CSS engine
re-expanded into `border-color: currentColor`, blowing away the inherited
transparent.

**Rule of thumb:** before writing any recipe, read v3's default recipe for that
component and treat its `base` as the implicit superclass of your `base`.

---

## 3. Token category drift

There are 18 token categories. For each we list:

- **v3 default** location and contents
- **Our override** location and contents
- **Drift** notes for spec authors

Quick reference: our overrides live in `packages/camp/src/theme/tokens/*.ts`
(barrel: `index.ts`). v3 defaults live in
`node_modules/@chakra-ui/react/dist/esm/theme/tokens/*.js`.

### colors

- **v3 default:** `node_modules/@chakra-ui/react/dist/esm/theme/tokens/colors.js`.
  Ships the special tokens `transparent`, `current`, `black` (`#09090B`),
  `white` (`#FFFFFF`); the alpha ramps `whiteAlpha.50–950` and `blackAlpha.50–950`
  (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950); and the 11 named
  scales each with 11 stops (50–950): `gray`, `red`, `orange`, `yellow`,
  `green`, `teal`, `blue`, `cyan`, `purple`, `pink`.
- **Our override:** `packages/camp/src/theme/tokens/colors.ts`. Adds many
  domain-specific groups: `slate`, `grey` (NB different spelling from v3 `gray`),
  `standard.{white,black}`, `brand.{primary,secondary}`, `skin.{1base..6shadow}`,
  `base.{canvas,content,divider}.<key>`, `interaction.{main,sub,critical,warning,success,neutral,main-subtle,sub-subtle,critical-subtle,warning-subtle,success-subtle,neutral-subtle,muted,tinted,support,links}.<key>`,
  `utility.{feedback,focus-default,focus-inverse,input-prefilled,ui,ui-clear}`.
  Re-defines the four named scales `blue`, `red`, `green`, `yellow` with brand
  values that **shadow** v3's defaults at those names (v3 still has `orange`,
  `teal`, `purple`, `pink`, `cyan`, `gray`).

**Drift highlights:**

| Concern                        | Detail                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shadowed scales                | `blue`, `red`, `green`, `yellow` shadow v3 defaults. Any v3 default recipe that references `colorPalette.<n>` with one of these as `colorPalette` will pick up our hexes — usually desirable. Stops 50–900 are present in our override but **stop 950 is missing**, so `red.950` resolves to v3's value (`#1f0808`), not a brand colour. |
| `gray` vs `grey`               | v3 ships `gray`. We ship `grey`. v3 default recipes reference `colorPalette: 'gray'` (the global fallback — see `globalCss.html.colorPalette: 'gray'`), so `gray` is in effect for unspecified consumers, with v3's hex values.                                                                                                          |
| Missing palettes from our side | We do not ship `teal`, `orange`, `purple`, `pink`, `cyan`, or any `*Alpha`. v3 defaults are in effect.                                                                                                                                                                                                                                   |
| Brand palette names            | `main`, `sub`, `critical`, `warning`, `success`, `neutral`, `inverse` exist **only as semantic-token slots** (see [Section 4](#4-semantic-tokens-drift)). They are NOT registered as raw color scales, so `colors.main.500` etc. do not resolve.                                                                                         |

### radii

This was [regression #1](#1-overview). We do not override radii at all, so
**v3 defaults are fully in effect**.

- **v3 default:** `node_modules/@chakra-ui/react/dist/esm/theme/tokens/radius.js`.

| v3 key | v3 value         | v2 closest equivalent |
| ------ | ---------------- | --------------------- |
| `none` | `0`              | `none`                |
| `2xs`  | `0.0625rem`      | (new)                 |
| `xs`   | `0.125rem` (2px) | `sm`                  |
| `sm`   | `0.25rem` (4px)  | `base` ← **removed**  |
| `md`   | `0.375rem` (6px) | `md`                  |
| `lg`   | `0.5rem` (8px)   | `lg`                  |
| `xl`   | `0.75rem` (12px) | `xl`                  |
| `2xl`  | `1rem`           | `2xl`                 |
| `3xl`  | `1.5rem`         | `3xl`                 |
| `4xl`  | `2rem`           | (new)                 |
| `full` | `9999px`         | `full`                |

**v2 → v3 conversion table** (what every spec author must internalise):

| v2 you used                  | v3 you write                       |
| ---------------------------- | ---------------------------------- |
| `borderRadius: 'base'` (4px) | `borderRadius: 'sm'`               |
| `borderRadius: 'sm'` (2px)   | `borderRadius: 'xs'`               |
| `borderRadius: 'md'` (6px)   | `borderRadius: 'md'` (no change)   |
| `borderRadius: 'lg'` (8px)   | `borderRadius: 'lg'` (no change)   |
| `borderRadius: 'xl'` (12px)  | `borderRadius: 'xl'` (no change)   |
| `borderRadius: 'full'`       | `borderRadius: 'full'` (no change) |

v3 also adds **semantic** radii: `l1 → {radii.xs}`, `l2 → {radii.sm}`,
`l3 → {radii.md}`. Most v3 default recipes reference these (`borderRadius: 'l2'`,
etc.) — see `node_modules/@chakra-ui/react/dist/esm/theme/semantic-tokens/radii.js`.

### spacing

- **v3 default:** `node_modules/@chakra-ui/react/dist/esm/theme/tokens/spacing.js`.
  Keys `0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16,
20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96` (4-based rem ramp).
- **Our override:** `packages/camp/src/theme/tokens/spacing.ts`. Keys
  `1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14` with rem values matching v3
  for `1..12` but diverging at `13` (`3.5rem`, v3 has no `13`) and `14`
  (`4rem`, v3 `14` is `3.5rem`).

**Drift highlights:**

- v3 default recipes commonly reference fractional keys like `2.5`, `1.5`, `3.5`,
  `4.5` (e.g. `gap: '1.5'`, `px: '2.5'`). These **are present** in v3's table
  but absent from our override — empirically they merge in (per-key deep merge).
  **TODO verify** that adding our spacing token set does not strip the
  fractional keys from v3's default; if it does, recipes using `2.5` will fail
  to resolve.
- Our `14` differs in value from v3's `14`. If a v3 default recipe uses `14`
  (e.g. for an oversized component), the value will be 4rem (ours) rather than
  3.5rem (v3's). Cross-check before re-authoring.
- Common large keys missing from our override: `16, 20, 24, ..., 96`. If a v3
  default recipe references these and the merge is a wholesale replacement,
  they will not resolve. **TODO verify** at build time by inspecting emitted
  CSS variables.

### sizes

- **v3 default:** `node_modules/@chakra-ui/react/dist/esm/theme/tokens/sizes.js`.
  Composes large named sizes (`3xs..8xl` → 14rem..90rem), all spacing keys,
  named (`max, min, fit, prose, full, dvh, svh, lvh, dvw, svw, lvw, vw, vh`),
  and fractional (`1/2, 1/3, ..., 11/12`).
- **Our override:** `packages/camp/src/theme/tokens/sizes.ts`. Just numeric keys
  `1..14`, same values as our spacing.

**Drift highlights:**

- Named (`max`, `min`, `fit`, `full`, viewport units) and fractional sizes,
  along with `xs, sm, ..., 8xl` and large numeric keys — all in v3 defaults,
  unknown if merged through. **TODO verify**.
- v3 default recipes use `sizes.xs`, `sizes.sm`, `sizes.lg`, `sizes.16`, etc. —
  e.g. `Popover: '--popover-size: sizes.xs'`, `Button h: '11'`.
- v3 default recipes also reference numeric size keys via the `h`/`w`
  shorthand (e.g. `Button h: '11'` resolves to `sizes.11` = our `2.75rem`).

### shadows

- **v3 default:** raw `none` is not in v3's `tokens/shadows.js` (that file is
  absent because v3 ships shadows only as **semantic** tokens — see
  [Section 4](#4-semantic-tokens-drift)).
- **Our override:** `packages/camp/src/theme/tokens/shadows.ts`. Just two keys:
  `sm: '0px 0px 10px 0px rgba(191, 191, 191, 0.5)'` and `md: '0px 0px 20px 0px
rgba(104, 104, 104, 0.3)'`.

**Drift highlights:**

- v3 ships semantic shadow tokens (see Section 4): `xs, sm, md, lg, xl, 2xl,
inner, inset`, each with `_light` and `_dark` values. Our override defines
  raw `shadows.sm` and `shadows.md`. **Open question:** when a v3 recipe
  references `shadow: 'md'`, does it resolve to our raw `shadows.md` (since
  the raw token is defined and presumably ranks higher than the semantic
  alias) or to v3's semantic `shadows.md`? **TODO verify** — likely our raw
  value wins.
- Components in follow-up specs that historically used Chakra v2's
  `shadows.lg`, `shadows.xl`, `shadows.dark-lg`, etc. will get v3's semantic
  values (since we only override `sm` and `md`).

### fontSizes

- **v3 default:** `node_modules/@chakra-ui/react/dist/esm/theme/tokens/font-sizes.js`.
  Keys `2xs..9xl`.
- **Our override:** `packages/camp/src/theme/tokens/fontSizes.ts`. Keys
  `2xs..11xl` (we extend past v3's range).

| Key    | v3       | Ours        |
| ------ | -------- | ----------- |
| `2xs`  | 0.625rem | 0.625rem    |
| `xs`   | 0.75rem  | 0.75rem     |
| `sm`   | 0.875rem | 0.875rem    |
| `md`   | 1rem     | 1rem        |
| `lg`   | 1.125rem | 1.125rem    |
| `xl`   | 1.25rem  | 1.25rem     |
| `2xl`  | 1.5rem   | 1.5rem      |
| `3xl`  | 1.875rem | **1.75rem** |
| `4xl`  | 2.25rem  | **2rem**    |
| `5xl`  | 3rem     | **2.25rem** |
| `6xl`  | 3.75rem  | **2.5rem**  |
| `7xl`  | 4.5rem   | **2.75rem** |
| `8xl`  | 6rem     | **3rem**    |
| `9xl`  | 8rem     | **3.5rem**  |
| `10xl` | —        | 4rem        |
| `11xl` | —        | 4.5rem      |

**Drift highlight:** v3's default `Heading` recipe maps `size="2xl"` →
`textStyle: '2xl'` (which resolves to `fontSize: '2xl'`). v3 default
`textStyle` definitions are tied to v3's font-size scale — see
`node_modules/@chakra-ui/react/dist/esm/theme/text-styles.js`. **Spec authors
who re-use v3 `Heading`** will see our reduced 3xl–9xl values, not v3's.

### fontWeights

- **v3 default:** `thin, extralight, light, normal, medium, semibold, bold,
extrabold, black`.
- **Our override:** `light, normal, medium, semibold, bold` (we omit `thin`,
  `extralight`, `extrabold`, `black`).

**Drift:** v3 default recipes only reference `medium` and `semibold`, so no
known regressions, but be aware that `fontWeight: 'thin'`/`'black'` may resolve
to v3's defaults (if merge is per-key) or fail (if our object replaces). **TODO
verify.**

### lineHeights

- **v3 default:** named `shorter (1.25), short (1.375), moderate (1.5), tall
(1.625), taller (2)`. **Only five keys, all unitless.**
- **Our override:** numeric `'3'..'18'` (mapped to `0.75rem..4.5rem`). **No
  named keys at all.**

**Drift highlights:**

- v3's default `globalCss.html` sets `lineHeight: '1.5'` (a literal, not a
  token), so the body default works.
- v3's default `buttonRecipe.base` sets `lineHeight: '1.2'` (a literal).
- Any v3 default recipe that references named keys (`moderate`, `tall`,
  `taller`) will fail to resolve in our system if the override replaces
  v3's lineHeights wholesale. **TODO verify.** If replacement, named tokens
  resolve to undefined → may emit `var(--chakra-line-heights-moderate)` which
  is undefined CSS-side.
- Our textStyles set `lineHeight` to literal `rem` strings, sidestepping the
  token reference entirely. So our re-authored components are safe.

### letterSpacings

- **v3 default:** `tighter (-0.05em), tight (-0.025em), wide (0.025em), wider
(0.05em), widest (0.1em)`.
- **Our override:** `'1' (-0.006em), '2' (-0.014em), '3' (-0.019em), '4'
(-0.022em), wide (0.080em), normal (0)`.

**Drift highlights:**

- v3's default `Menu.itemCommand` references `letterSpacing: 'widest'`.
- Our `wide` differs from v3's `wide` in value (`0.080em` vs `0.025em`).
- `tighter`, `tight`, `wider`, `widest`, `normal` may resolve to v3 defaults if
  merge is per-key. **TODO verify.**

### fonts

- **v3 default:** `heading: 'Inter, …'`, `body: 'Inter, …'`,
  `mono: 'SFMono-Regular, …'`.
- **Our override:** `heading: 'Inter, Trebuchet MS, …'`, `body` same,
  `code: 'IBM Plex Mono, Courier, …'`.

**Drift highlight:** our token is named `code`, not `mono`. v3 default recipes
reference `fontFamily: 'mono'` (e.g. `Code`, `Kbd`, `Menu.itemCommand`). **Open
question** — does our override define `code` as an alias or supplement to
`mono`, or does it replace the fonts table such that `mono` becomes undefined?
**TODO verify** by inspecting emitted `--chakra-fonts-mono`.

If `mono` is replaced/undefined, recipes referencing `fontFamily: 'mono'` will
render in a fallback font. Spec authors of `Code`, `Kbd`, etc. should either
rename our token to `mono`, or override `fontFamily: 'code'` per recipe.

### durations

- **v3 default:** `fastest (50ms), faster (100ms), fast (150ms), moderate
(200ms), slow (300ms), slower (400ms), slowest (500ms)`.
- **Our override:** `'ultra-fast' (50ms), faster (100ms), fast (150ms), normal
(200ms), slow (300ms), slower (400ms), 'ultra-slow' (500ms)`.

Different key names for the extremes (`ultra-fast` vs `fastest`, `normal` vs
`moderate`, `ultra-slow` vs `slowest`), same values; middle four keys (`faster,
fast, slow, slower`) match exactly.

**Drift:** v3's default `buttonRecipe.base` sets `transitionDuration:
'moderate'`. v3's default `dialogRecipe.content` sets `_open: {
animationDuration: 'moderate' }`. **Open question** — does our override
replace v3's defaults entirely, breaking `moderate`/`fastest`/`slowest`
references? **TODO verify.** If replaced, all v3 default recipes that
reference `moderate`/`slowest` will fail to animate. The pragmatic fix is to
add `moderate, fastest, slowest` aliases to our durations.

### easings

- **v3 default:** `'ease-in' (cubic-bezier(0.42, 0, 1, 1))`, `'ease-out'
(cubic-bezier(0, 0, 0.58, 1))`, `'ease-in-out' (cubic-bezier(0.42, 0, 0.58,
1))`, `'ease-in-smooth' (cubic-bezier(0.32, 0.72, 0, 1))`.
- **Our override:** `'ease-in' (0.4, 0, 1, 1)`, `'ease-out' (0, 0, 0.2, 1)`,
  `'ease-in-out' (0.4, 0, 0.2, 1)`. **No `ease-in-smooth`.**

**Drift:** Our cubic-bezier curves are slightly different at the second/third
control points. v3's default `Drawer` recipe uses `animationTimingFunction:
'ease-in-smooth'` for `_open` and `_closed`. **Open question** — if our
override replaces, `ease-in-smooth` is undefined and the Drawer's open/close
animation falls back to browser default. **TODO verify.**

### borders

- **v3 default:** `xs (0.5px solid)`, `sm (1px solid)`, `md (2px solid)`, `lg
(4px solid)`, `xl (8px solid)`.
- **Our override:** _none_. v3 defaults in effect.

**Drift:** None on our side. But [regression #2](#1-overview) showed that the
`border: '1px solid'` shorthand **does NOT use this token table** — it's the
plain CSS shorthand, and it splits into longhands including
`border-color: currentColor`. **Use `borderWidth` + `borderStyle` longhands
instead**, or write `border: '1px solid transparent'` to keep the colour
explicit.

### animations

- **v3 default:** `spin (1s linear infinite)`, `ping`, `pulse`, `bounce`.
- **Our override:** _none_.

**Drift:** None. v3 default Spinner uses `animation: 'spin'` —
`packages/camp/src/Spinner` already adapted in the foundation PR.

### aspect-ratios

- **v3 default:** `square (1/1), landscape (4/3), portrait (3/4), wide (16/9),
ultrawide (18/5), golden (1.618/1)`.
- **Our override:** _none_. New surface area exposed to consumers.

### blurs

- **v3 default:** `none, sm (4px), md (8px), lg, xl, 2xl, 3xl, 4xl`.
- **Our override:** _none_.

### cursor

- **v3 default:** `button (pointer), checkbox (default), disabled (not-allowed),
menuitem (default), option (default), radio (default), slider (default),
switch (pointer)`.
- **Our override:** _none_.

**Drift:** v3 default recipes reference `cursor: 'button'` (Button base),
`cursor: 'switch'` (Switch control), `cursor: 'menuitem'` (Menu item), `cursor:
'disabled'` (radio disabled). All inherited from defaults.

### keyframes

- **v3 default:** see `node_modules/@chakra-ui/react/dist/esm/theme/tokens/keyframes.js`
  (not exhaustively listed here — `spin`, `ping`, `pulse`, `bounce`,
  `fade-in/out`, `scale-fade-in/out`, `slide-fade-in/out`, `expand-height`,
  `collapse-height`, `position`, etc.). Used heavily by `_open`/`_closed`
  animations in slot recipes (Dialog, Drawer, Menu, Popover, Accordion).
- **Our override:** _none_.

### z-indices

- **v3 default:** `hide(-1), base(0), docked(10), dropdown(1000), sticky(1100),
banner(1200), overlay(1300), modal(1400), popover(1500), skipNav(1600),
toast(1700), tooltip(1800), max(2147483647)`.
- **Our override:** _none_.

**Drift:** v3 default recipes reference `zIndex: 'popover'`, `zIndex: 'tooltip'`,
`'--menu-z-index': 'zIndex.popover'`, etc. Inherited from defaults.

---

## 4. Semantic tokens drift

### v3 default semantic colors

`node_modules/@chakra-ui/react/dist/esm/theme/semantic-tokens/colors.js` defines:

#### Generic slots (DEFAULT + variants for `_light`/`_dark`):

- `bg.{DEFAULT, subtle, muted, emphasized, inverted, panel, error, warning, success, info}`
- `fg.{DEFAULT, muted, subtle, inverted, error, warning, success, info}`
- `border.{DEFAULT, muted, subtle, emphasized, inverted, error, warning, success, info}`

#### Per-palette slots (one set per default palette `gray, red, orange, yellow, green, teal, blue, cyan, purple, pink`):

- `{palette}.contrast` — text colour on a solid bg
- `{palette}.fg` — foreground text
- `{palette}.subtle` — subtle bg
- `{palette}.muted` — muted bg
- `{palette}.emphasized` — emphasised bg
- `{palette}.solid` — solid bg
- `{palette}.focusRing` — focus ring colour
- `{palette}.border` — border colour

These are referenced by v3 default recipes via `colorPalette.<slot>`. The
Chakra runtime rewrites `colorPalette.solid` → `gray.solid` (or whatever was
passed as `colorPalette`).

### Our semantic colors

`packages/camp/src/theme/semanticTokens/colors.ts`. Two sections:

1. **Legacy v1-era `chakra-body-*` tokens** (light mode only):

   - `chakra-body-text` → `{colors.base.content.default}`
   - `chakra-body-bg` → `{colors.base.canvas.default}`
   - `chakra-border-color` → `{colors.base.divider.medium}`

2. **Per-palette slots** for our seven custom palettes:
   `main, sub, critical, warning, success, neutral, inverse`.

   Each defines a subset of:

   - `solid, solidHover, solidActive`
   - `fg` (precomputed for contrast)
   - `outlineBorder, outlineHover, outlineActive`
   - `reverseFg, reverseHover, reverseActive`

   `neutral` and `inverse` only define `outline*` and `reverse*` slots (no
   `solid*` or `fg`).

### The watch-out: v3 default recipes reference slots WE DO NOT DEFINE

v3 default recipes (Button, Badge, Tag, Code, Kbd, Alert, Tabs, etc.) commonly
reference `colorPalette.subtle`, `colorPalette.muted`, `colorPalette.emphasized`,
`colorPalette.contrast`, `colorPalette.focusRing`, `colorPalette.border`.

**None of these slots are defined on our `main/sub/critical/warning/success/
neutral/inverse` palettes.**

This means:

1. If a follow-up spec **extends a v3 default recipe** (e.g. uses v3's Tag with
   `colorPalette="main"`), the recipe will reference `main.subtle` which is
   **undefined** → renders as the CSS variable name string or transparent.
2. If a follow-up spec **provides its own variants** (like our Button does),
   it needs to use only the slots we define (`colorPalette.solid`,
   `colorPalette.solidHover`, etc.).

**Mitigation options for spec authors:**

- **Option A:** Define all v3 slots on our palettes (`main.subtle`,
  `main.muted`, etc.) so v3 default recipes work transparently. Most painful
  to retrofit but most compatible.
- **Option B:** Write our own recipe that only uses our slots
  (`colorPalette.solid`, `colorPalette.solidHover`, ...). This is what the
  Button recipe does.
- **Option C:** When extending a v3 recipe, override variants to use our slot
  names. Local fix per recipe.

### v3 semantic radii

`node_modules/@chakra-ui/react/dist/esm/theme/semantic-tokens/radii.js`:

| Key  | Resolves to             |
| ---- | ----------------------- |
| `l1` | `{radii.xs}` (0.125rem) |
| `l2` | `{radii.sm}` (0.25rem)  |
| `l3` | `{radii.md}` (0.375rem) |

v3 default recipes use `borderRadius: 'l1'`/`'l2'`/`'l3'` heavily. Examples:

- Button base → `borderRadius: 'l2'`
- Input base → `borderRadius: 'l2'`
- Tag root → `borderRadius: 'l2'`
- Popover content → `borderRadius: 'l3'`
- Dialog content → `borderRadius: 'l3'`
- Accordion `--accordion-radius` → `radii.l2`

Spec authors can keep using `l1/l2/l3` for parity with v3 defaults, or override
with our v2-style `sm`/`md` directly. Our Button currently uses `'sm'` to match
v1 visual identity (4px) — equivalent to `l2`.

### v3 semantic shadows

`node_modules/@chakra-ui/react/dist/esm/theme/semantic-tokens/shadows.js`:

| Key     | Light value (truncated)                                | Dark value                     |
| ------- | ------------------------------------------------------ | ------------------------------ |
| `xs`    | `0px 1px 2px {gray.900/10}, 0px 0px 1px {gray.900/20}` | dark equivalent                |
| `sm`    | `0px 2px 4px {gray.900/10}, …`                         | …                              |
| `md`    | `0px 4px 8px {gray.900/10}, …`                         | …                              |
| `lg`    | `0px 8px 16px {gray.900/10}, …`                        | …                              |
| `xl`    | `0px 16px 24px {gray.900/10}, …`                       | …                              |
| `2xl`   | `0px 24px 40px {gray.900/16}, …`                       | …                              |
| `inner` | `inset 0 2px 4px 0 {black/5}`                          | `inset 0 2px 4px 0 black`      |
| `inset` | `inset 0 0 0 1px {black/5}`                            | `inset 0 0 0 1px {gray.300/5}` |

These are **semantic** — they reference `gray.900`, `black`, etc. and adapt to
`_light`/`_dark`. Since we override raw `shadows.sm` and `shadows.md` in
`packages/camp/src/theme/tokens/shadows.ts`, there is a raw-vs-semantic
collision at the `sm`/`md` keys. **TODO verify** which wins.

v3 default recipes use:

- `shadow: 'lg'` — Menu/Popover/Dialog/Drawer content
- `shadow: 'md'` — Tooltip content (our `md` value will win if raw beats semantic)
- `shadow: 'xs'` — `--tabs-indicator-shadow: shadows.xs`
- `shadow: 'xl'` — Toast root
- `shadow: 'inset'`/`'inner'` — Progress track

---

## 5. globalCss baseline

`node_modules/@chakra-ui/react/dist/esm/theme/global-css.js` defines four
top-level selectors. Spec authors should understand each:

### `*` (universal selector)

```js
'*': {
  fontFeatureSettings: '"cv11"',          // ← we override this
  '--ring-inset': 'var(--chakra-empty, )',
  '--ring-offset-width': '0px',
  '--ring-offset-color': '#fff',
  '--ring-color': 'rgba(66, 153, 225, 0.6)',
  '--ring-offset-shadow': '0 0 #0000',
  '--ring-shadow': '0 0 #0000',
  // --brightness, --contrast, --grayscale, --hue-rotate, --invert,
  // --saturate, --sepia, --drop-shadow → all 'var(--chakra-empty, )'
  // --backdrop-blur, --backdrop-brightness, ... → same
  '--global-font-mono': 'fonts.mono',
  '--global-font-body': 'fonts.body',
  '--global-color-border': 'colors.border',
}
```

Our override (`packages/camp/src/theme/config.ts`):

```ts
'*': {
  fontFeatureSettings: "'tnum' on, 'cv05' on",
}
```

**Open question:** does the merge **preserve** v3's `--ring-*`, `--brightness`,
etc. CSS variables (deep-merge) or **replace** the entire `*` block (key
replacement)? Empirically the foundation PR works, which suggests merge. But
the variables `--ring-color`, etc. are referenced by v3 default recipes
(`focusVisibleRing: 'outside'` macros). If they were dropped, focus rings would
break — they don't, so deep-merge appears to be the behavior. **TODO verify.**

### `html`

```js
html: {
  color: 'fg',
  bg: 'bg',
  lineHeight: '1.5',
  colorPalette: 'gray',  // ← THE DEFAULT colorPalette
}
```

The `colorPalette: 'gray'` is critical: every default recipe references
`colorPalette.<slot>`, and the cascade defaults to `gray` unless a consumer or
ancestor sets it.

**Implications for spec authors:**

- Our wrapper components (Button currently) set the consumer-facing
  `colorPalette` prop in TypeScript, e.g. `colorPalette = 'main'` by default,
  and pass it down to the Chakra base.
- The v3 recipe API rejects `defaultVariants: { colorPalette: 'main' }` at the
  type level — you cannot default it inside the recipe. **You must default it
  in the wrapper component.**
- If a consumer uses raw v3 components (e.g. v3's `Tag`) without a wrapper,
  the `colorPalette` will be `gray` (v3's gray hexes, not our brand). They
  must explicitly pass `colorPalette="main"` etc.

### `*::placeholder, *[data-placeholder]`

```js
{
  color: 'fg.muted/80'
}
```

This sets input placeholder colour globally to a slightly transparent fg.muted.
v3 default `Input` recipes do not override this — placeholder colour is
inherited from this rule. Spec authors of Input/Textarea/NumberInput should not
re-define placeholder colour unless they need to deviate.

### `*::selection`

```js
{
  bg: 'colorPalette.emphasized/80'
}
```

Text selection colour follows the ambient `colorPalette`. With the default
`colorPalette: 'gray'` from `html`, this resolves to `gray.emphasized` at 80%
opacity.

---

## 6. Default layerStyles

### v3 defaults

`node_modules/@chakra-ui/react/dist/esm/theme/layer-styles.js`:

| Key                           | Value (summary)                                                                |
| ----------------------------- | ------------------------------------------------------------------------------ |
| `fill.muted`                  | `{ bg: colorPalette.muted, color: colorPalette.fg }`                           |
| `fill.subtle`                 | `{ bg: colorPalette.subtle, color: colorPalette.fg }`                          |
| `fill.surface`                | subtle + 1px shadow ring at `colorPalette.muted`                               |
| `fill.solid`                  | `{ bg: colorPalette.solid, color: colorPalette.contrast }`                     |
| `outline.subtle`              | inset 1px shadow + `colorPalette.fg` text                                      |
| `outline.solid`               | 1px border at `colorPalette.solid` + `colorPalette.fg` text                    |
| `indicator.bottom`            | `::before` pseudo with `--indicator-color-fallback: colors.colorPalette.solid` |
| `indicator.top`/`start`/`end` | same idea, different position                                                  |
| `disabled`                    | **`{ opacity: '0.5', cursor: 'not-allowed' }`** ← used by many default recipes |
| `none`                        | `{}`                                                                           |

### Our layerStyles

`packages/camp/src/theme/layerStyles.ts`:

- `focusRing-default` → `_focusVisible: { boxShadow: 'none !important', outline:
'2px solid var(--chakra-colors-utility-focus-default)', outlineOffset:
'0.125rem' }`
- `focusRing-inverse` → same with `--chakra-colors-utility-focus-inverse`.

v3 defaults remain available (deep merge).

### Watch-out: `_disabled: { layerStyle: 'disabled' }` in v3 default recipes

The following v3 default recipes apply `layerStyle: 'disabled'` in their
`_disabled` state:

- Button base (`button.js` line 27–29)
- Input base (`input.js` line 14–16)
- Textarea base
- Menu item
- Accordion itemTrigger
- Native Select field
- (and others — grep `layerStyle: "disabled"` across `recipes/`)

This sets `opacity: 0.5` AND `cursor: 'not-allowed'`. Our v1 Button explicitly
sets `_disabled: { opacity: 1, bg: '…', borderColor: '…', color: '…' }`. The
recipe merge effectively gives:

```
_disabled:
  opacity: 1                            (ours wins)
  cursor: not-allowed                   (v3 disabled layerStyle wins — we don't override)
  bg, borderColor, color                (ours, no v3 conflict)
```

If a spec author wants to remove the not-allowed cursor on disabled state,
they must explicitly set `_disabled: { cursor: 'default' }` (or whatever).
Likewise for opacity. Conversely, if they don't set `opacity`, it stays at 0.5.

---

## 7. Default component recipes — collision map

This is the most important section. Each subsection covers one v3 default
recipe that a follow-up spec will replace or extend. The format is:

- **v3 source:** path
- **v3 base properties** that will merge into our base
- **v3 variants/sizes/defaultVariants**
- **v1 component we're replacing** (for context)
- **Pitfalls**

Only components we have a v1 equivalent for are listed.

### Button (already migrated)

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/button.js`
- **v3 base:** `display: inline-flex; alignItems: center; justifyContent:
center; userSelect: none; position: relative; borderRadius: l2; whiteSpace:
nowrap; borderWidth: 1px; borderColor: transparent; cursor: button; outline:
0; lineHeight: 1.2; fontWeight: medium; transitionProperty: common;
transitionDuration: moderate; focusVisibleRing: outside; _disabled: {
layerStyle: 'disabled' }; _icon: { flexShrink: 0 }`
- **v3 variants:** `solid (default), subtle, surface, outline, ghost, plain`.
  Each uses `colorPalette.{solid|subtle|muted|fg|contrast|border}` slots.
- **v3 sizes:** `2xs, xs, sm, md (default), lg, xl, 2xl`.
- **v3 defaultVariants:** `{ size: 'md', variant: 'solid' }`.
- **v1 component:** `git show main:packages/camp/src/theme/components/Button.ts`.
- **Pitfalls:**
  1. `borderColor: transparent` in v3 base → use `borderWidth: '1px'` +
     `borderStyle: 'solid'` longhands (NOT `border: '1px solid'` shorthand).
  2. `transitionDuration: moderate` → ensure `moderate` resolves in our
     durations table.
  3. `focusVisibleRing: 'outside'` → references the ring CSS variables from
     `globalCss.*`.
  4. Default `lineHeight: '1.2'` (literal) may conflict with our `textStyle:
'subhead-1'` line-height. **TODO verify** which wins — see [Section 8
     pitfall #6](#8-common-patterns-and-pitfalls).

### Input

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/input.js`
- **v3 base:** `width: 100%; outline: 0; borderRadius: l2; height:
var(--input-height); _disabled: { layerStyle: 'disabled' }; --focus-color:
colors.colorPalette.focusRing; --error-color: colors.border.error; _invalid:
{ focusRingColor: var(--error-color), borderColor: var(--error-color) }`
- **v3 variants:** `outline (default), subtle, flushed`.
- **v3 sizes:** `2xs..2xl` (default `md`, height = sizes.10 = 2.5rem).
- **v3 defaultVariants:** `{ size: 'md', variant: 'outline' }`.
- **v1 component:** `git show main:packages/camp/src/theme/components/Input.ts`.
- **Pitfalls:**
  1. v3 references `colors.colorPalette.focusRing` — undefined on our brand
     palettes. Must define or override the variable.
  2. `borderRadius: l2` → 4px (matches our v1 4px = `'sm'`).
  3. `--input-height` driven by `size` variant uses `sizes.N` tokens — our
     `sizes.10` is `2.5rem`, matching v3.
  4. `_invalid` uses `border.error` which IS in v3 semantic colors but our
     overrides may not preserve dark mode. We light-mode only.

### Textarea

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/textarea.js`
- Mirrors Input (variants `outline/subtle/flushed`, default `outline`). Same
  pitfalls.

### NumberInput

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/number-input.js`
- Slot recipe. v3 ships slots `root, control, incrementTrigger,
decrementTrigger, scrubber, input, label, valueText`. Inherits Input behavior.

### Select / NativeSelect

- **v3 sources:** `recipes/select.js` (slot), `recipes/native-select.js`
  (slot).
- `nativeSelectSlotRecipe.field` uses `borderRadius: l2` and references
  `selectSlotRecipe.variants.variant.outline.trigger` (so select and native
  select share styles via variant import).

### Checkbox

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/checkbox.js`
  (slot recipe). The `control` slot inherits from `checkmarkRecipe.base`
  (`recipes/checkmark.js`).
- **v3 base.root:** `display: inline-flex; gap: 2; alignItems: center;
position: relative`.
- **v3 base.label:** `fontWeight: medium; userSelect: none; _disabled: {
opacity: 0.5 }`.
- **v3 sizes:** `xs, sm, md (default), lg`.
- **v3 variants:** `outline, solid (default), subtle`.
- **v1 component:** `Checkbox.ts`.
- **Pitfalls:**
  1. `checkmarkRecipe` is imported but **not exposed at top level** — when
     re-authoring, you must import it from `@chakra-ui/react/styled-system` if
     you want to keep parity.
  2. `colorPalette.solid` and `colorPalette.muted` slots referenced by
     `solid`/`subtle` variants — undefined on our brand palettes.

### Radio (RadioGroup)

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/radio-group.js`
  (slot recipe). Control inherits from `radiomarkRecipe`.
- Same shape as Checkbox: `xs, sm, md (default), lg` sizes and `outline,
subtle, solid (default)` variants.
- **v1 component:** `Radio.ts`.

### Switch

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/switch.js`
  (slot recipe).
- **v3 base.control:** `cursor: switch; borderRadius: full; _disabled: {
opacity: 0.5, cursor: not-allowed }; _invalid: { outline: 2px solid;
outlineColor: border.error; outlineOffset: 2px }`.
- **v3 sizes:** referenced via `--switch-width` and `--switch-height` CSS
  custom properties.
- **v1 component:** `Switch.ts`.
- **Pitfall:** `cursor: switch` is a custom cursor token, not a CSS value.
  Don't confuse with CSS `cursor: 'switch'` (which is invalid).

### Field (was FormControl)

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/field.js`
  (slot recipe).
- **v3 slots:** `root, label, helperText, errorText, requiredIndicator`.
- **v3 base.label:** `display: flex; alignItems: center; textAlign: start;
textStyle: sm; fontWeight: medium; gap: 1; userSelect: none; _disabled: {
opacity: 0.5 }`.
- **v3 base.errorText:** `color: fg.error; textStyle: xs`.
- **v3 base.helperText:** `color: fg.muted; textStyle: xs`.
- **v3 defaultVariants:** `{ orientation: 'vertical' }`.
- **v1 component:** `FormControl.ts`, `FormLabel.ts`, `FormError.ts`. v3 unifies
  these into one slot recipe.
- **Pitfall:** the rename `FormControl → Field` is part of v3; our wrapper layer
  may need to keep `FormControl` as a deprecated alias.

### Tag

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/tag.js`
  (slot recipe).
- **v3 slots:** `root, label, closeTrigger, startElement, endElement`.
- **v3 base.root:** `display: inline-flex; alignItems: center; borderRadius:
l2; focusVisibleRing: outside`.
- **v3 variants:** delegate to `badgeRecipe.variants?.variant` — `subtle,
solid, outline, surface`.
- **v3 sizes:** `sm, md (default), lg, xl`.
- **v3 defaultVariants:** `{ size: 'md', variant: 'surface' }`.
- **v1 component:** `Tag.ts`, `TagInput.ts`.
- **Pitfalls:**
  1. Variants are not defined in `tag.js` directly — they pull from
     `badgeRecipe`. If we re-author Badge, Tag variant behavior changes
     transitively.
  2. `surface` is the default variant (uses `bg: colorPalette.subtle` + inset
     shadow) — different from v1's solid-like default.

### Badge

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/badge.js`
- **v3 base:** `display: inline-flex; alignItems: center; borderRadius: l2;
gap: 1; fontWeight: medium; fontVariantNumeric: tabular-nums; whiteSpace:
nowrap; userSelect: none`.
- **v3 variants:** `solid, subtle (default), outline, surface, plain`.
- **v3 sizes:** `xs, sm (default), md, lg`.
- **v1 component:** `Badge.ts`.

### Spinner

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/spinner.js`
- **v3 base:** `display: inline-block; borderColor: currentColor; borderStyle:
solid; borderWidth: 2px; borderRadius: full; width: var(--spinner-size);
height: var(--spinner-size); animation: spin; animationDuration: slowest;
--spinner-track-color: transparent; borderBottomColor:
var(--spinner-track-color); borderInlineStartColor:
var(--spinner-track-color)`.
- **v3 sizes:** `inherit (1em), xs, sm, md (default), lg, xl`.
- **v1 component:** `packages/camp/src/Spinner` (already in v3).
- **Pitfall:** `animationDuration: 'slowest'` references duration token
  `slowest` (500ms). Our override has `ultra-slow` for 500ms; `slowest` may
  resolve to undefined if our durations table replaces. **TODO verify.**

### Avatar

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/avatar.js`
- Slot recipe with slots `root, image, fallback`.
- **v3 sizes:** `full, 2xs, xs, sm, md (default), lg, xl, 2xl`.
- **v3 base.root:** uses `var(--avatar-size)`, `var(--avatar-radius)`,
  `var(--avatar-font-size)`.
- **v1 component:** `Avatar.ts`, `AvatarMenu.ts`.

### Tabs

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/tabs.js`
- Slot recipe with slots `root, list, trigger, content, indicator`.
- **v3 base.root:** `--tabs-trigger-radius: radii.l2; --tabs-indicator-shadow:
shadows.xs; --tabs-indicator-bg: colors.bg`.
- **v3 base.trigger:** `fontWeight: medium; cursor: button; gap: 2;
_focusVisible: { outline: 2px solid; outlineColor: colorPalette.focusRing };
_disabled: { cursor: not-allowed; opacity: 0.5 }`.
- **v3 variants:** `fitted, justify, orientation, variant (line, subtle,
enclosed, outline, plain)`, sizes.
- **v1 component:** `Tabs.ts`.
- **Pitfalls:**
  1. `colorPalette.focusRing` slot — undefined on our brand palettes; the
     focus ring renders as the CSS variable name (invalid).
  2. Tabs are the only component (along with Switch) that has a `--*-bg:
colors.bg` token that resolves through the `bg` semantic color, which our
     overrides don't define directly.

### Menu

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/menu.js`
- Slot recipe with slots `content, item, itemText, itemIndicator,
itemGroupLabel, indicator, itemCommand, separator`.
- **v3 base.content:** `bg: var(--menu-bg) where --menu-bg: colors.bg.panel;
boxShadow: lg; color: fg; borderRadius: l2; _open: { animationStyle:
slide-fade-in; animationDuration: fast }; _closed: { animationStyle:
slide-fade-out; animationDuration: faster }`.
- **v3 base.item:** `borderRadius: l1; cursor: menuitem; _disabled: {
layerStyle: 'disabled' }`.
- **v3 base.itemCommand:** `letterSpacing: widest; fontFamily: inherit`.
- **v1 component:** `Menu.ts`.

### Popover

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/popover.js`
- Slot recipe with slots `content, header, body, footer, arrow, arrowTip`.
- **v3 base.content:** `bg: var(--popover-bg); --popover-bg: colors.bg.panel;
boxShadow: lg; --popover-size: sizes.xs; borderRadius: l3; zIndex:
calc(var(--popover-z-index) + var(--layer-index, 0)) where --popover-z-index:
zIndex.popover`.
- **v3 sizes:** `xs, sm (default), md, lg`.
- **v1 component:** `Popover.ts` (in v1 codebase but no foundation file present
  — see `git show main:packages/camp/src/theme/components/`).
- **Pitfall:** references `sizes.xs` (20rem in v3, undefined in our override
  if replacement).

### Tooltip

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/tooltip.js`
- Slot recipe with slots `content, arrow, arrowTip`.
- **v3 base.content:** `--tooltip-bg: colors.bg.inverted; bg: var(--tooltip-bg);
color: fg.inverted; px: 2.5; py: 1; borderRadius: l2; fontWeight: medium;
textStyle: xs; boxShadow: md; maxW: xs; zIndex: tooltip`.
- **v1 component:** `Tooltip.ts`.
- **Pitfalls:**
  1. References `bg.inverted` and `fg.inverted` — semantic tokens for an
     "inverted" appearance. Light-mode only, our `bg.inverted` should match
     `gray.900`-ish.
  2. References `maxW: 'xs'` (a `sizes.xs` token = 20rem in v3 default).

### Dialog (was Modal)

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/dialog.js`
- Slot recipe with slots `backdrop, positioner, content, header, body, footer,
title, description, closeTrigger`.
- **v3 base.backdrop:** `bg: blackAlpha.500; pos: fixed; w: 100dvw; h: 100dvh;
--dialog-z-index: zIndex.popover; _open: { animationName: fade-in;
animationDuration: slow }; _closed: { animationName: fade-out;
animationDuration: moderate }`.
- **v3 base.content:** `borderRadius: l3; textStyle: sm; bg: bg.panel;
boxShadow: lg`.
- **v1 component:** `Modal.ts`.
- **Pitfalls:**
  1. **Component renamed** Modal → Dialog. Our wrapper will need to either
     re-export `Modal` as a deprecated alias of `Dialog`, or migrate consumers.
  2. References `blackAlpha.500` — we do not override `blackAlpha`, so v3
     default in effect (`rgba(0, 0, 0, 0.36)`).
  3. Animation durations (`slow`, `moderate`) need to resolve in our durations
     table.

### Drawer

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/drawer.js`
- Slot recipe, very similar shape to Dialog.
- **v3 base.content:** `bg: bg.panel; boxShadow: lg; _open: { animationDuration:
slowest; animationTimingFunction: ease-in-smooth }; _closed: {
animationDuration: slower; animationTimingFunction: ease-in-smooth }`.
- **Pitfalls:**
  1. `ease-in-smooth` — not defined in our easings table. **TODO verify**.
  2. `slowest` duration — same concern as durations note.

### Breadcrumb

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/breadcrumb.js`
- Slot recipe with slots `list, link, item, separator, ellipsis, currentLink`.
- **v3 base.list:** `display: flex; alignItems: center; color: fg.muted`.
- **v3 base.link:** `outline: 0; textDecoration: none; borderRadius: l1;
focusRing: outside; display: inline-flex; alignItems: center; gap: 2`.
- **v3 variants:** `underline, plain`.
- **v3 sizes:** `sm, md (default), lg`.
- **v1 component:** `Breadcrumb.ts`.

### Link

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/link.js`
- **v3 base:** `display: inline-flex; alignItems: center; outline: none; gap:
1.5; cursor: pointer; borderRadius: l1; focusRing: outside`.
- **v3 variants:** `underline, plain (default)`.
- **v1 component:** `Link.ts`.

### Alert (Banner / Infobox in v1)

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/alert.js`
- Slot recipe with slots `root, title, description, indicator, content`.
- **v3 base.root:** `borderRadius: l3`.
- **v3 variants.status:** `info, warning, success, error, neutral` — each sets
  `colorPalette` to a default palette name (`blue, orange, green, red, gray`).
  This bypasses any consumer-set `colorPalette`. **Watch out** — our brand
  recipe may want to override these.
- **v3 variants.variant:** `subtle, surface, solid, outline`.
- **v1 components:** `Banner.ts`, `Infobox.ts`. Two v1 components map to one
  v3 component (or remain custom).

### Accordion

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/accordion.js`
- Slot recipe with slots `root, item, itemTrigger, itemBody, itemContent,
itemIndicator`.
- **v3 base.root:** `--accordion-radius: radii.l2`.
- **v3 base.itemTrigger:** `fontWeight: medium; _focusVisible: { outline: 2px
solid; outlineColor: colorPalette.focusRing }; _disabled: { layerStyle:
'disabled' }`.
- **v3 variants:** `outline, subtle, enclosed, plain`.
- **v1 component:** `Accordion.ts`.

### Progress

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/progress.js`
- Slot recipe with slots `root, track, range, label, valueText`.
- **v3 base.range:** `transitionDuration: slow; bgColor: var(--track-color);
_indeterminate: { animation: position 1s ease infinite normal none running }`.
- **v3 variants.variant:** `outline, subtle`. **No `solid` variant.**
- **v3 shape:** `square, rounded, full`.
- **v1 component:** `Progress.ts`.

### Slider

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/slider.js`
- Slot recipe with many slots (`root, label, control, track, range, markerGroup,
marker, markerIndicator, thumb`).
- **v3 base.thumb:** `_focusVisible: { ring: 3px; ringColor:
colorPalette.focusRing/50 }`.
- **v1 component:** (none — slider is new for some consumers).

### Toast

- **v3 source:** `node_modules/@chakra-ui/react/dist/esm/theme/recipes/toast.js`
- Slot recipe with many slots, including hardcoded variants by
  `[data-type=warning|success|error]` that swap to `orange.solid`,
  `green.solid`, `red.solid` with their `contrast` colours.
- **v1 component:** `Toast.ts`.

---

## 8. Common patterns and pitfalls

A checklist distilled from the foundation PR's regressions:

1. **Never use `border: '1px solid'` shorthand without a colour.** The CSS
   shorthand splits into longhands including `border-color: currentColor`,
   which overrides v3's default `borderColor: 'transparent'` (Button base)
   and any consumer-set border colour. Use `borderWidth: '1px'; borderStyle:
'solid'` longhands or `border: '1px solid transparent'` (or the colour you
   want).

2. **`defaultVariants.colorPalette` is rejected by `defineRecipe` types.**
   Apply the default `colorPalette` in the wrapper component:

   ```tsx
   export const Button = ({ colorPalette = 'main', ...rest }: ButtonProps) => (
     <ChakraButton colorPalette={colorPalette} {...rest} />
   )
   ```

   Without a wrapper default, the consumer relies on `globalCss.html.colorPalette:
'gray'`, which renders our brand colours as `gray.<slot>` — i.e. v3's
   defaults.

3. **Verify token name exists before referencing in recipes.** The list of v2
   names that **no longer exist** in v3 (or whose values have changed):

   - `radii.base` → use `sm`
   - `radii.sm` (4px) → now `xs` (2px) (value-shifted)
   - `lineHeights.normal/none/tall` → renamed in v3 to `moderate/short/tall`
     (or removed)
   - `space.<key>` references like `'13'`, `'14'` may resolve differently if
     our spacing override replaces v3's wholesale (TODO verify)

4. **`_disabled: { layerStyle: 'disabled' }` in v3 default recipes.** This sets
   `opacity: 0.5` AND `cursor: 'not-allowed'`. If you want to deviate, override
   each property explicitly inside your `_disabled` block. Just setting
   `_disabled: { opacity: 1 }` leaves `cursor: 'not-allowed'` from v3.

5. **Default `colorPalette: 'gray'` from `globalCss`.** Every recipe must
   either be invoked with an explicit `colorPalette` prop, or the wrapper must
   inject one, or the gray fallback is acceptable. v3's `gray` is a cool grey
   ramp (`#fafafa..#111111`), which probably will NOT match brand design.

6. **textStyle vs. bare property priority.** Several v3 default recipe bases
   set bare `fontWeight: 'medium'` or `lineHeight: '1.2'` (e.g. Button,
   Tag.label, Heading). When our recipe sets `textStyle: 'subhead-1'` in the
   base, the textStyle inlines `fontWeight: 500; lineHeight: '1.5rem'`. **Open
   question:** does the textStyle's inlined `lineHeight` override v3's base
   `lineHeight: '1.2'` after merge? Empirically, our Button stories look
   correct, suggesting the textStyle wins (its properties are inlined at the
   same level as v3's base). **TODO verify** by inspecting the emitted CSS for
   a Button at runtime.

7. **Cross-token references use braces.** When defining semantic tokens that
   reference raw tokens, use `{colors.foo.bar}` syntax:

   ```ts
   defineSemanticTokens.colors({
     main: { solid: { value: '{colors.interaction.main.default}' } },
   })
   ```

   Bare strings (`'colors.interaction.main.default'`) are interpreted as CSS
   values, not token references.

8. **Light-mode only.** Our design system does not support dark mode. v3
   default semantic tokens (`bg`, `fg`, `border`, etc.) all have `_light` and
   `_dark` variants. We rely on the `_light` variant; if a consumer toggles to
   `_dark`, v3's default dark hexes apply but our semantic palettes
   (`main/sub/critical/...`) have no `_dark` variant and resolve to their
   light values. Document this in any wrapper that re-exposes a colour mode
   prop.

9. **The `_focusVisible` ring stack.** v3 default recipes use
   `focusVisibleRing: 'outside'` or `focusVisibleRing: 'inside'`. These macros
   expand to CSS using the `--ring-*` variables defined in `globalCss.*`. Our
   Button recipe instead uses an explicit `_focusVisible: { boxShadow: '0 0
0 2px var(--chakra-colors-utility-focus-default)' }`. If a new recipe
   author wants the v3 ring macro, they should know it picks up its colour
   from `colorPalette.focusRing` — undefined on our brand palettes.

10. **`color`/`bg` semantic token defaults exist.** `color: 'fg'` and `bg:
'bg'` work because v3 defines `bg` and `fg` semantic tokens with `_light`
    variants. Don't write `color: 'fg.default'` (that resolves to the same
    DEFAULT value via Chakra's resolution).

11. **`colorPalette.foo/<alpha>` is valid syntax.** v3 recipes commonly write
    `bg: 'colorPalette.solid/90'` (90% alpha). Chakra rewrites this to
    `color-mix(...)` at build time.

12. **Animation tokens.** v3 default recipes use `animationName: 'fade-in'`,
    `animationStyle: 'slide-fade-in'`, etc. — these are `keyframes` tokens.
    We don't override keyframes, so v3 defaults apply.

13. **`borderRadius` and the `l1/l2/l3` semantic radii.** v3 default recipes
    use `l1/l2/l3` heavily. Spec authors may keep these for compatibility
    (they resolve to v3's `xs/sm/md`) or override with our v1-style names.
    Our Button uses `'sm'` directly.

---

## 9. Verification results and remaining questions

The following questions were originally open at the time of writing. Several
have since been answered empirically by probing the merged system with
`system.token(<path>)` on the built CJS output. Results below.

### 9.1 — Token merge: ✅ deep merge confirmed

**Verified.** `createSystem(defaultConfig, ourConfig)` performs **per-key deep
merge** of token categories. Both v3 defaults AND our additions coexist in the
final system:

| Probe                             | Resolves to             | Source     |
| --------------------------------- | ----------------------- | ---------- |
| `durations.moderate`              | `200ms`                 | v3 default |
| `durations.slowest`               | `500ms`                 | v3 default |
| `durations.normal`                | `200ms`                 | ours       |
| `durations.ultra-fast`            | `50ms`                  | ours       |
| `easings.ease-in-smooth`          | `cubic-bezier(...)`     | v3 default |
| `radii.l1` / `l2` / `l3`          | `var(--chakra-radii-…)` | v3 default |
| `radii.full`                      | `9999px`                | v3 default |
| `radii.base`                      | **`undefined`**         | (neither)  |
| `colors.gray.500`                 | `#71717a`               | v3 default |
| `colors.interaction.main.default` | `#1361F0`               | ours       |

**Implications:**

- v3 default recipes that reference `transitionDuration: 'moderate'`,
  `transitionDuration: 'fastest'`, `easing: 'ease-in-smooth'`,
  `borderRadius: 'l2'`, etc., **will resolve correctly**.
- We do **not** need to add aliases for v3-default keys we don't override.
- Old v2 keys that v3 dropped (e.g. `radii.base`) return `undefined`. Any
  reference to such a key emits a broken CSS variable (silent visual
  regression). All such references must be updated to the v3 equivalent.

### 9.2 — ⚠️ Dark-mode defaults leak into our light-only theme

**Critical discovery during probe.** `system.token('colors.fg')` returns
`var(--chakra-colors-gray-50)` — the **dark-mode** value of v3's semantic
`fg.DEFAULT` token (`_light: '{colors.black}'`, `_dark: '{colors.gray.50}'`).
Our README explicitly states dark mode is unsupported, so this is a real risk
for any v3 default recipe that references `colors.fg`, `colors.bg`,
`colors.border`, `colors.gray.*` (semantic slots), and similar.

The most likely failure mode: a user on Chrome with `prefers-color-scheme:
dark` renders any component that uses a v3 default recipe — and gets the dark
variant of those colors (e.g. `gray-50` foreground on `gray-50` background →
invisible text). Our brand palettes don't have this issue because we defined
them with literal hex values, not `_light`/`_dark` pairs.

**Mitigations to apply in follow-up specs (one of):**

1. **Force light mode** via `data-theme="light"` on `<html>` (set in
   `ThemeProvider`, ensures all `_light` variants resolve).
2. **Override every semantic colour token** v3 ships with a flat (non-`_light`/
   `_dark`) value at the foundation level. Tedious but explicit.
3. **Avoid v3 default recipes entirely** and re-author every component recipe
   ourselves. We're already doing this for many components.

Recommended: option (1) is cheapest. The next follow-up spec should add
`data-theme="light"` (or v3's actual color-mode attribute — verify the exact
attribute name v3 expects) to the root element. Test by viewing Storybook with
OS dark mode enabled and confirming light-mode colors persist.

### 9.3 — Remaining open questions

The following are still source-only inferences; verify in follow-up specs:

1. **`globalCss` `*` selector merge.** Does our `*` rule preserve v3's
   `--ring-*` and `--brightness/--contrast/etc.` variables? Test by grepping
   for `--ring-color` in the emitted CSS. Focus rings on v3 default recipes
   that use the `focusVisibleRing` macro will silently fail if these
   variables are dropped.

2. **`textStyle` vs bare-property priority.** When our `buttonRecipe.base`
   sets `textStyle: 'subhead-1'` (which inlines `lineHeight: '1.5rem'`), does
   it win over v3's `buttonRecipe.base.lineHeight: '1.2'` after the recipe
   merge? Test by inspecting computed `line-height` on a `<Button>` in
   Storybook.

3. **Raw vs semantic shadow precedence.** We define raw `shadows.sm` and
   `shadows.md` in `tokens/shadows.ts`. v3 ships semantic `shadows.sm/md` with
   `_light`/`_dark` values. When a recipe writes `shadow: 'md'`, which one
   wins? Test by inspecting computed `box-shadow` on a Tooltip (`shadow:
'md'`).

4. **`fonts.code` vs `fonts.mono` for v3 default recipes.** We name the
   monospace font `code`. v3 default recipes (Code, Kbd, Menu.itemCommand)
   reference `fontFamily: 'mono'`. Token merge is confirmed (see 9.1), so
   `mono` should remain defined from v3 even after our override. Verify by
   computing `font-family` on a `<Code>`.

5. **`colorPalette.focusRing/subtle/muted/emphasized/contrast` on brand
   palettes.** Our `main/sub/critical/warning/success/neutral/inverse` palettes
   don't define these slots. v3 emits the literal `var(--chakra-colors-main-subtle)`
   even when undefined (broken silently). Either define the slots on our
   palettes, or avoid these references in our own recipes.

6. **Per-palette slots presence in colors override.** Confirm whether shadowing
   `colors.blue/red/green/yellow` with our brand hexes also re-defines the
   per-palette semantic-token slots (`blue.solid`, `red.subtle`, etc.) or
   leaves them resolving to v3's hex at stops 50–950. Our overrides go up to
   stop `900` only; stop `950` falls back to v3's hex.

---

## Appendix A: File index

| Path                                                                | Purpose                                 |
| ------------------------------------------------------------------- | --------------------------------------- |
| `packages/camp/src/theme/config.ts`                                 | Top-level `defineConfig` call           |
| `packages/camp/src/theme/system.ts`                                 | `createSystem(defaultConfig, config)`   |
| `packages/camp/src/theme/breakpoints.ts`                            | Breakpoints override                    |
| `packages/camp/src/theme/tokens/*.ts`                               | Token overrides (one file per category) |
| `packages/camp/src/theme/semanticTokens/colors.ts`                  | Semantic colour overrides               |
| `packages/camp/src/theme/textStyles.ts`                             | textStyles overrides                    |
| `packages/camp/src/theme/layerStyles.ts`                            | layerStyles overrides                   |
| `packages/camp/src/theme/recipes/button.recipe.ts`                  | Button recipe                           |
| `node_modules/@chakra-ui/react/dist/esm/theme/tokens/*.js`          | v3 default tokens                       |
| `node_modules/@chakra-ui/react/dist/esm/theme/semantic-tokens/*.js` | v3 default semantic tokens              |
| `node_modules/@chakra-ui/react/dist/esm/theme/recipes/*.js`         | v3 default recipes                      |
| `node_modules/@chakra-ui/react/dist/esm/theme/global-css.js`        | v3 default globalCss                    |
| `node_modules/@chakra-ui/react/dist/esm/theme/layer-styles.js`      | v3 default layerStyles                  |
| `node_modules/@chakra-ui/react/dist/esm/theme/text-styles.js`       | v3 default textStyles                   |

## Appendix B: v1 component theme files

Read with `git show main:packages/camp/src/theme/components/<file>.ts`.

```
Accordion.ts        Attachment.ts       Avatar.ts           AvatarMenu.ts
Badge.ts            Banner.ts           Breadcrumb.ts       Button.ts
Calendar.ts         Checkbox.ts         CloseButton.ts      DatePicker.ts
DateRangePicker.ts  Divider.ts          Drawer.ts           Footer.ts
FormControl.ts      FormError.ts        FormLabel.ts        Infobox.ts
Input.ts            Link.ts             Menu.ts             Modal.ts
MultiSelect.ts      NumberInput.ts      Pagination.ts       PhoneNumberInput.ts
Progress.ts         Radio.ts            Searchbar.ts        Sidebar.ts
SingleCountryPhoneNumberInput.ts        SingleSelect.ts     Switch.ts
Tabs.ts             Tag.ts              TagInput.ts         Textarea.ts
Tile.ts             Toast.ts            Toggle.ts           Toolbar.ts
Tooltip.ts          (+ index.ts)
```

And v1 foundations:

```
breakpoints.ts  colors.ts  semanticTokens.ts  shadows.ts  spacing.ts
transition.ts   typography.ts
```

(Note: there was no v1 `radii.ts` — v1 relied on Chakra v2's default radii,
which is the source of [regression #1](#1-overview).)
