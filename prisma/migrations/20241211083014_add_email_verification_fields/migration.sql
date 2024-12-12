-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerificationAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "emailVerificationLastAttempt" TIMESTAMP(3),
ADD COLUMN     "emailVerificationStatus" TEXT DEFAULT 'PENDING';
