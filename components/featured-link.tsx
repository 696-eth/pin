import { useEffect, useState } from 'react'
import { type ImageObject } from 'open-graph-scraper/types'
import Image from 'next/image'
import FeaturedSocial from './featured-social'
import { getMetadata } from '@/actions/actions'

export default function FeaturedLink(props: { url: string }) {
  const [social, setSocial] = useState('')

  const [metadata, setMetadata] = useState<
    | {
        title: string | null
        description: string | null
        image: ImageObject | null
      }
    | null
    | undefined
  >()

  useEffect(() => {
    async function fetchMetadata() {
      const data = await getMetadata(props.url)
      setMetadata(data)
    }
    if (props.url.includes('x.com') || props.url.includes('twitter.com')) {
      setSocial('x')
    } else if (
      props.url.includes('youtube.com') ||
      props.url.includes('youtu.be')
    ) {
      setSocial('youtube')
    } else {
      fetchMetadata()
    }
  }, [props.url])

  return social !== '' ? (
    <FeaturedSocial url={props.url} social={social} />
  ) : (
    <>
      <h2>{metadata?.title ? metadata.title : props.url}</h2>
      {metadata?.image && (
        <div className='relative max-w-48 max-h-48'>
          <Image
            src={metadata.image.url}
            alt={metadata.image.alt || ''}
            width={metadata.image.width || 48}
            height={metadata.image.height || 48}
            className='object-cover rounded-lg'
          />
        </div>
      )}
      {metadata?.description && <p>{metadata.description}</p>}
      <div className='flex gap-4'>
        <a
          href={props.url}
          className='btn btn-primary'
          target='_blank'
          rel='noopener noreferrer'
        >
          Visit Website
          <i className='fa-solid fa-arrow-right text-sm'></i>
        </a>
      </div>
    </>
  )
}
