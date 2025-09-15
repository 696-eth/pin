'use server'

import ogs from 'open-graph-scraper'
import { type ImageObject } from 'open-graph-scraper/types'

export async function getMetadata(url: string): Promise<{
  title: string | null
  description: string | null
  image: ImageObject | null
} | null> {
  try {
    const options = {
      url,
      onlyGetOpenGraphInfo: true
    }
    const data = await ogs(options)
    const { error, result } = data
    if (error) {
      console.error('Error fetching metadata:', result)
      return null
    } else {
      const res = {
        title: result.ogTitle || null,
        description: result.ogDescription || null,
        image:
          Array.isArray(result.ogImage) && result.ogImage.length > 0
            ? result.ogImage[0] || null
            : null
      }
      return res
    }
  } catch (error) {
    console.error('Error fetching metadata for url', error)
    return null
  }
}
