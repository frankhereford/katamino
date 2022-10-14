import React, { useState, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import nj from "numjs"

import GridBoard from './components/GridBoard'

const nascent_piece_template = {
  color: 'red',
  shape: nj.zeros([5,5]).tolist(),
}

const Piece: NextPage = () => {
  //🪝
  const mutation = trpc.piece.set.useMutation({
    onSuccess: () => {
      pieces_refetch();
    }
  });
  const { data: pieces, refetch: pieces_refetch } = trpc.piece.list.useQuery();  
  
  // TODO: build an array options per docs and use jam in the default one, and use that as a single react node to select down there

  const colors = trpc.color.list.useQuery();
  const [nascent_piece, set_nascent_piece] = useState(nascent_piece_template);

  // ƛ
  const addPiece = () => {
    mutation.mutate(nascent_piece);
  };

  // should this get set in a useContext context or passed down by hand? does it depend on the intended use on the page?
  const square_click_handler = (row: number, col: number) => {
    let shape = nj.array(nascent_piece.shape);
    shape.set(row, col, shape.get(row, col) ? 0 : 1);
    nascent_piece.shape = shape.tolist();
    set_nascent_piece({...nascent_piece});
  }

  return (
    <>
      <Head>
        <title>Edit Pieces</title>
        <meta name="description" content="Create and view pieces" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <select defaultValue='default' className="select w-full max-w-xs">
          <option value='default' disabled selected>Pick Color</option>
          {colors.data?.map((color) => {
              <option value={color}>{color}</option>
            })}
        </select>
        <GridBoard board_color='grey' piece={nascent_piece} square_size='40' square_click_handler={square_click_handler} />
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
                  <GridBoard board_color='grey' piece={piece} square_size='15'/>
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