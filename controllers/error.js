exports.get404 = (req, res, next) => {
  res.status(404).render('404', 
  {
    pageTitle: 'Page Not Found',
    path: req.url,
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('404', 
  {
    pageTitle: 'Page Not Found',
    path: req.url,
  });
};

