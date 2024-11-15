import { describe } from "node:test";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", //uploadthing doc
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`, //core.ts
      }, //musime vlozit na whitelist URLs protoze next/image automaticky resizne image coz pouziva server(compute power) a na neomezene resiznuti image
      //by jsme potrebovali payedplan, proto se potrebujeme ujistit ze ne kazdy muze pouzit nas backend a URLs aby mohli resiznout nase iamges a aby jsme se tomu vyhnuli
      // ze poskytneme pathname specificke pro nasi app aby jsme mohli resiznout images pouze v nasi app
    ],
  },
  rewrites: () => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag", //zanecha puvodni URL ale redirecne nas na jinou page
      },
    ];
  },
};

export default nextConfig;
