import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import sets from "array-operations"
import PentaBoard from '../components/PentaBoard'
import GridBoard from '../components/GridBoard'

const Penta: NextPage = () => {
  //🪝
  const { query, isReady } = useRouter()
  const { data: penta } = trpc.penta.get.useQuery(
    { id: query.id, },
    { enabled: isReady }
  );
  const [active_block, set_active_block] = useState();
  useEffect(() => { // is this wrong? doesn't this fire every redraw? is that really what we do want?
    document.addEventListener('keydown', handle_keydown, true);
  }, []);


  // 🛠
  if (penta == undefined) {
    return <div>loading...</div>
  }
 
  // ƛ
  const block_click_handler = async (event: any) => {
    set_active_block(event.currentTarget.id)
  };

  const handle_keydown = (event: any) => {
  console.log(event)
  }

  return (
    <>
      <Head>
        <title>Play a Penta</title>
        <meta name="description" content="Play Penta" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <PentaBoard board_color='grey' square_size={50} columns={penta.columns} />
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
                <GridBoard key={index} board_color='grey' piece={block.piece} square_size='15'/>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Penta