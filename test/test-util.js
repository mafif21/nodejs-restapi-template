import {prismaClient, PrismaClient} from "../src/application/database.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const generateTestJWTToken = async (user) => {
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1);
    const secretKey = process.env.JWT_SECRET || 'LELEGANTENG';

    const payload = {
        id: user.id,
        username: user.username,
        email: user.email
    };

    const userToken = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    await prismaClient.user.update({
        where: {
            email: user.email
        },
        data:{
            token:userToken,
            tokenExpiration: tokenExpiration,
        },
        select: {
            token: true,
        }
    })

    return userToken
};

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

export const createTestCategory = async() => {
    const newCategory = await prismaClient.category.create({
        data:{
            name: "test",
        }
    })

    return newCategory
}

export const createManyTestCategory = async() => {
    let createdData = []

    for (let i = 0; i < 15; i++) {
        const category = await prismaClient.category.create({
            data:{
                name: `test ${i}`,
            }
        })

        createdData.push(category)
    }

    return createdData
}

export const removeAllCategories = async () => {
    await prismaClient.category.deleteMany({
        where: {
            name: {
                startsWith: "test",
            }
        }
    })
}