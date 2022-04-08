// const deleteFile = require('../util/deleteFile');
// const getItemsPerPage = require('../util/ItemsPerPage');
const sellerModel = require('../models/sellerModel');

// const ITEMS_PER_PAGE = getItemsPerPage(); 

// function getQueryPage(req){
//     let page = req.query.page || 1;
//     return parseInt(page);
// }

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

exports.getAddProduct = (req, res, next) => {
	res.render('seller/add-product', {
		pageTitle: 'Add Product',
	});
};

exports.postAddProduct = async (req, res, next) => {
	const {title, price, description} = req.body;
	const image = req.file;

	if (!image){
		return res.render('seller/edit-product', {
			pageTitle: 'Add Product',
			path: '/seller/add-product', 
			editMode: false, // in Add Product page
			errorMessage: 'Your file attached is not valid.'
		});
	}

	try {
		await sellerModel.createProduct({
			title,
			imageUrl: image.path,
			price: parseFloat(price),
			description,
			userId: req.user.id,
		});
		res.redirect('/seller/products');
	}

	catch (err) {
		return next(err);
	}
};

exports.getSellerProducts = async (req, res, next) => {
    // const page = getQueryPage(req);

    try {
        const products = await sellerModel.getSellerProducts(req.user.id);

        res.render('seller/products', {
			products,
			pageTitle: 'Your products',
        });
    }

    catch (err) {
        return next(err);
    }
};

exports.postEditProduct = async (req, res, next) => {

	const newImage = req.file;
	const {productId, title, price, description} = req.body;

	try {
		let product = await sellerModel.findProduct(productId, req.user.id);
		if (!product){
			return res.redirect('/seller/products');
		}

		const newProduct = {
			title,
			price: parseFloat(price),
			description
		}
		if (newImage){
			deleteFile(product.imageUrl);
			newProduct.imageUrl = newImage.path;      
		}

		await sellerModel.updateProduct(productId, newProduct);
		res.redirect('/seller/products');
	}

	catch (err){
		return next(err);
	}
}

exports.getEditProduct = async (req, res, next) => {
	const productId = req.params.productId;

	try {
		const product = await sellerModel.findProduct(productId, req.user.id);
		if (!product){
			return res.redirect('/seller/products');
		}

		res.render("seller/edit-product", {
			product,
			pageTitle: 'Edit Product',
			path: req.url,
			editMode: req.query.editMode, // in Edit Product page
			errorMessage: ''
		})
	}

	catch (err) {
		return next(err);
	}
};

exports.postDeleteProduct = async (req, res, next) => {
	const productId = req.params.productId;
	
	try {
		const product = await sellerModel.findProduct(productId, req.user.id);
		
		if (!product){
			return res.redirect('/seller/products');
		}
		
		deleteFile(product.imageUrl);
		sellerModel.deleteProduct(productId);
		res.status(200).json({});
	}
	
	catch(err) {
		return next(err);
	}
}