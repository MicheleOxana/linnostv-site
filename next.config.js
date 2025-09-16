/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // você pode manter isso se quiser
    domains: ['static-cdn.jtvnw.net'], // necessário para mostrar avatar da Twitch
  }
};

module.exports = nextConfig;

