import { useState, useEffect } from 'react'
import { type NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import { AiOutlineArrowDown } from 'react-icons/ai'
import HeaderContent from './components/HeaderContent'
import Penta from './components/Penta'
import { useRouter } from 'next/router'
import { trpc } from '../utils/trpc'
import { type Prisma } from '@prisma/client'
import { useInterval } from 'usehooks-ts'
import _ from 'lodash'

const Home: NextPage = () => {
  const { data: sessionData } = useSession()
  const nextRouter = useRouter()
  useEffect(() => {
    if (sessionData != null) {
      nextRouter.push('/pentas')
        .catch((err) => console.log(err))
    }
  }, [nextRouter, sessionData])

  const { data: replay, refetch: replayRefetch } = trpc.penta.getRandomHistory.useQuery()

  const [showReplay, setShowReplay] = useState(false)

  const [replayIndex, setReplayIndex] = useState(0)
  const [delay] = useState(200)
  const [isPlaying, setIsPlaying] = useState(false)

  const [penta, setPenta] = useState<Prisma.PentaGetPayload<{
    include: {
      blocks: {
        include: {
          piece: {
            include: {
              color: true
            }
          }
          transformation: true
        }
      }
    }
  }>>()

  useInterval(
    () => {
      // Your custom logic here
      if (replay == null) return
      if (replay.history == null) return
      if (replayIndex === replay.history.moves.length) {
        // * this should never really be called under valid data, it's trapped in the
        // * `nextDemoPenta()` function below called back up by the <Penta> component
        setIsPlaying(false)
      } else {
        console.log('replayIndex: ', replayIndex)
        const move = replay.history.moves[replayIndex]
        const localPenta = _.cloneDeep(penta)
        if (localPenta == null) return
        const blockIndex = localPenta?.blocks.findIndex((workingBlock) => workingBlock.id === move?.blockId)
        if (move?.outgoingTransformation == null) return
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        localPenta.blocks[blockIndex]!.transformation = move?.outgoingTransformation
        setPenta(localPenta)
        setReplayIndex(replayIndex + 1)
      }
    },
    // Delay in milliseconds or null to stop it
    isPlaying ? delay : null
  )

  useEffect(() => {
    if (replay != null) {
      setPenta(replay.penta)
    }
    const localPenta = _.cloneDeep(replay?.penta)
    localPenta?.blocks.forEach((block) => {
      block.transformation = {
        rotation: 0,
        reflection: false,
        translationRight: 0,
        translationUp: 0,
        visible: false,
        id: block.transformation.id,
        createdAt: block.transformation.createdAt
      }
      setPenta(localPenta)
    })
    setReplayIndex(0)
    setIsPlaying(true)
    setShowReplay(true)
  }, [replay])

  function nextDemoPenta () {
    console.log('stopping on done')
    setIsPlaying(false)
    // ! 💀 how do you get this promise out into a void returning function?
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(replayRefetch, 1000)
  }

  return (
    <>
      <HeaderContent />
      <main className='container mx-auto flex flex-col items-center p-4'>

        <div className='grid grid-cols-3 gap-5'>
          <div className='col-span-3 mb-[50px] mt-[25px]'>
            <h1 className='text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem] text-center'>
              <span className='text-primary'>K</span>atamino
            </h1>
          </div>
          <div className='col-span-2'>
            <div className='text-center text-4xl mb-5 text-slate-400 tracking-wide'>
              You fit pieces together..
            </div>
            <div>
              {(penta != null) && showReplay && (
                <Penta size={35} penta={penta} completed={nextDemoPenta}></Penta>
              )}
            </div>
            <div className='text-center text-4xl mt-5 text-slate-400 tracking-wide'>
              ..and you fill the board.
            </div>
          </div>
          <div className='col-span-1 relative top-[-50px]'>
            <div className='grid grid-cols-2 gap-3 w-[250px] mt-[100px]'>
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
