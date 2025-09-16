import { useEffect, useState } from 'react'
import { useReadContracts, useWriteContract, useBlock, useEnsName } from 'wagmi'

import CountdownTimer from './countdown-timer'
import {
  auctionAddress,
  convertBigIntToString,
  formatWeiToEth,
  convertNumberToWei,
  formatNumber
} from '@/config'
import { auctionAbi } from '@/abi/auction'

export default function Auction(props: { allowance: number; balance: number }) {
  const { data: block } = useBlock()

  const {
    data: bidHash,
    isPending: bidPending,
    writeContract: writeBidContract
  } = useWriteContract()

  const auctionContract = {
    address: auctionAddress,
    abi: auctionAbi
  } as const

  const { data, refetch } = useReadContracts({
    contracts: [
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
        functionName: 'currentBidder'
      },
      {
        ...auctionContract,
        functionName: 'currentString'
      },
      {
        ...auctionContract,
        functionName: 'finalCooldown'
      }
    ]
  })

  const [
    auctionInProgressData,
    auctionTimeData,
    auctionTimestampStartedData,
    minBidIncrementData,
    startPriceData,
    currentPriceData,
    currentBidderData,
    currentStringData,
    finalCooldownData
  ] = data || []

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
  const currentBidder =
    currentBidderData?.status === 'success'
      ? currentBidderData.result
      : '0x0000000000000000000000000000000000000000'
  const currentString =
    currentStringData?.status === 'success'
      ? (currentStringData.result as string)
      : ''
  const finalCooldownMinutes =
    finalCooldownData?.status === 'success'
      ? (convertBigIntToString(finalCooldownData.result) as number) / 60
      : undefined

  const { data: ensName } = useEnsName({
    address: currentBidder as `0x${string}`
  })
  const shortenAddress = (addy: string) =>
    `${addy.slice(0, 6)}...${addy.slice(-4)}`
  const bidderAddress =
    ensName || (currentBidder && shortenAddress(currentBidder as string))

  const minBid =
    minBidIncrement !== undefined &&
    currentPrice !== undefined &&
    startPrice !== undefined
      ? startPrice === currentPrice &&
        currentBidder === '0x0000000000000000000000000000000000000000'
        ? currentPrice
        : currentPrice * ((100 + parseInt(minBidIncrement.toString())) / 100)
      : 0

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

  useEffect(() => {
    if (bidHash) {
      refetch()
    }
  }, [bidHash, refetch])

  const [bid, setBid] = useState(minBid)
  const [link, setLink] = useState('')
  const [error, setError] = useState('')

  function updateBid(event: React.ChangeEvent<HTMLInputElement>) {
    const newBid = Number(event.target.value)
    if (minBid !== undefined) {
      if (newBid < minBid) {
        setError(`Bid must be at least ${formatNumber(minBid)} $PIN`)
      } else if (newBid > props.balance) {
        setError(
          `Insufficient balance. You have ${formatNumber(props.balance)} $PIN`
        )
      } else if (newBid > props.allowance) {
        setError(
          `Insufficient allowance. You've allowed ${formatNumber(
            props.allowance
          )} $PIN`
        )
      } else {
        setError('')
        setBid(newBid)
      }
    }
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

  return (
    <div className='flex flex-col items-center'>
      {!auctionInProgress || timeLeft < 1 ? (
        <>
          <h2 className='text-4xl'>No Auction In Progress</h2>
          <p>Please check back soon for the next auction.</p>
        </>
      ) : (
        <>
          <div className='flex flex-row items-center gap-2'>
            <h1 className='text-6xl sm:text-5xl font-bold tracking-tight'>
              Current Auction
            </h1>
          </div>
          {error && <p className='text-red-500'>{error}</p>}
          {currentBidder !== '0x0000000000000000000000000000000000000000' &&
            currentPrice && (
              <>
                <p className='text-xl text-accent'>
                  Highest Bid: {formatNumber(currentPrice)} $PIN
                </p>
                <p>{currentString}</p>
                <p>Bidder: {bidderAddress as string}</p>
              </>
            )}
          <fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 my-4'>
            <label className='label'>Your Bid</label>
            <input
              type='number'
              className='input'
              defaultValue={bid}
              onChange={updateBid}
            />
            <p className='label'>Minimum Bid: {formatNumber(minBid)} $PIN</p>

            <label className='label'>Your Message or Link</label>
            <input
              type='text'
              className='input'
              placeholder='https://example.com'
              defaultValue={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <p className='label'>(If you win the auction)</p>

            {minBid !== undefined && minBid > props.balance ? (
              <p>
                Insufficient balance. You have {formatNumber(props.balance)}{' '}
                $PIN
              </p>
            ) : minBid !== undefined && minBid > props.allowance ? (
              <p>
                Insufficient allowance. You allowed{' '}
                {formatNumber(props.allowance)} $PIN
              </p>
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
            <CountdownTimer timeLeft={timeLeft} />
            <p>
              (Bids placed in the last {finalCooldownMinutes} minutes will
              extend the auction by {finalCooldownMinutes} minutes.)
            </p>
          </fieldset>
        </>
      )}
    </div>
  )
}
