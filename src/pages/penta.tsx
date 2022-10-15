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

      <div>
        {pieces?.map((piece, index) => (
          <GridBoard board_color='grey' piece={piece} square_size='15'/>
        ))}  
      </div>

    </>
  );
}

export default Penta