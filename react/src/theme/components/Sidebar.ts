import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { anatomy } from '@chakra-ui/theme-tools'

import { layerStyles } from '../layerStyles'

const parts = anatomy('sidebar').parts(
  'item',
  'list',
  'label',
  'nest',
  'section',
  'parent',
  'child',
  'icon',
)

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  child: {
    borderRadius: 0,
    borderLeftWidth: '1px',
    borderColor: 'base.divider.medium',
    _active: {
      ml: '-1px',
      borderLeftWidth: '2px',
      color: 'interaction.main.default',
      borderColor: 'base.divider.brand',
    },
  },
  parent: {
    _hover: {
      bg: 'interaction.muted.main.hover',
    },
    _active: {
      bg: 'interaction.muted.main.active',
      color: 'interaction.main.default',
    },
    _expanded: {
      bg: 'interaction.muted.main.active',
      color: 'interaction.main.default',
    },
    borderRadius: 'md',
  },
  label: {
    display: 'flex',
    alignItems: 'start',
  },
  item: {
    display: 'flex',
    alignItems: 'start',
    listStyleType: 'none',
    color: 'base.content.default',
    _hover: {
      color: 'interaction.main.default',
    },
    _focusVisible: {
      ...layerStyles.focusRing.default._focusVisible,
      outlineOffset: '-2px',
    },
  },
  list: {
    listStyleType: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
  nest: {
    listStyleType: 'none',
  },
})

const sizes = {
  sm: definePartsStyle({
    section: {
      textStyle: 'subhead-2',
    },
    list: {
      paddingInlineStart: '0.75rem',
    },
    nest: {
      paddingInlineStart: '1.75rem',
    },
    label: {
      gap: '0.5rem',
    },
    item: {
      textStyle: 'subhead-2',
      py: '0.75rem',
      px: '1rem',
    },
    child: {
      px: '1.5rem',
    },
    icon: {
      cursor: 'pointer',
      fontSize: '1.25rem',
    },
  }),
  md: definePartsStyle({
    section: {
      textStyle: 'subhead-1',
    },
    list: {
      paddingInlineStart: '0.75rem',
    },
    nest: {
      paddingInlineStart: '1.75rem',
    },
    label: {
      gap: '0.5rem',
    },
    item: {
      textStyle: 'subhead-1',
      py: '1rem',
      px: '1rem',
    },
    child: {
      px: '1.5rem',
    },
    icon: {
      cursor: 'pointer',
      fontSize: '1.5rem',
    },
  }),
}

export const Sidebar = defineMultiStyleConfig({
  baseStyle,
  sizes,
  defaultProps: {
    size: 'md',
  },
})
