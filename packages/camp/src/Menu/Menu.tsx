import { type ReactNode, useState } from 'react'
import {
  Icon,
  Menu as ChakraMenu,
  type MenuItemProps as ChakraMenuItemProps,
  type MenuRootProps as ChakraMenuRootProps,
  type MenuSeparatorProps as ChakraMenuSeparatorProps,
} from '@chakra-ui/react'

import { Button, type ButtonProps } from '~/Button'
import { BxsChevronDown, BxsChevronUp } from '~/icons'

type ChildrenProps = React.PropsWithChildren<Record<string, unknown>>
const Trigger = ChakraMenu.Trigger as React.FC<ChildrenProps>
const Positioner = ChakraMenu.Positioner as React.FC<ChildrenProps>
const Content = ChakraMenu.Content as React.FC<ChildrenProps>

export interface MenuButtonProps extends Omit<ButtonProps, 'children'> {
  /** Whether the parent menu is currently open. Used to flip the chevron. */
  isOpen?: boolean
  /** If true, the menu button stretches to its container's full width. */
  isStretch?: boolean
  /** Font size override for the chevron icon. */
  chevronSize?: string
  children?: ReactNode
}

const MenuButton = ({
  isOpen,
  isStretch,
  chevronSize,
  children,
  ...buttonProps
}: MenuButtonProps) => {
  const ChevronIcon = (
    <Icon
      as={isOpen ? BxsChevronUp : BxsChevronDown}
      fontSize={chevronSize ?? '1.25rem'}
    />
  )

  return (
    <Trigger>
      <Button
        textAlign="left"
        justifyContent="space-between"
        width={isStretch ? '100%' : undefined}
        {...buttonProps}
      >
        {children}
        {ChevronIcon}
      </Button>
    </Trigger>
  )
}
MenuButton.displayName = 'Menu.Button'

const MenuList = ({ children }: { children: ReactNode }) => (
  <Positioner>
    <Content>{children}</Content>
  </Positioner>
)
MenuList.displayName = 'Menu.List'

const MenuItem = ChakraMenu.Item as React.FC<
  ChildrenProps & {
    value: string
    disabled?: boolean
    onClick?: (e: React.MouseEvent) => void
  }
>
const MenuDivider = ChakraMenu.Separator as React.FC<ChakraMenuSeparatorProps>

export interface MenuProps extends Omit<ChakraMenuRootProps, 'children'> {
  /** Alias for `matchWidth` — stretches the menu list to the trigger's width. */
  isStretch?: boolean
  children?: ReactNode | ((state: { isOpen: boolean }) => ReactNode)
}

/**
 * Wrapper around Chakra v3's compound `Menu`. Exposes the camp v1-ish API
 * (`<Menu><Menu.Button /><Menu.List><Menu.Item /></Menu.List></Menu>`) by
 * attaching `Button` / `List` / `Item` / `Divider` to the namespace.
 */
const MenuRoot = ({ isStretch, children, ...props }: MenuProps) => {
  const [open, setOpen] = useState(false)

  return (
    <ChakraMenu.Root
      positioning={{ gutter: 4 }}
      open={open}
      onOpenChange={(e: { open: boolean }) => setOpen(e.open)}
      {...props}
    >
      {/* Pass `open` down to consumers via context if they render a
          custom Menu.Button — they can read it via React state via the
          parent. Here we wrap children directly. */}
      {typeof children === 'function'
        ? (children as (state: { isOpen: boolean }) => ReactNode)({
            isOpen: open,
          })
        : children}
    </ChakraMenu.Root>
  )
}
MenuRoot.displayName = 'Menu'

export const Menu = Object.assign(MenuRoot, {
  Button: MenuButton,
  List: MenuList,
  Item: MenuItem,
  Divider: MenuDivider,
})

export type { ChakraMenuItemProps as MenuItemProps }
