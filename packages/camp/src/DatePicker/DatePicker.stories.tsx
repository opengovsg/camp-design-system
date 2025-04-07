import { useState } from 'react'
import {
  Button,
  FormControl,
  forwardRef,
  Stack,
  useMergeRefs,
} from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'

import { getMobileViewParameters, mockDateDecorator } from '~/utils/storybook'

import { FormLabel } from '..'

import { DatePicker, DatePickerProps } from './DatePicker'
import { useDatePicker } from './DatePickerContext'

export default {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  decorators: [mockDateDecorator],
  parameters: {
    mockdate: new Date('2021-12-25T06:22:27.219Z'),
  },
} as Meta<DatePickerProps>

const Template: StoryFn<DatePickerProps> = (args) => <DatePicker {...args} />
export const Default = Template.bind({})

export const DatePickerWithValue = Template.bind({})
DatePickerWithValue.args = {
  defaultValue: new Date('2001-01-01'),
}

export const SelectTodayWhenTodayButtonClicked = Template.bind({})
SelectTodayWhenTodayButtonClicked.args = {
  shouldSetDateOnTodayButtonClick: true,
}

export const DatePickerInvalid = Template.bind({})
DatePickerInvalid.args = {
  isInvalid: true,
  defaultValue: new Date('2001-01-01'),
}

export const DatePickerDisabled = Template.bind({})
DatePickerDisabled.args = {
  isDisabled: true,
  defaultValue: new Date('2001-01-01'),
}

export const DatePickerDisallowManualInput = Template.bind({})
DatePickerDisallowManualInput.args = {
  allowManualInput: false,
  defaultValue: new Date('2021-09-13'),
}

export const FixedHeightCalendarPopover = Template.bind({})
FixedHeightCalendarPopover.args = {
  isCalendarFixedHeight: true,
}

export const Prefilled = Template.bind({})
Prefilled.args = {
  isPrefilled: true,
}

export const SizeSmall = Template.bind({})
SizeSmall.args = {
  size: 'sm',
  defaultValue: new Date('2021-09-13'),
}

export const SizeXs = Template.bind({})
SizeXs.args = {
  size: 'xs',
  defaultValue: new Date('2021-09-13'),
}

export const Mobile = Template.bind({})
Mobile.parameters = getMobileViewParameters()

// !!REQUIRES `forwardRef` to be set so Popover parent knows where to anchor to.
const CustomInputButton = forwardRef<object, 'button'>((_props, ref) => {
  const {
    inputRef,
    innerRef,
    disclosureProps: { onOpen },
  } = useDatePicker()
  // !!Important to use forwarded ref so popover knows where to anchor to
  const refs = useMergeRefs(inputRef, innerRef, ref)

  return (
    <Button ref={refs} onClick={onOpen} maxWidth="full">
      please look at source code to see how to use custom elements
    </Button>
  )
})

export const CustomInput = Template.bind({})
CustomInput.args = {
  renderInputElement: () => <CustomInputButton />,
}

export const MobileCustomInput = Template.bind({})
MobileCustomInput.args = {
  renderInputElement: () => <CustomInputButton />,
}
MobileCustomInput.parameters = getMobileViewParameters()

export const WithMonthYearChangeCallbacks = Template.bind({})
WithMonthYearChangeCallbacks.args = {
  onMonthChange: (month) => alert(`Month changed to: ${month + 1}`),
  onYearChange: (year) => alert(`Year changed to: ${year}`),
}
WithMonthYearChangeCallbacks.parameters = {
  docs: {
    description: {
      story:
        'This example demonstrates `onMonthChange` and `onYearChange` callbacks. Alerts will appear when navigating the calendar.',
    },
  },
}

const ControlledTemplate: StoryFn<DatePickerProps> = (args) => {
  const [datestate, setDatestate] = useState<DatePickerProps['value']>()

  return (
    <Stack>
      <FormControl>
        <FormLabel>Date Range Picker</FormLabel>
        <DatePicker {...args} value={datestate} onChange={setDatestate} />
      </FormControl>
      <Button onClick={() => setDatestate(new Date())}>
        Click to set date
      </Button>
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
      'Select from date picker. Selected date is Sat Dec 25 2021.',
    ),
  ).toBeInTheDocument()
}
