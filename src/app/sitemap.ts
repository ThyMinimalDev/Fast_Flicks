import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://fast-flicks.com',
      lastModified: new Date(),
    },
  ]
}
