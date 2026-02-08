/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `LearningMetrics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `LearningMetrics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LatihanSession` ADD COLUMN `sessionMetricsId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `LearningMetrics` ADD COLUMN `sessionId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `LearningMetrics_sessionId_key` ON `LearningMetrics`(`sessionId`);

-- AddForeignKey
ALTER TABLE `LatihanSession` ADD CONSTRAINT `LatihanSession_sessionMetricsId_fkey` FOREIGN KEY (`sessionMetricsId`) REFERENCES `SessionMetrics`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LearningMetrics` ADD CONSTRAINT `LearningMetrics_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `LatihanSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
