import { MouseEvent, useCallback, useMemo } from 'react'
import { Icon } from '@chakra-ui/react'

import { ComboboxItem, useSelectContext } from '~/SingleSelect'
import { itemToIcon, itemToLabelString } from '~/SingleSelect/utils'
import { Tag, TagCloseButton, TagLabel } from '~/Tag'

import { useMultiSelectContext } from '../../MultiSelectContext'

export interface MultiSelectItemProps<
  Item extends ComboboxItem = ComboboxItem,
> {
  item: Item
  index: number
}

export const MultiSelectItem = ({
  item,
  index,
}: MultiSelectItemProps): JSX.Element => {
  const {
    isDisabled,
    isReadOnly,
    setIsFocused,
    closeMenu,
    isOpen,
    styles,
    size,
  } = useSelectContext()
  const {
    getSelectedItemProps,
    removeSelectedItem,
    colorScheme,
    isStretchLayout,
  } = useMultiSelectContext()

  const itemMeta = useMemo(() => {
    return {
      label: itemToLabelString(item),
      icon: itemToIcon(item),
    }
  }, [item])

  const handleRemoveItem = useCallback(
    (e: MouseEvent) => {
      // Required so tag can properly gain focus without the parent from
      // stealing focus due to parent's onClick handler.
      e.stopPropagation()
      if (isDisabled || isReadOnly) return
      removeSelectedItem(item)
    },
    [isDisabled, isReadOnly, item, removeSelectedItem],
  )

  const handleTagClick = useCallback(
    (e: MouseEvent) => {
      // Required so tag can properly gain focus without the parent from
      // stealing focus due to parent's onClick handler.
      e.stopPropagation()
      if (isDisabled || isReadOnly) return
      setIsFocused(true)
      if (isOpen) {
        closeMenu()
      }
    },
    [closeMenu, isDisabled, isOpen, isReadOnly, setIsFocused],
  )

  const tagStyles = useMemo(() => {
    if (!isStretchLayout) return styles.tag
    return {
      ...styles.tag,
      width: '100%',
    }
  }, [isStretchLayout, styles.tag])

  return (
    <Tag
      title={itemMeta.label}
      sx={tagStyles}
      size={size}
      colorScheme={colorScheme}
      {...getSelectedItemProps({
        selectedItem: item,
        index,
        disabled: isDisabled,
        onKeyDown: (event) => {
          if (
            (isDisabled || isReadOnly) &&
            (event.key === 'Backspace' || event.key === 'Delete')
          ) {
            // Prevent Downshift's default behavior where backspace or delete will
            // remove the item from selection regardless of whether the input is disabled.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            event.nativeEvent.preventDownshiftDefault = true
          }
        },
        onClick: handleTagClick,
      })}
    >
      {itemMeta.icon ? (
        <Icon
          aria-hidden
          as={itemMeta.icon}
          sx={styles.tagIcon}
          aria-readonly={isReadOnly}
          aria-disabled={isDisabled}
        />
      ) : null}
      <TagLabel>{itemMeta.label}</TagLabel>
      <TagCloseButton
        tabIndex={-1}
        aria-hidden
        isDisabled={isDisabled || isReadOnly}
        onClick={handleRemoveItem}
      />
    </Tag>
  )
}
