import FeaturedLink from './featured-link'

import { useReadContract, useEnsName } from 'wagmi'
import { auctionAddress, formatWeiToEth, formatNumber } from '@/config'
import { auctionAbi } from '@/abi/auction'

export default function FeaturedWinner() {
  const { data } = useReadContract({
    address: auctionAddress,
    abi: auctionAbi,
    functionName: 'getLastAuctionDetails'
  })

  const [address, message, amountWei] = Array.isArray(data) ? data : []
  const amount = parseInt(formatWeiToEth(amountWei as bigint))
  const { data: ensName } = useEnsName({ address })
  const shortenAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`
  const displayAddress = ensName || (address && shortenAddress(address))

  function isValidHttpUrl(str: string) {
    let url

    try {
      url = new URL(str)
    } catch {
      return false
    }

    return url.protocol === 'http:' || url.protocol === 'https:'
  }

  const isLink = message !== '' ? isValidHttpUrl(message) : false

  const invalidAuction =
    address === '0x0000000000000000000000000000000000000000' ||
    amount === 0 ||
    message === ''

  return invalidAuction ? null : (
    <>
      <div className='flex justify-center'>
        <div className='flex flex-col items-center text-center gap-2 max-w-xl'>
          <span className='text-sm text-accent'>
            Get your link or message featured by winning an auction
          </span>
          <h1 className='text-5xl font-bold pt-0'>Featured PIN</h1>
          {isLink ? (
            <FeaturedLink url={message} />
          ) : (
            <span className='text-lg'>{message}</span>
          )}
          <p>
            Winner: {displayAddress}
            <br />
            Amount: {formatNumber(amount)} $PIN
          </p>
        </div>
      </div>
      <hr className='my-4 h-px bg-gray-500 border-0 w-md' />
    </>
  )
}
