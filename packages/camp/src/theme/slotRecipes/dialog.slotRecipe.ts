import { defineSlotRecipe } from '@chakra-ui/react'

export const dialogSlotRecipe = defineSlotRecipe({
  slots: [
    'backdrop',
    'positioner',
    'content',
    'header',
    'body',
    'footer',
    'title',
    'description',
    'closeTrigger',
  ],
  base: {
    backdrop: {
      bg: 'rgba(0, 0, 0, 0.65)',
    },
    content: {
      borderRadius: 'sm',
      my: '8rem',
      boxShadow: 'md',
      bg: 'utility.ui',
    },
  },
  variants: {
    size: {
      mobile: {
        content: {
          maxW: '100vw',
          minH: '100vh',
          my: 0,
          borderRadius: 0,
        },
        header: {
          pt: '2rem',
          pb: '1.5rem',
          px: '1.5rem',
          textStyle: 'h5',
        },
        body: { flex: 'initial' },
        closeTrigger: {
          top: '1.5rem',
          insetEnd: '1.5rem',
        },
      },
      md: {
        content: { maxW: '42.5rem' },
        header: {
          textStyle: 'h4',
          pt: '2rem',
          pb: '1rem',
          px: '2rem',
        },
        closeTrigger: {
          top: '1.5rem',
          insetEnd: '2rem',
        },
        body: {
          py: 0,
          px: '2rem',
        },
        footer: {
          pt: '2rem',
          pb: '2.75rem',
          px: '2rem',
        },
      },
      full: {
        backdrop: { bg: 'transparent' },
        content: {
          maxW: '100vw',
          minH: '100vh',
          my: 0,
          borderRadius: 0,
        },
        header: {
          textStyle: 'h4',
          p: '1.5rem',
        },
        closeTrigger: {
          top: '1.5rem',
          insetEnd: '1.5rem',
        },
      },
    },
  },
})
