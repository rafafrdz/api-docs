"use client"

import { useState } from "react"
import { GitBranch, Github, GitlabIcon as GitlabFilled, Server, Copy, Check, ExternalLink } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/code-block"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CiCdIntegration() {
  const [copied, setCopied] = useState<string | null>(null)
  const [repoUrl, setRepoUrl] = useState("https://github.com/username/api-docs")
  const [apiSpecPath, setApiSpecPath] = useState("swagger.yaml")
  const [deployUrl, setDeployUrl] = useState("https://api-docs.example.com")

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const githubWorkflow = `name: Deploy API Documentation

on:
  push:
    branches: [ main ]
    paths:
      - '${apiSpecPath}'
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build documentation
        run: npm run build
        env:
          SWAGGER_PATH: ${apiSpecPath}
      
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: out
          branch: gh-pages
`

  const gitlabCiConfig = `stages:
  - build
  - deploy

variables:
  SWAGGER_PATH: ${apiSpecPath}

build:
  stage: build
  image: node:18-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - out/
  only:
    changes:
      - ${apiSpecPath}
    refs:
      - main

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl --location --request POST "$CI_PAGES_URL/trigger/deploy" --header "Authorization: Bearer $CI_PAGES_TOKEN"
  environment:
    name: production
    url: ${deployUrl}
  only:
    refs:
      - main
  needs:
    - build
`

  const jenkinsfile = `pipeline {
    agent {
        docker {
            image 'node:18-alpine'
        }
    }
    
    environment {
        SWAGGER_PATH = '${apiSpecPath}'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'rsync -avz --delete out/ user@server:${deployUrl}'
            }
        }
    }
    
    triggers {
        pollSCM('H/15 * * * *')
    }
    
    post {
        success {
            echo 'API Documentation deployed successfully!'
        }
        failure {
            echo 'Failed to deploy API Documentation'
        }
    }
}`

  const vercelConfig = `{
  "name": "api-documentation",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "SWAGGER_PATH": "${apiSpecPath}"
  },
  "git": {
    "deploymentEnabled": {
      "main": true
    }
  }
}`

  const netlifyConfig = `[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  SWAGGER_PATH = "${apiSpecPath}"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[context.production]
  command = "npm run build"

[context.deploy-preview]
  command = "npm run build"

# Trigger builds only when the Swagger file changes
[context.production.environment]
  SWAGGER_TRIGGER = "true"

# Add a webhook to trigger builds when your Swagger file changes in another repo
[[webhooks]]
  title = "Trigger build on Swagger update"
  url = "/.netlify/functions/trigger-build"`

  const setupScript = `#!/bin/bash
# Script para configurar la integración CI/CD para la documentación de API

# Configuración
REPO_URL="${repoUrl}"
API_SPEC_PATH="${apiSpecPath}"
DEPLOY_URL="${deployUrl}"

# Crear directorio para la documentación
mkdir -p api-docs
cd api-docs

# Inicializar repositorio Git
git init
git remote add origin $REPO_URL

# Crear estructura básica del proyecto
npm init -y
npm install next react react-dom js-yaml

# Configurar scripts en package.json
cat > package.json << EOF
{
  "name": "api-documentation",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build && next export",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "js-yaml": "^4.1.0",
    "next": "^13.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
EOF

# Crear archivo de configuración para CI/CD
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << EOF
${githubWorkflow}
EOF

# Crear README con instrucciones
cat > README.md << EOF
# API Documentation

Documentación automática para la API basada en especificaciones Swagger/OpenAPI.

## Desarrollo

\`\`\`bash
npm run dev
\`\`\`

## Despliegue

La documentación se despliega automáticamente cuando se actualiza el archivo \`${apiSpecPath}\`.

URL de despliegue: ${deployUrl}
EOF

# Commit inicial
git add .
git commit -m "Configuración inicial de documentación de API"

echo "Configuración completada. Ahora puedes subir el repositorio con 'git push -u origin main'"`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <GitBranch className="h-4 w-4 mr-2" />
          Integración CI/CD
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Integración con CI/CD</DialogTitle>
          <DialogDescription>
            Configura la integración con sistemas CI/CD para mantener tu documentación actualizada automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="repo-url">URL del Repositorio</Label>
              <Input
                id="repo-url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div>
              <Label htmlFor="api-spec-path">Ruta del Archivo Swagger</Label>
              <Input
                id="api-spec-path"
                value={apiSpecPath}
                onChange={(e) => setApiSpecPath(e.target.value)}
                placeholder="swagger.yaml"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="deploy-url">URL de Despliegue</Label>
              <Input
                id="deploy-url"
                value={deployUrl}
                onChange={(e) => setDeployUrl(e.target.value)}
                placeholder="https://api-docs.example.com"
              />
            </div>
          </div>

          <Tabs defaultValue="github">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="github" className="flex items-center gap-1">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </TabsTrigger>
              <TabsTrigger value="gitlab" className="flex items-center gap-1">
                <GitlabFilled className="h-4 w-4" />
                <span>GitLab</span>
              </TabsTrigger>
              <TabsTrigger value="jenkins" className="flex items-center gap-1">
                <Server className="h-4 w-4" />
                <span>Jenkins</span>
              </TabsTrigger>
              <TabsTrigger value="vercel" className="flex items-center gap-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L24 22H0L12 1Z" />
                </svg>
                <span>Vercel</span>
              </TabsTrigger>
              <TabsTrigger value="netlify" className="flex items-center gap-1">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.934 8.519a1.044 1.044 0 0 0 .303.23l2.349-1.045-2.192-2.171-.491 2.954zM12.06 6.546a1.305 1.305 0 0 0 .209.574l.207.207.959-.959-.884-1.033-.491 1.211zM5.317 10.483a1.044 1.044 0 0 0 .23.303l.932.62.761-1.005-1.52-.229-.403.311zM18.152 11.627l-1.12-.554-.244 1.534 1.372-.98h-.008zM7.974 13.392a1.044 1.044 0 0 0 .303.23l.631-.977-.726-.668-.208 1.415zM11.906 15.214a1.044 1.044 0 0 0 .23.303l1.518.315-1.11-1.191-.638.573zM9.292 7.845a1.044 1.044 0 0 0-.23-.303l-1.005.583.782.782.453-1.062zM5.046 8.251a1.044 1.044 0 0 0 .303.23l.324-.324-.414-.414-.213.508zM5.194 15.357a1.044 1.044 0 0 0 .303.23l1.534-.244-.554-1.12-1.283 1.134zM14.47 14.387a1.044 1.044 0 0 0-.23-.303l-1.415-.208.668.726.977-.215zM7.12 13.576a1.044 1.044 0 0 0 .23.303l1.134 1.283.244-1.534-1.12-.554-.488.502zM11.916 11.473a1.044 1.044 0 0 0 .23.303l1.596.244-.582-1.005-1.244.458zM7.845 9.292a1.044 1.044 0 0 0-.303-.23l-1.062.453.782.782.583-1.005zM15.357 5.194a1.044 1.044 0 0 0 .23.303l1.134 1.283-.244-1.534-1.12-.554v.502zM13.576 7.12a1.044 1.044 0 0 0 .303.23l.502-.488-.554-1.12-1.534.244 1.283 1.134zM10.483 5.317a1.044 1.044 0 0 0 .303.23l.311-.403-.229-1.52-1.005.761.62.932zM17.303 9.053a1.044 1.044 0 0 0-.303-.23l-1.062.453.782.782.583-1.005z" />
                </svg>
                <span>Netlify</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="github" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">GitHub Actions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configura GitHub Actions para desplegar automáticamente tu documentación cuando se actualice el
                  archivo Swagger.
                </p>

                <div className="relative">
                  <CodeBlock language="yaml" code={githubWorkflow} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(githubWorkflow, "github")}
                  >
                    {copied === "github" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="mt-4 flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Guarda este archivo como <code>.github/workflows/deploy-docs.yml</code> en tu repositorio.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://docs.github.com/es/actions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <span>Documentación</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gitlab" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">GitLab CI/CD</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configura GitLab CI/CD para desplegar automáticamente tu documentación cuando se actualice el archivo
                  Swagger.
                </p>

                <div className="relative">
                  <CodeBlock language="yaml" code={gitlabCiConfig} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(gitlabCiConfig, "gitlab")}
                  >
                    {copied === "gitlab" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="mt-4 flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Guarda este archivo como <code>.gitlab-ci.yml</code> en la raíz de tu repositorio.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://docs.gitlab.com/ee/ci/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <span>Documentación</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="jenkins" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Jenkins Pipeline</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configura Jenkins para desplegar automáticamente tu documentación cuando se actualice el archivo
                  Swagger.
                </p>

                <div className="relative">
                  <CodeBlock language="groovy" code={jenkinsfile} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(jenkinsfile, "jenkins")}
                  >
                    {copied === "jenkins" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="mt-4 flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Guarda este archivo como <code>Jenkinsfile</code> en la raíz de tu repositorio.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://www.jenkins.io/doc/book/pipeline/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <span>Documentación</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vercel" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Vercel</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configura Vercel para desplegar automáticamente tu documentación cuando se actualice el archivo
                  Swagger.
                </p>

                <div className="relative">
                  <CodeBlock language="json" code={vercelConfig} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(vercelConfig, "vercel")}
                  >
                    {copied === "vercel" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="mt-4 flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Guarda este archivo como <code>vercel.json</code> en la raíz de tu repositorio.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://vercel.com/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <span>Documentación</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="netlify" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Netlify</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configura Netlify para desplegar automáticamente tu documentación cuando se actualice el archivo
                  Swagger.
                </p>

                <div className="relative">
                  <CodeBlock language="toml" code={netlifyConfig} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(netlifyConfig, "netlify")}
                  >
                    {copied === "netlify" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="mt-4 flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Guarda este archivo como <code>netlify.toml</code> en la raíz de tu repositorio.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://docs.netlify.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <span>Documentación</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Script de Configuración Rápida</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Utiliza este script para configurar rápidamente la integración CI/CD en tu proyecto.
            </p>

            <div className="relative">
              <CodeBlock language="bash" code={setupScript} />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(setupScript, "setup")}
              >
                {copied === "setup" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" asChild>
            <a
              href="https://docs.github.com/es/actions/guides/building-and-testing-nodejs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver más guías
            </a>
          </Button>
          <Button onClick={() => copyToClipboard(setupScript, "setup")}>
            {copied === "setup" ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Script
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

