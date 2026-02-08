-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `profileImage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `gayaBelajar` ENUM('VISUAL', 'AUDITORY', 'KINESTHETIC') NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `paketUser` ENUM('BASIC', 'LITE', 'ACTIVE', 'EDUVOKA') NOT NULL DEFAULT 'BASIC',
    `isSubscribed` BOOLEAN NOT NULL DEFAULT false,
    `subscriptionEndAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_paketUser_idx`(`paketUser`),
    INDEX `User_isSubscribed_idx`(`isSubscribed`),
    INDEX `User_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    INDEX `Session_expires_idx`(`expires`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Materi` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `kategori` ENUM('PU', 'PBM', 'PPU', 'PK', 'LITERASIBINDO', 'LITERASIBINGG') NOT NULL,
    `deskripsi` TEXT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Materi_kategori_idx`(`kategori`),
    INDEX `Materi_urutan_idx`(`urutan`),
    INDEX `Materi_nama_idx`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SoalLatihanSoal` (
    `id` VARCHAR(191) NOT NULL,
    `tipe` ENUM('PU', 'PBM', 'PPU', 'PK', 'LITERASIBINDO', 'LITERASIBINGG') NOT NULL,
    `tipeSesi` ENUM('TPS', 'LITERASI', 'TRY_OUT', 'LATIHAN') NOT NULL,
    `materiId` VARCHAR(191) NULL,
    `content` TEXT NOT NULL,
    `kunciJawaban` VARCHAR(191) NOT NULL,
    `tingkatKesulitan` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SoalLatihanSoal_materiId_idx`(`materiId`),
    INDEX `SoalLatihanSoal_tipe_idx`(`tipe`),
    INDEX `SoalLatihanSoal_tipeSesi_idx`(`tipeSesi`),
    INDEX `SoalLatihanSoal_tingkatKesulitan_idx`(`tingkatKesulitan`),
    INDEX `SoalLatihanSoal_tipe_tipeSesi_idx`(`tipe`, `tipeSesi`),
    INDEX `SoalLatihanSoal_materiId_tipe_idx`(`materiId`, `tipe`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PilihanJawaban` (
    `id` VARCHAR(191) NOT NULL,
    `soalUTBKId` VARCHAR(191) NULL,
    `label` VARCHAR(191) NOT NULL,
    `pilihan` VARCHAR(191) NOT NULL,
    `soalLatihanId` VARCHAR(191) NOT NULL DEFAULT '',

    INDEX `PilihanJawaban_soalLatihanId_idx`(`soalLatihanId`),
    INDEX `PilihanJawaban_soalUTBKId_idx`(`soalUTBKId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PembahasanSoalLatihan` (
    `id` VARCHAR(191) NOT NULL,
    `soalLatihanId` VARCHAR(191) NOT NULL,
    `konten` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PembahasanSoalLatihan_soalLatihanId_idx`(`soalLatihanId`),
    UNIQUE INDEX `PembahasanSoalLatihan_soalLatihanId_key`(`soalLatihanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LatihanSession` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('TPS', 'LITERASI', 'TRY_OUT', 'LATIHAN') NOT NULL,
    `materiId` VARCHAR(191) NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endedAt` DATETIME(3) NULL,
    `score` INTEGER NULL,
    `totalDuration` INTEGER NULL,
    `averageTimePerQ` DOUBLE NULL,
    `accuracyRate` DOUBLE NULL,
    `completionRate` DOUBLE NULL,

    INDEX `LatihanSession_userId_idx`(`userId`),
    INDEX `LatihanSession_startedAt_idx`(`startedAt`),
    INDEX `LatihanSession_type_idx`(`type`),
    INDEX `LatihanSession_materiId_idx`(`materiId`),
    INDEX `LatihanSession_userId_type_idx`(`userId`, `type`),
    INDEX `LatihanSession_userId_startedAt_idx`(`userId`, `startedAt`),
    INDEX `LatihanSession_endedAt_idx`(`endedAt`),
    INDEX `LatihanSession_score_idx`(`score`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LatihanJawabanUser` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `soalLatihanId` VARCHAR(191) NOT NULL,
    `pilihanId` VARCHAR(191) NULL,
    `isCorrect` BOOLEAN NULL,
    `answeredAt` DATETIME(3) NULL,
    `timeSpent` INTEGER NULL,
    `isSkipped` BOOLEAN NOT NULL DEFAULT false,
    `confidence` INTEGER NULL,

    INDEX `LatihanJawabanUser_soalLatihanId_idx`(`soalLatihanId`),
    INDEX `LatihanJawabanUser_isCorrect_idx`(`isCorrect`),
    INDEX `LatihanJawabanUser_sessionId_idx`(`sessionId`),
    INDEX `LatihanJawabanUser_answeredAt_idx`(`answeredAt`),
    INDEX `LatihanJawabanUser_isSkipped_idx`(`isSkipped`),
    INDEX `LatihanJawabanUser_sessionId_isCorrect_idx`(`sessionId`, `isCorrect`),
    UNIQUE INDEX `LatihanJawabanUser_sessionId_soalLatihanId_key`(`sessionId`, `soalLatihanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TryoutSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NULL,
    `scheduledAt` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `status` ENUM('SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `maxParticipants` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TryoutSchedule_scheduledAt_idx`(`scheduledAt`),
    INDEX `TryoutSchedule_status_idx`(`status`),
    INDEX `TryoutSchedule_scheduledAt_status_idx`(`scheduledAt`, `status`),
    INDEX `TryoutSchedule_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TryoutParticipant` (
    `id` VARCHAR(191) NOT NULL,
    `tryoutId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `startedAt` DATETIME(3) NULL,
    `finishedAt` DATETIME(3) NULL,
    `score` INTEGER NULL,
    `rank` INTEGER NULL,
    `totalCorrect` INTEGER NULL,
    `totalIncorrect` INTEGER NULL,
    `totalSkipped` INTEGER NULL,
    `timeUsed` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TryoutParticipant_userId_idx`(`userId`),
    INDEX `TryoutParticipant_tryoutId_idx`(`tryoutId`),
    INDEX `TryoutParticipant_score_idx`(`score`),
    INDEX `TryoutParticipant_rank_idx`(`rank`),
    INDEX `TryoutParticipant_tryoutId_score_idx`(`tryoutId`, `score`),
    INDEX `TryoutParticipant_tryoutId_rank_idx`(`tryoutId`, `rank`),
    INDEX `TryoutParticipant_finishedAt_idx`(`finishedAt`),
    UNIQUE INDEX `TryoutParticipant_tryoutId_userId_key`(`tryoutId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyTask` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `taskDate` DATE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'SKIPPED') NOT NULL DEFAULT 'PENDING',
    `targetCount` INTEGER NOT NULL DEFAULT 1,
    `currentCount` INTEGER NOT NULL DEFAULT 0,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DailyTask_userId_taskDate_idx`(`userId`, `taskDate`),
    INDEX `DailyTask_userId_status_idx`(`userId`, `status`),
    INDEX `DailyTask_taskDate_idx`(`taskDate`),
    INDEX `DailyTask_status_idx`(`status`),
    INDEX `DailyTask_completedAt_idx`(`completedAt`),
    UNIQUE INDEX `DailyTask_userId_taskDate_description_key`(`userId`, `taskDate`, `description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LearningMetrics` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `materiId` VARCHAR(191) NULL,
    `date` DATE NOT NULL,
    `totalStudyTime` INTEGER NOT NULL DEFAULT 0,
    `totalQuestions` INTEGER NOT NULL DEFAULT 0,
    `correctAnswers` INTEGER NOT NULL DEFAULT 0,
    `avgTimePerQuestion` DOUBLE NULL,
    `accuracyRate` DOUBLE NULL,
    `sessionsCount` INTEGER NOT NULL DEFAULT 0,
    `isActiveDay` BOOLEAN NOT NULL DEFAULT false,
    `currentStreak` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `LearningMetrics_userId_date_idx`(`userId`, `date`),
    INDEX `LearningMetrics_materiId_idx`(`materiId`),
    INDEX `LearningMetrics_date_idx`(`date`),
    INDEX `LearningMetrics_userId_isActiveDay_idx`(`userId`, `isActiveDay`),
    INDEX `LearningMetrics_currentStreak_idx`(`currentStreak`),
    INDEX `LearningMetrics_accuracyRate_idx`(`accuracyRate`),
    UNIQUE INDEX `LearningMetrics_userId_materiId_date_key`(`userId`, `materiId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeaknessArea` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `materiId` VARCHAR(191) NOT NULL,
    `kategori` ENUM('PU', 'PBM', 'PPU', 'PK', 'LITERASIBINDO', 'LITERASIBINGG') NOT NULL,
    `totalAttempts` INTEGER NOT NULL DEFAULT 0,
    `totalCorrect` INTEGER NOT NULL DEFAULT 0,
    `totalIncorrect` INTEGER NOT NULL DEFAULT 0,
    `errorRate` DOUBLE NOT NULL,
    `avgTimeSpent` DOUBLE NULL,
    `isWeak` BOOLEAN NOT NULL DEFAULT false,
    `lastAttemptAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `WeaknessArea_userId_isWeak_idx`(`userId`, `isWeak`),
    INDEX `WeaknessArea_materiId_idx`(`materiId`),
    INDEX `WeaknessArea_userId_kategori_idx`(`userId`, `kategori`),
    INDEX `WeaknessArea_errorRate_idx`(`errorRate`),
    INDEX `WeaknessArea_lastAttemptAt_idx`(`lastAttemptAt`),
    INDEX `WeaknessArea_userId_errorRate_idx`(`userId`, `errorRate`),
    UNIQUE INDEX `WeaknessArea_userId_materiId_key`(`userId`, `materiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserInsight` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `insightType` ENUM('WEAKNESS_CLUSTERING', 'LEARNING_VELOCITY', 'BURNOUT_SIGNAL', 'EXAM_READINESS', 'IMPROVEMENT_RATE', 'CONSISTENCY_PATTERN') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `metadata` TEXT NULL,
    `priority` INTEGER NOT NULL DEFAULT 1,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `isArchived` BOOLEAN NOT NULL DEFAULT false,
    `validUntil` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UserInsight_userId_isRead_idx`(`userId`, `isRead`),
    INDEX `UserInsight_userId_insightType_idx`(`userId`, `insightType`),
    INDEX `UserInsight_createdAt_idx`(`createdAt`),
    INDEX `UserInsight_userId_isArchived_idx`(`userId`, `isArchived`),
    INDEX `UserInsight_priority_idx`(`priority`),
    INDEX `UserInsight_validUntil_idx`(`validUntil`),
    INDEX `UserInsight_userId_isRead_isArchived_idx`(`userId`, `isRead`, `isArchived`),
    INDEX `UserInsight_userId_insightType_isRead_idx`(`userId`, `insightType`, `isRead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AIPembahasan` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `analisis` TEXT NOT NULL,
    `strengths` TEXT NULL,
    `weaknesses` TEXT NULL,
    `recommendations` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AIPembahasan_sessionId_key`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SoalLatihanSoal` ADD CONSTRAINT `SoalLatihanSoal_materiId_fkey` FOREIGN KEY (`materiId`) REFERENCES `Materi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PilihanJawaban` ADD CONSTRAINT `PilihanJawaban_soalLatihanId_fkey` FOREIGN KEY (`soalLatihanId`) REFERENCES `SoalLatihanSoal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PilihanJawaban` ADD CONSTRAINT `PilihanJawaban_soalUTBKId_fkey` FOREIGN KEY (`soalUTBKId`) REFERENCES `SoalUTBK`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembahasanSoalLatihan` ADD CONSTRAINT `PembahasanSoalLatihan_soalLatihanId_fkey` FOREIGN KEY (`soalLatihanId`) REFERENCES `SoalLatihanSoal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LatihanSession` ADD CONSTRAINT `LatihanSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LatihanJawabanUser` ADD CONSTRAINT `LatihanJawabanUser_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `LatihanSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LatihanJawabanUser` ADD CONSTRAINT `LatihanJawabanUser_soalLatihanId_fkey` FOREIGN KEY (`soalLatihanId`) REFERENCES `SoalLatihanSoal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LatihanJawabanUser` ADD CONSTRAINT `LatihanJawabanUser_pilihanId_fkey` FOREIGN KEY (`pilihanId`) REFERENCES `PilihanJawaban`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TryoutParticipant` ADD CONSTRAINT `TryoutParticipant_tryoutId_fkey` FOREIGN KEY (`tryoutId`) REFERENCES `TryoutSchedule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TryoutParticipant` ADD CONSTRAINT `TryoutParticipant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyTask` ADD CONSTRAINT `DailyTask_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LearningMetrics` ADD CONSTRAINT `LearningMetrics_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LearningMetrics` ADD CONSTRAINT `LearningMetrics_materiId_fkey` FOREIGN KEY (`materiId`) REFERENCES `Materi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeaknessArea` ADD CONSTRAINT `WeaknessArea_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeaknessArea` ADD CONSTRAINT `WeaknessArea_materiId_fkey` FOREIGN KEY (`materiId`) REFERENCES `Materi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInsight` ADD CONSTRAINT `UserInsight_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `RawEventLog` ADD CONSTRAINT `RawEventLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudySession` ADD CONSTRAINT `StudySession_materiId_fkey` FOREIGN KEY (`materiId`) REFERENCES `Materi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudySession` ADD CONSTRAINT `StudySession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
