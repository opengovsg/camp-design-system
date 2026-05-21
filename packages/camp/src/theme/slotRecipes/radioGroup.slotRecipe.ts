import { defineSlotRecipe } from '@chakra-ui/react'

export const radioGroupSlotRecipe = defineSlotRecipe({
  slots: [
    'root',
    'label',
    'item',
    'itemText',
    'itemControl',
    'itemIndicator',
    'othersContainer',
    'othersInput',
  ],
  base: {
    item: {
      width: '100%',
      color: 'base.content.strong',
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
    itemControl: {
      bg: 'utility.ui',
      border: '2px solid',
      borderColor: 'interaction.main.default',
      borderRadius: 'full',
      alignSelf: 'start',
      _checked: {
        bg: 'utility.ui',
        borderColor: 'interaction.main.default',
        color: 'interaction.main.default',
      },
      _focus: { boxShadow: 'none' },
      _disabled: {
        cursor: 'not-allowed',
        borderColor: 'interaction.support.disabled-content',
        bg: 'utility.ui',
        _checked: {
          bg: 'utility.ui',
          borderColor: 'interaction.support.disabled-content',
          color: 'interaction.support.disabled-content',
        },
      },
    },
    itemIndicator: {
      bg: 'currentColor',
      borderRadius: 'full',
      transition: 'transform ease 200ms',
    },
    itemText: {
      _disabled: {
        color: 'interaction.support.disabled-content',
        opacity: 1,
      },
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
  },
  variants: {
    size: {
      xs: {
        itemControl: { width: '1rem', height: '1rem' },
        itemIndicator: { width: '0.625rem', height: '0.625rem' },
        itemText: { ml: '0.75rem', textStyle: 'body-2' },
        item: { px: '0.25rem', py: '0.5rem' },
        othersContainer: { px: '0.25rem', py: '0.5rem' },
        othersInput: {
          ml: '1.75rem',
          mt: '0.5rem',
          w: 'calc(100% - 1.75rem)',
        },
      },
      sm: {
        itemControl: { width: '1.25rem', height: '1.25rem' },
        itemIndicator: { width: '0.75rem', height: '0.75rem' },
        itemText: { ml: '0.75rem', textStyle: 'body-2' },
        item: { px: '0.25rem', py: '0.625rem' },
        othersContainer: { px: '0.25rem', py: '0.625rem' },
        othersInput: {
          ml: '2.25rem',
          mt: '0.625rem',
          w: 'calc(100% - 2.25rem)',
        },
      },
      md: {
        itemControl: { width: '1.5rem', height: '1.5rem' },
        itemIndicator: { width: '1rem', height: '1rem' },
        itemText: { ml: '1rem', textStyle: 'body-1' },
        item: { px: '0.25rem', py: '0.625rem' },
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
