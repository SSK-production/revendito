/*
  Warnings:

  - You are about to drop the column `subCategoryId` on the `CommercialOffer` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryId` on the `RealEstateOffer` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryId` on the `VehicleOffer` table. All the data in the column will be lost.
  - You are about to drop the `SubCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bathrooms` to the `RealEstateOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrooms` to the `RealEstateOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energyClass` to the `RealEstateOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heatingType` to the `RealEstateOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleType` to the `VehicleOffer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommercialOffer" DROP CONSTRAINT "CommercialOffer_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "RealEstateOffer" DROP CONSTRAINT "RealEstateOffer_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleOffer" DROP CONSTRAINT "VehicleOffer_subCategoryId_fkey";

-- AlterTable
ALTER TABLE "CommercialOffer" DROP COLUMN "subCategoryId";

-- AlterTable
ALTER TABLE "RealEstateOffer" DROP COLUMN "subCategoryId",
ADD COLUMN     "bathrooms" INTEGER NOT NULL,
ADD COLUMN     "bedrooms" INTEGER NOT NULL,
ADD COLUMN     "energyClass" TEXT NOT NULL,
ADD COLUMN     "heatingType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "VehicleOffer" DROP COLUMN "subCategoryId",
ADD COLUMN     "vehicleType" TEXT NOT NULL;

-- DropTable
DROP TABLE "SubCategory";
