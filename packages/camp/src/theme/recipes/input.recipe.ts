import { defineRecipe } from '@chakra-ui/react'

export const inputRecipe = defineRecipe({
  base: {
    borderRadius: 'sm',
    bg: 'utility.ui',
    border: '1px solid',
    borderColor: 'base.divider.strong',
    minW: 0,
    _placeholder: {
      color: 'interaction.support.placeholder',
    },
    _hover: {
      borderColor: 'base.divider.strong',
    },
    _invalid: {
      borderColor: 'interaction.critical.default',
      boxShadow: 'none',
    },
    _focusVisible: {
      zIndex: 1,
      borderColor: 'utility.focus-default',
      boxShadow: '0 0 0 1px var(--chakra-colors-utility-focus-default)',
    },
    _disabled: {
      bg: 'interaction.support.disabled',
      borderColor: 'base.divider.strong',
      color: 'interaction.support.disabled-content',
      cursor: 'not-allowed',
      opacity: 1,
    },
    '&[data-prefilled]': {
      bg: 'utility.input-prefilled',
    },
    '&[data-success]': {
      borderColor: 'interaction.success.default',
      _hover: { borderColor: 'interaction.success.default' },
    },
  },
  variants: {
    // Override v3 default `outline` variant — v3 sets `bg: transparent` and
    // `borderColor: border` (the semantic token). We want white bg and the
    // v1 divider.strong border.
    variant: {
      outline: {
        bg: 'utility.ui',
        borderColor: 'base.divider.strong',
      },
    },
    size: {
      xs: {
        textStyle: 'body-2',
        px: '0.75rem',
        h: '2.25rem',
      },
      sm: {
        textStyle: 'body-2',
        px: '0.75rem',
        h: '2.5rem',
      },
      md: {
        textStyle: 'body-1',
        px: '1rem',
        h: '2.75rem',
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
})
