"use client"

import { MoonIcon, SunIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { SearchEndpoints } from "@/components/search-endpoints"
import { ExportDocumentation } from "@/components/export-documentation"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { CiCdIntegration } from "@/components/ci-cd-integration"
import type { ApiData, ApiEndpoint } from "@/lib/types"
import type { ReactNode } from "react"

interface ApiHeaderProps {
  title: string
  version: string
  onReset?: () => void
  endpoints?: ApiEndpoint[]
  onSelectEndpoint?: (endpointId: string) => void
  apiData?: ApiData
  mobileSidebar?: ReactNode
}

export function ApiHeader({
  title,
  version,
  onReset,
  endpoints = [],
  onSelectEndpoint = () => {},
  apiData,
  mobileSidebar,
}: ApiHeaderProps) {
  const { setTheme, theme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    // Actualizar el tema en las preferencias guardadas
    try {
      const savedTheme = localStorage.getItem("api-docs-theme")
      if (savedTheme) {
        const preferences = JSON.parse(savedTheme)
        preferences.theme = newTheme
        localStorage.setItem("api-docs-theme", JSON.stringify(preferences))
      }
    } catch (error) {
      console.error("Error updating theme preference:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        {mobileSidebar}

        <div className="flex items-center gap-2">
          {onReset && (
            <Button variant="ghost" size="icon" onClick={onReset} className="mr-2 hidden md:flex">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Volver</span>
            </Button>
          )}
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-bold text-xl">{title}</span>
        </div>

        {/* Búsqueda - solo visible en pantallas medianas y grandes */}
        {endpoints.length > 0 && (
          <div className="flex-1 max-w-md hidden md:block">
            <SearchEndpoints endpoints={endpoints} onSelectEndpoint={onSelectEndpoint} />
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {apiData && (
            <>
              <CiCdIntegration />
              <ExportDocumentation apiData={apiData} />
            </>
          )}

          <ThemeCustomizer />

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
          </Button>
          <Button variant="outline" size="sm" className="hidden md:flex">
            v{version}
          </Button>
        </div>
      </div>
    </header>
  )
}

