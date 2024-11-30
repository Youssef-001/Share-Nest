const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require('path')

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
      folderId: parseInt(id),
    },
  });

  return folderFiles;
}

async function addFile(folderId, file) {
  console.log("file", file);
  const fileExtension = path.extname(file.originalname).toLowerCase();
  let newFile = await prisma.file.create({
    data: {
      folderId: parseInt(folderId),
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

async function createFolder(userId, folderName) {
  let folder = await prisma.folder.create({
    data: {
      ownerId: userId,
      name: folderName,
    },
  });

  return folder;
}

async function getFileById(id)
{
    let file = await prisma.file.findUnique({
        where: {
            id: id
        }
    })

    return file;
}

async function getSharedFolder(id)
{
  let sharedFolder = await prisma.shared_folders.findUnique({
    where: {
      id : id
    },
    include: {
      shareFolder: {
        include: {
          files:true
        }
      },

     
    },
  })

  return sharedFolder
}

async function getFolderName(id)
{
  let folder = await prisma.folder.findUnique({
    where: {
      id:parseInt(id)
    }
  })
  return folder;
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
  createFolder,getFileById,
  getSharedFolder,
  getFolderName
};
