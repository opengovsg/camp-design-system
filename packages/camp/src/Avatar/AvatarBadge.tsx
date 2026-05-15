import { Box, type BoxProps } from '@chakra-ui/react'

export interface AvatarBadgeProps extends BoxProps {
  /**
   * Position of the badge relative to the parent `Avatar.Root`.
   * @default 'bottom-end'
   */
  placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
}

const PLACEMENT_STYLES = {
  'top-start': { top: '-1.5px', insetInlineStart: '-1.5px' },
  'top-end': { top: '-1.5px', insetInlineEnd: '-1.5px' },
  'bottom-start': { bottom: '-1.5px', insetInlineStart: '-1.5px' },
  'bottom-end': { bottom: '-1.5px', insetInlineEnd: '-1.5px' },
} as const

/**
 * A notification indicator dot positioned at a corner of an `Avatar.Root`.
 * Defaults to a red dot at `bottom-end`; pass `bg` and `placement` to
 * override.
 *
 * @example
 * ```tsx
 * <Avatar.Root>
 *   <Avatar.Fallback name="ABC" />
 *   <Avatar.Badge />
 * </Avatar.Root>
 * ```
 */
export const AvatarBadge = ({
  placement = 'bottom-end',
  ...props
}: AvatarBadgeProps) => (
  <Box
    position="absolute"
    bg="utility.feedback.critical"
    border="1px solid"
    borderColor="utility.ui"
    borderRadius="full"
    width="calc(20% + 2px)"
    height="calc(20% + 2px)"
    {...PLACEMENT_STYLES[placement]}
    {...props}
  />
)
AvatarBadge.displayName = 'Avatar.Badge'
