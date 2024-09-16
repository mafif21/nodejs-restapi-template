import userService from "../service/user-service.js";
import {ResponseError} from "../error/response-error.js";

export const register = async (req, res, next) => {
    try{
        const result = await userService.register(req.body);
        res.status(201).json({
            status: 201,
            message: 'User registered successfully',
            data: result
        });
    }catch (e){
        next(e)
    }
}

export const login = async (req, res, next) => {
    try{
        const result = await userService.login(req.body);
        res.status(200).json({
            status: 200,
            message: 'User logged in successfully',
            data: result
        });
    }catch (e){
        next(e)
    }
}

export const logout = async (req, res, next) => {
    try{
        const userJwt = req.headers.authorization?.split(' ')[1];

        if (!userJwt) {
            throw new ResponseError(401, "token not provided")
        }

        await userService.logout(userJwt);

        res.status(200).json({
            status: 200,
            message: 'User logged out successfully',
        });
    }catch (e){
        next(e)
    }
}

export default {register, login, logout};