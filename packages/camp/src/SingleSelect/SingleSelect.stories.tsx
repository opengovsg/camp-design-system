import { useState } from 'react'
import { FormControl, Stack, useControllableState } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { BxGitMerge, BxHeart } from '~/icons'
import { fixedHeightDecorator } from '~/utils/storybook'

import { FormLabel } from '..'

import { itemToValue } from './utils/itemUtils'
import { SingleSelect, SingleSelectProps } from './SingleSelect'
import { ComboboxItem } from './types'

const INITIAL_COMBOBOX_ITEMS: ComboboxItem[] = [
  {
    value: 'A',
    label: 'A',
    description: 'Not to be confused with B',
  },
  {
    value: 'B',
    label: 'B',
    description: 'Not to be confused with A',
    disabled: true,
  },
  {
    value: 'Bat',
    label: 'Bat',
  },
  {
    value: 'Multiple words and strings',
    label: 'Multiple words and strings',
  },
  {
    value: 'C',
    label: 'C',
  },
  {
    value: 'D',
    label: 'D',
  },
  {
    value: 'A1',
    label: 'A1',
  },
  {
    value: 'B2',
    label: 'B2',
  },
  {
    value: 'Bat3',
    label: 'Bat3',
  },
  {
    value: 'C4',
    label: 'C4',
  },
  {
    value: 'D5',
    label: 'D5',
    disabled: true,
  },
]

export default {
  title: 'Components/SingleSelect',
  component: SingleSelect,
  tags: ['autodocs'],
  decorators: [fixedHeightDecorator('300px')],
  args: {
    items: INITIAL_COMBOBOX_ITEMS,
  },
} as Meta<SingleSelectProps>

const Template: StoryFn<SingleSelectProps> = (args) => {
  const [value, setValue] = useControllableState({
    value: args.value,
    onChange: args.onChange,
  })
  return <SingleSelect {...args} value={value} onChange={setValue} />
}

export const Default = Template.bind({})

export const NotClearable = Template.bind({})
NotClearable.args = {
  isClearable: false,
}

export const HasValueSelected = Template.bind({})
HasValueSelected.args = {
  value: itemToValue(INITIAL_COMBOBOX_ITEMS[0]),
  initialIsOpen: true,
}

export const HasValueSelectedFurtherDown = Template.bind({})
HasValueSelectedFurtherDown.args = {
  value: itemToValue(INITIAL_COMBOBOX_ITEMS[9]), // 'C4', below the 4-row viewport
}

export const Sizes = () => {
  const items = ['xs', 'sm', 'md']
  const [first, setFirst] = useState('')
  const [second, setSecond] = useState('')
  const [third, setThird] = useState('')

  return (
    <Stack>
      <SingleSelect
        value={first}
        onChange={setFirst}
        size="xs"
        items={items}
        name="xs"
      />
      <SingleSelect
        value={second}
        onChange={setSecond}
        size="sm"
        items={items}
        name="sm"
      />
      <SingleSelect
        value={third}
        onChange={setThird}
        size="md"
        items={items}
        name="md"
      />
    </Stack>
  )
}

export const StringValues = Template.bind({})
StringValues.args = {
  items: ['this only has only string values', 'this is cool'],
  comboboxProps: {
    initialInputValue: 'this',
  },
  initialIsOpen: true,
}

export const WithIconSelected = Template.bind({})
WithIconSelected.args = {
  items: [
    {
      value: 'Radio button',
      icon: BxGitMerge,
      description: 'This is an option with an icon',
    },
    {
      value: 'Radio button button',
      icon: BxGitMerge,
      description: 'To show highlight effect between active and inactive',
    },
    {
      value: 'Section',
      icon: BxHeart,
      description: 'This is another option with an icon',
    },
  ],
  value: 'Radio button',
  initialIsOpen: true,
  isDisabled: false,
}

export const WithFixedItemHeight = Template.bind({})
WithFixedItemHeight.args = { ...WithIconSelected.args, fixedItemHeight: 68 }

export const WithHalfFilledValue = Template.bind({})
WithHalfFilledValue.args = {
  comboboxProps: {
    initialInputValue: 'Multiple words and',
  },
  initialIsOpen: true,
}

export const Invalid = Template.bind({})
Invalid.args = {
  isInvalid: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  isDisabled: true,
}

export const Prefilled = Template.bind({})
Prefilled.args = {
  isPrefilled: true,
  value: itemToValue(INITIAL_COMBOBOX_ITEMS[2]),
}

export const FormInput: StoryFn<SingleSelectProps> = (args) => {
  const [value, setValue] = useState<string>(args.value)

  return (
    <FormControl id="test">
      <FormLabel>This is a label</FormLabel>
      <SingleSelect
        name="test"
        value={value}
        onChange={setValue}
        items={INITIAL_COMBOBOX_ITEMS}
      />
    </FormControl>
  )
}
