import { api } from "./api.config"

export interface UploadFilesResponse {
  success: boolean
  statusCode: number
  message: string
  data: {
    urls: string[]
  }
}

export const commonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadFiles: builder.mutation<UploadFilesResponse, FormData>({
      query: (formData) => ({
        url: "/v1/upload-files",
        method: "POST",
        body: formData,
        headers: { hideSuccessToast: "true" },
      }),
    }),
  }),
})

export const { useUploadFilesMutation } = commonApi
