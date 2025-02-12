/**
 * This file is a slightly modified version of Chakra UI's internal Radio
 * implementation, which can be found here:
 * https://github.com/chakra-ui/chakra-ui/blob/main/packages/radio/src/radio.tsx
 *
 * Limitations of Chakra's Radio mean that we cannot implement our desired
 * design with the existing implementation. In particular, the "disabled"
 * attribute does not apply to the label which wraps the component, meaning
 * we cannot apply the correct styles to the Radio container when the button
 * inside it is disabled (e.g. { cursor: 'not-allowed', bg: 'none' }).
 *
 * Hence this code is adapted to apply the desired styles to the label which
 * wraps the component.
 *
 * The relevant issue in the Chakra UI repo is here:
 * https://github.com/chakra-ui/chakra-ui/issues/4295
 */

import {
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import {
  Box,
  chakra,
  ComponentWithAs,
  createStylesContext,
  forwardRef,
  HTMLChakraProps,
  layoutPropNames,
  omitThemingProps,
  SystemProps,
  SystemStyleObject,
  ThemingProps,
  useMergeRefs,
  useMultiStyleConfig,
  useRadio,
  useRadioGroupContext,
  UseRadioProps,
} from '@chakra-ui/react'
import { callAll, split } from '@chakra-ui/utils'

import { Input, InputProps } from '~/Input'

import { RadioGroup } from './RadioGroup'
import { useRadioGroupWithOthers } from './useRadioGroupWithOthers'

type Omitted = 'onChange' | 'defaultChecked' | 'checked'
type BaseControlProps = Omit<HTMLChakraProps<'div'>, Omitted>

export interface RadioProps
  extends UseRadioProps,
    ThemingProps<'Radio'>,
    BaseControlProps {
  /**
   * The spacing between the checkbox and its label text
   * @default 0.5rem
   * @type SystemProps["marginLeft"]
   */
  spacing?: SystemProps['marginLeft']
  /**
   * Additional overriding styles. This is a change from the Chakra UI
   * implementation, which previously did not allow overriding styles.
   */
  __css?: SystemStyleObject

  /**
   * Function called when checked state of the input changes
   * If provided and if allowDeselect is true, will be called
   * with empty string when user attempts to deselect the radio.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void

  /**
   * Additional props to be forwarded to the `input` element
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>

  /**
   * Whether the radio button can be deselected once radio group has a value.
   * @default true
   */
  allowDeselect?: boolean
}

type RadioWithSubcomponentProps = ComponentWithAs<'input', RadioProps> & {
  OthersWrapper: typeof OthersWrapper
  RadioGroup: typeof RadioGroup
  OthersInput: typeof OthersInput
}

/**
 * Radio component is used in forms when a user needs to select a single value from
 * several options.
 *
 * @see Docs https://chakra-ui.com/radio
 */
export const Radio = forwardRef<RadioProps, 'input'>(
  ({ allowDeselect = true, ...props }, ref) => {
    const { onChange: onChangeProp, value: valueProp } = props

    const group = useRadioGroupContext()
    const styles = useMultiStyleConfig('Radio', { ...group, ...props })

    const ownProps = omitThemingProps(props)

    const {
      spacing = '0.5rem',
      children,
      isDisabled = group?.isDisabled || props.isDisabled,
      isFocusable = group?.isFocusable,
      inputProps: htmlInputProps,
      ...rest
    } = ownProps

    let isChecked = props.isChecked
    if (group?.value != null && valueProp != null) {
      isChecked = group.value === valueProp
    }

    let onChange = onChangeProp
    if (group?.onChange && valueProp != null) {
      onChange = callAll(group.onChange, onChangeProp)
    }

    const name = props?.name ?? group?.name

    const {
      getInputProps,
      getRadioProps,
      getLabelProps,
      getRootProps,
      htmlProps,
    } = useRadio({
      ...rest,
      isChecked,
      isFocusable,
      isDisabled,
      onChange,
      name,
    })

    const [layoutProps, otherProps] = split(htmlProps, layoutPropNames as never)

    const radioProps = getRadioProps(otherProps)
    const inputProps = getInputProps(htmlInputProps, ref)
    const rootProps = Object.assign({}, layoutProps, getRootProps())

    const handleSelect = useCallback(
      (e: SyntheticEvent) => {
        if (isChecked && allowDeselect) {
          e.preventDefault()
          // Toggle off if onChange is given.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onChange?.({ target: { value: '' } })
        }
      },
      [allowDeselect, isChecked, onChange],
    )

    const handleSpacebar = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== ' ') return
        if (isChecked && allowDeselect) {
          handleSelect(e)
        }
      },
      [allowDeselect, handleSelect, isChecked],
    )

    // Update labelProps to include props to allow deselection of radio value if
    // available
    const labelProps = useMemo(() => {
      return getLabelProps({
        onClick: handleSelect,
        onKeyDown: handleSpacebar,
      })
    }, [getLabelProps, handleSelect, handleSpacebar])

    const rootStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      verticalAlign: 'top',
      cursor: 'pointer',
      position: 'relative',
      ...styles.container,
      ...props.__css,
    }

    const radioStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...styles.control,
    }

    const labelStyles: SystemStyleObject = {
      userSelect: 'none',
      marginStart: spacing,
      ...styles.label,
    }

    return (
      <chakra.label
        className="chakra-radio"
        {...rootProps}
        // This is the adapted line of code which applies the internal label styles
        // to the whole container
        {...labelProps}
        __css={rootStyles}
      >
        <input className="chakra-radio__input" {...inputProps} />
        <chakra.span
          className="chakra-radio__control"
          {...radioProps}
          __css={radioStyles}
        />
        {children && (
          <chakra.span
            className="chakra-radio__label"
            {...labelProps}
            __css={labelStyles}
          >
            {children}
          </chakra.span>
        )}
      </chakra.label>
    )
  },
) as RadioWithSubcomponentProps

Radio.displayName = 'Radio'

/**
 * Components to support the "Others" option.
 */

const [RadioWithOthersStylesProvider, useRadioWithOthersStyles] =
  createStylesContext('Radio')

/**
 * Wrapper for the radio part of the Others option.
 */
const OthersRadio = forwardRef<RadioProps, 'input'>((props, ref) => {
  const { othersRadioRef, othersInputRef } = useRadioGroupWithOthers()
  const { value: valueProp } = props
  const styles = useRadioWithOthersStyles()

  const mergedRadioRef = useMergeRefs(othersRadioRef, ref)

  const group = useRadioGroupContext()

  let isChecked = props.isChecked
  if (group?.value != null && valueProp != null) {
    isChecked = group.value === valueProp
  }

  useEffect(() => {
    if (isChecked) {
      othersInputRef.current?.focus()
    }
  }, [isChecked, othersInputRef])

  return (
    <Radio ref={mergedRadioRef} {...props} __css={styles.othersRadio}>
      Other
    </Radio>
  )
})

OthersRadio.displayName = 'OthersRadio'

/**
 * Wrapper for the input part of the Others option.
 */
export const OthersInput = forwardRef<InputProps, 'input'>(
  ({ onChange, ...props }, ref) => {
    const { othersRadioRef, othersInputRef } = useRadioGroupWithOthers()
    const styles = useRadioWithOthersStyles()

    const mergedInputRef = useMergeRefs(othersInputRef, ref)

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      // If user is typing text in the input, ensure the "Others" option is selected
      if (e.target.value && !othersRadioRef.current?.checked) {
        othersRadioRef.current?.click()
      }
      onChange?.(e)
    }

    return (
      <Input
        sx={styles.othersInput}
        ref={mergedInputRef}
        {...props}
        onChange={handleInputChange}
      />
    )
  },
)

OthersInput.displayName = 'OthersInput'

export interface OthersProps extends RadioProps {
  children: React.ReactNode
}

const OthersWrapper = forwardRef<OthersProps, 'input'>(
  ({ children, size, colorScheme, ...props }, ref) => {
    const group = useRadioGroupContext()
    const styles = useMultiStyleConfig('Radio', {
      size,
      colorScheme,
      ...group,
    })

    return (
      <RadioWithOthersStylesProvider value={styles}>
        <Box __css={styles.othersContainer}>
          <OthersRadio {...props} ref={ref} />
          {children}
        </Box>
      </RadioWithOthersStylesProvider>
    )
  },
)

OthersWrapper.displayName = 'OthersWrapper'

Radio.OthersWrapper = OthersWrapper
Radio.RadioGroup = RadioGroup
Radio.OthersInput = OthersInput

Radio.OthersWrapper.displayName = 'Radio.OthersWrapper'
Radio.RadioGroup.displayName = 'Radio.RadioGroup'
Radio.OthersInput.displayName = 'Radio.OthersInput'
