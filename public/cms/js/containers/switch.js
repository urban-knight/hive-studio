function post(id, url) {

    $.ajax({
        type: "POST",
        url: url,
        data: { id: id },
        success: function (data) {
            console.log(data.message);
        },
        error: function(){
            location.reload();
        }
    });
}

$(document).ready(function () {  

    $(".data-list-item").each(function(i){
        if (selected.includes($(this).attr("target"))){
            $(this).find("input[type='checkbox']").prop('checked', true);
        }
    });

    $(".item-switch").on("change", function(){
        post($(this).attr("target"), $(this).attr("url-target"))
    });

    $("ul, li").disableSelection();
});