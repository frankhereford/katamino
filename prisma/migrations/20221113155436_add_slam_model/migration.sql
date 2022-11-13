/*
  Warnings:

  - You are about to drop the column `slamName` on the `available_pentas` table. All the data in the column will be lost.
  - Added the required column `slamId` to the `available_pentas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "available_pentas" DROP COLUMN "slamName",
ADD COLUMN     "slamId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "slams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slamOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "slams_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "available_pentas" ADD CONSTRAINT "available_pentas_slamId_fkey" FOREIGN KEY ("slamId") REFERENCES "slams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
