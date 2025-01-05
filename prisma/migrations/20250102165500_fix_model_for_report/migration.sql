/*
  Warnings:

  - You are about to drop the column `reporterId` on the `Report` table. All the data in the column will be lost.
  - Added the required column `reporterCompanyId` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reporterUserId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reporterCompany_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reporterUser_fkey";

-- DropIndex
DROP INDEX "idx_reporterId";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "banEndDate" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "reporterId",
ADD COLUMN     "reporterCompanyId" TEXT NOT NULL,
ADD COLUMN     "reporterUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "banEndDate" SET DEFAULT NULL;

-- CreateIndex
CREATE INDEX "idx_reporterUserId" ON "Report"("reporterUserId");

-- CreateIndex
CREATE INDEX "idx_reporterCompanyId" ON "Report"("reporterCompanyId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterUser_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterCompany_fkey" FOREIGN KEY ("reporterCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
