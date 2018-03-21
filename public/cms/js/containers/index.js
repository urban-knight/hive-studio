var Session = {};

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

    for (i = 0; i < 4; i++) {

        $("#sortable" + i).sortable({
            revert: true,
            start: function (event, ui) {
                Session.startID = ui.item.parent("ul.pages-list").attr("target");
                Session.ID = ui.item.attr("target");
                Session.startIndex = ui.item.index();
            },
            stop: function (event, ui) {
                Session.stopID = ui.item.parent("ul.pages-list").attr("target");
                Session.stopIndex = ui.item.index();
                if (Session.startIndex != Session.stopIndex) {
                    post(Session, $(this).attr("target-url"));
                }
            }
        });
    }

    $("ul, li").disableSelection();
});