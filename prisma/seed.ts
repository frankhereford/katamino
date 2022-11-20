import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ['query'] })

async function main () {
  console.log('🍄')
  const colors = {
    white: '#ffffff',
    lightGrey: '#d3d3d3',
    grey: '#808080',
    red: '#b40d0d',
    green: '#95ff85',
    darkGrey: '#353535',
    purple: '#66009d',
    brown: '#583200',
    darkBlue: '#0222b1',
    darkGreen: '#004d00',
    yellow: '#f9d237',
    teal: '#00b3b3',
    blue: '#39c9f1',
    orange: '#ff6600',
    pink: '#ff47c8'
  }

  for await (const [key, value] of Object.entries(colors)) {
    await prisma.color.upsert({
      where: { name: key },
      update: {},
      create: {
        name: key,
        hexCode: value
      }
    })
  }

  const pieces = [
    {
      name: 'darkBlue',
      shape: [[0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0]]
    },
    {
      name: 'orange',
      shape: [[0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0]]
    },
    {
      name: 'brown',
      shape: [[0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0]]
    },
    {
      name: 'purple',
      shape: [[0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 1, 0, 0]]
    },
    {
      name: 'blue',
      shape: [[0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0]]
    },
    {
      name: 'pink',
      shape: [[0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0]]
    },
    {
      name: 'yellow',
      shape: [[0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]]
    },
    {
      name: 'teal',
      shape: [[0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0]]
    },
    {
      name: 'darkGrey',
      shape: [[0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0]]
    },
    {
      name: 'darkGreen',
      shape: [[0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0]]
    },
    {
      name: 'green',
      shape: [[0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0]]
    },
    {
      name: 'red',
      shape: [[0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0]]
    }
  ]

  await Promise.all(pieces.map(async (piece) => {
    const color = await prisma.color.findFirst({
      where: {
        name: piece.name
      }
    })

    if (color == null) {
      throw new Error(`No color found for ${piece.name}`)
    }

    const newPiece = await prisma.piece.upsert({
      where: {
        slug: piece.name
      },
      update: {},
      create: {
        slug: piece.name,
        color: {
          connect: {
            id: color.id
          }
        },
        shape: piece.shape
      }
    })

    if (!newPiece) {
      throw new Error(`No piece created for ${piece.name}`)
    }
  }))

  await prisma.slam.upsert({
    where: {
      name: 'Small Slam'
    },
    update: {},
    create: {
      name: 'Small Slam',
      slamOrder: 1
    }
  })

  await prisma.slam.upsert({
    where: {
      name: 'The Slam'
    },
    update: {},
    create: {
      name: 'The Slam',
      slamOrder: 2
    }
  })

  await prisma.slam.upsert({
    where: {
      name: 'The Ultimate Slam'
    },
    update: {},
    create: {
      name: 'The Ultimate Slam',
      slamOrder: 3
    }
  })

  await prisma.slam.upsert({
    where: {
      name: 'The Full Board'
    },
    update: {},
    create: {
      name: 'The Full Board',
      slamOrder: 4
    }
  })

  const pentas = [
    { slamName: 'Small Slam', rowName: 'A', minColumns: 3, pieces: ['orange', 'brown', 'darkGreen', 'pink', 'green', 'teal', 'blue', 'purple'] },
    { slamName: 'Small Slam', rowName: 'B', minColumns: 3, pieces: ['purple', 'pink', 'yellow', 'orange', 'teal', 'brown', 'darkGreen', 'green'] },
    { slamName: 'Small Slam', rowName: 'C', minColumns: 3, pieces: ['orange', 'blue', 'pink', 'brown', 'purple', 'yellow', 'teal', 'darkGrey'] },
    { slamName: 'Small Slam', rowName: 'D', minColumns: 3, pieces: ['brown', 'pink', 'yellow', 'purple', 'blue', 'darkGrey', 'green', 'darkGreen'] },
    { slamName: 'Small Slam', rowName: 'E', minColumns: 3, pieces: ['orange', 'purple', 'blue', 'teal', 'yellow', 'darkGreen', 'brown', 'green'] },
    { slamName: 'Small Slam', rowName: 'F', minColumns: 3, pieces: ['pink', 'yellow', 'darkGrey', 'brown', 'green', 'purple', 'orange', 'green'] },
    { slamName: 'Small Slam', rowName: 'G', minColumns: 3, pieces: ['orange', 'blue', 'pink', 'teal', 'brown', 'green', 'purple', 'darkGrey'] },

    { slamName: 'The Slam', rowName: 'A', minColumns: 5, pieces: ['orange', 'pink', 'yellow', 'darkGrey', 'green', 'brown', 'teal', 'purple', 'blue'] },
    /*
    { slamName: "The Slam", rowName: "B", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "C", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "D", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "E", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "F", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "G", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "H", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "I", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "J", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "K", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "L", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "M", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "N", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "O", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "P", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "Q", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "R", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "S", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "T", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "U", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "V", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "W", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "X", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "Y", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "Z", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "️♤", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "️♡", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "♢️", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    { slamName: "The Slam", rowName: "️♧", minColumns: 5, pieces: ['', '', '', '', '', '', '', '', ''] },
    */

    { slamName: 'The Full Board', rowName: 'A', minColumns: 12, pieces: ['brown', 'pink', 'yellow', 'purple', 'blue', 'darkGrey', 'green', 'darkGreen', 'darkBlue', 'teal', 'red', 'orange'] }
  ]

  await Promise.all(pentas.map(async (penta) => {
    let colors = ['']
    for (let i = penta.minColumns; i <= penta.pieces.length; i++) {
      colors = penta.pieces.slice(0, i)
      const pieces = await prisma.piece.findMany({
        where: {
          color: {
            name: {
              in: colors
            }
          }
        }
      })
      const slam = await prisma.slam.findFirst({
        where: {
          name: penta.slamName
        }
      })

      if (slam == null) {
        throw new Error(`No slam found for ${penta.slamName}`)
      }

      await prisma.availablePenta.upsert({
        where: {
          slamId_rowName_columns: {
            slamId: slam.id,
            rowName: penta.rowName,
            columns: i
          }
        },
        update: {},
        create: {
          slam: { connect: { id: slam.id } },
          rowName: penta.rowName,
          columns: i,
          borderWidth: 2,
          availableBlocks: {
            create: pieces.map((piece) => {
              return {
                piece: { connect: { id: piece.id } },
                availableTransformation: {
                  create: {
                    visible: true,
                    reflection: false,
                    rotation: 0,
                    translationUp: 0,
                    translationRight: 0
                  }
                }
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
