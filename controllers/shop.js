const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
};

exports.getProductDetail = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
  .then(product => {
    if (!product){
      return res.redirect('/');
    }
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products/' + product.id,
    })
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
}

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    return cart.getProducts();
  })
  .then(products => {
    let totalPrice = 0;
    products.forEach(prod => {
      totalPrice += prod.price * prod.CartItem.quantity;
    })
    res.render('shop/cart', {
      products,
      path: '/cart',
      pageTitle: 'Your Cart',
      totalPrice,
    })
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let newQuantity = 1;
  let fetchedCart;
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts({
      where: {
        id: productId,
      }
    });
  })
  .then(products => {
    let product;
    if (products.length > 0){
      product = products[0];
    }
    if (product){
      newQuantity = product.CartItem.quantity + 1;
      return product;
    }
    return Product.findByPk(productId)
  })
  .then(product => {
    return fetchedCart.addProduct(product, {
      through: {
        quantity: newQuantity,
      }
    })
  })
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
}

exports.deleteCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({
      where: {
        id: productId,
      }
    })
  })
  .then(products => {
    if (products.length > 0){
      return products[0].CartItem.destroy();
    }
  })
  .then(result => {
    return res.redirect('/cart');
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({
    include: 'Products',
  })
  .then(orders => {
    res.render('shop/orders', {
      orders,
      pageTitle: 'Order',
      path: '/order',
    })
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
};

exports.postOrders = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts();
  })
  .then(products => {
    return req.user.createOrder()
    .then(order => {
      order.addProducts(products.map(product => {
        product.OrderItem = {
          quantity: product.CartItem.quantity,
        }
        return product;
      }))
    })
    .catch(err => {
      console.log(err);
      return next(new Error(err));
    })
  })
  .then(result => {
    return fetchedCart.setProducts(null);
  })
  .then(() => {
    res.redirect('/orders');
  })
  .catch(err => {
    console.log(err);
    return next(new Error(err));
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
