var setLangCookie = function (lang) {

    var baseDomain;
    var langValue = lang.toString();
    var activeDomain = window.location.hostname;

    if (activeDomain !== 'localhost') {
        baseDomain = '.hive-studio.net';
    } else {
        baseDomain = 'localhost';
    }

    var expireAfter = new Date();
    expireAfter.setDate(expireAfter.getDate() + 30);

    document.cookie = "lang=" + langValue + "; domain=" + baseDomain + "; expires=" + expireAfter + "; path=/";

    if (activeDomain === "localhost"){
        location.reload();
    }
}

$(document).ready(function () {
    $(".lang-trigger").on("click", function () {
        var lang = $(this).attr("lang");
        setLangCookie(lang);
    })
});
