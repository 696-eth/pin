import { XEmbed } from 'react-social-media-embed'
import { YouTubeEmbed } from 'react-social-media-embed'

export default function FeaturedSocial(props: { url: string; social: string }) {
  return (
    <div className='flex justify-center'>
      {props.social === 'x' && <XEmbed url={props.url} width='375' />}
      {props.social === 'youtube' && (
        <YouTubeEmbed url={props.url} width={325} height={220} />
      )}
    </div>
  )
}
