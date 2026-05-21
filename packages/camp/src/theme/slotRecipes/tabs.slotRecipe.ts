import { defineSlotRecipe } from '@chakra-ui/react'

export const tabsSlotRecipe = defineSlotRecipe({
  slots: ['root', 'list', 'trigger', 'content', 'indicator'],
  base: {
    list: {
      overflowX: 'auto',
      overflowY: 'initial',
      whiteSpace: 'nowrap',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        width: 0,
        height: 0,
      },
    },
    trigger: {
      color: 'interaction.support.unselected',
      borderBottom: '2px solid transparent',
      marginBottom: '-2px',
      _selected: {
        color: 'interaction.main.default',
        borderColor: 'interaction.main.default',
      },
      _hover: {
        color: 'interaction.main.hover',
      },
      _focusVisible: {
        outline: '2px solid var(--chakra-colors-utility-focus-default)',
        outlineOffset: 0,
      },
    },
    content: {
      p: 'initial',
    },
  },
  variants: {
    orientation: {
      vertical: {
        list: {
          overflowX: 'initial',
          overflowY: 'auto',
        },
        trigger: {
          borderBottom: 'none',
          borderInlineStart: '2px solid transparent',
          marginInlineStart: '-2px',
          marginBottom: 0,
          _hover: {
            bg: 'interaction.muted.main.hover',
            color: 'interaction.main.hover',
          },
          _selected: {
            borderInlineStartColor: 'interaction.main.default',
          },
        },
      },
    },
    size: {
      sm: {
        list: { gap: '2rem' },
        trigger: {
          px: 0,
          py: '0.25rem',
          textStyle: 'body-2',
        },
      },
      md: {
        list: { gap: '2rem' },
        trigger: {
          px: 0,
          py: '0.25rem',
          mx: '0.25rem',
          textStyle: 'subhead-3',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
