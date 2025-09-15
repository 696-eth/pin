// import { createPublicClient, http, parseEventLogs, type AbiEvent } from 'viem'
// import { base } from 'viem/chains'
// import { useWatchContractEvent } from 'wagmi'
// import { auctionAbi } from '@/abi/auction'

// const auctionAddress = process.env.NEXT_PUBLIC_AUCTION_ADDRESS
// const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY
// const alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`

export default function Bids() {
  // try {
  //   const client = createPublicClient({
  //     chain: base,
  //     transport: http()
  //   })
  // } catch (err) {
  //   console.error('Error creating public client:', err)
  // }

  // async function getPastEvents() {
  //   const bidPlacedEvent = auctionAbi.find(
  //     (e) =>
  //       (e as { type?: string; name?: string }).type === 'event' &&
  //       (e as { name?: string }).name === 'BidPlaced'
  //   ) as AbiEvent | undefined
  //   if (!bidPlacedEvent) {
  //     throw new Error('BidPlaced event not found in ABI')
  //   }
  //   const auctionLogs = await client.getLogs({
  //     address: auctionAddress as `0x${string}`,
  //     event: bidPlacedEvent,
  //     fromBlock: BigInt(34383680),
  //     toBlock: 'latest'
  //   })
  //   const parsedLogs = parseEventLogs({ abi: auctionAbi, logs: auctionLogs })
  //   return parsedLogs
  // }
  // const logs = getPastEvents()
  // console.log(logs)

  // useWatchContractEvent({
  //   address: auctionAddress as `0x${string}`,
  //   abi: auctionAbi,
  //   eventName: 'BidPlaced',
  //   onLogs(logs) {
  //     console.log('BidPlaced event:', logs)
  //   }
  // })

  return (
    <div>
      <h1>Bids</h1>
    </div>
  )
}
