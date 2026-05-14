import { defineConfig } from '@chakra-ui/react'

import { buttonRecipe } from './recipes/button.recipe'
import { breakpoints } from './breakpoints'
import { layerStyles } from './layerStyles'
import { semanticTokenColors } from './semanticTokens'
import { textStyles } from './textStyles'
import * as tokens from './tokens'

export const config = defineConfig({
  globalCss: {
    // Apply tnum + cv05 to every element via universal selector, overriding
    // Chakra v3's default `* { fontFeatureSettings: '"cv11"' }`. v1 set this
    // on `body` only and relied on inheritance (which the browser UA reset
    // on form elements like `<button>` interrupted) — v3's universal cascade
    // is the desired behaviour going forward.
    '*': {
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
