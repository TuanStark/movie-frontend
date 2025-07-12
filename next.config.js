/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org',
      'images.unsplash.com',
      'randomuser.me',
      'iguov8nhvyobj.vcdn.cloud',
      'encrypted-tbn0.gstatic.com',
      'poundarts.org.uk',
      'cdn-media.sforum.vn',
      'cdn-media.sforum.vn',
      'www.google.com',
      'res.cloudinary.com',
      'via.placeholder.com'
    ], // For movie poster images and article images
  },
};

module.exports = nextConfig; 