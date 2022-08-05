const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function getAllUsers() {
    return await prisma.users.findMany({})
}

async function getUser(criteria) {
    if (criteria.email || criteria.id) {
        return await prisma.users.findUnique({
            where: criteria
        })
    } return
}

async function createUser(reqBody) {
    return await prisma.users.create({
        data: {
            name: reqBody.name,
            email: reqBody.email,
            password: reqBody.password,
            status: 'active'
        },
    })
}

async function deleteUserById(id) {
    return await prisma.users.delete({
        where: {
            id: id
        }
    })
}

async function deleteMultipleUsersById(ids) {
    return await prisma.users.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    })
}

async function patchUserStatus(status, id) {
    await prisma.users.update({
        where: {
            id: id,
        },
        data: {
            status: status
        }
    })
}

async function patchMultipleUsersStatus(status, ids) {
    return await prisma.users.updateMany({
        where: {
            id: {
                in: ids
            }
        },
        data: {
            status: status
        }
    })
}

async function patchUserLoginDate(id) {
    await prisma.users.update({
        where: {
            id: id,
        },
        data: {
            last_login: new Date()
        }
    })
}

module.exports = {
    getAllUsers,
    createUser,
    getUser,
    deleteUserById,
    deleteMultipleUsersById,
    patchUserStatus,
    patchMultipleUsersStatus,
    patchUserLoginDate
}