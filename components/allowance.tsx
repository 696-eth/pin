import { useEffect } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { useReadContracts, useWriteContract, useSimulateContract } from 'wagmi'
import { maxUint256 } from 'viem'
import {
  pinAddress,
  auctionAddress,
  formatWeiToEth,
  formatNumber
} from '@/config'
import { pinAbi } from '@/abi/pin'

export default function Allowance({
  onChange
}: {
  onChange: ({
    allowance,
    balance
  }: {
    allowance: number
    balance: number
  }) => void
}) {
  const account = useAppKitAccount()

  const {
    data: allowanceHash,
    isPending: allowanceIsPending,
    writeContract: writeAllowanceContract
  } = useWriteContract()

  const { data: simulation, error: simulationError } = useSimulateContract({
    address: pinAddress,
    abi: pinAbi,
    functionName: 'approve',
    args: [auctionAddress, maxUint256]
  })

  function getInt(n: bigint) {
    return parseInt(formatWeiToEth(n))
  }

  const { data, refetch } = useReadContracts({
    contracts: [
      {
        address: pinAddress,
        abi: pinAbi,
        functionName: 'balanceOf',
        args: [account?.address]
      },
      {
        address: pinAddress,
        abi: pinAbi,
        functionName: 'allowance',
        args: [account?.address, auctionAddress]
      }
    ]
  })

  const [balanceData, allowanceData] = data ?? []
  const balance =
    balanceData?.status === 'success' ? getInt(balanceData.result as bigint) : 0
  const allowance =
    allowanceData?.status === 'success'
      ? getInt(allowanceData.result as bigint)
      : 0

  const unlimitedInt = getInt(maxUint256)

  function handleAllowance() {
    if (simulation) {
      writeAllowanceContract({
        address: pinAddress,
        abi: pinAbi,
        functionName: 'approve',
        args: [auctionAddress, maxUint256]
      })
    } else if (simulationError) {
      console.error(simulationError.message)
    } else {
      console.warn('Simulation not ready')
    }
  }

  useEffect(() => {
    if (allowanceHash && !allowanceIsPending) {
      refetch()
    }
  }, [allowanceIsPending, allowanceHash, refetch])

  useEffect(() => {
    onChange({ allowance, balance })
  }, [allowance, balance, onChange])

  return (
    <>
      <div className='max-w-sm flex flex-col items-center gap-4'>
        <p className='text-xl font-bold'>
          Balance: {formatNumber(balance)} $PIN
          <br />
          Spending Limit:{' '}
          {allowance === unlimitedInt
            ? 'Unlimited'
            : formatNumber(allowance)}{' '}
          $PIN
        </p>

        <button onClick={handleAllowance} className='btn btn-primary'>
          Update Spending Limit
        </button>
        <p className='text-sm text-accent text-center'>
          Your spending limit defaults to unlimited, but you may edit the amount
          to your desired amount of allowance from your wallet popup.
        </p>
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
      </div>
      <hr className='my-4 h-px bg-gray-500 border-0 w-md' />
    </>
  )
}
