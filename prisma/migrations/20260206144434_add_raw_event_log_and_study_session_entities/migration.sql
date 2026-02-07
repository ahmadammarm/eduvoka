-- CreateTable
CREATE TABLE `RawEventLog` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `eventType` VARCHAR(191) NOT NULL,
    `payload` TEXT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sessionRef` VARCHAR(191) NULL,
    `synced` BOOLEAN NOT NULL DEFAULT true,

    INDEX `RawEventLog_userId_eventType_idx`(`userId`, `eventType`),
    INDEX `RawEventLog_userId_timestamp_idx`(`userId`, `timestamp`),
    INDEX `RawEventLog_sessionRef_idx`(`sessionRef`),
    INDEX `RawEventLog_eventType_timestamp_idx`(`eventType`, `timestamp`),
    INDEX `RawEventLog_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudySession` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `materiId` VARCHAR(191) NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `totalDuration` INTEGER NOT NULL DEFAULT 0,
    `idleDuration` INTEGER NOT NULL DEFAULT 0,
    `scrollDepthMax` DOUBLE NOT NULL DEFAULT 0,
    `scrollDepthAvg` DOUBLE NOT NULL DEFAULT 0,
    `totalScrollEvents` INTEGER NOT NULL DEFAULT 0,
    `totalVisibleTime` INTEGER NOT NULL DEFAULT 0,
    `totalHiddenTime` INTEGER NOT NULL DEFAULT 0,
    `visibilityChanges` INTEGER NOT NULL DEFAULT 0,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `isAbandoned` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `StudySession_userId_materiId_idx`(`userId`, `materiId`),
    INDEX `StudySession_userId_startedAt_idx`(`userId`, `startedAt`),
    INDEX `StudySession_materiId_idx`(`materiId`),
    INDEX `StudySession_startedAt_idx`(`startedAt`),
    INDEX `StudySession_isCompleted_idx`(`isCompleted`),
    INDEX `StudySession_userId_isCompleted_idx`(`userId`, `isCompleted`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RawEventLog` ADD CONSTRAINT `RawEventLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudySession` ADD CONSTRAINT `StudySession_materiId_fkey` FOREIGN KEY (`materiId`) REFERENCES `Materi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudySession` ADD CONSTRAINT `StudySession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
