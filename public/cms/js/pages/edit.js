var append = function (value) {
    var elem =
        `<li class="list-group-item item" value="` + value + `">` +
        `<button class="btn btn-primary-inversed item-remove">
            <i class="glyphicon glyphicon-remove"></i>
        </button>` +
        `<div class="item-text">` + value + "</div>" +
        `<input type="text" value="` + value + `" class="item-edit form-control hidden">` +
        "</li>";
    return elem;
};

function activateRemoveBtn() {
    $("button.item-remove").on("click", function () {
        var item = $(this).parents(".item"),
            value = item.val(),
            target = $("input#" + item.parents(" .item-container ").find(".item-field").attr("name")),
            array = JSON.parse(target.val());

        array.splice(array.findIndex(i => i === value), 1);
        target.val(JSON.stringify(array));
        item.remove();
    });
}

function activateEditBtn() {
    $(" .item-text ").on("dblclick", function () {
        var item = $(this).parents(".item"),
            remove = item.find("button.item-remove"),
            text = $(this),
            input = item.find(" input ");

        text.toggleClass("hidden");
        remove.toggleClass("hidden");
        input.toggleClass("hidden").focus();
    });

    $(" .item-edit ").on("focusout", function () {
        var item = $(this).parents(".item"),
            text = item.find(".item-text"),
            remove = item.find("button.item-remove"),
            input = $(this),
            target = $("input#" + item.parents(" .item-container ").find(".item-field").attr("name")),
            array = JSON.parse(target.val());
        var item_value = text.text();
        var index = array.findIndex(i => i == item_value);

        array[index] = input.val();
        text.text(input.val());
        item.val(input.val());
        target.val(JSON.stringify(array));
        text.toggleClass("hidden");
        input.toggleClass("hidden");
        remove.toggleClass("hidden");
    });
}

function populateDisplay(key) {
    var array = JSON.parse($("#" + key).val());

    for (i = 0; i < array.length; i++) {
        $(append(array[i])).appendTo($(" input[name='" + key + "'] ").parents(" div.item-container ").find(" ul.item-list "));
    };
};

$(document).ready(function () {

    activateRemoveBtn();
    activateEditBtn();

    // Auto-match URL by Name 
    $("input.page-name").on("change", function () {
        var text = $(this).val();
        var lang = $(this).attr("lang");
        var url = $("input.page-url[lang='" + lang + "']");

        if (text.length > 0) {
            text = text.replace("&", "and");
            text = text.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
            url.val(text);
        }
    });

    tinymce.init({
        selector: 'textarea',
        min_height: 200,
        autoresize_max_height: 800,
        autoresize_min_height: 200,
        autoresize_bottom_margin: 10,
        plugins: 'autoresize textcolor colorpicker lists advlist code codesample image autolink link fullscreen hr media paste preview toc visualblocks wordcount',
        toolbar: "undo redo styleselect forecolor backcolor bold italic alignleft aligncenter alignright bullist numlist outdent indent hr code codesample link image media toc visualblocks",
        link_context_toolbar: true,
        image_title: true,
        automatic_uploads: true,
        images_upload_url: '/cms/pictures/tiny',
        file_picker_types: 'image',

        file_picker_callback: function (cb, value, meta) {
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.onchange = function () {
                var file = this.files[0];
                var reader = new FileReader();
                reader.onload = function () {
                    var id = 'blobid' + (new Date()).getTime();
                    var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                    var base64 = reader.result.split(',')[1];
                    var blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);
                    cb(blobInfo.blobUri(), { title: file.name });
                };
                reader.readAsDataURL(file);
            };
            input.click();
        }
    });

    // Translate with Google
    var langs = ["en", "ru", "uk"];
    translate.engine = 'google';
    translate.key = "AIzaSyCwf0U4wGdXLFujJlFxVAx2YmWnP5cY_hY";

    $(".btn-lang").on("click", function () {
        tinyMCE.triggerSave();

        var targetClass = $(this).attr("target");
        var _lang = $(this).attr("lang");
        var _orig = $("." + targetClass + "[lang='" + _lang + "']").val();

        var target_langs = langs;
        target_langs.splice(target_langs.indexOf(_lang), 1);

        if (_orig.length > 0) {
            target_langs.forEach(async function (lang) {
                const translated = await translate(_orig, { to: lang });
                var target = $("." + targetClass + "[lang='" + lang + "']");
                target.val(translated);
                if (targetClass !== "page-name") tinymce.get(lang + "-" + targetClass).setContent(translated);
            });
        }
    });

    $(".item-add").on("click", function () {
        $(this).add($(this).parents(".item-container").find(".item-form")).toggleClass("hidden").focus();
    });

    $(".item-cancel").on("click", function () {

        $(this).parents(".item-container").find(".item-field").val("");
        $(this).parents(".item-container").find(".item-form, .item-add").toggleClass("hidden");
    });

    $(".item-save").on("click", function () {
        var container = $(this).parents(".item-container"),
            value = container.find(".item-field").val(),
            target = $("input#" + container.find(".item-field").attr("name")),
            array = JSON.parse(target.val());

        array.push(value);
        target.val(JSON.stringify(array));

        $(append(value)).appendTo(container.find("ul.item-list"));
        container.find(".item-field").val("");
        $(this).parents(".item-container").find(".item-form, .item-add").toggleClass("hidden");
        activateRemoveBtn();
        activateEditBtn();
    });

    // Populate Data-array displays
    var keys = ['keywords-en', 'keywords-uk', 'keywords-ru'];
    keys.forEach(function (key) { populateDisplay(key) }, this);
    activateRemoveBtn();
    activateEditBtn();
});
