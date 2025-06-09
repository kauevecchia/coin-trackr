/*
  Warnings:

  - You are about to drop the `crypto_price_cache` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "crypto_price_cache";

-- CreateTable
CREATE TABLE "crypto_cache" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "image_url" TEXT,
    "price" DECIMAL(24,10) NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crypto_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "crypto_cache_symbol_key" ON "crypto_cache"("symbol");
