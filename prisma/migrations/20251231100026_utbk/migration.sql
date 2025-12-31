/*
  Warnings:

  - You are about to drop the `pembahasansoalutbk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `utbk_jawaban_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `utbk_session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `utbk_jawaban_user` DROP FOREIGN KEY `utbk_jawaban_user_sessionId_fkey`;

-- DropTable
DROP TABLE `pembahasansoalutbk`;

-- DropTable
DROP TABLE `utbk_jawaban_user`;

-- DropTable
DROP TABLE `utbk_session`;

-- CreateTable
CREATE TABLE `PembahasanSoalUTBK` (
    `id` VARCHAR(191) NOT NULL,
    `soalUTBKId` VARCHAR(191) NOT NULL,
    `gayaBelajar` ENUM('VISUAL', 'AUDITORY', 'KINESTHETIC') NOT NULL,
    `konten` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PembahasanSoalUTBK_soalUTBKId_idx`(`soalUTBKId`),
    UNIQUE INDEX `PembahasanSoalUTBK_soalUTBKId_gayaBelajar_key`(`soalUTBKId`, `gayaBelajar`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UtbkSession` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `score` INTEGER NULL,

    INDEX `UtbkSession_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UtbkJawabanUser` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `soalUTBKId` VARCHAR(191) NOT NULL,
    `pilihanId` VARCHAR(191) NULL,
    `isCorrect` BOOLEAN NULL,
    `answeredAt` DATETIME(3) NULL,

    INDEX `UtbkJawabanUser_soalUTBKId_idx`(`soalUTBKId`),
    UNIQUE INDEX `UtbkJawabanUser_sessionId_soalUTBKId_key`(`sessionId`, `soalUTBKId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PembahasanSoalUTBK` ADD CONSTRAINT `PembahasanSoalUTBK_soalUTBKId_fkey` FOREIGN KEY (`soalUTBKId`) REFERENCES `SoalUTBK`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UtbkSession` ADD CONSTRAINT `UtbkSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UtbkJawabanUser` ADD CONSTRAINT `UtbkJawabanUser_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `UtbkSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UtbkJawabanUser` ADD CONSTRAINT `UtbkJawabanUser_soalUTBKId_fkey` FOREIGN KEY (`soalUTBKId`) REFERENCES `SoalUTBK`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UtbkJawabanUser` ADD CONSTRAINT `UtbkJawabanUser_pilihanId_fkey` FOREIGN KEY (`pilihanId`) REFERENCES `PilihanJawaban`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
