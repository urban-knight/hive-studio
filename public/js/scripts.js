var ww = document.body.clientWidth;

$(document).ready(function () {
  //init scrips
  fullPageInit();
  canvasBackgroundInit();
  typeItInit();
  navBarInit();
  checkLanguage();
});

// fullPage.js plugin options
function fullPageInit() {
  $('#fp-js').fullpage({
    sectionSelector: '.fp-js',
    anchors: ['home', 'about', 'services', '', '', '', '', ''],
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

// cookie parser by name
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

// language selector
function checkLanguage() {
  var full_url = window.location.host;
  if (full_url === 'localhost') {
    var domain = getCookie('lang');
  } else {
    var parts = full_url.split('.');
    var domain = parts[1];
  }

  switch (domain) {
    case 'ua':
      $('a.lang-trigger[lang=ua]').addClass('lang-selected');
      break;
    case 'ru':
      $('a.lang-trigger[lang=ru]').addClass('lang-selected');
      break;
    default:
      $('a.lang-trigger[lang=en]').addClass('lang-selected');
  }
}

// typeIt init (home section)
function typeItInit() {
  new TypeIt('.subtitle', {
    strings: 'in web we trust',
    speed: 100,
    cursor: false
  });
  new TypeIt('#title', {
    strings: ["WEB", "DESIGN", "MARKETING"],
    cursor: false,
    nextStringDelay: 3000,
    speed: 300,
    scrollOverflow: true,
    breakLines: false,
    loop: true
  });
}
// responsive navigation bar
function navBarInit() {
  $(".nav li a").each(function () {
    if ($(this).next().length > 0) {
      $(this).addClass("parent");
    };
  })
  $(".toggleMenu").click(function (e) {
    e.preventDefault();
    $(this).toggleClass("active");
    $(".nav").toggle();
  });
  $(".hamburger").click(function () {
    $(this).toggleClass("is-active");
  });
  adjustMenu();
}

$(window).bind('resize orientationchange', function () {
  ww = document.body.clientWidth;
  adjustMenu();
});

var adjustMenu = function () {
  if (ww <= 860) {
    $(".toggleMenu").css("display", "inline-block");
    if (!$(".toggleMenu").hasClass("active")) {
      $(".nav").hide();
    } else {
      $(".nav").show();
    }
    $(".nav li").unbind('mouseenter mouseleave');
    $(".nav li a.parent").unbind('click').bind('click', function (e) {
      e.preventDefault();
      $(this).parent("li").toggleClass("hover");
    });
  }
  else if (ww >= 768) {
    $(".toggleMenu").css("display", "none");
    $(".nav").show();
    $(".nav li").removeClass("hover");
    $(".nav li a").unbind('click');
    $(".nav li").unbind('mouseenter mouseleave').bind('mouseenter mouseleave', function () {
      $(this).toggleClass('hover');
    });
  }
}
// canvas animation (home section)
function canvasBackgroundInit() {
  var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    color = '#dee8e6';
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  ctx.fillStyle = color;
  ctx.lineWidth = .1;
  ctx.strokeStyle = color;
  var mousePosition = {
    x: w * 100,
    y: h * 100
  };
  /*
    var dots = {
      num: 100,
      distance: 250,
      d_radius: 300,
      velocity: -.9,
      array: []
    };*/
  if ($(window).width() < 700) {
    var dots = {
      num: 80,
      distance: 80,
      d_radius: 100,
      velocity: -.9,
      array: []
    };
  } else {
    var dots = {
      num: 100,
      distance: 100,
      d_radius: 200,
      velocity: -.9,
      array: []
    };
  }
  function Dot() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = dots.velocity + Math.random();
    this.vy = dots.velocity + Math.random();
    this.radius = Math.random() * 2;
  }
  Dot.prototype = {
    create: function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fill();
    },
    animate: function () {
      for (i = 0; i < dots.num; i++) {

        var dot = dots.array[i];

        if (dot.y < 0 || dot.y > h) {
          dot.vx = dot.vx;
          dot.vy = - dot.vy;
        }
        else if (dot.x < 0 || dot.x > w) {
          dot.vx = - dot.vx;
          dot.vy = dot.vy;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
    },
    line: function () {
      for (i = 0; i < dots.num; i++) {
        for (j = 0; j < dots.num; j++) {
          i_dot = dots.array[i];
          j_dot = dots.array[j];

          if ((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > - dots.distance && (i_dot.y - j_dot.y) > - dots.distance) {
            if ((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > - dots.d_radius && (i_dot.y - mousePosition.y) > - dots.d_radius) {
              ctx.beginPath();
              ctx.moveTo(i_dot.x, i_dot.y);
              ctx.bezierCurveTo(i_dot.x, (h / 2), (w / 2), i_dot.y, j_dot.x, j_dot.y);
              ctx.stroke();
              ctx.closePath();
            }
          }
        }
      }
    }
  };
  function createDots() {
    ctx.clearRect(0, 0, w, h);
    for (i = 0; i < dots.num; i++) {
      dots.array.push(new Dot());
      dot = dots.array[i];
      dot.create();
    }
    dot.line();
    dot.animate();
  }
  $('canvas').on('mousemove mouseleave', function (e) {
    if (e.type == 'mousemove') {
      mousePosition.x = e.pageX;
      mousePosition.y = e.pageY;
    }
    /*	if(e.type == 'mouseleave'){
        mousePosition.x = w /2;
        mousePosition.y = h /2;
      }*/
  });
  $('canvas').on('click', function () {
    dots.num += 3;
  });
  setInterval(createDots, 25);
  $(window).on('resize', function () {
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = color;
    ctx.lineWidth = .1;
    ctx.strokeStyle = color;
  });
}
