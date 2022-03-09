$("#profileForm").validator().on("submit", function (event) {
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
    const [name, mobile] = args;
    let data = "name=" + name + "&mobile=" + mobile;
    return data;
}


function submitForm(){
    // Initiate Variables With Form Content
    const name = $("#name").val();
    const mobile = $("#mobile").val();
    
    const data = getData(name, mobile);
    const url = '/profile'

    $.ajax({
        type: "POST",
        url,
        data,
        error: function(xhr, exception) {
            const status = xhr.status.toString();
            if (status.startsWith('4')){
                formError("#profileForm");
                submitMSG(false, "Your information is invalid.");
            }
        },
        success: function(data, textStatus, xhr) {
            const status = xhr.status.toString();
            if (status.startsWith('2')){
                formSuccess("#profileForm", true, "Update profile success!") // redirect
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