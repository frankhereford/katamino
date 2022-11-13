import { type NextPage } from "next";
import Head from "next/head";
import Square from "./components/Square";
import Piece from "./components/Piece";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Katamino</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">

        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Play <span className="text-primary">K</span>atamino
        </h1>

        <h3 className="mt-2">A square</h3>
        <div className="grid grid-cols-1 gap-0">
          <Square color="lightGrey"></Square>
        </div>

        <h3 className="mt-5">A piece</h3>
        <div className="grid grid-cols-1 gap-0">
          <Piece></Piece>
        </div>

      </main>
    </>
  );
};

export default Home;
