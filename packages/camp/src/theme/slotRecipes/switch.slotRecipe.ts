import { defineSlotRecipe } from '@chakra-ui/react'

export type SwitchColorPalette =
  | 'main'
  | 'sub'
  | 'info'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'critical'

/** @deprecated Renamed to `SwitchColorPalette`. */
export type ThemeSwitchColorScheme = SwitchColorPalette

export const switchSlotRecipe = defineSlotRecipe({
  slots: ['root', 'label', 'control', 'thumb', 'indicator'],
  base: {
    root: {
      display: 'inline-flex',
      gap: '0.5rem',
      alignItems: 'center',
      verticalAlign: 'middle',
    },
    label: {
      userSelect: 'none',
      lineHeight: 'normal',
    },
    control: {
      // v1 used `interaction.support.unselected` for the off state and a
      // colorPalette token for the on state.
      bg: 'interaction.support.unselected',
      borderRadius: 'full',
      cursor: 'pointer',
      padding: 0,
      _checked: {
        bg: 'colorPalette.solid',
      },
      _disabled: {
        bg: 'interaction.support.disabled',
        opacity: 1,
        cursor: 'not-allowed',
      },
      _focusVisible: {
        outline: '2px solid var(--chakra-colors-utility-focus-default)',
        outlineOffset: '2px',
      },
    },
    thumb: {
      bg: 'white',
      borderRadius: 'full',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transitionProperty: 'translate',
      transitionDuration: 'fast',
    },
  },
  variants: {
    size: {
      sm: {
        control: {
          width: '2rem',
          height: '1.25rem',
        },
        thumb: {
          width: '1.125rem',
          height: '1.125rem',
          margin: '1px',
        },
        indicator: {
          fontSize: '0.75rem',
        },
      },
      md: {
        control: {
          width: '2.5rem',
          height: '1.5rem',
        },
        thumb: {
          width: '1.375rem',
          height: '1.375rem',
          margin: '1px',
        },
        indicator: {
          fontSize: '1rem',
        },
      },
      lg: {
        control: {
          width: '3rem',
          height: '1.75rem',
        },
        thumb: {
          width: '1.625rem',
          height: '1.625rem',
          margin: '1px',
        },
        indicator: {
          fontSize: '1.25rem',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
