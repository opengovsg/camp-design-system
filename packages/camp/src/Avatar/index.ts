import { Avatar as ChakraAvatar } from '@chakra-ui/react'

import { AvatarBadge } from './AvatarBadge'

export type { AvatarBadgeProps } from './AvatarBadge'
export type { AvatarGroupProps, AvatarRootProps } from '@chakra-ui/react'
export { AvatarGroup } from '@chakra-ui/react'

// Attach `Badge` to the Chakra namespace so the compound shape stays uniform:
//   <Avatar.Root>
//     <Avatar.Fallback name="…" />
//     <Avatar.Badge />          ← restored v1 feature, dropped by v3
//   </Avatar.Root>
//
// v1 used Chakra v2's `<AvatarBadge />`; v3 removed the slot entirely.
// `Avatar.Badge` is our re-implementation — see ./AvatarBadge.tsx.
//
// Note: v3's `Avatar` namespace is frozen (`Object.isExtensible === false`),
// so we cannot `Object.assign` onto it — that throws "Cannot add property
// Badge, object is not extensible" at runtime. Spread into a new object
// instead. The explicit type annotation avoids TS2742 (the inferred type
// would reference an internal Chakra path that doesn't survive declaration
// emit).
export const Avatar: typeof ChakraAvatar & { Badge: typeof AvatarBadge } = {
  ...ChakraAvatar,
  Badge: AvatarBadge,
}
