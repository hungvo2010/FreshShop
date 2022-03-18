const removeCart = document.querySelectorAll("[class*='remove-cart']");
const removeWishlist = document.querySelectorAll("[class*='remove-wishlist']");

removeCart.forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        return fetch("/remove-cart", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: item.dataset.productid
            })
        })
        .then(res => {
            const statusCode = res.status.toString();
            if (statusCode.startsWith('2')){
                item.closest('tr').remove();
            }
        })
    })
})

removeWishlist.forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        return fetch("/remove-wishlist", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: item.dataset.productid
            })
        })
        .then(res => {
            const statusCode = res.status.toString();
            if (statusCode.startsWith('2')){
                item.closest('tr').remove();
            }
        })
    })
})