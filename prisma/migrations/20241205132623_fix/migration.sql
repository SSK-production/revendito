/*
  Warnings:

  - You are about to drop the column `emailNumber` on the `CommercialOffer` table. All the data in the column will be lost.
  - You are about to drop the column `emailNumber` on the `RealEstateOffer` table. All the data in the column will be lost.
  - You are about to drop the column `emailNumber` on the `VehicleOffer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CommercialOffer" DROP COLUMN "emailNumber",
ADD COLUMN     "contactEmail" TEXT;

-- AlterTable
ALTER TABLE "RealEstateOffer" DROP COLUMN "emailNumber",
ADD COLUMN     "contactEmail" TEXT;

-- AlterTable
ALTER TABLE "VehicleOffer" DROP COLUMN "emailNumber",
ADD COLUMN     "contactEmail" TEXT;
