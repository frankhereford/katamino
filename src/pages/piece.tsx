import React, { useState, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

import GridBoard from './components/GridBoard'

const nascent_piece = {
  color: 'red',
  shape: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]
}

const Piece: NextPage = () => {

  const { isLoading, isError, data: pieces, error, refetch } = trpc.piece.list.useQuery();  

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  const mutation = trpc.piece.set.useMutation({
    onSuccess: () => {
      refetch();
    }
  });

  const addPiece = () => {
    mutation.mutate(nascent_piece);
  };

  return (
    <>
      <Head>
        <title>Edit Pieces</title>
        <meta name="description" content="Create and view pieces" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <GridBoard board_color='grey' piece={nascent_piece} square_size='40' />
        <button onClick={addPiece} className='btn btn-primary'>Add piece</button>
      </div>
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
                <td>
                  <GridBoard board_color='grey' piece={piece} square_size='15' />
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