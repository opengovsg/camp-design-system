import { ForwardedRef, forwardRef, useCallback, useMemo } from 'react'
import {
  DropzoneProps,
  ErrorCode,
  FileRejection,
  useDropzone,
} from 'react-dropzone'
import {
  Box,
  Stack,
  Text,
  ThemingProps,
  useFormControl,
  UseFormControlProps,
  useMergeRefs,
  useMultiStyleConfig,
} from '@chakra-ui/react'
import { dataAttr } from '@chakra-ui/utils'
import omit from 'lodash/omit'
import type { Promisable } from 'type-fest'

import { getErrorMessage } from './utils/getErrorMessage'
import { AttachmentStylesProvider } from './AttachmentContext'
import { AttachmentDropzone } from './AttachmentDropzone'
import { AttachmentError } from './AttachmentError'
import { AttachmentFileInfo } from './AttachmentFileInfo'
import { getReadableFileSize } from './utils'

interface WithForwardRefType<M extends boolean>
  extends React.FC<AttachmentProps<M>> {
  <M extends boolean>(
    props: AttachmentProps<M>,
  ): ReturnType<React.FC<AttachmentProps<M>>>
}

type AttachmentValueProp<Multiple extends boolean> = Multiple extends true
  ? {
      /**
       * Boolean flag on whether to support multiple file upload.
       */
      multiple: true
      /**
       * Callback to be invoked when the file is attached or removed.
       */
      onChange: (files: File[]) => void
      /**
       * Current value of the input.
       */
      value: File[]
    }
  : {
      /**
       * Boolean flag on whether to support multiple file upload.
       */
      multiple?: false
      /**
       * Callback to be invoked when the file is attached or removed.
       */
      onChange: (file?: File) => void
      /**
       * Current value of the input.
`       */
      value: File | undefined
    }

export type AttachmentProps<Multiple extends boolean> =
  UseFormControlProps<HTMLElement> & {
    /**
     * If exists, callback to be invoked when file has errors.
     */
    onError?: (errMsg: string) => void
    /**
     * Name of the input.
     */
    name: string
    /**
     * One or more
     * [unique file type specifiers](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers)
     * describing file types to allow
     */
    accept?: DropzoneProps['accept']
    /**
     * If exists, files cannot be attached if they are above the maximum size
     * (in bytes).
     */
    maxSize?: DropzoneProps['maxSize']
    /**
     * Boolean flag on whether to show the file size helper message below the
     * input.
     */
    showFileSize?: boolean

    /**
     * If provided, the image preview will be shown in the given size variant.
     */
    imagePreview?: 'small' | 'large'

    /**
     * Color scheme of the component.
     */
    colorScheme?: ThemingProps<'Attachment'>['colorScheme']

    /**
     * If provided, the file will be validated against the given function.
     * If the function returns a string, the file will be considered invalid
     * and the string will be used as the error message.
     * If the function returns null, the file will be considered valid.
     */
    onFileValidation?: (file: File) => Promisable<string | null>

    /**
     * If provided, files that have been rejected will be displayed along with the reasons for rejection.
     */
    rejections?: FileRejection[]

    /**
     * If exists, callback to be invoked when file has errors.
     */
    onRejection?: (rejections: FileRejection[]) => void

    /**
     * Maximum number of files allowed when multiple upload is enabled.
     * If not specified, there is no limit. Only applicable when multiple is true.
     */
    maxFiles?: number
  } & AttachmentValueProp<Multiple>

export const Attachment: WithForwardRefType<boolean> = forwardRef<
  HTMLDivElement,
  AttachmentProps<boolean>
>(
  <M extends boolean>(
    {
      onChange,
      onError,
      maxSize,
      showFileSize,
      accept,
      value,
      name,
      colorScheme,
      imagePreview,
      onFileValidation,
      multiple,
      maxFiles,
      rejections,
      onRejection,
      ...props
    }: AttachmentProps<M>,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    // Merge given props with any form control props, if they exist.
    const inputProps = useFormControl(props)
    // id to set on the rendered max size FormHelperText component.
    const maxSizeTextId = useMemo(() => `${name}-max-size`, [name])

    const readableMaxSize = useMemo(
      () => (maxSize ? getReadableFileSize(maxSize) : undefined),
      [maxSize],
    )

    const hasValue = useMemo(
      () => (multiple ? value.length > 0 : !!value),
      [multiple, value],
    )

    // Check if max files limit is reached (only applicable in multiple mode)
    const isMaxFilesReached = useMemo(
      () => multiple && maxFiles !== undefined && value.length >= maxFiles,
      [multiple, maxFiles, value],
    )

    // Dropzone is displayed when:
    // - Multiple mode: always, unless maxFiles limit is reached
    // - Single mode: only when no file is attached
    const showDropzone = useMemo(
      () => (multiple ? !isMaxFilesReached : !hasValue),
      [multiple, isMaxFilesReached, hasValue],
    )

    const filesArrayForRender = useMemo(() => {
      return multiple ? value : value ? [value] : []
    }, [multiple, value])

    const showMaxSize = useMemo(() => {
      return !hasValue && showFileSize && readableMaxSize
    }, [hasValue, showFileSize, readableMaxSize])

    const chooseMaxSizeText = useMemo(() => {
      const parts: string[] = []
      if (multiple) {
        if (maxFiles) {
          parts.push(`You can upload up to ${maxFiles} files.`)
        } else {
          parts.push('You can upload multiple files.')
        }
      }

      parts.push(`Maximum file size: ${readableMaxSize}`)

      return parts.join(' ')
    }, [multiple, maxFiles, readableMaxSize])

    const ariaDescribedBy = useMemo(() => {
      const describedByIds = new Set<string>()
      // Must be in this order so the screen reader reads out something coherent.
      // 1. Label text (if available)
      // 2. Initial describedby text (if available)
      // 3. Max size text (if prop is true)
      if (inputProps.id) {
        describedByIds.add(`${inputProps.id}-label`)
      }
      inputProps['aria-describedby']
        ?.split(' ')
        .map((id) => describedByIds.add(id))
      if (showMaxSize) {
        describedByIds.add(maxSizeTextId)
      }

      // Remove helptext, since label should already consist of the text
      describedByIds.delete(`${inputProps.id}-helptext`)

      return Array.from(describedByIds).filter(Boolean).join(' ').trim()
    }, [inputProps, maxSizeTextId, showMaxSize])

    const fileValidator = useCallback<NonNullable<DropzoneProps['validator']>>(
      (file) => {
        if (maxSize && file.size > maxSize) {
          return {
            code: ErrorCode.FileTooLarge,
            message: `Failed to upload. This file exceeds the size limit. Please upload a file that is under ${readableMaxSize}`,
          }
        }
        return null
      },
      [maxSize, readableMaxSize],
    )

    const handleFileDrop = useCallback<NonNullable<DropzoneProps['onDrop']>>(
      async (acceptedFiles, rejectedFiles) => {
        const validatedFiles: File[] = []
        const rejects: FileRejection[] = [...rejectedFiles]

        // Check if adding new files would exceed maxFiles limit
        if (multiple && maxFiles) {
          const currentFileCount = Array.isArray(value) ? value.length : 0
          const availableSlots = maxFiles - currentFileCount

          if (availableSlots <= 0) {
            // No more files can be added
            acceptedFiles.forEach((file) => {
              rejects.push({
                file,
                errors: [
                  {
                    code: ErrorCode.TooManyFiles,
                    message: `You can only upload a maximum of ${maxFiles} files`,
                  },
                ],
              })
            })
            if (rejects.length > 0) {
              onError?.(getErrorMessage(rejects[0]))
            }
            onRejection?.(rejects)
            return
          }

          if (acceptedFiles.length > availableSlots) {
            const filesToReject = acceptedFiles.slice(availableSlots)
            acceptedFiles = acceptedFiles.slice(0, availableSlots)
            filesToReject.forEach((file) => {
              rejects.push({
                file,
                errors: [
                  {
                    code: ErrorCode.TooManyFiles,
                    message: `You can only upload a maximum of ${maxFiles} files`,
                  },
                ],
              })
            })
          }
        }

        await Promise.all(
          acceptedFiles.map(async (file) => {
            const fileValidationErrorMessage = await onFileValidation?.(file)
            if (!fileValidationErrorMessage) {
              validatedFiles.push(file)
            } else {
              rejects.push({
                file,
                errors: [
                  {
                    code: 'file-validation-error',
                    message: fileValidationErrorMessage,
                  },
                ],
              })
            }
          }),
        )
        if (rejects.length > 0) {
          onError?.(getErrorMessage(rejects[0]))
        }
        onRejection?.(rejects)
        if (multiple) {
          // append new files to existing ones
          const existingFiles = Array.isArray(value) ? value : []
          onChange([...existingFiles, ...validatedFiles])
        } else {
          onChange(validatedFiles[0])
        }
      },
      [
        multiple,
        maxFiles,
        value,
        onFileValidation,
        onError,
        onRejection,
        onChange,
      ],
    )

    // In single mode, disable interaction when a file is already attached
    // In multiple mode, always allow interaction (unless readOnly/disabled)
    const disableInteraction = useMemo(
      () => inputProps.readOnly || (!multiple && hasValue),
      [inputProps.readOnly, multiple, hasValue],
    )

    const { getRootProps, getInputProps, isDragActive, rootRef } = useDropzone({
      multiple,
      accept,
      disabled: inputProps.disabled,
      validator: fileValidator,
      noKeyboard: disableInteraction,
      noClick: disableInteraction,
      noDrag: disableInteraction,
      onDrop: handleFileDrop,
    })

    const mergedRefs = useMergeRefs(rootRef, ref)

    const styles = useMultiStyleConfig('Attachment', {
      isDragActive,
      colorScheme,
      imagePreview,
    })

    const handleRemoveFile = useCallback(
      (target: File) => {
        if (multiple) {
          const attachedFiles = value.filter((file) => file !== target)
          onChange(attachedFiles)
          if (attachedFiles.length === 0) {
            rootRef.current?.focus()
          }
          return
        }

        onChange(undefined)
        rootRef.current?.focus()
      },
      [multiple, onChange, rootRef, value],
    )

    const handleDismissError = useCallback(
      (target: FileRejection) => {
        if (!rejections) return
        if (multiple) {
          const rejects = rejections.filter((reject) => reject !== target)
          if (rejects) {
            onRejection?.(rejects)
          }
          return
        }
        onRejection?.([])
      },
      [multiple, onRejection, rejections],
    )

    // Bunch of memoization to avoid unnecessary re-renders.
    const processedRootProps = useMemo(() => {
      return getRootProps({
        // Root div does not need id prop, prevents duplicate ids.
        ...omit(inputProps, 'id'),
        // Bunch of extra work to prevent field from being used when in readOnly
        // state.
        onKeyDown: (e) => {
          if (inputProps.readOnly) {
            e.stopPropagation()
            return
          }
        },
        'aria-describedby': ariaDescribedBy,
      })
    }, [ariaDescribedBy, getRootProps, inputProps])

    const processedInputProps = useMemo(() => {
      return getInputProps({
        name,
        ...inputProps,
      })
    }, [getInputProps, inputProps, name])

    return (
      <AttachmentStylesProvider value={styles}>
        <Stack gap="1rem">
          {showDropzone ? (
            <Box
              {...processedRootProps}
              ref={mergedRefs}
              data-active={dataAttr(isDragActive)}
              __css={styles.dropzone}
            >
              <AttachmentDropzone
                isDragActive={isDragActive}
                inputProps={processedInputProps}
              />
            </Box>
          ) : null}
          {isMaxFilesReached ? (
            <Text color="base.content.medium" textStyle="body-2">
              Maximum uploads: {maxFiles}
            </Text>
          ) : null}
          {rejections && rejections.length > 0
            ? rejections.map((fileRejection, index) => (
                <AttachmentError
                  key={`${fileRejection.file.name}${fileRejection.file.size}${index}`}
                  fileRejection={fileRejection}
                  handleDismiss={handleDismissError}
                />
              ))
            : null}
          {hasValue
            ? filesArrayForRender.map((file, index) => (
                <AttachmentFileInfo
                  key={`${file.name}${file.size}${index}`}
                  file={file}
                  imagePreview={imagePreview}
                  isDisabled={inputProps.disabled}
                  isReadOnly={inputProps.readOnly}
                  handleRemoveFile={() => handleRemoveFile(file)}
                />
              ))
            : null}
        </Stack>
        {showMaxSize ? (
          <Text
            id={maxSizeTextId}
            color="base.content.medium"
            mt="0.5rem"
            textStyle="body-2"
          >
            {chooseMaxSizeText}
          </Text>
        ) : null}
      </AttachmentStylesProvider>
    )
  },
)

Attachment.displayName = 'Attachment'
