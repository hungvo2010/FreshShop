const express = require('express');

const protectRoutes = require('../middleware/protectRoutes');
const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', protectRoutes, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', protectRoutes, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', protectRoutes, adminController.postAddProduct);

// /admin/edit-product/:productId => GET
router.get('/edit-product/:productId', protectRoutes, adminController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product', protectRoutes, adminController.postEditProduct);

// /admin/product/:productId => POST
router.delete('/product/:productId', protectRoutes, adminController.postDeleteProduct);

module.exports = router;
