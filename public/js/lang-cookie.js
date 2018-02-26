var setLangCookie = function (lang){

    var langValue=lang.toString(),
    baseDomain = '.hive-studio.net',
    expireAfter = new Date();
    expireAfter.setDate(expireAfter.getDate() + 30);
    
    document.cookie="lang=" + langValue + "; domain=" + baseDomain + "; expires=" + expireAfter + "; path=/";
}

$(document).ready(function(){
    $(".lang-trigger").on("click", function(){
        var lang = $(this).attr("lang");
        setLangCookie(lang);
    })
});
