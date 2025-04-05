import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ApiEndpoint } from "@/lib/types"
import { CodeBlock } from "@/components/code-block"
import { ApiPlayground } from "@/components/api-playground"
import { SchemaViewer } from "@/components/schema-viewer"

interface ApiEndpointDetailProps {
  endpoint: ApiEndpoint
}

export function ApiEndpointDetail({ endpoint }: ApiEndpointDetailProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge
            className={cn(
              "px-2 py-1 text-sm",
              endpoint.method === "get" && "bg-blue-500 hover:bg-blue-600",
              endpoint.method === "post" && "bg-green-500 hover:bg-green-600",
              endpoint.method === "put" && "bg-yellow-500 hover:bg-yellow-600",
              endpoint.method === "delete" && "bg-red-500 hover:bg-red-600",
              endpoint.method === "patch" && "bg-purple-500 hover:bg-purple-600",
            )}
          >
            {endpoint.method.toUpperCase()}
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight font-mono">{endpoint.path}</h1>
        </div>
        <p className="text-xl font-semibold">{endpoint.summary}</p>
        <p className="text-muted-foreground mt-2">{endpoint.description}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="request">Solicitud</TabsTrigger>
          <TabsTrigger value="response">Respuesta</TabsTrigger>
          <TabsTrigger value="example">Ejemplo</TabsTrigger>
          <TabsTrigger value="playground">Playground</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Endpoint</CardTitle>
              <CardDescription>Detalles sobre este endpoint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">URL</h3>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  {endpoint.method.toUpperCase()} https://api.serverkitesg.com/api{endpoint.path}
                </div>
              </div>

              {endpoint.parameters && endpoint.parameters.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Parámetros</h3>
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead className="bg-muted text-muted-foreground">
                        <tr>
                          <th className="text-left p-2 font-medium">Nombre</th>
                          <th className="text-left p-2 font-medium">Ubicación</th>
                          <th className="text-left p-2 font-medium">Tipo</th>
                          <th className="text-left p-2 font-medium">Requerido</th>
                          <th className="text-left p-2 font-medium">Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoint.parameters.map((param, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2 font-mono text-sm">{param.name}</td>
                            <td className="p-2">{param.in}</td>
                            <td className="p-2">{param.type}</td>
                            <td className="p-2">{param.required ? "Sí" : "No"}</td>
                            <td className="p-2">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {endpoint.security && (
                <div>
                  <h3 className="font-semibold mb-2">Seguridad</h3>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700"
                    >
                      Requiere autenticación
                    </Badge>
                    {endpoint.security === "bearer" && (
                      <Badge
                        variant="outline"
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
                      >
                        Bearer Token
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="request" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solicitud</CardTitle>
              <CardDescription>Detalles de la solicitud</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {endpoint.requestBody ? (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">Cuerpo de la Solicitud</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm mb-2">
                        Tipo de contenido: <code className="text-primary">{endpoint.requestBody.contentType}</code>
                      </p>
                      {endpoint.requestBody.schema && <SchemaViewer schema={endpoint.requestBody.schema} />}
                    </div>
                  </div>
                </>
              ) : (
                <p>Este endpoint no requiere un cuerpo en la solicitud.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Respuesta</CardTitle>
              <CardDescription>Detalles de la respuesta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {endpoint.responses && endpoint.responses.length > 0 ? (
                <div className="space-y-6">
                  {endpoint.responses.map((response, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "px-2 py-1",
                            response.status.startsWith("2") && "bg-green-500",
                            response.status.startsWith("4") && "bg-amber-500",
                            response.status.startsWith("5") && "bg-red-500",
                          )}
                        >
                          {response.status}
                        </Badge>
                        <h3 className="font-semibold">{response.description}</h3>
                      </div>

                      {response.schema && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm mb-2">
                            Tipo de contenido:{" "}
                            <code className="text-primary">{response.contentType || "application/json"}</code>
                          </p>
                          <SchemaViewer schema={response.schema} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay información detallada sobre la respuesta.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="example" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ejemplo</CardTitle>
              <CardDescription>Ejemplo de uso del endpoint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Solicitud cURL</h3>
                <CodeBlock language="bash" code={generateCurlExample(endpoint)} />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Solicitud JavaScript (fetch)</h3>
                <CodeBlock language="javascript" code={generateFetchExample(endpoint)} />
              </div>

              {endpoint.responses && endpoint.responses.length > 0 && endpoint.responses[0].schema && (
                <div>
                  <h3 className="font-semibold mb-2">Respuesta de ejemplo</h3>
                  <CodeBlock language="json" code={JSON.stringify(endpoint.responses[0].schema, null, 2)} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playground" className="space-y-4">
          <ApiPlayground endpoint={endpoint} baseUrl="https://api.serverkitesg.com/api" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function generateCurlExample(endpoint: ApiEndpoint): string {
  let url = `https://api.serverkitesg.com/api${endpoint.path}`

  // Replace path parameters with example values
  if (endpoint.parameters) {
    endpoint.parameters.forEach((param) => {
      if (param.in === "path") {
        url = url.replace(`{${param.name}}`, "example-id")
      }
    })
  }

  // Add query parameters if any
  if (endpoint.parameters && endpoint.parameters.some((p) => p.in === "query")) {
    url += "?"
    endpoint.parameters
      .filter((p) => p.in === "query")
      .forEach((param, index) => {
        if (index > 0) url += "&"
        url += `${param.name}=example`
      })
  }

  let curl = `curl -X ${endpoint.method.toUpperCase()} "${url}"`

  // Add headers
  curl += ' \\\n  -H "Content-Type: application/json"'

  if (endpoint.security) {
    curl += ' \\\n  -H "Authorization: Bearer YOUR_TOKEN"'
  }

  // Add request body if applicable
  if (endpoint.requestBody && endpoint.method !== "get") {
    curl += ` \\\n  -d '${JSON.stringify(generateExampleRequestBody(endpoint.requestBody.schema), null, 2)}'`
  }

  return curl
}

function generateFetchExample(endpoint: ApiEndpoint): string {
  let url = `https://api.serverkitesg.com/api${endpoint.path}`

  // Replace path parameters with example values
  if (endpoint.parameters) {
    endpoint.parameters.forEach((param) => {
      if (param.in === "path") {
        url = url.replace(`{${param.name}}`, "example-id")
      }
    })
  }

  // Add query parameters if any
  if (endpoint.parameters && endpoint.parameters.some((p) => p.in === "query")) {
    url += "?"
    endpoint.parameters
      .filter((p) => p.in === "query")
      .forEach((param, index) => {
        if (index > 0) url += "&"
        url += `${param.name}=example`
      })
  }

  let code = `async function call${capitalizeFirstLetter(endpoint.method)}${endpoint.path.split("/").filter(Boolean).map(capitalizeFirstLetter).join("")}() {
  const url = "${url}";
  
  const options = {
    method: "${endpoint.method.toUpperCase()}",
    headers: {
      "Content-Type": "application/json"`

  if (endpoint.security) {
    code += `,
      "Authorization": "Bearer YOUR_TOKEN"`
  }

  code += `
    }`

  if (endpoint.requestBody && endpoint.method !== "get") {
    code += `,
    body: JSON.stringify(${JSON.stringify(generateExampleRequestBody(endpoint.requestBody.schema), null, 2)})`
  }

  code += `
  };
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}`

  return code
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function generateExampleRequestBody(schema: any): any {
  if (!schema) return {}

  if (schema.type === "object" && schema.properties) {
    const result: Record<string, any> = {}

    for (const [key, prop] of Object.entries<any>(schema.properties)) {
      if (prop.type === "string") {
        if (prop.format === "email") {
          result[key] = "usuario@ejemplo.com"
        } else if (prop.format === "date") {
          result[key] = "2023-01-01"
        } else {
          result[key] = "ejemplo"
        }
      } else if (prop.type === "number" || prop.type === "integer") {
        result[key] = 123
      } else if (prop.type === "boolean") {
        result[key] = true
      } else if (prop.type === "array") {
        result[key] = ["ejemplo1", "ejemplo2"]
      } else if (prop.type === "object") {
        result[key] = generateExampleRequestBody(prop)
      }
    }

    return result
  }

  return {}
}

