import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {

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