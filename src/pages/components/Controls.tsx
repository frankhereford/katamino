/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link'
import ControlButton from '../components/ControlButton'

// icons
import { BsArrowLeft, BsArrowRight, BsArrowBarDown, BsArrowBarUp, BsArrowBarLeft, BsArrowBarRight, BsPlay } from 'react-icons/bs'
import { TbFlipHorizontal, TbFlipVertical } from 'react-icons/tb'
import { RiFilePaperLine } from 'react-icons/ri'
import { BiHide, BiShow } from 'react-icons/bi'
import { AiOutlineRotateRight } from 'react-icons/ai'
import { ImExit } from 'react-icons/im'
import { MdReplay } from 'react-icons/md'

export default function Controls (props: {
  string: string
}) {
  return (
    <>
      <div className='relative m-auto w-fit h-[100px]'>
        <div className="absolute left-[-270px] top-[8px] drop-shadow-lg">
          <Link href='/pentas' className='btn btn-circle btn-md btn-primary'>
            <ImExit size={20} style={{ color: '#ffffff' }} />
          </Link>
        </div>

        <ControlButton
          position="absolute right-[150px] top-[0px] drop-shadow-lg"
          classes="btn gap-2 m-2 btn-primary text-white"
          clickHandler={() => { console.log('👋') }}
          icon={<BsArrowLeft size={20} style={{ color: '#ffffff' }} />}
          letter="Q"
        ></ControlButton>

      </div>
    </>
  )
}
