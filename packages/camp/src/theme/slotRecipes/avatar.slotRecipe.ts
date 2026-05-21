import { defineSlotRecipe } from '@chakra-ui/react'

export type AvatarColorPalette =
  | 'main'
  | 'sub'
  | 'critical'
  | 'warning'
  | 'success'

/** @deprecated Renamed to `AvatarColorPalette`. */
export type ThemeAvatarColorScheme = AvatarColorPalette

export const avatarSlotRecipe = defineSlotRecipe({
  slots: ['root', 'image', 'fallback'],
  base: {
    root: {
      // `text-transform` and `text-align` inherit to the fallback slot so
      // fallback initials render as centred uppercase.
      textTransform: 'uppercase',
      textAlign: 'center',
      // Standalone avatars still want the white separator outline; Chakra
      // only applies this on `&[data-group-item]` by default.
      borderColor: 'white',
    },
    fallback: {
      fontWeight: 'medium',
    },
  },
  variants: {
    size: {
      // Each size redeclares `--avatar-size` + `textStyle` to beat the
      // CSS variables set by Chakra's default size variants.
      '2xs': {
        root: {
          '--avatar-size': '1.25rem',
          textStyle: 'legal',
        },
      },
      xs: {
        root: {
          '--avatar-size': '2rem',
          textStyle: 'caption-1',
        },
      },
      sm: {
        root: {
          '--avatar-size': '2.25rem',
          textStyle: 'caption-1',
        },
      },
      md: {
        root: {
          '--avatar-size': '2.5rem',
          textStyle: 'subhead-2',
        },
      },
      lg: {
        root: {
          '--avatar-size': '4rem',
          textStyle: 'subhead-1',
        },
      },
      xl: {
        root: {
          '--avatar-size': '6rem',
          textStyle: 'h5',
        },
      },
      '2xl': {
        root: {
          '--avatar-size': '8rem',
          textStyle: 'h4',
        },
      },
    },
    variant: {
      solid: {
        root: {
          bg: 'colorPalette.solid',
          color: 'colorPalette.fg',
        },
      },
      subtle: {
        root: {
          bg: 'colorPalette.subtleBg',
          color: 'colorPalette.subtleFg',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'solid',
  },
})
