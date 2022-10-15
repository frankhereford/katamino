import React, { useState, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import nj from "numjs"

import PentaBoard from './components/PentaBoard'
import GridBoard from './components/GridBoard'

const Penta: NextPage = () => {
  //🪝
  const [columns, set_columns] = useState(12);
  const [blocks, set_blocks] = useState([]);

  const { data: pieces, refetch: pieces_refetch } = trpc.piece.list.useQuery();

  // use the use effect to adjust the way data is shown; update indicator border on pieces
  useEffect(() => {
  });

  // 🛠
 
  // ƛ
  const block_click_handler = async (event) => {
    console.log(event.currentTarget.id)
  }

  
  return (
    <>
      <Head>
        <title>Edit Pentas</title>
        <meta name="description" content="Create and view pentas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <PentaBoard board_color='grey' square_size={80} columns={columns} />
      </div>

      <div className="flex w-full">
        {pieces?.map((piece, index) => (
          <div onClick={block_click_handler} key={index} id={piece.id} className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="card-actions justify-end">
                <GridBoard  board_color='grey' piece={piece} square_size='15'/>
              </div>
            </div>
          </div>          
        ))}  
      </div>

    </>
  );
}

export default Penta