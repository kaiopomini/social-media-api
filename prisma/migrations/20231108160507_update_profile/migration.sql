-- AlterTable
ALTER TABLE "Profiles" ADD COLUMN     "image" TEXT,
ALTER COLUMN "bio" DROP NOT NULL;
