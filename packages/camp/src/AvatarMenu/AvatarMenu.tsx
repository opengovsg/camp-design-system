import { type ReactNode } from 'react'

import { Avatar, type AvatarRootProps } from '~/Avatar'
import { Menu } from '~/Menu'

export interface AvatarMenuProps extends Omit<AvatarRootProps, 'children'> {
  /** Name shown as fallback initials inside the avatar. */
  name?: string
  /** If true, render the camp `Avatar.Badge` notification dot. */
  hasNotification?: boolean
  /** Override badge element. Defaults to `<Avatar.Badge />`. */
  badge?: JSX.Element
  /** Menu items rendered inside `<Menu.List>`. */
  children: ReactNode
  /** Initial open state of the menu. */
  defaultOpen?: boolean
}

/**
 * Compound user-menu pattern: an `<Avatar>` that opens a `<Menu>` when
 * clicked, with optional notification dot. Pair items with `Menu.Item` and
 * `Menu.Divider` inside `children`.
 */
export const AvatarMenu = ({
  name,
  hasNotification,
  defaultOpen,
  children,
  badge = <Avatar.Badge />,
  ...avatarProps
}: AvatarMenuProps): JSX.Element => (
  <Menu defaultOpen={defaultOpen}>
    {({ isOpen }) => (
      <>
        <Menu.Button
          variant="clear"
          chevronSize="1.5rem"
          aria-expanded={isOpen}
          aria-label="Open user menu"
        >
          <Avatar.Root {...avatarProps}>
            <Avatar.Fallback name={name} />
            {hasNotification ? badge : null}
          </Avatar.Root>
        </Menu.Button>
        <Menu.List>{children}</Menu.List>
      </>
    )}
  </Menu>
)
AvatarMenu.displayName = 'AvatarMenu'

/** Divider styled for the avatar-menu list. */
export const AvatarMenuDivider = Menu.Divider
