$(document).ready(function () {

    $('#fileButton').on("click", function () {
        $(".file-input").click();
    });

    $(".file-input").on("change", function () {
        $('#fileForm').ajaxSubmit({
            error: function (xhr) {
                console.log('Error: ' + xhr.status);
            },
            success: function (pictureId) {
                location.reload();
            }
        });
    });

    $('.delete-form').submit(function (e) {
        var form = $(this);
        $(this).ajaxSubmit({
            error: function (xhr) {
                form.parent('.picture-card')
                    .find('.error-label')
                    .empty().append('Error: ' + xhr.responseJSON.error);
                form.parent('.picture-card').find('.result-wrapper').removeClass("invisible")
            },
            success: function () {
                location.reload();
            }
        });
        e.preventDefault();
    });

});