import {ResponseError} from "../error/response-error.js";
import categoryService from "../service/category-service.js";

export const createCategory = async (req, res, next) => {
    try{
        const request = req.body;
        const result = await categoryService.create(request)
        res.status(201).json({
            status: 201,
            message: "success create new category",
            data: result
        })
    }catch (e) {
        next(e)
    }
}
export const getCategories = async (req, res, next) => {
    try{
        const request = {
            name: req.query.name,
            page: req.query.page,
            size: req.query.size
        };

        const result = await categoryService.get(request)
        res.status(200).json({
            status: 200,
            message: "success get all categories",
            data: result
        })
    }catch (e) {
        next(e)
    }
}

export const getDetailCategory = async (req, res, next) => {
    try{
        const categoryId = req.params.categoryId;
        const result = await categoryService.getDetail(categoryId);
        res.status(200).json({
            status: 200,
            message: "success get detail category",
            data: result
        })
    }catch (e) {
        next(e)
    }
}

export const updateCategory = async (req, res, next) => {
    try{
        const categoryId = req.params.categoryId;
        const request = req.body;

        request.id = categoryId
        const result = await categoryService.update(request)
        res.status(200).json({
            status: 200,
            message: "success update category",
            data: result
        })
    }catch (e) {
        next(e)
    }
}

export const deleteCategory = async (req, res, next) => {
    try{
        const categoryId = req.params.categoryId;

        await categoryService.remove(categoryId);
        res.status(200).json({
            status: 200,
            message: "success delete category",
        })
    }catch (e){
        next(e)
    }
}

export default {
    createCategory,
    getCategories,
    getDetailCategory,
    updateCategory,
    deleteCategory,
}