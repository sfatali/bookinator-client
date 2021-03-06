var exploreLink;
var selectedOptionsMap = {};

function setExploreContent(link) {
    exploreLink = link;
    console.log(exploreLink);
    console.log(exploreLink.urlTemplate);

    $("#container-content").remove();
    //$("#container-header").append('<div id="container-content"><div id="form-content" style="background-color: rgba(238, 238, 238, 0.85);'
    //    +'margin: auto; width: 750px; padding: 25px">'+
    //    ');

    formHtml = '<div id="container-content"><div id="form-content" style="background-color: rgba(238, 238, 238, 0.85);'
        +'margin: auto; width: 750px; padding: 25px"><form>';

    for(var i = 0; i < exploreLink.urlTemplate.length; i++) {
        console.log(exploreLink.urlTemplate[i]);
        var urlItem = exploreLink.urlTemplate[i];
        console.log(urlItem.title);
        console.log(i);

        // every row has 3 columns, that's why:
        if(i%3 === 0) {
            console.log(" new fuckin row: "+i%4);
            formHtml += '<div class="row">';
        }

        if(urlItem.type === "list") {
            $.ajax({
                url: urlItem.listSource.href,
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function (data) {
                    formHtml += '<div class="col-sm-4"><div class="form-group">'+
                        '<label for="'+urlItem.param+'">'+urlItem.title+':</label>';
                    formHtml += '<select onchange="showOptions(this)" class="form-control" id="'+urlItem.param+'">';
                    formHtml += '<option id="-1" selected="selected"></option>';
                    for(var j=0; j<data.length; j++) {
                        formHtml += '<option id="'+data[j].id+'">'+data[j].name+'</option>';
                    }
                    formHtml +='</select></div></div>';
                }
            });
        } else {
            formHtml += '<div class="col-sm-4"><div class="form-group">'+
                '<label for="'+urlItem.param+'">'+urlItem.title+':</label>'+
                '<input type="text" class="form-control" id="'+urlItem.param+'" aria-describedby="'+urlItem.param+'Help"'+
                ' placeholder="Enter '+urlItem.title.toLowerCase()+'">'+
                '<small id="'+urlItem.param+'Help" class="form-text text-muted"></small>'+
                '</div></div>';
        }

        if(i === 2 || i%3 === 2 || i === exploreLink.urlTemplate.length-1) {
            formHtml += '</div>';
        }
    }

    formHtml += '<div class="row">' +
        '<button type="button" onclick="explore()" style="margin-left: 17px; border-radius: 0;" class="btn btn-primary">' +
        'Search</button></div>';
    formHtml += '</form></div></div>';
    $("#container-header").append(formHtml);
}

function showOptions(s) {
    console.log(s.id);
    console.log(s[s.selectedIndex].value); // get value
    console.log(s[s.selectedIndex].id); // get id
    selectedOptionsMap[s.id] = s[s.selectedIndex].id;
}

function explore() {
    var paramString = "?";
    for(var i = 0; i < exploreLink.urlTemplate.length; i++) {
        var urlItem = exploreLink.urlTemplate[i];
        var value = $('#'+urlItem.param).val();
        console.log("value: "+value);

        if(urlItem.type === "list") {
            value = selectedOptionsMap[urlItem.param];
            console.log("list updated value: "+value);
        }

        if(!(value === "" || value === undefined || value === null || value === "-1")) {
            paramString = paramString +urlItem.param + "=" + value + "&";
        }
    }
    var href = exploreLink.href.substring(0, exploreLink.href.indexOf("{"));
    makeExploreRequest(paramString, exploreLink.method, href);
}

function makeExploreRequest(paramString, requestMethod, href) {
    console.log("yooo");
    console.log(paramString);
    console.log(href);
    $("#embedded").remove();

    $.ajax({
        url: href+paramString,
        type: requestMethod,
        dataType: 'json',
        success: function(data) {
            console.log(data);
            appendBooks(data);
        },
        error: function (data) {
            console.log("Sadness");
            console.log(data);
            $.notify(data.responseJSON.message, "error");
        }
    });
}

function appendBooks(data) {
    $("#container-content").after('<div id="embedded"></div>');
    var lastElement = "#embedded";
    var books = data._embedded.books;

    for(var i=0; i<books.length; i++) {

        var bookHtml = '<div id="book'+books[i].bookId+'" style="background-color: rgba(255, 255, 255, 0.95);' +
            ' margin: auto; height: auto; margin-top: 20px; width: 750px; padding: 8px; ' +
            'padding-left: 18px; padding-bottom: 30px">';

        /*if(books[i].yearPublished !== "") {
            bookHtml += '<row><div class="col-sm-1" style="font-weight: bold;">'+books[i].yearPublished+'</div>' +
                '<div class="col-sm-11 text-primary" style="font-weight: bold;">'+books[i].name+'</div></row>';
        } else {
            bookHtml += '<row><div class="col-sm-12 text-primary" style="font-weight: bold;">'+books[i].name+'</div></row>';
        }*/

        bookHtml += '<div class="row">';
        if(books[i].yearPublished !== "") {
            bookHtml += '<div class="col-sm-10"><h4><small><b>'+books[i].yearPublished+'</b></small> &nbsp;' +
                '<b class="text-primary">'+books[i].name+'</b></h4></div>';
        } else {
            bookHtml += '<div class="col-sm-10 text-primary"><h4><b>'+books[i].name+'</b></h4></div>';
        }
        bookHtml += '</div>';

        bookHtml += '<div class="row">';
        if(books[i].authors.length !== 0) {
            bookHtml += '<div class="col-sm-9">By '+books[i].authors.join(", ")+'</div>';
        } else {
            bookHtml += '<div class="col-sm-9">By -- </div>';
        }
        bookHtml += '<div class="col-sm-3" style="text-align: right; padding-right: 20px;">'+
            '<span class="glyphicon glyphicon-star"></span> <b>Owner rating:&nbsp;&nbsp;'+books[i].ownerAvgRating+'</b></div>';
        bookHtml += '</div>';

        bookHtml += '<div class="row">';
        if(books[i].field !== "") {
            bookHtml += '<div class="col-sm-9"> <b>Field:</b> '+books[i].field+'</div>';
        } else {
            bookHtml += '<div class="col-sm-9"> <b>Field:</b> -- </div>';
        }
        bookHtml += '<div class="col-sm-3" style="text-align: right; padding-right: 20px;">'+
            '<span class="glyphicon glyphicon-info-sign"></span>&nbsp;<b>'+books[i].status+'</b></div>';
        bookHtml += '</div>';

        bookHtml += '<div class="row">';
        if(books[i].topics.length !== 0) {
            bookHtml += '<div class="col-sm-9"> <b>Topics:</b> '+books[i].topics.join(", ")+'</div>';
        } else {
            bookHtml += '<div class="col-sm-9"><b>Topics:</b> -- </div>';
        }
        bookHtml += '<div class="col-sm-3" style="text-align: right; padding-right: 20px;">'+
            '<span class="glyphicon glyphicon-shopping-cart"></span>&nbsp;<b>'+books[i].holdingType+'</b></div>';
        bookHtml += '</div>';

        bookHtml += '<div class="row">';
        if(books[i].description !== "") {
            bookHtml += '<div class="col-sm-10"> <b>Description:</b> '+books[i].description+'</div>';
        } else {
            bookHtml += '<div class="col-sm-10"><b>Description:</b> -- </div>';
        }
        bookHtml += '<div class="col-sm-2" style="text-align: right; padding-right: 20px;">'+
            '<span class="glyphicon glyphicon-map-marker"></span>&nbsp;<b>'+books[i].city+'</b></div>';
        bookHtml += '</div>';

        //bookHtml += "<div>Bla-bla-bla</div>";
        // closes line 122
        bookHtml += '</div>';

        if(i === 0) {
            $(lastElement).append(bookHtml);
        } else {
            $(lastElement).after(bookHtml);
        }
        lastElement = "#book"+books[i].bookId;
    }
}

