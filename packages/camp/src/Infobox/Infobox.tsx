import { forwardRef, useMemo } from 'react'
import {
  Box,
  Flex,
  type FlexProps,
  Icon,
  useSlotRecipe,
} from '@chakra-ui/react'

import { BxsCheckCircle, BxsErrorCircle, BxsInfoCircle } from '~/icons'
import type { InfoboxVariant } from '~/theme/slotRecipes/infobox.slotRecipe'

export interface InfoboxProps extends Omit<FlexProps, 'children'> {
  size?: 'sm' | 'md'
  variant?: InfoboxVariant
  /**
   * Content rendered inside the infobox alongside the variant icon.
   */
  children: React.ReactNode
  /**
   * Icon shown on the left. Defaults to a built-in icon matching `variant`.
   * Pass `null` to hide.
   */
  icon?: React.ReactNode
}

const DEFAULT_ICON_BY_VARIANT: Record<InfoboxVariant, React.ElementType> = {
  info: BxsInfoCircle,
  warning: BxsInfoCircle,
  success: BxsCheckCircle,
  error: BxsErrorCircle,
}

export const Infobox = forwardRef<HTMLDivElement, InfoboxProps>(
  ({ variant = 'info', size = 'md', icon, children, ...flexProps }, ref) => {
    const recipe = useSlotRecipe({ key: 'infobox' })
    const styles = useMemo(
      () => recipe({ variant, size }),
      [recipe, variant, size],
    )

    const iconNode = useMemo(() => {
      if (icon === null) return null
      if (icon !== undefined) {
        return <Box css={styles.icon}>{icon}</Box>
      }
      const IconComponent = DEFAULT_ICON_BY_VARIANT[variant]
      return <Icon as={IconComponent} css={styles.icon} />
    }, [icon, styles.icon, variant])

    return (
      <Flex ref={ref} css={styles.messagebox} {...flexProps}>
        {iconNode}
        {children}
      </Flex>
    )
  },
)
Infobox.displayName = 'Infobox'
