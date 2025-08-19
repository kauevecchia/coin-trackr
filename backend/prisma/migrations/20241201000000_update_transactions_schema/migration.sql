-- AlterTable
ALTER TABLE "transactions" 
RENAME COLUMN "quantity" TO "crypto_quantity";

-- AlterTable  
ALTER TABLE "transactions" 
ADD COLUMN "usd_amount" DECIMAL(24,10);