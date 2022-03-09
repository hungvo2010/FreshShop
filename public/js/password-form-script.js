$("#passwordForm").validator().on("submit", function (event) {
    if (event.isDefaultPrevented()) {
        // handle the invalid form...
        formError();
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
    const oldpassword = $("#oldpassword").val();
    const newpassword = $("#newpassword").val();
    const confirmpassword = $("#confirmpassword").val();
    
    const data = getData(oldpassword, newpassword, confirmpassword);
    const url = '/password'

    $.ajax({
        type: "POST",
        url,
        data,
        error: function(xhr, exception) {
            const status = xhr.status.toString();
            if (status.startsWith('4')){
                formError("#passwordForm");
                submitMSG(false, "Your information is invalid.");
            }
        },
        success: function(data, textStatus, xhr) {
            const status = xhr.status.toString();
            if (status.startsWith('2')){
                formSuccess("#passwordForm", true, "Update password success!") // redirect
            }
        },
        // complete: function(xhr, textStatus) {
        //     console.log(xhr.status);
        // } 
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