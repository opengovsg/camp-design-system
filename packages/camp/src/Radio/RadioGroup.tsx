import { type ReactNode, useRef } from 'react'
import {
  RadioGroup as ChakraRadioGroup,
  type RadioGroupRootProps as ChakraRadioGroupRootProps,
} from '@chakra-ui/react'

import { RadioGroupContext } from './useRadioGroupWithOthers'

export interface RadioGroupProps
  extends Omit<ChakraRadioGroupRootProps, 'children'> {
  children?: ReactNode
}

type ChildrenProps = React.PropsWithChildren<Record<string, unknown>>
const Root = ChakraRadioGroup.Root as React.FC<ChildrenProps>

export const RadioGroup = ({ children, ...props }: RadioGroupProps) => {
  const othersRadioRef = useRef<HTMLInputElement>(null)
  const othersInputRef = useRef<HTMLInputElement>(null)

  return (
    <RadioGroupContext.Provider value={{ othersRadioRef, othersInputRef }}>
      <Root {...props}>{children}</Root>
    </RadioGroupContext.Provider>
  )
}
RadioGroup.displayName = 'Radio.RadioGroup'
