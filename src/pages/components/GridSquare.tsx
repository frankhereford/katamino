import React from 'react'

// Represents a grid square with a color

export default function GridSquare(props) {

  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log(event.target);
    console.log(props.row);
    console.log(props.col);
  }

  const classes = `grid-square color-${props.color}`
  return <div onClick={clickHandler} className={classes} />
}