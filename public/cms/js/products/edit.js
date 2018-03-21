$(document).ready(function () {

    tinymce.init({
        selector: 'textarea',
        min_height: 200,
    });

    // Auto-match URL by Name 
    $("input.product-name").on("change", function () {
        var text = $(this).val();
        var lang = $(this).attr("lang");
        var url = $("input.product-url[lang='" + lang + "']");

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
                if (targetClass !== "product-name") tinymce.get(lang + "-" + targetClass).setContent(translated);
            });
        }
    });
});