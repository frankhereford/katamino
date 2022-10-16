import React, { useState, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import sets from "array-operations"

import PentaBoard from './components/PentaBoard'
import GridBoard from './components/GridBoard'

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update state to force render
}

const Penta: NextPage = () => {
  //🪝
  const forceUpdate = useForceUpdate();
  const [columns, set_columns] = useState(4);
  const [blocks, set_blocks] = useState([]);
  const { data: pieces } = trpc.piece.list.useQuery();

  // use the use effect to adjust the way data is shown; update indicator border on pieces
  useEffect(() => {
    pieces?.forEach((piece, index) => {
      if (sets.intersection(blocks, [piece.id]).length > 0) {
        pieces[index].opacity = 1
      }
      else {
        pieces[index].opacity = 0.5
      }
    })
    forceUpdate();
    }, [blocks]);

  // 🛠
 
  // ƛ
  const block_click_handler = async (event : any) => {
    const clicked_set = [event.currentTarget.id]
    if (sets.intersection(clicked_set, blocks).length > 0) {
      set_blocks(sets.difference(blocks, clicked_set))
    }
    else {
      set_blocks(sets.union(blocks, clicked_set))
    }
  }

  function handle_size_request(change: number) {
    const requested_size = columns + change;
    if (requested_size <  3) { return; }
    if (requested_size > 12) { return; }
    set_columns(requested_size);
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
          <div onClick={block_click_handler} key={index} id={piece.id}>
            <GridBoard board_color='grey' piece={piece} square_size={15}/>
          </div>
        ))}  
      </div>

      <div>
        <button className='btn btn-primary' onClick={() => handle_size_request( 1)}>➕</button>
        <button className='btn btn-primary' onClick={() => handle_size_request(-1)}>➖</button>
      </div>

    </>
  );
}

export default Penta