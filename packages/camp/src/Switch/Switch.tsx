import { forwardRef, useMemo } from 'react'
import {
  Icon,
  Switch as ChakraSwitch,
  type SwitchRootProps as ChakraSwitchRootProps,
  useMediaQuery,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

import { BxCheck, BxLoader, BxLockAlt, BxX } from '~/icons'
import type { SwitchColorPalette } from '~/theme/slotRecipes/switch.slotRecipe'

export interface SwitchProps
  extends Omit<ChakraSwitchRootProps, 'colorPalette' | 'children'> {
  /** Icon used when the switch is checked. Defaults to a checkmark. */
  checkedIcon?: React.ElementType
  /** Icon used when the switch is unchecked. Defaults to an x. */
  uncheckedIcon?: React.ElementType
  /** Icon used when the switch is disabled. Defaults to a padlock. */
  disabledIcon?: React.ElementType
  /** Icon used when `isLoading` is true. Defaults to a spinner. */
  loadingIcon?: React.ElementType
  /** Renders a spinning loading icon and disables interaction. */
  isLoading?: boolean
  /** Label rendered alongside the switch. */
  children?: React.ReactNode
  colorPalette?: ChakraSwitchRootProps['colorPalette'] | SwitchColorPalette
}

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
})

// v3 Chakra's compound `Switch.Control` / `.Thumb` / `.Label` types omit
// `children` from their props interface, which makes JSX nesting trip TS.
// Cast each through `any` at the wrapper level to compose them safely.
const Control = ChakraSwitch.Control as React.FC<
  React.PropsWithChildren<Record<string, unknown>>
>
const Thumb = ChakraSwitch.Thumb as React.FC<
  React.PropsWithChildren<Record<string, unknown>>
>
const Label = ChakraSwitch.Label as React.FC<
  React.PropsWithChildren<Record<string, unknown>>
>

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checkedIcon = BxCheck,
      uncheckedIcon = BxX,
      disabledIcon = BxLockAlt,
      loadingIcon = BxLoader,
      isLoading = false,
      colorPalette = 'success',
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const [prefersReducedMotion] = useMediaQuery([
      '(prefers-reduced-motion: reduce)',
    ])
    const effectiveDisabled = disabled || isLoading

    const spinAnimation = useMemo(
      () => (prefersReducedMotion ? undefined : `${spin} 2.5s linear infinite`),
      [prefersReducedMotion],
    )

    let CheckedIcon = checkedIcon
    let UncheckedIcon = uncheckedIcon
    let iconAnimation: string | undefined

    if (isLoading) {
      CheckedIcon = loadingIcon
      UncheckedIcon = loadingIcon
      iconAnimation = spinAnimation
    } else if (effectiveDisabled) {
      CheckedIcon = disabledIcon
      UncheckedIcon = disabledIcon
    }

    return (
      <ChakraSwitch.Root
        colorPalette={colorPalette}
        disabled={effectiveDisabled}
        {...props}
      >
        <ChakraSwitch.HiddenInput ref={ref} />
        <Control>
          <Thumb>
            <ChakraSwitch.ThumbIndicator
              fallback={<Icon as={UncheckedIcon} animation={iconAnimation} />}
            >
              <Icon as={CheckedIcon} animation={iconAnimation} />
            </ChakraSwitch.ThumbIndicator>
          </Thumb>
        </Control>
        {children ? <Label>{children}</Label> : null}
      </ChakraSwitch.Root>
    )
  },
)
Switch.displayName = 'Switch'
