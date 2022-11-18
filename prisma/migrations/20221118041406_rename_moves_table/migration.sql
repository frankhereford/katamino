/*
  Warnings:

  - You are about to drop the `Move` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Move" DROP CONSTRAINT "Move_blockId_fkey";

-- DropForeignKey
ALTER TABLE "Move" DROP CONSTRAINT "Move_pentaId_fkey";

-- DropTable
DROP TABLE "Move";

-- CreateTable
CREATE TABLE "moves" (
    "id" TEXT NOT NULL,
    "pentaId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "moveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incomingState" JSONB NOT NULL DEFAULT '{}',
    "outgoingState" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "moves_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "moves" ADD CONSTRAINT "moves_pentaId_fkey" FOREIGN KEY ("pentaId") REFERENCES "pentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moves" ADD CONSTRAINT "moves_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
