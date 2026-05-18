import { forwardRef, type ReactNode } from 'react'
import { Field as ChakraField, Icon, useSlotRecipe } from '@chakra-ui/react'

import { BxsErrorCircle } from '~/icons'

export interface FieldErrorTextProps {
  children?: ReactNode
}

const ErrorText = ChakraField.ErrorText as React.FC<
  React.PropsWithChildren<Record<string, unknown>> &
    React.RefAttributes<HTMLDivElement>
>

/**
 * Error text rendered under a `Field.Root` when `invalid` is true. Prepends
 * an error icon (camp-specific extension over v3's plain text).
 */
export const FieldErrorText = forwardRef<HTMLDivElement, FieldErrorTextProps>(
  ({ children }, ref) => {
    const recipe = useSlotRecipe({ key: 'field' })
    const styles = recipe({})

    return (
      <ErrorText ref={ref} css={styles.errorText}>
        <Icon aria-hidden as={BxsErrorCircle} css={styles.icon} />
        {children}
      </ErrorText>
    )
  },
)
FieldErrorText.displayName = 'Field.ErrorText'
