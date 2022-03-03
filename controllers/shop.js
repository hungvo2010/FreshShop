const populateInvoice = require('../util/populateInvoice');
const getItemsPerPage = require('../util/ItemsPerPage');

const shopModel = require('../models/Shop');

const ITEMS_PER_PAGE = getItemsPerPage();

function getQueryPage(req){
    let page = req.query.page || 1;
    return parseInt(page);
}

exports.getProducts = async (req, res, next) => {
    const page = getQueryPage(req);

    try {
        let totalItems = await shopModel.countProducts();
        const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const products = await shopModel.getProducts((page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE);
        
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            currentPage: page,
            lastPage,
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
    const page = getQueryPage(req);
    
    try {
        let totalItems = await shopModel.countProducts();
        const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const products = await shopModel.getProducts((page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE);
        
        res.render('shop/index', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            currentPage: +page,
            lastPage,
        });
    }

    catch(err) {
        return next(err);
    }
};

exports.getCart = async (req, res, next) => {

    try {
        const cartInfo = await shopModel.getProductsOfCart(req.user.id);
        let totalPrice = 0;

        if (cartInfo && cartInfo.cartItem){
            cartInfo.cartItem.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
            })
            return res.render('shop/cart', {
                products: cartInfo.cartItem,
                path: '/cart',
                pageTitle: 'Your Cart',
                totalPrice,
            })
        }

        return res.render('shop/cart', {
            products: [],
            path: '/cart',
            pageTitle: 'Your Cart',
            totalPrice,
        })
    }

    catch (err) {
        return next(err);
    }
};

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