import { type Prisma } from '@prisma/client'

// this is a way to get at complex types out of the prisma db library
interface PentaProps {
  penta: Prisma.PentaGetPayload<{
    include: {
      blocks: {
        include: {
          piece: {
            include: {
              color: true
            }
          }
          transformation: true
        }
      }
    }
  }>
}

export default function Penta (props: PentaProps) {
  console.log(props.penta)

  return (
    <>
    </>
  )
}
