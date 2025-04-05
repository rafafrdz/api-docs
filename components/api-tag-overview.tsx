import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ApiEndpoint } from "@/lib/types"

interface ApiTagOverviewProps {
  tag: string
  endpoints: ApiEndpoint[]
}

export function ApiTagOverview({ tag, endpoints }: ApiTagOverviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{tag}</h1>
        <p className="text-muted-foreground mt-2">{getTagDescription(tag)}</p>
      </div>

      <div className="grid gap-4">
        {endpoints.map((endpoint) => (
          <Card key={`${endpoint.method}-${endpoint.path}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        endpoint.method === "get" && "bg-blue-500 hover:bg-blue-600",
                        endpoint.method === "post" && "bg-green-500 hover:bg-green-600",
                        endpoint.method === "put" && "bg-yellow-500 hover:bg-yellow-600",
                        endpoint.method === "delete" && "bg-red-500 hover:bg-red-600",
                        endpoint.method === "patch" && "bg-purple-500 hover:bg-purple-600",
                      )}
                    >
                      {endpoint.method.toUpperCase()}
                    </Badge>
                    <span className="font-mono text-sm md:text-base">{endpoint.path}</span>
                  </CardTitle>
                  <CardDescription>{endpoint.summary}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{endpoint.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function getTagDescription(tag: string): string {
  const descriptions: Record<string, string> = {
    Autenticación: "Endpoints para gestionar la autenticación de usuarios en el sistema.",
    Compañías: "Gestión de compañías y sus datos relacionados.",
    Oficinas: "Administración de oficinas asociadas a las compañías.",
    Usuarios: "Gestión de usuarios del sistema y sus permisos.",
    Certificados: "Administración de certificados ambientales y sostenibilidad.",
    "Plantillas de Certificación": "Gestión de plantillas para los procesos de certificación.",
    "Tipos de Documentos": "Administración de los tipos de documentos requeridos.",
    "Planes de Descarbonización": "Gestión de planes para reducir emisiones de carbono.",
    Utilidades: "Endpoints para gestionar utilidades del sistema.",
    Residuos: "Administración de residuos y su gestión.",
    Objetivos: "Gestión de objetivos de sostenibilidad.",
    Facturación: "Administración de facturación y pagos.",
    "Métricas de Oficina": "Endpoints para gestionar métricas de oficinas.",
    Reportes: "Generación y gestión de reportes.",
    Documentos: "Administración de documentos en el sistema.",
  }

  return descriptions[tag] || "Endpoints relacionados con esta categoría."
}

