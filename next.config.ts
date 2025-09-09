/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'devflowlb.com',       // your Hostinger domain
      'srv1862-files.hstgr.io' // also allow the Hostinger storage CDN
    ],
  },
};

module.exports = nextConfig;
