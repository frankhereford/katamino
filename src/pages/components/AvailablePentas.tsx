import React, { useState } from 'react'
import { trpc } from '../../utils/trpc'

/* eslint-disable no-multi-spaces, @typescript-eslint/brace-style, space-in-parens */
function showSlamEmoji (slam: string) {
  if      (slam === 'Small Slam'       ) { return '🦎' }
  else if (slam === 'The Slam'         ) { return '🐊' }
  else if (slam === 'The Ultimate Slam') { return '🐉' }
  else if (slam === 'The Full Board'   ) { return '🦕' }
  return slam
}
/* eslint-enable no-multi-spaces, @typescript-eslint/brace-style, space-in-parens */

export default function AvailablePentas () {
  const [availablePentaPage, setAvailablePentaPage] = useState(0)
  const [availablePentasPerPage] = useState(5)
  const { data: completedPentas } = trpc.penta.getCompleted.useQuery()
  const { data: availablePentaCount } = trpc.availablePenta.count.useQuery();
  const {
    data: pentas,
    isLoading: pentaQueryLoading
  } =
    trpc.availablePenta.getAll.useQuery({
      page: availablePentaPage,
      perPage: availablePentasPerPage
    })

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

  return (
    <>
      {!pentaQueryLoading &&
        <>
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
                    <button data-id={penta.id} className="btn btn-secondary btn-circle">️🎮</button>
                  </td>
                  <td className="text-center text-4xl">{showSlamEmoji(penta.slam.name)}</td>
                  <td className="text-center text-2xl">{penta.rowName}</td>
                  <td>
                    <div className="flex flex-wrap">
                      { penta.availableBlocks.map((block) => {
                        return (
                          <div key={block.id} className="m-1 w-10 h-10 bg-red-500">
                          </div>
                        )
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-left mb-1">
            <div className="btn-group">
              {pagination}
            </div>
          </div>
        </>
      }
    </>
  )
}
