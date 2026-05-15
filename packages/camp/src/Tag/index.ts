import type { TagCloseTriggerProps } from '@chakra-ui/react'
import { Tag as ChakraTag } from '@chakra-ui/react'

import type { TagColorPalette } from '~/theme/slotRecipes/tag.slotRecipe'

// Chakra's `Tag` namespace is frozen; `Object.assign` throws at runtime.
// Spread into a new object. The explicit type annotation prevents `tsc
// --declaration` from emitting an internal Chakra import path.
export const Tag: typeof ChakraTag = { ...ChakraTag }

export type {
  TagCloseTriggerProps,
  TagEndElementProps,
  TagLabelProps,
  TagRootProps,
  TagStartElementProps,
} from '@chakra-ui/react'

export type { TagColorPalette }

/** @deprecated Use `Tag.StartElement` instead. */
export const TagLeftIcon = ChakraTag.StartElement
/** @deprecated Use `Tag.EndElement` instead. */
export const TagRightIcon = ChakraTag.EndElement
/** @deprecated Use `Tag.Label` instead. */
export const TagLabel = ChakraTag.Label
/** @deprecated Use `Tag.CloseTrigger` instead. */
export const TagCloseButton = ChakraTag.CloseTrigger

/** @deprecated Renamed to `TagCloseTriggerProps`. */
export type TagCloseButtonProps = TagCloseTriggerProps
