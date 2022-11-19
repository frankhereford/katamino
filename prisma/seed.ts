import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ['query'] })

async function main() {
  console.log('🍄')
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
      where: { name: key },
      update: {},
      create: {
        name: key,
        hexCode: value,
      }
    })
  }

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