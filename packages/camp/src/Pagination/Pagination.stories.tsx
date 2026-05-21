import { useEffect, useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'

import { Pagination, type PaginationProps } from './'

export default {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} as Meta<PaginationProps>

const Template: StoryFn<PaginationProps> = (args) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage)

  useEffect(() => {
    setCurrentPage(args.currentPage)
  }, [args.currentPage])

  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  )
}

export const Default = Template.bind({})
Default.args = { currentPage: 5, totalCount: 1000, pageSize: 10 }

export const VariantFullDisabled = Template.bind({})
VariantFullDisabled.args = {
  currentPage: 5,
  totalCount: 1000,
  pageSize: 10,
  isDisabled: true,
}

export const FullSiblingCountEquals2 = Template.bind({})
FullSiblingCountEquals2.args = {
  currentPage: 31,
  totalCount: 1000,
  pageSize: 10,
  siblingCount: 2,
}

export const FullExactly7Pages = Template.bind({})
FullExactly7Pages.args = {
  currentPage: 1,
  totalCount: 70,
  pageSize: 10,
  siblingCount: 1,
}

export const FullExactly8Pages = Template.bind({})
FullExactly8Pages.args = {
  currentPage: 1,
  totalCount: 80,
  pageSize: 10,
  siblingCount: 1,
}

export const FullLessThan7Pages = Template.bind({})
FullLessThan7Pages.args = {
  currentPage: 1,
  totalCount: 60,
  pageSize: 10,
  siblingCount: 1,
}

export const FullStartOf100Pages = Template.bind({})
FullStartOf100Pages.args = {
  currentPage: 1,
  totalCount: 1000,
  pageSize: 10,
  siblingCount: 1,
}

export const FullEndOf100Pages = Template.bind({})
FullEndOf100Pages.args = {
  currentPage: 100,
  totalCount: 1000,
  pageSize: 10,
  siblingCount: 1,
}

export const FullMiddleOf100Pages = Template.bind({})
FullMiddleOf100Pages.args = {
  currentPage: 31,
  totalCount: 1000,
  pageSize: 10,
  siblingCount: 1,
}

export const VariantMinimal = Template.bind({})
VariantMinimal.args = {
  currentPage: 31,
  totalCount: 1000,
  pageSize: 10,
  siblingCount: 1,
  variant: 'minimal',
}

export const MinimalDisabled = Template.bind({})
MinimalDisabled.args = {
  ...VariantMinimal.args,
  isDisabled: true,
}
