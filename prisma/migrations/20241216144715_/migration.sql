/*
  Warnings:

  - The `banReason` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `banReason` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "bannTitle" TEXT,
ADD COLUMN     "bannedByUsername" TEXT,
DROP COLUMN "banReason",
ADD COLUMN     "banReason" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bannTitle" TEXT,
ADD COLUMN     "bannedByUsername" TEXT,
DROP COLUMN "banReason",
ADD COLUMN     "banReason" TEXT[];
