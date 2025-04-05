# API Documentation

Documentación interactiva para APIs generada dinámicamente a partir de especificaciones Swagger/OpenAPI.

## CARACTERÍSTICAS

- Carga dinámica de archivos Swagger/OpenAPI (YAML o JSON)
- Búsqueda y filtrado de endpoints
- Playground interactivo para probar endpoints
- Diseño responsive para móviles y escritorio
- Personalización de temas y apariencia
- Exportación de documentación (Markdown, HTML, JSON)
- Historial de archivos Swagger cargados
- Visualización mejorada de esquemas complejos
- Integración con sistemas CI/CD
- Soporte para despliegue con Docker

## DESPLIEGUE CON DOCKER

### Requisitos previos

- Docker (https://docs.docker.com/get-docker/)
- Docker Compose (https://docs.docker.com/compose/install/) (opcional, para desarrollo)

### Estructura de archivos para Docker

```
api-docs/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── ... (archivos del proyecto)
```

### Despliegue rápido

La forma más rápida de ejecutar la aplicación es utilizando la imagen Docker preconfigurada:

```sh
docker run -p 3000:3000 -e SWAGGER_URL=https://example.com/swagger.yaml username/api-docs:latest
```

### Construcción y ejecución manual

1. Clonar el repositorio

```sh
git clone https://github.com/username/api-docs.git
cd api-docs
```

2. Construir la imagen Docker

```sh
docker build -t api-docs .
```

3. Ejecutar el contenedor

```sh
docker run -p 3000:3000 api-docs
```

La aplicación estará disponible en http://localhost:3000

### Usando Docker Compose

Para desarrollo o configuraciones más complejas, puedes usar Docker Compose:

```sh
docker-compose up
```

Para construir y ejecutar en modo producción:

```sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### CONFIGURACIÓN

#### Variables de entorno

`PORT` - Puerto en el que se ejecutará la aplicación - Valor por defecto: 3000
`SWAGGER_URL` - URL del archivo Swagger para carga automática - Valor por defecto: ""
`DEFAULT_THEME` - Tema por defecto (light, dark, system) - Valor por defecto: "system"
`ENABLE_HISTORY` - Habilitar historial de archivos Swagger - Valor por defecto: "true"
`MAX_HISTORY_ITEMS` - Número máximo de elementos en el historial - Valor por defecto: 10

### Volúmenes

Para persistir el historial de archivos Swagger entre reinicios del contenedor:

```sh
docker run -p 3000:3000 -v api-docs-data:/app/.next/cache api-docs
```

### INTEGRACIÓN CON CI/CD

La aplicación incluye configuraciones predefinidas para integración con sistemas CI/CD:

- GitHub Actions
- GitLab CI
- Jenkins
- Vercel
- Netlify

Puedes acceder a estas configuraciones desde la interfaz de usuario en el botón "Integración CI/CD".

Ejemplo: Actualización automática con GitHub Actions

1. Configura un repositorio con tu archivo Swagger
2. Añade la configuración de GitHub Actions proporcionada por la aplicación
3. Configura el despliegue automático a Docker Hub:

```yaml
deploy:
  needs: build
  runs-on: ubuntu-latest
  steps:
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        push: true
        tags: username/api-docs:latest
```

### PERSONALIZACIÓN AVANZADA

#### Personalización del Dockerfile

Puedes personalizar el Dockerfile para incluir archivos Swagger predeterminados o configuraciones específicas:

```Dockerfile
FROM node:18-alpine AS base

# ... (configuración base)

# Copiar archivo Swagger predeterminado
COPY ./swagger.yaml /app/public/swagger.yaml
ENV SWAGGER_URL=/swagger.yaml

# ... (resto del Dockerfile)
```

#### Uso con proxy inverso (Nginx)

Ejemplo de configuración de Nginx para servir la documentación de API:

```nginx
server {
    listen 80;
    server_name api-docs.example.com;

    location / {
        proxy_pass http://api-docs:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### SOLUCIÓN DE PROBLEMAS

#### El contenedor se cierra inmediatamente

Asegúrate de que el puerto 3000 no esté siendo utilizado por otra aplicación:

```sh
docker run -p 3001:3000 api-docs
```

#### No se cargan los archivos Swagger

Si estás utilizando `SWAGGER_URL`, asegúrate de que la URL sea accesible desde dentro del contenedor y que no haya problemas de `CORS`.

#### Problemas de permisos

Si encuentras problemas de permisos al montar volúmenes:

```sh
docker run -p 3000:3000 -v api-docs-data:/app/.next/cache:Z api-docs
```

### DESARROLLO

Ejecutar en modo desarrollo con Docker

```sh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Esto montará el código fuente como un volumen y habilitará el hot-reloading.

## CARACTERÍSTICAS ADICIONALES

1. Generación de código cliente
   La aplicación permite generar código cliente para diferentes lenguajes de programación (JavaScript, Python, PHP, Java, etc.) a partir de la especificación Swagger. Esto facilita la integración con la API desde diferentes plataformas.

2. Visualización de esquemas complejos
   Para APIs con modelos de datos complejos, la aplicación proporciona una visualización mejorada que permite expandir y contraer objetos anidados, facilitando la comprensión de la estructura de datos.

3. Playground interactivo
   El playground permite probar los endpoints directamente desde la documentación, configurando parámetros, cuerpos de solicitud y visualizando las respuestas en tiempo real.

4. Personalización de temas
   La aplicación permite personalizar colores, fuentes y estilos para adaptarse a la identidad visual de tu empresa o proyecto.

5. Exportación de documentación
   Puedes exportar la documentación en diferentes formatos (Markdown, HTML, JSON) para compartirla o integrarla en otros sistemas.

## ARQUITECTURA DEL PROYECTO

La aplicación está construida con Next.js y utiliza una arquitectura modular:

- /app: Páginas y rutas de la aplicación
- /components: Componentes React reutilizables
- /lib: Utilidades y funciones auxiliares
- /public: Archivos estáticos

## SEGURIDAD

La aplicación implementa las siguientes medidas de seguridad:

1. Ejecución en contenedor con usuario no root
2. Validación de archivos Swagger antes de procesarlos
3. Sanitización de datos para prevenir inyecciones
4. Configuración segura de encabezados HTTP

## RENDIMIENTO

Para garantizar un buen rendimiento, la aplicación:

1. Utiliza componentes del lado del servidor cuando es posible
2. Implementa carga diferida para componentes pesados
3. Optimiza la carga de archivos Swagger grandes
4. Minimiza el tamaño del bundle con tree-shaking

## LICENCIA

Este proyecto está licenciado bajo la licencia MIT.
