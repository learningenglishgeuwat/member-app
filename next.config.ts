import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix NavigatorLockAcquireTimeoutError
  allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
  
  // Nonaktifkan StrictMode untuk menghilangkan debugger pause
  reactStrictMode: false
};

export default nextConfig;
