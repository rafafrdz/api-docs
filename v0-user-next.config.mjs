/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    SWAGGER_URL: process.env.SWAGGER_URL || '',
    DEFAULT_THEME: process.env.DEFAULT_THEME || 'system',
    ENABLE_HISTORY: process.env.ENABLE_HISTORY || 'true',
    MAX_HISTORY_ITEMS: process.env.MAX_HISTORY_ITEMS || '10',
  },
}

export default nextConfig

