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

async function upsertUser({id, email, password}){
    let user = await prisma.user.findFirst({
        where: {
            OR: [
                {email: email},
                {id: id}
            ]
        }
    });

    // if (user){
    //     console.log("reach here");
    //     return null;
    // }

    const hashedPassword = await bcryptjs.hash(password, 12);
    user = await prisma.user.upsert({
        where: {
            OR: [
                {email: email},
                {id: id}
            ]
            // email,
        },
        update: {
            password: hashedPassword
        },
        create: {
            id,
            email,
            password: hashedPassword
        }
    })

    return user;
}

async function findUser(term){
    let condition;
    if (typeof term === 'string'){
        condition = {
            where: {
                email: term,
            }
        }
    }
    else {
        condition = {
            where: {
                id: term
            }
        }
    }
    const user = await prisma.user.findFirst(condition);

    return user;
}

async function saveToken(token, id){
    await prisma.token.upsert({
        where: {
            userId: id
        },
        update: {
            token,
            expireIn: new Date(Date.now() + 600000)
        },
        create: {
            userId: id,
            token,
            expireIn: new Date(Date.now() + 600000)
        }
    });
}

async function findToken(resetToken){
    const existToken = await prisma.token.findFirst({
        where: {
            token: resetToken,
            expireIn: {
                gt: new Date()
            }
        }
    })
    return existToken;
}

async function deleteToken(userId){
    await prisma.token.delete({
        where: {
            userId,
        }
    })
}

module.exports = {
    authenUser,
    upsertUser,
    findUser,
    saveToken,
    findToken,
    deleteToken,
}