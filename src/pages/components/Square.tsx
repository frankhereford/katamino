import React, { useState } from 'react'
//import {colors, toCamelCase} from "../../utils/colors";


// Represents a grid square with a color

export default function Square(props: {color: string}) {

  const [color, setColor] = useState(props.color)

  const inlineStyle = {
    backgroundColor: color,
    transition: "all .2s ease",
  }

  function handleClick(e: { target: { style: { backgroundColor: any } } }) { 
    console.log(e.target.style.backgroundColor)
    setColor("#ff0000")
  }


  return (
    <div onClick={handleClick} className="box-content h-[40px] w-[40px] border-[2px]" style={inlineStyle}></div>
  );
}