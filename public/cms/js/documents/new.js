Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

$("document").ready(function(){

    $("#datepicker").datepicker().val(new Date().toDateInputValue());

    $('#fileButton').on("click", function () {
        $(".file-input").click();
    });

    $(".file-input").on("change", function () {
        $('#fileForm').ajaxSubmit({
            error: function (xhr) {
                console.log('Error: ' + xhr.status);
            },
            success: function (fileId) {
                $(".pic-warn-label").hide();
                $(".pic-done-label").show();
                $(".selected-wrapper").hide();
                $("input#fileID").val(fileId);
                console.log("Document file ID: "+ fileId);
            }
        });
    });
});