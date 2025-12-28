/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true
  },
  outputFileTracingRoot: path.join(__dirname, '../..')
}

module.exports = nextConfig