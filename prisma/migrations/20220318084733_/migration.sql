/*
  Warnings:

  - A unique constraint covering the columns `[couponId]` on the table `couponitem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `couponitem_couponId_key` ON `couponitem`(`couponId`);
