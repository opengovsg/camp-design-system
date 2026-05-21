import { forwardRef } from 'react'
import {
  Badge as ChakraBadge,
  type BadgeProps as ChakraBadgeProps,
} from '@chakra-ui/react'

import type { BadgeColorPalette } from '~/theme/recipes/badge.recipe'

export interface BadgeProps extends Omit<ChakraBadgeProps, 'colorPalette'> {
  /**
   * Color palette of the badge.
   */
  colorPalette?: ChakraBadgeProps['colorPalette'] | BadgeColorPalette
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ colorPalette = 'main', ...props }, ref) => (
    <ChakraBadge ref={ref} colorPalette={colorPalette} {...props} />
  ),
)
Badge.displayName = 'Badge'
