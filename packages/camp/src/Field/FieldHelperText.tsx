import { forwardRef, type ReactNode } from 'react'
import { Field as ChakraField, Icon, useSlotRecipe } from '@chakra-ui/react'

import { BxsCheckCircle } from '~/icons'

export interface FieldHelperTextProps {
  children?: ReactNode
  /** Helper-text variant. `success` shows a green check icon. */
  variant?: 'success'
}

const HelperText = ChakraField.HelperText as React.FC<
  React.PropsWithChildren<Record<string, unknown>> &
    React.RefAttributes<HTMLDivElement>
>

/**
 * Helper text rendered under a `Field.Root`. The `success` variant prepends
 * a green check icon (camp-specific extension over v3's plain helper text).
 */
export const FieldHelperText = forwardRef<HTMLDivElement, FieldHelperTextProps>(
  ({ children, variant }, ref) => {
    const recipe = useSlotRecipe({ key: 'field' })
    const styles = recipe({ variant })

    return (
      <HelperText ref={ref} css={styles.helperText}>
        {variant === 'success' ? (
          <Icon aria-hidden as={BxsCheckCircle} css={styles.icon} />
        ) : null}
        {children}
      </HelperText>
    )
  },
)
FieldHelperText.displayName = 'Field.HelperText'
