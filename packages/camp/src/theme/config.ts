import { defineConfig } from '@chakra-ui/react'

import { badgeRecipe } from './recipes/badge.recipe'
import { buttonRecipe } from './recipes/button.recipe'
import { inputRecipe } from './recipes/input.recipe'
import { linkRecipe } from './recipes/link.recipe'
import { textareaRecipe } from './recipes/textarea.recipe'
import { avatarSlotRecipe } from './slotRecipes/avatar.slotRecipe'
import { bannerSlotRecipe } from './slotRecipes/banner.slotRecipe'
import { breadcrumbSlotRecipe } from './slotRecipes/breadcrumb.slotRecipe'
import { checkboxSlotRecipe } from './slotRecipes/checkbox.slotRecipe'
import { dialogSlotRecipe } from './slotRecipes/dialog.slotRecipe'
import { fieldSlotRecipe } from './slotRecipes/field.slotRecipe'
import { infoboxSlotRecipe } from './slotRecipes/infobox.slotRecipe'
import { menuSlotRecipe } from './slotRecipes/menu.slotRecipe'
import { paginationSlotRecipe } from './slotRecipes/pagination.slotRecipe'
import { radioGroupSlotRecipe } from './slotRecipes/radioGroup.slotRecipe'
import { switchSlotRecipe } from './slotRecipes/switch.slotRecipe'
import { tagSlotRecipe } from './slotRecipes/tag.slotRecipe'
import { tileSlotRecipe } from './slotRecipes/tile.slotRecipe'
import { toggleSlotRecipe } from './slotRecipes/toggle.slotRecipe'
import { tooltipSlotRecipe } from './slotRecipes/tooltip.slotRecipe'
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
      input: inputRecipe,
      link: linkRecipe,
      textarea: textareaRecipe,
    },
    slotRecipes: {
      avatar: avatarSlotRecipe,
      banner: bannerSlotRecipe,
      breadcrumb: breadcrumbSlotRecipe,
      checkbox: checkboxSlotRecipe,
      dialog: dialogSlotRecipe,
      field: fieldSlotRecipe,
      infobox: infoboxSlotRecipe,
      menu: menuSlotRecipe,
      pagination: paginationSlotRecipe,
      radioGroup: radioGroupSlotRecipe,
      switch: switchSlotRecipe,
      tag: tagSlotRecipe,
      tile: tileSlotRecipe,
      toggle: toggleSlotRecipe,
      tooltip: tooltipSlotRecipe,
    },
  },
})
