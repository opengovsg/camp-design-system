import {
  ChangeEventHandler,
  createContext,
  FocusEventHandler,
  MouseEventHandler,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  FormControlProps,
  SystemStyleObject,
  ThemingProps,
  useControllableState,
  useDisclosure,
  UseDisclosureReturn,
  useFormControlProps,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { format, isValid, parse } from 'date-fns'

import { DateRangeValue, RangeCalendarProps } from '~/Calendar'
import { useIsMobile } from '~/hooks/useIsMobile'

import { DateRangePickerProps } from './DateRangePicker'
import { pickRangeCalendarProps, validateDateRange } from './utils'

interface DateRangePickerContextReturn {
  isMobile: boolean
  styles: Record<string, SystemStyleObject>
  handleStartDateChange: ChangeEventHandler<HTMLInputElement>
  handleEndDateChange: ChangeEventHandler<HTMLInputElement>
  handleCalendarDateChange: (value: DateRangeValue) => void
  handleFieldContainerClick: () => void
  handleInputClick: MouseEventHandler<HTMLInputElement>
  calendarButtonAria: string
  startInputRef: RefObject<HTMLInputElement>
  endInputRef: RefObject<HTMLInputElement>
  initialFocusRef: RefObject<HTMLInputElement>
  handleInputBlur: FocusEventHandler<HTMLInputElement>
  fcProps: FormControlProps
  internalValue: DateRangeValue
  startInputDisplay: string
  endInputDisplay: string
  closeCalendarOnChange: boolean
  placeholder: string
  allowManualInput: boolean
  disclosureProps: UseDisclosureReturn
  labelSeparator: string
  colorScheme?: ThemingProps<'DatePicker'>['colorScheme']
  size?: ThemingProps<'DatePicker'>['size']
  calendarProps: Pick<
    RangeCalendarProps,
    | 'isCalendarFixedHeight'
    | 'monthsToDisplay'
    | 'isDateUnavailable'
    | 'defaultFocusedDate'
    | 'showTodayButton'
    | 'shouldSetDateOnTodayButtonClick'
    | 'onMonthChange'
    | 'onYearChange'
  >
  inputPattern?: string
}

const DateRangePickerContext =
  createContext<DateRangePickerContextReturn | null>(null)

export const DateRangePickerProvider = ({
  children,
  ...props
}: PropsWithChildren<DateRangePickerProps>) => {
  const value = useProvideDateRangePicker(props)
  return (
    <DateRangePickerContext.Provider value={value}>
      {children}
    </DateRangePickerContext.Provider>
  )
}

export const useDateRangePicker = () => {
  const context = useContext(DateRangePickerContext)
  if (!context) {
    throw new Error(
      'useDateRangePicker must be used within a DateRangePickerProvider',
    )
  }
  return context
}

const useProvideDateRangePicker = ({
  value,
  defaultValue = [null, null],
  onChange,
  labelSeparator = 'to',
  displayFormat = 'dd/MM/yyyy',
  dateFormat = 'dd/MM/yyyy',
  isDisabled: isDisabledProp,
  isReadOnly: isReadOnlyProp,
  isRequired: isRequiredProp,
  isInvalid: isInvalidProp,
  isPrefilled,
  locale,
  allowManualInput = true,
  allowInvalidDates = true,
  closeCalendarOnChange = true,
  onBlur,
  onClick,
  colorScheme,
  refocusOnClose = true,
  size,
  ssr,
  experimental_forceIosNumberKeyboard,
  ...props
}: DateRangePickerProps): DateRangePickerContextReturn => {
  const initialFocusRef = useRef<HTMLInputElement>(null)
  const startInputRef = useRef<HTMLInputElement>(null)
  const endInputRef = useRef<HTMLInputElement>(null)

  const calendarProps = pickRangeCalendarProps(props)

  const isMobile = useIsMobile({ ssr })

  const inputPattern = useMemo(() => {
    if (experimental_forceIosNumberKeyboard) {
      return '[0-9]*'
    }
  }, [experimental_forceIosNumberKeyboard])

  const disclosureProps = useDisclosure({
    onClose: () => {
      if (!refocusOnClose) return
      // Refocus input after closing calendar.
      setTimeout(() => endInputRef.current?.focus(), 0)
    },
  })

  const [internalValue, setInternalValue] = useControllableState({
    defaultValue,
    value,
    onChange,
  })
  const [startDate, endDate] = internalValue

  // What is rendered as a string in the start date range input according to given display format.
  const [startInputDisplay, setStartInputDisplay] = useState(
    startDate && isValid(startDate)
      ? format(startDate, displayFormat, { locale })
      : '',
  )
  // What is rendered as a string in the end date range input according to given display format.
  const [endInputDisplay, setEndInputDisplay] = useState(
    endDate && isValid(endDate)
      ? format(endDate, displayFormat, { locale })
      : '',
  )

  const handleUpdateInputs = useCallback(
    (nextRange: DateRangeValue) => {
      const { start, end } = validateDateRange(nextRange)

      if (start.date) {
        if (start.isValid) {
          setStartInputDisplay(format(start.date, displayFormat, { locale }))
        } else if (!allowInvalidDates) {
          setStartInputDisplay('')
        }
      } else {
        setStartInputDisplay('')
      }
      if (end.date) {
        if (end.isValid) {
          setEndInputDisplay(format(end.date, displayFormat, { locale }))
        } else if (!allowInvalidDates) {
          setEndInputDisplay('')
        }
      } else {
        setEndInputDisplay('')
      }

      return [start.date, end.date] as DateRangeValue
    },
    [allowInvalidDates, displayFormat, locale],
  )

  // This effect is responsible for updating the rendered values when the value prop changes.
  useEffect(() => {
    const { start, end } = validateDateRange(internalValue)
    if (start.isValid && end.isValid) {
      handleUpdateInputs(internalValue)
    }
  }, [handleUpdateInputs, internalValue])

  const handleUpdateInputsAndRender = useCallback(
    (nextRange: DateRangeValue) => {
      const validRange = handleUpdateInputs(nextRange)
      setInternalValue(validRange)
    },
    [handleUpdateInputs, setInternalValue],
  )

  const fcProps = useFormControlProps({
    isInvalid: isInvalidProp,
    isDisabled: isDisabledProp,
    isReadOnly: isReadOnlyProp,
    isRequired: isRequiredProp,
    'aria-describedby': props['aria-describedby'],
    onFocus: props.onFocus,
    id: props.id,
  })

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const startDate = parse(startInputDisplay, dateFormat, new Date())
      const endDate = parse(endInputDisplay, dateFormat, new Date())
      // Clear if input is invalid on blur if invalid dates are not allowed.
      if (!allowInvalidDates && !isValid(startDate)) {
        setStartInputDisplay('')
      }
      if (!allowInvalidDates && !isValid(endDate)) {
        setEndInputDisplay('')
      }
      handleUpdateInputsAndRender([startDate, endDate])
      onBlur?.(e)
    },
    [
      startInputDisplay,
      dateFormat,
      endInputDisplay,
      allowInvalidDates,
      handleUpdateInputsAndRender,
      onBlur,
    ],
  )

  const handleInputClick: MouseEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.stopPropagation()
      if (!allowManualInput) {
        disclosureProps.onOpen()
      }
      onClick?.(e)
    },
    [allowManualInput, disclosureProps, onClick],
  )

  const calendarButtonAria = useMemo(() => {
    let ariaLabel = 'Select from date picker. '
    if (!startDate && !endDate) return ariaLabel + 'No date range selected.'
    if (startDate && !endDate) {
      if (isValid(startDate)) {
        ariaLabel += `Selected date is ${startDate.toDateString()}.`
      } else {
        ariaLabel += 'Selected start date is invalid.'
      }
      // Both date range exists
    } else {
      ariaLabel += `Selected date range is ${startDate?.toDateString()} to ${endDate?.toDateString()}.`
    }
    return ariaLabel
  }, [endDate, startDate])

  const handleStartDateChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const date = parse(event.target.value, dateFormat, new Date())
    setStartInputDisplay(event.target.value)
    let clonedValue = [...internalValue] as DateRangeValue

    if (!isValid(date)) {
      if (clonedValue.length > 0) {
        clonedValue = [null, null]
      }
    } else {
      clonedValue[0] = date
    }

    setInternalValue(clonedValue)
  }

  const handleEndDateChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const date = parse(event.target.value, dateFormat, new Date())
    setEndInputDisplay(event.target.value)
    const [startDate, endDate] = internalValue
    let clonedValue = [...internalValue] as DateRangeValue

    if (!isValid(date)) {
      if (startDate && endDate) {
        clonedValue = [startDate, null]
      }
    } else {
      clonedValue[1] = date
    }

    setInternalValue(clonedValue)
  }

  const handleCalendarDateChange = useCallback(
    (date: DateRangeValue) => {
      const [nextStartDate, nextEndDate] = date
      setInternalValue(date)
      setStartInputDisplay(
        nextStartDate ? format(nextStartDate, displayFormat, { locale }) : '',
      )

      setEndInputDisplay(
        nextEndDate ? format(nextEndDate, displayFormat, { locale }) : '',
      )
      if (nextStartDate && nextEndDate && closeCalendarOnChange) {
        disclosureProps.onClose()
      }
    },
    [
      closeCalendarOnChange,
      disclosureProps,
      displayFormat,
      locale,
      setInternalValue,
    ],
  )

  const handleFieldContainerClick = useCallback(() => {
    if (allowManualInput) {
      startInputRef.current?.focus()
    } else {
      disclosureProps.onOpen()
    }
  }, [allowManualInput, disclosureProps])

  const styles = useMultiStyleConfig('DateRangePicker', {
    size,
    colorScheme,
    isPrefilled,
  })

  const placeholder = useMemo(
    () => displayFormat.toLowerCase(),
    [displayFormat],
  )

  return {
    isMobile,
    styles,
    handleCalendarDateChange,
    handleFieldContainerClick,
    handleStartDateChange,
    handleEndDateChange,
    handleInputClick,
    calendarButtonAria,
    startInputRef,
    endInputRef,
    initialFocusRef,
    handleInputBlur,
    fcProps,
    internalValue,
    startInputDisplay,
    endInputDisplay,
    closeCalendarOnChange,
    placeholder,
    allowManualInput,
    colorScheme,
    size,
    disclosureProps,
    labelSeparator,
    calendarProps,
    inputPattern,
  }
}
