-- AlterTable
ALTER TABLE `User` ADD COLUMN `paketUser` ENUM('BASIC', 'LITE', 'ACTIVE', 'EDUVOKA') NOT NULL DEFAULT 'BASIC';

-- CreateTable
CREATE TABLE `PertanyaanKuisVAK` (
    `id` VARCHAR(191) NOT NULL,
    `pertanyaan` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JawabanKuisVAK` (
    `id` VARCHAR(191) NOT NULL,
    `kuisVAKId` VARCHAR(191) NOT NULL,
    `jawaban` VARCHAR(191) NOT NULL,
    `tipeJawaban` ENUM('VISUAL', 'AUDITORY', 'KINESTHETIC') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JawabanUserKuisVAK` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `pertanyaanKuisVAKId` VARCHAR(191) NOT NULL,
    `jawabanKuisVAKId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `JawabanUserKuisVAK_userId_pertanyaanKuisVAKId_key`(`userId`, `pertanyaanKuisVAKId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SoalUTBK` (
    `id` VARCHAR(191) NOT NULL,
    `tipe` ENUM('TPS', 'LITERASI') NOT NULL,
    `content` TEXT NOT NULL,
    `kunciJawaban` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PilihanJawaban` (
    `id` VARCHAR(191) NOT NULL,
    `soalUTBKId` VARCHAR(191) NOT NULL,
    `pilihan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JawabanKuisVAK` ADD CONSTRAINT `JawabanKuisVAK_kuisVAKId_fkey` FOREIGN KEY (`kuisVAKId`) REFERENCES `PertanyaanKuisVAK`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JawabanUserKuisVAK` ADD CONSTRAINT `JawabanUserKuisVAK_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JawabanUserKuisVAK` ADD CONSTRAINT `JawabanUserKuisVAK_pertanyaanKuisVAKId_fkey` FOREIGN KEY (`pertanyaanKuisVAKId`) REFERENCES `PertanyaanKuisVAK`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JawabanUserKuisVAK` ADD CONSTRAINT `JawabanUserKuisVAK_jawabanKuisVAKId_fkey` FOREIGN KEY (`jawabanKuisVAKId`) REFERENCES `JawabanKuisVAK`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PilihanJawaban` ADD CONSTRAINT `PilihanJawaban_soalUTBKId_fkey` FOREIGN KEY (`soalUTBKId`) REFERENCES `SoalUTBK`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
