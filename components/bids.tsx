// import { useEffect } from 'react'
// import { useWatchContractEvent, useReadContract } from 'wagmi'
// import { Alchemy, Network, Utils } from 'alchemy-sdk'
// import { auctionAbi } from '@/abi/auction'
// import { alchemyId, auctionAddress, convertBigIntToString } from '@/config'

// const alchemyUrl = `https://base-mainnet.g.alchemy.com/v2/${alchemyId}`
// const alchemy = new Alchemy({
//   apiKey: alchemyId,
//   network: Network.BASE_MAINNET,
//   url: alchemyUrl
// })
// const bidEventSignature = Utils.id('BidPlaced(uint256,address,uint256)')

export default function Bids() {
  // const { data: auctionIdData } = useReadContract({
  //   address: auctionAddress,
  //   abi: auctionAbi,
  //   functionName: 'auctionID'
  // })
  // const auctionId = convertBigIntToString(auctionIdData) as number
  // console.log('Auction ID:', auctionId)

  // useEffect(() => {
  //   async function getLogs() {
  //     try {
  //       const logs = await alchemy.core.getLogs({
  //         address: auctionAddress as `0x${string}`,
  //         fromBlock: 35261552,
  //         toBlock: 'latest',
  //         topics: [bidEventSignature]
  //       })
  //       console.log('Logs:', logs)
  //     } catch (error) {
  //       console.error('Error fetching logs:', error)
  //     }
  //   }
  //   getLogs()
  // }, [])

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
