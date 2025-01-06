/*
  Warnings:

  - You are about to drop the column `attack` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `defense` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `midfield` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `overallRating` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_teamId_fkey";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "attack",
DROP COLUMN "defense",
DROP COLUMN "midfield",
DROP COLUMN "overallRating";

-- DropTable
DROP TABLE "Player";
