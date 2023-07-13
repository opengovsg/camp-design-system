import {
  ChangeEvent,
  memo,
  PropsWithChildren,
  useCallback,
  useMemo,
} from 'react'
import { Flex, HStack, Select, SelectProps, Text } from '@chakra-ui/react'
import { addMonths } from 'date-fns'

import { IconButton } from '~/IconButton'
import { BxChevronLeft, BxChevronRight } from '~/icons'

import { useCalendar } from './CalendarContext'
import { useCalendarStyles } from './CalendarStyleProvider'
import { MONTH_NAMES } from './utils'

interface CalendarHeaderProps {
  monthOffset: number
}

type MonthYearSelectProps = PropsWithChildren<SelectProps>

const MonthYearSelect = ({ children, ...props }: MonthYearSelectProps) => {
  const styles = useCalendarStyles()
  return (
    <Select
      // Prevents any parent form control from applying error styles to this select.
      isInvalid={false}
      variant="flushed"
      flexBasis="fit-content"
      sx={styles.monthYearSelect}
      {...props}
    >
      {children}
    </Select>
  )
}

const SelectableMonthYear = memo(() => {
  const {
    currMonth,
    setCurrMonth,
    currYear,
    setCurrYear,
    yearOptions,
    isMobile,
  } = useCalendar()

  const memoizedMonthOptions = useMemo(() => {
    return MONTH_NAMES.map(({ shortName, fullName }, index) => (
      <option value={index} key={index}>
        {isMobile ? shortName : fullName}
      </option>
    ))
  }, [isMobile])

  const memoizedYearOptions = useMemo(() => {
    return yearOptions.map((year, index) => (
      <option value={year} key={index}>
        {year}
      </option>
    ))
  }, [yearOptions])

  const handleMonthChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setCurrMonth(parseInt(e.target.value))
    },
    [setCurrMonth],
  )
  const handleYearChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setCurrYear(parseInt(e.target.value))
    },
    [setCurrYear],
  )

  return (
    <HStack>
      <MonthYearSelect
        value={currMonth}
        onChange={handleMonthChange}
        aria-label="Change displayed month"
      >
        {memoizedMonthOptions}
      </MonthYearSelect>
      <MonthYearSelect
        value={currYear}
        onChange={handleYearChange}
        aria-label="Change displayed year"
      >
        {memoizedYearOptions}
      </MonthYearSelect>
    </HStack>
  )
})

const MonthYear = memo(({ monthOffset }: CalendarHeaderProps) => {
  const { currMonth, currYear, isMobile } = useCalendar()
  const styles = useCalendarStyles()

  const newOffsetDate = useMemo(
    () => addMonths(new Date(currYear, currMonth), monthOffset),
    [currMonth, currYear, monthOffset],
  )

  const monthDisplay = useMemo(() => {
    const month = MONTH_NAMES[newOffsetDate.getMonth()]
    return isMobile ? month.shortName : month.fullName
  }, [isMobile, newOffsetDate])

  const yearDisplay = useMemo(() => {
    return newOffsetDate.getFullYear()
  }, [newOffsetDate])

  return (
    <HStack sx={styles.monthYearDisplay}>
      <Text>{monthDisplay}</Text>
      <Text>{yearDisplay}</Text>
    </HStack>
  )
})

export const CalendarHeader = memo(
  ({ monthOffset }: CalendarHeaderProps): JSX.Element => {
    const styles = useCalendarStyles()
    const {
      renderProps: { calendars, getBackProps, getForwardProps },
      size,
      isMobile,
    } = useCalendar()

    const displayNavigateButtons = useMemo(() => {
      if (isMobile) {
        return monthOffset === 0
      }
      return calendars.length - 1 === monthOffset
    }, [calendars.length, isMobile, monthOffset])

    return (
      <Flex sx={styles.monthYearSelectorContainer}>
        {monthOffset === 0 ? (
          <SelectableMonthYear />
        ) : (
          <MonthYear monthOffset={monthOffset} />
        )}
        {displayNavigateButtons ? (
          <Flex sx={styles.monthArrowContainer}>
            <IconButton
              variant="clear"
              colorScheme="neutral"
              size={size}
              icon={<BxChevronLeft />}
              aria-label="Back one month"
              {...getBackProps({ calendars })}
            />
            <IconButton
              variant="clear"
              colorScheme="neutral"
              size={size}
              icon={<BxChevronRight />}
              aria-label="Forward one month"
              {...getForwardProps({ calendars })}
            />
          </Flex>
        ) : null}
      </Flex>
    )
  },
)
