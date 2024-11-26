const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

async function getUser(email)
{
    const user = await prisma.users.findUnique({
        where: {
            email: email
        }
    })

    return user;
}


async function getUserById(id)
{
    const user = await prisma.users.findUnique({
        where: {
            id:id
        }
    })
    return user;
}



async function getUserId(email)
{
    const user = await prisma.users.findUnique({
        where: {
            email:email
        }
    })
    return user;
}



async function createInitialFolder(id)
{

    const initialFolder = await prisma.folder.create({
        data: {
            ownerId: id
        }
    })
}

async function getUserFolders(id)
{
    let userFolders = await prisma.folder.findMany({
        where: {
            ownerId: id
        }
    })

    return userFolders;
}

async function GetFolderFiles(id)
{
    let folderFiles = await prisma.file.findMany({
        where: {
            folderId: parseInt(id)
        }
    })

    return folderFiles;
}

async function addFile(folderId, file)
{
    console.log("file", file);

    let newFile = await prisma.file.create({
        data: {
            folderId: folderId,
            size: file.size,
            name: file.originalname,
            url : file.path,
            extention: file.mimetype

        }
    })

    return newFile;
}

async function getUserFirstFolder(id)
{
    let folder = await prisma.folder.findFirst({
        where: {
            ownerId: id
        }
    })

    return folder;
}


module.exports = { createUser, getUser, getUserById, getUserId, createInitialFolder, getUserFolders, GetFolderFiles,addFile, getUserFirstFolder};
