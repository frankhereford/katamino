import React, { useState, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import nj from "numjs"

import PentaBoard from './components/PentaBoard'

const Penta: NextPage = () => {
  //🪝

  // 🛠
 
  // ƛ
  
  return (
    <>
      <Head>
        <title>Edit Pentas</title>
        <meta name="description" content="Create and view pentas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PentaBoard board_color='grey' square_size={60} />
    </>
  );
}

export default Penta