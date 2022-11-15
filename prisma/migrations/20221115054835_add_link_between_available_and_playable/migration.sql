/*
  Warnings:

  - Added the required column `availablePentaId` to the `pentas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pentas" ADD COLUMN     "availablePentaId" TEXT NOT NULL,
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "pentas" ADD CONSTRAINT "pentas_availablePentaId_fkey" FOREIGN KEY ("availablePentaId") REFERENCES "available_pentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
