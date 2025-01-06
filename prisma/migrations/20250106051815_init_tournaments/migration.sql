/*
  Warnings:

  - You are about to drop the column `name` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `logo` to the `League` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionId` to the `League` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attack` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defense` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `midfield` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overallRating` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "League" ADD COLUMN     "logo" TEXT NOT NULL,
ADD COLUMN     "regionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "attack" INTEGER NOT NULL,
ADD COLUMN     "defense" INTEGER NOT NULL,
ADD COLUMN     "logo" TEXT NOT NULL,
ADD COLUMN     "midfield" INTEGER NOT NULL,
ADD COLUMN     "overallRating" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "League" ADD CONSTRAINT "League_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
