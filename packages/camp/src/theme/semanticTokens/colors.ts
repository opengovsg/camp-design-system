import { defineSemanticTokens } from '@chakra-ui/react'

// Preserves v1 chakra-body tokens (light mode only — dark mode is not supported
// by this design system; see README).
const baseTokens = {
  'chakra-body-text': { value: '{colors.base.content.default}' },
  'chakra-body-bg': { value: '{colors.base.canvas.default}' },
  'chakra-border-color': { value: '{colors.base.divider.medium}' },
}

// Per-palette slot tokens. Component recipes reference
// `colorPalette.solid`, `colorPalette.fg`, etc.; Chakra rewrites them to the
// matching scheme based on the consumer's `colorPalette="main"` prop.
//
// Source backgrounds (from tokens/colors.ts):
//   main:     #1361F0  sub:      #5d6785  critical: #c03434
//   warning:  #FFDA68  success:  #0F796F  neutral:  #666C7A
//
// `fg` is pre-computed via getContrastColor('#FFFFFF', <bg>, '#1F1F1F').
const palettes = {
  main: {
    solid: { value: '{colors.interaction.main.default}' },
    solidHover: { value: '{colors.interaction.main.hover}' },
    solidActive: { value: '{colors.interaction.main.active}' },
    fg: { value: '#FFFFFF' },
    outlineBorder: { value: '{colors.interaction.main.default}' },
    outlineHover: { value: '{colors.interaction.tinted.main.hover}' },
    outlineActive: { value: '{colors.interaction.tinted.main.active}' },
    reverseFg: { value: '{colors.interaction.main.default}' },
    reverseHover: { value: '{colors.interaction.muted.main.hover}' },
    reverseActive: { value: '{colors.interaction.muted.main.active}' },
  },
  sub: {
    solid: { value: '{colors.interaction.sub.default}' },
    solidHover: { value: '{colors.interaction.sub.hover}' },
    solidActive: { value: '{colors.interaction.sub.active}' },
    fg: { value: '#FFFFFF' },
    outlineBorder: { value: '{colors.interaction.sub.default}' },
    outlineHover: { value: '{colors.interaction.tinted.sub.hover}' },
    outlineActive: { value: '{colors.interaction.tinted.sub.active}' },
    reverseFg: { value: '{colors.interaction.sub.default}' },
    reverseHover: { value: '{colors.interaction.muted.sub.hover}' },
    reverseActive: { value: '{colors.interaction.muted.sub.active}' },
  },
  critical: {
    solid: { value: '{colors.interaction.critical.default}' },
    solidHover: { value: '{colors.interaction.critical.hover}' },
    solidActive: { value: '{colors.interaction.critical.active}' },
    fg: { value: '#FFFFFF' },
    outlineBorder: { value: '{colors.interaction.critical.default}' },
    outlineHover: { value: '{colors.interaction.tinted.critical.hover}' },
    outlineActive: { value: '{colors.interaction.tinted.critical.active}' },
    reverseFg: { value: '{colors.interaction.critical.default}' },
    reverseHover: { value: '{colors.interaction.muted.critical.hover}' },
    reverseActive: { value: '{colors.interaction.muted.critical.active}' },
  },
  warning: {
    solid: { value: '{colors.interaction.warning.default}' },
    solidHover: { value: '{colors.interaction.warning.hover}' },
    solidActive: { value: '{colors.interaction.warning.active}' },
    fg: { value: '#1F1F1F' },
    // warning has no v1-distinct outline/reverse hover/active states; reuse the same hex chain
    outlineBorder: { value: '{colors.interaction.warning.default}' },
    outlineHover: { value: '{colors.interaction.warning.hover}' },
    outlineActive: { value: '{colors.interaction.warning.active}' },
    reverseFg: { value: '{colors.interaction.warning.default}' },
    reverseHover: { value: '{colors.interaction.warning.hover}' },
    reverseActive: { value: '{colors.interaction.warning.active}' },
  },
  success: {
    solid: { value: '{colors.interaction.success.default}' },
    solidHover: { value: '{colors.interaction.success.hover}' },
    solidActive: { value: '{colors.interaction.success.active}' },
    fg: { value: '#FFFFFF' },
    outlineBorder: { value: '{colors.interaction.success.default}' },
    outlineHover: { value: '{colors.interaction.success.hover}' },
    outlineActive: { value: '{colors.interaction.success.active}' },
    reverseFg: { value: '{colors.interaction.success.default}' },
    reverseHover: { value: '{colors.interaction.success.hover}' },
    reverseActive: { value: '{colors.interaction.success.active}' },
  },
  neutral: {
    outlineBorder: { value: '{colors.base.content.strong}' },
    outlineHover: { value: '{colors.interaction.tinted.neutral.hover}' },
    outlineActive: { value: '{colors.interaction.tinted.neutral.active}' },
    reverseFg: { value: '{colors.interaction.neutral.default}' },
    reverseHover: { value: '{colors.interaction.muted.neutral.hover}' },
    reverseActive: { value: '{colors.interaction.muted.neutral.active}' },
  },
  inverse: {
    outlineBorder: { value: '{colors.base.content.inverse}' },
    outlineHover: { value: '{colors.interaction.tinted.inverse.hover}' },
    outlineActive: { value: '{colors.interaction.tinted.inverse.active}' },
  },
}

export const semanticTokenColors = defineSemanticTokens.colors({
  ...baseTokens,
  ...palettes,
})
