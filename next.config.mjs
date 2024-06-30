/** @type {import('next').NextConfig} */
const nextConfig = {
    images:  {
        remotePatterns: [
            {
                hostname: 'wealthy-broccoli-070ad62d8a.media.strapiapp.com'
            }
        ]
    }
};

export default nextConfig;
