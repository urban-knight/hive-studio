var pageSession = {};
var catSession = {};

var pageUrl = "/cms/categories/swap-pages";
var catUrl = "/cms/categories/swap-categories";

function post(session, url) {

    $.ajax({
        type: "POST",
        url: url,
        data: { session: session },
        success: function (data) {
            console.log(data.message);
        },
        error: function(){
            location.reload();
        }
    });
}

$(document).ready(function () {

    $("#sortable").sortable({
        revert: 100,
        placeholder: "cat-placeholder",
        start: function (event, ui) {
            ui.placeholder.height(ui.item.height());
            catSession.catID = ui.item.attr("target");
            catSession.startIndex = ui.item.index();
        },
        stop: function (event, ui) {
            catSession.stopIndex = ui.item.index();
            post(catSession, catUrl);
        }
    });    

    for (i = 0; i < cat_length; i++) {
        $("#sortable" + i).sortable({
            revert: true,
            connectWith: ['.pages-sort-conn'],
            start: function (event, ui) {
                pageSession.startID = ui.item.parent("ul.pages-list").attr("target");
                pageSession.pageID = ui.item.attr("target");
                pageSession.startIndex = ui.item.index();
            },
            stop: function (event, ui) {
                pageSession.stopID = ui.item.parent("ul.pages-list").attr("target");
                pageSession.stopIndex = ui.item.index();
                post(pageSession, pageUrl);
            }
        });
    }

    $("ul, li").disableSelection();
});