var Session = {};

var Url = "/cms/blog/featured/swap";

var append = function (post) {
    var elem =
        `<li class="list-group-item post-list-item ui-state-default" target="` + post._id + `">` + 
            `<h4>` + post.en.title + `</h4>` + 
            `<form action="/cms/blog/featured/` + post._id + `?_method=DELETE" method="POST">` +
                `<button class="btn cat-card-btn card-btn-sm card-btn-delete"><i class="glyphicon glyphicon-remove"></i></button>` +
            `</form>` +
        `</li>`;
    return elem;
};

function post(session, url) {

    $.ajax({
        type: "POST",
        url: url,
        data: { session: session },
        success: function (data) {
            console.log(data.message);
        },
        error: function () {
            location.reload();
        }
    });
}

function setSortable(){
    $("#sortable").sortable({
        revert: true,
        start: function (event, ui) {
            Session.startIndex = ui.item.index();
        },
        stop: function (event, ui) {
            Session.stopIndex = ui.item.index();
            if (Session.startIndex != Session.stopIndex) {
                post(Session, Url);
            }
        }
    });
}

function activateButtons () {
    $("ul, li").disableSelection();

    $(".post-list-item .card-btn-edit, .post-list-item .card-btn-delete").hide();

    $(".post-list-item").on("mouseover", function () {
        $(this).find(".card-btn-edit, .card-btn-delete").show();
    });

    $(".post-list-item").on("mouseout", function () {
        $(this).find(".card-btn-edit, .card-btn-delete").hide();
    });
}

$(document).ready(function () {

    setSortable();

    activateButtons();

    // --- SEARCH & ADD POST --- //
    var domain = window.location.href.split("/")[0] + "//" + window.location.href.split("/")[2];

    function populateFeaturedListDisplay(postID) {
            var url = domain + "/cms/blog/featured/search?id=" + postID;

            $.get(url, function (post) {
                if (typeof post !== "undefined") {
                    $(append(post)).appendTo($(" ul#sortable "));
                    setSortable();
                    activateButtons();
                }
            });
    };

    function clearSearchResults() {
        $("#SearchBox").val("");
        $(".result-list").empty();
        $(".search-result-box").hide();
    }

    function activateResultTagList() {
        $(".tag-item").on("click", function () {
            var postID = $(this).attr("target");
            var url = domain + "/cms/blog/featured/" + postID;

            $.ajax({
                type: "POST",
                url: url,
                data: null,
                success: function (data) {
                    console.log(data.message);
                    populateFeaturedListDisplay(postID);
                    clearSearchResults();
                },
                error: function () {
                    location.reload();
                }
            });
        });
    }

    function displayResultTagList(posts) {
        $(".result-list").empty();
        for (post of posts) {
            var txt = '<li class="tag-item" target="' + post._id + '">' + post.en.title + '</li>';
            $(".result-list").append(txt);
        }
        activateResultTagList();
        $(".search-result-box").show();
    }

    $("#SearchBox").on("keyup", function () {
        var query = $(this).val();
        if (query.length > 0) {
            var url = domain + "/cms/blog/featured/search?title=" + query;
            $.get(url, function (data) {
                if (data.length > 0) {
                    displayResultTagList(data);
                }
            });
        } else {
            clearSearchResults();
        }
    });

});