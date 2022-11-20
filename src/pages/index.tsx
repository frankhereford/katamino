import { type NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { AiOutlineArrowDown } from 'react-icons/ai'
import HeaderContent from './components/HeaderContent'

const Home: NextPage = () => {
  return (
    <>
      <HeaderContent />
      <main className='container mx-auto flex flex-col items-center p-4'>

        <h1 className='text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem] '>
          <span className='text-primary'>K</span>atamino
        </h1>

        <div className='relative left-[75px] bottom-[-10px] animate-bounce mt-[40px]'>
          <AiOutlineArrowDown size={170} style={{ color: '#dddddd' }} />
        </div>

        <div className='grid grid-cols-2 gap-10 mb-2'>
          <button onClick={() => { void signIn('auth0') }} className='btn btn-primary btn-lg drop-shadow-lg'>
            Auth0
          </button>
          <button onClick={() => { void signIn('github') }} className='btn btn-primary btn-lg drop-shadow-lg'>
            GitHub
          </button>
        </div>

        <h1 className='ml-[175px] text-[5rem] leading-normal text-gray-400'>
          <span className='text-primary font-extrabold drop-shadow-lg'>L</span>ogin
        </h1>

        <div className='relative top-[-140px] left-[30px] text-primary text-[250px] rotate-90 drop-shadow-lg'>
          )
        </div>

      </main>
    </>
  )
}

export default Home
