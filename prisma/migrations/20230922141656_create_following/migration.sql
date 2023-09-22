/*
  Warnings:

  - Changed the type of `ownerId` on the `Comments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Comments" DROP COLUMN "ownerId",
ADD COLUMN     "ownerId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Follows" (
    "userFollowedId" UUID NOT NULL,
    "userFollowingId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("userFollowedId","userFollowingId")
);

-- CreateIndex
CREATE INDEX "Follows_userFollowedId_idx" ON "Follows"("userFollowedId");

-- CreateIndex
CREATE INDEX "Follows_userFollowingId_idx" ON "Follows"("userFollowingId");

-- CreateIndex
CREATE INDEX "Comments_ownerId_idx" ON "Comments"("ownerId");

-- CreateIndex
CREATE INDEX "Likes_userId_idx" ON "Likes"("userId");
