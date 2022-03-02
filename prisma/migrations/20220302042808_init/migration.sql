/*
  Warnings:

  - A unique constraint covering the columns `[productId,cartId]` on the table `cartitem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `cartitem_productId_cartId_key` ON `cartitem`(`productId`, `cartId`);
