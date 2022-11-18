/*
  Warnings:

  - You are about to drop the column `reflection` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `rotation` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `translation` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `visible` on the `Move` table. All the data in the column will be lost.

*/

TRUNCATE TABLE "Move";

-- AlterTable
ALTER TABLE "Move" DROP COLUMN "reflection",
DROP COLUMN "rotation",
DROP COLUMN "translation",
DROP COLUMN "visible",
ADD COLUMN     "incomingState" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "outgoingState" JSONB NOT NULL DEFAULT '{}';
