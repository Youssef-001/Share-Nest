/*
  Warnings:

  - The primary key for the `shared_folders` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "shared_folders" DROP CONSTRAINT "shared_folders_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "shared_folders_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "shared_folders_id_seq";
