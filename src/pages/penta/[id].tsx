import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import PentaBoard from '../components/PentaBoard'
import Block from '../components/Block'
import useKeypress from 'react-use-keypress';

function get_block_index(blocks: [object], item: string) {
  const element = blocks.find((element) => element.id === item);
  return blocks.indexOf(element);
}

function find_previous(blocks: [object], item: string) {
  if (!item) { return blocks[0].id; }
  const index = get_block_index(blocks, item);
  if (index === 0) {
    return blocks[blocks.length - 1].id;
  }
  return blocks[index - 1].id;
}

function find_next(blocks: [object], item: string) {
  const index = get_block_index(blocks, item);
  if (!item) { return blocks[0].id; }
  if (index === blocks.length - 1) {
    return blocks[0].id;
  }
  return blocks[index + 1].id;
}

const Penta: NextPage = () => {
  //🪝
  const { query, isReady } = useRouter()
  const { data: penta, refetch: penta_refetch } = trpc.penta.get.useQuery(
    { id: query.id, },
    { enabled: isReady },
  );
  const [active_block, set_active_block] = useState();

  const set_rotation = trpc.block.set_rotation.useMutation({
    onSuccess: () => { penta_refetch(); }
  });

  const set_reflection = trpc.block.set_reflection.useMutation({
    onSuccess: () => { penta_refetch(); }
  });


  useKeypress(['q', 'e', 'w', 'd'], (event) => {
    if (!penta) { return; }
    if (event.key === 'q') {
      const previous = find_previous(penta.blocks, active_block);
      set_active_block(previous);
    }
    if (event.key === 'e') {
      const next = find_next(penta.blocks, active_block);
      set_active_block(next);
    }
    if (event.key === 'd') {
      const index = get_block_index(penta.blocks, active_block);
      set_rotation.mutate({
        id: active_block,
        clockwise: (penta.blocks[index]?.rotation.clockwise + 1) % 4,
      })
    }
    if (event.key === 'w') {
      const index = get_block_index(penta.blocks, active_block);
      set_reflection.mutate({
        id: active_block,
        reflection: penta.blocks[index].reflection ? false : true,
      })
    }

  });

  // 🛠
  if (penta == undefined) {
    return <div>loading...</div>
  }
 
  // ƛ
  const block_click_handler = async (event: any) => {
    set_active_block(event.currentTarget.id)
  };

  return (
    <>
      <Head>
        <title>Play a Penta</title>
        <meta name="description" content="Play Penta" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <PentaBoard penta={penta} board_color='grey' square_size={50} columns={penta.columns} />
      </div>
      <div>
        <div className="mx-5 flex flex-row space-x-4 mt-10">
          {penta.blocks.map((block, index) => {
            const classes = ['flex-initial']
            if (active_block == block.id) {
              classes.push('ring')
              classes.push('ring-red-500')
            }
            return (
              <div id={block.id} onClick={block_click_handler} key={index} className={classes.join(' ')}>
                <Block key={index} board_color='grey' block={block} square_size='15'/>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Penta