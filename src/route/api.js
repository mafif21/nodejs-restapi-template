import express from "express";
import userController from "../controller/user-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";

const userRouter = new express.Router();

// User API
userRouter.post('/api/users/logout', authMiddleware ,userController.logout);

export {
    userRouter
}