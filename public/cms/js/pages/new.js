tinymce.init({
    selector: '#page-code',
    content_css: "/static/js/lib/bootstrap-3.3.7-dist/css/bootstrap.min.css, /static/js/lib/fstyle/style.css",
});

$(document).ready(function () {

    $('#fileButton').on("click", function () {
        $(".file-input").click();
    });

    $(".file-input").on("change", function () {
        $('#fileForm').ajaxSubmit({
            error: function (xhr) {
                console.log('Error: ' + xhr.status);
            },
            success: function (pictureIds) {
                $(".pic-warn-label").hide();
                $(".pic-done-label").show();
                $(".selected-wrapper").hide();
                $("input#picture").val(pictureIds[0]);
                console.log("Project Picture ID: "+ pictureIds[0]);
            }
        });
    });

    $('#pic-carousel').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3
    });

    $(".picture-carousel-card").on("click", function(){
        var id = $(this).attr("target");
        $(".selected-wrapper").hide();
        $(".pic-warn-label").hide();
        $(".pic-done-label").show();
        $(this).find(".selected-wrapper").show();
        $("input#picture").val(id);
        console.log("Project Picture ID: "+ id);
    });

    $("#category").change(function () {
      var str = "http://dmcc.com.ua/";
      $( "#category option:selected" ).each(function() {
        str += $( this ).attr("url") + "/";
      });
      $( "#url-addon strong" ).text( str );
    })
    .change();

    $("input#name").on("change", function () {
        var text = $(this).val();
        var url = $("input#url");

        if (text.length > 0) {
            text = text.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
            url.val(text);
        }
    });

});
