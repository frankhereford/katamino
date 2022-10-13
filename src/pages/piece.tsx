import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

import GridBoard from './components/GridBoard'

const Piece: NextPage = () => {
  const pieces = trpc.piece.list.useQuery();  

  const shape = [
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,1,1,1,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
  ]

  return (
    <>
      <Head>
        <title>Edit Pieces</title>
        <meta name="description" content="Create and view pieces" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Color</th>
              <th>Shape</th>
            </tr>
          </thead>
          <tbody>
            {pieces.data?.map((piece, index) => (
              <tr key={index}>
                <td>{piece.id}</td>
                <td>{piece.color}</td>
                <td>{JSON.stringify(piece.shape)}</td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
    
      <GridBoard color='grey' board_type='piece' piece={shape} />

    </>
  );
}

export default Piece