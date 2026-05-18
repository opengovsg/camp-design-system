import { defineRecipe } from '@chakra-ui/react'

export const textareaRecipe = defineRecipe({
  base: {
    borderRadius: 'sm',
    bg: 'utility.ui',
    border: '1px solid',
    borderColor: 'base.divider.strong',
    minW: 0,
    transitionProperty: 'common',
    transitionDuration: 'normal',
    _placeholder: { color: 'interaction.support.placeholder' },
    _hover: { borderColor: 'base.divider.strong' },
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
    '&[data-prefilled]': { bg: 'utility.input-prefilled' },
    '&[data-success]': {
      borderColor: 'interaction.success.default',
      _hover: { borderColor: 'interaction.success.default' },
    },
  },
  variants: {
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
        py: '0.5rem',
      },
      sm: {
        textStyle: 'body-2',
        px: '0.75rem',
        py: '0.625rem',
      },
      md: {
        textStyle: 'body-1',
        px: '1rem',
        py: '0.625rem',
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
})
