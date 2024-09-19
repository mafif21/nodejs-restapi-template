import {prismaClient, PrismaClient} from "../src/application/database.js"
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "test"
        }
    })
}

export const createTestUser = async() => {
    return prismaClient.user.create({
        data:{
            username: "test",
            email: "test@test.com",
            password: await bcrypt.hash("password", 10),
        }
    })
}

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "test"
        }
    });
}