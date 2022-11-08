import React from 'react'
import Link from 'next/link'
//import Image from 'next/image'
import { signIn, signOut, useSession } from "next-auth/react";

export default function NavBar() {
  const { data: sessionData } = useSession();
  //console.log(sessionData)
  return (
    <>
      <div className="navbar bg-primary rounded-b-md mb-2">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">Katamino</Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal p-0">
            <li><Link href="/pentas">Pentas</Link></li>
          </ul>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={sessionData?.user?.image || ""} />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>

  );
}