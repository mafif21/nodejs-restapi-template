import productService from "../service/product-service.js";
import fs from "fs";
import path from "path";

export const create = async(req, res, next) => {
    try{
        const request = req.body;
        request.image = req.file.filename

        const result = await productService.create(request);

        res.status(201).json({
            status: 201,
            message: "success create new product",
            data: result
        })
    }catch (e) {
        const filePath = path.join(process.cwd(), "src/public/uploads", req.file.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        next(e)
    }
}

export const getDetailProduct = async(req, res, next) => {
    try{
        const productId = req.params.productId;
        const result = await productService.getDetail(productId);
        res.status(200).json({
            status: 200,
            message: "success get detail product",
            data: result
        })
    }catch (e) {
        next(e)
    }
}

export const getProducts = async(req, res, next) => {
    try{
        const request = {
            name: req.query.name,
            page: req.query.page,
            size: req.query.size
        };

        const result = await productService.get(request)
        res.status(200).json({
            status: 200,
            message: "success get all products",
            data: result
        })
    }catch (e) {
        next(e)
    }
}

export const updateProduct = async(req, res, next) => {
    try{
        const request = req.body;
        console.log(req.body)
        const productId = req.params.productId;
        request.id = productId;

        if (req.file){
            console.log(req.file)
            request.image = req.file.filename
        }

        const result = await productService.update(request);
        res.status(200).json({
            status: 200,
            message: "success update product",
            data: result
        })
    }catch (e) {
        const filePath = path.join(process.cwd(), "src/public/uploads", req.file.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        next(e)
    }
}

export const deleteProduct = async(req, res, next) => {
    try{
        const productId = req.params.productId;

        const productRemove = await productService.remove(productId);
        const existingFilePath = path.join(process.cwd(), "src/public/uploads", productRemove.image);

        if (fs.existsSync(existingFilePath)) {
            fs.unlinkSync(existingFilePath);
        }

        res.status(200).json({
            status: 200,
            message: "success delete product",
        })
    }catch (e) {
        next(e)
    }
}

export default {create, getDetailProduct, getProducts, updateProduct, deleteProduct}