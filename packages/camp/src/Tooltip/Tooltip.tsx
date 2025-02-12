import { ElementType, useState } from 'react'
import {
  Box,
  SystemStyleObject,
  Tooltip as ChakraTooltip,
  TooltipProps as ChakraTooltipProps,
  VisuallyHidden,
} from '@chakra-ui/react'

export interface TouchableTooltipProps
  extends Omit<ChakraTooltipProps, 'delay'> {
  /**
   * Styles for the container which wraps the children.
   */
  wrapperStyles?: SystemStyleObject
  wrapperAs?: ElementType
}

/** @deprecated Use TouchableTooltipProps instead */
export interface TooltipProps extends TouchableTooltipProps {}

/**
 * This component allows for touchable tooltips on mobile.
 *
 * Only use this component if you want the tooltip to be triggerable on mobile, otherwise
 * use the `Tooltip` component.
 *
 * The component will not support the `delay` prop as the tooltip will open instantly when touched.
 */
export const TouchableTooltip = ({
  children,
  wrapperStyles,
  wrapperAs,
  ...props
}: TouchableTooltipProps): JSX.Element => {
  // ChakraTooltip does not work on mobile by design. (see
  // https://github.com/chakra-ui/chakra-ui/issues/2691)
  // Hence adapt the tooltip to open when clicked on mobile
  const [isLabelOpen, setIsLabelOpen] = useState(!!props.isOpen)
  return (
    <>
      <ChakraTooltip hasArrow {...props} isOpen={isLabelOpen}>
        <Box
          as={wrapperAs ?? 'span'}
          onMouseEnter={() => setIsLabelOpen(true)}
          onMouseLeave={() => setIsLabelOpen(false)}
          onClick={() => setIsLabelOpen((currentState) => !currentState)}
          verticalAlign="middle"
          sx={wrapperStyles}
        >
          {children}
        </Box>
      </ChakraTooltip>
      <VisuallyHidden>{props.label}</VisuallyHidden>
    </>
  )
}

TouchableTooltip.displayName = 'TouchableTooltip'

/**
 * @deprecated Use `TouchableTooltip` instead.
 *
 * If you need to use the `delay` prop, use ChakraUI's `Tooltip` component instead.
 * This is because the current tooltip implementation does not support the `delay` prop
 * as the tooltip will open instantly when touched (for mobile compatibility).
 */
export const Tooltip = TouchableTooltip
