/*
  Warnings:

  - Added the required column `color` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuelType` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mileage` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transmission` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "fuelType" TEXT NOT NULL,
ADD COLUMN     "mileage" INTEGER NOT NULL,
ADD COLUMN     "model" TEXT NOT NULL,
ADD COLUMN     "transmission" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
