import { FormControl } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { FormHelperText, FormHelperTextProps } from './FormHelperText'

export default {
  title: 'Components/FormControl/FormHelperText',
  component: FormHelperText,
  tags: ['autodocs'],
  decorators: [],
} as Meta<FormHelperTextProps>

const Template: StoryFn<FormHelperTextProps> = ({ children, ...args }) => (
  // FormControl component required to pass appropriate props into component.
  <FormControl>
    <FormHelperText {...args}>{children}</FormHelperText>
  </FormControl>
)

export const Info = Template.bind({})
Info.args = {
  children: 'Date of birth should be in DD/MM/YYYY format.',
  variant: 'info',
}

export const Success = Template.bind({})
Success.args = {
  children: 'This is a success message.',
  variant: 'success',
}
