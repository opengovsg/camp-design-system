import { defineSlotRecipe } from '@chakra-ui/react'

export const drawerSlotRecipe = defineSlotRecipe({
  slots: ['backdrop', 'positioner', 'content', 'header', 'body', 'footer'],
  base: {
    backdrop: {
      bg: 'rgba(0, 0, 0, 0.65)',
    },
  },
})
