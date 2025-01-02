-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reporterCompany_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reporterUser_fkey";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "banEndDate" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "reporterCompanyId" DROP NOT NULL,
ALTER COLUMN "reporterUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "banEndDate" SET DEFAULT NULL;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterUser_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterCompany_fkey" FOREIGN KEY ("reporterCompanyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
