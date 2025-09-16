'use client'

import { useState } from 'react'
import Allowance from '@/components/allowance'
import Auction from '@/components/auction'
import FeaturedWinner from '@/components/featured-winner'
// import Bids from '@/components/bids'

export default function Page() {
  const [allowance, setAllowance] = useState(0)
  const [balance, setBalance] = useState(0)

  function updateAllowance({
    allowance,
    balance
  }: {
    allowance: number
    balance: number
  }) {
    setAllowance(allowance)
    setBalance(balance)
  }

  return (
    <div className='flex flex-col items-center pb-16'>
      <FeaturedWinner />
      <Allowance onChange={updateAllowance} />
      <div className='flex flex-row gap-8'>
        <Auction balance={balance} allowance={allowance} />
        {/* <Bids /> */}
      </div>
    </div>
  )
}
