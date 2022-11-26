/* eslint-disable @next/next/no-img-element */
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

        <div className='grid grid-cols-3 gap-5'>
          <div className='col-span-12 mb-[50px] mt-[25px]'>
            <h1 className='text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem] text-center'>
              <span className='text-primary'>K</span>atamino
            </h1>
          </div>
          <div className='col-span-2'>
            <img src='https://via.placeholder.com/450x150' alt='placeholder' />
          </div>
          <div className='col-span-1 relative top-[-50px]'>
            <div className='grid grid-cols-2 gap-3 w-[250px]'>
                <button onClick={() => { void signIn('auth0') }} className='btn btn-primary btn-md drop-shadow-lg w-fit m-auto relative top-[40px]'>
                  Auth0
                </button>
              <div className='text-center'>
                <div className='relative left-[20px] bottom-[-10px] animate-bounce'>
                  <AiOutlineArrowDown size={80} style={{ color: '#dddddd' }} />
                </div>
                <button onClick={() => { void signIn('github') }} className='btn btn-primary btn-md drop-shadow-lg w-fit m-auto'>
                  GitHub
                </button>
              </div>
              <div className='col-span-2 text-center text-[2.5rem] text-gray-400 relative left-[40px] top-[-7px]'>
                <span className='text-primary font-extrabold drop-shadow-lg'>L</span>ogin
              </div>
              <div className='col-span-2 text-[8rem] rotate-[87deg] text-primary relative left-[17px] top-[20px]'>
                )
              </div>
            </div>
          </div>
      </div>

      </main>
    </>
  )
}

export default Home
