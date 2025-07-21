'use client'

import ConnectButton from '@/components/connect-button'
import Image from 'next/image'
import { BsPinAngleFill } from 'react-icons/bs'
import { useReadContract } from 'wagmi'
import { useAppKitAccount } from '@reown/appkit/react'
import { pinAbi } from '@/abi/pin'

const pinAddress = '0x0e6dd7ec79912374e4567ed76f8512a8e2343b07'

export default function Home() {
  const account = useAppKitAccount()

  const { data: balance } = useReadContract({
    address: pinAddress,
    abi: pinAbi,
    functionName: 'balanceOf',
    args: [account?.address]
  })

  function formatBalance(balance: bigint) {
    if (!balance) return '0'
    try {
      // 18 decimals for ERC20
      const decimals = 18
      const divisor = BigInt('10') ** BigInt(decimals)
      const whole = balance / divisor
      return whole.toLocaleString()
    } catch {
      return balance.toString()
    }
  }

  return (
    <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
        <div className='flex flex-row items-center gap-2'>
          <BsPinAngleFill className='text-red-700 text-6xl' />
          <h1 className='text-6xl sm:text-5xl font-bold tracking-tight'>
            $PIN
          </h1>
        </div>
        <ol className='font-mono list-inside list-decimal text-sm/6 text-center sm:text-left'>
          <li className='mb-2 tracking-[-.01em]'>
            Get your memes, ads or projects seen by thousands.
          </li>
        </ol>
        <div>
          <ConnectButton />
          {typeof balance === 'bigint' && balance > 0 && (
            <p className='text-sm mt-2'>
              Your balance:{' '}
              <span className='font-bold'>{formatBalance(balance)} $PIN</span>
            </p>
          )}
        </div>
      </main>
      <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center'>
        <p>CA: {pinAddress}</p>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://dexscreener.com/base/0x0E6dd7EC79912374E4567ed76F8512A8E2343B07'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='/globe.svg'
            alt='Globe icon'
            width={16}
            height={16}
          />
          DEX Screener →
        </a>
      </footer>
    </div>
  )
}
