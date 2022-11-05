import React, { useState } from 'react'
//import {colors, toCamelCase} from "../../utils/colors";


// Represents a grid square with a color

export default function Square() {

  const [color, setColor] = useState("#aaaaaa")

  return (
    <div className="box-content h-[20px] w-[20px] p-1 border-2" style={{backgroundColor: color}}></div>
  );
}