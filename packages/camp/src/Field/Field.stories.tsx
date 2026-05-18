import { Stack } from '@chakra-ui/react'
import { Meta, StoryFn } from '@storybook/react'

import { Field } from './'

export default {
  title: 'Components/Field',
  component: Field.Root,
  tags: ['autodocs'],
} as Meta

export const Default: StoryFn = () => (
  <Field.Root>
    <Field.Label>Email address</Field.Label>
    <Field.HelperText>We never share your email.</Field.HelperText>
  </Field.Root>
)

export const Required: StoryFn = () => (
  <Field.Root required>
    <Field.Label isRequired>Full name</Field.Label>
    <Field.HelperText>As shown on your ID.</Field.HelperText>
  </Field.Root>
)

export const Optional: StoryFn = () => (
  <Field.Root>
    <Field.Label>Phone number</Field.Label>
    <Field.HelperText>We&apos;ll only use this for delivery.</Field.HelperText>
  </Field.Root>
)

export const Invalid: StoryFn = () => (
  <Field.Root invalid>
    <Field.Label isRequired>Email address</Field.Label>
    <Field.ErrorText>Enter a valid email address.</Field.ErrorText>
  </Field.Root>
)

export const HelperSuccess: StoryFn = () => (
  <Field.Root>
    <Field.Label isRequired>Username</Field.Label>
    <Field.HelperText variant="success">
      Username is available.
    </Field.HelperText>
  </Field.Root>
)

export const WithQuestionNumber: StoryFn = () => (
  <Field.Root>
    <Field.Label questionNumber={1}>What is the meaning of life?</Field.Label>
    <Field.HelperText>Answer in three sentences or fewer.</Field.HelperText>
  </Field.Root>
)

export const WithTooltip: StoryFn = () => (
  <Field.Root>
    <Field.Label tooltipText="Your unique ID issued by the agency.">
      Reference number
    </Field.Label>
    <Field.HelperText>Format: ABC-12345</Field.HelperText>
  </Field.Root>
)

export const WithDescription: StoryFn = () => (
  <Field.Root>
    <Field.Label description="Used for billing and dispatch — must match the address on file.">
      Mailing address
    </Field.Label>
  </Field.Root>
)

export const Sizes: StoryFn = () => (
  <Stack gap="1.5rem">
    <Field.Root>
      <Field.Label size="sm">Small label</Field.Label>
      <Field.HelperText>Helper text</Field.HelperText>
    </Field.Root>
    <Field.Root>
      <Field.Label size="md">Medium label (default)</Field.Label>
      <Field.HelperText>Helper text</Field.HelperText>
    </Field.Root>
  </Stack>
)
