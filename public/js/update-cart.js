const updateCartButton = document.querySelector("#update-cart");

function addItemsToProductsInfo(products, productsQuantities){
    let productsInfo = [];
    for (let i = 0; i < products.length; ++i){
        productsInfo.push({productId: products[i].dataset.productid, quantity: +productsQuantities[i].value});
    }
    return productsInfo;
}

function setNodesValues(subTotalPrice, totalDiscount, couponDiscount, vat, grandTotal){
    const totalNode = document.querySelector("#subTotal");
    const discountNode = document.querySelector("#discount");
    const couponNode = document.querySelector("#coupon");
    const vatNode = document.querySelector("#vat");
    const grandNode = document.querySelector("#grand-total");

    setValues(totalNode, subTotalPrice);
    setValues(discountNode, totalDiscount);
    setValues(couponNode, couponDiscount);
    setValues(vatNode, vat);
    setValues(grandNode, grandTotal);
}

function setValues(node, value){
    console.log(node.innerHTML);
    node.innerHTML = "$ " + value;
}

function getVAT(){
    return 2;
}

updateCartButton.addEventListener('click', event => {
    event.preventDefault();

    const products = document.querySelectorAll("a[data-productId]");
    const productsQuantities = document.querySelectorAll("input[type='number']");
    
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
            return res.json();
        }
    })
    .then(resData => {
        if (!resData){
            return;
        }
        console.log(resData);
        const subTotalPrice = resData.totalPrice;
        const totalDiscount = resData.totalDiscount;
        const couponDiscount = resData.couponDiscount;
        const vat = getVAT();
        const grandTotal = +subTotalPrice - +couponDiscount + +vat;

        setNodesValues(subTotalPrice, totalDiscount, couponDiscount, vat, grandTotal.toFixed(2));
    })
    
})