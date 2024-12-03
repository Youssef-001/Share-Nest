/*
  Warnings:

  - The primary key for the `folder` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_folderId_fkey";

-- DropForeignKey
ALTER TABLE "shared_folders" DROP CONSTRAINT "shared_folders_folderId_fkey";

-- AlterTable
ALTER TABLE "file" ALTER COLUMN "folderId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "folder" DROP CONSTRAINT "folder_pkey",
ADD COLUMN     "parent" TEXT NOT NULL DEFAULT 'root',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "folder_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "folder_id_seq";

-- AlterTable
ALTER TABLE "shared_folders" ALTER COLUMN "folderId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_folders" ADD CONSTRAINT "shared_folders_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
