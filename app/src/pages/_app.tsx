import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

import { trpc } from '../utils/trpc'

import NavBar from './components/NavBar'
import Footer from './components/Footer'

import '../styles/globals.css'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  return (
    <SessionProvider session={session}>
      <div className='flex flex-col h-screen'>
        <NavBar></NavBar>
        <div className='flex-grow'>
          <Component {...pageProps} />
        </div>
        <Footer></Footer>
      </div>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
