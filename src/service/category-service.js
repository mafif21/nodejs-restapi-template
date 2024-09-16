import {validate} from "../validation/validation.js";
import {
    createCategoryValidation,
    getCategoryValidation,
    searchCategoryValidation
} from "../validation/category-validation.js";
import {prismaClient} from "../application/database.js";
import category from "../controller/category-controller.js";

const create = async (request) => {
    const category = validate(createCategoryValidation, request);

    return prismaClient.category.create({
        data: category,
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        }
    });
}

const get = async (request) => {
    request = validate(searchCategoryValidation, request)

    const skip = (request.page - 1) * request.size
    const filters = []

    if (request.name){
        filters.push({
            OR:[
                {
                    name: {
                        contains: request.name
                    }
                }
            ]
        })
    }

    const categories = await prismaClient.category.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    })

    const totalItems = await prismaClient.category.count({
        where: {
            AND: filters
        }
    })

    return {
        data: categories,
        paging: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / request.size)
        }
    }
}

const getDetail = async(categoryId) => {
    categoryId = validate(getCategoryValidation, categoryId)

    const category = await prismaClient.category.findUnique({
        where: {
            id: categoryId,
        },
        select:{
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        }
    })
}

export default {create, get}