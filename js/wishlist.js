var wishlistLink;

function setWishlistContent(link) {
    wishlistLink = link;
    console.log(wishlistLink);

    $("#container-content").remove();

    $.ajax({
        url: wishlistLink.href,
        type: wishlistLink.method,
        dataType: 'json',
        beforeSend: function (xhr){
            if(wishlistLink.authRequired) {
                xhr.setRequestHeader('Authorization', localStorage.getItem("token"));
            }
        },
        success: function(data) {
            console.log("Success!!!");
            console.log(data);
            appendWishlist(data);
        },
        error: function (data) {
            console.log("Sadness!!");
            console.log(data);
            $.notify(data.responseJSON.message, "error");
        }
    });
}

function appendWishlist(data) {
    $("#container-header").append('<div id="container-content"></div>');
    var lastElement = "#container-content";
    var books = data._embedded.books;

    for(var i=0; i<books.length; i++) {

        var bookHtml = '<div id="book'+books[i].bookId+'" style="background-color: rgba(255, 255, 255, 0.95);' +
            ' margin: auto; height: auto; margin-top: 20px; width: 750px; padding: 8px; ' +
            'padding-left: 18px; padding-bottom: 18px">';

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

        bookHtml += '<div class="row" style="padding-bottom: 10px;">';
        if(books[i].description !== "") {
            bookHtml += '<div class="col-sm-10"> <b>Description:</b> '+books[i].description+'</div>';
        } else {
            bookHtml += '<div class="col-sm-10"><b>Description:</b> -- </div>';
        }
        bookHtml += '<div class="col-sm-2" style="text-align: right; padding-right: 20px;">'+
            '<span class="glyphicon glyphicon-map-marker"></span>&nbsp;<b>'+books[i].city+'</b></div>';
        bookHtml += '</div>';

        var bookLinks = books[i]._links;
        bookHtml += '<div class="row">';
        if(bookLinks['removefromwishlist'] !== undefined) {
            //var onclickText = 'addToWishlist('+JSON.stringify(books[i])+')';
            //var onclickText = 'onclick=addToWishlist('+JSON.stringify(books[i])+') ';
            var buttonId = "#wishButton"+books[i].bookId;
            var onclickText = 'onclick=removeFromWishlist('+books[i].bookId+',\"'+
                bookLinks['removefromwishlist'].href+'\",\"' +
                bookLinks['removefromwishlist'].method+'\") ';
            //console.log(onclickText);

            bookHtml += '<div  class="col-sm-2">' +
                '<button id ="wishButton'+books[i].bookId+'" type="button" ' +
                //'onclick="addToWishlist('+JSON.stringify(books[i])+')" ' +
                //'onclick="addToWishlist(\"'+"why!"+'\")" ' +
                //'onclick="addToWishlist(\"\"'+'why!'+')" ' +
                onclickText +
                'style="border-radius: 0;"' +
                ' class="btn btn-danger">'+bookLinks['removefromwishlist'].title+'</button>' +
                '</div>';
        }

        if(bookLinks['makerequest'] !== undefined) {
            bookHtml += '<div class="col-sm-2">' +
                '<button id ="reqButton'+books[i].bookId+'" type="button"' +
                'onclick="makeBookRequest('+books[i]+')" style="border-radius: 0;"' +
                ' class="btn btn-success">'+bookLinks['makerequest'].title+'</button>' +
                '</div>';
        }
        bookHtml += '</div>';

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

function removeFromWishlist(bookId, href, method) {
    console.log("was here!!!!!");
    console.log(bookId);
    console.log(href);
    console.log(method);

    $.ajax({
        url: href,
        type: method,
        contentType: 'application/json',
        dataType: "json",
        beforeSend: function (xhr){
            console.log(localStorage.getItem("token"));
            xhr.setRequestHeader('Authorization', localStorage.getItem("token"));
            //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        },
        success: function(data) {
            console.log(data);
            $.notify("Book was removed from your wishlist", "success");
        },
        error: function (data, status) {
            console.log("Sadness");
            console.log(data);
            if(data.responseJSON !== undefined) {
                $.notify(data.responseJSON.message, "error");
            } else {
                $.notify("Error "+data.status, "error");
            }

        }
    });
}