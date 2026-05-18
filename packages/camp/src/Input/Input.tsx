import { forwardRef } from 'react'
import {
  Box,
  Icon,
  Input as ChakraInput,
  type InputProps as ChakraInputProps,
} from '@chakra-ui/react'

import { BxsCheckCircle } from '~/icons'

export interface InputProps extends ChakraInputProps {
  /** Renders the input with the prefilled yellow background tint. */
  isPrefilled?: boolean
  /** Renders the input with a green success border + check icon. */
  isSuccess?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isPrefilled, isSuccess, ...props }, ref) => {
    const dataAttrs = {
      'data-prefilled': isPrefilled || undefined,
      'data-success': isSuccess || undefined,
    }

    if (!isSuccess) {
      return <ChakraInput ref={ref} {...dataAttrs} {...props} />
    }

    return (
      <Box position="relative">
        <ChakraInput ref={ref} pr="2.5rem" {...dataAttrs} {...props} />
        <Box
          position="absolute"
          right="0.75rem"
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
          color="interaction.success.default"
        >
          <Icon as={BxsCheckCircle} boxSize="1.25rem" />
        </Box>
      </Box>
    )
  },
)
Input.displayName = 'Input'
