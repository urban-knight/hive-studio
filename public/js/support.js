var ww = document.body.clientWidth;

$(document).ready(function () {
  //init scrips
  fullPageInit();
});

// fullPage.js plugin options
function fullPageInit() {
  $('#support-js').fullpage({
    sectionSelector: '.support-js',
    anchors: ['support', 'blog', 'contacts'],
    navigation: true,
    scrollOverflow: true,
    paddingTop: '75px',
    onLeave: function (index, nextIndex, direction) {

      //invertation colors (navbar, lang switcher)
      var navigation = $('#fp-nav ul li a span');
      var lang_switcher = $('.lang-switcher a');
      var logo = $('div.site-logo a img');

      if (nextIndex % 2 == 0) {
        navigation.css('background', '#191716');
        lang_switcher.addClass('dark');
        $('.nav a ').addClass('dark');
        logo.attr('src', logo.data('dark'));
      } else {
        navigation.css('background', '#fffff2');
        lang_switcher.removeClass('dark');
        $('.nav a').removeClass('dark');
        logo.attr('src', logo.data('white'));
      }
    },
    //dunamic languages-switcher links
    afterLoad: function (anchorLink, index) {
      var hostname = window.location.hostname;
      if (hostname !== 'localhost') {
        $('.lang-switcher a.lang-trigger[lang="en"]').attr('href', "https://www.hive-studio.net/" + '#' + anchorLink);
        $('.lang-switcher a.lang-trigger[lang="ua"]').attr('href', "https://www.ua.hive-studio.net/" + '#' + anchorLink);
        $('.lang-switcher a.lang-trigger[lang="ru"]').attr('href', "https://www.ru.hive-studio.net/" + '#' + anchorLink);
      } else {
        $('.lang-switcher a.lang-trigger').each(function () {
          var url = "http://localhost" + '#' + anchorLink;
          $(this).attr('href', url);
        });
      }
    }
  });
}
