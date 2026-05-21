import { defineSlotRecipe } from '@chakra-ui/react'

export type TagColorPalette =
  | 'main'
  | 'sub'
  | 'info'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'critical'

/** @deprecated Renamed to `TagColorPalette`. */
export type ThemeTagColorScheme = TagColorPalette

export const tagSlotRecipe = defineSlotRecipe({
  slots: ['root', 'label', 'closeTrigger', 'startElement', 'endElement'],
  base: {
    root: {
      borderRadius: 'sm',
      transitionProperty: 'common',
      transitionDuration: 'normal',
      width: 'fit-content',
      height: 'fit-content',
      // Support both `aria-disabled` and `data-disabled` so consumers can use
      // either idiom on `<Tag.Root>`.
      "&[aria-disabled='true'], &[data-disabled]": {
        bg: 'interaction.support.disabled',
        color: 'interaction.support.disabled-content',
        cursor: 'not-allowed',
        _hover: { bg: 'interaction.support.disabled' },
      },
    },
    label: {
      whiteSpace: 'initial',
    },
    closeTrigger: {
      _focusVisible: {
        outline: '2px solid var(--chakra-colors-utility-focus-default)',
        outlineOffset: 0,
        boxShadow: 'none',
      },
    },
  },
  variants: {
    // `size` is declared before `variant` so `variant` wins in CSS cascade
    // order — needed for `variant.subtle` / `variant.solid` hover styles to
    // override any size-level defaults.
    size: {
      xs: {
        root: {
          textStyle: 'caption-1',
          px: '0.5rem',
          py: '0.125rem',
          gap: 0,
          minH: '1rem',
          minW: '1rem',
          '--tag-element-size': '1rem',
          '--tag-element-offset': '-0.125rem',
        },
        label: { textStyle: 'caption-1' },
        closeTrigger: { fontSize: '0.875rem', boxSize: '1rem' },
      },
      sm: {
        root: {
          textStyle: 'body-2',
          px: '0.5rem',
          py: '0.125rem',
          gap: 0,
          minH: '1.25rem',
          minW: '1.25rem',
          '--tag-element-size': '1.25rem',
          '--tag-element-offset': '-0.25rem',
        },
        label: { textStyle: 'body-2' },
        closeTrigger: { fontSize: '1.125rem', boxSize: '1.25rem' },
      },
      md: {
        root: {
          textStyle: 'subhead-2',
          px: '0.5rem',
          py: '0.25rem',
          gap: 0,
          minH: '1.5rem',
          minW: '1.5rem',
          '--tag-element-size': '1.25rem',
          '--tag-element-offset': '-0.25rem',
        },
        label: { textStyle: 'subhead-2' },
        closeTrigger: { fontSize: '1.125rem', boxSize: '1.25rem' },
      },
    },
    variant: {
      subtle: {
        root: {
          bg: 'colorPalette.subtleBg',
          color: 'colorPalette.subtleFg',
          _hover: { bg: 'colorPalette.subtleBgHover' },
          _active: { bg: 'colorPalette.subtleBgActive' },
        },
      },
      solid: {
        root: {
          bg: 'colorPalette.solid',
          color: 'colorPalette.fg',
          _hover: { bg: 'colorPalette.solidHover' },
          _active: { bg: 'colorPalette.solidActive' },
        },
      },
    },
  },
  compoundVariants: [
    // Subtle warning needs darker text for legibility against the
    // pale-yellow background.
    {
      variant: 'subtle',
      colorPalette: 'warning',
      css: {
        root: { color: 'yellow.700' },
      },
    },
  ],
  defaultVariants: {
    variant: 'subtle',
    size: 'md',
  },
})
