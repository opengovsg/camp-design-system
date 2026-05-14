import { forwardRef } from 'react'
import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
  type IconProps,
} from '@chakra-ui/react'

import { Spinner } from '~/Spinner'
import type { ButtonColorPalette } from '~/theme/recipes/button.recipe'

export interface ButtonProps extends Omit<ChakraButtonProps, 'colorPalette'> {
  /**
   * Specifies whether the button is full-width.
   * If so, set button width to 100%, height to auto, padding to 15px.
   */
  isFullWidth?: boolean

  /**
   * Loading spinner font size. Defaults to `1.5rem`.
   */
  spinnerFontSize?: IconProps['fontSize']

  /**
   * Color palette of button.
   */
  colorPalette?: ChakraButtonProps['colorPalette'] | ButtonColorPalette
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, spinnerFontSize, isFullWidth, colorPalette = 'main', ...props },
    ref,
  ) => {
    return (
      <ChakraButton
        ref={ref}
        colorPalette={colorPalette}
        spinner={<Spinner fontSize={spinnerFontSize ?? '1.5rem'} />}
        {...props}
        {...(isFullWidth ? { w: '100%', p: '15px', h: 'auto' } : {})}
      >
        {children}
      </ChakraButton>
    )
  },
)

Button.displayName = 'Button'
