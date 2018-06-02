$(document).ready(function () {

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
        forced_root_block: "",

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

    // Auto-match URL by Name 
    $("input.service-name").on("change", function () {
        var text = $(this).val();
        var lang = $(this).attr("lang");
        var url = $("input.service-url[lang='" + lang + "']");

        if (text.length > 0) {
            text = text.replace("&", "and");
            text = text.replace(/[^A-Z0-9]+/ig, "-").toLowerCase();
            url.val(text);
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
                if (targetClass !== "service-name") tinymce.get(lang + "-" + targetClass).setContent(translated);
            });
        }
    });
});