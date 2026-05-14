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
 * v1 used Chakra v2's `<AvatarBadge />`; v3 dropped that slot, so this is a
 * thin re-implementation that absolutely-positions a circular `Box` inside
 * the avatar. Default colour is `utility.feedback.critical` (red — common
 * for unread/notification dots); pass `bg` to override.
 *
 * The size is computed as 20% of the parent avatar (+ 2px to account for the
 * 1px white border on each side), mirroring v1's behaviour. The parent
 * `Avatar.Root` is `position: relative` by default (v3 recipe), so absolute
 * positioning anchors correctly without extra setup.
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
