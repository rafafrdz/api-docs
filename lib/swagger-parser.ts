import { load } from "js-yaml"
import type { ApiData, ApiEndpoint, ApiParameter, ApiResponse } from "@/lib/types"

export async function parseSwaggerYaml(yamlContent: string): Promise<ApiData> {
  try {
    // Parse YAML to JavaScript object
    const swagger = load(yamlContent) as any

    // Extract basic API information
    const apiData: ApiData = {
      title: swagger.info.title || "API Documentation",
      description: swagger.info.description || "",
      version: swagger.info.version || "1.0.0",
      tags: [],
      endpoints: [],
    }

    // Extract tags
    if (swagger.tags && Array.isArray(swagger.tags)) {
      apiData.tags = swagger.tags.map((tag: any) => tag.name)
    } else {
      // If no tags are defined, extract them from the paths
      const tagSet = new Set<string>()

      if (swagger.paths) {
        Object.entries(swagger.paths).forEach(([path, pathItem]: [string, any]) => {
          Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
            if (operation.tags && Array.isArray(operation.tags)) {
              operation.tags.forEach((tag: string) => tagSet.add(tag))
            }
          })
        })
      }

      apiData.tags = Array.from(tagSet)
    }

    // If still no tags, create a default one
    if (apiData.tags.length === 0) {
      apiData.tags = ["General"]
    }

    // Extract endpoints
    if (swagger.paths) {
      Object.entries(swagger.paths).forEach(([path, pathItem]: [string, any]) => {
        Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
          if (method === "parameters") return // Skip path-level parameters

          const tag = operation.tags && operation.tags.length > 0 ? operation.tags[0] : apiData.tags[0]

          // Parse parameters
          const parameters: ApiParameter[] = []

          // Path-level parameters
          if (pathItem.parameters && Array.isArray(pathItem.parameters)) {
            pathItem.parameters.forEach((param: any) => {
              parameters.push({
                name: param.name,
                in: param.in,
                required: param.required || false,
                type: getParameterType(param),
                description: param.description || "",
              })
            })
          }

          // Operation-level parameters
          if (operation.parameters && Array.isArray(operation.parameters)) {
            operation.parameters.forEach((param: any) => {
              parameters.push({
                name: param.name,
                in: param.in,
                required: param.required || false,
                type: getParameterType(param),
                description: param.description || "",
              })
            })
          }

          // Parse request body
          let requestBody = undefined
          if (operation.requestBody) {
            const content = operation.requestBody.content
            const contentType = Object.keys(content)[0] || "application/json"
            const schema = content[contentType].schema

            requestBody = {
              contentType,
              schema: resolveSchema(schema, swagger.components?.schemas),
            }
          } else if (operation.consumes && operation.parameters) {
            // OpenAPI 2.0 style
            const bodyParam = operation.parameters.find((p: any) => p.in === "body")
            if (bodyParam) {
              requestBody = {
                contentType: operation.consumes[0] || "application/json",
                schema: resolveSchema(bodyParam.schema, swagger.definitions),
              }
            }
          }

          // Parse responses
          const responses: ApiResponse[] = []
          if (operation.responses) {
            Object.entries(operation.responses).forEach(([status, response]: [string, any]) => {
              let schema = undefined
              let contentType = undefined

              // OpenAPI 3.0 style
              if (response.content) {
                contentType = Object.keys(response.content)[0]
                if (contentType && response.content[contentType].schema) {
                  schema = resolveSchema(response.content[contentType].schema, swagger.components?.schemas)
                }
              }
              // OpenAPI 2.0 style
              else if (response.schema) {
                contentType = operation.produces ? operation.produces[0] : "application/json"
                schema = resolveSchema(response.schema, swagger.definitions)
              }

              responses.push({
                status,
                description: response.description || "",
                contentType,
                schema,
              })
            })
          }

          // Determine security
          let security = undefined
          if (operation.security || swagger.security) {
            const securityRequirements = operation.security || swagger.security
            if (securityRequirements && securityRequirements.length > 0) {
              const securityScheme = Object.keys(securityRequirements[0])[0]
              if (securityScheme) {
                // Check security scheme type
                const scheme =
                  swagger.components?.securitySchemes?.[securityScheme] || swagger.securityDefinitions?.[securityScheme]
                if (scheme) {
                  if (scheme.type === "http" && scheme.scheme === "bearer") {
                    security = "bearer"
                  } else if (scheme.type === "apiKey") {
                    security = "apiKey"
                  } else if (scheme.type === "oauth2") {
                    security = "oauth2"
                  } else {
                    security = scheme.type
                  }
                }
              }
            }
          }

          const endpoint: ApiEndpoint = {
            path,
            method,
            tag,
            summary: operation.summary || "",
            description: operation.description || "",
            parameters: parameters.length > 0 ? parameters : undefined,
            requestBody,
            responses: responses.length > 0 ? responses : undefined,
            security,
          }

          apiData.endpoints.push(endpoint)
        })
      })
    }

    return apiData
  } catch (error) {
    console.error("Error parsing Swagger YAML:", error)
    throw new Error("Failed to parse Swagger YAML")
  }
}

function getParameterType(param: any): string {
  if (param.schema) {
    return getSchemaType(param.schema)
  }

  if (param.type) {
    return param.type
  }

  return "string"
}

function getSchemaType(schema: any): string {
  if (schema.$ref) {
    // Extract the type name from the reference
    const refParts = schema.$ref.split("/")
    return refParts[refParts.length - 1]
  }

  if (schema.type === "array" && schema.items) {
    return `array[${getSchemaType(schema.items)}]`
  }

  return schema.type || "object"
}

function resolveSchema(schema: any, definitions: any): any {
  if (!schema) return undefined

  // If it's a reference, resolve it
  if (schema.$ref) {
    const refPath = schema.$ref.split("/")
    const refName = refPath[refPath.length - 1]

    if (definitions && definitions[refName]) {
      // Create a simplified version of the schema
      return createExampleFromSchema(definitions[refName], definitions)
    }

    return { type: refName }
  }

  // If it's an array, resolve the items
  if (schema.type === "array" && schema.items) {
    const itemSchema = resolveSchema(schema.items, definitions)
    return [itemSchema]
  }

  // If it's an object with properties
  if (schema.type === "object" || schema.properties) {
    return createExampleFromSchema(schema, definitions)
  }

  // For primitive types
  if (schema.type === "string") {
    if (schema.format === "date-time" || schema.format === "date") {
      return "2023-01-01T00:00:00Z"
    }
    if (schema.format === "email") {
      return "usuario@ejemplo.com"
    }
    if (schema.format === "uuid") {
      return "123e4567-e89b-12d3-a456-426614174000"
    }
    return "ejemplo"
  }

  if (schema.type === "number" || schema.type === "integer") {
    return 123
  }

  if (schema.type === "boolean") {
    return true
  }

  // Default case
  return {}
}

function createExampleFromSchema(schema: any, definitions: any): any {
  const result: Record<string, any> = {}

  // If it has properties, use them
  if (schema.properties) {
    Object.entries(schema.properties).forEach(([propName, propSchema]: [string, any]) => {
      result[propName] = resolveSchema(propSchema, definitions)
    })
  }

  return result
}

