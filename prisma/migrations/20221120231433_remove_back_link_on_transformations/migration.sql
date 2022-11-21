/*
  Warnings:

  - You are about to drop the column `blockId` on the `transformations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transformations" DROP CONSTRAINT "transformations_blockId_fkey";

-- AlterTable
ALTER TABLE "transformations" DROP COLUMN "blockId";
