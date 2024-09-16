import express from "express";
import userController from "../controller/user-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import categoryController from "../controller/category-controller.js";

const userRouter = new express.Router();

// User API
userRouter.post('/api/users/logout', authMiddleware ,userController.logout);

// Category API
userRouter.post('/api/categories/create', categoryController.createCategory);
userRouter.get('/api/categories', categoryController.getCategories);
userRouter.get('/api/categories/:categoryId', categoryController.getDetailCategory);
userRouter.put('/api/categories/:categoryId/edit', categoryController.updateCategory);
userRouter.delete('/api/categories/:categoryId', categoryController.deleteCategory);

export {
    userRouter
}