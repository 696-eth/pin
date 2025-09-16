import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'

export const projectId = process.env.NEXT_PUBLIC_REOWN_ID
export const websiteURL = process.env.NEXT_PUBLIC_WEBSITE_URL
export const pinAddress = process.env.NEXT_PUBLIC_PIN_ADDRESS as `0x${string}`
export const auctionAddress = process.env
  .NEXT_PUBLIC_AUCTION_ADDRESS as `0x${string}`
export const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID

if (!projectId || !websiteURL) {
  throw new Error('Project ID or Website URL not defined.')
}

if (!pinAddress || !auctionAddress) {
  throw new Error('$Pin or Auction address not defined.')
}

if (!alchemyId) {
  throw new Error('$Alchemy ID is not defined.')
}

export const networks = [base]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig

const metadata = {
  name: '$PIN',
  description: 'Get your memes, ads or projects seen by thousands.',
  url: websiteURL as string,
  icons: []
}

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [base],
  defaultNetwork: base,
  metadata: metadata,
  themeMode: 'dark',
  features: {
    analytics: false
  }
})

export function convertBigIntToString(obj: unknown): unknown {
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

export function formatWeiToEth(balance: bigint) {
  if (!balance) return '0'
  try {
    const decimals = 18
    const divisor = BigInt('10') ** BigInt(decimals)
    const whole = balance / divisor
    return whole.toString()
  } catch {
    return balance.toString()
  }
}

export function convertNumberToWei(amount: number): bigint {
  const decimals = 18
  const divisor = BigInt('10') ** BigInt(decimals)
  return BigInt(amount) * divisor
}

export function formatNumber(n: number) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}
