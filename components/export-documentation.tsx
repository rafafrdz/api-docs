"use client"

import { useState } from "react"
import { Download, FileDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ApiData } from "@/lib/types"

interface ExportDocumentationProps {
  apiData: ApiData
}

export function ExportDocumentation({ apiData }: ExportDocumentationProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState<string | null>(null)

  const handleExport = async (type: string) => {
    setExportType(type)
    setIsExporting(true)

    try {
      let content = ""
      let filename = ""
      let mimeType = ""

      switch (type) {
        case "markdown":
          content = generateMarkdown(apiData)
          filename = `${apiData.title.toLowerCase().replace(/\s+/g, "-")}-docs.md`
          mimeType = "text/markdown"
          break
        case "html":
          content = generateHTML(apiData)
          filename = `${apiData.title.toLowerCase().replace(/\s+/g, "-")}-docs.html`
          mimeType = "text/html"
          break
        case "json":
          content = JSON.stringify(apiData, null, 2)
          filename = `${apiData.title.toLowerCase().replace(/\s+/g, "-")}-docs.json`
          mimeType = "application/json"
          break
      }

      // Crear un blob y descargarlo
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting documentation:", error)
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("markdown")} disabled={isExporting}>
          {isExporting && exportType === "markdown" ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4 mr-2" />
          )}
          Markdown (.md)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("html")} disabled={isExporting}>
          {isExporting && exportType === "html" ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4 mr-2" />
          )}
          HTML (.html)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")} disabled={isExporting}>
          {isExporting && exportType === "json" ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4 mr-2" />
          )}
          JSON (.json)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Función para generar Markdown
function generateMarkdown(apiData: ApiData): string {
  let markdown = `# ${apiData.title}\n\n`
  markdown += `${apiData.description}\n\n`
  markdown += `Version: ${apiData.version}\n\n`

  // Tabla de contenidos
  markdown += `## Tabla de Contenidos\n\n`
  apiData.tags.forEach((tag) => {
    markdown += `- [${tag}](#${tag.toLowerCase().replace(/\s+/g, "-")})\n`
  })
  markdown += `\n`

  // Endpoints por tag
  apiData.tags.forEach((tag) => {
    markdown += `## ${tag}\n\n`

    const tagEndpoints = apiData.endpoints.filter((e) => e.tag === tag)
    tagEndpoints.forEach((endpoint) => {
      markdown += `### ${endpoint.method.toUpperCase()} ${endpoint.path}\n\n`
      markdown += `${endpoint.summary}\n\n`
      markdown += `${endpoint.description}\n\n`

      // Parámetros
      if (endpoint.parameters && endpoint.parameters.length > 0) {
        markdown += `#### Parámetros\n\n`
        markdown += `| Nombre | Ubicación | Tipo | Requerido | Descripción |\n`
        markdown += `| ------ | --------- | ---- | --------- | ----------- |\n`

        endpoint.parameters.forEach((param) => {
          markdown += `| ${param.name} | ${param.in} | ${param.type} | ${param.required ? "Sí" : "No"} | ${param.description} |\n`
        })
        markdown += `\n`
      }

      // Cuerpo de la solicitud
      if (endpoint.requestBody) {
        markdown += `#### Cuerpo de la Solicitud\n\n`
        markdown += `Tipo de contenido: \`${endpoint.requestBody.contentType}\`\n\n`
        markdown += "```json\n"
        markdown += JSON.stringify(endpoint.requestBody.schema, null, 2)
        markdown += "\n```\n\n"
      }

      // Respuestas
      if (endpoint.responses && endpoint.responses.length > 0) {
        markdown += `#### Respuestas\n\n`

        endpoint.responses.forEach((response) => {
          markdown += `**${response.status}**: ${response.description}\n\n`

          if (response.schema) {
            markdown += "```json\n"
            markdown += JSON.stringify(response.schema, null, 2)
            markdown += "\n```\n\n"
          }
        })
      }

      markdown += `---\n\n`
    })
  })

  return markdown
}

// Función para generar HTML
function generateHTML(apiData: ApiData): string {
  let html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${apiData.title} - Documentación API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3, h4 { margin-top: 1.5em; }
    h1 { color: #2563eb; }
    h2 { color: #4b5563; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; }
    h3 { color: #1f2937; }
    .method {
      display: inline-block;
      padding: 3px 6px;
      border-radius: 4px;
      color: white;
      font-size: 0.8em;
      font-weight: bold;
      margin-right: 8px;
    }
    .get { background-color: #3b82f6; }
    .post { background-color: #10b981; }
    .put { background-color: #f59e0b; }
    .delete { background-color: #ef4444; }
    .patch { background-color: #8b5cf6; }
    .path { font-family: monospace; font-size: 1.1em; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { text-align: left; padding: 8px; border: 1px solid #e5e7eb; }
    th { background-color: #f9fafb; }
    pre { background-color: #f9fafb; padding: 1em; border-radius: 4px; overflow-x: auto; }
    code { font-family: monospace; }
    .endpoint { margin-bottom: 2em; padding-bottom: 1em; border-bottom: 1px dashed #e5e7eb; }
    .toc { background-color: #f9fafb; padding: 1em; border-radius: 4px; margin: 1em 0; }
    .toc ul { list-style-type: none; padding-left: 1em; }
    .toc li { margin: 0.5em 0; }
    .toc a { text-decoration: none; color: #2563eb; }
    .toc a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>${apiData.title}</h1>
  <p>${apiData.description}</p>
  <p><strong>Versión:</strong> ${apiData.version}</p>
  
  <div class="toc">
    <h2>Tabla de Contenidos</h2>
    <ul>`

  apiData.tags.forEach((tag) => {
    html += `      <li><a href="#${tag.toLowerCase().replace(/\s+/g, "-")}">${tag}</a></li>\n`
  })

  html += `    </ul>
  </div>`

  // Endpoints por tag
  apiData.tags.forEach((tag) => {
    html += `
  <h2 id="${tag.toLowerCase().replace(/\s+/g, "-")}">${tag}</h2>`

    const tagEndpoints = apiData.endpoints.filter((e) => e.tag === tag)
    tagEndpoints.forEach((endpoint) => {
      const methodClass = endpoint.method.toLowerCase()

      html += `
  <div class="endpoint">
    <h3>
      <span class="method ${methodClass}">${endpoint.method.toUpperCase()}</span>
      <span class="path">${endpoint.path}</span>
    </h3>
    <p><strong>${endpoint.summary}</strong></p>
    <p>${endpoint.description}</p>`

      // Parámetros
      if (endpoint.parameters && endpoint.parameters.length > 0) {
        html += `
    <h4>Parámetros</h4>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Ubicación</th>
          <th>Tipo</th>
          <th>Requerido</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>`

        endpoint.parameters.forEach((param) => {
          html += `
        <tr>
          <td><code>${param.name}</code></td>
          <td>${param.in}</td>
          <td>${param.type}</td>
          <td>${param.required ? "Sí" : "No"}</td>
          <td>${param.description}</td>
        </tr>`
        })

        html += `
      </tbody>
    </table>`
      }

      // Cuerpo de la solicitud
      if (endpoint.requestBody) {
        html += `
    <h4>Cuerpo de la Solicitud</h4>
    <p>Tipo de contenido: <code>${endpoint.requestBody.contentType}</code></p>
    <pre><code>${JSON.stringify(endpoint.requestBody.schema, null, 2)}</code></pre>`
      }

      // Respuestas
      if (endpoint.responses && endpoint.responses.length > 0) {
        html += `
    <h4>Respuestas</h4>`

        endpoint.responses.forEach((response) => {
          html += `
    <p><strong>${response.status}</strong>: ${response.description}</p>`

          if (response.schema) {
            html += `
    <pre><code>${JSON.stringify(response.schema, null, 2)}</code></pre>`
          }
        })
      }

      html += `
  </div>`
    })
  })

  html += `
</body>
</html>`

  return html
}

