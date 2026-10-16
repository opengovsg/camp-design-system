import { List, ListItem, Portal } from '@chakra-ui/react'

import { useSelectContext } from '~/SingleSelect'
import { useSelectPopover } from '~/SingleSelect/components'
import { VirtualOptions } from '~/SingleSelect/components/VirtualOptions'

import { MultiDropdownItem } from './MultiDropdownItem'

export const MultiSelectMenu = (): JSX.Element => {
  const { getMenuProps, isOpen, items, nothingFoundLabel, styles, inputValue } =
    useSelectContext()

  const { floatingRef, floatingStyles } = useSelectPopover()

  return (
    <Portal>
      <List
        style={floatingStyles}
        {...getMenuProps(
          {
            hidden: !isOpen,
            ref: floatingRef,
          },
          {
            suppressRefError: true,
          },
        )}
        sx={styles.list}
      >
        {isOpen && items.length > 0 && (
          <VirtualOptions key={inputValue}>
            {(item, index) => <MultiDropdownItem item={item} index={index} />}
          </VirtualOptions>
        )}
        {isOpen && items.length === 0 ? (
          <ListItem role="option" sx={styles.emptyItem}>
            {nothingFoundLabel}
          </ListItem>
        ) : null}
      </List>
    </Portal>
  )
}
