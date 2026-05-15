import { defineRecipe } from '@chakra-ui/react'

export type ButtonColorPalette =
  | 'main'
  | 'success'
  | 'critical'
  | 'warning'
  | 'sub'
  | 'neutral'
  | 'inverse'

/** @deprecated Renamed to `ButtonColorPalette`. */
export type ThemeButtonColorScheme = ButtonColorPalette

export const buttonRecipe = defineRecipe({
  base: {
    textStyle: 'subhead-1',
    whiteSpace: 'pre-wrap',
    borderRadius: 'sm',
    borderWidth: '1px',
    borderStyle: 'solid',
    flexShrink: 0,
    px: '15px',
    py: '9px',
    _disabled: {
      bg: 'interaction.support.disabled',
      borderColor: 'interaction.support.disabled',
      opacity: 1,
      color: 'interaction.support.disabled-content',
    },
    _focusVisible: {
      boxShadow: '0 0 0 2px var(--chakra-colors-utility-focus-default)',
      outline: 'none',
    },
  },
  variants: {
    variant: {
      solid: {
        bg: 'colorPalette.solid',
        borderColor: 'colorPalette.solid',
        color: 'colorPalette.fg',
        _hover: {
          bg: 'colorPalette.solidHover',
          borderColor: 'colorPalette.solidHover',
          _disabled: {
            bg: 'interaction.support.disabled',
            borderColor: 'interaction.support.disabled',
          },
        },
        _active: {
          bg: 'colorPalette.solidActive',
          borderColor: 'colorPalette.solidActive',
        },
      },
      reverse: {
        bg: 'utility.ui',
        borderColor: 'transparent',
        color: 'colorPalette.reverseFg',
        _disabled: { bg: 'utility.ui', borderColor: 'transparent' },
        _hover: {
          bg: 'colorPalette.reverseHover',
          _disabled: { bg: 'utility.ui' },
        },
        _active: { bg: 'colorPalette.reverseActive' },
      },
      outline: {
        bg: 'transparent',
        borderColor: 'colorPalette.outlineBorder',
        color: 'colorPalette.outlineBorder',
        _disabled: {
          borderColor: 'interaction.support.disabled-content',
          bg: 'transparent',
        },
        _hover: {
          bg: 'colorPalette.outlineHover',
          _disabled: {
            borderColor: 'interaction.support.disabled-content',
            bg: 'transparent',
          },
        },
        _active: { bg: 'colorPalette.outlineActive' },
      },
      clear: {
        bg: 'transparent',
        borderColor: 'transparent',
        color: 'colorPalette.outlineBorder',
        _disabled: { bg: 'transparent', borderColor: 'transparent' },
        _hover: { bg: 'colorPalette.outlineHover' },
        _active: { bg: 'colorPalette.outlineActive' },
      },
      link: {
        // Inline-text identity only; layout / typography are reset to inline
        // defaults in `compoundVariants` so they beat the size variant.
        border: 'none',
        borderWidth: 0,
        borderStyle: 'none',
        w: 'fit-content',
        bg: 'transparent',
        color: 'colorPalette.outlineBorder',
        _disabled: { bg: 'transparent' },
      },
      inputAttached: {
        bg: 'utility.ui',
        color: 'interaction.support.disabled-content',
        borderColor: 'base.divider.strong',
        borderStartRadius: 0,
        borderEndRadius: 'xs',
        _hover: {
          bg: 'interaction.muted.main.hover',
          _disabled: { bg: 'interaction.support.disabled' },
        },
        _focus: {
          zIndex: 1,
          borderColor: 'utility.focus-default',
          boxShadow: '0 0 0 1px var(--chakra-colors-utility-focus-default)',
        },
        _disabled: {
          bg: 'interaction.support.disabled',
          borderColor: 'base.divider.strong',
          color: 'interaction.support.disabled-content',
        },
      },
    },
    size: {
      // Each size redeclares the same `px`/`_icon` overrides because v3's
      // default Button size variants set per-size `px` and `_icon` width/height
      // (e.g. md: { px: '4', _icon: { width: '5', height: '5' } }). Setting
      // these at our `base` level wouldn't be enough — same-property collisions
      // between our base and v3-default's size variant resolve in v3-default's
      // favour. Setting them in our size variants overrides v3-default's at
      // the same axis.
      //
      // - px: '15px' = 16px - 1px border, matches v1 inset.
      // - `_icon` reverts to `em`-based sizing so the consumer's `fontSize` on
      //   the icon (e.g. `<BxUpload fontSize="1.5rem" />`) wins, matching v1.
      xs: {
        textStyle: 'subhead-2',
        minH: '2.25rem',
        minW: '2.25rem',
        px: '15px',
        _icon: { width: '1em', height: '1em' },
      },
      sm: {
        textStyle: 'subhead-1',
        minH: '2.5rem',
        minW: '2.5rem',
        px: '15px',
        _icon: { width: '1em', height: '1em' },
      },
      md: {
        textStyle: 'subhead-1',
        minH: '2.75rem',
        minW: '2.75rem',
        px: '15px',
        _icon: { width: '1em', height: '1em' },
      },
      lg: {
        textStyle: 'subhead-1',
        minH: '3rem',
        minW: '3rem',
        px: '15px',
        _icon: { width: '1em', height: '1em' },
      },
    },
  },
  compoundVariants: [
    // The `link` variant renders as inline text, not as a button-shaped box.
    // It must defeat:
    //   - v3 default `base.fontWeight: 'medium'` (→ inline text is `normal`)
    //   - textStyle `subhead-1` inlining `lineHeight: '1.5rem'` (→ should be
    //     `normal` for inline rendering)
    //   - v3 default `size.md.h: '10'` (→ height should follow content)
    //   - v3 default `size.md.gap: '2'` (→ no gap; icons sit inline)
    //   - Our own size-variant `px: '15px'`, `minH: '2.75rem'` etc.
    //
    // All these collisions resolve in favour of the size variant or textStyle
    // unless promoted to compoundVariant specificity. v1 effective state
    // (preserved here): height: auto; padding: 0; gap: 0; font-weight: 400;
    // line-height: normal; underline on hover only.
    {
      variant: 'link',
      css: {
        h: 'auto',
        minH: 'auto',
        px: 0,
        py: 0,
        gap: 0,
        fontWeight: 'normal',
        lineHeight: 'normal',
        textDecorationLine: 'none',
        textUnderlineOffset: '0.125rem',
        _hover: {
          textDecorationLine: 'underline',
        },
      },
    },
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
})
