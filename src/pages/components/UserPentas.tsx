import React, { useEffect, useState } from 'react'
import { trpc } from "../../utils/trpc";
import Block from "../components/Block";
import Penta from "../components/Penta";
import type { CSSProperties } from "react";
import RingLoader from "react-spinners/RingLoader";

export default function UserPentas(props: any) {

  const [pentaPage, setPentaPage] = useState(0);
  const [pentasPerPage, setPentasPerPage] = useState(5);

  const { data: pentas, refetch: refetchUserPentas } = trpc.penta.getAll.useQuery({
    page: pentaPage,
    perPage: pentasPerPage,
  });

  const { data: pentaCount } = trpc.penta.count.useQuery();

  useEffect(() => {
    if (props.refresh) {
      props.setRefresh(false)
      refetchUserPentas()
    }
  }, [props, refetchUserPentas])

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  let pagination = (<></>)
  if (pentaCount) {
    for (let i = 0; i < Math.ceil(pentaCount / pentasPerPage); i++) {
      const classes = ["btn", "btn-sm"]
      if (i === pentaPage) {
        classes.push("btn-primary")
      }

      pagination = (
        <>
          {pagination}
          <button className={classes.join(" ")} onClick={() => setPentaPage(i)}>{i + 1}</button>
        </>
      )
    }
  }


  if (!pentas) {
    return (<>  </>)
  }

  return (
    <div className="grid grid-cols-10 mt-10">
      <div className="col-start-2 col-end-10">
        <div className="grid grid-cols-10 mt-3">
          <div className="col-start-2 col-end-10">
            <h1 className="text-center text-2xl font-extrabold leading-normal text-gray-700 md:text-[3rem]">
              Pick a <span className="text-primary">P</span>enta to Play
            </h1>
          </div>
          <div className="text-right mb-1">
            <div className="btn-group">
              {pagination}
            </div>
          </div>
          <div className="col-start-2 col-end-10">
            {pentas ?
              <table className="table table-zebra w-full outline rounded-md outline-1 outline-primary">
                <thead>
                  <tr>
                    <th className="text-center">️🔥</th>
                    <th className="text-center">️Play</th>
                    <th>Pieces</th>
                    <th className="text-center">Penta</th>
                  </tr>
                </thead>
                <tbody>
                  {pentas && pentas.map((penta) => (
                    <tr key={penta.id} className="hover">
                      <td className="text-center">
                        { penta.completed && <span className="text-primary text-2xl">️🔥</span> }
                      </td>
                      <td className="text-center">
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
                      <td>
                        <Penta solvedCallback={() => void 0} penta={penta} size={15} trimBorder={true}></Penta>
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
      </div>
    </div>
  );
}