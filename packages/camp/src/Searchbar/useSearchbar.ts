import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

interface UseSearchbarReturn {
  inputRef: RefObject<HTMLInputElement | null>
  isExpanded: boolean
  handleExpansion: () => void
  handleCollapse: () => void
}

interface UseSearchbarOptions {
  /** If true, the searchbar will be expanded on initial render. */
  isInitiallyExpanded?: boolean
  /** If true (default), focus the input whenever the searchbar expands. */
  isFocusOnExpand?: boolean
}

export const useSearchbar = ({
  isInitiallyExpanded = false,
  isFocusOnExpand = true,
}: UseSearchbarOptions): UseSearchbarReturn => {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isFocusOnExpand && isExpanded) {
      inputRef.current?.focus()
    }
  }, [isExpanded, isFocusOnExpand])

  const handleExpansion = useCallback(() => setIsExpanded(true), [])
  const handleCollapse = useCallback(() => setIsExpanded(false), [])

  return { inputRef, isExpanded, handleExpansion, handleCollapse }
}
