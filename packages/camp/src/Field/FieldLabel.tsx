import { forwardRef, type ReactNode } from 'react'
import {
  Box,
  Field as ChakraField,
  Icon,
  Text,
  Tooltip,
  useSlotRecipe,
  VisuallyHidden,
} from '@chakra-ui/react'

import { BxsHelpCircle } from '~/icons'

export type FieldSize = 'sm' | 'md'

export interface FieldLabelProps {
  /** Question number prefixed before the label. */
  questionNumber?: ReactNode
  /** Tooltip text rendered next to the label as a question-mark icon. */
  tooltipText?: ReactNode
  /** Secondary description rendered below the label. */
  description?: ReactNode
  /** Label content. */
  children: ReactNode
  /** Size variant; drives label typography. */
  size?: FieldSize
  /** Whether the field is required. Suppresses the `(optional)` indicator. */
  isRequired?: boolean
  /** Additional system style overrides applied to the underlying label. */
  className?: string
}

// v3 compound sub-components omit `children` from their typed props; cast
// to children-accepting types so JSX nesting type-checks.
type ChildrenProps = React.PropsWithChildren<Record<string, unknown>>
const Label = ChakraField.Label as React.FC<
  ChildrenProps & React.RefAttributes<HTMLLabelElement>
>
const TooltipTrigger = Tooltip.Trigger as React.FC<ChildrenProps>
const TooltipPositioner = Tooltip.Positioner as React.FC<ChildrenProps>
const TooltipContent = Tooltip.Content as React.FC<ChildrenProps>

/**
 * Form-field label. Wraps Chakra's `Field.Label` with camp extensions:
 * question-number prefix, help tooltip suffix, secondary description, and an
 * `(optional)` indicator that appears when `isRequired` is falsy.
 */
export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  (
    {
      questionNumber,
      tooltipText,
      description,
      isRequired,
      size = 'md',
      children,
      className,
    },
    ref,
  ) => {
    const recipe = useSlotRecipe({ key: 'field' })
    const styles = recipe({ size })

    return (
      <Label
        ref={ref}
        className={className}
        css={styles.label}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Box>
          {questionNumber ? (
            <Text
              as="span"
              textStyle="caption-1"
              color="base.content.strong"
              mr="0.5rem"
              verticalAlign="baseline"
            >
              <VisuallyHidden>Question number:</VisuallyHidden>
              {questionNumber}
            </Text>
          ) : null}
          {children}
          {!isRequired ? (
            <Box as="span" css={styles.optionalIndicator} aria-hidden>
              (optional)
            </Box>
          ) : null}
          {tooltipText ? (
            <Tooltip.Root>
              <TooltipTrigger asChild>
                <Icon
                  as={BxsHelpCircle}
                  display="inline-block"
                  ml="0.5rem"
                  color="base.content.strong"
                  cursor="help"
                  aria-label="Label tooltip"
                />
              </TooltipTrigger>
              <TooltipPositioner>
                <TooltipContent>{tooltipText}</TooltipContent>
              </TooltipPositioner>
            </Tooltip.Root>
          ) : null}
        </Box>
        {description ? (
          <Box css={styles.helperText} aria-hidden>
            {description}
          </Box>
        ) : null}
      </Label>
    )
  },
)
FieldLabel.displayName = 'Field.Label'
