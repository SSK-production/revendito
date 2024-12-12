-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "bannedBy" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bannedBy" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bannedBy_fkey" FOREIGN KEY ("bannedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_bannedBy_fkey" FOREIGN KEY ("bannedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
