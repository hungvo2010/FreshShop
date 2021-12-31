exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product', 
    editMode: false, // in Add Product page
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title,
    imageUrl,
    price,
    description,
  })
  .then(result => {
    res.redirect('/admin/products');
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
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const newTitle = req.body.title;
  const newImageUrl = req.body.imageUrl;
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
    product.imageUrl = newImageUrl;
    product.price = newPrice;
    product.description = newDescription;
    return product.save();
  })
  .then(prod => {
    res.redirect('/admin/products');
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
}