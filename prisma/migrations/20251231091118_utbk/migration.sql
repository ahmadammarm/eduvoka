/*
  Warnings:

  - The values [TPS,LITERASI] on the enum `soalutbk_tipe` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `label` to the `pilihanjawaban` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pilihanjawaban` ADD COLUMN `label` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `soalutbk` MODIFY `tipe` ENUM('PU', 'PBM', 'PPU', 'PK', 'LITERASIBINDO', 'LITERASIBINGG') NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isSubscribed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `subscriptionEndAt` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `pembahasansoalutbk` (
    `id` VARCHAR(191) NOT NULL,
    `soalUTBKId` VARCHAR(191) NOT NULL,
    `gayaBelajar` ENUM('VISUAL', 'AUDITORY', 'KINESTHETIC') NOT NULL,
    `konten` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `pembahasansoalutbk_soalUTBKId_idx`(`soalUTBKId`),
    UNIQUE INDEX `pembahasansoalutbk_soalUTBKId_gayaBelajar_key`(`soalUTBKId`, `gayaBelajar`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utbk_session` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `score` INTEGER NULL,

    INDEX `utbk_session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `utbk_jawaban_user` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `soalUTBKId` VARCHAR(191) NOT NULL,
    `pilihanId` VARCHAR(191) NULL,
    `isCorrect` BOOLEAN NULL,
    `answeredAt` DATETIME(3) NULL,

    INDEX `utbk_jawaban_user_soalUTBKId_idx`(`soalUTBKId`),
    UNIQUE INDEX `utbk_jawaban_user_sessionId_soalUTBKId_key`(`sessionId`, `soalUTBKId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pembahasansoalutbk` ADD CONSTRAINT `pembahasansoalutbk_soalUTBKId_fkey` FOREIGN KEY (`soalUTBKId`) REFERENCES `soalutbk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utbk_session` ADD CONSTRAINT `utbk_session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utbk_jawaban_user` ADD CONSTRAINT `utbk_jawaban_user_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `utbk_session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utbk_jawaban_user` ADD CONSTRAINT `utbk_jawaban_user_soalUTBKId_fkey` FOREIGN KEY (`soalUTBKId`) REFERENCES `soalutbk`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `utbk_jawaban_user` ADD CONSTRAINT `utbk_jawaban_user_pilihanId_fkey` FOREIGN KEY (`pilihanId`) REFERENCES `pilihanjawaban`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
