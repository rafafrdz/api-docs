// Actualizar las utilidades de almacenamiento para soportar configuración por variables de entorno
export interface StoredSwaggerFile {
  id: string
  name: string
  content: string
  timestamp: number
}

const STORAGE_KEY = "swagger-docs-history"
const MAX_HISTORY_ITEMS =
  typeof window !== "undefined" ? Number.parseInt(process.env.MAX_HISTORY_ITEMS || "10", 10) : 10

const isHistoryEnabled = typeof window !== "undefined" ? process.env.ENABLE_HISTORY !== "false" : true

export function saveSwaggerFile(file: StoredSwaggerFile): void {
  if (!isHistoryEnabled || typeof window === "undefined") return

  try {
    const history = getSwaggerHistory()

    // Verificar si ya existe un archivo con el mismo ID
    const existingIndex = history.findIndex((f) => f.id === file.id)
    if (existingIndex !== -1) {
      // Actualizar el archivo existente
      history[existingIndex] = file
    } else {
      // Agregar el nuevo archivo
      history.push(file)
    }

    // Limitar al número máximo de archivos configurado
    const sortedHistory = history.sort((a, b) => b.timestamp - a.timestamp).slice(0, MAX_HISTORY_ITEMS)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedHistory))
  } catch (error) {
    console.error("Error saving Swagger file to local storage:", error)
  }
}

export function getSwaggerHistory(): StoredSwaggerFile[] {
  if (!isHistoryEnabled || typeof window === "undefined") return []

  try {
    const history = localStorage.getItem(STORAGE_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error("Error retrieving Swagger history from local storage:", error)
    return []
  }
}

export function getSwaggerFile(id: string): StoredSwaggerFile | null {
  if (!isHistoryEnabled || typeof window === "undefined") return null

  try {
    const history = getSwaggerHistory()
    return history.find((file) => file.id === id) || null
  } catch (error) {
    console.error("Error retrieving Swagger file from local storage:", error)
    return null
  }
}

export function deleteSwaggerFile(id: string): void {
  if (!isHistoryEnabled || typeof window === "undefined") return

  try {
    const history = getSwaggerHistory()
    const updatedHistory = history.filter((file) => file.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error("Error deleting Swagger file from local storage:", error)
  }
}

