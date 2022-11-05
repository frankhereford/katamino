import React, { useState } from 'react'
import { trpc } from "../../utils/trpc";

// Represents a grid square with a color

export default function Square(props: {color: string}) {

  const {data: randomColor, refetch: randomColorRefetch} = trpc.color.randomColor.useQuery();

  const [color, setColor] = useState(props.color)

  function handleClick(e: object){
    setColor(randomColor.hexCode)
    // get a color for the next click
    randomColorRefetch()
  } 

  const inlineStyle = {
    backgroundColor: color,
    transition: "all .2s ease",
  }

  return (
    <div onClick={handleClick} className="box-content h-[40px] w-[40px] border-[2px]" style={inlineStyle}></div>
  );
}