import { Field as ChakraField } from '@chakra-ui/react'

import { FieldErrorText } from './FieldErrorText'
import { FieldHelperText } from './FieldHelperText'
import { FieldLabel } from './FieldLabel'

export type { FieldErrorTextProps } from './FieldErrorText'
export type { FieldHelperTextProps } from './FieldHelperText'
export type { FieldLabelProps, FieldSize } from './FieldLabel'
export type {
  FieldRequiredIndicatorProps,
  FieldRootProps,
} from '@chakra-ui/react'

// Compound namespace mirroring v3's `Field` API but with camp-enhanced
// Label / HelperText / ErrorText. The chakra v2→v3 codemod rewrites
// `FormControl` / `FormLabel` / `FormHelperText` / `FormErrorMessage` to
// `Field.Root` / `Field.Label` / `Field.HelperText` / `Field.ErrorText`,
// which lands in camp's enhanced exports for free.
//
// `Omit` strips chakra's stock Label / HelperText / ErrorText so the
// intersection types resolve cleanly against the camp wrappers (chakra's
// types don't accept `children` while ours do).
type ChakraFieldSans = Omit<
  typeof ChakraField,
  'Label' | 'HelperText' | 'ErrorText'
>

export const Field: ChakraFieldSans & {
  Label: typeof FieldLabel
  HelperText: typeof FieldHelperText
  ErrorText: typeof FieldErrorText
} = {
  ...ChakraField,
  Label: FieldLabel,
  HelperText: FieldHelperText,
  ErrorText: FieldErrorText,
}
