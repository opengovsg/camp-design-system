import { type ReactNode } from 'react'
import {
  CloseButton as ChakraCloseButton,
  type CloseButtonProps as ChakraCloseButtonProps,
  Drawer,
} from '@chakra-ui/react'

import { BxX } from '~/icons'

export interface DrawerCloseButtonProps
  extends Omit<ChakraCloseButtonProps, 'children'> {
  children?: ReactNode
}

type ChildrenProps = React.PropsWithChildren<{ asChild?: boolean }>
const CloseTrigger = Drawer.CloseTrigger as React.FC<ChildrenProps>

/**
 * Close button paired with `Drawer.CloseTrigger`. Defaults to a smaller
 * BxX (1.25rem) than ModalCloseButton, matching v1.
 */
export const DrawerCloseButton = ({
  children = <BxX fontSize="1.25rem" />,
  ...props
}: DrawerCloseButtonProps): JSX.Element => (
  <CloseTrigger asChild>
    <ChakraCloseButton variant="ghost" {...props}>
      {children}
    </ChakraCloseButton>
  </CloseTrigger>
)
DrawerCloseButton.displayName = 'DrawerCloseButton'
