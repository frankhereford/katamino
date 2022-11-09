import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { type NextPage } from "next";
import Head from "next/head";
import Penta from "../components/Penta";
import Block from "../components/Block";
import { useKeyBindings} from "rooks";
import { trpc } from "../../utils/trpc";
import { type Prisma } from '@prisma/client';
import _ from "lodash";
import { useDebounceCallback } from '@react-hook/debounce'


const PentaPage: NextPage = () => {
  const { query, isReady: routerReady} = useRouter()
  const { data: pentaRecord, refetch: pentaRefetch, isFetching: pentaLoading } = trpc.penta.get.useQuery({
    id: String(query.id)
  }, {
    enabled: routerReady
  },);


  const [penta, setPenta] = useState(pentaRecord)

  useEffect(() => {
    if (!pentaRecord) { return }
    setPenta(pentaRecord)
  }, [pentaRecord])

  const debouncedPentaRefetch = useDebounceCallback(pentaRefetch, 2500, false)

  const set_rotation = trpc.block.set_rotation.useMutation({ });

  const set_reflection = trpc.block.set_reflection.useMutation({ });

  const set_translation = trpc.block.set_translation.useMutation({ });

  const set_visibility = trpc.block.set_visibility.useMutation({ });

  const [activeBlock, setActiveBlock] = useState<number>()

  useKeyBindings({
    q: keyQ,
    w: keyW,
    e: keyE,
    a: keyA,
    s: keyS,
    d: keyD,
    Tab: keyTab,
    ArrowUp: arrowKey,
    ArrowDown: arrowKey,
    ArrowLeft: arrowKey,
    ArrowRight: arrowKey,
  })

  function keyQ() {
    if (!penta?.blocks) { }
    else if (!activeBlock && activeBlock !== 0) {
      setActiveBlock(penta?.blocks.length - 1)
    }
    else if (activeBlock === 0) {
      setActiveBlock(penta?.blocks.length - 1)
    }
    else { setActiveBlock(activeBlock - 1)}
  }

  function keyE() {
    if (!penta?.blocks) { return }
    else if (!activeBlock && activeBlock !== 0) {
      setActiveBlock(0)
    }
    else if (activeBlock == penta?.blocks.length - 1) {
      setActiveBlock(0)
    }
    else { setActiveBlock(activeBlock + 1) }
  }

  function keyW() {
    if (!penta?.blocks) { return }
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta?.blocks[activeBlock]?.id) { return }

    if (!penta) { return }
    const pentaCopy = _.cloneDeep(penta);
    pentaCopy.blocks[activeBlock]!.reflection = !pentaCopy?.blocks?.[activeBlock]?.reflection
    setPenta(pentaCopy)

    set_reflection.mutate({
      id: penta?.blocks[activeBlock]?.id || '',
      reflection: penta?.blocks[activeBlock]?.reflection ? false : true
    })
    debouncedPentaRefetch()
  }

  function keyD() {
    if (!penta?.blocks) { return }
    if (!activeBlock && activeBlock !== 0) { return }
    if (
      penta?.blocks[activeBlock]?.rotation &&
      typeof penta?.blocks[activeBlock]?.rotation == 'object' &&
      !Array.isArray(penta?.blocks[activeBlock]?.rotation)
    ) {
      const rotation = penta?.blocks[activeBlock]?.rotation as Prisma.JsonObject
      const clockwise: number = Number(rotation.clockwise) || 0
      
      if (!penta) { return }
      const pentaCopy = _.cloneDeep(penta);
      pentaCopy.blocks[activeBlock]!.rotation = {
        clockwise: (clockwise + 1) % 4
      }
      setPenta(pentaCopy)

      set_rotation.mutate({
        id: penta?.blocks[activeBlock]?.id || '',
        clockwise: (clockwise + 1) % 4
      })
    }
    debouncedPentaRefetch()
  }

  function keyTab(event: KeyboardEvent) {
    event.preventDefault();
    if (!penta?.blocks) { return }
    else if (!activeBlock && activeBlock !== 0) {
      setActiveBlock(0)
    }
    else if (activeBlock == penta?.blocks.length - 1) {
      setActiveBlock(0)
     }
    else {setActiveBlock(activeBlock + 1)}
  }

  function arrowKey(event: KeyboardEvent) {
    if (!activeBlock && activeBlock !== 0) { return }
  
    if (!penta) { return }
    if (!penta?.blocks[activeBlock]?.id) { return } 

    if (
      penta?.blocks[activeBlock]?.translation &&
      typeof penta?.blocks[activeBlock]?.translation == 'object' &&
      !Array.isArray(penta?.blocks[activeBlock]?.translation)
    ) {
      const translation = penta?.blocks[activeBlock]?.translation as Prisma.JsonObject
      const up: number = Number(translation.up) || 0
      const right: number = Number(translation.right) || 0
  
      if (event.key === 'ArrowDown') {
        
        if (!penta) { return }
        const pentaCopy = _.cloneDeep(penta);
        pentaCopy.blocks[activeBlock]!.translation = {
          up: up - 1,
          right: right,
        }
        setPenta(pentaCopy)

        set_translation.mutate({
          id: penta?.blocks[activeBlock]?.id || '',
          translation: {
            up: up - 1,
            right: right,
          }
        })
      }
      else if (event.key === 'ArrowUp') {

        if (!penta) { return }
        const pentaCopy = _.cloneDeep(penta);
        pentaCopy.blocks[activeBlock]!.translation = {
          up: up + 1,
          right: right,
        }
        setPenta(pentaCopy)

        set_translation.mutate({
          id: penta?.blocks[activeBlock]?.id || '',
          translation: {
            up: up + 1,
            right: right
          }
        })
      }
      else if (event.key === 'ArrowLeft') {

        if (!penta) { return }
        const pentaCopy = _.cloneDeep(penta);
        pentaCopy.blocks[activeBlock]!.translation = {
          up: up,
          right: right - 1,
        }
        setPenta(pentaCopy)

        set_translation.mutate({
          id: penta?.blocks[activeBlock]?.id || '',
          translation: {
            up: up,
            right: right - 1
          }
        })
      }
      else if (event.key === 'ArrowRight') {

        if (!penta) { return }
        const pentaCopy = _.cloneDeep(penta);
        pentaCopy.blocks[activeBlock]!.translation = {
          up: up,
          right: right + 1,
        }
        setPenta(pentaCopy)

        set_translation.mutate({
          id: penta?.blocks[activeBlock]?.id || '',
          translation: {
            up: up,
            right: right + 1
          }
        })
      }
    }
    debouncedPentaRefetch()
  }

  function keyA() {
    if (!activeBlock && activeBlock !== 0) { return }
    

    if (!penta) { return }
    const pentaCopy = _.cloneDeep(penta);
    pentaCopy.blocks[activeBlock]!.translation = { up: 0, right: 0, }
    pentaCopy.blocks[activeBlock]!.rotation = { clockwise: 0 }
    pentaCopy.blocks[activeBlock]!.reflection = false
    //pentaCopy.blocks[activeBlock].visible = false
    setPenta(pentaCopy)

    set_translation.mutate({
      id: penta?.blocks[activeBlock]?.id || '',
      translation: {
        up: 0,
        right: 0
      }
    })
    set_rotation.mutate({ id: penta?.blocks[activeBlock]?.id || '', clockwise: 0 })
    set_reflection.mutate({ id: penta?.blocks[activeBlock]?.id || '', reflection: false })
    debouncedPentaRefetch()
  }

  function keyS() {
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta) { return }
    const pentaCopy = _.cloneDeep(penta);
    pentaCopy.blocks[activeBlock]!.visible = !pentaCopy.blocks[activeBlock]!.visible
    setPenta(pentaCopy)

    set_visibility.mutate({
      id: penta?.blocks[activeBlock]?.id || '',
      visible: penta?.blocks[activeBlock]?.visible ? false : true
    })
    debouncedPentaRefetch()
  }

  let columnClass = null
  if      (penta?.blocks.length === 3)  { columnClass = 'grid-cols-3'  }
  else if (penta?.blocks.length === 4)  { columnClass = 'grid-cols-4'  }
  else if (penta?.blocks.length === 5)  { columnClass = 'grid-cols-5'  }
  else if (penta?.blocks.length === 6)  { columnClass = 'grid-cols-6'  }
  else if (penta?.blocks.length === 7)  { columnClass = 'grid-cols-6'  }
  else if (penta?.blocks.length === 8)  { columnClass = 'grid-cols-6'  }
  else if (penta?.blocks.length === 9)  { columnClass = 'grid-cols-6'  }
  else if (penta?.blocks.length === 10) { columnClass = 'grid-cols-6'  }
  else if (penta?.blocks.length === 11) { columnClass = 'grid-cols-6'  }
  else if (penta?.blocks.length === 12) { columnClass = 'grid-cols-6'  }

  const classes = ["mt-10", "grid", "items-center", "justify-center", columnClass]

  return (
    <>
      <Head>
        <title>Katamino</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
        </div>
        <div>
          <Penta penta={penta} borderWidth={2}></Penta>
        </div>
        <div className={classes.join(" ")}>
          {penta?.blocks.map((block, index) => {
            let classes: string[] = []
            if (index === activeBlock) {
              classes = ["outline-dashed", "w-fit", "mx-auto", "outline-4", "outline-cyan-500"]
            }
            else {
              classes = ["w-fit", "mx-auto"]
            }
            return (
              <div key={block.id}>
                <div className={classes.join(" ")}>
                  <Block block={block}></Block>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}

export default PentaPage