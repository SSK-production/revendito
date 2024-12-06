/*
  Warnings:

  - Made the column `balcony` on table `RealEstateOffer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `basementAvailable` on table `RealEstateOffer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `elevator` on table `RealEstateOffer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `garage` on table `RealEstateOffer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `garden` on table `RealEstateOffer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `parking` on table `RealEstateOffer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `terrace` on table `RealEstateOffer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RealEstateOffer" ALTER COLUMN "furnished" SET DEFAULT false,
ALTER COLUMN "balcony" SET NOT NULL,
ALTER COLUMN "balcony" SET DEFAULT false,
ALTER COLUMN "basementAvailable" SET NOT NULL,
ALTER COLUMN "basementAvailable" SET DEFAULT false,
ALTER COLUMN "elevator" SET NOT NULL,
ALTER COLUMN "elevator" SET DEFAULT false,
ALTER COLUMN "garage" SET NOT NULL,
ALTER COLUMN "garage" SET DEFAULT false,
ALTER COLUMN "garden" SET NOT NULL,
ALTER COLUMN "garden" SET DEFAULT false,
ALTER COLUMN "parking" SET NOT NULL,
ALTER COLUMN "parking" SET DEFAULT false,
ALTER COLUMN "terrace" SET NOT NULL,
ALTER COLUMN "terrace" SET DEFAULT false;
