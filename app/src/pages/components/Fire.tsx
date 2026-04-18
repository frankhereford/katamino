import { useEffect, useState } from 'react'
export default function Fire (props: {
  visible?: boolean
}) {
  const [classes, setClasses] = useState(['absolute top-[-50px] left-[-30px] text-[4rem] transition duration-700 ease-in delay-75 opacity-0'])
  useEffect(() => {
    if (props.visible ?? false) {
      setClasses(['absolute top-[-50px] left-[-30px] text-[4rem] transition duration-1000 ease-in delay-75 opacity-100'])
    } else {
      setClasses(['absolute top-[-50px] left-[-30px] text-[4rem] transition duration-1000 ease-in delay-75 opacity-0'])
    }
  }, [props.visible])
  return (
    <>
      {(props.visible ?? false) &&
        <div className='relative'>
          <div className={classes.join(' ')}>
            🔥
          </div>
        </div>
    }
    </>
  )
}
