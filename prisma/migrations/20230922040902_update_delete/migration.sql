/*
  Warnings:

  - You are about to drop the column `postResponseId` on the `Likes` table. All the data in the column will be lost.
  - You are about to drop the `PostResponses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Likes_postResponseId_idx";

-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "postResponseId";

-- DropTable
DROP TABLE "PostResponses";

-- CreateTable
CREATE TABLE "Comments" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postId" UUID NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comments_postId_idx" ON "Comments"("postId");
