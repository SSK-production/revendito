-- AlterTable
ALTER TABLE "CommercialOffer" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'commercial',
ADD COLUMN     "validated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "banEndDate" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "RealEstateOffer" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'property',
ADD COLUMN     "validated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "banEndDate" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "VehicleOffer" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'vehicle',
ADD COLUMN     "validated" BOOLEAN NOT NULL DEFAULT false;
