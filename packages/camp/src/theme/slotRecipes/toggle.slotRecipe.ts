import { defineSlotRecipe } from '@chakra-ui/react'

export const toggleSlotRecipe = defineSlotRecipe({
  slots: ['overallContainer', 'label', 'description'],
  base: {
    overallContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    label: {
      textStyle: 'subhead-1',
      color: 'base.content.strong',
      mr: '1rem',
      mb: 0,
    },
    description: {
      textStyle: 'body-2',
      color: 'base.content.default',
    },
  },
  defaultVariants: {},
})
