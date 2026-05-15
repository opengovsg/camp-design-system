import { defineSlotRecipe } from '@chakra-ui/react'

export type BannerVariant = 'info' | 'warn' | 'error'

export const bannerSlotRecipe = defineSlotRecipe({
  slots: ['banner', 'item', 'icon', 'link', 'close'],
  base: {
    item: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  variants: {
    variant: {
      info: {
        banner: {
          color: 'base.content.inverse',
          bg: 'utility.feedback.info',
        },
        link: {
          color: 'base.content.inverse',
          _hover: { color: 'base.content.inverse' },
        },
        close: {
          color: 'base.content.inverse',
        },
      },
      warn: {
        banner: {
          color: 'base.content.strong',
          bg: 'utility.feedback.warning',
        },
        link: {
          color: 'base.content.strong',
          _hover: { color: 'base.content.strong' },
        },
        close: {
          color: 'base.content.strong',
        },
      },
      error: {
        banner: {
          color: 'base.content.inverse',
          bg: 'utility.feedback.critical',
        },
        link: {
          color: 'base.content.inverse',
          _hover: { color: 'base.content.inverse' },
        },
        close: {
          color: 'base.content.inverse',
        },
      },
    },
    size: {
      sm: {
        item: {
          py: '0.5rem',
          px: '0.75rem',
          textStyle: 'body-2',
        },
        icon: {
          my: '0.125rem',
          fontSize: '1rem',
          mr: '0.5rem',
        },
        close: {
          my: '-0.5rem',
          ml: '0.5rem',
          mr: '-0.5rem',
          fontSize: '1rem',
          w: '2.25rem',
          h: '2.25rem',
        },
      },
      md: {
        item: {
          py: '0.5rem',
          px: '1rem',
          textStyle: 'body-1',
        },
        icon: {
          fontSize: '1.5rem',
          mr: '0.5rem',
        },
        close: {
          ml: '0.5rem',
          mr: '-0.5rem',
          my: '-0.375rem',
          fontSize: '1.5rem',
          w: '2.25rem',
          h: '2.25rem',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'info',
    size: 'md',
  },
})
