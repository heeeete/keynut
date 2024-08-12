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
        hostname: 'keynut-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.keynut.co.kr',
        port: '', // 생략 가능
        pathname: '**', // 이 부분은 모든 경로를 허용하도록 설정합니다.
      },
    ],
  },
};

export default nextConfig;
