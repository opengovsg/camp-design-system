import { defineRecipe } from '@chakra-ui/react'

export type ButtonColorPalette =
  | 'main'
  | 'success'
  | 'critical'
  | 'warning'
  | 'sub'
  | 'neutral'
  | 'inverse'

/**
 * @deprecated Renamed to `ButtonColorPalette`. Will be removed in v3.
 */
export type ThemeButtonColorScheme = ButtonColorPalette

export const buttonRecipe = defineRecipe({
  className: 'ogp-button',
  base: {
    textStyle: 'subhead-1',
    whiteSpace: 'pre-wrap',
    borderRadius: 'base',
    border: '1px solid',
    flexShrink: 0,
    px: '15px',
    py: '9px',
    _disabled: {
      bg: 'interaction.support.disabled',
      borderColor: 'interaction.support.disabled',
      opacity: 1,
      color: 'interaction.support.disabled-content',
    },
    _focusVisible: {
      boxShadow: '0 0 0 2px var(--chakra-colors-utility-focus-default)',
      outline: 'none',
    },
  },
  variants: {
    variant: {
      solid: {
        bg: 'colorPalette.solid',
        borderColor: 'colorPalette.solid',
        color: 'colorPalette.fg',
        _hover: {
          bg: 'colorPalette.solidHover',
          borderColor: 'colorPalette.solidHover',
          _disabled: {
            bg: 'interaction.support.disabled',
            borderColor: 'interaction.support.disabled',
          },
        },
        _active: {
          bg: 'colorPalette.solidActive',
          borderColor: 'colorPalette.solidActive',
        },
      },
      reverse: {
        bg: 'utility.ui',
        borderColor: 'transparent',
        color: 'colorPalette.reverseFg',
        _disabled: { bg: 'utility.ui', borderColor: 'transparent' },
        _hover: {
          bg: 'colorPalette.reverseHover',
          _disabled: { bg: 'utility.ui' },
        },
        _active: { bg: 'colorPalette.reverseActive' },
      },
      outline: {
        bg: 'transparent',
        borderColor: 'colorPalette.outlineBorder',
        color: 'colorPalette.outlineBorder',
        _disabled: {
          borderColor: 'interaction.support.disabled-content',
          bg: 'transparent',
        },
        _hover: {
          bg: 'colorPalette.outlineHover',
          _disabled: {
            borderColor: 'interaction.support.disabled-content',
            bg: 'transparent',
          },
        },
        _active: { bg: 'colorPalette.outlineActive' },
      },
      clear: {
        bg: 'transparent',
        borderColor: 'transparent',
        color: 'colorPalette.outlineBorder',
        _disabled: { bg: 'transparent', borderColor: 'transparent' },
        _hover: { bg: 'colorPalette.outlineHover' },
        _active: { bg: 'colorPalette.outlineActive' },
      },
      link: {
        border: 'none',
        minHeight: 'auto',
        fontWeight: 'normal',
        w: 'fit-content',
        textDecoration: 'underline',
        bg: 'transparent',
        color: 'colorPalette.outlineBorder',
        _disabled: { bg: 'transparent' },
      },
      inputAttached: {
        bg: 'utility.ui',
        color: 'interaction.support.disabled-content',
        borderColor: 'base.divider.strong',
        borderStartRadius: 0,
        borderEndRadius: 'sm',
        _hover: {
          bg: 'interaction.muted.main.hover',
          _disabled: { bg: 'interaction.support.disabled' },
        },
        _focus: {
          zIndex: 1,
          borderColor: 'utility.focus-default',
          boxShadow: '0 0 0 1px var(--chakra-colors-utility-focus-default)',
        },
        _disabled: {
          bg: 'interaction.support.disabled',
          borderColor: 'base.divider.strong',
          color: 'interaction.support.disabled-content',
        },
      },
    },
    size: {
      xs: { textStyle: 'subhead-2', minH: '2.25rem', minW: '2.25rem' },
      sm: { textStyle: 'subhead-1', minH: '2.5rem', minW: '2.5rem' },
      md: { textStyle: 'subhead-1', minH: '2.75rem', minW: '2.75rem' },
      lg: { textStyle: 'subhead-1', minH: '3rem', minW: '3rem' },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
})
