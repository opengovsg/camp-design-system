import { defineConfig } from '@chakra-ui/react'

import { buttonRecipe } from './recipes/button.recipe'
import { breakpoints } from './breakpoints'
import { layerStyles } from './layerStyles'
import { semanticTokenColors } from './semanticTokens'
import { textStyles } from './textStyles'
import * as tokens from './tokens'

export const config = defineConfig({
  globalCss: {
    // Match v1's `body { fontFeatureSettings: 'tnum on, cv05 on' }` rule.
    // The features are applied at the body level and propagate to descendants
    // via CSS inheritance — `font-feature-settings` IS inherited per spec.
    //
    // v3's defaultConfig sets `* { fontFeatureSettings: '"cv11"' }` which
    // would break inheritance by explicitly resetting every descendant.
    // Override that universal rule with `inherit` so descendants pick up the
    // body-level value instead of v3's cv11. Body has higher specificity than
    // `*`, so the body rule wins on the body element itself.
    '*': {
      fontFeatureSettings: 'inherit',
    },
    body: {
      fontFeatureSettings: "'tnum' on, 'cv05' on",
    },
  },
  theme: {
    breakpoints,
    tokens: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      sizes: tokens.sizes,
      shadows: tokens.shadows,
      fontSizes: tokens.fontSizes,
      fontWeights: tokens.fontWeights,
      lineHeights: tokens.lineHeights,
      letterSpacings: tokens.letterSpacings,
      fonts: tokens.fonts,
      durations: tokens.durations,
      easings: tokens.easings,
    },
    semanticTokens: {
      colors: semanticTokenColors,
    },
    textStyles,
    layerStyles,
    recipes: {
      button: buttonRecipe,
    },
    slotRecipes: {},
  },
})
