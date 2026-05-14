import { defineRecipe } from '@chakra-ui/react'

export type BadgeColorPalette =
  | 'main'
  | 'sub'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'critical'

/**
 * @deprecated Renamed to `BadgeColorPalette`. Will be removed in v3.
 */
export type ThemeBadgeColorScheme = BadgeColorPalette

export const badgeRecipe = defineRecipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    textTransform: 'initial',
    // v2 used `borderRadius: 'base'`; v3 dropped `radii.base` so we use `'sm'`
    // (= 4px, the same hex). See audit § 3 (radii drift) and § 8 #3.
    borderRadius: 'sm',
    // Replaces v1's `BadgeLeftIcon`/`BadgeRightIcon` marginEnd/marginStart of
    // 0.25rem. Plain icon children now sit inline with this gap.
    gap: '0.25rem',
  },
  variants: {
    variant: {
      solid: {
        bg: 'colorPalette.solid',
        color: 'colorPalette.fg',
      },
      subtle: {
        bg: 'colorPalette.subtleBg',
        color: 'colorPalette.subtleFg',
      },
      // v1 had a `clear` variant rendering as default-coloured text on a
      // transparent background, with icon children tinted by colorPalette.
      // Used as the notification-dot pattern (e.g. `<Badge variant="clear"
      // colorPalette="success"><BxsCircle /> Online</Badge>`).
      clear: {
        bg: 'transparent',
        color: 'base.content.default',
        _icon: {
          color: 'colorPalette.solid',
        },
      },
    },
    size: {
      // Each size redeclares `px`/`py` because v3's default Badge size
      // variants set per-size `px` and `minH` (e.g. sm: `px: '1.5'`, `minH: '5'`).
      // Setting these only at our `base` would lose to v3-default's
      // size-variant cascade. See audit § 8 #14.
      xs: {
        textStyle: 'legal',
        px: '0.5rem',
        py: '0.25rem',
      },
      sm: {
        textStyle: 'caption-1',
        px: '0.5rem',
        py: '0.25rem',
      },
    },
  },
  compoundVariants: [
    // v1 Badge's `subtleColorTokenMap` mapped `warning` to `yellow.700` for
    // legibility against the pale yellow subtle background. The shared
    // `warning.subtleFg` semantic token resolves to `interaction.warning.default`
    // (= `#FFDA68`, used by Avatar's subtle variant) which is too light to
    // read on the subtle warning background. We override at the recipe level
    // so Avatar's subtle warning behaviour stays unchanged.
    {
      variant: 'subtle',
      colorPalette: 'warning',
      css: {
        color: 'yellow.700',
      },
    },
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'sm',
    // No `colorPalette` default — applied at the wrapper level (audit § 8 #2).
  },
})
