import { useState } from 'react'
import { FormControl, Stack } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { addDays } from 'date-fns'

import { getMobileViewParameters, mockDateDecorator } from '~/utils/storybook'

import { Button, DateRangeValue, FormLabel } from '..'

import { DateRangePicker, DateRangePickerProps } from './DateRangePicker'

export default {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  decorators: [mockDateDecorator],
  parameters: {
    mockdate: new Date('2021-12-25T06:22:27.219Z'),
  },
} as Meta<DateRangePickerProps>

const Template: StoryFn<DateRangePickerProps> = (args) => (
  <DateRangePicker {...args} />
)
export const Default = Template.bind({})

export const DateRangePickerWithValue = Template.bind({})
DateRangePickerWithValue.args = {
  defaultValue: [new Date('2001-01-01'), null],
}
export const SelectTodayWhenTodayButtonClicked = Template.bind({})
SelectTodayWhenTodayButtonClicked.args = {
  shouldSetDateOnTodayButtonClick: true,
}

export const DateRangePickerDisallowManualInput = Template.bind({})
DateRangePickerDisallowManualInput.args = {
  allowManualInput: false,
  defaultValue: [new Date('2021-09-13'), null],
}

export const FixedHeightCalendarPopover = Template.bind({})
FixedHeightCalendarPopover.args = {
  isCalendarFixedHeight: true,
}

export const DatePickerInvalid = Template.bind({})
DatePickerInvalid.args = {
  isInvalid: true,
  defaultValue: [new Date('2001-01-01'), new Date('2001-01-03')],
}

export const DatePickerDisabled = Template.bind({})
DatePickerDisabled.args = {
  isDisabled: true,
  defaultValue: [new Date('2001-01-01'), new Date('2002-01-03')],
}

export const Prefilled = Template.bind({})
Prefilled.args = {
  isPrefilled: true,
  defaultValue: [new Date('2001-01-01'), new Date('2002-01-03')],
}

export const Mobile = Template.bind({})
Mobile.parameters = getMobileViewParameters()

export const SizeSmall = Template.bind({})
SizeSmall.args = {
  size: 'sm',
}

export const SizeXs = Template.bind({})
SizeXs.args = {
  size: 'xs',
}

export const WithMonthYearChangeCallbacks = Template.bind({})
WithMonthYearChangeCallbacks.args = {
  onMonthChange: (month) => alert(`Month changed to: ${month + 1}`),
  onYearChange: (year) => alert(`Year changed to: ${year}`),
}
WithMonthYearChangeCallbacks.parameters = {
  docs: {
    description: {
      story:
        'Demonstrates onMonthChange and onYearChange callbacks with alerts when navigating.',
    },
  },
}

const ControlledTemplate: StoryFn<DateRangePickerProps> = (args) => {
  const [datestate, setDatestate] = useState<DateRangeValue>([null, null])

  return (
    <Stack>
      <FormControl>
        <FormLabel>Date Range Picker</FormLabel>
        <DateRangePicker {...args} value={datestate} onChange={setDatestate} />
      </FormControl>
      <Button
        onClick={() => setDatestate([new Date(), addDays(new Date(), 1)])}
      >
        Click to set date
      </Button>
      <Button onClick={() => setDatestate([null, null])}>Click to reset</Button>
    </Stack>
  )
}

export const ControlledInput = ControlledTemplate.bind({})
ControlledInput.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText('No date selected')).toBeInTheDocument()
  const button = canvas.getByText('Click to set date')
  await userEvent.click(button)
  await expect(
    canvas.getByLabelText(
      'Select from date picker. Selected date range is Sat Dec 25 2021 to Sun Dec 26 2021.',
    ),
  ).toBeInTheDocument()
  const resetButton = canvas.getByText('Click to reset')
  await userEvent.click(resetButton)
  await expect(canvas.getByText('No date selected')).toBeInTheDocument()
}
