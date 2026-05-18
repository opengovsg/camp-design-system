import { type ReactNode } from 'react'
import {
  CloseButton as ChakraCloseButton,
  type CloseButtonProps as ChakraCloseButtonProps,
  Popover,
} from '@chakra-ui/react'

import { BxX } from '~/icons'

export interface PopoverCloseButtonProps
  extends Omit<ChakraCloseButtonProps, 'children'> {
  children?: ReactNode
}

type ChildrenProps = React.PropsWithChildren<{ asChild?: boolean }>
const CloseTrigger = Popover.CloseTrigger as React.FC<ChildrenProps>

/** Close button paired with `Popover.CloseTrigger`. Defaults to BxX at 1.25rem. */
export const PopoverCloseButton = ({
  children = <BxX fontSize="1.25rem" />,
  ...props
}: PopoverCloseButtonProps): JSX.Element => (
  <CloseTrigger asChild>
    <ChakraCloseButton variant="ghost" {...props}>
      {children}
    </ChakraCloseButton>
  </CloseTrigger>
)
PopoverCloseButton.displayName = 'PopoverCloseButton'
