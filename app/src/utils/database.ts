
import { type Prisma } from '@prisma/client'

export function isPentaOwner (
  // eslint-disable-next-line @typescript-eslint/ban-types
  penta: Prisma.PentaGetPayload<{}> | null,
  userId: string
) {
  return penta?.userId === userId
}
