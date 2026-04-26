import React from 'react'
import type { ReactNode } from 'react'

export default function ControlButton (props: {
  classes: string
  clickHandler: () => void
  icon: ReactNode
  letter?: string
}) {
  return (
    <button className={props.classes} onClick={props.clickHandler}>
      {props.icon}
      {props.letter}
    </button>
  )
}
