import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

  const user = await prisma.user.findFirst({
    where: {
      name: 'frank',
    }
  })
 
  const colors = [
    'red', 'green', 'dark-grey',
    'purple', 'brown', 'blue',
    'dark-green', 'yellow', 'teal',
    'dark-blue', 'orange', 'pink'
  ]

  colors.forEach(async (color) => {
    await prisma.color.upsert({
      where: { name: color },
      update: {},
      create: {
        name: color,
      },
    },
    )
  })

  const deletePieces = await prisma.piece.deleteMany({})

  const pieces = [
    {name: 'dark-blue',
     shape: [[0,0,1,0,0],
             [0,0,1,0,0],
             [0,0,1,0,0],
             [0,0,1,0,0],
             [0,0,1,0,0]]},
    {name: 'orange',
     shape: [[0,0,0,0,0],
             [0,0,1,1,0],
             [0,0,1,0,0],
             [0,0,1,0,0],
             [0,0,1,0,0]]},
    {name: 'brown',
     shape: [[0,0,0,0,0],
             [0,1,0,0,0],
             [0,1,1,0,0],
             [0,1,0,0,0],
             [0,1,0,0,0]]},
    {name: 'purple',
     shape: [[0,0,0,0,0],
             [0,0,0,1,0],
             [0,0,0,1,0],
             [0,0,1,1,0],
             [0,0,1,0,0]]},
    {name: 'blue',
     shape: [[0,0,0,0,0],
             [0,1,1,1,0],
             [0,1,0,0,0],
             [0,1,0,0,0],
             [0,0,0,0,0]]},
    {name: 'pink',
     shape: [[0,0,0,0,0],
             [0,1,0,0,0],
             [0,1,1,0,0],
             [0,1,1,0,0],
             [0,0,0,0,0]]},
    {name: 'yellow',
     shape: [[0,0,0,0,0],
             [0,1,1,1,0],
             [0,1,0,1,0],
             [0,0,0,0,0],
             [0,0,0,0,0]]},
    {name: 'teal',
     shape: [[0,0,0,0,0],
             [0,0,0,1,0],
             [0,1,1,1,0],
             [0,1,0,0,0],
             [0,0,0,0,0]]},
    {name: 'dark-grey',
     shape: [[0,0,0,0,0],
             [0,0,1,0,0],
             [0,1,1,1,0],
             [0,1,0,0,0],
             [0,0,0,0,0]]},
    {name: 'dark-green',
     shape: [[0,0,0,0,0],
             [0,1,1,1,0],
             [0,0,1,0,0],
             [0,0,1,0,0],
             [0,0,0,0,0]]},
    {name: 'green',
     shape: [[0,0,0,0,0],
             [0,0,0,1,0],
             [0,0,1,1,0],
             [0,1,1,0,0],
             [0,0,0,0,0]]},
    {name: 'red',
     shape: [[0,0,0,0,0],
             [0,0,1,0,0],
             [0,1,1,1,0],
             [0,0,1,0,0],
             [0,0,0,0,0]]},
  ]

  pieces.forEach(async (piece) => {
    const color = await prisma.color.findFirst({
      where: {
        name: piece.name,
      }
    })
 
    await prisma.piece.create({
      data: {
        shape: piece.shape,
        color: { connect: { id: color?.id }, },
        user: { connect: { id: user?.id }, }
      }
    })
  })




}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })