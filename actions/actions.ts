'use server'

import ogs from 'open-graph-scraper'
import { type OgObject } from 'open-graph-scraper/types'

export async function getMetadata(url: string): Promise<OgObject | null> {
  try {
    const data = await ogs({ url, onlyGetOpenGraphInfo: true })
    const { error, result } = data
    if (error) {
      console.error('Error fetching metadata:', result)
      return null
    } else {
      console.log(result)
      return result
    }
  } catch (error) {
    console.error('Error fetching metadata for url', error)
    return null
  }
}
