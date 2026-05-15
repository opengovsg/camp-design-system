import { defineLayerStyles } from '@chakra-ui/react'

export const layerStyles = defineLayerStyles({
  'focusRing-default': {
    value: {
      _focusVisible: {
        boxShadow: 'none',
        outline: '2px solid var(--chakra-colors-utility-focus-default)',
        outlineOffset: '0.125rem',
      },
    },
  },
  'focusRing-inverse': {
    value: {
      _focusVisible: {
        boxShadow: 'none',
        outline: '2px solid var(--chakra-colors-utility-focus-inverse)',
        outlineOffset: '0.125rem',
      },
    },
  },
})
