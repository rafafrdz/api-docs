"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { ApiEndpoint } from "@/lib/types"
import { CodeBlock } from "@/components/code-block"
import { Loader2 } from "lucide-react"

interface ApiPlaygroundProps {
  endpoint: ApiEndpoint
  baseUrl: string
}

export function ApiPlayground({ endpoint, baseUrl }: ApiPlaygroundProps) {
  const [paramValues, setParamValues] = useState<Record<string, string>>({})
  const [requestBody, setRequestBody] = useState<string>(
    endpoint.requestBody ? JSON.stringify(endpoint.requestBody.schema, null, 2) : "",
  )
  const [response, setResponse] = useState<{ status: number; body: any } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleParamChange = (name: string, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const buildUrl = () => {
    let url = baseUrl + endpoint.path

    // Replace path parameters
    if (endpoint.parameters) {
      endpoint.parameters.forEach((param) => {
        if (param.in === "path") {
          const value = paramValues[param.name] || `{${param.name}}`
          url = url.replace(`{${param.name}}`, value)
        }
      })
    }

    // Add query parameters
    const queryParams = endpoint.parameters?.filter((p) => p.in === "query") || []
    if (queryParams.length > 0) {
      url += "?"
      queryParams.forEach((param, index) => {
        if (index > 0) url += "&"
        const value = paramValues[param.name] || ""
        if (value) {
          url += `${param.name}=${encodeURIComponent(value)}`
        }
      })
    }

    return url
  }

  const handleSendRequest = async () => {
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const url = buildUrl()

      const options: RequestInit = {
        method: endpoint.method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
        },
      }

      // Add authorization header if needed
      if (endpoint.security) {
        const token = paramValues["authorization"] || "YOUR_TOKEN"
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }

      // Add request body if applicable
      if (endpoint.requestBody && endpoint.method !== "get") {
        try {
          options.body = requestBody
        } catch (e) {
          setError("Error en el formato del cuerpo de la solicitud. Verifica que sea JSON válido.")
          setIsLoading(false)
          return
        }
      }

      // This is just a simulation since we can't actually make the request in the browser
      // due to CORS restrictions
      setTimeout(() => {
        // Simulate a response based on the endpoint
        const simulatedResponse = {
          status: 200,
          body: endpoint.responses?.find((r) => r.status === "200")?.schema || {
            message: "Operación simulada exitosa",
          },
        }

        setResponse(simulatedResponse)
        setIsLoading(false)
      }, 1000)

      // In a real implementation, you would do:
      // const response = await fetch(url, options);
      // const data = await response.json();
      // setResponse({
      //   status: response.status,
      //   body: data
      // });
    } catch (err) {
      setError("Error al enviar la solicitud: " + (err instanceof Error ? err.message : String(err)))
    } finally {
      // setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Playground</CardTitle>
        <CardDescription>Prueba este endpoint directamente desde la documentación</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Preview */}
        <div>
          <h3 className="text-sm font-medium mb-2">URL</h3>
          <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto">
            {endpoint.method.toUpperCase()} {buildUrl()}
          </div>
        </div>

        {/* Authorization */}
        {endpoint.security && (
          <div>
            <h3 className="text-sm font-medium mb-2">Autorización</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Token de autorización"
                value={paramValues["authorization"] || ""}
                onChange={(e) => handleParamChange("authorization", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Path Parameters */}
        {endpoint.parameters && endpoint.parameters.filter((p) => p.in === "path").length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Parámetros de Ruta</h3>
            <div className="space-y-2">
              {endpoint.parameters
                .filter((p) => p.in === "path")
                .map((param) => (
                  <div key={param.name} className="grid grid-cols-3 gap-2 items-center">
                    <label htmlFor={`param-${param.name}`} className="text-sm font-medium">
                      {param.name}
                      {param.required && <span className="text-red-500">*</span>}:
                    </label>
                    <Input
                      id={`param-${param.name}`}
                      placeholder={param.description || param.name}
                      value={paramValues[param.name] || ""}
                      onChange={(e) => handleParamChange(param.name, e.target.value)}
                      className="col-span-2"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Query Parameters */}
        {endpoint.parameters && endpoint.parameters.filter((p) => p.in === "query").length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Parámetros de Consulta</h3>
            <div className="space-y-2">
              {endpoint.parameters
                .filter((p) => p.in === "query")
                .map((param) => (
                  <div key={param.name} className="grid grid-cols-3 gap-2 items-center">
                    <label htmlFor={`param-${param.name}`} className="text-sm font-medium">
                      {param.name}
                      {param.required && <span className="text-red-500">*</span>}:
                    </label>
                    <Input
                      id={`param-${param.name}`}
                      placeholder={param.description || param.name}
                      value={paramValues[param.name] || ""}
                      onChange={(e) => handleParamChange(param.name, e.target.value)}
                      className="col-span-2"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Request Body */}
        {endpoint.requestBody && (
          <div>
            <h3 className="text-sm font-medium mb-2">Cuerpo de la Solicitud</h3>
            <Textarea value={requestBody} onChange={(e) => setRequestBody(e.target.value)} className="font-mono h-40" />
          </div>
        )}

        {/* Response */}
        {response && (
          <div>
            <h3 className="text-sm font-medium mb-2">Respuesta</h3>
            <div className="bg-muted rounded-md p-2">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    response.status >= 200 && response.status < 300
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {response.status}
                </span>
                <span className="text-sm">
                  {response.status >= 200 && response.status < 300 ? "Solicitud exitosa" : "Error en la solicitud"}
                </span>
              </div>
              <CodeBlock language="json" code={JSON.stringify(response.body, null, 2)} />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-3 rounded-md">
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSendRequest} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar solicitud"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

