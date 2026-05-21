import { defineConfig } from '@chakra-ui/react'

import { badgeRecipe } from './recipes/badge.recipe'
import { buttonRecipe } from './recipes/button.recipe'
import { linkRecipe } from './recipes/link.recipe'
import { avatarSlotRecipe } from './slotRecipes/avatar.slotRecipe'
import { breadcrumbSlotRecipe } from './slotRecipes/breadcrumb.slotRecipe'
import { tagSlotRecipe } from './slotRecipes/tag.slotRecipe'
import { breakpoints } from './breakpoints'
import { layerStyles } from './layerStyles'
import { semanticTokenColors } from './semanticTokens'
import { textStyles } from './textStyles'
import * as tokens from './tokens'

export const config = defineConfig({
  globalCss: {
    // Universal selector applies tabular-nums + cv05 even to form elements,
    // which UA stylesheets reset to system defaults.
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
      badge: badgeRecipe,
      button: buttonRecipe,
      link: linkRecipe,
    },
    slotRecipes: {
      avatar: avatarSlotRecipe,
      breadcrumb: breadcrumbSlotRecipe,
      tag: tagSlotRecipe,
    },
  },
})
