import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import sets from "array-operations"

const Penta: NextPage = () => {
  //🪝
  const { query } = useRouter()

  // 🛠
 
  // ƛ
  return (
    <>
      <Head>
        <title>Play a Penta</title>
        <meta name="description" content="Play Penta" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      hi!
    </>
  );
}

export default Penta