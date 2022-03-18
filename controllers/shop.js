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
    return total.toFixed(2);
}

function calculateTotalDiscount(cartItems){
    let totalDiscount = 0;
    cartItems.forEach(item => {
        totalDiscount += item.quantity * 
            (item.product.discount * item.product.price / (100 - item.product.discount)).toFixed(2);
    })

    return totalDiscount.toFixed(2);
}

async function calculateTotalCouponDiscount(cartId, cartItems){
    const totalPrice = calculateTotalPrice(cartItems);
    const couponItem = await shopModel.getCoupon(cartId);
    const discount = couponItem ? couponItem.coupon.discount : 0;

    return (totalPrice * discount / 100).toFixed(2);
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
            return next();
        }
        const cartItems = await getProductsFromCart(req);
        const totalPrice = calculateTotalPrice(cartItems);

        res.render('shop/shop-detail', {
            cartItems: req.user ? cartItems : [],
            product,
            totalPrice,
            pageTitle: product.title,
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
        const products = await shopModel.getProducts();
        const cartItems = await getProductsFromCart(req);
        const totalPrice = calculateTotalPrice(cartItems);

        res.render('shop/gallery', {
            products,
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
        const wishlist = await shopModel.getProductsInWishList(req.user.id);
        const totalPrice = calculateTotalPrice(cartItems);

        res.render('shop/wishlist', {
            pageTitle: 'Wishlist',
            wishlist,
            cartItems: req.user ? cartItems : [],
            totalPrice,
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.postWishList = async (req, res, next) => {
    const isValid = validateRequestBody(req, res);
    if (!isValid){
        return;
    }
    
    const productId = req.body.productId;
    try {
        await shopModel.addProductToWishList(productId, req.user.id);
        res.status(201).json({});
    }

    catch (err) {
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

exports.removeCart = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        await shopModel.deleteCartItem(productId, req.user.id);
        res.status(204).json({});
    }

    catch (err) {
        return next(err);
    }
}

exports.updateCart = async (req, res, next) => {
    try {
        const listOfCartItems = req.body;
        await shopModel.updateCartItem(req.user.id, listOfCartItems);
        const cart = await shopModel.getCart(req.user.id);
        const cartItems = await getProductsFromCart(req);
        
        const totalPrice = calculateTotalPrice(cartItems);
        const totalDiscount = calculateTotalDiscount(cartItems);
        const couponDiscount = await calculateTotalCouponDiscount(cart.id, cartItems);

        res.status(200).json({
            message: "success",
            totalPrice,
            totalDiscount,
            couponDiscount,
        })
    }

    catch (err){
        return next(err);
    }
}

exports.removeWishlist = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        await shopModel.deleteWishlistItem(productId, req.user.id);
        res.status(204).json({});
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