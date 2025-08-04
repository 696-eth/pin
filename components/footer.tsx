'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BsCopy } from 'react-icons/bs'

export default function Footer() {
  function copyCA() {
    navigator.clipboard
      .writeText('0x0e6dd7ec79912374e4567ed76f8512a8e2343b07')
      .then(() => {
        alert('Contract address copied to clipboard!')
      })
      .catch(() => {
        alert('Failed to copy contract address.')
      })
  }

  return (
    <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center my-4'>
      <div className='flex flex-col items-center gap-2'>
        <div className='flex flex-row gap-8 items-center'>
          <a
            href='https://x.com/696_eth'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image src='/x.svg' alt='X Icon' width={64} height={47} />
          </a>
          <a
            href='https://dexscreener.com/base/0x0E6dd7EC79912374E4567ed76F8512A8E2343B07'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              src='/dex-screener.svg'
              alt='DEX Screener Icon'
              width={32}
              height={38}
            />
          </a>
        </div>
        <div>
          <p>
            CA: 0x0e6dd7ec79912374e4567ed76f8512a8e2343b07{' '}
            <BsCopy className='inline cursor-pointer' onClick={copyCA} />
          </p>
        </div>
        <div>
          <Link href='/terms'>Terms of Service</Link> &bull;{' '}
          <Link href='/privacy'>Privacy Policy</Link>
        </div>
      </div>
    </footer>
  )
}
