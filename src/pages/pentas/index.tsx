import React, { useEffect, useState } from 'react'
import { type NextPage } from "next";
import AvailablePentas from "../components/AvailablePentas";
import UserPentas from "../components/UserPentas";
import RingLoader from "react-spinners/RingLoader";
import type { CSSProperties } from "react";
import HeaderContent from "../components/HeaderContent";

import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

const Pentas: NextPage = () => {
  
  const { status: sessionStatus } = useSession();
  const nextRouter = useRouter();
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      nextRouter.push('/')
    }
  }, [nextRouter, sessionStatus])

  
  const [refreshUserPentas, setRefreshUserPentas] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  useEffect(() => {
    if (!refreshUserPentas) {
      setShowSpinner(false)
    }
  }, [refreshUserPentas])
  
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  
  return (
    <>
      <HeaderContent />
      <main>
        {showSpinner &&
          <div className="absolute right-[30px]">
            <RingLoader
              color={"hsl(var(--pf))"}
              cssOverride={override}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        }
        <div className="grid grid-cols-10 mt-10">
          <div className="col-start-2 col-end-10">
            <UserPentas setRefresh={setRefreshUserPentas} refresh={refreshUserPentas}></UserPentas>
          </div>
        </div>
        <div className="grid grid-cols-10 mt-10">
          <div className="col-start-2 col-end-10">
            <AvailablePentas setShowSpinner={setShowSpinner} setRefresh={setRefreshUserPentas}></AvailablePentas>
          </div>
        </div>
      </main>
    </>
  )
}

export default Pentas