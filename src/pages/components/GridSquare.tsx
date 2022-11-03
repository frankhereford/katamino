import React from 'react'
import {colors, toCamelCase} from "../../utils/colors";

// Represents a grid square with a color

export default function GridSquare(props : {
  row : any;
  col : any;
  color : any;
  square_click_handler? : any;
}) {

  const clickHandler = (event : React.MouseEvent < HTMLButtonElement >) => {
    props.square_click_handler(props.row, props.col);
  }

  const classes = `grid-square`
  let style = {
    backgroundColor: colors[toCamelCase(props.color)]
  }
  if (props.color[0] === '#') {
    style = {
      backgroundColor: props.color
    }
  }
  return <div onClick={
      props.square_click_handler ? clickHandler : undefined
    }
    className={classes}
    style={style}/>

}
