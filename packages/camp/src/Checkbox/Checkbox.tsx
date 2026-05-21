import { forwardRef, type ReactNode, useRef } from 'react'
import {
  Box,
  Checkbox as ChakraCheckbox,
  type CheckboxRootProps as ChakraCheckboxRootProps,
  mergeRefs,
  useSlotRecipe,
} from '@chakra-ui/react'

import { Input, type InputProps } from '~/Input'

import { CheckboxOthersContext, useCheckboxOthers } from './useCheckboxOthers'

export interface CheckboxProps
  extends Omit<ChakraCheckboxRootProps, 'children'> {
  children?: ReactNode
}

type ChildrenProps = React.PropsWithChildren<Record<string, unknown>>
const Control = ChakraCheckbox.Control as React.FC<ChildrenProps>
const Label = ChakraCheckbox.Label as React.FC<ChildrenProps>

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IndeterminateIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const CheckboxInner = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ children, ...props }, ref) => {
    return (
      <ChakraCheckbox.Root {...props}>
        <ChakraCheckbox.HiddenInput ref={ref} />
        <Control>
          <ChakraCheckbox.Indicator indeterminate={<IndeterminateIcon />}>
            <CheckIcon />
          </ChakraCheckbox.Indicator>
        </Control>
        {children ? <Label>{children}</Label> : null}
      </ChakraCheckbox.Root>
    )
  },
)
CheckboxInner.displayName = 'Checkbox'

// --- "Others" compound ----------------------------------------------------

export interface CheckboxOthersWrapperProps {
  size?: 'xs' | 'sm' | 'md'
  children: ReactNode
}

const OthersWrapper = ({
  children,
  size = 'md',
}: CheckboxOthersWrapperProps) => {
  const checkboxRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recipe = useSlotRecipe({ key: 'checkbox' })
  const styles = recipe({ size })

  return (
    <CheckboxOthersContext.Provider value={{ checkboxRef, inputRef }}>
      <Box css={styles.othersContainer}>{children}</Box>
    </CheckboxOthersContext.Provider>
  )
}
OthersWrapper.displayName = 'Checkbox.OthersWrapper'

const OthersCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const { checkboxRef, inputRef } = useCheckboxOthers()
    const mergedRef = mergeRefs(checkboxRef, ref)

    const handleCheckedChange = (details: {
      checked: boolean | 'indeterminate'
    }) => {
      if (details.checked === true) inputRef.current?.focus()
      props.onCheckedChange?.(
        details as Parameters<
          NonNullable<ChakraCheckboxRootProps['onCheckedChange']>
        >[0],
      )
    }

    return (
      <CheckboxInner
        ref={mergedRef}
        {...props}
        onCheckedChange={handleCheckedChange}
      >
        Other
      </CheckboxInner>
    )
  },
)
OthersCheckbox.displayName = 'Checkbox.OthersCheckbox'

const OthersInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { checkboxRef, inputRef } = useCheckboxOthers()
  const mergedRef = mergeRefs(inputRef, ref)
  const recipe = useSlotRecipe({ key: 'checkbox' })
  const styles = recipe({})

  return (
    <Input
      ref={mergedRef}
      css={styles.othersInput}
      {...props}
      onChange={(e) => {
        if (e.target.value && !checkboxRef.current?.checked) {
          checkboxRef.current?.click()
        }
        props.onChange?.(e)
      }}
    />
  )
})
OthersInput.displayName = 'Checkbox.OthersInput'

export const Checkbox = Object.assign(CheckboxInner, {
  OthersWrapper,
  OthersCheckbox,
  OthersInput,
})
