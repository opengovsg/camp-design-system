import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FormControlOptions,
  ThemingProps,
  useFormControlProps,
  useMultiStyleConfig,
  useTheme,
} from '@chakra-ui/react'
import {
  useCombobox,
  UseComboboxProps,
  useMultipleSelection,
  UseMultipleSelectionProps,
} from 'downshift'

import {
  ComboboxItem,
  SelectContext,
  SharedSelectContextReturnProps,
} from '~/SingleSelect'
import { VIRTUAL_LIST_ITEM_HEIGHT } from '~/SingleSelect/constants'
import { useItems } from '~/SingleSelect/hooks/useItems'
import {
  defaultFilter,
  isItemDisabled,
  itemToLabelString,
  itemToValue,
} from '~/SingleSelect/utils'

import { MultiSelectContext } from './MultiSelectContext'

export interface MultiSelectProviderProps<
  Item extends ComboboxItem = ComboboxItem,
> extends Omit<SharedSelectContextReturnProps<Item>, 'isClearable'>,
    FormControlOptions {
  /** Controlled selected values */
  values: string[]
  /** Controlled selection onChange handler */
  onChange: (value: string[]) => void
  /** Function based on which items in dropdown are filtered. Default filter filters by fuzzy match. */
  filter?(items: Item[], value: string): Item[]
  /** Initial dropdown opened state. Defaults to `false`. */
  defaultIsOpen?: boolean
  /**
   * The maximum number of selected items to render while multiselect is unfocused.
   * Defaults to `4`. Set to `null` to render all items.
   */
  maxItems?: number | null
  /** aria-describedby to be attached to the combobox input, if any. */
  inputAria?: {
    id: string
    label: string
  }
  children: React.ReactNode
  /**
   * Any props to override the default props of `downshift#useCombobox` set by this component.
   */
  downshiftComboboxProps?: Partial<UseComboboxProps<Item>>
  /**
   * Any props to override the default props of `downshift#useMultipleSelection` set by this component.
   */
  downshiftMultiSelectProps?: Partial<UseMultipleSelectionProps<Item>>
  colorScheme?: ThemingProps<'MultiSelect'>['colorScheme']
  fixedItemHeight?: number
  /**
   * If `true`, the selected items will take up the full width of the input container. Defaults to `false`.
   */
  isStretchLayout?: boolean
  /**
   * Whether the input is in a prefilled state.
   */
  isPrefilled?: boolean
}
export const MultiSelectProvider = ({
  items: rawItems,
  values,
  onChange,
  name,
  filter = defaultFilter,
  nothingFoundLabel = 'No matching results',
  placeholder: placeholderProp,
  clearButtonLabel = 'Clear selection',
  isSearchable = true,
  isPrefilled = false,
  defaultIsOpen,
  isInvalid: isInvalidProp,
  isReadOnly: isReadOnlyProp,
  isDisabled: isDisabledProp,
  isRequired: isRequiredProp,
  maxItems = 4,
  downshiftComboboxProps = {},
  downshiftMultiSelectProps = {},
  inputAria,
  children,
  size: _size,
  colorScheme,
  fixedItemHeight,
  isStretchLayout,
}: MultiSelectProviderProps): JSX.Element => {
  const theme = useTheme()
  // Required in case size is set in theme, we should respect the one set in theme.
  const size = useMemo(
    () =>
      (_size ?? theme?.components?.MultiSelect?.defaultProps?.size ?? 'md') as
        | 'xs'
        | 'sm'
        | 'md',
    [_size, theme?.components?.MultiSelect?.defaultProps?.size],
  )

  const { items, getItemByValue } = useItems({ rawItems })
  const [isFocused, setIsFocused] = useState(false)

  // Inject for components to manipulate
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { isInvalid, isDisabled, isReadOnly, isRequired } = useFormControlProps(
    {
      isInvalid: isInvalidProp,
      isDisabled: isDisabledProp,
      isReadOnly: isReadOnlyProp,
      isRequired: isRequiredProp,
    },
  )

  const getFilteredItems = useCallback(
    (filterValue?: string) => {
      return filterValue ? filter(items, filterValue) : items
    },
    [filter, items],
  )
  const [filteredItems, setFilteredItems] = useState(
    getFilteredItems(
      downshiftComboboxProps.initialInputValue ??
        downshiftComboboxProps.inputValue,
    ),
  )

  const selectedItems = useMemo(() => {
    const items = []
    for (const value of values) {
      const item = getItemByValue(value)
      if (item) {
        items.push(item.item)
      }
    }
    return items
  }, [getItemByValue, values])

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    reset,
    activeIndex,
    setActiveIndex,
  } = useMultipleSelection<(typeof items)[0]>({
    selectedItems,
    onSelectedItemsChange: ({ selectedItems }) => {
      onChange([
        ...new Set(
          selectedItems
            ?.filter((item) => !isItemDisabled(item))
            .map(itemToValue),
        ),
      ])
    },
    itemToString: itemToLabelString,
    stateReducer: (_state, { changes, type }) => {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          return {
            ...changes,
            // The focus will move to the input/button
            // This prevents a bug where the focus would move to a selected item
            // when deselecting a selected item in the dropdown.
            activeIndex: -1,
          }
        default:
          return changes
      }
    },
    ...downshiftMultiSelectProps,
  })

  const dynamicPlaceholder = useMemo(() => {
    if (placeholderProp === null || selectedItems.length > 0) return ''
    return placeholderProp ?? 'Select options'
  }, [placeholderProp, selectedItems.length])

  const {
    toggleMenu,
    closeMenu,
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    getToggleButtonProps,
    selectItem,
    inputValue,
    highlightedIndex,
    setInputValue,
  } = useCombobox({
    labelId: `${name}-label`,
    inputId: name,
    items: filteredItems,
    itemToString: itemToLabelString,
    defaultIsOpen,
    defaultInputValue: '',
    defaultHighlightedIndex: 0,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    scrollIntoView: () => {},
    onStateChange: ({ inputValue, type }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.FunctionSetInputValue:
        case useCombobox.stateChangeTypes.InputChange:
          setFilteredItems(getFilteredItems(inputValue))
          break
        default:
          return
      }
    },
    stateReducer: (state, { changes, type }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick: {
          const { selectedItem } = changes
          if (selectedItem) {
            if (selectedItems.includes(selectedItem)) {
              removeSelectedItem(selectedItem)
            } else {
              addSelectedItem(selectedItem)
            }
          }
          return {
            ...changes,
            // Retain previous inputValue
            inputValue: state.inputValue,
            // Keep highlighted index the same.
            highlightedIndex: state.highlightedIndex,
            selectedItem: null,
            // Keep the menu open after selection.
            isOpen: true,
          }
        }
        case useCombobox.stateChangeTypes.InputBlur:
          setFilteredItems(getFilteredItems())
          // Clear input regardless on blur.
          return {
            ...changes,
            inputValue: '',
            isOpen: false,
          }
        case useCombobox.stateChangeTypes.InputFocus:
          return {
            ...changes,
            isOpen: false, // keep the menu closed when input gets focused.
          }
        case useCombobox.stateChangeTypes.ToggleButtonClick:
          return {
            ...changes,
            isOpen: !state.isOpen,
          }
        default:
          return changes
      }
    },
    ...downshiftComboboxProps,
  })

  /** Effect to update filtered items whenever items prop changes. */
  useEffect(() => {
    setFilteredItems(getFilteredItems(inputValue))
  }, [getFilteredItems, inputValue, items])

  const resetInputValue = useCallback(() => setInputValue(''), [setInputValue])

  const isItemSelected = useCallback(
    (item: ComboboxItem) => {
      return selectedItems.includes(item)
    },
    [selectedItems],
  )

  const styles = useMultiStyleConfig('MultiSelect', {
    size,
    isFocused: isFocused || isOpen,
    isEmpty: selectedItems.length === 0,
    isPrefilled,
  })

  const virtualListHeight = useMemo(() => {
    const itemHeight = fixedItemHeight ?? VIRTUAL_LIST_ITEM_HEIGHT[size]
    // If the total height is less than the max height, just return the total height.
    // Otherwise, return the max height.
    return Math.min(filteredItems.length, 4) * itemHeight
  }, [filteredItems.length, fixedItemHeight, size])

  return (
    <SelectContext.Provider
      value={{
        size,
        inputRef,
        isClearable: false,
        selectedItem: null,
        isOpen,
        isItemSelected,
        toggleMenu,
        closeMenu,
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        getToggleButtonProps,
        selectItem,
        highlightedIndex,
        items: filteredItems,
        nothingFoundLabel,
        inputValue,
        isSearchable,
        name,
        clearButtonLabel,
        placeholder: dynamicPlaceholder,
        styles,
        isFocused,
        setIsFocused,
        isInvalid,
        isDisabled,
        isReadOnly,
        isRequired,
        resetInputValue,
        inputAria,
        virtualListHeight,
      }}
    >
      <MultiSelectContext.Provider
        value={{
          selectedItems,
          getDropdownProps,
          getSelectedItemProps,
          addSelectedItem,
          removeSelectedItem,
          reset,
          maxItems,
          activeIndex,
          setActiveIndex,
          colorScheme,
          isStretchLayout,
        }}
      >
        {children}
      </MultiSelectContext.Provider>
    </SelectContext.Provider>
  )
}
