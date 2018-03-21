var selectedCategories = JSON.parse($("input#category").val());
var append = function(value){
    var elem = `<li class="list-group-item item" value="`+ value +`">`+
                    `<button class="btn btn-primary-inversed item-remove">
                        <i class="glyphicon glyphicon-remove"></i>
                    </button>` + 
                    `<div class="item-text">` + value + "</div>" +
                    `<input type="text" value="` + value + `" class="item-edit form-control hidden">` +
                "</li>";
    return elem;
};

$("input.check-category").on("change", function(){
    var category = $(this).val();

    if ($(this).is(":checked")){
        selectedCategories.push(category);
    } else {
        selectedCategories.splice(selectedCategories.findIndex(i => i === category), 1);
    }
    $("input#category").val(JSON.stringify(selectedCategories));
});

$(".item-add").on("click", function(){
    $(this).add($(this).parents(".item-container").find(".item-form")).toggleClass("hidden");
});

$(".item-cancel").on("click", function(){

    $(this).parents(".item-container").find(".item-field").val("");
    $(this).parents(".item-container").find(".item-form, .item-add").toggleClass("hidden");
});

$("input#optional-info").change(function(){
    if ($(this).is(':checked')) {
        $("div#optional-container").show();
    } else {
        $("div#optional-container").hide().find("input").val("");

    }
});

function activateRemoveBtn() {
    $("button.item-remove").on("click", function(){
        var item = $(this).parents( ".item" ),
            value     = item.val(),
            target    = $("input#" + item.parents(" .item-container ").find( ".item-field" ).attr("name")),
            array     = JSON.parse(target.val());

        array.splice(array.findIndex(i => i === value), 1);
        target.val(JSON.stringify(array));
        item.remove();
    });
}

function activateEditBtn() {
    $(" .item-text ").on("dblclick", function(){
        var item = $(this).parents(".item"),
            remove = item.find("button.item-remove"),
            text = $(this),
            input = item.find(" input ");
        
        text.toggleClass("hidden");
        remove.toggleClass("hidden");
        input.toggleClass("hidden");
    });

    $(" .item-edit ").on("focusout", function(){
        var item   = $(this).parents(".item"),
            text   = item.find(".item-text"),
            remove = item.find("button.item-remove"),
            input  = $(this),
            target = $("input#" + item.parents(" .item-container ").find( ".item-field" ).attr("name")),
            array  = JSON.parse(target.val());
            var item_value = text.text();
            console.log(item_value);
            var index  = array.findIndex(i => i == item_value);

        array[index] = input.val();
        text.text(input.val());
        item.val(input.val());
        target.val(JSON.stringify(array));
        console.log(JSON.stringify(array));
        text.toggleClass("hidden");
        input.toggleClass("hidden");
        remove.toggleClass("hidden");
    });
}

$(".item-save").on("click", function(){
    var container = $(this).parents( ".item-container" ),
        value     = container.find( ".item-field" ).val(),
        target    = $("input#"+container.find( ".item-field" ).attr("name")),
        array     = JSON.parse(target.val());

    array.push(value);
    target.val(JSON.stringify(array));

    $(append(value)).appendTo(container.find( "ul.item-list" ));
    container.find( ".item-field" ).val("");
    $(this).parents( ".item-container" ).find( ".item-form, .item-add" ).toggleClass("hidden");
    activateRemoveBtn();
    activateEditBtn();
});

$("document").ready(function(){
    activateRemoveBtn();
    activateEditBtn();

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

});
