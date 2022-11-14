import React, { useEffect, useState, type SyntheticEvent } from 'react'
import { trpc } from "../../utils/trpc";
import Block from "../components/Block";
import Penta from "../components/Penta";
import type { CSSProperties } from "react";
import RingLoader from "react-spinners/RingLoader";

export default function AvailablePentas(props: any) {
  const { data: pentas } = trpc.availablePenta.getAll.useQuery();
  const startPenta = trpc.availablePenta.start.useMutation({
    onSuccess: () => {
      props.setRefresh(true);
    }
  });

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  function startPentaClick(event: any) {
    props.setShowSpinner(true)
    const update = startPenta.mutate({
      id: event.target?.dataset.id || '',
    })
  }

  function showSlamEmoji(slam: string) {
         if (slam === 'Small Slam') { return '🦎' }
    else if (slam === 'Full Board') { return '🦕' }
    return slam
  }

  return (
    <>
      <div className="col-start-2 col-end-10 mt-10">
        <div className="col-start-2 col-end-10">
          <h1 className="text-center text-xl font-extrabold leading-normal text-gray-700 md:text-[2rem]">
            <span className="text-secondary">A</span>vailable Pentas
          </h1>
        </div>
        {pentas ?
          <table className="table table-zebra w-full outline rounded-md outline-1 outline-secondary">
            <thead>
              <tr>
                <th className="text-center">️Start</th>
                <th className="text-center">Slam</th>
                <th className="text-center">Group</th>
                <th>Pieces</th>
              </tr>
            </thead>
            <tbody>
              {pentas && pentas.map((penta) => (
                <tr key={penta.id} className="hover">
                  <td className="text-center">
                    <button onClick={startPentaClick} data-id={penta.id} className="btn btn-secondary btn-circle">️🎮</button>
                  </td>
                  <td className="text-center text-4xl">{showSlamEmoji(penta.slam.name)}</td>
                  <td className="text-center">{penta.rowName}</td>
                  <td>
                    <div className="grid grid-cols-8">
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