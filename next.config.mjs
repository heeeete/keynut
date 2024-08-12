/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['https://image.keynut.co.kr/'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.keynut.co.kr',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
