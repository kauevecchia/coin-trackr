/*
  Warnings:

  - You are about to drop the column `quantity` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `crypto_quantity` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usd_amount` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "quantity",
ADD COLUMN     "crypto_quantity" DECIMAL(24,10) NOT NULL,
ADD COLUMN     "usd_amount" DECIMAL(24,10) NOT NULL;
