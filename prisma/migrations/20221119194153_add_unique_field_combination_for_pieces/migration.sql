/*
  Warnings:

  - A unique constraint covering the columns `[colorId,shape]` on the table `pieces` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pieces_colorId_shape_key" ON "pieces"("colorId", "shape");
