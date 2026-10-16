import { useState } from 'react'
import { FormControl, Stack, useControllableState } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'

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

export const OpensSelectedRowWithoutJumping: StoryFn<SingleSelectProps> = (
  args,
) => {
  const [value, setValue] = useState(args.value)
  return <SingleSelect {...args} value={value} onChange={setValue} />
}
OpensSelectedRowWithoutJumping.args = {
  value: '900',
  items: Array.from({ length: 1000 }, (_, index) => ({
    value: String(index),
    label: `Option ${index}`,
    description:
      index % 3 === 0 ? 'An option with a taller description' : undefined,
  })),
}
OpensSelectedRowWithoutJumping.play = async ({ canvasElement }) => {
  const input = within(canvasElement).getByRole('combobox')
  const document = canvasElement.ownerDocument
  const positions: number[] = []
  const frames = new Promise<void>((resolve, reject) => {
    input.addEventListener(
      'mousedown',
      () => {
        const sample = () => {
          try {
            const menu = document.querySelector('[role="listbox"]')
            const row = document.querySelector(
              '[role="option"][aria-selected="true"]',
            )
            expect(row).toHaveTextContent('Option 900')
            expect(row).toBeVisible()
            if (!menu || !row)
              throw new Error('The selected row must exist on the first frame')
            const bounds = menu.getBoundingClientRect()
            const rect = row.getBoundingClientRect()
            expect(rect.top).toBeGreaterThanOrEqual(bounds.top - 1)
            expect(rect.bottom).toBeLessThanOrEqual(bounds.bottom + 1)
            positions.push(rect.top - bounds.top)
            if (positions.length < 12) requestAnimationFrame(sample)
            else resolve()
          } catch (error) {
            reject(error)
          }
        }
        requestAnimationFrame(sample)
      },
      { once: true },
    )
  })
  await Promise.all([userEvent.click(input), frames])
  expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(1)
  await userEvent.keyboard('{ArrowDown}{Enter}')
  await userEvent.click(input)
  expect(
    document.querySelector('[role="option"][aria-selected="true"]'),
  ).toHaveTextContent('Option 901')
  await userEvent.type(input, 'Option 12')
  const firstMatch = document.querySelector(
    '[role="option"][aria-selected="true"]',
  )
  expect(firstMatch).toBeVisible()
  const menu = document.querySelector('[role="listbox"]')
  if (!firstMatch || !menu)
    throw new Error('The first filtered match must be visible')
  expect(firstMatch.getBoundingClientRect().top).toBeGreaterThanOrEqual(
    menu.getBoundingClientRect().top - 1,
  )
}
