-- AlterTable
ALTER TABLE "CommercialOffer" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "banCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "banEndDate" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RealEstateOffer" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "banEndDate" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "VehicleOffer" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
