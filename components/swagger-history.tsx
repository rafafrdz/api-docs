"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Clock, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type StoredSwaggerFile, getSwaggerHistory, deleteSwaggerFile } from "@/lib/storage-utils"

interface SwaggerHistoryProps {
  onSelectFile: (file: StoredSwaggerFile) => void
}

export function SwaggerHistory({ onSelectFile }: SwaggerHistoryProps) {
  const [history, setHistory] = useState<StoredSwaggerFile[]>([])

  useEffect(() => {
    // Cargar el historial al montar el componente
    setHistory(getSwaggerHistory())
  }, [])

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteSwaggerFile(id)
    setHistory(getSwaggerHistory())
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  if (history.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Archivos recientes</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((file) => (
          <Card
            key={file.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => onSelectFile(file)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="truncate">{file.name}</span>
              </CardTitle>
              <CardDescription>{formatDate(file.timestamp)}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 flex justify-between">
              <Button variant="ghost" size="sm" onClick={(e) => handleDelete(file.id, e)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
              <Button size="sm">Abrir</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

