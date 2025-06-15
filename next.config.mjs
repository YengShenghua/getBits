/** @type {import('next').NextConfig} */
const nextConfig = {
  // External packages for server-side only
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }
    }

    return config
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  
  // Remove output: 'standalone' for Vercel deployment
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

export default nextConfig
