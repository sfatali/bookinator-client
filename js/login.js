var loginLink;

function setLoginContent(link) {
    self.loginLink = link;
    $("#container-content").remove();
    $("#container-header").append('<div id="container-content" style="background-color: rgba(238, 238, 238, 0.85);'
        +'margin: auto; width: 320px; padding: 25px">'+
        '</div>');

    formHtml = '<form>';
    for(var i = 0; i < loginLink.requestTemplate.length; i++) {
        var reqItem = loginLink.requestTemplate[i];

        if(reqItem.type === "password") {
            formHtml += '<div class="form-group">'+
                '<label for="'+reqItem.field+'">'+capitalizeFirstLetter(reqItem.field)+'</label>'+
                '<input type="password" class="form-control" id="'+reqItem.field+'" aria-describedby="'+reqItem.field+'Help"'+
                ' placeholder="Enter '+reqItem.field+'">'+
                '<small id="'+reqItem.field+'Help" class="form-text text-muted"></small>'+
                '</div>';
        } else {
            formHtml += '<div class="form-group">'+
                '<label for="'+reqItem.field+'">'+capitalizeFirstLetter(reqItem.field)+'</label>'+
                '<input type="text" class="form-control" id="'+reqItem.field+'" aria-describedby="'+reqItem.field+'Help"'+
                ' placeholder="Enter '+reqItem.field+'">'+
                '<small id="'+reqItem.field+'Help" class="form-text text-muted"></small>'+
                '</div>';
        }
    }

    formHtml += '<button type="button" onclick="login()" style="border-radius: 0;" class="btn btn-primary">Submit</button>';
    formHtml += '</form>';
    $("#container-content").append(formHtml);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function login() {
    var request = {};
    for(var i = 0; i < self.loginLink.requestTemplate.length; i++) {
       var reqItem = self.loginLink.requestTemplate[i];
       var value = $('#'+reqItem.field).val();
       var isValidated = true;
       //console.log("value: "+$('#'+reqItem.field).val());

       // empty field validation
       if(reqItem.required && (value == undefined || value == null || value == "")) {
           $.notify(capitalizeFirstLetter(reqItem.field) +
                " cannot be empty", "error");
           isValidated = false;
           break;
       }
        request[""+reqItem.field+""] = value;
    }

    if(isValidated) {
        makeLoginRequest(request, self.loginLink.method, self.loginLink.href);
    }
}

function makeLoginRequest(requestBody, requestMethod, href) {
    $.ajax({
        url: href,
        type: requestMethod,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(requestBody),
        success: function(data, status, xhr)
        {
            var _links = data._links;
            $.notify("Successful authentication!", "success");
            var token = xhr.getResponseHeader("authorization");
            console.log(token);

            // storing token and home self link:
            localStorage.setItem("token", token);
            localStorage.setItem("mainLink", JSON.stringify(_links.home));

            // reloading the page:
            window.location.reload();
        },
        error: function (data) {
            console.log("Sadness");
            console.log(data);
            $.notify(data.responseJSON.message, "error");
        }
    });
}