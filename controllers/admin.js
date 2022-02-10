exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product', 
    editMode: false, // in Add Product page
    errorMessage: ''
  });
};

exports.postAddProduct = (req, res, next) => {
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

  req.user.createProduct({
    title,
    imageUrl: image.path,
    price,
    description,
  })
  .then(result => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const newTitle = req.body.title;
  const newImage = req.file;
  const newPrice = req.body.price;
  const newDescription = req.body.description;
  req.user.getProducts({
    where: {
      id: productId,
    }
  })
  .then(products => {
    return products.length > 0 ? products[0] : null;
  })
  .then(product => {
    if (!product){
      return res.redirect('/admin/products');
    }
    product.title = newTitle;
    if (newImage){
      product.imageUrl = newImage.path;      
    }
    product.price = newPrice;
    product.description = newDescription;
    return product.save();
  })
  .then(prod => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
}

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  req.user.getProducts({
    where: {
      id: productId,
    }
  })
  .then(products => {
    return products.length > 0 ? products[0] : null;
  })
  .then(product => {
    if (!product){
      return res.redirect('/admin/products');
    }
    res.render("admin/edit-product", {
      product,
      pageTitle: 'Edit Product',
      path: req.url,
      editMode: req.query.editMode, // in Edit Product page
    })
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user.getProducts({
    where: {
      id: productId,
    }
  })
  .then(products => {
    return products.length > 0 ? products[0] : null;
  })
  .then(product => {
    if (!product){
      return res.redirect('/admin/products');
    }
    return product.destroy();
  })
  .then(prod => {
    return res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
}