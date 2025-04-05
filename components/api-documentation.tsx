// Actualizar el componente ApiDocumentation para incluir el sidebar móvil
"use client"

import { useState } from "react"
import { ApiSidebar } from "@/components/api-sidebar"
import { ApiContent } from "@/components/api-content"
import { ApiHeader } from "@/components/api-header"
import { MobileSidebar } from "@/components/mobile-sidebar"
import type { ApiData } from "@/lib/types"

interface ApiDocumentationProps {
  apiData: ApiData
  onReset: () => void
}

export function ApiDocumentation({ apiData, onReset }: ApiDocumentationProps) {
  const [selectedTag, setSelectedTag] = useState<string>(apiData.tags[0] || "")
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag)
    setSelectedEndpoint(null)
  }

  const handleEndpointSelect = (endpoint: string) => {
    // Extraer el tag del endpoint seleccionado para actualizar la navegación
    const endpointObj = apiData.endpoints.find((e) => `${e.method}-${e.path}` === endpoint)
    if (endpointObj) {
      setSelectedTag(endpointObj.tag)
      setSelectedEndpoint(endpoint)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <ApiHeader
        title={apiData.title}
        version={apiData.version}
        onReset={onReset}
        endpoints={apiData.endpoints}
        onSelectEndpoint={handleEndpointSelect}
        apiData={apiData}
        mobileSidebar={
          <MobileSidebar
            selectedTag={selectedTag}
            onTagSelect={handleTagSelect}
            selectedEndpoint={selectedEndpoint}
            onEndpointSelect={handleEndpointSelect}
            apiData={apiData}
          />
        }
      />
      <div className="flex flex-1 overflow-hidden">
        <ApiSidebar
          selectedTag={selectedTag}
          onTagSelect={handleTagSelect}
          selectedEndpoint={selectedEndpoint}
          onEndpointSelect={handleEndpointSelect}
          apiData={apiData}
        />
        <ApiContent selectedTag={selectedTag} selectedEndpoint={selectedEndpoint} apiData={apiData} />
      </div>
    </div>
  )
}

