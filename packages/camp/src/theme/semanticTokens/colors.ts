import { defineSemanticTokens } from '@chakra-ui/react'

// Light-mode-only body tokens (dark mode is not supported; see README).
const baseTokens = {
  'chakra-body-text': { value: '{colors.base.content.default}' },
  'chakra-body-bg': { value: '{colors.base.canvas.default}' },
  'chakra-border-color': { value: '{colors.base.divider.medium}' },
}

// Per-palette slot tokens referenced by recipes via `colorPalette.<slot>`.
// `fg` values precomputed via getContrastColor against each `solid` bg.
const palettes = {
  main: {
    solid: { value: '{colors.interaction.main.default}' },
    solidHover: { value: '{colors.interaction.main.hover}' },
    solidActive: { value: '{colors.interaction.main.active}' },
    fg: { value: '#FFFFFF' },
    // `subtleBg` / `subtleFg` back the Avatar `subtle` variant (and any
    // future recipe that wants a tinted brand background with brand-coloured
    // text). v1 used `interaction.${c}-subtle.default` for the bg and the
    // base-`.default` colour for the fg.
    subtleBg: { value: '{colors.interaction.main-subtle.default}' },
    subtleFg: { value: '{colors.interaction.main.default}' },
    outlineBorder: { value: '{colors.interaction.main.default}' },
    outlineHover: { value: '{colors.interaction.tinted.main.hover}' },
    outlineActive: { value: '{colors.interaction.tinted.main.active}' },
    reverseFg: { value: '{colors.interaction.main.default}' },
    reverseHover: { value: '{colors.interaction.muted.main.hover}' },
    reverseActive: { value: '{colors.interaction.muted.main.active}' },
    // `linkDefault` / `linkHover` back the Link recipe. v1 mapped `main` to
    // `interaction.links.{default,hover}` (which are distinct from
    // `interaction.main.{default,hover}` despite the name).
    linkDefault: { value: '{colors.interaction.links.default}' },
    linkHover: { value: '{colors.interaction.links.hover}' },
  },
  sub: {
    solid: { value: '{colors.interaction.sub.default}' },
    solidHover: { value: '{colors.interaction.sub.hover}' },
    solidActive: { value: '{colors.interaction.sub.active}' },
    fg: { value: '#FFFFFF' },
    subtleBg: { value: '{colors.interaction.sub-subtle.default}' },
    subtleFg: { value: '{colors.interaction.sub.default}' },
    outlineBorder: { value: '{colors.interaction.sub.default}' },
    outlineHover: { value: '{colors.interaction.tinted.sub.hover}' },
    outlineActive: { value: '{colors.interaction.tinted.sub.active}' },
    reverseFg: { value: '{colors.interaction.sub.default}' },
    reverseHover: { value: '{colors.interaction.muted.sub.hover}' },
    reverseActive: { value: '{colors.interaction.muted.sub.active}' },
    // v1 Link's `sub` palette fell into the default `${c}.500/.600` branch,
    // but reusing `interaction.links.{default,hover}` matches the design intent
    // (both `main` and `sub` should render as the brand link colour).
    linkDefault: { value: '{colors.interaction.links.default}' },
    linkHover: { value: '{colors.interaction.links.hover}' },
  },
  critical: {
    solid: { value: '{colors.interaction.critical.default}' },
    solidHover: { value: '{colors.interaction.critical.hover}' },
    solidActive: { value: '{colors.interaction.critical.active}' },
    fg: { value: '#FFFFFF' },
    subtleBg: { value: '{colors.interaction.critical-subtle.default}' },
    subtleFg: { value: '{colors.interaction.critical.default}' },
    outlineBorder: { value: '{colors.interaction.critical.default}' },
    outlineHover: { value: '{colors.interaction.tinted.critical.hover}' },
    outlineActive: { value: '{colors.interaction.tinted.critical.active}' },
    reverseFg: { value: '{colors.interaction.critical.default}' },
    reverseHover: { value: '{colors.interaction.muted.critical.hover}' },
    reverseActive: { value: '{colors.interaction.muted.critical.active}' },
    // v1 Link's `red` palette used the default `${c}.500 / ${c}.600` branch.
    // `critical` was v1's `red`-equivalent — preserve those exact hex chain.
    linkDefault: { value: '{colors.red.500}' },
    linkHover: { value: '{colors.red.600}' },
  },
  warning: {
    solid: { value: '{colors.interaction.warning.default}' },
    solidHover: { value: '{colors.interaction.warning.hover}' },
    solidActive: { value: '{colors.interaction.warning.active}' },
    fg: { value: '#1F1F1F' },
    subtleBg: { value: '{colors.interaction.warning-subtle.default}' },
    subtleFg: { value: '{colors.interaction.warning.default}' },
    outlineBorder: { value: '{colors.interaction.warning.default}' },
    outlineHover: { value: '{colors.interaction.warning.hover}' },
    outlineActive: { value: '{colors.interaction.warning.active}' },
    reverseFg: { value: '{colors.interaction.warning.default}' },
    reverseHover: { value: '{colors.interaction.warning.hover}' },
    reverseActive: { value: '{colors.interaction.warning.active}' },
    // v1 Link's `warning` was a special-case branch: `yellow.800 / yellow.900`
    // for legibility (the default `.500/.600` chain fails contrast on white).
    linkDefault: { value: '{colors.yellow.800}' },
    linkHover: { value: '{colors.yellow.900}' },
  },
  success: {
    solid: { value: '{colors.interaction.success.default}' },
    solidHover: { value: '{colors.interaction.success.hover}' },
    solidActive: { value: '{colors.interaction.success.active}' },
    fg: { value: '#FFFFFF' },
    subtleBg: { value: '{colors.interaction.success-subtle.default}' },
    subtleFg: { value: '{colors.interaction.success.default}' },
    outlineBorder: { value: '{colors.interaction.success.default}' },
    outlineHover: { value: '{colors.interaction.success.hover}' },
    outlineActive: { value: '{colors.interaction.success.active}' },
    reverseFg: { value: '{colors.interaction.success.default}' },
    reverseHover: { value: '{colors.interaction.success.hover}' },
    reverseActive: { value: '{colors.interaction.success.active}' },
    // v1 Link's `success` was a special-case branch: `green.700 / green.800`
    // for legibility (the default `.500/.600` chain fails contrast on white).
    linkDefault: { value: '{colors.green.700}' },
    linkHover: { value: '{colors.green.800}' },
  },
  neutral: {
    // `subtleBg` / `subtleFg` back the Badge `subtle` variant for the neutral
    // palette. v1 Badge used `interaction.neutral-subtle.default` for the bg
    // and `interaction.neutral.default` for the fg. Avatar didn't support
    // `neutral` so these weren't added in the Avatar migration.
    subtleBg: { value: '{colors.interaction.neutral-subtle.default}' },
    subtleFg: { value: '{colors.interaction.neutral.default}' },
    // v1 Badge `solid.neutral` rendered `interaction.neutral.default` on the
    // bg with `base.content.inverse` text (passed contrast check in v1).
    solid: { value: '{colors.interaction.neutral.default}' },
    fg: { value: '{colors.base.content.inverse}' },
    outlineBorder: { value: '{colors.base.content.strong}' },
    outlineHover: { value: '{colors.interaction.tinted.neutral.hover}' },
    outlineActive: { value: '{colors.interaction.tinted.neutral.active}' },
    reverseFg: { value: '{colors.interaction.neutral.default}' },
    reverseHover: { value: '{colors.interaction.muted.neutral.hover}' },
    reverseActive: { value: '{colors.interaction.muted.neutral.active}' },
    // v1 Link's `neutral` palette used dedicated tokens distinct from the
    // generic neutral interaction colours.
    linkDefault: { value: '{colors.interaction.links.neutral-default}' },
    linkHover: { value: '{colors.interaction.links.neutral-hover}' },
  },
  inverse: {
    outlineBorder: { value: '{colors.base.content.inverse}' },
    outlineHover: { value: '{colors.interaction.tinted.inverse.hover}' },
    outlineActive: { value: '{colors.interaction.tinted.inverse.active}' },
    // v1 Link's `inverse` palette used dedicated tokens for dark backgrounds.
    linkDefault: { value: '{colors.interaction.links.inverse-default}' },
    linkHover: { value: '{colors.interaction.links.inverse-hover}' },
  },
  // `info` shares solid hex with `main` (both #1361F0) but uses a lighter
  // subtle background (#F7F9FE vs main's #E7EFFC). Kept as a distinct palette
  // so v1 `colorScheme="info"` consumers see the same visual in v2.
  info: {
    solid: { value: '{colors.utility.feedback.info}' },
    fg: { value: '#FFFFFF' },
    subtleBg: { value: '{colors.utility.feedback.info-subtle}' },
    subtleFg: { value: '{colors.utility.feedback.info}' },
  },
}

export const semanticTokenColors = defineSemanticTokens.colors({
  ...baseTokens,
  ...palettes,
})
