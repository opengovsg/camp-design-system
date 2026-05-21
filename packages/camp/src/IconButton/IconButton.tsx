import { forwardRef, useMemo } from 'react'
import {
  IconButton as ChakraIconButton,
  type IconButtonProps as ChakraIconButtonProps,
  type IconProps,
} from '@chakra-ui/react'

import { Spinner } from '~/Spinner'
import type { ButtonColorPalette } from '~/theme/recipes/button.recipe'

export interface IconButtonProps
  extends Omit<ChakraIconButtonProps, 'colorPalette'> {
  /** Icon font-size override. Default scales with button size. */
  fontSize?: IconProps['fontSize']
  colorPalette?: ChakraIconButtonProps['colorPalette'] | ButtonColorPalette
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ colorPalette = 'main', ...props }, ref) => {
    const iconSize = useMemo(() => {
      if (props.fontSize) return props.fontSize
      if (props.size === 'lg') return '1.5rem'
      return '1.25rem'
    }, [props.fontSize, props.size])

    return (
      <ChakraIconButton
        ref={ref}
        colorPalette={colorPalette}
        spinner={<Spinner fontSize={iconSize} />}
        {...props}
        fontSize={iconSize}
      />
    )
  },
)
IconButton.displayName = 'IconButton'
