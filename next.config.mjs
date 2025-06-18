/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lnypfjpxoplyfpprmlxi.supabase.co', // <-- ضف هذا
      },
      {
        protocol: 'https',
        hostname: 'tvpgriftsewiyitmmyci.supabase.co', // <-- اتركه إذا كنت تستخدمه أيضاً
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
