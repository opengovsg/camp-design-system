import { defineRecipe } from '@chakra-ui/react'

export type LinkColorPalette =
  | 'main'
  | 'sub'
  | 'critical'
  | 'warning'
  | 'success'
  | 'neutral'
  | 'inverse'

/** @deprecated Renamed to `LinkColorPalette`. */
export type ThemeLinkColorScheme = LinkColorPalette

export const linkRecipe = defineRecipe({
  base: {
    outlineOffset: 0,
    height: 'fit-content',
    width: 'fit-content',
    position: 'relative',
    textUnderlineOffset: '0.125rem',
    gap: 0,
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
    _focusVisible: {
      boxShadow: 'none',
      outline: '2px solid var(--chakra-colors-utility-focus-default)',
      outlineOffset: 0,
    },
  },
  variants: {
    variant: {
      inline: {
        textDecorationLine: 'underline',
      },
      // Standalone reads as a button-like control. Padding gives the focus
      // ring breathing room.
      standalone: {
        p: '0.25rem',
      },
    },
    // `size` applies to standalone only; inline links inherit typography
    // from the surrounding text (see compoundVariants).
    size: {
      xs: { textStyle: 'caption-1' },
      sm: { textStyle: 'subhead-2' },
      md: { textStyle: 'subhead-1' },
    },
  },
  compoundVariants: [
    // Inline links inherit all typography from the surrounding text so they
    // flow with body copy regardless of the `size` prop.
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
  },
})
