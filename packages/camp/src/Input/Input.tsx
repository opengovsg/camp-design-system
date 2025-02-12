import {
  ComponentWithAs as _,
  forwardRef,
  Icon,
  Input as ChakraInput,
  InputGroup,
  InputProps as ChakraInputProps,
  InputRightElement,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import omit from 'lodash/omit'

import { BxsCheckCircle } from '~/icons/BxsCheckCircle'

export interface InputProps extends ChakraInputProps {
  /**
   * Whether the input is in a prefilled state.
   */
  isPrefilled?: boolean
  /**
   * Whether the input is in a success state.
   */
  isSuccess?: boolean
}

export const Input = forwardRef<InputProps, 'input'>((props, ref) => {
  const inputStyles = useMultiStyleConfig('Input', props)

  // Omit extra props so they will not be passed into the DOM and trigger
  // React warnings.
  const inputProps = omit(props, ['isSuccess', 'isPrefilled'])
  const dataAttributes = {
    'data-is-success': props.isSuccess || undefined,
    'data-is-prefilled': props.isPrefilled || undefined,
  }

  // Return normal input component if not success state.
  if (!props.isSuccess) {
    return (
      <ChakraInput
        ref={ref}
        __css={inputStyles.field}
        {...dataAttributes}
        {...inputProps}
      />
    )
  }

  return (
    // InputGroup is required for InputRightElement to retrieve the correct
    // style props. Will crash if not included.
    <InputGroup>
      <ChakraInput
        ref={ref}
        __css={inputStyles.field}
        {...dataAttributes}
        {...inputProps}
      />
      <InputRightElement sx={inputStyles.success}>
        <Icon as={BxsCheckCircle} />
      </InputRightElement>
    </InputGroup>
  )
})

/**
 * This is used in by Chakra's `InputGroup` component to remove border radii
 * when paired with `InputLeftAddon` or `InputRightAddon`.
 *
 * See https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/input/src/input.tsx#L70 and
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/components/input/src/input-group.tsx#L71.
 */
Input.id = 'Input'

Input.displayName = 'Input'
