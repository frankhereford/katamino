import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ['query'] })

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

  for await (const [key, value] of Object.entries(colors)) {
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

  await Promise.all(pieces.map(async (piece) => {
    const color = await prisma.color.findFirst({
      where: {
        name: piece.name,
      }
    })
 
    const createdPiece = await prisma.piece.create({
      data: {
        shape: piece.shape,
        color: { connect: { id: color?.id }, },
      }
    })
    //console.log(createdPiece)
  }))

  const deletePentas = await prisma.penta.deleteMany()
  const deleteAvailablePentas = await prisma.availablePenta.deleteMany()

  const pentas = [
    { slamName: "Small Slam", rowName: "A", minColumns: 3, pieces: [ 'orange', 'brown', 'darkGreen', 'pink', 'green', 'teal', 'blue', 'purple' ] },
    { slamName: "Small Slam", rowName: "B", minColumns: 3, pieces: [ 'purple', 'pink', 'yellow', 'orange', 'teal', 'brown', 'darkGreen', 'green' ] },
    { slamName: "Small Slam", rowName: "C", minColumns: 3, pieces: [ 'orange', 'blue', 'pink', 'brown', 'purple', 'yellow', 'teal', 'darkGrey' ] },
    { slamName: "Small Slam", rowName: "D", minColumns: 3, pieces: ['brown', 'pink', 'yellow', 'purple', 'blue', 'darkGrey', 'green', 'darkGreen' ] },
  ]

  await Promise.all(pentas.map(async (penta) => {
    let colors = ['']
    for (let i = penta.minColumns; i <= penta.pieces.length; i++) {
      colors = penta.pieces.slice(0, i)
      const pieces = await prisma.piece.findMany({
        where: {
          color: {
            name: {
              in: colors,
            }
          }
        }
      })
      const availablePentaRecord = await prisma.availablePenta.create({
        data: {
          columns: i,
          slamName: penta.slamName,
          rowName: penta.rowName,
          availableBlocks: {
            create: pieces.map((piece) => {
              return {
                piece: { connect: { id: piece.id }, },
                translation: {
                  up: 0,
                  right: 0
                },
                rotation: {
                  clockwise: 0
                },
                reflection: false,
              }
            })
          }
        }
      })
    }
  }))
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