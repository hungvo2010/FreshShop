const updateCartButton = document.querySelector("#update-cart");
const products = document.querySelectorAll("a[data-productId]");
const productsQuantities = document.querySelectorAll("input[type='number']");

function addItemsToProductsInfo(products, productsQuantities){
    let productsInfo = [];
    for (let i = 0; i < products.length; ++i){
        productsInfo.push({productId: products[i].dataset.productid, quantity: +productsQuantities[i].value});
    }
    return productsInfo;
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
        
    })
    
})