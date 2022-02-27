const {PrismaClient} = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function authenUser({email, password}){
    const user = await prisma.user.findFirst({
        where: {
            email,
        }
    });

    if (!user){
        return false;
    }
    
    const result = await bcryptjs.compare(password, user.password);
    if (result){
        return user;
    }
}

async function createUser({email, password}){
    let user = await prisma.user.findFirst({
        where: {
            email,
        }
    });

    if (user){
        return null;
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    user = await prisma.user.create({
        email,
        password: hashedPassword,
    })
    return user;
}

module.exports = {
    authenUser,
    createUser,
}