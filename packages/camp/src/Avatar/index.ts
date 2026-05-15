import { Avatar as ChakraAvatar } from '@chakra-ui/react'

import { AvatarBadge } from './AvatarBadge'

export type { AvatarBadgeProps } from './AvatarBadge'
export type { AvatarGroupProps, AvatarRootProps } from '@chakra-ui/react'
export { AvatarGroup } from '@chakra-ui/react'

// Chakra's `Avatar` namespace is frozen; `Object.assign` throws at runtime.
// Spread into a new object. The explicit type annotation prevents `tsc
// --declaration` from emitting an internal Chakra import path.
export const Avatar: typeof ChakraAvatar & { Badge: typeof AvatarBadge } = {
  ...ChakraAvatar,
  Badge: AvatarBadge,
}
