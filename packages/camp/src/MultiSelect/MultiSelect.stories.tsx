import { useState } from 'react'
import { FormControl, Stack } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { BxsCheckCircle } from '~/icons'
import type { ComboboxItem } from '~/SingleSelect'
import {
  fixedHeightDecorator,
  getMobileViewParameters,
} from '~/utils/storybook'

import { FormLabel } from '..'

import { MultiSelect, MultiSelectProps } from './MultiSelect'

const INITIAL_COMBOBOX_ITEMS: ComboboxItem[] = [
  {
    value: 'A',
  },
  {
    value: 'What happens when the label is fairly long',
  },
  {
    value: 'Bat',
    icon: BxsCheckCircle,
    description: 'With description',
  },
  {
    value: 'C',
  },
  {
    value: 'D',
  },
  {
    value: 'A1',
  },
  {
    value: 'B2',
  },
  {
    value: 'Bat3',
  },
  {
    value: 'C4',
  },
  {
    value: 'D5',
    disabled: true,
  },
  ...[...Array(200).keys()].map((val) => ({ value: String(val) })),
]

export default {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  decorators: [fixedHeightDecorator('300px')],
  args: {
    items: INITIAL_COMBOBOX_ITEMS,
    values: [],
  },
} as Meta<MultiSelectProps>

const Template: StoryFn<MultiSelectProps> = ({
  values: valuesProp,
  ...args
}) => {
  const [values, setValues] = useState<string[]>(valuesProp)

  return <MultiSelect {...args} values={values} onChange={setValues} />
}
export const Default = Template.bind({})

export const WithDefaultInput = Template.bind({})
WithDefaultInput.args = {
  downshiftComboboxProps: {
    initialInputValue: 'What',
    defaultIsOpen: true,
  },
}

export const MobileTruncatedOption = Template.bind({})
MobileTruncatedOption.args = {
  values: ['What happens when the label is fairly long', 'Bat'],
  defaultIsOpen: true,
}
MobileTruncatedOption.parameters = getMobileViewParameters()

export const Invalid = Template.bind({})
Invalid.args = {
  isInvalid: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  isDisabled: true,
}

export const DisabledWithSelection = Template.bind({})
DisabledWithSelection.args = {
  isDisabled: true,
  size: 'md',
  values: ['What happens when the label is fairly long', 'Bat'],
}

export const Prefilled = Template.bind({})
Prefilled.args = {
  isPrefilled: true,
  values: ['What happens when the label is fairly long', 'Bat'],
}

export const WithFixedItemHeight = Template.bind({})
WithFixedItemHeight.args = {
  size: 'md',
  fixedItemHeight: 68,
  defaultIsOpen: true,
  items: [
    {
      value: 'My height is 68',
      icon: BxsCheckCircle,
      description: 'With description',
    },
    {
      value: 'Mine too',
      icon: BxsCheckCircle,
      description: 'With description',
    },
  ],
}

export const WithIsStretchLayoutProp = Template.bind({})
WithIsStretchLayoutProp.args = {
  isStretchLayout: true,
  values: ['What happens when the label is fairly long', 'Bat'],
}
WithIsStretchLayoutProp.storyName = 'With isStretchLayout Prop'

export const Sizes = () => {
  const items = ['xs', 'sm', 'md']
  const [xs, setXs] = useState(['xs'])
  const [sm, setSm] = useState(['sm'])
  const [md, setMd] = useState(['md'])

  return (
    <Stack>
      <MultiSelect
        values={xs}
        onChange={setXs}
        size="xs"
        items={items}
        name="xs"
      />
      <MultiSelect
        values={sm}
        onChange={setSm}
        size="sm"
        items={items}
        name="sm"
      />
      <MultiSelect
        values={md}
        onChange={setMd}
        size="md"
        items={items}
        name="md"
      />
    </Stack>
  )
}

export const FormInput: StoryFn<MultiSelectProps> = (args) => {
  const [values, setValues] = useState<string[]>(args.values)

  return (
    <FormControl id="test">
      <FormLabel>This is a label</FormLabel>
      <MultiSelect
        name="test"
        values={values}
        onChange={setValues}
        items={INITIAL_COMBOBOX_ITEMS}
      />
    </FormControl>
  )
}

export const ReadOnlyFormInput: StoryFn<MultiSelectProps> = () => {
  return (
    <FormControl isReadOnly id="test">
      <MultiSelect
        name="test"
        values={['A', 'C', 'D']}
        onChange={() => {}}
        items={INITIAL_COMBOBOX_ITEMS}
      />
    </FormControl>
  )
}
