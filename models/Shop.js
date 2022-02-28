const {PrismaClient} = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function getProducts(offset, limit){
    return await prisma.product.findMany({
        skip: offset,
        take: limit
    })
}

async function findProduct(productId){
    return await prisma.product.findUnique({
        where: {
            id: productId,
        }
    })
}

async function getProductsOfCart(userId){
    return await prisma.cart.findUnique({
        where: {
            userId,
        },
        include: {
            cartItem: {
                include: {
                    product: true
                }
            }
        }
    })
}

async function countProducts(){
    return await prisma.product.count();
}

module.exports = {
    getProducts,
    findProduct,
    countProducts,
    getProductsOfCart
}

