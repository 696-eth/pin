'use client'

import { BsPinAngleFill } from 'react-icons/bs'
import { useReadContract } from 'wagmi'
import { useAppKitAccount } from '@reown/appkit/react'
import { pinAbi } from '@/abi/pin'

const pinAddress = process.env.NEXT_PUBLIC_PIN_ADDRESS as `0x${string}`

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
    <div className='max-w-2xl mx-auto'>
      <div className='flex flex-row items-center gap-2'>
        <BsPinAngleFill className='text-red-700 text-6xl' />
        <h1 className='text-6xl sm:text-5xl font-bold tracking-tight'>$PIN</h1>
      </div>
      <ol className='font-mono list-inside list-decimal text-sm/6 text-center sm:text-left'>
        <li className='mb-2 tracking-[-.01em]'>
          Get your memes, ads or projects seen by thousands.
        </li>
      </ol>
      <div>
        {typeof balance === 'bigint' && balance > 0 && (
          <p className='text-sm mt-2'>
            Your balance:{' '}
            <span className='font-bold'>{formatBalance(balance)} $PIN</span>
          </p>
        )}
      </div>
    </div>
  )
}
