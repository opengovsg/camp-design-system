import { useState } from 'react'
import { FormControl, Stack } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'
import { expect, userEvent, waitFor, within } from '@storybook/test'

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

export const VirtualizedNavigation = Template.bind({})
VirtualizedNavigation.args = {
  items: Array.from({ length: 1000 }, (_, index) => ({
    value: String(index),
    label: `Option ${index}`,
    description:
      index % 3 === 0 ? 'A taller option with a description' : undefined,
    disabled: index === 1,
  })),
}
VirtualizedNavigation.play = async ({ canvasElement }) => {
  const input = within(canvasElement).getByRole('combobox')
  const document = canvasElement.ownerDocument
  const screen = within(document.body)
  const highlighted = () => screen.getByRole('option', { selected: true })
  const expectHighlightInView = async () => {
    await waitFor(() => {
      const row = highlighted().getBoundingClientRect()
      const menu = screen.getByRole('listbox').getBoundingClientRect()
      expect(row.top).toBeGreaterThanOrEqual(menu.top - 2)
      expect(row.bottom).toBeLessThanOrEqual(menu.bottom + 2)
    })
    expect(screen.getAllByRole('option').length).toBeLessThan(50)
  }
  await userEvent.click(input)
  await userEvent.keyboard('{ArrowDown}')
  expect(highlighted()).toHaveTextContent('Option 2')
  await userEvent.keyboard('{End}')
  await waitFor(() => expect(highlighted()).toHaveTextContent('Option 999'))
  await expectHighlightInView()
  await userEvent.keyboard('{Enter}')
  expect(highlighted()).toHaveTextContent(', selected')
  await userEvent.keyboard('{Enter}')
  expect(highlighted()).not.toHaveTextContent(', selected')
  await userEvent.type(input, 'Option 12')
  expect(highlighted()).toHaveTextContent('Option 12')
  await expectHighlightInView()
  await userEvent.clear(input)
  await userEvent.type(input, 'no matching option')
  expect(screen.getByRole('option')).toHaveTextContent('No matching results')
}
