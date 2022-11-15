/*
  Warnings:

  - You are about to drop the column `last_update` on the `blocks` table. All the data in the column will be lost.
  - You are about to drop the column `moves` on the `pentas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blocks" DROP COLUMN "last_update",
ADD COLUMN     "lastUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "pentas" DROP COLUMN "moves",
ADD COLUMN     "moveCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Move" (
    "id" TEXT NOT NULL,
    "pentaId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "moveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "translation" JSONB NOT NULL,
    "rotation" JSONB NOT NULL,
    "reflection" BOOLEAN NOT NULL,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_pentaId_fkey" FOREIGN KEY ("pentaId") REFERENCES "pentas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
