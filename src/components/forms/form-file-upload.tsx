"use client"

import {
  CheckCircle2,
  FileText,
  ImageIcon,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react"
import * as React from "react"
import Dropzone, { type Accept, type FileRejection } from "react-dropzone"
import { Controller, useFormContext } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils/cn.utils"
import { useUploadFilesMutation } from "@/store/api/common.api"

type FormFileUploadProps = {
  name: string
  label: string
  accept?: string
  acceptedFileTypes?: string[]
  description?: string
  disabled?: boolean
  maxFiles?: number
  maxSizeMB?: number
  multiple?: boolean
  placeholder?: string
  preview?: boolean
  required?: boolean
  uploadFieldName?: string
  uploadType?: "profile" | "service"
  onUploadComplete?: (urls: string[]) => void
}

const DEFAULT_MAX_SIZE_MB = 5
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
]
const EXTENSIONS_BY_MIME: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "image/avif": [".avif"],
  "image/gif": [".gif"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/svg+xml": [".svg"],
  "image/webp": [".webp"],
}
const MIME_BY_EXTENSION = Object.entries(EXTENSIONS_BY_MIME).reduce<
  Record<string, string>
>((acc, [mimeType, extensions]) => {
  extensions.forEach((extension) => {
    acc[extension] = mimeType
  })

  return acc
}, {})

export function FormFileUpload({
  name,
  label,
  accept,
  acceptedFileTypes,
  description,
  disabled,
  maxFiles,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  multiple = false,
  placeholder,
  preview = true,
  required,
  uploadFieldName = "files",
  uploadType = "profile",
  onUploadComplete,
}: FormFileUploadProps) {
  const { control } = useFormContext()
  const [uploadFiles, { isLoading: isUploading }] = useUploadFilesMutation()
  const [localError, setLocalError] = React.useState<string | null>(null)
  const inputId = React.useId()

  const allowedTypes = React.useMemo(() => {
    const source =
      acceptedFileTypes && acceptedFileTypes.length > 0
        ? acceptedFileTypes
        : accept
          ? accept.split(",")
          : []

    return source.map((type) => type.trim()).filter(Boolean)
  }, [accept, acceptedFileTypes])

  const inputAccept = accept ?? allowedTypes.join(",")
  const dropzoneAccept = React.useMemo(
    () => toDropzoneAccept(allowedTypes),
    [allowedTypes]
  )
  const fileLimit = Math.max(1, multiple ? (maxFiles ?? 10) : 1)
  const maxSizeBytes =
    Number.isFinite(maxSizeMB) && maxSizeMB > 0
      ? maxSizeMB * 1024 * 1024
      : undefined
  const typeSummary = formatAcceptedTypes(allowedTypes)
  const allowsImagePreview = preview && allowsImages(allowedTypes)
  const helperText =
    description ??
    (multiple
      ? `You can upload up to ${fileLimit} files.`
      : "Drag and drop file here, or click to browse.")

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const urls = normalizeUrls(field.value)
        const isDisabled = disabled || isUploading
        const remainingSlots = Math.max(0, fileLimit - urls.length)
        const dropzoneDisabled = isDisabled || remainingSlots === 0
        const shownError =
          localError ||
          (typeof fieldState.error?.message === "string"
            ? fieldState.error.message
            : null)
        const helperId = `${inputId}-helper`
        const errorId = `${inputId}-error`
        const uploadTitle = getUploadTitle({
          isUploading,
          multiple,
          placeholder,
          remainingSlots,
          urlsCount: urls.length,
        })

        const commitUrls = (nextUrls: string[]) => {
          field.onChange(multiple ? nextUrls : (nextUrls[0] ?? ""))
        }

        const uploadSelectedFiles = async (selectedFiles: File[]) => {
          if (isDisabled || selectedFiles.length === 0) return

          setLocalError(null)

          if (!multiple && selectedFiles.length > 1) {
            setLocalError("Only one file can be uploaded.")
            return
          }

          if (remainingSlots <= 0) {
            setLocalError("Remove a file before uploading another.")
            return
          }

          if (selectedFiles.length > remainingSlots) {
            setLocalError(getFileLimitMessage(remainingSlots, fileLimit))
            return
          }

          const invalidTypeFile = selectedFiles.find(
            (file) => !matchesFileType(file, allowedTypes)
          )
          if (invalidTypeFile) {
            setLocalError(
              `${invalidTypeFile.name} is not an allowed file type.`
            )
            return
          }

          const oversizedFile = maxSizeBytes
            ? selectedFiles.find((file) => file.size > maxSizeBytes)
            : undefined
          if (oversizedFile && maxSizeBytes) {
            setLocalError(
              `${oversizedFile.name} is larger than ${formatBytes(maxSizeBytes)}.`
            )
            return
          }

          const formData = new FormData()
          formData.append("type", uploadType)
          selectedFiles.forEach((file) =>
            formData.append(uploadFieldName, file)
          )

          try {
            const response = await uploadFiles(formData).unwrap()
            const uploadedUrls = getUploadedUrls(response)

            if (uploadedUrls.length === 0) {
              setLocalError("Upload completed without a file URL.")
              return
            }

            const acceptedUrls = uploadedUrls.slice(0, remainingSlots)
            const nextUrls = multiple
              ? [...urls, ...acceptedUrls]
              : acceptedUrls
            commitUrls(nextUrls)
            field.onBlur()
            onUploadComplete?.(acceptedUrls)
          } catch (error) {
            setLocalError(getUploadErrorMessage(error))
          }
        }

        const handleDrop = (
          acceptedFiles: File[],
          fileRejections: FileRejection[]
        ) => {
          field.onBlur()

          if (fileRejections.length > 0) {
            setLocalError(
              getDropzoneErrorMessage({
                fileRejections,
                fileLimit,
                maxSizeBytes,
                remainingSlots,
              })
            )
            return
          }

          void uploadSelectedFiles(acceptedFiles)
        }

        const removeUrl = (urlToRemove: string) => {
          const nextUrls = urls.filter((url) => url !== urlToRemove)
          commitUrls(nextUrls)
          setLocalError(null)
        }

        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label
                htmlFor={inputId}
                className="text-sm font-medium text-foreground"
              >
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </Label>
              {urls.length > 0 ? (
                <Badge variant="muted" className="text-[11px]">
                  <CheckCircle2 className="size-3" />
                  {multiple ? `${urls.length}/${fileLimit}` : "Uploaded"}
                </Badge>
              ) : null}
            </div>

            <Dropzone
              accept={dropzoneAccept}
              disabled={dropzoneDisabled}
              maxFiles={Math.max(1, remainingSlots)}
              maxSize={maxSizeBytes}
              multiple={multiple}
              noDragEventsBubbling
              onDrop={handleDrop}
            >
              {({
                getInputProps,
                getRootProps,
                isDragAccept,
                isDragActive,
                isDragReject,
                isFocused,
              }) => (
                <div
                  {...getRootProps({
                    "aria-describedby": shownError
                      ? `${helperId} ${errorId}`
                      : helperId,
                    "aria-disabled": dropzoneDisabled,
                    "aria-invalid": Boolean(shownError),
                    "aria-label": label,
                    className: cn(
                      "group relative flex min-h-[64px] items-center rounded-lg border border-dashed border-border bg-background p-3 shadow-xs transition-all outline-none",
                      "hover:border-primary/60 hover:bg-muted/25",
                      isFocused && "border-ring ring-[3px] ring-ring/30",
                      isDragActive &&
                        "border-primary bg-primary/5 ring-[3px] ring-primary/15",
                      isDragAccept && "border-primary",
                      (isDragReject || Boolean(shownError)) &&
                        "border-destructive bg-destructive/5 ring-[3px] ring-destructive/15",
                      dropzoneDisabled &&
                        "bg-muted/20 opacity-95 hover:border-border hover:bg-muted/20"
                    ),
                    role: "button",
                    tabIndex: dropzoneDisabled ? -1 : 0,
                  })}
                >
                  <input
                    {...getInputProps({
                      accept: inputAccept,
                      "aria-describedby": shownError
                        ? `${helperId} ${errorId}`
                        : helperId,
                      "aria-invalid": Boolean(shownError),
                      id: inputId,
                      name: field.name,
                      onBlur: field.onBlur,
                    })}
                  />

                  <div className="flex w-full items-center gap-3">
                    {/* Left Icon Box */}
                    <div
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground transition-colors",
                        isDragActive &&
                          "border-primary/40 bg-primary/10 text-primary",
                        Boolean(shownError) &&
                          "border-destructive/30 bg-destructive/10 text-destructive"
                      )}
                    >
                      {isUploading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : !multiple &&
                        urls.length > 0 &&
                        (allowsImagePreview || isImageUrl(urls[0])) ? (
                        <img
                          src={urls[0]}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : allowsImagePreview ? (
                        <ImageIcon className="size-4" />
                      ) : (
                        <UploadCloud className="size-4" />
                      )}
                    </div>

                    {/* Middle Text Info */}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                        {isDragActive ? `Drop to upload` : uploadTitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                        <span>{typeSummary}</span>
                        {maxSizeBytes && (
                          <span className="border-l border-border pl-1.5">
                            {formatBytes(maxSizeBytes)} max
                          </span>
                        )}
                        {multiple && (
                          <span className="border-l border-border pl-1.5">
                            {remainingSlots} left
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Button Action */}
                    {!multiple && urls.length > 0 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isDisabled}
                        className="h-8 shrink-0 cursor-pointer px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          removeUrl(urls[0])
                        }}
                      >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Remove
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={dropzoneDisabled}
                        className="h-8 shrink-0 px-3 text-xs"
                      >
                        {isUploading ? (
                          <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <UploadCloud className="mr-1 h-3.5 w-3.5" />
                        )}
                        Browse
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Dropzone>

            {urls.length > 0 &&
            (multiple || !(allowsImagePreview || isImageUrl(urls[0]))) ? (
              <div className="mt-2 flex flex-wrap gap-4">
                {urls.map((url, index) => {
                  const showImage = allowsImagePreview || isImageUrl(url)
                  const displayName = getFileNameFromUrl(url, index)

                  if (showImage) {
                    return (
                      <div
                        key={`${url}-${index}`}
                        className="group/item relative size-20 shrink-0"
                      >
                        <div
                          role="img"
                          aria-label={displayName}
                          className="h-full w-full rounded-lg border border-border bg-muted bg-cover bg-center transition-all"
                          style={{
                            backgroundImage: `url(${JSON.stringify(url)})`,
                          }}
                        />
                        <button
                          type="button"
                          disabled={isDisabled}
                          onClick={() => removeUrl(url)}
                          className="text-destructive-foreground absolute -top-1.5 -right-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-destructive shadow-md transition-all hover:bg-destructive/90"
                          aria-label={`Remove file ${index + 1}`}
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={`${url}-${index}`}
                      className="flex max-w-xs min-w-0 items-center gap-2.5 rounded-lg border border-border bg-background p-2 pr-3 shadow-xs transition-all hover:border-primary/40"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                        <FileText className="size-4.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate text-xs font-semibold text-foreground hover:text-primary hover:underline"
                        >
                          {displayName}
                        </a>
                      </div>

                      <button
                        type="button"
                        disabled={isDisabled}
                        onClick={() => removeUrl(url)}
                        className="shrink-0 cursor-pointer text-muted-foreground hover:text-foreground focus-visible:outline-none"
                        aria-label={`Remove file ${index + 1}`}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : null}

            {shownError ? (
              <p id={errorId} className="text-xs text-destructive">
                {shownError}
              </p>
            ) : null}
          </div>
        )
      }}
    />
  )
}

function normalizeUrls(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(isNonEmptyString)
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()]
  }

  return []
}

function getUploadedUrls(response: unknown) {
  if (!isRecord(response)) return []

  if (Array.isArray(response.urls)) {
    return response.urls.filter(isNonEmptyString)
  }

  if (isRecord(response.data) && Array.isArray(response.data.urls)) {
    return response.data.urls.filter(isNonEmptyString)
  }

  return []
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0
}

function toDropzoneAccept(allowedTypes: string[]): Accept | undefined {
  if (allowedTypes.length === 0 || allowedTypes.includes("*/*")) {
    return undefined
  }

  return allowedTypes.reduce<Accept>((acc, allowedType) => {
    const normalizedType = allowedType.toLowerCase()

    if (normalizedType.startsWith(".")) {
      const mimeType = MIME_BY_EXTENSION[normalizedType]

      if (mimeType) {
        acc[mimeType] = Array.from(
          new Set([...(acc[mimeType] ?? []), normalizedType])
        )
      }

      return acc
    }

    acc[normalizedType] = EXTENSIONS_BY_MIME[normalizedType] ?? []

    return acc
  }, {})
}

function matchesFileType(file: File, allowedTypes: string[]) {
  if (allowedTypes.length === 0 || allowedTypes.includes("*/*")) {
    return true
  }

  const fileName = file.name.toLowerCase()
  const fileType = file.type.toLowerCase()

  return allowedTypes.some((allowedType) => {
    const normalizedType = allowedType.toLowerCase()

    if (normalizedType.startsWith(".")) {
      return fileName.endsWith(normalizedType)
    }

    if (normalizedType.endsWith("/*")) {
      const prefix = normalizedType.slice(0, -1)
      if (fileType.startsWith(prefix)) return true
      if (normalizedType === "image/*") {
        return IMAGE_EXTENSIONS.some((extension) =>
          fileName.endsWith(extension)
        )
      }
      return false
    }

    if (fileType === normalizedType) return true

    return (EXTENSIONS_BY_MIME[normalizedType] ?? []).some((extension) =>
      fileName.endsWith(extension)
    )
  })
}

function allowsImages(allowedTypes: string[]) {
  if (allowedTypes.length === 0 || allowedTypes.includes("*/*")) return false

  return allowedTypes.some((allowedType) => {
    const normalizedType = allowedType.toLowerCase()
    return (
      normalizedType === "image/*" ||
      normalizedType.startsWith("image/") ||
      IMAGE_EXTENSIONS.includes(normalizedType)
    )
  })
}

function isImageUrl(url: string) {
  return /\.(avif|gif|jpe?g|png|svg|webp)(\?|#|$)/i.test(url)
}

function formatAcceptedTypes(allowedTypes: string[]) {
  if (allowedTypes.length === 0 || allowedTypes.includes("*/*")) {
    return "Any file"
  }

  const labels = allowedTypes.map((type) => {
    const normalizedType = type.toLowerCase()
    if (normalizedType === "image/*") return "Images"
    if (normalizedType === "application/pdf" || normalizedType === ".pdf") {
      return "PDF"
    }
    if (normalizedType.startsWith(".")) {
      return normalizedType.toUpperCase().replace(".", "")
    }
    return normalizedType
  })

  return Array.from(new Set(labels)).join(", ")
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kilobytes = bytes / 1024
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`
  const megabytes = kilobytes / 1024
  if (megabytes < 1024) return `${megabytes.toFixed(1)} MB`
  return `${(megabytes / 1024).toFixed(1)} GB`
}

function getFileLimitMessage(remainingSlots: number, fileLimit: number) {
  if (remainingSlots <= 0) {
    return "Remove a file before uploading another."
  }

  if (remainingSlots === 1) {
    return "You can add 1 more file."
  }

  return `You can upload up to ${fileLimit} files.`
}

function getDropzoneErrorMessage({
  fileRejections,
  fileLimit,
  maxSizeBytes,
  remainingSlots,
}: {
  fileRejections: FileRejection[]
  fileLimit: number
  maxSizeBytes?: number
  remainingSlots: number
}) {
  const firstRejection = fileRejections[0]
  const firstError = firstRejection?.errors[0]
  const fileName = firstRejection?.file.name

  if (!firstError) {
    return "This file cannot be uploaded."
  }

  if (firstError.code === "file-too-large" && maxSizeBytes) {
    return `${fileName} is larger than ${formatBytes(maxSizeBytes)}.`
  }

  if (firstError.code === "file-invalid-type") {
    return `${fileName} is not an allowed file type.`
  }

  if (firstError.code === "too-many-files") {
    return getFileLimitMessage(remainingSlots, fileLimit)
  }

  return firstError.message || "This file cannot be uploaded."
}

function getUploadTitle({
  isUploading,
  multiple,
  placeholder,
  remainingSlots,
  urlsCount,
}: {
  isUploading: boolean
  multiple: boolean
  placeholder?: string
  remainingSlots: number
  urlsCount: number
}) {
  if (isUploading) return "Uploading..."

  if (remainingSlots === 0 && urlsCount > 0) {
    return multiple ? "Upload limit reached" : "File uploaded"
  }

  return placeholder ?? (multiple ? "Upload files" : "Upload file")
}

function getFileNameFromUrl(url: string, index: number) {
  try {
    const parsedUrl = new URL(url, "https://upload.local")
    const fileName = parsedUrl.pathname.split("/").filter(Boolean).pop()

    if (fileName) {
      return decodeURIComponent(fileName)
    }
  } catch {
    const fileName = url.split(/[?#]/)[0]?.split("/").filter(Boolean).pop()

    if (fileName) {
      return fileName
    }
  }

  return `File ${index + 1}`
}

function getUploadErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "data" in error) {
    const data = (error as { data?: { message?: unknown } }).data
    if (typeof data?.message === "string") {
      return data.message
    }
  }

  return "Upload failed. Please try again."
}
