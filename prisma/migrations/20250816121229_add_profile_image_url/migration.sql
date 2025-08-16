/*
  Warnings:

  - You are about to drop the column `profileImage` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Customer" DROP COLUMN "profileImage",
ADD COLUMN     "cloudinaryId" TEXT,
ADD COLUMN     "profileImageUrl" TEXT;
