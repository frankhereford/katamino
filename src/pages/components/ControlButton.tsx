import React from 'react'

export default function ControlButton (props: {
  classes: string
  clickHandler: any
  icon: any
  letter?: string
  position: string
}) {
  return (
    <>
      <div className={ props.position }>
        <button
          className={ props.classes }
          onClick={ props.clickHandler}>
          { props.icon }
          { props.letter }
        </button>
      </div>
    </>
  )
}
