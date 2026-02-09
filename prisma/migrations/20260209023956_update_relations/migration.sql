/*
  Warnings:

  - You are about to drop the column `sessionMetricsId` on the `LatihanSession` table. All the data in the column will be lost.
  - Added the required column `sessionType` to the `SessionMetrics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `LatihanSession` DROP FOREIGN KEY `LatihanSession_sessionMetricsId_fkey`;

-- DropForeignKey
ALTER TABLE `SessionMetrics` DROP FOREIGN KEY `SessionMetrics_sessionId_fkey`;

-- DropIndex
DROP INDEX `LatihanSession_sessionMetricsId_fkey` ON `LatihanSession`;

-- AlterTable
ALTER TABLE `LatihanSession` DROP COLUMN `sessionMetricsId`;

-- AlterTable
ALTER TABLE `SessionMetrics` ADD COLUMN `sessionType` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `SessionMetrics_sessionId_idx` ON `SessionMetrics`(`sessionId`);

-- CreateIndex
CREATE INDEX `SessionMetrics_sessionType_idx` ON `SessionMetrics`(`sessionType`);

-- CreateIndex
CREATE INDEX `SessionMetrics_burnoutLevel_idx` ON `SessionMetrics`(`burnoutLevel`);

-- CreateIndex
CREATE INDEX `SessionMetrics_fatigueIndex_idx` ON `SessionMetrics`(`fatigueIndex`);

-- AddForeignKey
ALTER TABLE `SessionMetrics` ADD CONSTRAINT `SessionMetrics_utbkSession_fkey` FOREIGN KEY (`sessionId`) REFERENCES `UtbkSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SessionMetrics` ADD CONSTRAINT `SessionMetrics_latihanSession_fkey` FOREIGN KEY (`sessionId`) REFERENCES `LatihanSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
