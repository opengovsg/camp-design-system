import { forwardRef, PropsWithChildren, useCallback, useMemo } from 'react'
import {
  Box,
  chakra,
  Flex,
  Icon,
  SystemStyleObject,
  useMergeRefs,
} from '@chakra-ui/react'

import { BxsChevronDown, BxsChevronUp } from '~/icons'
import { useSelectContext } from '~/SingleSelect'

import { useMultiSelectContext } from '../../MultiSelectContext'

import { SelectedItems } from './SelectedItems'

const MultiItemsContainer = ({ children }: PropsWithChildren) => {
  const { styles } = useSelectContext()
  const { isStretchLayout } = useMultiSelectContext()

  const containerStyles = useMemo(() => {
    if (isStretchLayout)
      return {
        columnGap: '0',
      }
    return {}
  }, [isStretchLayout])

  return (
    <Box __css={styles.itemContainer} {...containerStyles}>
      {children}
    </Box>
  )
}

export const MultiSelectCombobox = forwardRef<HTMLInputElement>(
  (_props, ref): JSX.Element => {
    const {
      getInputProps,
      styles,
      isDisabled,
      isReadOnly,
      isRequired,
      placeholder,
      setIsFocused,
      isFocused,
      isOpen,
      toggleMenu,
      isInvalid,
      isSearchable,
      inputRef,
      getToggleButtonProps,
    } = useSelectContext()

    const { getDropdownProps, selectedItems } = useMultiSelectContext()

    const mergedRefs = useMergeRefs(inputRef, ref)

    const handleToggleMenu = useCallback(() => {
      if (isDisabled || isReadOnly) return
      if (!isOpen) {
        inputRef?.current?.focus()
      }
      toggleMenu()
      setIsFocused(true)
    }, [inputRef, isDisabled, isOpen, isReadOnly, setIsFocused, toggleMenu])

    /**
     * So faux input gets correctly blurred when navigated away.
     */
    const handleInputTabKeydown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Tab') {
          setIsFocused(false)
        }
      },
      [setIsFocused],
    )

    const focusInputStyles: SystemStyleObject = useMemo(() => {
      if (isFocused || selectedItems.length === 0) return {}
      return {
        width: 0,
        padding: 0,
        flex: 0,
      }
    }, [isFocused, selectedItems.length])

    return (
      <Flex
        aria-disabled={isDisabled}
        aria-invalid={isInvalid}
        aria-readonly={isReadOnly}
        __css={styles.fieldwrapper}
        onClick={handleToggleMenu}
      >
        <MultiItemsContainer>
          <SelectedItems />
          <chakra.input
            placeholder={placeholder}
            __css={styles.field}
            {...focusInputStyles}
            {...getInputProps({
              ...getDropdownProps({
                ref: mergedRefs,
                // We do not remove focus on blur since the focus state
                // refers to the entire field and not just this input.
                onFocus: () => setIsFocused(true),
                onKeyDown: handleInputTabKeydown,
                readOnly: isReadOnly || !isSearchable,
                disabled: isDisabled,
              }),
              required: isRequired,
              'aria-expanded': !!isOpen,
            })}
          />
        </MultiItemsContainer>
        <Box
          as="button"
          type="button"
          _disabled={{
            cursor: 'not-allowed',
          }}
          alignSelf="flex-start"
          sx={styles.chevron}
          aria-label={`${isOpen ? 'Close' : 'Open'} dropdown options`}
          {...getToggleButtonProps({
            disabled: isDisabled || isReadOnly,
            // Allow navigation to this button with screen readers.
            tabIndex: 0,
            // onClick needs to be defined on the toggle button itself to allow
            // screen readers to activate the click action, but need to stop
            // bubbling up to the parent to avoid double-toggling
            onClick: (e) => e.stopPropagation(),
          })}
        >
          <Icon
            as={isOpen ? BxsChevronUp : BxsChevronDown}
            aria-disabled={isDisabled || isReadOnly}
          />
        </Box>
      </Flex>
    )
  },
)

MultiSelectCombobox.displayName = 'MultiSelectCombobox'
