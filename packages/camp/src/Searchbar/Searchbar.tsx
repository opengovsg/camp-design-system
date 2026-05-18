import {
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from 'react'
import { Box, mergeRefs } from '@chakra-ui/react'

import { IconButton } from '~/IconButton'
import { BxSearch, BxX } from '~/icons'
import { Input, type InputProps } from '~/Input'

export interface SearchbarProps extends Omit<InputProps, 'onChange'> {
  /** Called when the user presses Enter inside the input. */
  onSearch?: (value: string) => void
  /** Default value for the search input (uncontrolled). */
  defaultValue?: string
  /** Controlled value for the search input. */
  value?: string
  /** Called on every change of the search input value. */
  onChange?: (value: string) => void
  /** Initial expanded state (uncontrolled). */
  defaultIsExpanded?: boolean
  /** Controlled expanded state. */
  isExpanded?: boolean
  /** Called when the expanded state toggles. */
  onExpansion?: (isExpanded: boolean) => void
  /** Whether to show the clear-X button when expanded. Defaults to `true`. */
  showClearButton?: boolean
  /** If true, collapse the searchbar when the clear button is clicked. */
  collapseOnClear?: boolean
  /** Whether to focus the input when expanding. Defaults to `true`. */
  focusOnExpand?: boolean
}

const useControlled = <T,>({
  defaultValue,
  value,
  onChange,
}: {
  defaultValue?: T
  value?: T
  onChange?: (v: T) => void
}) => {
  const [internal, setInternal] = useState<T | undefined>(defaultValue)
  const current = value !== undefined ? value : internal
  const set = useCallback(
    (next: T) => {
      if (value === undefined) setInternal(next)
      onChange?.(next)
    },
    [onChange, value],
  )
  return [current, set] as const
}

export const Searchbar = forwardRef<HTMLInputElement, SearchbarProps>(
  (
    {
      defaultValue,
      value: valueProp,
      onChange: onChangeProp,
      onSearch,
      defaultIsExpanded,
      isExpanded: isExpandedProp,
      onExpansion: onExpansionProp,
      showClearButton = true,
      collapseOnClear,
      focusOnExpand = true,
      size,
      ...inputProps
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLInputElement>(null)
    const inputRef = mergeRefs(innerRef, ref)

    const [value, setValue] = useControlled<string>({
      defaultValue: defaultValue ?? '',
      value: valueProp,
      onChange: onChangeProp,
    })

    const [isExpanded, setIsExpanded] = useControlled<boolean>({
      defaultValue: defaultIsExpanded ?? false,
      value: isExpandedProp,
      onChange: onExpansionProp,
    })

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) onSearch(value ?? '')
    }

    const handleClear = () => {
      setValue('')
      if (collapseOnClear) setIsExpanded(false)
      innerRef.current?.focus()
    }

    const handleExpand = () => {
      setIsExpanded(true)
      if (focusOnExpand) {
        setTimeout(() => innerRef.current?.focus(), 0)
      }
    }

    if (!isExpanded) {
      return (
        <IconButton
          aria-label="Expand search"
          onClick={handleExpand}
          variant="clear"
          size={size}
        >
          <BxSearch />
        </IconButton>
      )
    }

    return (
      <Box position="relative" flex={1}>
        <Box
          position="absolute"
          left="0.75rem"
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
          color="base.content.medium"
        >
          <BxSearch />
        </Box>
        <Input
          aria-label="Press enter to search"
          ref={inputRef}
          pl="2.5rem"
          pr={showClearButton ? '2.5rem' : undefined}
          size={size}
          onKeyDown={handleSearch}
          onChange={(e) => setValue(e.target.value)}
          value={value ?? ''}
          {...inputProps}
        />
        {showClearButton ? (
          <Box
            position="absolute"
            right="0.25rem"
            top="50%"
            transform="translateY(-50%)"
          >
            <IconButton
              aria-label="Clear search"
              onClick={handleClear}
              variant="clear"
              size={size}
            >
              <BxX />
            </IconButton>
          </Box>
        ) : null}
      </Box>
    )
  },
)
Searchbar.displayName = 'Searchbar'
