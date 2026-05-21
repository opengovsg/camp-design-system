import { defineSlotRecipe } from '@chakra-ui/react'

export const menuSlotRecipe = defineSlotRecipe({
  slots: ['content', 'item', 'separator'],
  base: {
    content: {
      mt: '0.5rem',
      border: 'none',
      borderRadius: 0,
      minWidth: '0rem',
      bg: 'utility.ui',
      boxShadow: 'sm',
      py: 0,
    },
    item: {
      bg: 'utility.ui',
      color: 'base.content.strong',
      textStyle: 'body-1',
      fontWeight: 400,
      cursor: 'pointer',
      _hover: {
        bg: 'interaction.muted.main.hover',
      },
      _focus: {
        bg: 'interaction.muted.main.hover',
      },
      _focusVisible: {
        boxShadow: '0 0 0 2px var(--chakra-colors-utility-focus-default)',
      },
      _active: {
        bg: 'interaction.muted.main.active',
      },
      '&[data-disabled]': {
        color: 'interaction.support.disabled-content',
        opacity: 1,
        cursor: 'not-allowed',
        _hover: { bg: 'utility.ui' },
        _focus: { bg: 'utility.ui' },
      },
    },
    separator: {
      borderColor: 'base.divider.medium',
      opacity: 1,
      my: 0,
    },
  },
  variants: {
    size: {
      sm: {
        item: {
          textStyle: 'subhead-2',
          padding: '0.625rem 0.75rem',
        },
      },
      md: {
        item: {
          textStyle: 'body-1',
          padding: '0.75rem 1rem',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
