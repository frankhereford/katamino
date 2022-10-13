import React, { useState, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

import GridBoard from './components/GridBoard'


const Piece: NextPage = () => {

  const mutation = trpc.piece.set.useMutation({
    onSuccess: () => {
      refetch();
    }
  });

  const { isLoading, isError, data: pieces, error, refetch } = trpc.piece.list.useQuery();  
  //const [pieces, setPieces] = useState(pieces_result);

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  const addPiece = () => {
    mutation.mutate({
      color: 'red',
      shape: [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 1, 0],
        [1, 0, 0, 0, 0],
      ]
    });
    refetch();
  };

  return (
    <>
      <Head>
        <title>Edit Pieces</title>
        <meta name="description" content="Create and view pieces" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={addPiece} className='btn btn-primary'>Add piece</button>
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
            {pieces?.map((piece, index) => (
              <tr key={index}>
                <td>{piece.id}</td>
                <td>{piece.color}</td>
                {/*<td>{JSON.stringify(piece.shape)}</td>*/}
                <td>
                  <GridBoard board_color='grey' piece={piece} size='15' />
                </td>
              </tr>))
            }
          </tbody>
        </table>
      </div>
    

    </>
  );
}

export default Piece