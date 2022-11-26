import React, { useEffect, useState } from 'react'
import { trpc } from '../../utils/trpc'

// * Represents a grid square with a color

export default function Square (props: { color: string, size?: number }) {
  const { data: colorLookup } = trpc.color.getColorLookup.useQuery()
  const [color, setColor] = useState('#ffffff')

  useEffect(() => {
    if (props?.color?.[0] === '#') {
      setColor(props.color)
    } else {
      setColor(colorLookup?.[props.color]?.hexCode ?? '#ffffff')
    }
  }, [props.color, colorLookup])

  const inlineStyle = {
    backgroundColor: color
  }

  let roundedClass = 'rounded-md'
  // * think of the 60 as the default value of the size prop
  if ((props.size ?? 60) <= 20) { roundedClass = 'rounded-sm' }

  const classes = [roundedClass, 'm-[.5px]', 'transition-color', 'duration-200', 'ease-in-out']

  /* eslint-disable no-multi-spaces, @typescript-eslint/brace-style */
  if      (props.size === 8)  { classes.push('w-[8px]  h-[8px] ') }
  else if (props.size === 10) { classes.push('w-[10px] h-[10px]') }
  else if (props.size === 12) { classes.push('w-[12px] h-[12px]') }
  else if (props.size === 15) { classes.push('w-[15px] h-[15px]') }
  else if (props.size === 20) { classes.push('w-[20px] h-[20px]') }
  else if (props.size === 25) { classes.push('w-[25px] h-[25px]') }
  else if (props.size === 30) { classes.push('w-[30px] h-[30px]') }
  else if (props.size === 35) { classes.push('w-[35px] h-[35px]') }
  else if (props.size === 40) { classes.push('w-[40px] h-[40px]') }
  else                        { classes.push('w-[60px] h-[60px]') }
  /* eslint-enable no-multi-spaces, @typescript-eslint/brace-style */

  return (
    <>
      <div className={classes.join(' ')} style={inlineStyle}>
      </div>
    </>
  )
}
