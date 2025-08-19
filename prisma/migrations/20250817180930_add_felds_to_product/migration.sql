-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "category" TEXT,
ADD COLUMN     "cloudinaryId" TEXT,
ADD COLUMN     "colors" TEXT[],
ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sizes" TEXT[];
