var bookPostsSelfLink;
var bookPosts;
var selectedOptionsMap = {};

function setBookPostsContent(link) {
    bookPostsSelfLink = link;

    $.ajax({
        url: bookPostsSelfLink.href,
        type: bookPostsSelfLink.method,
        dataType: 'json',
        beforeSend: function (xhr){
            if(bookPostsSelfLink.authRequired) {
                xhr.setRequestHeader('Authorization', localStorage.getItem("token"));
            }
        },
        success: function(data) {
            console.log("Success!!!");
            console.log(data);
            bookPosts = data;
            $("#container-content").remove();
            //appendBookForm();
            $("#container-header").append('<button id ="postBook" type="button"' +
                'style="border-radius: 0; padding-left: 20px; padding-right: 20px;"' +
                ' class="btn btn-success" onclick="postBook()" data-toggle="modal" data-target="#bookModal">'
                +bookPosts._links['postbook'].title+'</button>');
            appendBooks();
        },
        error: function (data) {
            console.log("Sadness!!");
            console.log(data);
            $.notify(data.responseJSON.message, "error");
        }
    });
}

function appendBooks() {

    var lastElement = "#postBook";
    var books = bookPosts._embedded.books;

    for(var i=0; i<books.length; i++) {

        var bookHtml = '<div id="book'+books[i].bookId+'" style="background-color: rgba(255, 255, 255, 0.95);' +
            ' margin: auto; height: auto; margin-top: 20px; width: 600px; padding: 8px; ' +
            'padding-left: 18px; padding-bottom: 18px">';

        bookHtml += '<div class="row">';
        if(books[i].yearPublished !== "") {
            bookHtml += '<div class="col-sm-12"><h4><small><b>'+books[i].yearPublished+'</b></small> &nbsp;' +
                '<b class="text-primary">'+books[i].name+'</b></h4></div>';
        } else {
            bookHtml += '<div class="col-sm-12 text-primary"><h4><b>'+books[i].name+'</b></h4></div>';
        }
        bookHtml += '</div>';

        bookHtml += '<div class="row">';
        if(books[i].authors.length !== 0) {
            bookHtml += '<div class="col-sm-8">By '+books[i].authors.join(", ")+'</div>';
        } else {
            bookHtml += '<div class="col-sm-8">By -- </div>';
        }
        bookHtml += '<div class="col-sm-4" style="text-align: right; padding-right: 20px;">'+
            '<span class="glyphicon glyphicon-info-sign"></span>&nbsp;<b>'+books[i].status+'</b></div>';
        bookHtml += '</div>';

        bookHtml += '<div class="row">';
        if(books[i].field !== "") {
            bookHtml += '<div class="col-sm-8"> <b>Field:</b> '+books[i].field+'</div>';
        } else {
            bookHtml += '<div class="col-sm-8"> <b>Field:</b> -- </div>';
        }
        bookHtml += '<div class="col-sm-4" style="text-align: right; padding-right: 20px;">'+
            '<span class="glyphicon glyphicon-shopping-cart"></span>&nbsp;<b>'+books[i].holdingType+'</b></div>';
        bookHtml += '</div>';

        bookHtml += '<div class="row">';
        if(books[i].topics.length !== 0) {
            bookHtml += '<div class="col-sm-12"> <b>Topics:</b> '+books[i].topics.join(", ")+'</div>';
        } else {
            bookHtml += '<div class="col-sm-12"><b>Topics:</b> -- </div>';
        }
        bookHtml += '</div>';

        bookHtml += '<div class="row" style="padding-bottom: 10px;">';
        if(books[i].description !== "") {
            bookHtml += '<div class="col-sm-12"> <b>Description:</b> '+books[i].description+'</div>';
        } else {
            bookHtml += '<div class="col-sm-12"><b>Description:</b> -- </div>';
        }
        bookHtml += '</div>';

        var bookLinks = books[i]._links;
        bookHtml += '<div class="row">';
        if(bookLinks['editbook'] !== undefined) {

            var onclickText = 'onclick=editBook('+books[i].bookId+') ';
            console.log(onclickText);

            bookHtml += '<div  class="col-sm-2">' +
                '<button id ="editButton'+books[i].bookId+'" type="button" ' +
                //onclickText +
                'style="border-radius: 0;"' +
                ' class="btn btn-info" data-toggle="collapse" data-target="#editForm'+books[i].bookId+'"">'
                +bookLinks['editbook'].title+'</button>' +
                '</div>';
        }

        if(bookLinks['deletebook'] !== undefined) {
            bookHtml += '<div class="col-sm-2">' +
                '<button id ="deleteButton'+books[i].bookId+'" type="button"' +
                'onclick="deleteBook('+books[i]+')" style="border-radius: 0; "' +
                ' class="btn btn-danger">'+bookLinks['deletebook'].title+'</button>' +
                '</div>';
        }
        bookHtml += '<div class="col-sm-8"></div></div>';

        // edit form
        bookHtml += '<div id="editForm'+books[i].bookId+'" class="row collapse" style="padding: 20px;"><form>';
        console.log('was herrrre');
        console.log(bookPosts._links['postbook'].requestTemplate);
        for (var k=0; k<bookPosts._links['postbook'].requestTemplate.length; k++) {
            console.log(bookPosts._links['postbook'].requestTemplate[k]);
            var reqItem = bookPosts._links['postbook'].requestTemplate[k];
            if(k%2 === 0) {
                bookHtml += '<row>';
            }

            bookHtml += '<div class="col-sm-6 form-group ">' +
                '<label for="'+reqItem.field+'">'+reqItem.title+':</label>';
            if(reqItem.type === "list") {
                var options = [];
                console.log("list");
                //console.log(reqItem);
                $.ajax({
                    url: reqItem.listSource.href,
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        options = data;
                        console.log("options! for "+reqItem.field);
                        //console.log(options);
                    }
                });

                bookHtml += '<select onchange="showOptions(this)" class="form-control" id="'+reqItem.field+'">';
                //bookHtml += //'<option></option>';
                console.log("field value! "+reqItem.field);
                console.log("field substring! "+reqItem.field.substring(0, reqItem.field.indexOf("Id")));
                console.log(books[i][reqItem.field.substring(0, reqItem.field.indexOf("Id"))]);
                var listValue = books[i][reqItem.field.substring(0, reqItem.field.indexOf("Id"))];
                selectedOptionsMap[reqItem.field] = "";
                if(listValue === null
                    || listValue === undefined
                    || listValue === "") {
                    // just list all options
                    bookHtml += '<option id="-1"></option>';
                    for(var m=0; m<options.length; m++) {
                        bookHtml += '<option id="'+options[m].id+'">'+options[m].name+'</option>';
                    }
                } else {
                    console.log("trying to find the match!");
                    for(var n=0; n<options.length; n++) {
                        if(listValue === options[n].name) {
                            console.log("found!!");
                            selectedOptionsMap[reqItem.field] = options[n].id;
                            bookHtml += '<option id="'+options[n].id+'" selected="selected">'+options[n].name+'</option>';
                        } else {
                            bookHtml += '<option id="'+options[n].id+'">'+options[n].name+'</option>';
                        }
                    }
                }

                bookHtml +='</select>';
            } else {
                if(books[i][reqItem.field] === null
                    || books[i][reqItem.field] === undefined
                    || books[i][reqItem.field] === "") {
                    bookHtml += '<input type="text" class="form-control" id="'+reqItem.field+'" aria-describedby="'+reqItem.field+'Help"'+
                        ' placeholder="Enter '+reqItem.title.toLowerCase()+'">';
                } else {
                    bookHtml += '<input type="text" class="form-control" id="'+reqItem.field+'" aria-describedby="'+reqItem.field+'Help"'+
                        ' value="'+books[i][reqItem.field]+'">';
                }
            }

            // closing form group
            bookHtml +='</div>';

            if(k%2 !== 0 || k === bookPosts._links['postbook'].requestTemplate.length-1) {
                bookHtml += '</row>';
            }
        }
        bookHtml +='</form>';

        var buttonHtml = '<div class="row">' +
            '<button id="updateBook'+books[i].bookId+'" type="button" onclick="updateBook('+books[i].bookId+')" style="margin-left: 17px; border-radius: 0;" class="btn btn-success">' +
            'Save</button></div>';
        bookHtml += buttonHtml;

        // closes form
        bookHtml += '</div>';

        // closes line 122
        bookHtml += '</div>';

        $(lastElement).after(bookHtml);
        lastElement = "#book"+books[i].bookId;
    }

}

function showOptions(s) {
    console.log(s.id);
    console.log(s[s.selectedIndex].value); // get value
    console.log(s[s.selectedIndex].id); // get id
    selectedOptionsMap[s.id] = s[s.selectedIndex].id;
}

function updateBook(bookId) {
    console.log("update!!!");
    //console.log(bookPosts);
    var request = {};

    var book;
    for(var i=0; i<bookPosts._embedded.books.length; i++) {
        if(bookId === bookPosts._embedded.books[i].bookId) {
            book = bookPosts._embedded.books[i];
            console.log("found the book");
            break;
        }
    }
    console.log(book);

    var requestTemplate = book._links['editbook'].requestTemplate;
    for(var j=0; j<requestTemplate.length; j++) {
        console.log(requestTemplate[j].field);
        var value = $('#'+requestTemplate[j].field).val();
        console.log(value);
        //var oldValue =
        if(requestTemplate[j].type === "list") {
            console.log("list, id is needed");
            value = selectedOptionsMap[requestTemplate[j].field];
            console.log(value);

        }
        request[requestTemplate[j].field] = value;
    }
    console.log("finally, request");
    console.log(JSON.stringify(request));

    console.log("url");
    console.log(book._links['editbook'].href);
    console.log("method");
    console.log(book._links['editbook'].method);

    $.ajax({
        url: book._links['editbook'].href,
        type: book._links['editbook'].method,
        contentType: 'application/json',
        data: JSON.stringify(request),
        dataType: 'json',
        beforeSend: function (xhr){
            console.log(localStorage.getItem("token"));
            xhr.setRequestHeader('Authorization', localStorage.getItem("token"));
        },
        success: function(data) {
            console.log(data);
            $.notify("Changes saved!", "success");
        },
        error: function (data) {
            console.log("Sadness");
            console.log(data);
            $.notify(data.responseJSON.message, "error");
        }
    });

}

/*function editBook(bookId) {
    console.log("wass here");
    console.log(bookId);

    var book;
    for(var i=0; i<bookPosts._embedded.books.length; i++) {
        if(bookId === bookPosts._embedded.books[i].bookId) {
            book = bookPosts._embedded.books[i];
            console.log("found the book");
            break;
        }
    }


}*/

