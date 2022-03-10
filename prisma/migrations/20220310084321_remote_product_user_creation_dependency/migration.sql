/*
  Warnings:

  - You are about to drop the column `userId` on the `product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `product_userId_fkey`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `userId`,
    MODIFY `price` DECIMAL(15, 2) NOT NULL;
