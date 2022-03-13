const express = require('express');
const { check } = require('express-validator/check');

const protectRoutes = require('../middleware/protectRoutes');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/about-us', shopController.getAboutUs);

router.get('/contact-us', shopController.getContactUs);

router.get('/gallery', shopController.getGallery);

router.get('/shop', shopController.getShop);

router.get('/products/:productId', shopController.getProductDetail);

router.get('/cart', protectRoutes, shopController.getCart);

router.post('/add-cart', protectRoutes, [
    check("productId").not().isEmpty().withMessage("Invalid product")
], shopController.postCart);

router.post('/delete-cart', protectRoutes, shopController.deleteCart);

router.get('/orders', protectRoutes, shopController.getOrders);

router.get('/checkout', protectRoutes, shopController.getCheckout);

router.get('/my-account', protectRoutes, shopController.getMyAccount);

router.get('/wishlist', protectRoutes, shopController.getWishList);

router.post('/add-wishlist', protectRoutes, [
    check("productId").not().isEmpty().withMessage("Invalid product")
], shopController.postWishList);

router.get('/orders/:orderId', protectRoutes, shopController.getInvoice);

module.exports = router;