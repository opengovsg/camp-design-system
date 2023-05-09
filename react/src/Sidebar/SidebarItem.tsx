import { useMemo } from 'react'
import { chakra, forwardRef } from '@chakra-ui/react'
import { dataAttr, isFunction } from '@chakra-ui/utils'
import { merge } from 'lodash'

import { useSidebarNestContext } from './SidebarNestContext'
import { useSidebarStyles } from './SidebarStyleProvider'
import type { BaseSidebarItemProps } from './types'

export interface SidebarItemProps extends BaseSidebarItemProps {
  isActive?: boolean | (() => boolean)
}

export const SidebarItem = forwardRef<SidebarItemProps, 'li'>(
  ({ children, icon, isActive, ...props }, ref): JSX.Element => {
    const styles = useSidebarStyles()
    const { nested } = useSidebarNestContext()
    const css = useMemo(() => {
      if (!nested) {
        return styles.item
      }
      return merge({}, styles.item, styles.child)
    }, [nested, styles.child, styles.item])

    const dataActive = useMemo(() => {
      if (isFunction(isActive)) {
        return isActive()
      }
      return isActive
    }, [isActive])

    return (
      <chakra.li
        __css={css}
        ref={ref}
        {...props}
        data-active={dataAttr(dataActive)}
      >
        {icon}
        {children}
      </chakra.li>
    )
  },
)

SidebarItem.displayName = 'SidebarItem'
