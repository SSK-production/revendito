/*
  Warnings:

  - You are about to drop the column `offerId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_commercialOffer_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_realEstateOffer_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_vehicleOffer_fkey";

-- DropIndex
DROP INDEX "idx_offerId";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "offerId",
ADD COLUMN     "commercialOfferId" INTEGER,
ADD COLUMN     "realEstateOfferId" INTEGER,
ADD COLUMN     "vehicleOfferId" INTEGER;

-- CreateIndex
CREATE INDEX "idx_vehicle_offer" ON "Message"("vehicleOfferId");

-- CreateIndex
CREATE INDEX "idx_real_estate_offer" ON "Message"("realEstateOfferId");

-- CreateIndex
CREATE INDEX "idx_commercial_offer" ON "Message"("commercialOfferId");

-- RenameForeignKey
ALTER TABLE "Message" RENAME CONSTRAINT "Message_receiverCompany_fkey" TO "Message_receiverCompanyId_fkey";

-- RenameForeignKey
ALTER TABLE "Message" RENAME CONSTRAINT "Message_receiverUser_fkey" TO "Message_receiverUserId_fkey";

-- RenameForeignKey
ALTER TABLE "Message" RENAME CONSTRAINT "Message_senderCompany_fkey" TO "Message_senderCompanyId_fkey";

-- RenameForeignKey
ALTER TABLE "Message" RENAME CONSTRAINT "Message_senderUser_fkey" TO "Message_senderUserId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_vehicleOfferId_fkey" FOREIGN KEY ("vehicleOfferId") REFERENCES "VehicleOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_realEstateOfferId_fkey" FOREIGN KEY ("realEstateOfferId") REFERENCES "RealEstateOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_commercialOfferId_fkey" FOREIGN KEY ("commercialOfferId") REFERENCES "CommercialOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
