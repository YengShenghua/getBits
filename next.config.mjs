/** @type {import('next').NextConfig} */
const nextConfig = {
  // Updated: moved from experimental.serverComponentsExternalPackages
  serverExternalPackages: ['@prisma/client', 'bcryptjs', 'winston'],
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve Node.js modules on the client to prevent build errors
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

    // External packages for server-side only
    if (isServer) {
      config.externals.push('@prisma/client', 'bcryptjs')
    }

    return config
  },
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here if needed in the future
  },
}

export default nextConfig
