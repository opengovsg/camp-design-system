import { forwardRef, type ReactNode, useMemo } from 'react'
import {
  Box,
  Flex,
  type SystemStyleObject,
  useSlotRecipe,
} from '@chakra-ui/react'

import { Switch, type SwitchProps } from '~/Switch'

export interface ToggleProps extends SwitchProps {
  /** Main label rendered before the switch. */
  label: string
  /** Secondary description text rendered below the label. */
  description?: ReactNode
  /** Style overrides for the container wrapping the text and switch. */
  containerStyles?: SystemStyleObject
  /** Style overrides for the main label. */
  labelStyles?: SystemStyleObject
  /** Style overrides for the description. */
  descriptionStyles?: SystemStyleObject
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      label,
      description,
      containerStyles,
      labelStyles,
      descriptionStyles,
      ...switchProps
    },
    ref,
  ) => {
    const recipe = useSlotRecipe({ key: 'toggle' })
    const styles = useMemo(() => recipe({}), [recipe])

    return (
      <Flex css={{ ...styles.overallContainer, ...containerStyles }}>
        {(label || description) && (
          <Box>
            <Box as="label" css={{ ...styles.label, ...labelStyles }}>
              {label}
            </Box>
            {description && (
              <Box css={{ ...styles.description, ...descriptionStyles }}>
                {description}
              </Box>
            )}
          </Box>
        )}
        <Switch {...switchProps} aria-label={label} ref={ref} />
      </Flex>
    )
  },
)
Toggle.displayName = 'Toggle'
