import { useState } from 'react'
import { Stack } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { Radio, type RadioProps } from './'

export default {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
} as Meta<RadioProps>

export const Default: StoryFn = () => (
  <Radio.RadioGroup defaultValue="a">
    <Radio value="a">Option A</Radio>
    <Radio value="b">Option B</Radio>
    <Radio value="c">Option C</Radio>
  </Radio.RadioGroup>
)

export const Disabled: StoryFn = () => (
  <Radio.RadioGroup defaultValue="a" disabled>
    <Radio value="a">Option A</Radio>
    <Radio value="b">Option B</Radio>
  </Radio.RadioGroup>
)

export const Sizes: StoryFn = () => (
  <Stack>
    <Radio.RadioGroup size="xs" defaultValue="a">
      <Radio value="a">Extra small</Radio>
      <Radio value="b">Extra small</Radio>
    </Radio.RadioGroup>
    <Radio.RadioGroup size="sm" defaultValue="a">
      <Radio value="a">Small</Radio>
      <Radio value="b">Small</Radio>
    </Radio.RadioGroup>
    <Radio.RadioGroup size="md" defaultValue="a">
      <Radio value="a">Medium</Radio>
      <Radio value="b">Medium</Radio>
    </Radio.RadioGroup>
  </Stack>
)

export const WithOthers: StoryFn = () => {
  const [value, setValue] = useState<string | null>('a')
  return (
    <Radio.RadioGroup value={value} onValueChange={(e) => setValue(e.value)}>
      <Radio value="a">Option A</Radio>
      <Radio value="b">Option B</Radio>
      <Radio.OthersWrapper value="__others__">
        <Radio.OthersInput
          placeholder="Please specify"
          onOthersSelect={() => setValue('__others__')}
        />
      </Radio.OthersWrapper>
      <Radio.OthersFocusBridge isOthersChecked={value === '__others__'} />
    </Radio.RadioGroup>
  )
}
