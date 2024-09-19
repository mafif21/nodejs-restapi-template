import {validate} from "../validation/validation.js";
import {
    createProductValidation,
    getProductValidation,
    searchProductValidation,
    updateProductValidation
} from "../validation/product-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import path from "path";
import fs from "fs";

const create = async (request) => {
    const product = validate(createProductValidation, request)
    return prismaClient.product.create({
        data: product,
        select:{
            id: true,
            name: true,
            price: true,
            category:{
                select: {
                    name: true,
                }
            },
            image: true,
            createdAt: true,
            updatedAt: true,
        }
    })
}

const getDetail = async (productId) => {
    productId = validate(getProductValidation, productId)
    console.log(productId)

    const foundProduct = await prismaClient.product.findUnique({
        where: {
            id: productId,
        },
        select:{
            id: true,
            name: true,
            price: true,
            category:{
                select: {
                    name: true,
                }
            },
            createdAt: true,
            updatedAt: true,
        }
    })

    if (!foundProduct) {
        throw new ResponseError(404, "product not found");
    }

    return foundProduct
}

const get = async (request) => {
    request = validate(searchProductValidation, request)

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

    const products = await prismaClient.product.findMany({
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
        data: products,
        paging: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / request.size)
        }
    }
}

const update = async (request) => {
    const product = validate(updateProductValidation, request)
    console.log(product)

    const foundProduct = await prismaClient.product.findUnique({
        where: {
            id: product.id,
        }
    })

    if (!foundProduct) {
        throw new ResponseError(404, "product is invalid or not found");
    }

    if (product.image == null){
        product.image = foundProduct.image
    }else{
        const existingFilePath = path.join(process.cwd(), "src/public/uploads", foundProduct.image);
        if (fs.existsSync(existingFilePath)) {
            fs.unlinkSync(existingFilePath);
        }
    }

    return prismaClient.product.update({
        where: {
            id: product.id,
        },
        data: {
            name: product.name,
            price: product.price,
            categoryId: product.categoryId,
            image: product.image
        },
        select:{
            id: true,
            name: true,
            price: true,
            category:{
                select: {
                    name: true,
                }
            },
            createdAt: true,
            updatedAt: true,
        }
    })
}

const remove = async(productId) => {
    productId = validate(getProductValidation, productId)

    console.log(productId)

    const foundInDatabase = await prismaClient.product.count({
        where: {
            id: productId,
        }
    })

    if (foundInDatabase !== 1) {
        throw new ResponseError(404, "product is invalid or not found");
    }

    return prismaClient.product.delete({
        where:{
            id: productId,
        }
    })
}


export default {create, getDetail, get, update, remove}