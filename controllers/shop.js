const populateInvoice = require('../util/populateInvoice');
const getItemsPerPage = require('../util/ItemsPerPage');

const shopModel = require('../models/Shop');

const ITEMS_PER_PAGE = getItemsPerPage();

const { validationResult } = require('express-validator/check');

function validateRequestBody(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const msg = errors.array()[0].msg;
        res.status(422).json({message: msg});
        return false;
    }
    return true;
}

function getQueryPage(req){
    let page = req.query.page || 1;
    return parseInt(page);
}

async function getProductsFromCart(req){
    if (req.user){
        const cartInfo = await shopModel.getProductsInCart(req.user.id);
        return cartInfo ? cartInfo.cartItem : [];
    }
    return [];
}

function calculateTotalPrice(products){
    let total = 0;
    products.forEach(prod => {
        total += prod.quantity * prod.product.price;
    });
    return parseFloat(total).toFixed(2);
}

exports.getShop = async (req, res, next) => {

    try {
        const products = await shopModel.getProducts();
        const cartItems = await getProductsFromCart(req);
        const totalPrice = calculateTotalPrice(cartItems);

        res.render('shop/shop', {
            cartItems: req.user ? cartItems : [],
            products,
            totalPrice,
            pageTitle: 'All Products',
        });
    }

    catch(err) {
        return next(err);
    }
};

exports.getProductDetail = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const product = await shopModel.findProduct(productId);
        if (!product){
            return res.redirect('/');
        }
        res.render('shop/product-detail', {
            product,
            pageTitle: product.title,
            path: '/products/' + product.id,
        })
    }

    catch (err){
        return next(err);
    }
}

exports.getIndex = async (req, res, next) => {
    try {
        const products = await shopModel.getProducts();
        const cartItems = await getProductsFromCart(req);
        const totalPrice = calculateTotalPrice(cartItems);

        res.render('shop/index', {
            products,
            pageTitle: 'FreshShop',
            cartItems: req.user ? cartItems : [],
            totalPrice,
        });
    }

    catch(err) {
        return next(err);
    }
};

exports.getAboutUs = async (req, res, next) => {
    try {
        const cartItems = await getProductsFromCart(req);
        const totalPrice = calculateTotalPrice(cartItems);

        res.render('shop/about', {
            pageTitle: 'About Us',
            cartItems: req.user ? cartItems : [],
            totalPrice,
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.getContactUs = async (req, res, next) => {
    try {
        const cartItems = await getProductsFromCart(req);
        const totalPrice = calculateTotalPrice(cartItems);

        res.render('shop/contact-us', {
            pageTitle: 'Contact Us',
            cartItems: req.user ? cartItems : [],
            totalPrice,
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.getGallery = async (req, res, next) => {
    try {
        const cartItems = await getProductsFromCart(req);
        const totalPrice = calculateTotalPrice(cartItems);

        res.render('shop/gallery', {
            pageTitle: 'Gallery',
            cartItems: req.user ? cartItems : [],
            totalPrice,
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.getMyAccount = async (req, res, next) => {
    try {
        const cartItems = await getProductsFromCart(req);
        const totalPrice = calculateTotalPrice(cartItems);

        res.render('shop/my-account', {
            pageTitle: 'My Account',
            cartItems: req.user ? cartItems : [],
            totalPrice,
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.getWishList = async (req, res, next) => {
    try {
        const cartItems = await getProductsFromCart(req);
        const totalPrice = calculateTotalPrice(cartItems);

        res.render('shop/wishlist', {
            pageTitle: 'WishList',
            cartItems: req.user ? cartItems : [],
            totalPrice,
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.getGallery = async (req, res, next) => {
    try {
        const cartItems = await getProductsFromCart(req);
        const totalPrice = calculateTotalPrice(cartItems);

        res.render('shop/gallery', {
            pageTitle: 'Gallery',
            cartItems: req.user ? cartItems : [],
            totalPrice,
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.getCart = async (req, res, next) => {

    try {
        const cartItems = await getProductsFromCart(req);
        const totalPrice = calculateTotalPrice(cartItems);

        return res.render('shop/cart', {
            cartItems: req.user ? cartItems : [],
            totalPrice,
            pageTitle: 'Your Cart',
        })
    }

    catch (err) {
        return next(err);
    }
};

exports.postCart = async (req, res, next) => {
    const isValid = validateRequestBody(req, res);
    if (!isValid){
        return;
    }
    
    const productId = req.body.productId;
    try {
        await shopModel.addProductToCart(productId, req.user.id);
        const product = await shopModel.findProduct(productId);
        res.status(201).json(product);
    }

    catch (err) {
        return next(err);
    }
}

exports.getCheckout = async (req, res, next) => {
    try {
        const cartItems = await getProductsFromCart(req);
        const totalPrice = calculateTotalPrice(cartItems);
        
        res.render('shop/checkout', {
            pageTitle: 'Checkout',
            cartItems: req.user ? cartItems : [],
            totalPrice,
        })
    }

    catch (err) {
        return next(err);
    }
}



exports.deleteCart = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        await shopModel.deleteCartItem(productId, req.user.id);
        res.redirect('/cart');
    }

    catch (err) {
        return next(err);
    }
}

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await shopModel.getListOfOrders(req.user.id);
        res.render('shop/orders', {
            orders,
            pageTitle: 'Order',
            path: '/order',
        })
    }

    catch (err) {
        return next(err);
    }
};

exports.postOrders = async (req, res, next) => {
    try {
        await shopModel.addOrder(req.user.id);
        res.redirect('/orders');
    }

    catch (err) {
        return next(err);
    }
}

exports.getInvoice = async (req, res, next) => {
    const orderId = req.params.orderId;
    try {
        const productList = await shopModel.getSpecificOrder(orderId);
        const pdfDoc = populateInvoice(productList, orderId);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=' + 'invoice-' + orderId);

        pdfDoc.pipe(res);
        pdfDoc.end();
    }

    catch (err) {
        return next(err);
    }
}