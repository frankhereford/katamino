import { type NextPage } from "next";
import Head from "next/head";
import type { CSSProperties } from "react";
import RingLoader from "react-spinners/RingLoader";
import Penta from "../components/Penta";
import AvailablePentas from "../components/AvailablePentas";
import Block from "../components/Block";
import { trpc } from "../../utils/trpc";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

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
        <div className="grid grid-cols-10 mt-10">
          <div className="col-start-2 col-end-10">
            <h1 className="text-center text-2xl font-extrabold leading-normal text-gray-700 md:text-[4rem]">
              Pick a <span className="text-purple-300">P</span>enta to Play
            </h1>
          </div>
          <div className="col-start-2 col-end-10 mt-10">
            {pentas ? 
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>️Play</th>
                    <th>Pieces</th>
                    <th>Columns</th>
                    <th>Penta</th>
                  </tr>
                </thead>
                <tbody>
                  {pentas && pentas.map((penta) => (
                    <tr key={penta.id} className="hover">
                      <td>
                        <a href={'pentas/' + penta.id} role="button" className="btn btn-primary btn-circle">🕹️</a>
                      </td>
                      <td>
                        <div className="grid grid-cols-6">
                          {penta?.blocks.map((block) => {
                            const classes = ["w-fit", "mx-auto"]
                            return (
                              <div key={block.id} className="inline-block outline outline-1 m-1 w-fit">
                                <div className={classes.join(" ")}>
                                  <Block block={block} size={8} hideVisibility={true}></Block>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </td>
                      <td>{penta.columns}</td>
                      <td>
                        <Penta penta={penta} size={15} trimBorder={true}></Penta>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              : <div className="mt-20">
                  <RingLoader
                    color={"hsl(var(--pf))"}
                    cssOverride={override}
                    size={75}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
            }
          </div>
        </div>
        <div className="grid grid-cols-10 mt-10">
          <div className="col-start-2 col-end-10">
            <AvailablePentas></AvailablePentas>
          </div>
        </div>
      </main>
    </>
  )
}

export default Pentas