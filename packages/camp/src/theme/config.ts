import { defineConfig } from '@chakra-ui/react'

import { breakpoints } from './breakpoints'
import { buttonRecipe } from './recipes/button.recipe'
import { semanticTokenColors } from './semanticTokens'
import { textStyles } from './textStyles'
import { layerStyles } from './layerStyles'
import * as tokens from './tokens'

export const config = defineConfig({
  globalCss: {
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
