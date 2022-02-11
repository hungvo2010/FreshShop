const express = require('express');

const protectRoutes = require('../middleware/protectRoutes');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetail);

router.get('/cart', protectRoutes, shopController.getCart);

router.post('/cart', protectRoutes, shopController.postCart);

router.post('/delete-cart', protectRoutes, shopController.deleteCart);

router.get('/orders', protectRoutes, shopController.getOrders);

router.post('/orders', protectRoutes, shopController.postOrders);

router.get('/checkout', protectRoutes, shopController.getCheckout);

router.get('/orders/:orderId', protectRoutes, shopController.getInvoice);

module.exports = router;
