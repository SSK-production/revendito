-- AlterTable
ALTER TABLE "CommercialOffer" ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "contractType" TEXT,
ADD COLUMN     "emailNumber" TEXT,
ADD COLUMN     "vendor" TEXT,
ADD COLUMN     "vendorType" TEXT,
ADD COLUMN     "workSchedule" TEXT;

-- AlterTable
ALTER TABLE "RealEstateOffer" ADD COLUMN     "availabilityDate" TIMESTAMP(3),
ADD COLUMN     "balcony" BOOLEAN,
ADD COLUMN     "basementAvailable" BOOLEAN,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "elevator" BOOLEAN,
ADD COLUMN     "emailNumber" TEXT,
ADD COLUMN     "floorNumber" INTEGER,
ADD COLUMN     "garage" BOOLEAN,
ADD COLUMN     "garden" BOOLEAN,
ADD COLUMN     "parking" BOOLEAN,
ADD COLUMN     "propertyCondition" TEXT,
ADD COLUMN     "terrace" BOOLEAN,
ADD COLUMN     "totalFloors" INTEGER,
ADD COLUMN     "vendor" TEXT,
ADD COLUMN     "vendorType" TEXT;

-- AlterTable
ALTER TABLE "VehicleOffer" ADD COLUMN     "condition" TEXT,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "emailNumber" TEXT,
ADD COLUMN     "emissionClass" TEXT,
ADD COLUMN     "engineSize" DOUBLE PRECISION,
ADD COLUMN     "numberOfDoors" INTEGER,
ADD COLUMN     "power" INTEGER,
ADD COLUMN     "vendor" TEXT,
ADD COLUMN     "vendorType" TEXT;
