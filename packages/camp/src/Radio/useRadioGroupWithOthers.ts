import { createContext, type RefObject, useContext } from 'react'

export interface RadioGroupContextValue {
  othersRadioRef: RefObject<HTMLInputElement | null>
  othersInputRef: RefObject<HTMLInputElement | null>
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(
  null,
)

export const useRadioGroupWithOthers = (): RadioGroupContextValue => {
  const ctx = useContext(RadioGroupContext)
  if (!ctx) {
    throw new Error(
      'Radio.OthersWrapper and Radio.OthersInput must be used inside Radio.RadioGroup',
    )
  }
  return ctx
}
