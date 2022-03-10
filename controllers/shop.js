const populateInvoice = require('../util/populateInvoice');
const getItemsPerPage = require('../util/ItemsPerPage');

const shopModel = require('../models/Shop');

const ITEMS_PER_PAGE = getItemsPerPage();

function getQueryPage(req){
    let page = req.query.page || 1;
    return parseInt(page);
}

exports.getShop = async (req, res, next) => {

    try {
        const products = await shopModel.getProducts();
        res.render('shop/shop', {
            products,
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
        const product = await shopModel.findProduct(+productId);
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
        res.render('shop/index', {
            pageTitle: 'FreshShop',
        });
    }

    catch(err) {
        return next(err);
    }
};

exports.getAboutUs = async (req, res, next) => {
    try {
        res.render('shop/about', {
            pageTitle: 'About Us'
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.getContactUs = async (req, res, next) => {
    try {
        res.render('shop/contact-us', {
            pageTitle: 'Contact Us'
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.getGallery = async (req, res, next) => {
    try {
        res.render('shop/gallery', {
            pageTitle: 'Gallery'
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.getMyAccount = async (req, res, next) => {
    try {
        res.render('shop/my-account', {
            pageTitle: 'My Account'
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.getWishList = async (req, res, next) => {
    try {
        res.render('shop/wishlist', {
            pageTitle: 'WishList'
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.getGallery = async (req, res, next) => {
    try {
        res.render('shop/gallery', {
            pageTitle: 'Gallery'
        });
    }

    catch(err) {
        return next(err);
    }
}

exports.getCart = async (req, res, next) => {

    try {
        // const cartInfo = await shopModel.getProductsOfCart(req.user.id);
        // let totalPrice = 0;

        // if (cartInfo && cartInfo.cartItem){
        //     cartInfo.cartItem.forEach(prod => {
        //         totalPrice += prod.quantity * prod.product.price;
        //     })
        //     return res.render('shop/cart', {
        //         products: cartInfo.cartItem,
        //         path: '/cart',
        //         pageTitle: 'Your Cart',
        //         totalPrice,
        //     })
        // }

        res.render('shop/cart', {
            pageTitle: 'Your Cart',
        })
    }

    catch (err) {
        return next(err);
    }
};

exports.getCheckout = async (req, res, next) => {
    try {
        res.render('shop/checkout', {
            pageTitle: 'Checkout'
        })
    }

    catch (err) {
        return next(err);
    }
}

exports.postCart = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        await shopModel.addProductToCart(+productId, req.user.id);
        res.redirect('/cart');
    }

    catch (err) {
        return next(err);
    }
}

exports.deleteCart = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        await shopModel.deleteCartItem(+productId, req.user.id);
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

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

exports.getInvoice = async (req, res, next) => {
    const orderId = req.params.orderId;
    try {
        const productList = await shopModel.getSpecificOrder(+orderId);
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