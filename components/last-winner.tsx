import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getMetadata } from '@/actions/actions'
import { type OgObject } from 'open-graph-scraper/types'

export default function LastWinner({
  address,
  message,
  amount
}: {
  address: string
  message: string
  amount?: number
}) {
  const [metadata, setMetadata] = useState<OgObject | null | undefined>()

  function isValidHttpUrl(str: string) {
    let url

    try {
      url = new URL(str)
    } catch {
      return false
    }

    return url.protocol === 'http:' || url.protocol === 'https:'
  }

  const isLink = isValidHttpUrl(message)

  useEffect(() => {
    async function fetchMetadata() {
      const data = await getMetadata(message)
      setMetadata(data as OgObject | null)
    }

    fetchMetadata()
  }, [isLink, message])

  return (
    <div className='flex flex-col items-center gap-2 p-4 border rounded-lg shadow-sm'>
      <h2 className='text-3xl font-semibold'>Latest $PIN Winner</h2>
      <p>Address: {address}</p>
      {amount !== undefined && <p>{amount} $PIN</p>}
      {!isLink ? (
        <p>{message}</p>
      ) : metadata === undefined ? (
        <p>Loading...</p>
      ) : metadata === null ? (
        <a href={message}>{message}</a>
      ) : (
        <a href={message}>
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
