import React from 'react'

// Represents a grid square with a color

export default function GridSquare(props: { row: any; col: any; color: any; square_click_handler?: any; }) {

  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.square_click_handler(props.row, props.col);
  }

  const classes = `grid-square color-${props.color}`
  return <div onClick={ props.square_click_handler ? clickHandler : undefined } className={classes} />

}