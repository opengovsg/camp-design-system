import { forwardRef } from 'react'
import ResizeTextarea, {
  type TextareaAutosizeProps,
} from 'react-textarea-autosize'
import {
  Textarea as ChakraTextarea,
  type TextareaProps as ChakraTextareaProps,
} from '@chakra-ui/react'

export interface TextareaProps extends ChakraTextareaProps {
  /** Minimum rows the textarea displays on render. Defaults to `3`. */
  minAutosizeRows?: TextareaAutosizeProps['minRows']
  /** Maximum rows the textarea grows to before scrolling. Defaults to `6`. */
  maxAutosizeRows?: TextareaAutosizeProps['maxRows']
  /** Renders the textarea with the prefilled yellow background tint. */
  isPrefilled?: boolean
  /** Renders the textarea with a green success border. */
  isSuccess?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      minAutosizeRows = 3,
      maxAutosizeRows = 6,
      isPrefilled,
      isSuccess,
      ...props
    },
    ref,
  ) => {
    return (
      <ChakraTextarea
        ref={ref}
        // `as={ResizeTextarea}` swaps the underlying element; the resize
        // props (minRows / maxRows) live on ResizeTextarea, not Textarea,
        // so cast the merged props through to silence the type.
        {...({
          as: ResizeTextarea,
          minRows: minAutosizeRows,
          maxRows: maxAutosizeRows,
          'data-prefilled': isPrefilled || undefined,
          'data-success': isSuccess || undefined,
          ...props,
        } as React.ComponentProps<typeof ChakraTextarea>)}
      />
    )
  },
)
Textarea.displayName = 'Textarea'
