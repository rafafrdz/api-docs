"use client"

import { useState } from "react"
import { Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ApiDocumentationGuide() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" className="fixed bottom-4 right-4 z-50" onClick={() => setIsOpen(true)}>
        <Info className="h-4 w-4 mr-2" />
        Guía de Uso
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-card border rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium flex items-center">
          <Info className="h-4 w-4 mr-2" />
          Guía de Uso
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        <Alert className="mb-4">
          <AlertTitle>Nuevas características</AlertTitle>
          <AlertDescription>
            Se han agregado nuevas funcionalidades para mejorar la documentación de tu API.
          </AlertDescription>
        </Alert>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ci-cd">
            <AccordionTrigger>Integración con CI/CD</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-2">
                Configura la integración con sistemas CI/CD para mantener tu documentación actualizada automáticamente.
              </p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Haz clic en el botón "Integración CI/CD" en la barra superior</li>
                <li>Configura los parámetros de tu repositorio</li>
                <li>Selecciona tu plataforma de CI/CD preferida</li>
                <li>Copia la configuración y aplícala en tu repositorio</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="playground">
            <AccordionTrigger>Playground Interactivo</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-2">
                Prueba los endpoints directamente desde la documentación.
              </p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Selecciona un endpoint en la barra lateral</li>
                <li>Ve a la pestaña "Playground"</li>
                <li>Configura los parámetros y el cuerpo de la solicitud</li>
                <li>Haz clic en "Enviar solicitud" para ver la respuesta</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="customization">
            <AccordionTrigger>Personalización de Temas</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-2">
                Personaliza la apariencia de la documentación según tus preferencias.
              </p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Haz clic en el icono de pincel en la barra superior</li>
                <li>Selecciona colores, fuentes y estilos</li>
                <li>Haz clic en "Aplicar" para guardar los cambios</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

