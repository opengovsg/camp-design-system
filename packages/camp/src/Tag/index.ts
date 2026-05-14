import type { TagCloseTriggerProps } from '@chakra-ui/react'
import { Tag as ChakraTag } from '@chakra-ui/react'

import type { TagColorPalette } from '~/theme/slotRecipes/tag.slotRecipe'

// v3's `Tag` namespace is frozen (`Object.isExtensible === false`) so
// `Object.assign(ChakraTag, { ... })` would throw at runtime. Spread into a
// new object instead (same precedent as Avatar). The explicit type annotation
// avoids TS2742 — the inferred type would reference an internal Chakra path
// that doesn't survive declaration emit.
export const Tag: typeof ChakraTag = { ...ChakraTag }

export type {
  TagCloseTriggerProps,
  TagEndElementProps,
  TagLabelProps,
  TagRootProps,
  TagStartElementProps,
} from '@chakra-ui/react'

export type { TagColorPalette }

// --- Deprecated v1 aliases ---------------------------------------------------
//
// Map v1 helper component names to v3 sub-components so existing consumer
// code compiles without modification. Plan to remove in the next major
// (v3) release once consumer apps migrate to the compound API.

/** @deprecated Use `Tag.StartElement` instead. */
export const TagLeftIcon = ChakraTag.StartElement
/** @deprecated Use `Tag.EndElement` instead. */
export const TagRightIcon = ChakraTag.EndElement
/** @deprecated Use `Tag.Label` instead. */
export const TagLabel = ChakraTag.Label
/**
 * @deprecated Use `Tag.CloseTrigger` instead. v1's custom `TagCloseButton`
 * existed because Chakra v2 didn't surface `aria-label`; v3's
 * `Tag.CloseTrigger` accepts it natively.
 */
export const TagCloseButton = ChakraTag.CloseTrigger

/** @deprecated Renamed to `TagCloseTriggerProps`. */
export type TagCloseButtonProps = TagCloseTriggerProps
