import { useLayoutEffect, useRef } from 'react'
import { List, ListItem, Portal } from '@chakra-ui/react'
import { useVirtualizer } from '@tanstack/react-virtual'

import { VIRTUAL_LIST_ITEM_HEIGHT } from '../constants'
import { useSelectContext } from '../SelectContext'

import { DropdownItem } from './DropdownItem'
import { useSelectPopover } from './SelectPopover'

const VirtualOptions = () => {
  const { items, highlightedIndex, virtualListHeight, size } =
    useSelectContext()
  const ref = useRef<HTMLDivElement>(null)
  const estimate = VIRTUAL_LIST_ITEM_HEIGHT[size]
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => ref.current,
    estimateSize: () => estimate,
    initialRect: { width: 0, height: virtualListHeight },
    initialOffset: Math.max(0, highlightedIndex) * estimate,
    overscan: 4,
  })
  // Measure and position the highlighted row before the menu can paint.
  useLayoutEffect(() => {
    if (highlightedIndex >= 0)
      virtualizer.scrollToIndex(highlightedIndex, { align: 'auto' })
  }, [highlightedIndex, virtualizer])
  return (
    <div ref={ref} style={{ height: virtualListHeight, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            data-index={row.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${row.start}px)`,
            }}
          >
            <DropdownItem item={items[row.index]} index={row.index} />
          </div>
        ))}
      </div>
    </div>
  )
}

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
        {isOpen && items.length > 0 && <VirtualOptions key={inputValue} />}
        {isOpen && items.length === 0 ? (
          <ListItem role="option" sx={styles.emptyItem}>
            {nothingFoundLabel}
          </ListItem>
        ) : null}
      </List>
    </Portal>
  )
}
