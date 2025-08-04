'use client'

import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { useAppKitAccount } from '@reown/appkit/react'
import { pinAbi } from '@/abi/pin'

const pinAddress = '0x0e6dd7ec79912374e4567ed76f8512a8e2343b07'
const step = 1.05

export default function Home() {
  const [highestBid] = useState(2100000)

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
    <>
      <div className='flex flex-row items-center gap-2'>
        <h1 className='text-6xl sm:text-5xl font-bold tracking-tight'>
          Auction
        </h1>
      </div>
      <fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4'>
        <legend className='fieldset-legend'>Current Auction</legend>
        <p className='text-sm mb-2'>Highest Bid: {highestBid} $PIN</p>

        <label className='label'>Your Bid</label>
        <input type='number' className='input' value={highestBid * step} />
        <p className='label'>Minimum Bid: {highestBid * step} $PIN</p>

        <label className='label'>Your Link</label>
        <input type='text' className='input' value='https://example.com' />
        <p className='label'>(If you win the auction)</p>

        <button className='btn btn-neutral mt-4'>Submit</button>
      </fieldset>
      <div>
        {typeof balance === 'bigint' && balance > 0 && (
          <p className='text-sm mt-2'>
            Your balance:{' '}
            <span className='font-bold'>{formatBalance(balance)} $PIN</span>
          </p>
        )}
      </div>
    </>
  )
}
