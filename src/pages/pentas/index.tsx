import { type NextPage } from "next";
import Head from "next/head";

import { trpc } from "../../utils/trpc";

const Pentas: NextPage = () => {
  
  const { data: pentas } = trpc.penta.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Katamino</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>️Play</th>
              <th>ID</th>
              <th>Columns</th>
            </tr>
          </thead>
          <tbody>
            {pentas && pentas.map((penta) => (
              <tr key={penta.id} className="hover">
                <td>
                  <a href={'pentas/' + penta.id} role="button" className="btn btn-primary btn-circle">🕹️</a>
                </td>
                <td>{penta.id}</td>
                <td>{penta.columns}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  )
}

export default Pentas