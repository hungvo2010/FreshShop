const {PrismaClient} = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function getProducts(){
    return await prisma.product.findMany();
}

// async function getProducts(offset, limit){
//     return await prisma.product.findMany({
//         skip: offset,
//         take: limit
//     })
// }

async function findProduct(productId){
    return await prisma.product.findUnique({
        where: {
            id: productId,
        }
    })
}

async function getProductsInCart(userId){
    return await prisma.cart.findUnique({
        where: {
            userId,
        },
        include: {
            cartItem: {
                include: {
                    product: true,
                }
            }
        }
    })
}

async function getProductsInWishList(userId){
    return await prisma.wishList.findMany({
        where: {
            userId,
        },
        include: {
            product: true,
        }
    })
}

async function addProductToWishList(productId, userId){
    await prisma.wishList.upsert({
        where: {
            productId_userId: {
                productId,
                userId,
            }
        },
        update: {},
        create: {
            productId,
            userId,
        } 
    })
}

async function getCart(userId){
    return await prisma.cart.upsert({
        where: {
            userId,
        },
        update: {},
        create: {
            userId,
        }
    });
}

async function deleteCartItem(productId, userId){
    let cart = await getCart(userId);
    
    await prisma.cartItem.delete({
        where: {
            productId_cartId: {
                productId,
                cartId: cart.id,
            }
        }
    })
}

async function updateCartItem(userId, listOfCartItems){
    let cart = await getCart(userId);

    const updateOperations = [];
    let updateQuery;

    for (let index = 0; index < listOfCartItems.length; index++) {
        updateQuery = prisma.cartItem.update({
            where: {
                productId_cartId: {
                    productId: listOfCartItems[index].productId,
                    cartId: cart.id,
                }
            }, 
            data: {
                quantity: listOfCartItems[index].quantity
            }
        })
        updateOperations.push(updateQuery);
    }

    await prisma.$transaction(updateOperations);
}

async function deleteWishlistItem(productId, userId){
    await prisma.wishList.delete({
        where: {
            productId_userId: {
                productId,
                userId,
            }
        }
    })
}

async function addProductToCart(productId, userId){
    let cart = await getCart(userId);

    await prisma.cartItem.upsert({
        where: {
            productId_cartId: {
                productId,
                cartId: cart.id,
            }
        },
        update: {
            quantity: {
                increment: 1
            }
        },
        create: {
            cartId: cart.id,
            productId,
            quantity: 1
        }
    })
}

async function getListOfOrders(userId){
    return await prisma.order.findMany({
        where: {
            userId,
        },
        include: {
            orderItem: {
                include: {
                    product: true,
                }
            }
        }
    })
}

async function addOrder(userId){
    const order = await prisma.order.create({
        data: {
            userId
        }
    });
    const cart = await getProductsInCart(userId);
    if (cart && cart.cartItem){
        for (let item of cart.cartItem){
            const newItem = {
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity
            }
            await prisma.orderItem.create({
                data: newItem,
            })
        }
        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            }
        })
    }
}

async function getSpecificOrder(orderId){
    const order = await prisma.orderItem.findMany({
        where: {
            orderId
        },
        include: {
            product: true
        }
    });
    return order;
}

async function countProducts(){
    return await prisma.product.count();
}

async function getCoupon(cartId){
    return await prisma.couponItem.findFirst({
        where: {
            cartId,
        },
        include: {
            coupon: true
        }
    })
}

async function addContact({email, name, message, subject}){
    await prisma.contact.create({
        data: {
            email,
            name,
            message,
            subject,
            submittedAt: new Date()
        }
    });
}

module.exports = {
    getProducts,
    getCart,
    findProduct,
    countProducts,
    addProductToCart,
    getProductsInCart,
    updateCartItem,
    getProductsInWishList,
    addProductToWishList,
    deleteWishlistItem,
    deleteCartItem,
    getListOfOrders,
    addOrder,
    getSpecificOrder,
    getCoupon,
    addContact,
}

