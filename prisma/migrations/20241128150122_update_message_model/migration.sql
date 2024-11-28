/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverCompany_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverUser_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderCompany_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderUser_fkey";

-- DropIndex
DROP INDEX "idx_receiverId";

-- DropIndex
DROP INDEX "idx_senderId";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "receiverCompanyId" TEXT,
ADD COLUMN     "receiverUserId" TEXT,
ADD COLUMN     "senderCompanyId" TEXT,
ADD COLUMN     "senderUserId" TEXT;

-- CreateIndex
CREATE INDEX "idx_senderUserId" ON "Message"("senderUserId");

-- CreateIndex
CREATE INDEX "idx_senderCompanyId" ON "Message"("senderCompanyId");

-- CreateIndex
CREATE INDEX "idx_receiverUserId" ON "Message"("receiverUserId");

-- CreateIndex
CREATE INDEX "idx_receiverCompanyId" ON "Message"("receiverCompanyId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderUser_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderCompany_fkey" FOREIGN KEY ("senderCompanyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverUser_fkey" FOREIGN KEY ("receiverUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverCompany_fkey" FOREIGN KEY ("receiverCompanyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
