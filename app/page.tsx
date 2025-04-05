"use client"

import { useState, useEffect } from "react"
import { ApiDocumentation } from "@/components/api-documentation"
import { SwaggerUploader } from "@/components/swagger-uploader"
import { SwaggerHistory } from "@/components/swagger-history"
import { ApiDocumentationGuide } from "@/components/api-documentation-guide"
import { parseSwaggerYaml } from "@/lib/swagger-parser"
import type { ApiData } from "@/lib/types"
import { type StoredSwaggerFile, saveSwaggerFile } from "@/lib/storage-utils"

export default function Home() {
  const [apiData, setApiData] = useState<ApiData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showGuide, setShowGuide] = useState(true)

  // Cargar Swagger desde URL si está configurado
  useEffect(() => {
    const swaggerUrl = process.env.SWAGGER_URL
    if (swaggerUrl && !apiData) {
      loadSwaggerFromUrl(swaggerUrl)
    }
  }, [apiData])

  const loadSwaggerFromUrl = async (url: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error fetching Swagger file: ${response.statusText}`)
      }

      const fileContent = await response.text()
      const parsedData = await parseSwaggerYaml(fileContent)
      setApiData(parsedData)

      // Guardar en el historial
      const fileName = url.split("/").pop() || "swagger.yaml"
      const swaggerFile: StoredSwaggerFile = {
        id: Date.now().toString(),
        name: fileName,
        content: fileContent,
        timestamp: Date.now(),
      }
      saveSwaggerFile(swaggerFile)
    } catch (error) {
      console.error("Error loading Swagger from URL:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwaggerUpload = async (file: File) => {
    setIsLoading(true)
    try {
      const fileContent = await file.text()
      const parsedData = await parseSwaggerYaml(fileContent)
      setApiData(parsedData)

      // Guardar en el historial
      const swaggerFile: StoredSwaggerFile = {
        id: Date.now().toString(),
        name: file.name,
        content: fileContent,
        timestamp: Date.now(),
      }
      saveSwaggerFile(swaggerFile)
    } catch (error) {
      console.error("Error parsing Swagger file:", error)
      alert("Error al procesar el archivo Swagger. Verifica que sea un YAML válido.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectFromHistory = async (file: StoredSwaggerFile) => {
    setIsLoading(true)
    try {
      const parsedData = await parseSwaggerYaml(file.content)
      setApiData(parsedData)

      // Actualizar la marca de tiempo
      saveSwaggerFile({
        ...file,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error("Error parsing Swagger file from history:", error)
      alert("Error al procesar el archivo Swagger guardado.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {apiData ? (
        <ApiDocumentation apiData={apiData} onReset={() => setApiData(null)} />
      ) : (
        <div className="container py-10">
          <SwaggerUploader onUpload={handleSwaggerUpload} isLoading={isLoading} />
          <SwaggerHistory onSelectFile={handleSelectFromHistory} />
        </div>
      )}
      {showGuide && <ApiDocumentationGuide />}
    </main>
  )
}

