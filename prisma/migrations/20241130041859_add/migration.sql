-- CreateTable
CREATE TABLE "shared_folders" (
    "id" SERIAL NOT NULL,
    "folderId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shared_folders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shared_folders" ADD CONSTRAINT "shared_folders_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
