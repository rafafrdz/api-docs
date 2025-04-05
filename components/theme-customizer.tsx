"use client"

import { useState, useEffect } from "react"
import { Paintbrush, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "next-themes"

const themes = [
  {
    name: "Default",
    primaryColor: "hsl(142.1 76.2% 36.3%)",
    id: "default",
  },
  {
    name: "Blue",
    primaryColor: "hsl(221.2 83.2% 53.3%)",
    id: "blue",
  },
  {
    name: "Purple",
    primaryColor: "hsl(262.1 83.3% 57.8%)",
    id: "purple",
  },
  {
    name: "Orange",
    primaryColor: "hsl(24.6 95% 53.1%)",
    id: "orange",
  },
  {
    name: "Red",
    primaryColor: "hsl(0 72.2% 50.6%)",
    id: "red",
  },
]

const fonts = [
  {
    name: "System",
    value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    id: "system",
  },
  {
    name: "Inter",
    value: "'Inter', sans-serif",
    id: "inter",
  },
  {
    name: "Mono",
    value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    id: "mono",
  },
]

const borderRadiusOptions = [
  {
    name: "None",
    value: "0rem",
    id: "none",
  },
  {
    name: "Small",
    value: "0.3rem",
    id: "small",
  },
  {
    name: "Medium",
    value: "0.5rem",
    id: "medium",
  },
  {
    name: "Large",
    value: "0.75rem",
    id: "large",
  },
  {
    name: "Full",
    value: "9999px",
    id: "full",
  },
]

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme()
  const [primaryColor, setPrimaryColor] = useState<string>("default")
  const [fontFamily, setFontFamily] = useState<string>("system")
  const [borderRadius, setBorderRadius] = useState<string>("medium")
  const [fontSize, setFontSize] = useState<number>(16)
  const [open, setOpen] = useState(false)

  // Cargar preferencias guardadas al montar el componente
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("api-docs-theme")
      if (savedTheme) {
        const preferences = JSON.parse(savedTheme)
        if (preferences.primaryColor) setPrimaryColor(preferences.primaryColor)
        if (preferences.fontFamily) setFontFamily(preferences.fontFamily)
        if (preferences.borderRadius) setBorderRadius(preferences.borderRadius)
        if (preferences.fontSize) setFontSize(preferences.fontSize)
      }
    } catch (error) {
      console.error("Error loading theme preferences:", error)
    }
  }, [])

  const applyTheme = () => {
    // Aplicar tema claro/oscuro
    if (theme) {
      setTheme(theme)
    }

    // Aplicar color primario
    const selectedTheme = themes.find((t) => t.id === primaryColor)
    if (selectedTheme) {
      document.documentElement.style.setProperty("--primary", selectedTheme.primaryColor)

      // Actualizar también las variables HSL para el tema oscuro y claro
      const hslValues = selectedTheme.primaryColor.match(/hsl$$([^)]+)$$/)?.[1]
      if (hslValues) {
        document.documentElement.style.setProperty("--primary", hslValues)
      }
    }

    // Aplicar fuente
    const selectedFont = fonts.find((f) => f.id === fontFamily)
    if (selectedFont) {
      document.documentElement.style.setProperty("--font-sans", selectedFont.value)
    }

    // Aplicar radio de borde
    const selectedRadius = borderRadiusOptions.find((r) => r.id === borderRadius)
    if (selectedRadius) {
      document.documentElement.style.setProperty("--radius", selectedRadius.value)
    }

    // Aplicar tamaño de fuente
    document.documentElement.style.setProperty("--font-size-base", `${fontSize}px`)

    // Guardar preferencias en localStorage
    localStorage.setItem(
      "api-docs-theme",
      JSON.stringify({
        primaryColor,
        fontFamily,
        borderRadius,
        fontSize,
        theme,
      }),
    )

    setOpen(false)
  }

  const resetTheme = () => {
    // Restablecer valores predeterminados
    setPrimaryColor("default")
    setFontFamily("system")
    setBorderRadius("medium")
    setFontSize(16)

    // Eliminar estilos personalizados
    document.documentElement.style.removeProperty("--primary")
    document.documentElement.style.removeProperty("--font-sans")
    document.documentElement.style.removeProperty("--radius")
    document.documentElement.style.removeProperty("--font-size-base")

    // Eliminar preferencias guardadas
    localStorage.removeItem("api-docs-theme")

    // Aplicar cambios inmediatamente
    document.documentElement.style.setProperty("--primary", "142.1 76.2% 36.3%")
    document.documentElement.style.setProperty("--radius", "0.5rem")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Paintbrush className="h-4 w-4" />
          <span className="sr-only">Personalizar tema</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Personalizar tema</DialogTitle>
          <DialogDescription>Personaliza la apariencia de la documentación según tus preferencias.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="colors">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="colors">Colores</TabsTrigger>
            <TabsTrigger value="typography">Tipografía</TabsTrigger>
            <TabsTrigger value="layout">Diseño</TabsTrigger>
          </TabsList>
          <TabsContent value="colors" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Color primario</Label>
              <RadioGroup value={primaryColor} onValueChange={setPrimaryColor} className="flex flex-wrap gap-2">
                {themes.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={item.id} id={`color-${item.id}`} className="sr-only" />
                    <Label
                      htmlFor={`color-${item.id}`}
                      className="flex items-center justify-center rounded-full w-8 h-8 cursor-pointer ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=checked]:ring-2 data-[state=checked]:ring-ring data-[state=checked]:ring-offset-2"
                      style={{ backgroundColor: item.primaryColor }}
                    >
                      {primaryColor === item.id && <Check className="h-4 w-4 text-white" />}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>
          <TabsContent value="typography" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Fuente</Label>
              <RadioGroup value={fontFamily} onValueChange={setFontFamily} className="flex flex-col space-y-1">
                {fonts.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={item.id} id={`font-${item.id}`} />
                    <Label htmlFor={`font-${item.id}`} style={{ fontFamily: item.value }}>
                      {item.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Tamaño de fuente</Label>
                <span className="text-sm text-muted-foreground">{fontSize}px</span>
              </div>
              <Slider value={[fontSize]} min={12} max={20} step={1} onValueChange={(value) => setFontSize(value[0])} />
            </div>
          </TabsContent>
          <TabsContent value="layout" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Radio de bordes</Label>
              <RadioGroup value={borderRadius} onValueChange={setBorderRadius} className="flex flex-col space-y-1">
                {borderRadiusOptions.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={item.id} id={`radius-${item.id}`} />
                    <Label htmlFor={`radius-${item.id}`}>{item.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={resetTheme}>
            <X className="h-4 w-4 mr-2" />
            Restablecer
          </Button>
          <Button onClick={applyTheme}>
            <Check className="h-4 w-4 mr-2" />
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

