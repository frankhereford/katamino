/* eslint-disable no-multiple-empty-lines */
import { useEffect } from 'react'
import { type NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import { AiOutlineArrowDown } from 'react-icons/ai'
import HeaderContent from './components/HeaderContent'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const { data: sessionData } = useSession()
  const nextRouter = useRouter()
  useEffect(() => {
    if (sessionData != null) {
      nextRouter.push('/pentas')
        .catch((err) => console.log(err))
    }
  }, [nextRouter, sessionData])

  return (
    <>
      <HeaderContent />
      <main className='container mx-auto flex flex-col items-center p-4'>



      </main>
    </>
  )
}

export default Home
