'use client'

import { useState, useEffect } from 'react'
import { useReadContracts, useWriteContract, useBlock } from 'wagmi'
import { useAppKitAccount } from '@reown/appkit/react'
import { pinAbi } from '@/abi/pin'
import { auctionAbi } from '@/abi/auction'
import { maxUint256 } from 'viem'
import { BsCheckCircleFill, BsFillDashCircleFill } from 'react-icons/bs'
import Countdown from 'react-countdown'

const pinAddress = '0x0e6dd7ec79912374e4567ed76f8512a8e2343b07'
const auctionAddress = '0x198ff24556f2c2adD89DC1Cb516eb695dFF7b98f'

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

  const { data: block } = useBlock()

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

  function convertNumberToWei(amount: number): bigint {
    const decimals = 18
    const divisor = BigInt('10') ** BigInt(decimals)
    return BigInt(amount) * divisor
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
      : 0
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
  const finalCooldownMinutes =
    finalCooldownData?.status === 'success'
      ? (convertBigIntToString(finalCooldownData.result) as number) / 60
      : undefined

  const minBid =
    minBidIncrement !== undefined &&
    currentPrice !== undefined &&
    startPrice !== undefined
      ? startPrice !== currentPrice
        ? currentPrice * ((100 + parseInt(minBidIncrement.toString())) / 100)
        : currentPrice
      : undefined

  const timeLeft =
    auctionTime !== undefined &&
    block !== undefined &&
    auctionTimestampStarted !== undefined
      ? Number(block.timestamp) <
        Number(auctionTimestampStarted) + Number(auctionTime)
        ? Number(auctionTimestampStarted) +
          Number(auctionTime) -
          Number(block.timestamp)
        : 0
      : 0

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
    if (bid !== undefined) {
      const bidInWei = convertBigIntToString(convertNumberToWei(bid))
      writeBidContract({
        ...auctionContract,
        functionName: 'bid',
        args: [bidInWei, link]
      })
    }
  }

  useEffect(() => {
    if (allowanceHash || bidHash) {
      refetch()
    }
  }, [allowanceHash, bidHash, refetch])

  const CountdownCompletion = () => <p>Auction has completed!</p>

  const countdownRenderer = ({
    hours,
    minutes,
    seconds,
    completed
  }: {
    hours: number
    minutes: number
    seconds: number
    completed: boolean
  }) => {
    if (completed) {
      return <CountdownCompletion />
    } else {
      return (
        // <p className=''>
        //   Time Left: {hours}:{minutes}:{seconds}
        // </p>
        <div className='grid grid-flow-col gap-4 text-center auto-cols-max'>
          <div className='flex flex-col p-2 bg-neutral rounded-box text-neutral-content'>
            <span className='countdown font-mono text-5xl'>
              <span
                style={{ '--value': hours } as React.CSSProperties}
                aria-live='polite'
                aria-label={'counter'}
              >
                {hours}
              </span>
            </span>
            hours
          </div>
          <div className='flex flex-col p-2 bg-neutral rounded-box text-neutral-content'>
            <span className='countdown font-mono text-5xl'>
              <span
                style={{ '--value': minutes } as React.CSSProperties}
                aria-live='polite'
                aria-label={'counter'}
              >
                {minutes}
              </span>
            </span>
            min
          </div>
          <div className='flex flex-col p-2 bg-neutral rounded-box text-neutral-content'>
            <span className='countdown font-mono text-5xl'>
              <span
                style={{ '--value': seconds } as React.CSSProperties}
                aria-live='polite'
                aria-label={'counter'}
              >
                {seconds}
              </span>
            </span>
            sec
          </div>
        </div>
      )
    }
  }

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
      {auctionInProgress && timeLeft > 0 ? (
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

          <label className='label'>Your Message or Link</label>
          <input
            type='text'
            className='input'
            placeholder='https://example.com'
            defaultValue={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <p className='label'>(If you win the auction)</p>

          {minBid !== undefined && minBid > balance ? (
            <p>Insufficient balance. You have {balance} $PIN</p>
          ) : minBid !== undefined && minBid > allowance ? (
            <p>Insufficient allowance. You allowed {allowance} $PIN</p>
          ) : link === '' ? (
            <p>Please enter a message or link.</p>
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
          <Countdown
            date={Date.now() + timeLeft * 1000}
            renderer={countdownRenderer}
          />
          <p>
            (Bids placed in the last {finalCooldownMinutes} minutes will extend
            the auction by {finalCooldownMinutes} minutes.)
          </p>
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
