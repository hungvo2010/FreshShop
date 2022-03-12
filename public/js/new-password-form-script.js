$("#chooseForm").validator().on("submit", function (event) {
    if (event.isDefaultPrevented()) {
        // handle the invalid form...
        formError("#chooseForm");
        submitMSG(false, "Did you fill in the form properly?");
    } else {
        // everything looks good!
        event.preventDefault();
        submitForm();
    }
});

function getData(...args){
    const [oldpassword, newpassword, confirmpassword] = args;
    let data = "oldpassword=" + oldpassword + "&newpassword=" + newpassword + "&confirmpassword=" + confirmpassword;
    return data;
}


function submitForm(){
    // Initiate Variables With Form Content
    const newpassword = $("#newpassword").val();
    const confirmpassword = $("#confirmpassword").val();
    
    const data = getData(newpassword, confirmpassword);
    const url = '/users/new'

    $.ajax({
        type: "POST",
        url,
        data,
        error: function(xhr, exception) {
            const status = xhr.status.toString();
            const message = JSON.parse(xhr.responseText).message;
            if (status.startsWith('4')){
                formError("#chooseForm");
                submitMSG(false, message);
            }
            else if (status.startsWith('5')){
                formError("#chooseForm");
                submitMSG(false, "Some errors occurred");
            }
        },
        success: function(data, textStatus, xhr) {
            const status = xhr.status.toString();
            if (status.startsWith('2')){
                window.location.replace('http://localhost:3000/signin');
            }
        }, 
    });
}

function formSuccess(idForm, isError, message){
    $(idForm)[0].reset();
    submitMSG(isError, message);
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