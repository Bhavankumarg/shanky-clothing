/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
    ],
  },
  // Make sure the catalog JSON ships with the serverless function on Vercel.
  // Without this, fs.readFile(data/products.json) returns ENOENT in production.
  experimental: {
    outputFileTracingIncludes: {
      '/**/*': ['./data/**/*', './public/uploads/**/*'],
    },
  },
}

module.exports = nextConfig
