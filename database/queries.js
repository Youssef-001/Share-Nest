const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");

async function createUser(userData) {
  const user = await prisma.users.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: userData.hashedPassword,
    },
  });
  return user; // Ensure a return value if required
}

async function getUser(email) {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  return user;
}

async function getUserById(id) {
  const user = await prisma.users.findUnique({
    where: {
      id: id,
    },
  });
  return user;
}

async function getUserId(email) {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });
  return user;
}

async function createInitialFolder(id) {
  const initialFolder = await prisma.folder.create({
    data: {
      ownerId: id,
    },
  });
}

async function getUserFolders(id) {
  let userFolders = await prisma.folder.findMany({
    where: {
      ownerId: id,
    },
  });

  return userFolders;
}

async function GetFolderFiles(id) {
  let folderFiles = await prisma.file.findMany({
    where: {
      folderId: id,
    },
  });

  return folderFiles;
}

async function addFile(folderId, file) {
  console.log("file", file);
  const fileExtension = path.extname(file.originalname).toLowerCase();
  let newFile = await prisma.file.create({
    data: {
      folderId: folderId,
      size: parseFloat(file.size),
      name: file.originalname,
      url: file.path,
      extention: file.mimetype,
    },
  });

  return newFile;
}

async function getUserFirstFolder(id) {
  let folder = await prisma.folder.findFirst({
    where: {
      ownerId: id,
    },
  });

  return folder;
}

async function createFolder(userId, folderName, parentId, path) {
  let folder = await prisma.folder.create({
    data: {
      ownerId: userId,
      name: folderName,
      parentId: parentId,
      path: path,
    },
  });

  return folder;
}

async function getFileById(id) {
  let file = await prisma.file.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  return file;
}

async function getSharedFolder(id) {
  let sharedFolder = await prisma.shared_folders.findUnique({
    where: {
      id: id,
    },
    include: {
      shareFolder: {
        include: {
          files: true,
        },
      },
    },
  });

  return sharedFolder;
}

async function createShareFolder(folderId, expiresAt) {
  let sharedFolder = await prisma.shared_folders.create({
    data: {
      folderId: folderId,
      expiresAt: expiresAt,
    },
  });
  return sharedFolder;
}

async function getFolderName(id) {
  let folder = await prisma.folder.findUnique({
    where: {
      id: id,
    },
  });
  return folder;
}

async function getFolderPath(folderId) {
  const path = [];

  let currentFolder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: {
      id: true,
      name: true,
      parentId: true, // Assuming the parent folder is referenced with `parentId`
    },
  });

  while (currentFolder) {
    // Add the current folder to the path
    path.unshift({
      id: currentFolder.id,
      name: currentFolder.name,
    });

    // Fetch the parent folder
    currentFolder = currentFolder.parentId
      ? await prisma.folder.findUnique({
          where: { id: currentFolder.parentId },
          select: {
            id: true,
            name: true,
            parentId: true,
          },
        })
      : null; // Stop if there's no parent
  }

  let tree = "";

  path.forEach((folder) => {
    tree += `/${folder.id}`;
  });

  return tree;
}

async function getSubFolders(folderId) {
  let currentFolders = await prisma.folder.findMany({
    where: {
      parentId: folderId,
    },
    include: {
      children: {
        include: {
          children: true,
        },
      },
    },
  });

  return currentFolders;
}

async function deleteFile(id) {
  await prisma.file.delete({
    where: {
      id: parseInt(id),
    },
  });
}

async function deleteSharedFolder(folderId)
{
  return prisma.shared_folders.deleteMany({
    where: {
      folderId: folderId
    }
  })
}

async function deleteFolderFiles(folderId) {
  return prisma.file.deleteMany({
    where: {
      folderId: (folderId),
    },
  });
}

async function deleteFolderIt(folderId)
{
  await prisma.folder.delete({
    where: {
      id: folderId
    }
  })
}

async function deleteSubFolders(folderId) {
  let subFolders = await getSubFolders(folderId);

  // Use `Promise.all` to handle all subfolder deletions
  await Promise.all(
    subFolders.map(async (folder) => {
      await deleteFolderFiles(folder.id);
      await deleteSharedFolder(folder.id);
      await deleteSubFolders(folder.id); // Recursive call for deeper levels
      await deleteFolderIt(folder.id)
    })
  );
}

async function deleteFolderTransaction(folderId) {
  // Handle subfolder deletions first (not part of the transaction directly)
  await deleteSubFolders(folderId);
  await deleteFolderIt(folderId);

  // Execute the main transaction for the current folder
  await prisma.$transaction([
    prisma.file.deleteMany({ where: { folderId: folderId } }), // Direct Prisma Client call
    prisma.shared_folders.deleteMany({ where: { folderId: folderId } }), // Direct Prisma Client call
  ]);
}
module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserId,
  createInitialFolder,
  getUserFolders,
  GetFolderFiles,
  addFile,
  getUserFirstFolder,
  createFolder,
  getFileById,
  getSharedFolder,
  getFolderName,
  createShareFolder,
  getFolderPath,
  getSubFolders,
  deleteFile,
  deleteFolderFiles,
  deleteFolderTransaction
};
