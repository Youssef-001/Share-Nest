/*
  Warnings:

  - You are about to drop the column `parent` on the `folder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "folder" DROP COLUMN "parent",
ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
