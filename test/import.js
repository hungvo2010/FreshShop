const fs = require('fs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let products;
let users;

fs.readFile('product.json', (err, data) => {
    products = JSON.parse(data);
})

fs.readFile('user.json', (err, data) => {
    users = JSON.parse(data);
})

const importData = async () => {
    await prisma.product.createMany({
        data: products
    });
    await prisma.user.createMany({
        data: users
    })
};

const deleteData = async () => {
    console.log(prisma.cartitem);
    // prisma.cartitem.deleteMany({});
    // prisma.orderitem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.token.deleteMany({});
    await prisma.user.deleteMany({});
}

const arg = process.argv[2];
if (arg === '--import'){
    importData();
}
else if (arg === '--delete'){
    deleteData();
}
