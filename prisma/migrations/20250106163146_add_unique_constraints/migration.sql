/*
  Warnings:

  - Added the required column `name` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- DropIndex
DROP INDEX "League_name_key";

-- DropIndex
DROP INDEX "Region_name_key";

-- DropIndex
DROP INDEX "Team_name_key";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "winnerId" TEXT;

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "currentRound" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "status" "TournamentStatus" NOT NULL DEFAULT 'NOT_STARTED';

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
