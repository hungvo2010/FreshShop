const express = require('express');

const protectRoutes = require('../middleware/protectRoutes');
const sellerController = require('../controllers/sellerController');

const router = express.Router();

// /seller/add-product => GET
router.get('/add-product', protectRoutes, sellerController.getAddProduct);

// /seller/products => GET
router.get('/', protectRoutes, sellerController.getSellerProducts);

// /seller/add-product => POST
router.post('/add-product', protectRoutes, sellerController.postAddProduct);

// /seller/edit-product/:productId => GET
router.get('/edit/:productId', protectRoutes, sellerController.getEditProduct);

// /seller/edit-product => POST
router.post('/edit', protectRoutes, sellerController.postEditProduct);

// /seller/product/:productId => POST
router.delete('/delete', protectRoutes, sellerController.postDeleteProduct);

module.exports = router;
