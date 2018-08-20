var link;

function setLoginContent(link) {
    self.link = link;
    $("#container-content").remove();
    $("#container-header").append('<div id="container-content" style="background-color: rgba(238, 238, 238, 0.85);'
        +'margin: auto; width: 320px; padding: 25px">'+
        '</div>');

    formHtml = '<form>';

    for(var i = 0; i < link.requestTemplate.length; i++) {
        var reqItem = link.requestTemplate[i];

        if(reqItem.type == "password") {
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

    formHtml += '<button type="button" onclick="login()" class="btn btn-primary">Submit</button>';
    formHtml += '</form>';
    $("#container-content").append(formHtml);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function login() {
    var request = new Object();
    for(var i = 0; i < self.link.requestTemplate.length; i++) {
       var reqItem = self.link.requestTemplate[i];
       var value = $('#'+reqItem.field).val();
       var isValidated = true;

       console.log("value: "+$('#'+reqItem.field).val());

       // empty field validation
       if(reqItem.required && (value == undefined || value == null || value == "")) {
           $.notify(capitalizeFirstLetter(reqItem.field) +
                " cannot be empty", "error");
           isValidated = false;
           break;
       }

        // length validation
       if(reqItem.type != "password" && reqItem.minLength != null && value.length < reqItem.minLength) {
           $.notify(capitalizeFirstLetter(reqItem.field) +
               " is too short", "error").autoHideDelay(4000);
           isValidated = false;
           break;
       }

        // length validation
        if(reqItem.maxLength != null && value.length > reqItem.maxLength) {
            $.notify(capitalizeFirstLetter(reqItem.field) +
                " is too long", "error");
            isValidated = false;
            break;
        }

        request[""+reqItem.field+""] = value;
    }

    if(isValidated) {
        makeLoginRequest(request, self.link.method, self.link.href);
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

            // storing token
            localStorage.setItem("token", token);
            // redirecting
            window.location.href = "../home.html";
            /*$.each(_links, function() {
                console.log($(this)[0])
            })*/
        },
        error: function (data) {
            console.log("Sadness");
            console.log(data);
            $.notify("Invalid credentials", "error");
        }
    });
}