const div = document.querySelectorAll("div[class=card__actions");
div.forEach(ele => {
    const btn = ele.querySelector("button");
    const prodId = ele.getElementsByTagName("input")[1].value;
    const csrf = ele.querySelector("[name=_csrf").value;
    btn.addEventListener('click', () => {
        fetch("/admin/product/" + prodId, {
            method: "DELETE",
            headers: {
                "csrf-token": csrf
            }
        })
        .then(res => {
            const productItem = btn.closest("article");
            productItem.remove();
        })
        .catch(err => {
            console.log(err);
        })
    })
})