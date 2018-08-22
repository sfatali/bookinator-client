var menuLinks;

$(document).ready(function() {
    //console.log(localStorage.getItem("mainLink"));
    //localStorage.removeItem("mainLink");

    if(localStorage.getItem("mainLink") === null) {
        makeWelcomeRequest();
    } else {
        makeHomeRequest();
    }
});

function makeWelcomeRequest() {
    //requesting Welcome resource
    $.ajax({
        url: 'http://localhost:8080/welcome',
        type: 'GET',
        dataType: 'json',
        success: function(data)
        {
            console.log(data);
            menuLinks = data._links;
            console.log(menuLinks);
            appendMenuLogin(menuLinks.login);
            appendMenuRegister(menuLinks.register);
            appendMenuExplore(menuLinks.explore);
            setContainerHeader(menuLinks.self);
        },
        error: function (data) {
            console.log("Sadness");
            console.log(data);
            $.notify(data.responseJSON.message, "error");
        }
    });
}

function makeHomeRequest() {
    var mainLink = JSON.parse(localStorage.getItem("mainLink"));

    //requesting Home resource
    $.ajax({
        url: mainLink.href,
        type: mainLink.method,
        dataType: 'json',
        beforeSend: function (xhr){
            if(mainLink.authRequired) {
                xhr.setRequestHeader('Authorization', localStorage.getItem("token"));
            }
        },
        success: function(data)
        {
            menuLinks = data._links;
            appendMenuExploreAuth(menuLinks.explore);
            appendMenuBooks(menuLinks.bookposts);
            appendMenuWishlist(menuLinks.wishlist);
            appendMenuBookRequests(menuLinks.bookrequests);
            appendMenuBookHoldigs(menuLinks.bookholdings);
            appendMenuUserProfile(menuLinks.userprofile);
            appendMenuLogout(menuLinks.logout);
            setContainerHeader(menuLinks.self);
        },
        error: function (data) {
            console.log("Sadness!!");
            console.log(data);
            makeWelcomeRequest();
        }
    });
}

function setContainerHeader(link) {
    console.log("in setHeader");
    $("#container-header").empty();
    $("#container-header").append('<h3 style="color: white; text-align:center; margin-top: 10px;">'+
        link.title+
        '</h3>'+
        '<h4 style="color: white; text-align:center;">'+
        link.description+
        '</h4>');
}

function appendMenuLogin(link) {
    $("#menu-top").append('<li><a id="loginLink"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#loginLink").click(function() {
        setContainerHeader(link);
        setLoginContent(link);
    });

    /*$("#loginLink").mousedown(function(ev){
        console.log("was here!!!!!");
        if(ev.which == 3)
        {
            console.log("Right mouse button clicked on element with id myId");
        }
    });*/
}

function appendMenuRegister(link) {
    $("#menu-top").append('<li><a id="registerLink"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#registerLink").click(function() {
        setContainerHeader(link);
        setRegisterContent(link)
    });
}

function appendMenuExplore(link) {
    $("#menu-top").append('<li><a id="exploreLink"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#exploreLink").click(function() {
        setContainerHeader(link);
        setExploreContent(link);
    });
}

function appendMenuExploreAuth(link) {
    $("#menu-top").append('<li><a id="exploreAuthLink"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#exploreAuthLink").click(function() {
        setContainerHeader(link);
        setExploreAuthContent(link);
    });
}

function appendMenuUserProfile(link) {
    $("#menu-top").append('<li><a id="userProfileLink"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#userProfileLink").click(function() {
        setContainerHeader(link);
    });
}

function appendMenuBooks(link) {
    $("#menu-top").append('<li><a id="booksLink"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#booksLink").click(function() {
        setContainerHeader(link);
        setBookPostsContent(link);
    });
}

function appendMenuWishlist(link) {
    $("#menu-top").append('<li><a id="wishlistLink"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#wishlistLink").click(function() {
        setContainerHeader(link);
        console.log(link);
        setWishlistContent(link);
    });
}

function appendMenuBookRequests(link) {
    $("#menu-top").append('<li><a id="bookRequestsLink"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#bookRequestsLink").click(function() {
        setContainerHeader(link);
    });
}

function appendMenuBookHoldigs(link) {
    $("#menu-top").append('<li><a id="bookHoldingsLinks"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#bookHoldingsLinks").click(function() {
        setContainerHeader(link);
    });
}

function appendMenuLogout(link) {
    $("#menu-top").append('<li><a id="logout"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#logout").click(function() {
        localStorage.removeItem("token");
        localStorage.removeItem("mainLink");
        window.location.reload();
    });
}

$("#bookModal").load("book_modal.html");


