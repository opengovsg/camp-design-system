import type { Ref } from 'react'
import { useRef } from 'react'
import {
  Box,
  chakra,
  Divider,
  forwardRef,
  NumberInputProps as ChakraNumberInputProps,
  SystemStyleObject,
  useFormControlProps,
  useMergeRefs,
  useMultiStyleConfig,
  useNumberInput,
} from '@chakra-ui/react'

import { IconButton } from '~/IconButton'
import { BxMinus, BxPlus } from '~/icons'

export interface NumberInputProps extends ChakraNumberInputProps {
  /**
   * Whether the input is in a prefilled state.
   */
  isPrefilled?: boolean
  /**
   * Whether the input is in a success state.
   */
  isSuccess?: boolean
  /**
   * Whether to show the increment and decrement steppers. Defaults to true.
   */
  showSteppers?: boolean

  /**
   * Merge styles for inner input field
   */
  inputStyles?: SystemStyleObject
}

export const NumberInput = forwardRef<NumberInputProps, 'input'>(
  (
    {
      showSteppers = true,
      clampValueOnBlur = false,
      isSuccess,
      isPrefilled,
      inputStyles,
      ...props
    },
    ref,
  ) => {
    const styles = useMultiStyleConfig('NumberInput', {
      ...props,
      isSuccess,
      isPrefilled,
    })

    const stepperWrapperRef = useRef<HTMLDivElement | null>(null)

    /**
     * Used here so this component can retrieve a parent FormControl's props, if
     * any. This allows a FormControl parent component to pass props such as
     * isInvalid, isDisabled, etc, to this component.
     */
    const controlProps = useFormControlProps(props)
    const {
      htmlProps,
      getInputProps,
      getIncrementButtonProps,
      getDecrementButtonProps,
    } = useNumberInput({
      ...controlProps,
      clampValueOnBlur,
    })

    const inputProps = getInputProps({ placeholder: props.placeholder })
    const incProps = getIncrementButtonProps()
    const decProps = getDecrementButtonProps()

    const inputRef = useMergeRefs(inputProps.ref as Ref<unknown>, ref)

    const inputEndPadding = showSteppers
      ? stepperWrapperRef.current?.offsetWidth
      : undefined

    return (
      <Box {...htmlProps} __css={styles.root}>
        {/* Using base input wrapper instead of `Input` component as the Input 
        component strips out some props such as `aria-invalid`, resulting in
        incorrect styling */}
        <chakra.input
          {...inputProps}
          paddingInlineEnd={inputEndPadding}
          // Passing in ref to the input element so that it can be focused by
          // the parent.
          // No point passing the ref to the div wrapper as the main component
          // is this input.
          ref={inputRef}
          __css={styles.field}
          sx={inputStyles}
        />
        {showSteppers && (
          <Box __css={styles.stepperWrapper} ref={stepperWrapperRef}>
            <IconButton
              sx={styles.stepperButton}
              aria-hidden
              aria-label="Decrement number"
              variant="clear"
              icon={<BxMinus />}
              {...decProps}
            />
            <Divider sx={styles.stepperDivider} orientation="vertical" />
            <IconButton
              sx={styles.stepperButton}
              aria-hidden
              aria-label="Increment number"
              variant="clear"
              icon={<BxPlus />}
              {...incProps}
            />
          </Box>
        )}
      </Box>
    )
  },
)

NumberInput.displayName = 'NumberInput'
