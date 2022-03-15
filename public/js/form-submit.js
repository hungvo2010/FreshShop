class FormSubmit {
    idForm;
    url;
    method;
    idMsgSubmit;
    successHandler;

    constructor(idForm, url, method, idMsgSubmit, successHandler){
        this.idForm = idForm;
        this.url = url;
        this.method = method;
        this.idMsgSubmit = idMsgSubmit;
        this.successHandler = successHandler;
    }

    registerEventHandler(formInputErrorMessage){
        $(this.idForm).validator().on("submit", function (event) {
            if (event.isDefaultPrevented()) {
                // handle the invalid form...
                this.formError(this.idForm);
                this.submitMSG(false, formInputErrorMessage);
            } else {
                // everything looks good!
                event.preventDefault();
                this.submitForm();
            }
        });
    }

    formSuccess(isError, message){
        $(this.idForm)[0].reset();
        submitMSG(isError, message);
    }

    formError(){
        $(this.idForm).removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass();
        });
    }

    submitMSG(valid, msg){
        if(valid){
            var msgClasses = "h3 text-center tada animated text-success";
        } else {
            var msgClasses = "h3 text-center text-danger";
        }
        $(this.idMsgSubmit).removeClass().addClass(msgClasses).text(msg);
    }

    getData(){
        return $(this.idForm).serialize();
    }

    submitForm(){
        const data = getData();

        $.ajax({
            type: this.method,
            url: this.url,
            data,
            error: function(xhr, exception) {
                const status = xhr.status.toString();
                const message = JSON.parse(xhr.responseText).message;
                if (status.startsWith('4')){
                    formError(this.idForm);
                    submitMSG(false, message);
                }
                else if (status.startsWith('5')){
                    formError(this.idForm);
                    submitMSG(false, "Some errors occurred");
                }
            },

            success: this.successHandler,
        });
    }
}

const successLoginHandler = function(data, textStatus, xhr) {
    const status = xhr.status.toString();
    if (status.startsWith('2')){
        window.location.replace("http://localhost:3000/"); // redirect
    }
};

const successSignupHandler = function(data, textStatus, xhr) {
    const status = xhr.status.toString();
    if (status.startsWith('2')){
        window.location.replace("http://localhost:3000/signin"); // redirect
    }
};

const successSetNewPasswordHandler = function(data, textStatus, xhr) {
    const status = xhr.status.toString();
    if (status.startsWith('2')){
        window.location.replace('http://localhost:3000/signin');
    }
};

const successUpdatePasswordHandler = function(data, textStatus, xhr) {
    const status = xhr.status.toString();
    if (status.startsWith('2')){
        this.formSuccess(true, "Update password success!")
    }
}

const successUpdateProfileHandler = function(data, textStatus, xhr) {
    const status = xhr.status.toString();
    if (status.startsWith('2')){
        this.formSuccess(true, "Update profile success!");
    }
};

const successRequestChangePasswordHandler = function(data, textStatus, xhr) {
    const status = xhr.status.toString();
    if (status.startsWith('2')){
        this.formSuccess(true, "Please check your inbox to reset password")
    }
};

new FormSubmit("#authForm", '/signin', 'POST', "#msgSubmit", successLoginHandler).registerEventHandler("Did you fill in the form properly?");
new FormSubmit("#authForm", '/signup', 'POST', "#msgSubmit", successSignupHandler).registerEventHandler("Did you fill in the form properly?");
new FormSubmit("#chooseForm", '/new-password', 'POST', "#msgSubmit", successSetNewPasswordHandler).registerEventHandler("Did you fill in the form properly?");
new FormSubmit("#passwordForm", '/password', 'POST', "#msgSubmit", successUpdatePasswordHandler).registerEventHandler("Did you fill in the form properly?");
new FormSubmit("#profileForm", '/profile', 'POST', "#msgSubmit", successUpdateProfileHandler).registerEventHandler("Did you fill in the form properly?");
new FormSubmit("#resetForm", '/reset', 'POST', "#msgSubmit", successRequestChangePasswordHandler).registerEventHandler("Did you fill in the form properly?");
