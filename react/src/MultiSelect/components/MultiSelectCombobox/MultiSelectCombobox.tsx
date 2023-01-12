import { forwardRef, PropsWithChildren, useCallback } from 'react'
import {
  Box,
  chakra,
  Flex,
  Icon,
  useMergeRefs,
  VisuallyHidden,
} from '@chakra-ui/react'

import { BxsChevronDown, BxsChevronUp } from '~/icons'
import { useSelectContext } from '~/SingleSelect'

import { useMultiSelectContext } from '../../MultiSelectContext'

import { SelectedItems } from './SelectedItems'

const MultiItemsContainer = ({ children }: PropsWithChildren) => {
  const { styles } = useSelectContext()
  return <Box sx={styles.itemContainer}>{children}</Box>
}

export const MultiSelectCombobox = forwardRef<HTMLInputElement>(
  (_props, ref): JSX.Element => {
    const {
      getComboboxProps,
      getInputProps,
      styles,
      isDisabled,
      isReadOnly,
      isRequired,
      placeholder,
      setIsFocused,
      isOpen,
      toggleMenu,
      isInvalid,
      inputRef,
      inputAria,
    } = useSelectContext()

    const { getDropdownProps } = useMultiSelectContext()

    const mergedRefs = useMergeRefs(inputRef, ref)

    const handleWrapperClick = useCallback(() => {
      if (isDisabled || isReadOnly) return
      setIsFocused(true)
      toggleMenu()
      if (!isOpen) {
        inputRef?.current?.focus()
      }
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

    return (
      <Flex
        aria-disabled={isDisabled}
        aria-invalid={isInvalid}
        aria-readonly={isReadOnly}
        __css={styles.fieldwrapper}
        {...getComboboxProps({
          disabled: isDisabled,
          readOnly: isReadOnly,
          required: isRequired,
          'aria-expanded': !!isOpen,
          onClick: handleWrapperClick,
        })}
      >
        <VisuallyHidden id={inputAria.id}>{inputAria.label}</VisuallyHidden>
        <MultiItemsContainer>
          <SelectedItems />
          <chakra.input
            placeholder={placeholder}
            __css={styles.field}
            {...getInputProps(
              getDropdownProps({
                ref: mergedRefs,
                onFocus: () => setIsFocused(true),
                onKeyDown: handleInputTabKeydown,
                readOnly: isReadOnly,
                disabled: isDisabled,
                'aria-describedby': inputAria.id,
              }),
            )}
          />
        </MultiItemsContainer>
        <Box aria-disabled={isDisabled} sx={styles.chevron}>
          <Icon
            as={isOpen ? BxsChevronUp : BxsChevronDown}
            aria-label={`${isOpen ? 'Close' : 'Open'} dropdown options icon`}
            aria-disabled={isDisabled}
          />
        </Box>
      </Flex>
    )
  },
)
