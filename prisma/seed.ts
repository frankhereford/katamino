import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {

  const user = await prisma.user.findFirst({
    where: {
      name: 'frank',
    }
  })

  const colors = {
    white: "#ffffff",
    lightGrey: "#d3d3d3",
    grey: "#808080",
    red: "#b40d0d",
    green: "#95ff85",
    darkGrey: "#353535",
    purple: "#66009d",
    brown: "#583200",
    darkBlue: "#0222b1",
    darkGreen: "#004d00",
    yellow: "#f9d237",
    teal: "#00b3b3",
    blue: "#39c9f1",
    orange: "#ff6600",
    pink: "#ff47c8"
  }

  for  await (const [key, value] of Object.entries(colors)) {
    await prisma.color.upsert({
      where: { name: key},
      update: {},
      create: {
        name: key,
        hexCode: value,
        }
    })
  }

  const deletePieces = await prisma.piece.deleteMany({})

  const pieces = [
    {name: 'darkBlue',
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
    {name: 'darkGrey',
     shape: [[0,0,0,0,0],
             [0,0,1,0,0],
             [0,1,1,1,0],
             [0,1,0,0,0],
             [0,0,0,0,0]]},
    {name: 'darkGreen',
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
      }
    })
  })


  const pentas = [
    {
      columns: 3,
      pieces: [
        'red', 'blue', 'green',
      ]
    }
  ]

  pentas.forEach(async (penta) => {
    penta.pieces.forEach(async (color) => {

      const colorRecord = await prisma.color.findFirst({
        where: {
          name: color,
        },
        include: {
          pieces: true
        }
      })

      const pieceRecord = await prisma.piece.findMany({
        where: {
          color: { 
            is: {
              name: {
                equals: color,
              }
            }
          }
        }
      })

      console.log(color, ": ", pieceRecord, " - ", colorRecord)
    
      console.log(colorRecord?.pieces)
    
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