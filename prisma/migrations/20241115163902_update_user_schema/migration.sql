-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'COMPANY');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Vehicle', 'RealEstate', 'commercial');

-- CreateEnum
CREATE TYPE "ReporterType" AS ENUM ('USER', 'COMPANY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "idCardVerified" BOOLEAN NOT NULL DEFAULT false,
    "birthDate" TIMESTAMP(3),
    "profilePicture" TEXT,
    "city" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'COMPANY',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "companyNumber" TEXT,
    "birthDate" TIMESTAMP(3),
    "profilePicture" TEXT,
    "city" TEXT,
    "country" TEXT,
    "street" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "Category" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleOffer" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "fuelType" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "subCategoryId" INTEGER,
    "userId" TEXT,
    "companyId" TEXT,

    CONSTRAINT "VehicleOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealEstateOffer" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyType" TEXT NOT NULL,
    "surface" DOUBLE PRECISION NOT NULL,
    "rooms" INTEGER NOT NULL,
    "furnished" BOOLEAN NOT NULL,
    "subCategoryId" INTEGER,
    "userId" TEXT,
    "companyId" TEXT,

    CONSTRAINT "RealEstateOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommercialOffer" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commercialType" TEXT NOT NULL,
    "duration" INTEGER,
    "subCategoryId" INTEGER,
    "userId" TEXT,
    "companyId" TEXT,

    CONSTRAINT "CommercialOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "senderId" TEXT,
    "receiverId" TEXT,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "offerId" INTEGER,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "vehicleOfferId" INTEGER,
    "realEstateOfferId" INTEGER,
    "commercialOfferId" INTEGER,
    "reporterId" TEXT NOT NULL,
    "reporterType" "ReporterType" NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyNumber_key" ON "Company"("companyNumber");

-- CreateIndex
CREATE INDEX "idx_senderId" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "idx_receiverId" ON "Message"("receiverId");

-- CreateIndex
CREATE INDEX "idx_offerId" ON "Message"("offerId");

-- CreateIndex
CREATE INDEX "idx_vehicleOfferId" ON "Report"("vehicleOfferId");

-- CreateIndex
CREATE INDEX "idx_realEstateOfferId" ON "Report"("realEstateOfferId");

-- CreateIndex
CREATE INDEX "idx_commercialOfferId" ON "Report"("commercialOfferId");

-- CreateIndex
CREATE INDEX "idx_reporterId" ON "Report"("reporterId");

-- AddForeignKey
ALTER TABLE "VehicleOffer" ADD CONSTRAINT "VehicleOffer_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOffer" ADD CONSTRAINT "VehicleOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOffer" ADD CONSTRAINT "VehicleOffer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealEstateOffer" ADD CONSTRAINT "RealEstateOffer_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealEstateOffer" ADD CONSTRAINT "RealEstateOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealEstateOffer" ADD CONSTRAINT "RealEstateOffer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercialOffer" ADD CONSTRAINT "CommercialOffer_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercialOffer" ADD CONSTRAINT "CommercialOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercialOffer" ADD CONSTRAINT "CommercialOffer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderUser_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderCompany_fkey" FOREIGN KEY ("senderId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverUser_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverCompany_fkey" FOREIGN KEY ("receiverId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_vehicleOffer_fkey" FOREIGN KEY ("offerId") REFERENCES "VehicleOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_realEstateOffer_fkey" FOREIGN KEY ("offerId") REFERENCES "RealEstateOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_commercialOffer_fkey" FOREIGN KEY ("offerId") REFERENCES "CommercialOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_vehicleOffer_fkey" FOREIGN KEY ("vehicleOfferId") REFERENCES "VehicleOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_realEstateOffer_fkey" FOREIGN KEY ("realEstateOfferId") REFERENCES "RealEstateOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_commercialOffer_fkey" FOREIGN KEY ("commercialOfferId") REFERENCES "CommercialOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterUser_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterCompany_fkey" FOREIGN KEY ("reporterId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
