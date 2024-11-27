/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Origin", value: "*" },
            {
              key: "Access-Control-Allow-Methods",
              value: "GET, POST, PUT, DELETE, OPTIONS",
            },
            {
              key: "Access-Control-Allow-Headers",
              value: "Content-Type, Authorization",
            },
          ],
        },
      ];
    },
    webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
      config.module.rules.push({
        test: /\.node$/,
        use: [
          {
            loader: "nextjs-node-loader",
          },
        ],
      });
      if (isServer) {
        config.externals.push(/^@integrationos\/node-/);
        config.externals.push(/^@integrationos\/rust-utils./);
      }
  
      return config;
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'img.clerk.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'assets.buildable.dev',
          port: '',
          pathname: '/**',
        }
      ],
    },
  };
  export default nextConfig;
