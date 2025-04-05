"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface SwaggerUploaderProps {
  onUpload: (file: File) => void
  isLoading: boolean
}

export function SwaggerUploader({ onUpload, isLoading }: SwaggerUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    if (file.name.endsWith(".yaml") || file.name.endsWith(".yml") || file.name.endsWith(".json")) {
      setSelectedFile(file)
    } else {
      alert("Por favor, sube un archivo YAML o JSON válido.")
    }
  }

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Documentación API</CardTitle>
          <CardDescription>
            Sube un archivo Swagger/OpenAPI en formato YAML o JSON para generar la documentación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center ${
              dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/20"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".yaml,.yml,.json"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-muted-foreground">Archivos YAML o JSON (MAX. 10MB)</p>
            <Button variant="ghost" className="mt-4" onClick={() => fileInputRef.current?.click()}>
              Seleccionar archivo
            </Button>
          </div>

          {selectedFile && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Archivo seleccionado:</p>
              <p className="text-sm text-muted-foreground truncate">{selectedFile.name}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={!selectedFile || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Generar documentación"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

