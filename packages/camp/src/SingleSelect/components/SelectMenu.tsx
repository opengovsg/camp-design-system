import { List, ListItem, Portal } from '@chakra-ui/react'

import { useSelectContext } from '../SelectContext'

import { DropdownItem } from './DropdownItem'
import { useSelectPopover } from './SelectPopover'
import { VirtualOptions } from './VirtualOptions'

export const SelectMenu = (): JSX.Element => {
  const { getMenuProps, inputValue, isOpen, items, nothingFoundLabel, styles } =
    useSelectContext()

  const { floatingRef, floatingStyles } = useSelectPopover()

  return (
    <Portal>
      <List
        {...getMenuProps(
          { ref: floatingRef },
          // Suppressing ref error since this will be in a portal and will be conditionally rendered.
          // See https://github.com/downshift-js/downshift/issues/1272#issuecomment-1063244446
          { suppressRefError: true },
        )}
        style={floatingStyles}
        sx={styles.list}
        zIndex="dropdown"
      >
        {isOpen && items.length > 0 && (
          <VirtualOptions key={inputValue}>
            {(item, index) => <DropdownItem item={item} index={index} />}
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
