import React, { useState } from 'react'
import {colors, toCamelCase} from "../../utils/colors";


// Represents a grid square with a color

export default function Square(props: {color: string}) {

  const [color, setColor] = useState(props.color)

  const inlineStyle = {
    backgroundColor: color,
    transition: "all .2s ease",
  }

  // function to pick a random key from an object
  function pickRandomKey(obj: any) {
    var result = '';
    var count = 0;
    for (var prop in obj)
      if (Math.random() < 1 / ++count)
        result = prop;
    return result;
  }



  function handleClick(e: any){
    setColor(colors[pickRandomKey(colors)])
  }


  return (
    <div onClick={handleClick} className="box-content h-[40px] w-[40px] border-[2px]" style={inlineStyle}></div>
  );
}