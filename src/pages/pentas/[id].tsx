import { useRouter } from 'next/router'
import { type NextPage } from "next";
import Head from "next/head";
import Penta from "../components/Penta";

import { trpc } from "../../utils/trpc";

const PentaPage: NextPage = () => {
  const { query, isReady: routerReady } = useRouter()
  const { data: penta, refetch: penta_refetch } = trpc.penta.get.useQuery({
    id: String(query.id)
  }, {
    enabled: routerReady
  },);

  return (
    <>
      <Head>
        <title>Katamino</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Penta id={penta?.id}></Penta>
      </main>
    </>
  )
}

export default PentaPage