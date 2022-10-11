import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Piece: NextPage = () => {
  const pieces = trpc.piece.list.useQuery();  

  return (
    <>
      <Head>
        <title>Edit Pieces</title>
        <meta name="description" content="Create and view pieces" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Color</th>
              <th>Shape</th>
            </tr>
          </thead>
          <tbody>
            {pieces.data?.map((piece, index) => (
              <tr key={index}>
                <td>{piece.id}</td>
                <td>{piece.color}</td>
                <td>{piece.shape}</td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
    

    </>
  );
}

export default Piece