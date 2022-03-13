const addWishlistLink = document.querySelectorAll("[class='wishlist']");

function createCartList(product){
    const li = document.createElement(li);
    
}

addWishlistLink.forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        fetch("/add-wishlist", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: item.previousElementSibling.value
            })
        })
        .then(res => {
            return res.json();
        })
        .then(product => {
            // const li = document.createElement('li');
            // li.setA
            // const ul = document.querySelector("cart-list");
            // const badge = document.querySelector("badge");
            // ul.insertBefore()
            window.location.replace('/wishlist');
        })
    })
})


