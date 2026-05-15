import { type ElementType, useMemo } from 'react'
import {
  Box,
  CloseButton,
  Flex,
  Icon,
  useDisclosure,
  useSlotRecipe,
} from '@chakra-ui/react'

import { BxsErrorCircle, BxsInfoCircle, BxX } from '~/icons'
import type { BannerVariant } from '~/theme/slotRecipes/banner.slotRecipe'

export interface BannerProps {
  variant?: BannerVariant
  size?: 'sm' | 'md'
  children: React.ReactNode
  /**
   * Whether the banner can be dismissed.
   * Defaults to `true` for the `info` variant and `false` otherwise.
   */
  isDismissable?: boolean
  /**
   * Icon to render at the start. Defaults to the variant's icon.
   */
  icon?: ElementType
  /**
   * Custom close button. Pass `null` to hide it. Defaults to a built-in
   * close button.
   */
  closeButton?: React.ReactNode
}

export const Banner = ({
  variant = 'info',
  size = 'md',
  children,
  isDismissable: isDismissableProp,
  icon: iconProp,
  closeButton,
}: BannerProps): JSX.Element | null => {
  const { open, onToggle } = useDisclosure({ defaultOpen: true })

  const recipe = useSlotRecipe({ key: 'banner' })
  const styles = useMemo(
    () => recipe({ variant, size }),
    [recipe, variant, size],
  )

  const IconComponent =
    iconProp ?? (variant === 'info' ? BxsInfoCircle : BxsErrorCircle)
  const isDismissable = isDismissableProp ?? variant === 'info'

  const closeButtonRendered = useMemo(() => {
    if (!isDismissable) return null
    if (closeButton !== undefined) return closeButton
    return (
      <CloseButton onClick={onToggle} css={styles.close}>
        <BxX />
      </CloseButton>
    )
  }, [closeButton, isDismissable, onToggle, styles.close])

  if (!open) return null

  return (
    <Box css={styles.banner}>
      <Flex css={styles.item}>
        <Flex>
          <Icon as={IconComponent} css={styles.icon} />
          {children}
        </Flex>
        {closeButtonRendered}
      </Flex>
    </Box>
  )
}
