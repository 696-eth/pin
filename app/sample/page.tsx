'use client'

import { useState } from 'react'
import Allowance from '@/components/allowance'
import Auction from '@/components/auction'
import FeaturedWinner from '@/components/featured-winner'

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
    <div className='flex flex-col items-center gap-8 pb-16'>
      <FeaturedWinner />
      <Allowance onChange={updateAllowance} />
      <Auction balance={balance} allowance={allowance} />
    </div>
  )
}
