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
module.exports = { createUser, getUser, getUserById };
