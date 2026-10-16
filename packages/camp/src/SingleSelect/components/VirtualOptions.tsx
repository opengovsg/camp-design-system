import { ReactNode, useLayoutEffect, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

import { VIRTUAL_LIST_ITEM_HEIGHT } from '../constants'
import { useSelectContext } from '../SelectContext'
import { ComboboxItem } from '../types'

export const VirtualOptions = ({
  children,
}: {
  children: (item: ComboboxItem, index: number) => ReactNode
}) => {
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
            {children(items[row.index], row.index)}
          </div>
        ))}
      </div>
    </div>
  )
}
