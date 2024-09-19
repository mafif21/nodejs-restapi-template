import express from "express";
import userController from "../controller/user-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import categoryController from "../controller/category-controller.js";
import productController from "../controller/product-controller.js";
import upload from "../middleware/upload.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.post('/api/users/logout' ,userController.logout);

// Category API
userRouter.post('/api/categories/create', categoryController.createCategory);
userRouter.get('/api/categories', categoryController.getCategories);
userRouter.get('/api/categories/:categoryId', categoryController.getDetailCategory);
userRouter.put('/api/categories/:categoryId/edit', categoryController.updateCategory);
userRouter.delete('/api/categories/:categoryId', categoryController.deleteCategory);

// Product API
userRouter.post('/api/product/create', upload.single("image"), productController.create)
userRouter.get('/api/products', productController.getProducts)
userRouter.get('/api/products/:productId', productController.getDetailProduct)
userRouter.put('/api/products/:productId/edit', upload.single('image') ,productController.updateProduct)
userRouter.delete('/api/products/:productId', productController.deleteProduct);

export {
    userRouter
}