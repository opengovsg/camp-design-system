import { defineRecipe } from '@chakra-ui/react'

export type ButtonColorPalette =
  | 'main'
  | 'success'
  | 'critical'
  | 'warning'
  | 'sub'
  | 'neutral'
  | 'inverse'

/**
 * @deprecated Renamed to `ButtonColorPalette`. Will be removed in v3.
 */
export type ThemeButtonColorScheme = ButtonColorPalette

export const buttonRecipe = defineRecipe({
  className: 'ogp-button',
  base: {
    textStyle: 'subhead-1',
    whiteSpace: 'pre-wrap',
    // Match v1's button glyph rendering. In v1 the browser UA stylesheet's
    // reset on `<button>` meant buttons showed `font-feature-settings: normal`
    // (no cv05 / no tnum) — visually, the lowercase `l` rendered without
    // Inter's cv05 tail. v3's defaultConfig applies cv11 via `*`, and our
    // own globalCss applies tnum/cv05 at the body level; both would inherit
    // into the button. Explicitly reset to `normal` here to preserve v1 look.
    fontFeatureSettings: 'normal',
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
        border: 'none',
        minHeight: 'auto',
        fontWeight: 'normal',
        w: 'fit-content',
        textDecoration: 'underline',
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
    // The `link` variant needs to defeat the px:'15px' set in every size
    // variant — single-axis variants alone can't, because size variants are
    // declared after `variant` here and so emit later in the cascade.
    // compoundVariants take higher specificity than either axis. Matches v1's
    // effective padding (Link.variants.standalone set `p: '0.25rem'`).
    {
      variant: 'link',
      css: {
        px: '0.25rem',
        py: '0.25rem',
      },
    },
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
})
