'use client'

import { useState, useEffect } from 'react'
import { useReadContracts, useWriteContract } from 'wagmi'
import { useAppKitAccount } from '@reown/appkit/react'
import { pinAbi } from '@/abi/pin'
import { auctionAbi } from '@/abi/auction'
import { maxUint256 } from 'viem'
import { BsCheckCircleFill, BsFillDashCircleFill } from 'react-icons/bs'

const pinAddress = '0x0e6dd7ec79912374e4567ed76f8512a8e2343b07'
const auctionAddress = '0xbc9ddfa732bd7aa57ff5b654c2a9496f286f3c05'

export default function Auction() {
  const account = useAppKitAccount()
  const {
    data: allowanceHash,
    isPending: allowanceIsPending,
    writeContract: writeAllowanceContract
  } = useWriteContract()

  const {
    data: bidHash,
    isPending: bidPending,
    writeContract: writeBidContract
  } = useWriteContract()

  const pinContract = {
    address: pinAddress,
    abi: pinAbi
  } as const

  const auctionContract = {
    address: auctionAddress,
    abi: auctionAbi
  } as const

  const { data, refetch } = useReadContracts({
    contracts: [
      {
        ...pinContract,
        functionName: 'balanceOf',
        args: [account?.address]
      },
      {
        ...pinContract,
        functionName: 'allowance',
        args: [account?.address, auctionAddress]
      },
      {
        ...auctionContract,
        functionName: 'auctionInProgress'
      },
      {
        ...auctionContract,
        functionName: 'auctionTime'
      },
      {
        ...auctionContract,
        functionName: 'auctionTimestampStarted'
      },
      {
        ...auctionContract,
        functionName: 'minBidIncrement'
      },
      {
        ...auctionContract,
        functionName: 'startPrice'
      },
      {
        ...auctionContract,
        functionName: 'currentPrice'
      },
      {
        ...auctionContract,
        functionName: 'finalCooldown'
      }
    ]
  })

  function formatWeiToEth(balance: bigint) {
    if (!balance) return '0'
    try {
      // 18 decimals for ERC20
      const decimals = 18
      const divisor = BigInt('10') ** BigInt(decimals)
      const whole = balance / divisor
      // return whole.toLocaleString()
      return whole.toString()
    } catch {
      return balance.toString()
    }
  }

  // Recursively convert BigInt values to strings for serialization
  function convertBigIntToString(obj: unknown): unknown {
    if (typeof obj === 'bigint') {
      return obj.toString()
    } else if (Array.isArray(obj)) {
      return obj.map(convertBigIntToString)
    } else if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
          k,
          convertBigIntToString(v)
        ])
      )
    }
    return obj
  }

  const [
    balanceData,
    allowanceData,
    auctionInProgressData,
    auctionTimeData,
    auctionTimestampStartedData,
    minBidIncrementData,
    startPriceData,
    currentPriceData,
    finalCooldownData
  ] = data ?? []
  const balance =
    balanceData?.status === 'success'
      ? parseInt(formatWeiToEth(balanceData.result as bigint))
      : 0
  const allowance =
    allowanceData?.status === 'success'
      ? parseInt(formatWeiToEth(allowanceData.result as bigint))
      : 0
  const auctionInProgress =
    auctionInProgressData?.status === 'success'
      ? auctionInProgressData.result
      : false
  const auctionTime =
    auctionTimeData?.status === 'success'
      ? (convertBigIntToString(auctionTimeData.result) as number)
      : '0'
  const auctionTimestampStarted =
    auctionTimestampStartedData?.status === 'success'
      ? (convertBigIntToString(auctionTimestampStartedData.result) as number)
      : undefined
  const minBidIncrement =
    minBidIncrementData?.status === 'success'
      ? (convertBigIntToString(minBidIncrementData.result) as number)
      : undefined
  const startPrice =
    startPriceData?.status === 'success'
      ? parseInt(formatWeiToEth(startPriceData.result as bigint))
      : undefined
  const currentPrice =
    currentPriceData?.status === 'success'
      ? parseInt(formatWeiToEth(currentPriceData.result as bigint))
      : undefined
  const finalCooldown =
    finalCooldownData?.status === 'success'
      ? (convertBigIntToString(finalCooldownData.result) as number)
      : undefined

  const minBid =
    minBidIncrement !== undefined &&
    currentPrice !== undefined &&
    startPrice !== undefined
      ? startPrice !== currentPrice
        ? (currentPrice * (100 + minBidIncrement)) / 100
        : currentPrice
      : undefined

  const [bid, setBid] = useState(minBid)
  const [link, setLink] = useState('')
  const [error, setError] = useState('')

  function updateBid(event: React.ChangeEvent<HTMLInputElement>) {
    const newBid = Number(event.target.value)
    if (minBid !== undefined) {
      if (newBid < minBid) {
        setError(`Bid must be at least ${minBid} $PIN`)
      } else if (newBid > balance) {
        setError(`Insufficient balance. You have ${balance} $PIN`)
      } else if (newBid > allowance) {
        setError(`Insufficient allowance. You've allowed ${allowance} $PIN`)
      } else {
        setError('')
        setBid(newBid)
      }
    }
  }

  function handleAllowance() {
    writeAllowanceContract({
      ...pinContract,
      functionName: 'approve',
      args: [auctionAddress, maxUint256]
    })
  }

  function handleBid() {
    writeBidContract({
      ...auctionContract,
      functionName: 'bid',
      args: [bid, account?.address]
    })
  }

  useEffect(() => {
    if (allowanceHash || bidHash) {
      refetch()
    }
  }, [allowanceHash, bidHash, refetch])

  return (
    <>
      <div className='flex flex-row items-center gap-2'>
        <h1 className='text-6xl sm:text-5xl font-bold tracking-tight'>
          Auction
        </h1>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
      <div className='flex flex-row items-center'>
        <p>$PIN Allowance:</p>
        {allowance == 0 ? (
          <p>
            <BsFillDashCircleFill className='text-red-600 pl-2 text-2xl' />
          </p>
        ) : (
          <p>
            <BsCheckCircleFill className='text-green-600 pl-2 text-2xl' />
          </p>
        )}
      </div>
      {allowance == 0 && (
        <button onClick={handleAllowance} className='btn btn-primary'>
          Approve
        </button>
      )}
      {allowanceIsPending && <p>Waiting for approval...</p>}
      {allowanceHash && (
        <p>
          <a
            href={`https://basescan.org/tx/${allowanceHash}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            View on BaseScan
          </a>
        </p>
      )}
      {auctionInProgress ? (
        <fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4'>
          <p className='text-sm mb-2'>Current Bid: {currentPrice} $PIN</p>

          <label className='label'>Your Bid</label>
          <input
            type='number'
            className='input'
            defaultValue={bid}
            onChange={updateBid}
          />
          <p className='label'>Minimum Bid: {minBid} $PIN</p>

          <label className='label'>Your Link</label>
          <input
            type='text'
            className='input'
            placeholder='https://example.com'
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <p className='label'>(If you win the auction)</p>

          {minBid !== undefined && minBid > balance ? (
            <p>Insufficient balance. You have {balance} $PIN</p>
          ) : minBid !== undefined && minBid > allowance ? (
            <p>Insufficient allowance. You allowed {allowance} $PIN</p>
          ) : (
            <button
              type='submit'
              className='btn btn-neutral mt-4'
              disabled={minBid === undefined}
              onClick={handleBid}
            >
              Submit
            </button>
          )}
          {bidPending && <p>Waiting for bid...</p>}
          {auctionTimestampStarted !== undefined && (
            <p>Auction has started at {auctionTimestampStarted}</p>
          )}
          {auctionTime !== undefined && <p>Auction time: {auctionTime}</p>}
          {finalCooldown !== undefined && (
            <p>Final cooldown: {finalCooldown}</p>
          )}
        </fieldset>
      ) : (
        <>
          <h2 className='text-4xl'>No Auction In Progress</h2>
          <p>Please check back later for new auctions.</p>
        </>
      )}
    </>
  )
}
