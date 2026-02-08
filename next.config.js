/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix NavigatorLockAcquireTimeoutError
  allowedDevOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],

  // Nonaktifkan StrictMode untuk menghilangkan debugger pause
  reactStrictMode: false,

  // Optimasi kompilasi
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Cache optimization
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
