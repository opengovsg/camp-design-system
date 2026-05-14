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
      // v1's `inline` had `textDecorationLine: 'underline'` always-on. The
      // spec inverts this to underline-on-hover for the inline variant, which
      // is the new v3 design intent (text-flow links don't read as underlined
      // until interaction).
      inline: {
        textDecorationLine: 'none',
        _hover: { textDecorationLine: 'underline' },
      },
      // `standalone` is always underlined and gets a small padding to give the
      // focus ring breathing room.
      standalone: {
        textDecorationLine: 'underline',
        p: '0.25rem',
      },
    },
    // v3 default Link recipe does NOT define `size` variants, so there are no
    // collisions to redeclare per audit § 8 #14.
    size: {
      xs: { textStyle: 'caption-1' },
      sm: { textStyle: 'subhead-2' },
      md: { textStyle: 'subhead-1' },
    },
  },
  defaultVariants: {
    variant: 'inline',
    size: 'md',
    // No `colorPalette` default — applied at the wrapper level (audit § 8 #2).
  },
})
