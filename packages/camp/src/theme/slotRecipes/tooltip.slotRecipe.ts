import { defineSlotRecipe } from '@chakra-ui/react'

export const tooltipSlotRecipe = defineSlotRecipe({
  slots: ['trigger', 'arrow', 'arrowTip', 'positioner', 'content'],
  base: {
    content: {
      bg: 'base.canvas.inverse',
      color: 'base.content.inverse',
      px: '0.75rem',
      py: '0.5rem',
      borderRadius: 'sm',
      textAlign: 'left',
      margin: '0.25rem',
      maxWidth: '19.5rem',
      textStyle: 'body-2',
      boxShadow: 'md',
      zIndex: 'tooltip',
    },
    arrow: {
      '--arrow-background': 'colors.base.canvas.inverse',
    },
    arrowTip: {
      borderColor: 'base.canvas.inverse',
    },
  },
})
