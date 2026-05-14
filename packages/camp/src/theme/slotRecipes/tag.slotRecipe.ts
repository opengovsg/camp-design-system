import { defineSlotRecipe } from '@chakra-ui/react'

export type TagColorPalette =
  | 'main'
  | 'sub'
  | 'info'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'critical'

/**
 * @deprecated Renamed to `TagColorPalette`. Will be removed in v3.
 */
export type ThemeTagColorScheme = TagColorPalette

/**
 * Tag slot recipe — overrides only the properties v1 diverged on. The rest
 * (label line-clamp behaviour, closeTrigger flex layout, startElement /
 * endElement avatar support) comes from v3's default `tagSlotRecipe` via
 * `createSystem` deep merge.
 *
 * v1 component: `git show main:packages/camp/src/theme/components/Tag.ts`.
 * v1 used `createStylesContext` + multi-style config; v3 ships a compound
 * namespace (Tag.Root / Tag.Label / Tag.StartElement / Tag.EndElement /
 * Tag.CloseTrigger). Public surface lives in `~/Tag/index.ts`.
 *
 * v1 differences from v3 defaults:
 * - Variant default is `subtle` (v3 default is `surface`).
 * - Sizes: v1 has `xs/sm/md`; v3 has `sm/md/lg/xl`. Full size set overridden.
 * - `borderRadius: 'sm'` (v2 used `'base'`, dropped in v3 → `sm` is matching hex).
 * - Hover / active states on subtle and solid variants using the per-palette
 *   `subtleBgHover` / `subtleBgActive` / `solidHover` / `solidActive` tokens.
 * - Combined `[aria-disabled='true'], [data-disabled]` selector preserves
 *   v1's `<Tag aria-disabled>` idiom AND v3's `data-disabled` idiom; no
 *   wrapper needed (audit § 8 add-on from Tag stack).
 *
 * Per audit § 8 #14: v3-default size variants set CSS variables
 * (`--tag-element-size`, `--tag-element-offset`) which beat our base. We
 * redeclare these per-size so v1 dimensions win after merge.
 *
 * Per audit § 8 #16: no `className` field set; v3 defaults to `chakra-tag`.
 *
 * Per audit § 8 #2: no `defaultVariants.colorPalette` (rejected by
 * `defineSlotRecipe` types). Consumers pass `colorPalette` or rely on
 * `globalCss.html.colorPalette: 'gray'`.
 */
export const tagSlotRecipe = defineSlotRecipe({
  slots: ['root', 'label', 'closeTrigger', 'startElement', 'endElement'],
  base: {
    root: {
      borderRadius: 'sm',
      transitionProperty: 'common',
      transitionDuration: 'normal',
      width: 'fit-content',
      height: 'fit-content',
      // v1 supported both `<Tag aria-disabled>` (declarative) and v3's
      // `data-disabled` idiom (set by Chakra when consumers pass `disabled`).
      // Combined selector keeps both working without a wrapper.
      "&[aria-disabled='true'], &[data-disabled]": {
        bg: 'interaction.support.disabled',
        color: 'interaction.support.disabled-content',
        cursor: 'not-allowed',
        _hover: { bg: 'interaction.support.disabled' },
      },
    },
    label: {
      // v3 default sets `lineClamp: 1`; v1 used `whiteSpace: initial`.
      // Restore so tag text wraps naturally inside fixed-width contexts.
      whiteSpace: 'initial',
    },
    closeTrigger: {
      // v3 default uses `focusVisibleRing: inside` with width 2px. Override
      // to use our `utility.focus-default` token so the focus ring is
      // consistent with Link / Button / IconButton.
      _focusVisible: {
        outline: '2px solid var(--chakra-colors-utility-focus-default)',
        outlineOffset: 0,
        boxShadow: 'none',
      },
    },
  },
  variants: {
    // `size` is declared BEFORE `variant` so `variant` wins in CSS cascade
    // order — precedent: badge.recipe.ts. Required for `variant.subtle` /
    // `variant.solid` hover styles to override any size-level defaults.
    size: {
      xs: {
        root: {
          textStyle: 'caption-1',
          px: '0.5rem',
          py: '0.125rem',
          // v3 default sets `gap: '1'` per size; v1 had no flex gap (icons used
          // margins). Reset so the start/end element spacing matches v1.
          gap: 0,
          // v1 enforced `minH: '4'` / `minW: '4'` on xs via Chakra v2 default —
          // v3 drops these. Restore so the tag holds shape with short content.
          minH: '1rem',
          minW: '1rem',
          '--tag-element-size': '1rem',
          '--tag-element-offset': '-0.125rem',
        },
        label: { textStyle: 'caption-1' },
        closeTrigger: { fontSize: '0.875rem', boxSize: '1rem' },
      },
      sm: {
        root: {
          textStyle: 'body-2',
          px: '0.5rem',
          py: '0.125rem',
          gap: 0,
          minH: '1.25rem',
          minW: '1.25rem',
          '--tag-element-size': '1.25rem',
          '--tag-element-offset': '-0.25rem',
        },
        label: { textStyle: 'body-2' },
        closeTrigger: { fontSize: '1.125rem', boxSize: '1.25rem' },
      },
      md: {
        root: {
          textStyle: 'subhead-2',
          px: '0.5rem',
          py: '0.25rem',
          gap: 0,
          // v1 default Tag md was 24px tall (sizes.6) via Chakra v2's
          // `minH: '6'`. v3 default is `minH: '5'` (20px) — too tight.
          minH: '1.5rem',
          minW: '1.5rem',
          '--tag-element-size': '1.25rem',
          '--tag-element-offset': '-0.25rem',
        },
        label: { textStyle: 'subhead-2' },
        closeTrigger: { fontSize: '1.125rem', boxSize: '1.25rem' },
      },
    },
    variant: {
      subtle: {
        root: {
          bg: 'colorPalette.subtleBg',
          color: 'colorPalette.subtleFg',
          _hover: { bg: 'colorPalette.subtleBgHover' },
          _active: { bg: 'colorPalette.subtleBgActive' },
        },
      },
      solid: {
        root: {
          bg: 'colorPalette.solid',
          color: 'colorPalette.fg',
          _hover: { bg: 'colorPalette.solidHover' },
          _active: { bg: 'colorPalette.solidActive' },
        },
      },
    },
  },
  compoundVariants: [
    // v1 Tag's subtle warning rendered text as `yellow.700` for legibility
    // against the pale-yellow background — same rationale Badge needed; see
    // badge.recipe.ts for the parallel override.
    {
      variant: 'subtle',
      colorPalette: 'warning',
      css: {
        root: { color: 'yellow.700' },
      },
    },
  ],
  defaultVariants: {
    variant: 'subtle',
    size: 'md',
  },
})
