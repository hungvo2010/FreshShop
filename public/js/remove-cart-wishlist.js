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
            item.closest('tr').remove();
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
            item.closest('tr').remove();
        })
    })
})