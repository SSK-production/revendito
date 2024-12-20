-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "bannTitle" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bannTitle" SET DEFAULT ARRAY[]::TEXT[];
