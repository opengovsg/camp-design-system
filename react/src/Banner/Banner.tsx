import { useMemo } from 'react'
import {
  As,
  Box,
  CloseButton,
  Collapse,
  Flex,
  Icon,
  ThemingProps,
  useDisclosure,
  useMultiStyleConfig,
} from '@chakra-ui/react'

import { BxsErrorCircle, BxsInfoCircle, BxX } from '~/icons'

export interface BannerProps {
  variant?: ThemingProps<'Banner'>['variant']
  children: React.ReactNode
  /**
   * Whether to allow collapsing of the banner.
   * Defaults to `true` if `info` variant is used, `false` otherwise.
   */
  isDismissable?: boolean
  /**
   * The icon to use for the banner. Defaults to the variant's icon.
   */
  icon?: As
  /**
   * The close button to use for the banner.
   * Defaults to the variant's close button.
   * If `null`, the close button will not be rendered.
   */
  closeButton?: React.ReactNode
}

export const Banner = ({
  variant = 'info',
  children,
  isDismissable: isDismissableProp,
  icon: iconProp,
  closeButton,
}: BannerProps): JSX.Element => {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: true,
  })

  const styles = useMultiStyleConfig('Banner', { variant })

  const iconToUse = useMemo(() => {
    if (iconProp) {
      return iconProp
    }
    return variant === 'info' ? BxsInfoCircle : BxsErrorCircle
  }, [iconProp, variant])

  const isDismissable = useMemo(() => {
    if (isDismissableProp !== undefined) {
      return isDismissableProp
    }
    return variant === 'info'
  }, [isDismissableProp, variant])

  const closeButtonRendered = useMemo(() => {
    if (!isDismissable) return null
    if (closeButton !== undefined) return closeButton
    return (
      <CloseButton children={<BxX />} onClick={onToggle} sx={styles.close} />
    )
  }, [closeButton, isDismissable, onToggle, styles.close])

  return (
    <Collapse in={isOpen} animateOpacity>
      <Box __css={styles.banner}>
        <Flex sx={styles.item}>
          <Flex>
            <Icon as={iconToUse} __css={styles.icon} />
            {children}
          </Flex>
          {closeButtonRendered}
        </Flex>
      </Box>
    </Collapse>
  )
}
