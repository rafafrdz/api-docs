"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ApiEndpoint } from "@/lib/types"

interface SearchEndpointsProps {
  endpoints: ApiEndpoint[]
  onSelectEndpoint: (endpointId: string) => void
}

export function SearchEndpoints({ endpoints, onSelectEndpoint }: SearchEndpointsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<ApiEndpoint[]>([])

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([])
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = endpoints.filter(
      (endpoint) =>
        endpoint.path.toLowerCase().includes(term) ||
        endpoint.summary.toLowerCase().includes(term) ||
        endpoint.description.toLowerCase().includes(term) ||
        endpoint.tag.toLowerCase().includes(term),
    )

    setResults(filtered)
  }, [searchTerm, endpoints])

  const handleSelectEndpoint = (endpoint: ApiEndpoint) => {
    onSelectEndpoint(`${endpoint.method}-${endpoint.path}`)
    setIsOpen(false)
    setSearchTerm("")
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar endpoints..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Limpiar búsqueda</span>
            </Button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-full bg-background border rounded-md shadow-md">
          <div className="p-2 border-b">
            <h3 className="text-sm font-medium">
              {results.length === 0 && searchTerm.length < 2
                ? "Escribe al menos 2 caracteres para buscar"
                : `Resultados (${results.length})`}
            </h3>
          </div>
          {results.length > 0 ? (
            <ScrollArea className="h-[300px]">
              <div className="p-2 space-y-1">
                {results.map((endpoint) => (
                  <button
                    key={`${endpoint.method}-${endpoint.path}`}
                    className="w-full text-left p-2 hover:bg-accent rounded-md flex items-start gap-2"
                    onClick={() => handleSelectEndpoint(endpoint)}
                  >
                    <Badge
                      className={cn(
                        "mt-0.5 shrink-0",
                        endpoint.method === "get" && "bg-blue-500",
                        endpoint.method === "post" && "bg-green-500",
                        endpoint.method === "put" && "bg-yellow-500",
                        endpoint.method === "delete" && "bg-red-500",
                        endpoint.method === "patch" && "bg-purple-500",
                      )}
                    >
                      {endpoint.method.toUpperCase()}
                    </Badge>
                    <div>
                      <div className="font-mono text-sm">{endpoint.path}</div>
                      <div className="text-sm text-muted-foreground">{endpoint.summary}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="bg-muted px-1.5 py-0.5 rounded-sm">{endpoint.tag}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          ) : searchTerm.length >= 2 ? (
            <div className="p-4 text-center text-muted-foreground">
              No se encontraron resultados para "{searchTerm}"
            </div>
          ) : null}
          <div className="p-2 border-t">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => setIsOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

