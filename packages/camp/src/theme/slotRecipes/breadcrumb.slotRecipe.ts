import { defineSlotRecipe } from '@chakra-ui/react'

export type BreadcrumbColorPalette = 'main' | 'sub' | 'neutral'

/**
 * @deprecated Renamed to `BreadcrumbColorPalette`. Will be removed in v3.
 */
export type ThemeBreadcrumbColorScheme = BreadcrumbColorPalette

/**
 * Breadcrumb slot recipe — overrides only the properties v1 diverged on.
 *
 * v1 component: `git show main:packages/camp/src/theme/components/Breadcrumb.ts`.
 * v1 had no React wrapper around theming — just a thin wrapper injecting
 * a default `BxChevronRight` separator. Theme drove typography per size.
 *
 * v1 differences from v3 defaults:
 * - Sizes: v1 has `xs/sm/md`; v3 has `sm/md/lg`. Full size set overridden so
 *   `<Breadcrumb size="xs">` still works in consumer code without rename.
 * - Link uses our `utility.focus-default` focus ring (matches Link/Button
 *   recipes) rather than v3's `focusRing: 'outside'` token chain.
 * - Hover swaps text-decoration via CSS var (v1 used `cssVar('breadcrumb-link-decor')`)
 *   — re-implemented inline so we don't depend on chakra-utils v2 helpers.
 * - Separator inherits v3 default styling; we keep the muted colour but
 *   redeclare textStyle per-size since v3 doesn't drive that for the
 *   separator slot.
 *
 * Per audit § 8 #14: v3-default size variants set `gap` / `textStyle` on
 * `list`. We override per-size.
 *
 * Per audit § 8 #16: no `className` field set; v3 defaults to `chakra-breadcrumb`.
 */
export const breadcrumbSlotRecipe = defineSlotRecipe({
  slots: [
    'root',
    'list',
    'item',
    'link',
    'currentLink',
    'separator',
    'ellipsis',
  ],
  base: {
    link: {
      transitionProperty: 'common',
      transitionDuration: 'fast',
      transitionTimingFunction: 'ease-out',
      outline: 'none',
      color: 'base.content.default',
      textDecoration: 'none',
      borderRadius: 'sm',
      // v1 wired link styling so that only non-current links pick up hover
      // underline and focus ring. The `data-current=page` attribute is the
      // v3 idiom for the active step.
      "&:not([data-current='page'])": {
        cursor: 'pointer',
        _hover: {
          textDecoration: 'underline',
        },
        outlineOffset: '0.25rem',
        _focusVisible: {
          boxShadow: 'none',
          outline: '2px solid var(--chakra-colors-utility-focus-default)',
          outlineOffset: '0.25rem',
        },
      },
    },
    currentLink: {
      // v1 used the same colour token for current and non-current links.
      // v3 default split them into `currentLink` (full `fg`) and `link`
      // (`fg.muted`). Re-unify so the active step matches v1 typography.
      color: 'base.content.default',
    },
    separator: {
      color: 'interaction.support.disabled-content',
    },
  },
  variants: {
    size: {
      xs: {
        list: { textStyle: 'caption-1' },
        separator: { textStyle: 'caption-1' },
      },
      sm: {
        list: { textStyle: 'subhead-2' },
        separator: { textStyle: 'subhead-2' },
      },
      md: {
        list: { textStyle: 'subhead-1' },
        separator: { textStyle: 'subhead-1' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
