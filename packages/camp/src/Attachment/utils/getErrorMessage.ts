import { ErrorCode, FileRejection } from 'react-dropzone'

import { getFileExtension } from './getFileExtension'

export const getErrorMessage = (rejectedFile: FileRejection): string => {
  const firstError = rejectedFile.errors[0]
  switch (firstError.code) {
    case ErrorCode.FileInvalidType: {
      const fileExt = getFileExtension(rejectedFile.file.name)
      return `Your file's extension ending in *${fileExt} is not allowed`
    }
    case ErrorCode.TooManyFiles: {
      // Use custom message if provided, otherwise use default
      return (
        firstError.message || 'You can only upload a single file in this input'
      )
    }
    default:
      return firstError.message
  }
}
