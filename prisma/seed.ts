import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ['query'] })

async function main (): Promise<void> {
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

    if (newPiece == null) {
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
    // { slamName: 'Small Slam', rowName: '🧪', minColumns: 3, pieces: ['darkBlue', 'orange', 'darkGreen', 'purple'] }
    { slamName: 'Small Slam', rowName: 'A', minColumns: 3, pieces: ['orange', 'brown', 'darkGreen', 'pink', 'green', 'teal', 'blue', 'purple'] },
    { slamName: 'Small Slam', rowName: 'B', minColumns: 3, pieces: ['purple', 'pink', 'yellow', 'orange', 'teal', 'brown', 'darkGreen', 'green'] },
    { slamName: 'Small Slam', rowName: 'C', minColumns: 3, pieces: ['orange', 'blue', 'pink', 'brown', 'purple', 'yellow', 'teal', 'darkGrey'] },
    { slamName: 'Small Slam', rowName: 'D', minColumns: 3, pieces: ['brown', 'pink', 'yellow', 'purple', 'blue', 'darkGrey', 'green', 'darkGreen'] },
    { slamName: 'Small Slam', rowName: 'E', minColumns: 3, pieces: ['orange', 'purple', 'blue', 'teal', 'yellow', 'darkGreen', 'brown', 'green'] },
    { slamName: 'Small Slam', rowName: 'F', minColumns: 3, pieces: ['pink', 'yellow', 'darkGrey', 'brown', 'darkGreen', 'purple', 'orange', 'green'] },
    { slamName: 'Small Slam', rowName: 'G', minColumns: 3, pieces: ['orange', 'blue', 'pink', 'teal', 'brown', 'green', 'purple', 'darkGrey'] },
    { slamName: 'The Slam', rowName: 'A', minColumns: 5, pieces: ['orange', 'pink', 'yellow', 'darkGrey', 'green', 'brown', 'teal', 'purple', 'blue'] },
    { slamName: 'The Slam', rowName: 'B', minColumns: 5, pieces: ['brown', 'purple', 'pink', 'yellow', 'teal', 'blue', 'darkGreen', 'orange', 'darkGrey'] },
    { slamName: 'The Slam', rowName: 'C', minColumns: 5, pieces: ['orange', 'brown', 'blue', 'green', 'lightGreen', 'teal', 'darkGrey', 'yellow', 'pink'] },
    { slamName: 'The Slam', rowName: 'D', minColumns: 5, pieces: ['purple', 'blue', 'pink', 'yellow', 'darkGrey', 'green', 'orange', 'teal', 'darkGreen'] },
    { slamName: 'The Slam', rowName: 'E', minColumns: 5, pieces: ['orange', 'brown', 'purple', 'pink', 'green', 'darkGreen', 'blue', 'darkGrey', 'yellow'] },
    { slamName: 'The Slam', rowName: 'F', minColumns: 5, pieces: ['orange', 'pink', 'yellow', 'teal', 'darkGreen', 'darkGrey', 'purple', 'green', 'brown'] },
    { slamName: 'The Slam', rowName: 'G', minColumns: 5, pieces: ['orange', 'blue', 'pink', 'yellow', 'green', 'purple', 'brown', 'darkGreen', 'teal'] },
    { slamName: 'The Slam', rowName: 'H', minColumns: 5, pieces: ['orange', 'purple', 'pink', 'darkGreen', 'green', 'teal', 'brown', 'darkGrey', 'blue'] },
    { slamName: 'The Slam', rowName: 'I', minColumns: 5, pieces: ['orange', 'brown', 'blue', 'yellow', 'teal', 'darkGrey', 'green', 'purple', 'darkGreen'] },
    { slamName: 'The Slam', rowName: 'J', minColumns: 5, pieces: ['orange', 'blue', 'pink', 'darkGrey', 'green', 'brown', 'yellow', 'darkGreen', 'purple'] },
    { slamName: 'The Slam', rowName: 'K', minColumns: 5, pieces: ['orange', 'brown', 'purple', 'yellow', 'green', 'darkGrey', 'pink', 'blue', 'teal'] },
    { slamName: 'The Slam', rowName: 'L', minColumns: 5, pieces: ['brown', 'blue', 'pink', 'teal', 'green', 'purple', 'darkGrey', 'darkGreen', 'yellow'] },
    { slamName: 'The Slam', rowName: 'M', minColumns: 5, pieces: ['orange', 'brown', 'blue', 'pink', 'darkGrey', 'yellow', 'darkGreen', 'teal', 'green'] },
    { slamName: 'The Slam', rowName: 'N', minColumns: 5, pieces: ['orange', 'brown', 'pink', 'teal', 'green', 'purple', 'yellow', 'blue', 'darkGreen'] },
    { slamName: 'The Slam', rowName: 'O', minColumns: 6, pieces: ['orange', 'brown', 'purple', 'yellow', 'darkGrey', 'darkGreen', 'teal', 'pink'] },
    { slamName: 'The Slam', rowName: 'P', minColumns: 6, pieces: ['orange', 'purple', 'blue', 'pink', 'teal', 'darkGrey', 'darkGreen', 'brown'] },
    { slamName: 'The Slam', rowName: 'Q', minColumns: 6, pieces: ['orange', 'brown', 'pink', 'teal', 'darkGrey', 'green', 'blue', 'yellow'] },
    { slamName: 'The Slam', rowName: 'R', minColumns: 6, pieces: ['orange', 'purple', 'blue', 'pink', 'yellow', 'darkGreen', 'green', 'darkGrey'] },
    { slamName: 'The Slam', rowName: 'S', minColumns: 6, pieces: ['brown', 'blue', 'pink', 'yellow', 'darkGreen', 'green', 'orange', 'teal'] },
    { slamName: 'The Slam', rowName: 'T', minColumns: 6, pieces: ['orange', 'brown', 'blue', 'teal', 'darkGrey', 'darkGreen', 'pink', 'green'] },
    { slamName: 'The Slam', rowName: 'U', minColumns: 6, pieces: ['orange', 'purple', 'blue', 'pink', 'yellow', 'darkGrey', 'teal', 'darkGreen'] },
    { slamName: 'The Slam', rowName: 'V', minColumns: 6, pieces: ['purple', 'blue', 'pink', 'yellow', 'teal', 'darkGreen', 'darkGrey', 'brown'] },
    { slamName: 'The Slam', rowName: 'W', minColumns: 6, pieces: ['purple', 'blue', 'pink', 'yellow', 'teal', 'darkGrey', 'brown', 'green'] },
    { slamName: 'The Slam', rowName: 'X', minColumns: 6, pieces: ['brown', 'purple', 'blue', 'pink', 'darkGreen', 'green', 'teal', 'yellow'] },
    { slamName: 'The Slam', rowName: 'Y', minColumns: 6, pieces: ['orange', 'purple', 'yellow', 'teal', 'darkGrey', 'darkGreen', 'blue', 'brown'] },
    { slamName: 'The Slam', rowName: 'Z', minColumns: 6, pieces: ['orange', 'brown', 'pink', 'darkGrey', 'darkGreen', 'green', 'yellow', 'teal'] },
    { slamName: 'The Slam', rowName: '️♤', minColumns: 6, pieces: ['brown', 'purple', 'pink', 'yellow', 'teal', 'darkGreen', 'darkGrey', 'green'] },
    { slamName: 'The Slam', rowName: '️♡', minColumns: 6, pieces: ['orange', 'purple', 'blue', 'yellow', 'darkGrey', 'green', 'brown', 'darkGreen'] },
    { slamName: 'The Slam', rowName: '♢️', minColumns: 6, pieces: ['orange', 'purple', 'blue', 'pink', 'darkGrey', 'darkGreen', 'green', 'teal'] },
    { slamName: 'The Slam', rowName: '️♧', minColumns: 6, pieces: ['orange', 'blue', 'pink', 'yellow', 'darkGrey', 'darkGreen', 'purple', 'brown'] },
    { slamName: 'The Ultimate Slam', rowName: 'A', minColumns: 4, pieces: ['orange', 'purple', 'blue', 'teal', 'yellow', 'darkGreen', 'pink', 'red', 'darkGrey', 'darkBlue', 'green'] },
    { slamName: 'The Ultimate Slam', rowName: 'B', minColumns: 4, pieces: ['orange', 'brown', 'yellow', 'darkGrey', 'teal', 'blue', 'red', 'pink', 'darkBlue', 'purple', 'darkGreen'] },
    { slamName: 'The Ultimate Slam', rowName: 'C', minColumns: 4, pieces: ['orange', 'brown', 'blue', 'pink', 'darkGrey', 'green', 'purple', 'yellow', 'teal', 'darkGreen', 'darkBlue'] },
    { slamName: 'The Ultimate Slam', rowName: 'D', minColumns: 4, pieces: ['brown', 'pink', 'yellow', 'darkGrey', 'darkGreen', 'red', 'orange', 'blue', 'green', 'teal', 'purple'] },
    { slamName: 'The Ultimate Slam', rowName: 'E', minColumns: 4, pieces: ['orange', 'brown', 'pink', 'teal', 'green', 'purple', 'darkGreen', 'darkGrey', 'darkBlue', 'yellow', 'red'] },
    { slamName: 'The Ultimate Slam', rowName: 'F', minColumns: 4, pieces: ['orange', 'pink', 'yellow', 'darkGrey', 'red', 'brown', 'darkBlue', 'purple', 'darkGreen', 'green', 'blue'] },
    { slamName: 'The Ultimate Slam', rowName: 'G', minColumns: 4, pieces: ['orange', 'brown', 'pink', 'green', 'purple', 'yellow', 'blue', 'teal', 'red', 'darkBlue', 'darkGrey'] },
    { slamName: 'The Ultimate Slam', rowName: 'H', minColumns: 4, pieces: ['brown', 'purple', 'blue', 'darkGreen', 'darkGrey', 'darkBlue', 'teal', 'green', 'orange', 'red', 'yellow'] },
    { slamName: 'The Ultimate Slam', rowName: 'I', minColumns: 4, pieces: ['orange', 'blue', 'pink', 'teal', 'purple', 'darkGrey', 'green', 'darkBlue', 'purple', 'darkGreen', 'red'] },
    { slamName: 'The Ultimate Slam', rowName: 'J', minColumns: 4, pieces: ['orange', 'brown', 'pink', 'darkGreen', 'green', 'purple', 'darkBlue', 'blue', 'yellow', 'red', 'teal'] },
    { slamName: 'The Ultimate Slam', rowName: 'K', minColumns: 4, pieces: ['brown', 'purple', 'pink', 'yellow', 'blue', 'teal', 'red', 'darkBlue', 'green', 'darkGrey', 'darkGreen'] },
    { slamName: 'The Ultimate Slam', rowName: 'L', minColumns: 4, pieces: ['orange', 'brown', 'blue', 'yellow', 'teal', 'darkBlue', 'darkGrey', 'darkGreen', 'red', 'pink', 'green'] },
    { slamName: 'The Ultimate Slam', rowName: 'A′', minColumns: 5, pieces: ['orange', 'purple', 'pink', 'darkGreen', 'green', 'teal', 'blue', 'darkBlue', 'yellow', 'brown', 'darkGrey'] },
    { slamName: 'The Ultimate Slam', rowName: 'B′', minColumns: 5, pieces: ['orange', 'brown', 'purple', 'blue', 'pink', 'darkGreen', 'green', 'red', 'darkGrey', 'darkBlue', 'teal'] },
    { slamName: 'The Ultimate Slam', rowName: 'C′', minColumns: 5, pieces: ['orange', 'pink', 'yellow', 'darkGrey', 'green', 'darkBlue', 'teal', 'purple', 'blue', 'darkGreen', 'red'] },
    { slamName: 'The Ultimate Slam', rowName: 'D′', minColumns: 5, pieces: ['brown', 'purple', 'pink', 'yellow', 'teal', 'orange', 'red', 'blue', 'darkGreen', 'green', 'darkBlue'] },
    { slamName: 'The Ultimate Slam', rowName: 'E′', minColumns: 5, pieces: ['brown', 'blue', 'pink', 'teal', 'green', 'purple', 'darkGreen', 'darkBlue', 'red', 'yellow', 'darkGrey'] },
    { slamName: 'The Ultimate Slam', rowName: 'F′', minColumns: 5, pieces: ['purple', 'blue', 'pink', 'yellow', 'darkGrey', 'red', 'brown', 'orange', 'darkBlue', 'darkGreen', 'green'] },
    { slamName: 'The Ultimate Slam', rowName: 'G′', minColumns: 5, pieces: ['orange', 'pink', 'yellow', 'darkGreen', 'red', 'darkGrey', 'purple', 'teal', 'brown', 'blue', 'darkBlue'] },
    { slamName: 'The Ultimate Slam', rowName: 'H′', minColumns: 5, pieces: ['orange', 'blue', 'pink', 'darkGrey', 'green', 'darkBlue', 'yellow', 'darkGreen', 'red', 'teal', 'brown'] },
    { slamName: 'The Ultimate Slam', rowName: 'I′', minColumns: 5, pieces: ['orange', 'pink', 'yellow', 'teal', 'darkGreen', 'brown', 'darkBlue', 'red', 'purple', 'darkGrey', 'green'] },
    { slamName: 'The Ultimate Slam', rowName: 'J′', minColumns: 5, pieces: ['orange', 'brown', 'blue', 'darkGreen', 'green', 'teal', 'darkGrey', 'darkBlue', 'yellow', 'red', 'purple'] },
    { slamName: 'The Ultimate Slam', rowName: 'K′', minColumns: 5, pieces: ['orange', 'purple', 'pink', 'yellow', 'teal', 'red', 'darkBlue', 'brown', 'green', 'darkGrey', 'blue'] },
    { slamName: 'The Ultimate Slam', rowName: 'L′', minColumns: 5, pieces: ['orange', 'blue', 'pink', 'yellow', 'green', 'brown', 'red', 'darkGrey', 'teal', 'purple', 'darkGreen'] },

    { slamName: 'The Full Board', rowName: '😉', minColumns: 12, pieces: ['brown', 'pink', 'yellow', 'purple', 'blue', 'darkGrey', 'green', 'darkGreen', 'darkBlue', 'teal', 'red', 'orange'] }
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function test (): Promise<void> {
  const availablePentas = await prisma.availablePenta.findMany({
    include: {
      availableBlocks: {
        include: {
          piece: {
            include: {
              color: true
            }
          },
          availableTransformation: true
        }
      }
    }
  })

  const frank = await prisma.user.findFirst({
    where: {
      email: 'frank@frankhereford.com'
    }
  })

  availablePentas.map(async (availablePenta) => {
    console.log('👋')
    // console.log(availablePenta)
    const penta = await prisma.penta.create({
      data: {
        user: { connect: { id: frank?.id } },
        availablePenta: { connect: { id: availablePenta.id } },
        columns: availablePenta.columns,
        borderWidth: 2,
        blocks: {
          create: availablePenta.availableBlocks.map((availableBlock) => {
            return {
              piece: { connect: { id: availableBlock.piece.id } },
              transformation: {
                create: {
                  visible: false
                }
              }
            }
          })
        }
      }
    })
    console.log(penta)

    return true
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
