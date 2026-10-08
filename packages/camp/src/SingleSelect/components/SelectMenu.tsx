import { forwardRef } from 'react'
import { ListProps, Virtuoso } from 'react-virtuoso'
import { List, ListItem, Portal } from '@chakra-ui/react'

import { useSelectContext } from '../SelectContext'
import { itemToValue } from '../utils/itemUtils'

import { DropdownItem } from './DropdownItem'
import { useSelectPopover } from './SelectPopover'

/**
 * With `initialTopMostItemIndex`, Virtuoso hides the list until its row sizes
 * have stopped changing for 150ms, so the menu would open blank. Show the rows
 * as soon as they render at the target position instead.
 */
const VirtuosoList = forwardRef<
  HTMLDivElement,
  ListProps & { context?: unknown }
>(({ context: _context, style, ...props }, ref) => (
  <div ref={ref} {...props} style={{ ...style, visibility: undefined }} />
))
VirtuosoList.displayName = 'VirtuosoList'

const VIRTUOSO_COMPONENTS = { List: VirtuosoList }

export const SelectMenu = (): JSX.Element => {
  const {
    getMenuProps,
    highlightedIndex,
    isOpen,
    items,
    nothingFoundLabel,
    styles,
    virtualListRef,
    virtualListHeight,
  } = useSelectContext()

  const { floatingRef, floatingStyles } = useSelectPopover()

  // Virtuoso remounts on every open, and scrollIntoView is a no-op until it has
  // measured its rows, so the initial position comes from the highlighted item.
  const initialTopMostItemIndex =
    highlightedIndex > 0
      ? { index: highlightedIndex, align: 'center' as const }
      : 0

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
          <Virtuoso
            ref={virtualListRef}
            data={items}
            overscan={virtualListHeight / 2}
            initialTopMostItemIndex={initialTopMostItemIndex}
            components={VIRTUOSO_COMPONENTS}
            style={{ height: virtualListHeight }}
            itemContent={(index, item) => {
              return (
                <DropdownItem
                  key={`${itemToValue(item)}${index}`}
                  item={item}
                  index={index}
                />
              )
            }}
          />
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
