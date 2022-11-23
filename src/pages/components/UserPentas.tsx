
import React, { useEffect, useState } from 'react'
import { trpc } from '../../utils/trpc'
import Block from './Block'
import Penta from './Penta'
import { showSlamEmoji } from '../../utils/slam'

export default function UserPentas () {
  const [pentaPage, setPentaPage] = useState(0)
  const [pentasPerPage] = useState(5)

  const { data: pentaCount } = trpc.penta.count.useQuery()
  const { data: pentas, isLoading: pentaQueryLoading } = trpc.penta.getAll.useQuery({
    page: pentaPage,
    perPage: pentasPerPage
  })

  const [hidePagination, setHidePagination] = useState(true)
  useEffect(() => {
    if (pentaCount == null) { return }
    if (pentaCount > pentasPerPage) {
      setHidePagination(false)
    }
  }, [pentaCount, pentasPerPage])

  // build up the pagination controls
  let pagination = (<></>)
  if (pentaCount != null) {
    for (let i = 0; i < Math.ceil(pentaCount / pentasPerPage); i++) {
      const classes = ['btn', 'btn-sm']
      if (i === pentaPage) {
        classes.push('btn-primary')
      }
      pagination = (
        <>
          {pagination}
          <button className={classes.join(' ')} onClick={() => setPentaPage(i)}>{i + 1}</button>
        </>
      )
    }
  }

  return (
    <>
      {!pentaQueryLoading &&
        <>
          <div className='text-center font-sans text-4xl font-bold leading-normal text-gray-700 tracking-wide mt-[50px]'>
            Your Pentas
          </div>
          <div className="outline outline-primary outline-1 rounded-md m-auto w-fit">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th className="text-center">️🔥</th>
                  <th className="text-center">️Start</th>
                  <th className="text-center">Slam</th>
                  <th className="text-center">Group</th>
                  <th>Pieces</th>
                  <th>Penta</th>
                </tr>
              </thead>
              <tbody>
                {pentas?.map((penta) => (
                  <tr key={penta?.id} className="hover">
                    <td className="text-center">
                      {penta.completed && <span className="text-primary text-2xl">️🔥</span>}
                    </td>
                    <td className="text-center">
                      <a href={'pentas/' + penta.id} role="button" className="btn btn-primary btn-circle">🕹️</a>
                    </td>
                    <td className="text-4xl text-center">
                      {showSlamEmoji(penta.availablePenta.slam.name)}
                    </td>
                    <td className="text-2xl text-center">
                      {penta.availablePenta.rowName}
                    </td>
                    <td>
                      <div className="flex flex-wrap">
                        {penta.blocks.map((block) => {
                          return (
                            <Block key={block.id} size={8} block={block} hideVisibilityIndicator={true}></Block>
                          )
                        })}
                      </div>
                    </td>
                    <td>
                      <div className='outline outline-1 outline-slate-400 bg-slate-100 w-fit p-1'>
                        <Penta penta={penta} size={12} noBorder={true}></Penta>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          {!hidePagination &&
              <div className="text-right m-1 p-1">
                <div className="btn-group">
                  {pagination}
                </div>
              </div>
            }
          </div>
        </>
      }
    </>
  )
}
