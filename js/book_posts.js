var bookPostsSelfLink;
var bookPosts;

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

}

function appendBooks() {

    var lastElement = "#postBook";
    var books = bookPosts._embedded.books;

    for(var i=0; i<books.length; i++) {

        var bookHtml = '<div id="book'+books[i].bookId+'" style="background-color: rgba(255, 255, 255, 0.95);' +
            ' margin: auto; height: auto; margin-top: 20px; width: 500px; padding: 8px; ' +
            'padding-left: 18px; padding-bottom: 18px">';

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
            bookHtml += '<div class="col-sm-12">By '+books[i].authors.join(", ")+'</div>';
        } else {
            bookHtml += '<div class="col-sm-12">By -- </div>';
        }
        bookHtml += '</div>';

        bookHtml += '<div class="row">';
        if(books[i].field !== "") {
            bookHtml += '<div class="col-sm-12"> <b>Field:</b> '+books[i].field+'</div>';
        } else {
            bookHtml += '<div class="col-sm-12"> <b>Field:</b> -- </div>';
        }
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

            var onclickText = 'onclick=editBook('+books[i].bookId+',\"'+
                bookLinks['editbook'].href+'\",\"' +
                bookLinks['editbook'].method+'\") ';
            //console.log(onclickText);

            bookHtml += '<div  class="col-sm-2">' +
                '<button id ="editButton'+books[i].bookId+'" type="button" ' +
                onclickText +
                'style="border-radius: 0;"' +
                ' class="btn btn-info">'+bookLinks['editbook'].title+'</button>' +
                '</div>';
        }

        if(bookLinks['deletebook'] !== undefined) {
            bookHtml += '<div class="col-sm-2">' +
                '<button id ="deleteButton'+books[i].bookId+'" type="button"' +
                'onclick="deleteBook('+books[i]+')" style="border-radius: 0;"' +
                ' class="btn btn-danger">'+bookLinks['deletebook'].title+'</button>' +
                '</div>';
        }
        bookHtml += '<div class="col-sm-8"></div></div>';

        // closes line 122
        bookHtml += '</div>';

        $(lastElement).after(bookHtml);
        lastElement = "#book"+books[i].bookId;
    }

}

