/*
  Warnings:

  - Changed the type of `extention` on the `file` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "file" DROP COLUMN "extention",
ADD COLUMN     "extention" TEXT NOT NULL;
