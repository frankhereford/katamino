import React, {useState, useEffect} from 'react';
import type {NextPage}
from "next";
import Head from "next/head";
import {trpc} from "../utils/trpc";
import sets from "array-operations"

import PentaBoard from './components/PentaBoard'
import GridBoard from './components/GridBoard'

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return() => setValue(value => value + 1); // update state to force render
}

const Pentas: NextPage = () => { // 🪝
  const forceUpdate = useForceUpdate();
  const [columns, set_columns] = useState(3);
  const [blocks, set_blocks] = useState([]);
  const {data: pieces} = trpc.piece.list.useQuery();
  const {data: pentas, refetch: pentas_refetch} = trpc.penta.list.useQuery();

  const mutation = trpc.penta.create.useMutation({
    onSuccess: () => {
      pentas_refetch();
    }
  });

  // use the use effect to adjust the way data is shown; update indicator border on pieces
  useEffect(() => {
    pieces ?. forEach((piece, index) => {
      if (blocks.length == 0) {
        pieces[index].opacity = 1
      } else if (sets.intersection(blocks, [piece.id]).length > 0) {
        pieces[index].opacity = 1
      } else {
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
    } else {
      set_blocks(sets.union(blocks, clicked_set))
    }
  }

  function handle_size_request(change : number) {
    const requested_size = columns + change;
    if (requested_size < 3) {
      return;
    }
    if (requested_size > 12) {
      return;
    }
    set_columns(requested_size);
  }

  const save_handler = async () => {
    mutation.mutate({blocks: blocks, columns: columns})
  }

  return (
    <>

      <Head>
        <title>Edit Pentas</title>
        <meta name="description" content="Create and view pentas"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <div className="mb-4">
        <PentaBoard board_color='grey'
          square_size={50}
          columns={columns}/>
      </div>

      <div className="flex">
        {
        pieces ?. map((piece, index) => (
          <div onClick={block_click_handler}
            key={index}
            id={
              piece.id
          }>
            <GridBoard board_color='grey'
              piece={piece}
              square_size={15}/>
          </div>
        ))
      } </div>

      <div className="mt-4 space-y-4">

        {
        blocks.length > 0 && <div>
          <button className='btn btn-primary'
            onClick={
              () => set_blocks([])
          }>Clear Selection</button>
        </div>
      }

        <div> {
          columns < 12 && <button className='btn btn-primary'
            onClick={
              () => handle_size_request(1)
          }>➕</button>
        }
          {
          columns > 3 && <button className='btn btn-primary'
            onClick={
              () => handle_size_request(-1)
          }>➖</button>
        } </div>

        {
        blocks.length > 0 && <div>
          <button className='btn btn-primary'
            onClick={
              () => save_handler()
          }>Save</button>
        </div>
      }

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Play</th>
                <th>ID</th>
                <th>Columns</th>
                <th>Pieces</th>
              </tr>
            </thead>
            <tbody> {
              pentas ?. map((penta, index) => (
                <tr key={index}>
                  <td>
                    <a href={
                      `/penta/${
                        penta.id
                      }`
                    }>
                      <button className='btn btn-primary'>Play</button>
                    </a>
                  </td>
                  <td>{
                    penta.id
                  }</td>
                  <td>{
                    penta.columns
                  }</td>
                  <td>
                    <div className="flex">
                      {
                      penta.blocks.map((block, index) => (
                        <GridBoard key={index}
                          board_color='grey'
                          piece={
                            block.piece
                          }
                          square_size={15}/>
                      ))
                    } </div>
                  </td>
                </tr>
              ))
            } </tbody>
          </table>
        </div>

      </div>

    </>
  );
}

export default Pentas
