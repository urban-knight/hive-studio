var ww = document.body.clientWidth;

$(document).ready(function () {
  //init scrips
  fullPageInit();
  typeItInit();
  navBarInit();
  checkLanguage();
});

// fullPage.js plugin options
function fullPageInit() {
  $('#fp-js').fullpage({
    sectionsColor: ['', '#fff', '#000'],
    sectionSelector: '.fp-js',
    anchors: ['home', 'about', 'sd'],
    navigation: true,
    css3: true,
    onLeave: function (index, nextIndex, direction) {
      //invertation colors (navbar, lang switcher)
      var navigation = $('#fp-nav ul li a span');
      var lang_switcher = $('.lang-switcher a');
      var logo = $('div.site-logo a img');

      if (nextIndex % 2 == 0) {
        navigation.css('background', '#333');
        lang_switcher.addClass('dark');
        $('.nav a ').addClass('dark');
        logo.attr('src', logo.data('dark'));
      } else {
        navigation.css('background', '#fff');
        lang_switcher.removeClass('dark');
        $('.nav a').removeClass('dark');
        logo.attr('src', logo.data('white'));
      }
    },
    afterLoad: function(anchorLink, index){
      $('.lang-switcher a.lang-trigger').each(function () {
        var url = $(this).attr('href').split('#')[0];
        $(this).attr('href', url + '#'+anchorLink);
      });
    }
  });
}
// language selector
function checkLanguage() {
  var full_url = window.location.host;
  var parts = full_url.split('.');
  var domain = parts[1];
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
$(function () {
  var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d'),
    color = 'rgba(255, 255, 255, .5)';
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  ctx.fillStyle = color;
  ctx.lineWidth = .1;
  ctx.strokeStyle = color;

  var mousePosition = {
    x: 10 * w / 100,
    y: 10 * h / 100
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
      num: 200,
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
});
// expanders
/*
$(function () {
  var animspeed = 500; // animation speed 
  var $blockquote = $(this).find('.bigtext');
  var maxheight = 160;
  $blockquote.css('height', maxheight + 'px');
  $('.expand').on('click', function (e) {
    $text = $(this).prev();
    $h = $(this).prev().find('.service-description').outerHeight(true) + $(this).prev().find('.service-price').outerHeight(true);
    $text.animate({ 'height': $h }, animspeed);
    $(this).next('.contract').removeClass('hide');
    $(this).addClass('hide');
  });
  $('.contract').on('click', function (e) {
    $text = $(this).prev().prev();
    $text.animate({ 'height': maxheight }, animspeed);
    $(this).prev('.expand').removeClass('hide');
    $(this).addClass('hide');
  });
});*/