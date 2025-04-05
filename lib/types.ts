export interface ApiEndpoint {
  path: string
  method: string
  tag: string
  summary: string
  description: string
  parameters?: ApiParameter[]
  requestBody?: {
    contentType: string
    schema: any
  }
  responses?: ApiResponse[]
  security?: string
}

export interface ApiParameter {
  name: string
  in: string
  required: boolean
  type: string
  description: string
}

export interface ApiResponse {
  status: string
  description: string
  contentType?: string
  schema?: any
}

export interface ApiData {
  title: string
  description: string
  version: string
  tags: string[]
  endpoints: ApiEndpoint[]
}

