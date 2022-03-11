$("#resetForm").validator().on("submit", function (event) {
    if (event.isDefaultPrevented()) {
        // handle the invalid form...
        formError("#resetForm");
        submitMSG(false, "Did you fill in the form properly?");
    } else {
        // everything looks good!
        event.preventDefault();
        submitForm();
    }
});

function submitForm(){
    // Initiate Variables With Form Content
    const data = "email=" + $("#email").val();
    const url = '/reset';

    $.ajax({
        type: "POST",
        url,
        data,
        error: function(xhr, exception) {
            const status = xhr.status.toString();
            const message = JSON.parse(xhr.responseText).message;
            if (status.startsWith('4')){
                formError("#resetForm");
                submitMSG(false, message);
            }
            else if (status.startsWith('5')){
                formError("#resetForm");
                submitMSG(false, "Some errors occurred, please try again later");
            }
        },
        success: function(data, textStatus, xhr) {
            const status = xhr.status.toString();
            if (status.startsWith('2')){
                formSuccess("#resetForm", true, "Please check your inbox to reset password")
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