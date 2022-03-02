const fs = require('fs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const util = require('util');
const model = require('../models/Auth');
let readFile = util.promisify(fs.readFile);

async function importUser() {
    let users = await readFile('user.json');
    users = JSON.parse(users);
    for (let user of users){
        await model.upsertUser(user);
    }
}

async function importProduct(){
    let products = await readFile('product.json');
    products = JSON.parse(products);
    await prisma.product.createMany({
        data: products
    })
}

const importData = async () => {
    await importUser();
    // await importProduct();
};

const deleteData = async () => {
    await prisma.cartItem.deleteMany({});
    await prisma.orderItem.deleteMany({});
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
