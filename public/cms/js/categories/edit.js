$(document).ready(function () {

    $("input#name").on("change", function () {
        var text = $(this).val();
        var url = $("input#url");

        if (text.length > 0) {
            text = text.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
            url.val(text);
        }
    });

});