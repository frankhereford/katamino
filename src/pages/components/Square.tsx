import React, { useEffect, useState } from 'react'
import { trpc } from "../../utils/trpc";

// Represents a grid square with a color

export default function Square(props: {color: string}) {

  
  const { data: colorLookup } = trpc.color.getColorLookup.useQuery();

  const {data: randomColor, refetch: randomColorRefetch} = trpc.color.randomColor.useQuery();

  const [color, setColor] = useState('#ffffff')


  useEffect(() => {
    if (props.color[0] === '#') {
      setColor(props.color)
    }
    else {
      setColor(colorLookup?.[props.color]?.hexCode || '#ffffff')
    }
  }, [props.color, colorLookup])

  function handleClick(){
    // set a meaningful default to fix typing
    setColor(randomColor?.hexCode ?? "#ffffff")
    // get a color for the next click
    randomColorRefetch()
  } 

  const inlineStyle = {
    backgroundColor: color,
    transition: "all .2s ease",
  }

  return (
    <div onClick={handleClick} className="box-content h-[40px] w-[40px] border-[1px]" style={inlineStyle}></div>
  );
}