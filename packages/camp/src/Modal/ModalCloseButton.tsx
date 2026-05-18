import { type ReactNode } from 'react'
import {
  CloseButton as ChakraCloseButton,
  type CloseButtonProps as ChakraCloseButtonProps,
  Dialog,
} from '@chakra-ui/react'

import { BxX } from '~/icons'

export interface CloseButtonProps
  extends Omit<ChakraCloseButtonProps, 'children'> {
  children?: ReactNode
}

type ChildrenProps = React.PropsWithChildren<{ asChild?: boolean }>
const CloseTrigger = Dialog.CloseTrigger as React.FC<ChildrenProps>

/**
 * Close button paired with `Dialog.CloseTrigger`. Defaults to the camp BxX
 * icon and the v1 `variant="clear"` styling. Use inside a `Dialog.Root`:
 *
 * ```tsx
 * <Dialog.CloseTrigger asChild>
 *   <ModalCloseButton />
 * </Dialog.CloseTrigger>
 * ```
 */
export const CloseButton = ({
  children = <BxX fontSize="2rem" />,
  ...props
}: CloseButtonProps): JSX.Element => (
  <CloseTrigger asChild>
    <ChakraCloseButton variant="ghost" {...props}>
      {children}
    </ChakraCloseButton>
  </CloseTrigger>
)
CloseButton.displayName = 'ModalCloseButton'
