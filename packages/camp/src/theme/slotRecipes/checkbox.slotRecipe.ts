import { defineSlotRecipe } from '@chakra-ui/react'

export const checkboxSlotRecipe = defineSlotRecipe({
  slots: [
    'root',
    'label',
    'control',
    'indicator',
    'othersContainer',
    'othersCheckbox',
    'othersInput',
  ],
  base: {
    root: {
      width: '100%',
      cursor: 'pointer',
      gap: 0,
      _hover: {
        bg: 'interaction.muted.main.hover',
        _disabled: { bg: 'transparent' },
      },
      _focusWithin: {
        outline: '2px solid var(--chakra-colors-utility-focus-default)',
        outlineOffset: 0,
      },
    },
    control: {
      bg: 'utility.ui',
      borderRadius: 'sm',
      border: '2px solid',
      borderColor: 'interaction.main.default',
      alignSelf: 'start',
      _checked: {
        bg: 'interaction.main.default',
        borderColor: 'interaction.main.default',
      },
      _indeterminate: {
        bg: 'interaction.main.default',
        borderColor: 'interaction.main.default',
      },
      _focus: { boxShadow: 'none' },
      _disabled: {
        borderColor: 'interaction.support.disabled-content',
        _checked: {
          borderColor: 'interaction.support.disabled-content',
          bg: 'interaction.support.disabled-content',
        },
      },
    },
    label: {
      color: 'base.content.default',
      _disabled: {
        color: 'interaction.support.disabled-content',
        opacity: 1,
      },
    },
    indicator: {
      color: 'white',
    },
    othersContainer: {
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      _hover: {
        bg: 'interaction.muted.main.hover',
        _disabled: { bg: 'transparent' },
      },
      _focusWithin: {
        outline: '2px solid var(--chakra-colors-utility-focus-default)',
        outlineOffset: 0,
      },
    },
    othersCheckbox: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      _focusWithin: { boxShadow: 'none' },
      _hover: { bg: 'transparent' },
    },
  },
  variants: {
    size: {
      xs: {
        control: {
          width: '1rem',
          height: '1rem',
          mt: '0.125rem',
        },
        indicator: { fontSize: '0.5rem' },
        label: { ml: '0.75rem', textStyle: 'body-2' },
        root: { px: '0.25rem', py: '0.5rem' },
        othersContainer: { px: '0.25rem', py: '0.5rem' },
        othersInput: {
          ml: '1.75rem',
          mt: '0.5rem',
          w: 'calc(100% - 1.75rem)',
        },
      },
      sm: {
        control: {
          width: '1.25rem',
          height: '1.25rem',
        },
        indicator: { fontSize: '0.75rem' },
        label: { ml: '0.75rem', textStyle: 'body-2' },
        root: { px: '0.25rem', py: '0.625rem' },
        othersContainer: { px: '0.25rem', py: '0.625rem' },
        othersInput: {
          ml: '2.25rem',
          mt: '0.625rem',
          w: 'calc(100% - 2.25rem)',
        },
      },
      md: {
        control: {
          width: '1.5rem',
          height: '1.5rem',
        },
        indicator: { fontSize: '1rem' },
        label: { ml: '1rem', textStyle: 'body-1' },
        root: { px: '0.25rem', py: '0.625rem' },
        othersContainer: { px: '0.25rem', py: '0.625rem' },
        othersInput: {
          ml: '2.625rem',
          mt: '0.625rem',
          w: 'calc(100% - 2.625rem)',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
