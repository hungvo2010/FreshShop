const addCartLink = document.querySelectorAll("[class~='cart']");
const addWishlistLink = document.querySelectorAll("[class~='wishlist']")

addCartLink.forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        fetch("/add-cart", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: item.dataset.productid
            })
        })
        .then(res => {
            window.location.replace('/cart'); // redirect to cart
        })
    })
})

addWishlistLink.forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        fetch("/add-wishlist", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: item.dataset.productid
            })
        })
        .then(res => {
            item.childNodes[0].style.color = "#d93f34";
        })
    })
})


