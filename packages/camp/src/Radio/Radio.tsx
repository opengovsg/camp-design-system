import {
  type ChangeEventHandler,
  forwardRef,
  type ReactNode,
  useEffect,
} from 'react'
import {
  mergeRefs,
  RadioGroup as ChakraRadioGroup,
  type RadioGroupItemProps as ChakraRadioGroupItemProps,
} from '@chakra-ui/react'

import { Input, type InputProps } from '~/Input'

import { RadioGroup } from './RadioGroup'
import { useRadioGroupWithOthers } from './useRadioGroupWithOthers'

export interface RadioProps
  extends Omit<ChakraRadioGroupItemProps, 'children'> {
  /** Value identifying this radio within its parent `Radio.RadioGroup`. */
  value: string
  children?: ReactNode
  disabled?: boolean
}

type ChildrenProps = React.PropsWithChildren<Record<string, unknown>>
const Item = ChakraRadioGroup.Item as unknown as React.FC<
  ChildrenProps & { value: string }
>
const ItemControl = ChakraRadioGroup.ItemControl as React.FC<ChildrenProps>
const ItemText = ChakraRadioGroup.ItemText as React.FC<ChildrenProps>

const RadioInner = forwardRef<HTMLInputElement, RadioProps>(
  ({ children, value, ...props }, ref) => (
    <Item value={value} {...props}>
      <ChakraRadioGroup.ItemHiddenInput ref={ref} />
      <ItemControl>
        <ChakraRadioGroup.ItemIndicator />
      </ItemControl>
      {children ? <ItemText>{children}</ItemText> : null}
    </Item>
  ),
)
RadioInner.displayName = 'Radio'

// --- "Others" compound ----------------------------------------------------

export interface RadioOthersWrapperProps extends RadioProps {
  children: ReactNode
}

const OthersWrapper = forwardRef<HTMLInputElement, RadioOthersWrapperProps>(
  ({ children, value, ...props }, ref) => {
    const { othersRadioRef } = useRadioGroupWithOthers()
    const mergedRef = mergeRefs(othersRadioRef, ref)

    return (
      <>
        <RadioInner ref={mergedRef} value={value} {...props}>
          Other
        </RadioInner>
        {children}
      </>
    )
  },
)
OthersWrapper.displayName = 'Radio.OthersWrapper'

interface OthersInputProps extends InputProps {
  /**
   * Called by `Radio.OthersInput` to flip the parent group's selected value
   * to the "Others" sentinel when the user types in the text input. Pass the
   * setter from the controlled `Radio.RadioGroup`.
   */
  onOthersSelect?: () => void
}

const OthersInput = forwardRef<HTMLInputElement, OthersInputProps>(
  ({ onChange, onOthersSelect, ...props }, ref) => {
    const { othersRadioRef, othersInputRef } = useRadioGroupWithOthers()
    const mergedRef = mergeRefs(othersInputRef, ref)

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      if (e.target.value && !othersRadioRef.current?.checked) {
        onOthersSelect?.()
      }
      onChange?.(e)
    }

    return <Input ref={mergedRef} {...props} onChange={handleChange} />
  },
)
OthersInput.displayName = 'Radio.OthersInput'

// Component that focuses the others input when the "Others" radio is checked.
// Place inside a RadioGroup to wire focus behaviour without extra props on
// every radio.
const OthersFocusBridge = ({
  isOthersChecked,
}: {
  isOthersChecked: boolean
}) => {
  const { othersInputRef } = useRadioGroupWithOthers()
  useEffect(() => {
    if (isOthersChecked) othersInputRef.current?.focus()
  }, [isOthersChecked, othersInputRef])
  return null
}
OthersFocusBridge.displayName = 'Radio.OthersFocusBridge'

export const Radio = Object.assign(RadioInner, {
  RadioGroup,
  OthersWrapper,
  OthersInput,
  OthersFocusBridge,
})
