import { isValid } from 'date-fns'
import pick from 'lodash/pick'

import type { DateRangeValue } from '~/Calendar'

import { DateRangePickerProps } from './DateRangePicker'

export const validateDateRange = (dateRange: DateRangeValue) => {
  const sortedRange = dateRange
    .sort((a, b) => (a && b ? a.getTime() - b.getTime() : 0))
    .map((date) => (isValid(date) ? date : null)) as DateRangeValue

  const [start, end] = sortedRange
  return {
    start: {
      isValid: isValid(start) || start === null,
      date: start,
    },
    end: {
      isValid: isValid(end) || end === null,
      date: end,
    },
  }
}

export const pickRangeCalendarProps = (props: DateRangePickerProps) => {
  return pick(
    props,
    'isCalendarFixedHeight',
    'monthsToDisplay',
    'isDateUnavailable',
    'defaultFocusedDate',
    'showTodayButton',
    'shouldSetDateOnTodayButtonClick',
    'onMonthChange',
    'onYearChange',
  )
}
