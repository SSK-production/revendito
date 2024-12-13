-- AlterTable
ALTER TABLE "CommercialOffer" ADD COLUMN     "userIsBanned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RealEstateOffer" ADD COLUMN     "userIsBanned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "VehicleOffer" ADD COLUMN     "userIsBanned" BOOLEAN NOT NULL DEFAULT false;
