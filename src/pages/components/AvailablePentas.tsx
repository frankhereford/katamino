import React, { useState } from 'react'
import { trpc } from '../../utils/trpc'
import AvailableBlock from './AvailableBlock'
import { showSlamEmoji } from '../../utils/slam'
import Router from 'next/router'

export default function AvailablePentas () {
  const [availablePentaPage, setAvailablePentaPage] = useState(0)
  const [availablePentasPerPage] = useState(5)
  const { data: completedPentas } = trpc.penta.getCompleted.useQuery()
  const { data: availablePentaCount } = trpc.availablePenta.count.useQuery()
  const startPentaMutation = trpc.availablePenta.start.useMutation({
    onSuccess: (newPenta) => {
      if (newPenta === false) { return }
      Router.push(`/pentas/${newPenta.id}`).catch(console.error)
    }
  })
  const {
    data: pentas,
    isLoading: pentaQueryLoading
  } =
    trpc.availablePenta.getAll.useQuery({
      page: availablePentaPage,
      perPage: availablePentasPerPage
    })

  // build up the pagination controls
  let pagination = (<></>)
  if (availablePentaCount != null) {
    for (let i = 0; i < Math.ceil(availablePentaCount / availablePentasPerPage); i++) {
      const classes = ['btn', 'btn-sm']
      if (i === availablePentaPage) {
        classes.push('btn-secondary')
      }
      pagination = (
        <>
          {pagination}
          <button className={classes.join(' ')} onClick={() => setAvailablePentaPage(i)}>{i + 1}</button>
        </>
      )
    }
  }

  function startPenta (event: React.SyntheticEvent<HTMLButtonElement>) {
    if (event.currentTarget.dataset.availablePenta == null) { return }
    startPentaMutation.mutate({
      id: event.currentTarget.dataset.availablePenta
    })
  }

  return (
    <>
      {!pentaQueryLoading &&
        <>
          <div className='text-center font-sans text-4xl font-bold leading-normal text-gray-700 tracking-wide mt-[50px]'>
            Available Pentas
          </div>
          <div className="outline outline-secondary outline-1 rounded-md m-auto w-fit">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th className="text-center">️🔥</th>
                  <th className="text-center">️Start</th>
                  <th className="text-center">Slam</th>
                  <th className="text-center">Group</th>
                  <th>Pieces</th>
                </tr>
              </thead>
              <tbody>
                {pentas?.map((penta) => (
                  <tr key={penta?.id} className="hover">
                    <td className="text-2xl text-center">{completedPentas?.includes(penta.id) ?? false ? '🔥' : ''}</td>
                    <td className="text-center">
                      <button onClick={startPenta} data-available-penta={penta.id} className="btn btn-secondary btn-circle">️🎮</button>
                    </td>
                    <td className="text-center text-4xl">{showSlamEmoji(penta.slam.name)}</td>
                    <td className="text-center text-2xl">{penta.rowName}</td>
                    <td>
                      <div className="flex flex-wrap">
                        { penta.availableBlocks.map((block) => {
                          return (
                            <AvailableBlock key={block.id} size={8} block={block}></AvailableBlock>
                          )
                        }
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mb-1 p-1">
              <div className="btn-group">
                {pagination}
              </div>
            </div>
          </div>
        </>
      }
    </>
  )
}
