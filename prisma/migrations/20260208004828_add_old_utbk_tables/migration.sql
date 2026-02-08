-- DropIndex
DROP INDEX `AIPembahasan_createdAt_idx` ON `AIPembahasan`;

-- DropIndex
DROP INDEX `AIPembahasan_sessionId_idx` ON `AIPembahasan`;

-- AlterTable
ALTER TABLE `PilihanJawaban` MODIFY `soalUTBKId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `gayaBelajar` ENUM('VISUAL', 'AUDITORY', 'KINESTHETIC') NULL;

-- CreateTable
CREATE TABLE `UtbkSession` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('TPS', 'LITERASI', 'TRY_OUT', 'LATIHAN') NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `score` INTEGER NULL,

    INDEX `UtbkSession_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SoalUTBK` (
    `id` VARCHAR(191) NOT NULL,
    `tipe` ENUM('PU', 'PBM', 'PPU', 'PK', 'LITERASIBINDO', 'LITERASIBINGG') NOT NULL,
    `tipeSesi` ENUM('TPS', 'LITERASI', 'TRY_OUT', 'LATIHAN') NOT NULL,
    `content` TEXT NOT NULL,
    `kunciJawaban` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PembahasanSoalUTBK` (
    `id` VARCHAR(191) NOT NULL,
    `soalUTBKId` VARCHAR(191) NOT NULL,
    `gayaBelajar` ENUM('VISUAL', 'AUDITORY', 'KINESTHETIC') NOT NULL,
    `konten` TEXT NOT NULL,

    INDEX `PembahasanSoalUTBK_soalUTBKId_idx`(`soalUTBKId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UtbkJawabanUser` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `soalUTBKId` VARCHAR(191) NOT NULL,
    `pilihanId` VARCHAR(191) NOT NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `answeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UtbkJawabanUser_sessionId_idx`(`sessionId`),
    INDEX `UtbkJawabanUser_soalUTBKId_idx`(`soalUTBKId`),
    UNIQUE INDEX `UtbkJawabanUser_sessionId_soalUTBKId_key`(`sessionId`, `soalUTBKId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SessionMetrics` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `velocityScore` DOUBLE NULL,
    `timeEfficiency` DOUBLE NULL,
    `consistency` DOUBLE NULL,
    `improvement` DOUBLE NULL,
    `burnoutLevel` VARCHAR(191) NULL,
    `fatigueIndex` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SessionMetrics_sessionId_key`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `PilihanJawaban_soalUTBKId_idx` ON `PilihanJawaban`(`soalUTBKId`);

-- AddForeignKey
ALTER TABLE `PilihanJawaban` ADD CONSTRAINT `PilihanJawaban_soalUTBKId_fkey` FOREIGN KEY (`soalUTBKId`) REFERENCES `SoalUTBK`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UtbkSession` ADD CONSTRAINT `UtbkSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembahasanSoalUTBK` ADD CONSTRAINT `PembahasanSoalUTBK_soalUTBKId_fkey` FOREIGN KEY (`soalUTBKId`) REFERENCES `SoalUTBK`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UtbkJawabanUser` ADD CONSTRAINT `UtbkJawabanUser_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `UtbkSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UtbkJawabanUser` ADD CONSTRAINT `UtbkJawabanUser_soalUTBKId_fkey` FOREIGN KEY (`soalUTBKId`) REFERENCES `SoalUTBK`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SessionMetrics` ADD CONSTRAINT `SessionMetrics_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `UtbkSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
