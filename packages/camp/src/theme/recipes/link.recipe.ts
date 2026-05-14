import { defineRecipe } from '@chakra-ui/react'

export type LinkColorPalette =
  | 'main'
  | 'sub'
  | 'critical'
  | 'warning'
  | 'success'
  | 'neutral'
  | 'inverse'

/**
 * @deprecated Renamed to `LinkColorPalette`. Will be removed in v3.
 */
export type ThemeLinkColorScheme = LinkColorPalette

export const linkRecipe = defineRecipe({
  base: {
    // v3 default `base` already sets `display: inline-flex`, `alignItems:
    // center`, `gap: 1.5`, `cursor: pointer`, and `focusRing: outside`. We
    // inherit those and only override what diverges from v1.
    outlineOffset: 0,
    height: 'fit-content',
    width: 'fit-content',
    position: 'relative',
    textUnderlineOffset: '0.125rem',
    // v1 had no flex gap; the external-icon spacing came from the icon's own
    // `ml="0.25rem"`. v3 default's `gap: 1.5` adds an extra 6px between icon
    // and text — reset to 0 so the icon spacing matches v1.
    gap: 0,
    // v3 default uses `borderRadius: 'l1'` (link-specific layer radius). v1 used
    // `'base'`, which dropped in v3; `'sm'` is the matching hex (= 4px).
    borderRadius: 'sm',
    color: 'colorPalette.linkDefault',
    _hover: {
      color: 'colorPalette.linkHover',
      _disabled: { color: 'interaction.support.disabled-content' },
    },
    _disabled: {
      color: 'interaction.support.disabled-content',
      cursor: 'not-allowed',
    },
    // Replace v3 default `focusRing: outside` with v1's explicit outline so the
    // focus ring uses our `utility.focus-default` token, matches the 2px width
    // v1 shipped, and sits at `outlineOffset: 0` (flush with the radius).
    _focusVisible: {
      boxShadow: 'none',
      outline: '2px solid var(--chakra-colors-utility-focus-default)',
      outlineOffset: 0,
    },
  },
  variants: {
    variant: {
      // v1's `inline` had `textDecorationLine: 'underline'` always-on. Match
      // v1 exactly — design team preference, verified via drift audit against
      // the main baseline. Inline links inherit all typography from the
      // surrounding text (font-size, font-weight, line-height, letter-spacing,
      // family); the `size` prop has no effect when `variant === 'inline'`
      // (see compoundVariants below).
      inline: {
        textDecorationLine: 'underline',
      },
      // `standalone` reads as a button-like control — no underline, with a
      // small padding to give the focus ring breathing room. v1 baseline
      // confirms `text-decoration-line: none` (drift audit, May 2026).
      standalone: {
        p: '0.25rem',
      },
    },
    // Size affects standalone links only; inline links inherit from context
    // (overridden in the compoundVariants block below). v3 default Link
    // recipe does NOT define `size` variants, so there are no collisions to
    // redeclare per audit § 8 #14.
    size: {
      xs: { textStyle: 'caption-1' },
      sm: { textStyle: 'subhead-2' },
      md: { textStyle: 'subhead-1' },
    },
  },
  // v1's `inline` variant inherited the surrounding paragraph's typography
  // entirely. The size variant above sets `textStyle` which would apply to
  // inline links too, so explicitly reset every font property to `inherit`
  // when variant === 'inline'. Standalone keeps the full textStyle.
  compoundVariants: [
    {
      variant: 'inline',
      css: {
        font: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        fontFamily: 'inherit',
        lineHeight: 'inherit',
        letterSpacing: 'inherit',
      },
    },
  ],
  defaultVariants: {
    variant: 'inline',
    size: 'md',
    // No `colorPalette` default — applied at the wrapper level (audit § 8 #2).
  },
})
