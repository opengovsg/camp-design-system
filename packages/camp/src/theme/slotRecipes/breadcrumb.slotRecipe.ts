import { defineSlotRecipe } from '@chakra-ui/react'

export type BreadcrumbColorPalette = 'main' | 'sub' | 'neutral'

/** @deprecated Renamed to `BreadcrumbColorPalette`. */
export type ThemeBreadcrumbColorScheme = BreadcrumbColorPalette

export const breadcrumbSlotRecipe = defineSlotRecipe({
  slots: [
    'root',
    'list',
    'item',
    'link',
    'currentLink',
    'separator',
    'ellipsis',
  ],
  base: {
    link: {
      transitionProperty: 'common',
      transitionDuration: 'fast',
      transitionTimingFunction: 'ease-out',
      outline: 'none',
      color: 'base.content.default',
      textDecoration: 'none',
      borderRadius: 'sm',
      "&:not([data-current='page'])": {
        cursor: 'pointer',
        _hover: {
          textDecoration: 'underline',
        },
        outlineOffset: '0.25rem',
        _focusVisible: {
          boxShadow: 'none',
          outline: '2px solid var(--chakra-colors-utility-focus-default)',
          outlineOffset: '0.25rem',
        },
      },
    },
    currentLink: {
      color: 'base.content.default',
    },
    separator: {
      color: 'interaction.support.disabled-content',
    },
  },
  variants: {
    size: {
      xs: {
        list: { textStyle: 'caption-1' },
        separator: { textStyle: 'caption-1' },
      },
      sm: {
        list: { textStyle: 'subhead-2' },
        separator: { textStyle: 'subhead-2' },
      },
      md: {
        list: { textStyle: 'subhead-1' },
        separator: { textStyle: 'subhead-1' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
