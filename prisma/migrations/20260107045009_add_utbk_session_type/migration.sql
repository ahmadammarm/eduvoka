/*
  Warnings:

  - Added the required column `tipeSesi` to the `SoalUTBK` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `UtbkSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SoalUTBK` ADD COLUMN `tipeSesi` ENUM('TPS', 'LITERASI') NOT NULL;

-- AlterTable
ALTER TABLE `UtbkSession` ADD COLUMN `type` ENUM('TPS', 'LITERASI') NOT NULL;
