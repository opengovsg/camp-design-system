import { useMemo } from 'react'
import {
  forwardRef,
  IconButton as ChakraIconButton,
  IconButtonProps as ChakraIconButtonProps,
  ThemingProps,
} from '@chakra-ui/react'

import { Spinner } from '~/Spinner'
import { ThemeButtonColorScheme } from '~/theme/components/Button'

export interface IconButtonProps extends ChakraIconButtonProps {
  /**
   * Size of the icon button.
   */
  size?: ThemingProps<'Button'>['size']

  /**
   * Color scheme of button.
   */
  colorScheme?:
    | ThemingProps<'IconButton'>['colorScheme']
    | ThemeButtonColorScheme
}

export const IconButton = forwardRef<IconButtonProps, 'button'>(
  (props, ref) => {
    const iconSize = useMemo(() => {
      if (props.fontSize) return props.fontSize

      if (props.size === 'lg') return '1.5rem'
      return '1.25rem'
    }, [props.fontSize, props.size])

    return (
      <ChakraIconButton
        ref={ref}
        spinner={<Spinner fontSize={iconSize} />}
        {...props}
        fontSize={iconSize}
      />
    )
  },
)

IconButton.displayName = 'IconButton'
