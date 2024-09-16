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
export const getCategories = async (req, res, next) => {}
export const getDetailCategory = async (req, res, next) => {}
export const updateCategory = async (req, res, next) => {}
export const deleteCategory = async (req, res, next) => {}

export default {
    createCategory,
    getCategories,
    getDetailCategory,
    updateCategory,
    deleteCategory,
}