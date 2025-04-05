"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ApiSidebar } from "@/components/api-sidebar"
import type { ApiData } from "@/lib/types"

interface MobileSidebarProps {
  selectedTag: string
  onTagSelect: (tag: string) => void
  selectedEndpoint: string | null
  onEndpointSelect: (endpoint: string) => void
  apiData: ApiData
}

export function MobileSidebar({
  selectedTag,
  onTagSelect,
  selectedEndpoint,
  onEndpointSelect,
  apiData,
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false)

  const handleEndpointSelect = (endpoint: string) => {
    onEndpointSelect(endpoint)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[300px]">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Endpoints</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-65px)] overflow-hidden">
          <ApiSidebar
            selectedTag={selectedTag}
            onTagSelect={onTagSelect}
            selectedEndpoint={selectedEndpoint}
            onEndpointSelect={handleEndpointSelect}
            apiData={apiData}
            isMobile={true}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

