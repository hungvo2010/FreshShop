const addCartLink = document.querySelectorAll("[class~='cart']");

function createCartList(product){
    const li = document.createElement(li);
    
}

addCartLink.forEach(item => {
    item.addEventListener('click', event => {
        event.preventDefault();
        fetch("/add-cart", {
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
            window.location.replace('/cart');
        })
    })
})


