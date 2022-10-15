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

  useEffect(() => {
  });

  // 🛠
 
  // ƛ
  
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
          <div key={index} className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="card-actions justify-end">
                <GridBoard onClick={() => {console.log('hi')}} board_color='grey' piece={piece} square_size='15'/>
              </div>
            </div>
          </div>          
        ))}  
      </div>

    </>
  );
}

export default Penta