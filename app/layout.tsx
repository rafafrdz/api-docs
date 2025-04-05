import type React from "react"
// Actualizar el layout para cargar las preferencias de tema guardadas
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "API Documentation",
  description: "Documentación de API generada a partir de especificaciones Swagger/OpenAPI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('api-docs-theme');
                if (savedTheme) {
                  const preferences = JSON.parse(savedTheme);
                  
                  // Aplicar color primario
                  if (preferences.primaryColor) {
                    const colors = {
                      default: "142.1 76.2% 36.3%",
                      blue: "221.2 83.2% 53.3%",
                      purple: "262.1 83.3% 57.8%",
                      orange: "24.6 95% 53.1%",
                      red: "0 72.2% 50.6%"
                    };
                    document.documentElement.style.setProperty("--primary", colors[preferences.primaryColor] || colors.default);
                  }
                  
                  // Aplicar fuente
                  if (preferences.fontFamily) {
                    const fonts = {
                      system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
                      inter: "'Inter', sans-serif",
                      mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                    };
                    document.documentElement.style.setProperty("--font-sans", fonts[preferences.fontFamily] || fonts.system);
                  }
                  
                  // Aplicar radio de borde
                  if (preferences.borderRadius) {
                    const radiuses = {
                      none: "0rem",
                      small: "0.3rem",
                      medium: "0.5rem",
                      large: "0.75rem",
                      full: "9999px"
                    };
                    document.documentElement.style.setProperty("--radius", radiuses[preferences.borderRadius] || radiuses.medium);
                  }
                  
                  // Aplicar tamaño de fuente
                  if (preferences.fontSize) {
                    document.documentElement.style.setProperty("--font-size-base", \`\${preferences.fontSize}px\`);
                  }
                }
              } catch (error) {
                console.error('Error loading theme preferences:', error);
              }
            `,
          }}
        />
      </body>
    </html>
  )
}



import './globals.css'