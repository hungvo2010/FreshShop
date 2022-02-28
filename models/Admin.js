const {PrismaClient} = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function createProduct(product){
    await prisma.product.create({
        data: product
    });
}

async function createMultipleProducts(products){
    await prisma.product.createMany({
        data: products
    })
}

async function countAdminProducts(userId){
    return prisma.product.count({
        where: {
            userId
        }
    })
}

async function getAdminProducts(userId, offset, limit){
    return await prisma.product.findMany({
        skip: offset,
        take: limit,
        where: {
            userId,
        }
    })
}

async function findProduct(productId, userId){
    return await prisma.product.findFirst({
        where: {
            userId,
            id: productId
        }
    })
}

async function updateProduct(productId, newProduct){
    await prisma.product.update({
        where: {
            id: productId
        },
        update: newProduct
    })
}

async function deleteProduct(productId){
    await prisma.product.delete({
        where: {
            id: productId
        }
    })
}

module.exports = {
    createProduct,
    createMultipleProducts,
    countAdminProducts,
    findProduct,
    getAdminProducts,
    updateProduct,
    deleteProduct
}