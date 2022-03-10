const addCartLink = document.querySelectorAll("#addToCart");
addCartLink.forEach(item => {
    item.addEventListener('click', anchor => {
        item.parentNode.submit();
    })
})


