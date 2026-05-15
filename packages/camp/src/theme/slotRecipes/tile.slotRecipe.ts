import { defineSlotRecipe } from '@chakra-ui/react'

export type TileVariant = 'simple' | 'complex'

export const tileSlotRecipe = defineSlotRecipe({
  slots: ['container', 'title', 'icon', 'subtitle', 'text'],
  base: {
    container: {
      transitionProperty: 'common',
      transitionDuration: 'normal',
      color: 'base.content.strong',
      borderRadius: 'sm',
      padding: '1.5rem',
      height: 'auto',
      // v1 Tile used `<Button variant="unstyled">` which carried these
      // properties through from Button base. Restore so tap target and
      // interaction affordances match.
      cursor: 'pointer',
      fontWeight: 'medium',
      letterSpacing: '-0.006em',
      minWidth: '2.75rem',
      minHeight: '2.75rem',
      display: 'inline-flex',
      _hover: {
        bg: 'interaction.muted.main.hover',
      },
      outline: 'none',
      _focusVisible: {
        boxShadow: '0 0 0 1px var(--chakra-colors-utility-focus-default)',
        borderColor: 'utility.focus-default',
        outline: 'none',
      },
      _active: {
        bg: 'interaction.muted.main.active',
        borderColor: 'utility.focus-default',
        boxShadow: '0 0 0 2px var(--chakra-colors-utility-focus-default)',
      },
      bg: 'utility.ui',
      border: '1px solid',
      borderColor: 'base.divider.medium',
      whiteSpace: 'pre-line',
      flexDirection: 'column',
      alignItems: 'flex-start',
      maxWidth: 'inherit',
      textAlign: 'left',
      alignSelf: 'stretch',
      justifyContent: 'stretch',
    },
    title: {
      color: 'base.content.strong',
      textStyle: 'h5',
      mt: '1rem',
    },
    icon: {
      boxSize: '2.5rem',
      color: 'base.content.strong',
    },
    subtitle: {
      color: 'base.content.medium',
      textStyle: 'body-2',
    },
    text: {
      color: 'base.content.default',
      textStyle: 'body-2',
      textAlign: 'left',
    },
  },
  variants: {
    variant: {
      complex: {
        title: { mb: 0 },
        subtitle: { mb: '1rem' },
      },
      simple: {
        title: { mb: '1rem' },
      },
    },
  },
  defaultVariants: {
    variant: 'simple',
  },
})
