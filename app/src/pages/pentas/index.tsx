import { useEffect } from 'react'
import { type NextPage } from 'next'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import HeaderContent from '../components/HeaderContent'
import UserPentas from '../components/UserPentas'
import AvailablePentas from '../components/AvailablePentas'

const Pentas: NextPage = () => {
  const { status: sessionStatus } = useSession()
  const nextRouter = useRouter()
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      nextRouter.push('/')
        .catch((err) => console.error(err))
    }
  }, [nextRouter, sessionStatus])

  return (
    <>
      <HeaderContent />
      <main>
        <UserPentas></UserPentas>
        <AvailablePentas></AvailablePentas>
      </main>
    </>
  )
}

export default Pentas
