/*
  Warnings:

  - You are about to alter the column `discount` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Double`.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `discount` DOUBLE NOT NULL DEFAULT 0;
