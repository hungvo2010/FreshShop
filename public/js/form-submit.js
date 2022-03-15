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
        $(this.idForm).validator().on("submit", event => {
            if (event.isDefaultPrevented()) {
                // handle the invalid form...
                this.formError();
                this.submitMSG(false, formInputErrorMessage);
            } else {
                // everything looks good!
                event.preventDefault();
                this.submitForm();
            }
        });
    }

    formSuccess(isError, message){
        // $(this.idForm)[0].reset();
        this.submitMSG(isError, message);
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
        return $(this.idForm).serialize().toString('hex');
    }

    submitForm(){
        const data = this.getData();
        console.log(data);
        $.ajax({
            type: this.method,
            url: this.url,
            data,
            error: (xhr, exception) => {
                const status = xhr.status.toString();
                const message = JSON.parse(xhr.responseText).message;
                if (status.startsWith('4')){
                    this.formError();
                    this.submitMSG(false, message);
                }
                else if (status.startsWith('5')){
                    this.formError();
                    this.submitMSG(false, "Some errors occurred");
                }
            },

            success: (data, textStatus, xhr) => {
                this.successHandler.call(this, data, textStatus, xhr);
            }
        });
    }
}

const successSigninHandler = (data, textStatus, xhr) => {
    const status = xhr.status.toString();
    if (status.startsWith('2')){
        window.location.replace("http://localhost:3000/"); // redirect
    }
};

const successSignupHandler = (data, textStatus, xhr) => {
    const status = xhr.status.toString();
    if (status.startsWith('2')){
        window.location.replace("http://localhost:3000/signin"); // redirect
    }
};

const successSetNewPasswordHandler = (data, textStatus, xhr) => {
    const status = xhr.status.toString();
    if (status.startsWith('2')){
        window.location.replace('http://localhost:3000/signin');
    }
};

const successUpdatePasswordHandler = function (data, textStatus, xhr) {
    const status = xhr.status.toString();
    if (status.startsWith('2')){
        this.formSuccess(true, "Update password success!")
    }
}

const successUpdateProfileHandler = function (data, textStatus, xhr) {
    const status = xhr.status.toString();
    if (status.startsWith('2')){
        this.formSuccess(true, "Update profile success!");
    }
};

const successRequestChangePasswordHandler = function (data, textStatus, xhr) {
    const status = xhr.status.toString();
    if (status.startsWith('2')){
        this.formSuccess(true, "Please check your inbox to reset password")
    }
};

new FormSubmit("#signinForm", '/signin', 'POST', "#msgSubmit", successSigninHandler).registerEventHandler("Did you fill in the form properly?");
new FormSubmit("#signupForm", '/signup', 'POST', "#msgSubmit", successSignupHandler).registerEventHandler("Did you fill in the form properly?");
new FormSubmit("#chooseForm", '/new-password', 'POST', "#msgSubmit", successSetNewPasswordHandler).registerEventHandler("Did you fill in the form properly?");
new FormSubmit("#passwordForm", '/password', 'POST', "#msgSubmit", successUpdatePasswordHandler).registerEventHandler("Did you fill in the form properly?");
new FormSubmit("#profileForm", '/profile', 'POST', "#msgSubmit", successUpdateProfileHandler).registerEventHandler("Did you fill in the form properly?");
new FormSubmit("#resetForm", '/reset', 'POST', "#msgSubmit", successRequestChangePasswordHandler).registerEventHandler("Did you fill in the form properly?");
