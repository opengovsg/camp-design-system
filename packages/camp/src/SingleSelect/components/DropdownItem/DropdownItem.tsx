import { useMemo } from 'react'
import { Flex, Icon, ListItem, Stack, Text } from '@chakra-ui/react'
import { dataAttr } from '@chakra-ui/utils'

import { useSelectContext } from '../../SelectContext'
import { ComboboxItem } from '../../types'
import {
  isItemDisabled,
  itemToDescriptionString,
  itemToIcon,
  itemToLabelString,
} from '../../utils/itemUtils'

import { DropdownItemTextHighlighter } from './DropdownItemTextHighlighter'

export interface DropdownItemProps {
  item: ComboboxItem
  index: number
}

export const DropdownItem = ({
  item,
  index,
}: DropdownItemProps): JSX.Element => {
  const { getItemProps, isItemSelected, inputValue, styles } =
    useSelectContext()

  const { icon, label, description, isDisabled, isActive } = useMemo(
    () => ({
      icon: itemToIcon(item),
      label: itemToLabelString(item),
      description: itemToDescriptionString(item),
      isDisabled: isItemDisabled(item),
      isActive: isItemSelected(item),
    }),
    [isItemSelected, item],
  )

  return (
    <ListItem
      sx={styles.item}
      data-active={dataAttr(isActive)}
      {...getItemProps({
        item,
        index,
      })}
      aria-disabled={isDisabled || undefined}
      data-disabled={dataAttr(isDisabled)}
    >
      <Flex flexDir="column">
        <Stack direction="row" align="center" spacing="1rem">
          {icon ? <Icon as={icon} sx={styles.icon} /> : null}
          <Text
            minWidth={0}
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflowX="hidden"
          >
            <DropdownItemTextHighlighter
              inputValue={inputValue ?? ''}
              textToHighlight={label}
            />
          </Text>
        </Stack>
        {description && (
          <Text sx={styles.itemDescription}>
            <DropdownItemTextHighlighter
              inputValue={inputValue ?? ''}
              textToHighlight={description}
            />
          </Text>
        )}
      </Flex>
    </ListItem>
  )
}
