import React, { useEffect, useState } from 'react'
import { trpc } from "../../utils/trpc";

// Represents a grid square with a color

export default function Square(props: {color: string, size?: number}) {

  
  const { data: colorLookup } = trpc.color.getColorLookup.useQuery();
  const {data: randomColor, refetch: randomColorRefetch} = trpc.color.randomColor.useQuery();
  const [color, setColor] = useState('#ffffff')


  useEffect(() => {
    if (props?.color?.[0] === '#') {
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

  let roundedClass = 'rounded-md'
  // think of the 60 as the default value of the size prop
  if (props.size || 60 <= 20) { roundedClass = 'rounded-sm' }

  const classes = [roundedClass, 'border-[1px]']

  if      (props.size == 10) { classes.push('w-[10px] h-[10px]') }
  else if (props.size == 15) { classes.push('w-[15px] h-[15px]') }
  else if (props.size == 20) { classes.push('w-[20px] h-[20px]') }
  else if (props.size == 40) { classes.push('w-[40px] h-[40px]') }
  else                       { classes.push('w-[60px] h-[60px]') }

  return (
    <>
      <div onClick={handleClick} className={classes.join(" ")} style={inlineStyle}>
      </div>
    </>
  );
}