import React, { useState, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import nj from "numjs"

import GridBoard from './components/GridBoard'

const nascent_piece_template = {
  colorId: 'default',
  color: { name: 'red' },
  shape: nj.zeros([5,5]).tolist(),
}

const Piece: NextPage = () => {
  //🪝
  const mutation = trpc.piece.create.useMutation({
    onSuccess: () => {
      pieces_refetch();
    }
  });
  const { data: pieces, refetch: pieces_refetch } = trpc.piece.list.useQuery();
  const [nascent_piece, set_nascent_piece] = useState(nascent_piece_template);
  const colors = trpc.color.list.useQuery();

  
  // 🛠
  const color_choices = [{ value: 'default', label: 'Pick a color' }] // default
  colors.data?.map((color) => { color_choices.push({ value: color.id, label: color.name }) });


  // ƛ
  const addPiece = () => {
    console.log(nascent_piece)
    mutation.mutate(nascent_piece);
  };

  // should this get set in a useContext context or passed down by hand? does it depend on the intended use on the page?
  const square_click_handler = (row: number, col: number) => {
    let shape = nj.array(nascent_piece.shape);
    shape.set(row, col, shape.get(row, col) ? 0 : 1);
    nascent_piece.shape = shape.tolist();
    set_nascent_piece({ ...nascent_piece });
  }

  const color_change_handler = async (color_id: string) => {
    nascent_piece.colorId = color_id;
    nascent_piece.color.name = colors.data?.find((color) => color.id === color_id)?.name || 'red';
    console.log(nascent_piece);
    set_nascent_piece({ ...nascent_piece });
  }

  //console.log(pieces?.[0]);
  return (
    <>
      <Head>
        <title>Edit Pieces</title>
        <meta name="description" content="Create and view pieces" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <select onChange={event => color_change_handler(event.target.value)} defaultValue='default' className="select w-full max-w-xs">
          {color_choices.map((color) => {
              return ( <option key={color.value} value={color.value}>{color.label}</option> )
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
                <td>{piece.color.name}</td>
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