import React, { useEffect, useState } from 'react'
import { trpc } from "../../utils/trpc";
import Block from "../components/Block";
import Penta from "../components/Penta";
import type { CSSProperties } from "react";
import RingLoader from "react-spinners/RingLoader";

export default function AvailablePentas() {

  const { data: pentas } = trpc.availablePenta.getAll.useQuery();

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  console.log(pentas)
  return (
    <>
      <div className="col-start-2 col-end-10 mt-10">
        {pentas ?
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>️Play</th>
                <th>Columns</th>
                <th>Pieces</th>
              </tr>
            </thead>
            <tbody>
              {pentas && pentas.map((penta) => (
                <tr key={penta.id} className="hover">
                  <td>
                    <a href={'pentas/' + penta.id} role="button" className="btn btn-secondary btn-circle">️🎮</a>
                  </td>
                  <td>{penta.columns}</td>
                  <td>
                    <div className="grid grid-cols-6">
                      {penta?.availableBlocks.map((block) => {
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
    </>
  );
}