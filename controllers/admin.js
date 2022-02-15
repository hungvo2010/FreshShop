const deleteFile = require('../util/deleteFile');

const ITEMS_PER_PAGE = 2; 

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product', 
    editMode: false, // in Add Product page
    errorMessage: ''
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  // console.log(image.path);
  // console.log(image);

  if (!image){
    return res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product', 
      editMode: false, // in Add Product page
      errorMessage: 'Your file attached is not valid.'
    });
  }

  try {
    await req.user.createProduct({
      title,
      imageUrl: image.path,
      price,
      description,
    });
    res.redirect('/admin/products');
  }
  catch (err) {
    console.log(err);
    return next(new Error(err));
  }
};

exports.getProducts = async (req, res, next) => {
  const page = req.query.page || 1;
  try {
    const totalItems = await req.user.countProducts();
    const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const products = await req.user.getProducts({
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE
    });
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      currentPage: +page,
      lastPage
    });
  }
    catch (err) {
      console.log(err);
      return next(new Error(err));
    }
};

exports.postEditProduct = async (req, res, next) => {
  const productId = req.body.productId;
  const newTitle = req.body.title;
  const newImage = req.file;
  const newPrice = req.body.price;
  const newDescription = req.body.description;
  try {
    let products = await req.user.getProducts({
      where: {
        id: productId,
      }
    });
    let product = products.length > 0 ? products[0] : null;
    if (!product){
      return res.redirect('/admin/products');
    }
    product.title = newTitle;
    if (newImage){
      deleteFile(product.imageUrl);
      product.imageUrl = newImage.path;      
    }
    product.price = newPrice;
    product.description = newDescription;
    await product.save();
    res.redirect('/admin/products');
  }
  catch (err){
    console.log(err);
    return next(new Error(err));
  }
}

exports.getEditProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const products = await req.user.getProducts({
      where: {
        id: productId,
      }
    })
    const product = await products.length > 0 ? products[0] : null;
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
    console.log(err);
    return next(new Error(err));
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const products = await req.user.getProducts({
      where: {
        id: productId,
      }
    })
    const product = products.length > 0 ? products[0] : null;
    if (!product){
        return res.redirect('/admin/products');
    }
    deleteFile(product.imageUrl);
    product.destroy();
    res.status(200).json({});
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({});
  }
}