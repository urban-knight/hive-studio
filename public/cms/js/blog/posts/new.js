// Set default value to DatePicker
Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

var append = function (tag) {
    var elem = 
        `<li class="list-group-item item" target="` + tag._id + `">` +
        `<a class="btn btn-primary-inversed item-remove">
            <i class="glyphicon glyphicon-remove"></i>
        </a>` +
        `<div class="item-text">` + tag.en.name + "</div>" +
    "</li>";
    return elem;
};

function appendCatURL(category){
    var langs = ["en", "ua", "ru"];

    for (lang of langs){
        var url = $(".input-group-addon[lang='" + lang + "']").find("strong").text();
        var urlArr = url.split("/");
        if (urlArr[urlArr.length - 2] != "blog"){
            urlArr[urlArr.length - 2] = category[lang].url;
            $(".input-group-addon[lang='" + lang + "']").find("strong").text(urlArr.join("/"));           
        } else {
            var text = $(".input-group-addon[lang='" + lang + "']").find("strong").text();
            $(".input-group-addon[lang='" + lang + "']").find("strong").text(text + category[lang].url);
        }
    }
}

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
                console.log("Project Picture ID: " + pictureIds[0]);
            }
        });
    });

    $('#pic-carousel').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3
    });

    $(".picture-carousel-card").on("click", function () {
        var id = $(this).attr("target");
        $(".selected-wrapper").hide();
        $(".pic-warn-label").hide();
        $(".pic-done-label").show();
        $(this).find(".selected-wrapper").show();
        $("input#picture").val(id);
        console.log("Project Picture ID: " + id);
    });

    $('#datePicker').val(new Date().toDateInputValue());

    $('.selectpicker').selectpicker({
        style: "btn-select",
        size: 10,
        width: "fit"
    });

    // Auto-match URL by Name 
    $("input.post-title").on("change", function () {
        var text = $(this).val();
        var lang = $(this).attr("lang");
        var url = $("input.post-url[lang='" + lang + "']");

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
                if (targetClass !== "post-title") tinymce.get(lang + "-" + targetClass).setContent(translated);
            });
        }
    });

    // Pass Category from query to Category Selector and URL
    $('.selectpicker[name="post[category]"]').selectpicker('val', activeCategory._id);

    // Append URL when Category selected
    $('.selectpicker[name="post[category]"]').on("change", function(){
        var category = categories.find((e)=>{
            return e._id == $(this).val();
        });
        appendCatURL(category);
    })


    // --- TAG MANAGEMENT --- //
    var domain = window.location.href.split("/")[0] + "//" + window.location.href.split("/")[2];

    function activateTagList() {
        $(".item-remove").on("click", function(){
            var tagID = $(this).parents(".item").attr("target");
            var tags = JSON.parse($("#post-tags").val());
            tags.splice(tags.indexOf(tagID), 1);
            $("#post-tags").val(JSON.stringify(tags));
            $(this).parents(".item").remove();
        });
    }

    function populateTagListDisplay() {
        $(" ul.item-list ").empty();
        var tags = JSON.parse($("#post-tags").val());

        for (tagID of tags) {
            var url = domain + "/cms/blog/tags/search?id=" + tagID;

            $.get(url, function (data) {
                if (typeof data !== "undefined") {
                    $(append(data)).appendTo($(" div.item-container ").find(" ul.item-list "));
                    activateTagList();
                }
            });
        };
    };

    function clearSearchResults() {
        $("#tagSearchBox").val("");
        $(".result-list").empty();
        $(".search-result-box").hide();
    }

    function activateResultTagList() {
        $(".tag-item").on("click", function () {
            var tagID = $(this).attr("target");
            var tags = JSON.parse($("#post-tags").val());
            tags.push(tagID);
            $("#post-tags").val(JSON.stringify(tags));
            populateTagListDisplay();
            clearSearchResults();
        });
    }

    function displayResultTagList(tags) {
        $(".result-list").empty();
        for (tag of tags) {
            var txt = '<li class="tag-item" target="' + tag._id + '">' + tag.en.name + '</li>';
            $(".result-list").append(txt);
        }
        activateResultTagList();
        $(".search-result-box").show();
    }

    $("#tagSearchBox").on("keyup", function (){
        var query = $(this).val();
        if (query.length > 0){
            var url = domain + "/cms/blog/tags/search?name=" + query;
            $.get(url, function (data) {
                if (data.length > 0) {
                    displayResultTagList(data);
                }
            });
        } else {
            clearSearchResults();
        }
    });

    $("#tagSearchBox").on("focusout", function () {
        //clearSearchResults();
    });
});