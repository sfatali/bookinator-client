var registerLink = {};
var cityOptions = [];

function setRegisterContent(link) {
    self.registerLink = link;

    $("#container-content").remove();
    $("#container-header").append('<div id="container-content" style="background-color: rgba(238, 238, 238, 0.85);'
        +'margin: auto; width: 320px; padding: 25px">'+
        '</div>');

    formHtml = '<form>';

    for(var i = 0; i < registerLink.requestTemplate.length; i++) {
        var reqItem = registerLink.requestTemplate[i];
        //console.log("reqItem.field: "+reqItem.field);

        if(reqItem.type == "password") {
            formHtml += '<div class="form-group">'+
                '<label for="'+reqItem.field+'">'+capitalizeFirstLetter(reqItem.field)+'</label>'+
                '<input type="password" class="form-control" id="'+reqItem.field+'" aria-describedby="'+reqItem.field+'Help"'+
                ' placeholder="Enter '+reqItem.field+'">'+
                '<small id="'+reqItem.field+'Help" class="form-text text-muted"></small>'+
                '</div>';
        } else if(reqItem.type == "list") {
            $.ajax({
                url: reqItem.listSource.href,
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function (data) {
                    self.cityOptions = data;
                }
            });
            formHtml += '<div class="form-group">'+
                '<label for="'+reqItem.field+'">'+capitalizeFirstLetter(reqItem.field)+'</label>';
            formHtml += '<select class="form-control" id="'+reqItem.field+'">';
            formHtml += '<option selected="selected"></option>';
            for(var j=0; j<cityOptions.length; j++) {
                formHtml += '<option>'+cityOptions[j].name+'</option>';
            }
            formHtml +='</select></div>';
        } else {
            formHtml += '<div class="form-group">'+
                '<label for="'+reqItem.field+'">'+capitalizeFirstLetter(reqItem.field)+'</label>'+
                '<input type="text" class="form-control" id="'+reqItem.field+'" aria-describedby="'+reqItem.field+'Help"'+
                ' placeholder="Enter '+reqItem.field+'">'+
                '<small id="'+reqItem.field+'Help" class="form-text text-muted"></small>'+
                '</div>';
        }
    }

    formHtml += '<button type="button" onclick="register()" style="border-radius: 0;" class="btn btn-primary">Submit</button>';
    formHtml += '</form>';
    $("#container-content").append(formHtml);

    $('select').on('change', function(e){
        console.log("onChange!!!");
        console.log(this.value);//,
        //this.cityOptions[this.selectedIndex].value,
        //$(this).find("option:selected").val());
    });
}

$.getScript('login.js', function() {
});

function register() {
    var request = {};
    for(var i = 0; i < self.registerLink.requestTemplate.length; i++) {
        var reqItem = self.registerLink.requestTemplate[i];
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
        if(reqItem.minLength != null && value.length < reqItem.minLength) {
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

        if(reqItem.type == "list") {
            for(var j=0; i<self.cityOptions.length; j++) {
                //console.log(self.cityOptions[j]);
                if(self.cityOptions[j].name == value) {
                    value = self.cityOptions[j].id;
                    break;
                }
            }
        }

        request[""+reqItem.field+""] = value;
    }

    if(isValidated) {
        console.log(request);
        makeRegisterRequest(request, self.registerLink.method, self.registerLink.href);
    }
}

function makeRegisterRequest(requestBody, requestMethod, href) {
    $.ajax({
        url: href,
        type: requestMethod,
        contentType: 'application/json',
        data: JSON.stringify(requestBody),
        success: function(data)
        {
            var _links = data._links;
            console.log("Success!!!! ");

            $.notify("Successfully registered", "success");
            setContainerHeader(menuLinks.login);
            setLoginContent(menuLinks.login);
        },
        error: function (data) {
            console.log("Sadness");
            console.log(data);
            $.notify(data.responseJSON.message, "error");
        }
    });
}