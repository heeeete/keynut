import withPWA from '@ducanh2912/next-pwa';
import withBundleAnalyzer from '@next/bundle-analyzer';

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

const bundleAnalyzerConfig = {
  enabled: process.env.ANALYZE === 'true', // ANALYZE 환경 변수로 활성화 여부 결정
};

export default withBundleAnalyzer(bundleAnalyzerConfig)(
  withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
  })(nextConfig),
);
