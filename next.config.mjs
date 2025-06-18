import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabilita StrictMode temporaneamente
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve('./src'),
      '@components': path.resolve('./src/components'),
    }
    return config
  },
}

export default nextConfig
