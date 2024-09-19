import {loginUserValidation, registerUserValidation} from "../validation/user-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import {validate} from "../validation/validation.js";

const register = async (request) => {
    const user = validate(registerUserValidation, request)

    const countUser = await prismaClient.user.count({
        where: {
            email: user.email
        }
    })

    if (countUser === 1){
        throw new ResponseError(400, 'email already exists')
    }

    user.password = await bcrypt.hash(user.password, 10)
    return prismaClient.user.create({
        data: user,
        select:{
            id: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        }
    })
}

const login = async(request) => {
    const user = validate(loginUserValidation, request)

    const findUser = await prismaClient.user.findUnique({
        where: {
            email: user.email
        },
        select:{
            id: true,
            username: true,
            email: true,
            password: true,
        }
    })

    if (!findUser){
        throw new ResponseError(401, 'email or password is wrong')
    }

    const isPasswordMatch = await bcrypt.compare(user.password,findUser.password )
    console.log(isPasswordMatch)
    if (!isPasswordMatch){
        throw new ResponseError(401, 'password is wrong')
    }

    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1);

    const userToken = jwt.sign(
        {
            id: findUser.id,
            username: findUser.username,
            email: findUser.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );

    return prismaClient.user.update({
        data:{
            token: userToken,
            tokenExpiration: tokenExpiration
        },
        where: {
            email: findUser.email,
        },
        select:{
            token: true,
        }
    })
}

const logout = async(request) => {
    const decode = jwt.verify(request, process.env.JWT_SECRET)

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() - 1);

    return prismaClient.user.update({
        where: {
            email: decode.email
        },
        data:{
            token: null,
            tokenExpiration: expirationDate
        },
    })
}

export default { register, login, logout }