$(document).ready(function(){
  
// scripts for slick carousel
  $('.variable-width').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true
  });
  
  $('.single-item').slick();

  $('.responsive').slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  // script for flipclock
  var today = new Date(),
      now = Date().now,
      birthday = new Date(2015, 3, 18);
  var clock = $('.clock').FlipClock(((birthday - today)/3600), {
    clockFace: 'DailyCounter',
    countdown: true
  });
  
});