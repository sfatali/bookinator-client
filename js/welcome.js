var welcomeLinks;

/*$(function(){
    // loading upper menu
    $(".menu-section").load("menu.html");
});*/

$(document).ready(function() {
    currentState = localStorage.getItem("currentState");

    // requesting Welcome resource
    $.ajax({
        url: 'http://localhost:8080/welcome',
        type: 'GET',
        success: function(data)
        {
            welcomeLinks = data._links;
            appendMenuLogin(welcomeLinks.login);
            appendMenuRegister(welcomeLinks.register);
            appendMenuExplore(welcomeLinks.explore);
            setContainerHeader(welcomeLinks.self);

            /*console.log("currentState: "+currentState);
            switch(currentState) {
                case _links.self.title:
                    setContainerHeader(_links.self);
                    break;
                case _links.login.title:
                    setContainerHeader(_links.login);
                    setLoginContent(link);
                    break;
                case _links.register.title:
                    setContainerHeader(_links.register);
                    break;
                case _links.explore.title:
                    setContainerHeader(_links.explore);
                    break;
                default:
                setContainerHeader(_links.self);
            }*/

        },
        error: function (data) {
            console.log("Sadness");
            console.log(data);
        }
    });
});

function appendMenuLogin(link) {
    $("#menu-top").append('<li><a id="loginLink"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#loginLink").click(function() {
        console.log("loginLink clicked");
        localStorage.setItem("currentState", link.title);
        setContainerHeader(link);
        setLoginContent(link);
    });
}

function appendMenuRegister(link) {
    $("#menu-top").append('<li><a id="registerLink"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#registerLink").click(function() {
        console.log("registerLink clicked");
        localStorage.setItem("currentState", link.title);
        setContainerHeader(link);
        setRegisterContent(link)
    });
}

function appendMenuExplore(link) {
    $("#menu-top").append('<li><a id="exploreLink"' +
        ' class="menu-top-active"' +
        ' href="#">'+link.title+'</a></li>');

    $("#exploreLink").click(function() {
        console.log("exploreLink clicked");
        localStorage.setItem("currentState", link.title);
        setContainerHeader(link);
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

/*$(window).unload(function(){
    localStorage.removeItem("currentState");
});*/
