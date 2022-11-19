/*
  Warnings:

  - You are about to drop the column `availableBlockId` on the `available_transformations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slamId,rowName,columns]` on the table `available_pentas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `pieces` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `slams` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `pieces` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "available_transformations" DROP CONSTRAINT "available_transformations_availableBlockId_fkey";

-- DropIndex
DROP INDEX "pieces_colorId_key";

-- AlterTable
ALTER TABLE "available_pentas" ALTER COLUMN "rowName" SET DEFAULT '🤷🏻‍♂️';

-- AlterTable
ALTER TABLE "available_transformations" DROP COLUMN "availableBlockId";

-- AlterTable
ALTER TABLE "colors" ALTER COLUMN "hexCode" SET DEFAULT '#ff00ff';

-- AlterTable
ALTER TABLE "pieces" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "slams" ALTER COLUMN "name" SET DEFAULT '🤷🏼';

-- CreateIndex
CREATE UNIQUE INDEX "available_pentas_slamId_rowName_columns_key" ON "available_pentas"("slamId", "rowName", "columns");

-- CreateIndex
CREATE UNIQUE INDEX "pieces_slug_key" ON "pieces"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "slams_name_key" ON "slams"("name");
