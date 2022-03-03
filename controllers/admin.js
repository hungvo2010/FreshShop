const deleteFile = require('../util/deleteFile');
const getItemsPerPage = require('../util/ItemsPerPage');
const adminModel = require('../models/Admin');

const ITEMS_PER_PAGE = getItemsPerPage(); 

function getQueryPage(req){
    let page = req.query.page || 1;
    return parseInt(page);
}

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product', 
		editMode: false, // in Add Product page
		errorMessage: ''
	});
};

exports.postAddProduct = async (req, res, next) => {
	const {title, price, description} = req.body;
	const image = req.file;

	if (!image){
		return res.render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product', 
			editMode: false, // in Add Product page
			errorMessage: 'Your file attached is not valid.'
		});
	}

	try {
		await adminModel.createProduct({
			title,
			imageUrl: image.path,
			price: parseFloat(price),
			description,
			userId: req.user.id,
		});
		res.redirect('/admin/products');
	}

	catch (err) {
		return next(err);
	}
};

exports.getProducts = async (req, res, next) => {
    const page = getQueryPage(req);

    try {
        const totalItems = await adminModel.countAdminProducts(req.user.id);
        const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const products = await adminModel.getAdminProducts(req.user.id, (page - 1) * ITEMS_PER_PAGE, ITEMS_PER_PAGE);

        res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products',
			currentPage: +page,
			lastPage
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
		let product = await adminModel.findProduct(+productId, req.user.id);
		if (!product){
			return res.redirect('/admin/products');
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

		await adminModel.updateProduct(+productId, newProduct);
		res.redirect('/admin/products');
	}

	catch (err){
		return next(err);
	}
}

exports.getEditProduct = async (req, res, next) => {
	const productId = req.params.productId;

	try {
		const product = await adminModel.findProduct(+productId, req.user.id);
		if (!product){
			return res.redirect('/admin/products');
		}

		res.render("admin/edit-product", {
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
		const product = await adminModel.findProduct(+productId, req.user.id);
		
		if (!product){
			return res.redirect('/admin/products');
		}
		
		deleteFile(product.imageUrl);
		adminModel.deleteProduct(+productId);
		res.status(200).json({});
	}
	
	catch(err) {
		return next(err);
	}
}