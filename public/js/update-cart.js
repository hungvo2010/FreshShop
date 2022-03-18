const updateCartButton = document.querySelector("#update-cart");
const products = document.querySelectorAll("a[data-productId]");
const productsQuantities = document.querySelectorAll("input[type='number']");
const productsPrices = document.querySelectorAll("p[data-price]");

function addItemsToProductsInfo(products, productsQuantities){
    let productsInfo = [];
    for (let i = 0; i < products.length; ++i){
        productsInfo.push({productId: products[i].dataset.productid, quantity: +productsQuantities[i].value});
    }
    return productsInfo;
}

function calculateSubTotal(productsPrices, productsQuantities){
    let result = 0;
    for (let index = 0; index < productsPrices.length; index++) {
        result += +productsPrices[index].dataset.price * +productsQuantities[index].value;
    }
    return result;
}

function calculateDiscount(productsPrices, productsQuantities){
    
}

function getCouponDiscount(){

}

function getVAT(){

}

function sentGrandTotal(grandTotal){

}

updateCartButton.addEventListener('click', event => {
    event.preventDefault();
    let productsInfo = addItemsToProductsInfo(products, productsQuantities);

    fetch('http://localhost:3000/update-cart', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productsInfo),
    })
    .then(res => {
        const statusCode = res.status.toString();
        if (statusCode.startsWith('2')){
            let subTotal = calculateSubTotal(productsPrices, productsQuantities);
            let discount = calculateDiscount(productsPrices, productsQuantities);
            let couponDiscount = getCouponDiscount();
            let vat = getVAT();
            let grandTotal = subTotal + discount + couponDiscount + vat;
            sentGrandTotal(grandTotal);
        }
    })
    
})