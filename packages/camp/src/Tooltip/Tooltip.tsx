import { type ElementType, type ReactNode, useState } from 'react'
import {
  Box,
  type SystemStyleObject,
  Tooltip as ChakraTooltip,
  VisuallyHidden,
} from '@chakra-ui/react'

export interface TooltipProps {
  /** Tooltip text or content. */
  label: ReactNode
  /** Trigger element. */
  children: ReactNode
  /** Whether the tooltip is open. Pass undefined for uncontrolled. */
  isOpen?: boolean
  /** Whether to show the arrow. Defaults to `true`. */
  hasArrow?: boolean
  /** Styles applied to the trigger wrapper. */
  wrapperStyles?: SystemStyleObject
  /** Element to render as the trigger wrapper. Defaults to `'span'`. */
  wrapperAs?: ElementType
  /** Accessible label for the trigger; defaults to `label` when string-like. */
  'aria-label'?: string
}

type ChildrenProps = React.PropsWithChildren<Record<string, unknown>>
const Trigger = ChakraTooltip.Trigger as React.FC<ChildrenProps>
const Positioner = ChakraTooltip.Positioner as React.FC<ChildrenProps>
const Content = ChakraTooltip.Content as React.FC<ChildrenProps>
const Arrow = ChakraTooltip.Arrow as React.FC<ChildrenProps>

/**
 * Wraps Chakra's compound `Tooltip` so it works on touch devices: hovering
 * opens, tapping toggles, blurring closes. The label is mirrored into a
 * `VisuallyHidden` element so screen readers always read it regardless of
 * the tooltip's open state.
 */
export const Tooltip = ({
  label,
  children,
  isOpen,
  hasArrow = true,
  wrapperStyles,
  wrapperAs,
}: TooltipProps): JSX.Element => {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = isOpen ?? internalOpen

  return (
    <>
      <ChakraTooltip.Root
        open={open}
        onOpenChange={(e: { open: boolean }) => setInternalOpen(e.open)}
      >
        <Trigger>
          <Box
            as={wrapperAs ?? 'span'}
            verticalAlign="middle"
            css={wrapperStyles}
            onMouseEnter={() => setInternalOpen(true)}
            onMouseLeave={() => setInternalOpen(false)}
            onClick={() => setInternalOpen((v) => !v)}
          >
            {children}
          </Box>
        </Trigger>
        <Positioner>
          <Content>
            {hasArrow ? (
              <Arrow>
                <ChakraTooltip.ArrowTip />
              </Arrow>
            ) : null}
            {label}
          </Content>
        </Positioner>
      </ChakraTooltip.Root>
      <VisuallyHidden>{label}</VisuallyHidden>
    </>
  )
}
Tooltip.displayName = 'Tooltip'

/** @deprecated Renamed to `Tooltip`. */
export const TouchableTooltip = Tooltip

export type TouchableTooltipProps = TooltipProps
