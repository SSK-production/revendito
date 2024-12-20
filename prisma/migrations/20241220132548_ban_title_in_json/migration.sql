/*
  Warnings:

  - Changed the type of `bannTitle` on the `Company` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `bannTitle` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "bannTitle",
ADD COLUMN     "bannTitle" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bannTitle",
ADD COLUMN     "bannTitle" JSONB NOT NULL;
