var pageSession = {};
var catSession = {};
var activatorSession = {};

var pageUrl = "/cms/catalogue/swap-pages";
var catUrl = "/cms/catalogue/swap-categories";
var activateURL = "/cms/catalogue/activate-page";
var deactivateURL = "/cms/catalogue/deactivate-page";

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
            if (catSession.startIndex != catSession.stopIndex) {
                post(catSession, catUrl);
            }
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
                if (pageSession.startIndex != pageSession.stopIndex) {
                    post(pageSession, pageUrl);
                }
            }
        });
    }

    $("#sortable-inactive").sortable({
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
            if (pageSession.startIndex != pageSession.stopIndex) {
                post(pageSession, pageUrl);
            }
        }
    });

    $("ul, li").disableSelection();

    $(".page-list-item .card-btn-edit, .page-list-item .card-btn-delete").hide();

    $(".page-list-item").on("mouseover", function(){
        $(this).find(".card-btn-edit, .card-btn-delete").show();
    });
    $(".page-list-item").on("mouseout", function(){
        $(this).find(".card-btn-edit, .card-btn-delete").hide();
    });
});