import { ScrollArea } from "@/components/ui/scroll-area"
import { ApiEndpointDetail } from "@/components/api-endpoint-detail"
import { ApiTagOverview } from "@/components/api-tag-overview"
import type { ApiData } from "@/lib/types"

interface ApiContentProps {
  selectedTag: string
  selectedEndpoint: string | null
  apiData: ApiData
}

export function ApiContent({ selectedTag, selectedEndpoint, apiData }: ApiContentProps) {
  const endpoint = selectedEndpoint ? apiData.endpoints.find((e) => `${e.method}-${e.path}` === selectedEndpoint) : null

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="container py-6 max-w-4xl">
          {endpoint ? (
            <ApiEndpointDetail endpoint={endpoint} />
          ) : (
            <ApiTagOverview tag={selectedTag} endpoints={apiData.endpoints.filter((e) => e.tag === selectedTag)} />
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

