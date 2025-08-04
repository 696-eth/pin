import { BsPinAngleFill } from 'react-icons/bs'
import Link from 'next/link'
import ConnectButton from '@/components/connect-button'

export default function Header() {
  return (
    <div className='navbar bg-base-100 shadow-sm'>
      <div className='flex-1'>
        <div className='flex flex-row gap-4 items-center'>
          <BsPinAngleFill className='text-red-700 text-4xl' />
          <Link href='/' className='text-3xl font-semibold'>
            $PIN
          </Link>
        </div>
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-1 flex flex-row items-center gap-2'>
          <li>
            <ConnectButton />
          </li>
        </ul>
      </div>
    </div>
  )
}
