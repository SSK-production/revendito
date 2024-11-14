/*
  Warnings:

  - You are about to drop the column `location` on the `Offer` table. All the data in the column will be lost.
  - Added the required column `country` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "country" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "location",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL;
