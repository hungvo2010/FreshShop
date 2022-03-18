/*
  Warnings:

  - Added the required column `expireIn` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coupon` ADD COLUMN `expireIn` DATETIME(3) NOT NULL;
