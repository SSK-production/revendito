/*
  Warnings:

  - The `bannedByUsername` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bannTitle` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bannedByUsername` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bannTitle` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "banEndDate" SET DEFAULT NULL,
DROP COLUMN "bannedByUsername",
ADD COLUMN     "bannedByUsername" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "bannTitle",
ADD COLUMN     "bannTitle" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "banEndDate" SET DEFAULT NULL,
DROP COLUMN "bannedByUsername",
ADD COLUMN     "bannedByUsername" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "bannTitle",
ADD COLUMN     "bannTitle" TEXT[] DEFAULT ARRAY[]::TEXT[];
