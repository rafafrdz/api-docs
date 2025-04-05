"use client"

// Modificar el componente ApiSidebar para soportar modo móvil
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import type { ApiData } from "@/lib/types"

interface ApiSidebarProps {
  selectedTag: string
  onTagSelect: (tag: string) => void
  selectedEndpoint: string | null
  onEndpointSelect: (endpoint: string) => void
  apiData: ApiData
  isMobile?: boolean
}

export function ApiSidebar({
  selectedTag,
  onTagSelect,
  selectedEndpoint,
  onEndpointSelect,
  apiData,
  isMobile = false,
}: ApiSidebarProps) {
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>(
    Object.fromEntries(apiData.tags.map((tag) => [tag, true])),
  )

  const toggleTag = (tag: string) => {
    setExpandedTags((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }))
  }

  const sidebarContent = (
    <ScrollArea className="h-full">
      <div className="py-4">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold mb-2">Endpoints</h2>
        </div>
        <nav className="grid gap-1 px-2">
          {apiData.tags.map((tag) => (
            <div key={tag} className="space-y-1">
              <button
                onClick={() => toggleTag(tag)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  selectedTag === tag && "bg-accent text-accent-foreground",
                )}
              >
                <span onClick={() => onTagSelect(tag)}>{tag}</span>
                {expandedTags[tag] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {expandedTags[tag] && (
                <div className="pl-4 space-y-1">
                  {apiData.endpoints
                    .filter((endpoint) => endpoint.tag === tag)
                    .map((endpoint) => (
                      <button
                        key={`${endpoint.method}-${endpoint.path}`}
                        onClick={() => onEndpointSelect(`${endpoint.method}-${endpoint.path}`)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          selectedEndpoint === `${endpoint.method}-${endpoint.path}` &&
                            "bg-accent/50 text-accent-foreground",
                        )}
                      >
                        <div className="flex items-center">
                          <span
                            className={cn(
                              "mr-2 rounded px-1.5 py-0.5 text-xs font-medium",
                              endpoint.method === "get" && "bg-blue-500 text-white",
                              endpoint.method === "post" && "bg-green-500 text-white",
                              endpoint.method === "put" && "bg-yellow-500 text-white",
                              endpoint.method === "delete" && "bg-red-500 text-white",
                              endpoint.method === "patch" && "bg-purple-500 text-white",
                            )}
                          >
                            {endpoint.method.toUpperCase()}
                          </span>
                          <span className="truncate">{endpoint.summary || endpoint.path}</span>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </ScrollArea>
  )

  if (isMobile) {
    return sidebarContent
  }

  return <div className="hidden md:block w-64 border-r bg-muted/40 overflow-hidden">{sidebarContent}</div>
}

