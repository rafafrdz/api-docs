"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SchemaViewerProps {
  schema: any
  name?: string
  depth?: number
  isExpanded?: boolean
}

export function SchemaViewer({ schema, name = "root", depth = 0, isExpanded = true }: SchemaViewerProps) {
  const [expanded, setExpanded] = useState(isExpanded)

  // Determinar el tipo de esquema
  const getSchemaType = () => {
    if (Array.isArray(schema)) {
      return "array"
    }

    if (schema === null) {
      return "null"
    }

    if (typeof schema === "object") {
      return "object"
    }

    return typeof schema
  }

  const schemaType = getSchemaType()

  // Renderizar valor primitivo
  const renderPrimitive = () => {
    if (schema === null) {
      return <span className="text-gray-500">null</span>
    }

    if (typeof schema === "string") {
      return <span className="text-green-600 dark:text-green-400">"{schema}"</span>
    }

    if (typeof schema === "number") {
      return <span className="text-blue-600 dark:text-blue-400">{schema}</span>
    }

    if (typeof schema === "boolean") {
      return <span className="text-purple-600 dark:text-purple-400">{schema.toString()}</span>
    }

    return <span>{String(schema)}</span>
  }

  // Renderizar array
  const renderArray = () => {
    if (schema.length === 0) {
      return <span className="text-gray-500">[]</span>
    }

    return (
      <div>
        <div className="flex items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
          {expanded ? (
            <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
          )}
          <span className="text-gray-500">[{schema.length}]</span>
        </div>

        {expanded && (
          <div className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-2 mt-1">
            {schema.map((item: any, index: number) => (
              <div key={index} className="py-1">
                <SchemaViewer schema={item} name={`${index}`} depth={depth + 1} isExpanded={depth < 2} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Renderizar objeto
  const renderObject = () => {
    const keys = Object.keys(schema)

    if (keys.length === 0) {
      return <span className="text-gray-500">{"{}"}</span>
    }

    return (
      <div>
        <div className="flex items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
          {expanded ? (
            <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
          )}
          <span className="text-gray-500">
            {"{"}
            {keys.length}
            {"}"}
          </span>
        </div>

        {expanded && (
          <div className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-2 mt-1">
            {keys.map((key) => (
              <div key={key} className="py-1">
                <div className="flex">
                  <span className="text-amber-600 dark:text-amber-400 mr-2">"{key}":</span>
                  <SchemaViewer schema={schema[key]} name={key} depth={depth + 1} isExpanded={depth < 2} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Renderizar según el tipo
  const renderSchema = () => {
    switch (schemaType) {
      case "array":
        return renderArray()
      case "object":
        return renderObject()
      default:
        return renderPrimitive()
    }
  }

  return (
    <div className={cn("font-mono text-sm", depth === 0 && "p-4 bg-muted rounded-md")}>
      {depth === 0 ? renderSchema() : renderSchema()}
    </div>
  )
}

