const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function populateInvoice(order, orderId){
    const invoiceName = 'invoice-' + orderId;
    const invoicePath = path.join('data', 'invoices', invoiceName);
    
    const PDFDoc = new PDFDocument();
    PDFDoc.pipe(fs.createWriteStream(invoicePath));

    // populate content to invoice file
    PDFDoc.fontSize(20).text("Invoice");
    PDFDoc.fontSize(16).text("-------------------------------");
    let totalPrice = 0;
    order.forEach(item => {
        PDFDoc.text(item.product.title + " - " + item.quantity + " x " + item.product.price);
        totalPrice += item.product.price * item.quantity;
    })
    PDFDoc.text("--------");
    PDFDoc.text("Total price: " + totalPrice);

    return PDFDoc;

    // Implementation for preloading data (inefficient)
    // fs.readFile(invoicePath, (err, data) => {
    //   if (!err){
    //     return next(new Error('Something wrong occured'));
    //   }
    //   res.send(data);
    // })    
}

module.exports = populateInvoice;