/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['i.ibb.co',
        'lh3.googleusercontent.com',
        'cdn.intra.42.fr',
        'i.postimg.cc',
        'localhost',
        'images.unsplash.com',
        'cdn.builder.io',
        'preview.redd.it',
        'img.pikbest.com',
        'randomuser.me',
        ],
      },
      compiler: {
        styledComponents: true,
      },
}

module.exports = nextConfig
