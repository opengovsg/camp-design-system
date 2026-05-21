import { createContext, type RefObject, useContext } from 'react'

export interface CheckboxOthersContextValue {
  checkboxRef: RefObject<HTMLInputElement | null>
  inputRef: RefObject<HTMLInputElement | null>
}

export const CheckboxOthersContext =
  createContext<CheckboxOthersContextValue | null>(null)

export const useCheckboxOthers = (): CheckboxOthersContextValue => {
  const ctx = useContext(CheckboxOthersContext)
  if (!ctx) {
    throw new Error(
      'Checkbox.OthersCheckbox and Checkbox.OthersInput must be used inside Checkbox.OthersWrapper',
    )
  }
  return ctx
}
