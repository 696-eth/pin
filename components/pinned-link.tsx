import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getMetadata } from '@/actions/actions'
import { type OgObject } from 'open-graph-scraper/types'

export default function PinnedLink({ url }: { url: string }) {
  const [metadata, setMetadata] = useState<OgObject | null | undefined>()

  useEffect(() => {
    async function fetchMetadata() {
      const data = await getMetadata(url)
      setMetadata(data as OgObject | null)
    }

    fetchMetadata()
  }, [url])

  return (
    <div className='flex flex-col items-center gap-2 p-4 border rounded-lg shadow-sm'>
      <h2 className='text-3xl font-semibold'>Latest $PIN Winner</h2>
      {metadata === undefined ? (
        <p>Loading...</p>
      ) : metadata === null ? (
        <a href={url}>{url}</a>
      ) : (
        <a href={url}>
          {metadata.ogTitle && <h2>{metadata.ogTitle}</h2>}
          {Array.isArray(metadata.ogImage) && metadata.ogImage.length > 0 && (
            <div className='relative max-w-48 max-h-48'>
              <Image
                src={metadata.ogImage[0].url || ''}
                alt={metadata.ogTitle || ''}
                width={metadata.ogImage[0].width || 48}
                height={metadata.ogImage[0].height || 48}
                className='object-cover rounded-lg'
              />
            </div>
          )}
          {metadata.ogDescription && <p>{metadata.ogDescription}</p>}
        </a>
      )}
    </div>
  )
}
