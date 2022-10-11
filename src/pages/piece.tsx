import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Piece: NextPage = () => {
  const pieces = trpc.piece.list.useQuery();  
  console.log(pieces.data)

  return (
    <>
      <Head>
        <title>Edit Pieces</title>
        <meta name="description" content="Create and view pieces" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>👋</div>
    </>
  );
}

export default Piece