import { defineRecipe } from '@chakra-ui/react'

export type BadgeColorPalette =
  | 'main'
  | 'sub'
  | 'info'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'critical'

/** @deprecated Renamed to `BadgeColorPalette`. */
export type ThemeBadgeColorScheme = BadgeColorPalette

export const badgeRecipe = defineRecipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    textTransform: 'initial',
    borderRadius: 'sm',
    gap: '0.25rem',
  },
  variants: {
    // `size` declared before `variant` so `variant.clear` wins over
    // `size.sm`'s textStyle in CSS cascade order.
    size: {
      xs: {
        textStyle: 'legal',
        px: '0.5rem',
        py: '0.25rem',
      },
      sm: {
        textStyle: 'caption-1',
        px: '0.5rem',
        py: '0.25rem',
      },
    },
    variant: {
      solid: {
        bg: 'colorPalette.solid',
        color: 'colorPalette.fg',
      },
      subtle: {
        bg: 'colorPalette.subtleBg',
        color: 'colorPalette.subtleFg',
      },
      clear: {
        bg: 'transparent',
        color: 'base.content.default',
        _icon: {
          color: 'colorPalette.solid',
        },
      },
    },
  },
  compoundVariants: [
    // Subtle warning needs darker text for legibility against the
    // pale-yellow background.
    {
      variant: 'subtle',
      colorPalette: 'warning',
      css: {
        color: 'yellow.700',
      },
    },
    {
      variant: 'clear',
      size: 'sm',
      css: {
        textStyle: 'body-2',
        fontWeight: 'normal',
      },
    },
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'sm',
  },
})
