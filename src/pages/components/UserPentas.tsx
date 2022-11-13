import React, { useEffect, useState } from 'react'
import { trpc } from "../../utils/trpc";
import Block from "../components/Block";
import Penta from "../components/Penta";
import type { CSSProperties } from "react";
import RingLoader from "react-spinners/RingLoader";

export default function UserPentas(props: any) {

  const { data: pentas, refetch: refetchUserPentas } = trpc.penta.getAll.useQuery();

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

  if (pentas?.length == 0) {
    return (
      <>
      </>
  ) }

  return (
    <div className="grid grid-cols-10 mt-3">
      <div className="col-start-2 col-end-10">
        <h1 className="text-center text-2xl font-extrabold leading-normal text-gray-700 md:text-[3rem]">
          Pick a <span className="text-primary">P</span>enta to Play
        </h1>
      </div>
      <div className="col-start-2 col-end-10">
        {pentas ?
          <table className="table table-zebra w-full outline rounded-md outline-1 outline-primary">
            <thead>
              <tr>
                <th className="text-center">️Play</th>
                <th>Pieces</th>
                <th className="text-center">Columns</th>
                <th className="text-center">Penta</th>
              </tr>
            </thead>
            <tbody>
              {pentas && pentas.map((penta) => (
                <tr key={penta.id} className="hover">
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
                  <td className="text-center">{penta.columns}</td>
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
  );
}