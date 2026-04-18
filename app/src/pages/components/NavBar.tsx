import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'

export default function NavBar () {
  const { data: sessionData } = useSession()

  return (
    <>
      <div className="navbar bg-primary rounded-b-md mb-2">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">Katamino</Link>
        </div>
        <div className="flex-none gap-2">
          {sessionData != null &&
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <Image width={45} height={45} alt="user profile" src={sessionData?.user?.image ?? ''} />
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                <li className='text-center'>👋 {sessionData?.user?.name}</li>
                <li>
                  <button onClick={() => { void signOut() }} className="btn btn-sm btn-primary align-middle" style={ { lineHeight: '.85rem' } }>Sign Out</button>
                </li>
              </ul>
            </div>
          }
        </div>
      </div>
    </>

  )
}
