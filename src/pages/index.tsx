import { type NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/react'

import HeaderContent from "./components/HeaderContent";

import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: 'from tRPC' })

  return (
    <>
      <HeaderContent />
      <main className="container mx-auto flex flex-col items-center p-4">

        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem] ">
          <span className="text-primary">K</span>atamino
        </h1>

        <div className="relative left-[75px] bottom-[-10px] animate-bounce mt-[40px]">
          <AiOutlineArrowDown size={170} style={{ color: "#dddddd" }} />
        </div>


        <div className="grid grid-cols-2 gap-10 mb-2">
          <button onClick={() => signIn(auth0.id)} className="btn btn-primary btn-lg drop-shadow-lg">
            Auth0
          </button>
          <button onClick={() => signIn(github.id)} className="btn btn-primary btn-lg drop-shadow-lg">
            GitHub
          </button>
        </div>

        <h1 className="ml-[175px] text-[5rem] leading-normal text-gray-400">
          <span className="text-primary font-extrabold drop-shadow-lg">L</span>ogin
        </h1>

        <div className="relative top-[-140px] left-[30px] text-primary text-[250px] rotate-90 drop-shadow-lg">
          )
        </div>

      </main>
    </>
  )
}

export default Home

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession()

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  )

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <p className='text-center text-2xl text-white'>
        {(sessionData != null) && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20'
        onClick={(sessionData != null) ? async () => await signOut() : async () => await signIn()}
      >
        {(sessionData != null) ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  )
}
