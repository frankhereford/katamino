
import React, { useState } from 'react'
import { trpc } from '../../utils/trpc'

export default function UserPentas () {
  const [pentaPage] = useState(0)
  const [pentasPerPage] = useState(5)

  const { data: pentas } = trpc.penta.getAll.useQuery({
    page: pentaPage,
    perPage: pentasPerPage
  })

  return (
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
              <td className="text-2xl text-center">{ '🔥' }</td>
              <td className="text-center">
                <button data-available-penta={penta.id} className="btn btn-secondary btn-circle">️🎮</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
