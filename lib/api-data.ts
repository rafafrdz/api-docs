import type { ApiData } from "@/lib/types"

export const apiData: ApiData = {
  title: "ServerKitESG API",
  description: "API para gestión de sostenibilidad y certificaciones ambientales",
  version: "1.0.0",
  tags: [
    "Autenticación",
    "Compañías",
    "Oficinas",
    "Usuarios",
    "Certificados",
    "Plantillas de Certificación",
    "Tipos de Documentos",
    "Planes de Descarbonización",
    "Utilidades",
    "Residuos",
    "Objetivos",
    "Facturación",
    "Métricas de Oficina",
    "Reportes",
    "Documentos",
  ],
  endpoints: [
    // Autenticación
    {
      path: "/auth/login",
      method: "post",
      tag: "Autenticación",
      summary: "Iniciar sesión",
      description: "Autentica a un usuario y devuelve un token JWT",
      requestBody: {
        contentType: "application/json",
        schema: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
            },
            password: {
              type: "string",
            },
          },
        },
      },
      responses: [
        {
          status: "200",
          description: "Autenticación exitosa",
          schema: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            expiresIn: 3600,
          },
        },
        {
          status: "401",
          description: "Credenciales inválidas",
          schema: {
            code: "INVALID_CREDENTIALS",
            message: "El correo electrónico o la contraseña son incorrectos",
          },
        },
      ],
    },
    {
      path: "/auth/logout",
      method: "post",
      tag: "Autenticación",
      summary: "Cerrar sesión",
      description: "Invalida el token JWT actual",
      security: "bearer",
      responses: [
        {
          status: "200",
          description: "Sesión cerrada exitosamente",
        },
        {
          status: "401",
          description: "No autorizado",
        },
      ],
    },
    {
      path: "/auth/refresh-token",
      method: "post",
      tag: "Autenticación",
      summary: "Refrescar token",
      description: "Obtiene un nuevo token JWT usando el refresh token",
      responses: [
        {
          status: "200",
          description: "Token refrescado exitosamente",
          schema: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            expiresIn: 3600,
          },
        },
        {
          status: "401",
          description: "Refresh token inválido",
        },
      ],
    },

    // Compañías
    {
      path: "/companies",
      method: "get",
      tag: "Compañías",
      summary: "Listar compañías",
      description: "Obtiene todas las compañías o filtra por nombre",
      security: "bearer",
      parameters: [
        {
          name: "name",
          in: "query",
          required: false,
          type: "string",
          description: "Filtrar por nombre de compañía",
        },
      ],
      responses: [
        {
          status: "200",
          description: "Lista de compañías",
          schema: [
            {
              id: "123e4567-e89b-12d3-a456-426614174000",
              name: "Empresa Ejemplo",
              sector: "Tecnología",
              country: "España",
            },
          ],
        },
      ],
    },
    {
      path: "/companies",
      method: "post",
      tag: "Compañías",
      summary: "Crear compañía",
      description: "Crea una nueva compañía",
      security: "bearer",
      requestBody: {
        contentType: "application/json",
        schema: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
            },
            sector: {
              type: "string",
            },
            country: {
              type: "string",
            },
          },
        },
      },
      responses: [
        {
          status: "201",
          description: "Compañía creada exitosamente",
          schema: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Empresa Ejemplo",
            sector: "Tecnología",
            country: "España",
          },
        },
        {
          status: "400",
          description: "Datos inválidos",
        },
      ],
    },
    {
      path: "/companies/{id}",
      method: "get",
      tag: "Compañías",
      summary: "Obtener compañía",
      description: "Obtiene una compañía por su ID",
      security: "bearer",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          type: "string",
          description: "ID de la compañía",
        },
      ],
      responses: [
        {
          status: "200",
          description: "Compañía encontrada",
          schema: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            name: "Empresa Ejemplo",
            sector: "Tecnología",
            country: "España",
          },
        },
        {
          status: "404",
          description: "Compañía no encontrada",
        },
      ],
    },

    // Certificados (ejemplo)
    {
      path: "/certificates",
      method: "get",
      tag: "Certificados",
      summary: "Listar certificados",
      description: "Obtiene todos los certificados o filtra por compañía y oficina",
      security: "bearer",
      parameters: [
        {
          name: "companyId",
          in: "query",
          required: false,
          type: "string",
          description: "ID de la compañía para filtrar",
        },
        {
          name: "officeId",
          in: "query",
          required: false,
          type: "string",
          description: "ID de la oficina para filtrar",
        },
      ],
      responses: [
        {
          status: "200",
          description: "Lista de certificados",
          schema: [
            {
              id: "123e4567-e89b-12d3-a456-426614174000",
              officeId: "123e4567-e89b-12d3-a456-426614174001",
              type: "ISO 14001",
              issuedAt: "2023-01-15",
            },
          ],
        },
      ],
    },
  ],
}

