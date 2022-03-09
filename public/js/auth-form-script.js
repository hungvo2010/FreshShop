$("#authForm").validator().on("submit", function (event) {
    if (event.isDefaultPrevented()) {
        // handle the invalid form...
        formError("#authForm");
        submitMSG(false, "Did you fill in the form properly?");
    } else {
        // everything looks good!
        event.preventDefault();
        submitForm();
    }
});

function getData(...args){
    const [name, email, password, confirmpassword] = args;
    let data = "";
    if (name){
        data = "name=" + name + "&";
    }
    data += "email=" + email;
    data += "&password=" + password;
    if (confirmpassword) {
        data += "&confirmpassword=" + confirmpassword;
    }
    return data;
}


function submitForm(){
    // Initiate Variables With Form Content
    const name = $("#name").val();
    const email = $("#email").val();
    const password = $("#password").val();
    const confirmpassword = $("#confirmpassword").val();
    
    const data = getData(name, email, password, confirmpassword);
    const url = name ? "/signup" : "/signin";

    $.ajax({
        type: "POST",
        url,
        data,
        error: function(xhr, exception) {
            const status = xhr.status.toString();
            const message = JSON.parse(xhr.responseText).message;
            if (status.startsWith('4')){
                formError("#authForm");
                submitMSG(false, message);
            }
            else if (status.startsWith('5')){
                formError("#authForm");
                submitMSG(false, "Some errors occurred");
            }
        },
        success: function(data, textStatus, xhr) {
            const status = xhr.status;
            if (status === 200){
                window.location.replace("http://localhost:3000/"); // redirect
            }
            else if (status === 201) {
                window.location.replace("http://localhost:3000/signin");
            }
        },
    });
}

function formSuccess(idForm, message){
    $(idForm)[0].reset();
    submitMSG(true, message)
}

function formError(idForm){
    $(idForm).removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $(this).removeClass();
    });
}

function submitMSG(valid, msg){
    if(valid){
        var msgClasses = "h3 text-center tada animated text-success";
    } else {
        var msgClasses = "h3 text-center text-danger";
    }
    $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
}