import { forwardRef, type ReactNode } from 'react'
import {
  NumberInput as ChakraNumberInput,
  type NumberInputRootProps as ChakraNumberInputRootProps,
} from '@chakra-ui/react'

import { IconButton } from '~/IconButton'
import { BxMinus, BxPlus } from '~/icons'

export interface NumberInputProps
  extends Omit<ChakraNumberInputRootProps, 'children'> {
  /** Renders with the yellow prefilled tint. */
  isPrefilled?: boolean
  /** Renders with the green success border + icon. */
  isSuccess?: boolean
  /** Whether to show the increment / decrement steppers. Defaults to `true`. */
  showSteppers?: boolean
}

type ChildrenProps = React.PropsWithChildren<Record<string, unknown>>
const Control = ChakraNumberInput.Control as React.FC<ChildrenProps>
const IncrementTrigger = ChakraNumberInput.IncrementTrigger as React.FC<ChildrenProps>
const DecrementTrigger = ChakraNumberInput.DecrementTrigger as React.FC<ChildrenProps>

/**
 * Numeric input with optional `+` / `-` steppers. Wraps v3's `NumberInput`
 * compound to expose the v1 `<NumberInput showSteppers />` API.
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ showSteppers = true, isPrefilled, isSuccess, ...props }, ref) => {
    const dataAttrs = {
      'data-prefilled': isPrefilled || undefined,
      'data-success': isSuccess || undefined,
    }

    return (
      <ChakraNumberInput.Root {...props}>
        <ChakraNumberInput.Input ref={ref} {...dataAttrs} />
        {showSteppers ? (
          <Control>
            <DecrementTrigger>
              <IconButton aria-label="Decrement" size="xs" variant="clear">
                <BxMinus />
              </IconButton>
            </DecrementTrigger>
            <IncrementTrigger>
              <IconButton aria-label="Increment" size="xs" variant="clear">
                <BxPlus />
              </IconButton>
            </IncrementTrigger>
          </Control>
        ) : null}
      </ChakraNumberInput.Root>
    )
  },
)
NumberInput.displayName = 'NumberInput'
