import { defineSlotRecipe } from '@chakra-ui/react'

export type InfoboxVariant = 'info' | 'warning' | 'error' | 'success'

export const infoboxSlotRecipe = defineSlotRecipe({
  slots: ['messagebox', 'icon'],
  base: {
    messagebox: {
      display: 'flex',
      justifyContent: 'start',
      color: 'base.content.strong',
    },
  },
  variants: {
    variant: {
      info: {
        messagebox: { bg: 'utility.feedback.info-subtle' },
        icon: { color: 'utility.feedback.info' },
      },
      warning: {
        messagebox: { bg: 'utility.feedback.warning-subtle' },
        icon: { color: 'utility.feedback.warning' },
      },
      error: {
        messagebox: { bg: 'utility.feedback.critical-subtle' },
        icon: { color: 'utility.feedback.critical' },
      },
      success: {
        messagebox: { bg: 'utility.feedback.success-subtle' },
        icon: { color: 'utility.feedback.success' },
      },
    },
    size: {
      sm: {
        messagebox: {
          p: '0.625rem',
          textStyle: 'body-2',
        },
        icon: {
          my: '0.125rem',
          fontSize: '1rem',
          mr: '0.5rem',
        },
      },
      md: {
        messagebox: {
          padding: '1rem',
          textStyle: 'body-1',
        },
        icon: {
          fontSize: '1.5rem',
          mr: '0.5rem',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'info',
    size: 'md',
  },
})
