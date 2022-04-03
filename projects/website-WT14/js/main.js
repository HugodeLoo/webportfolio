var isDark = false;

//code that makes the nav scrolling go smooth
$('header li a').click(function(e) {

    var targetHref = $(this).attr('href');
    
  $('html, body').animate({
      scrollTop: ($(targetHref).offset().top - 135)
  }, 1000);
  
  e.preventDefault();
});

//code that makes it so the whole workshop titlecard makes the info section change color on hover
$(".workshop").hover(function () {
        $(this).find( ".info" ).css( "background-color", "#FCE5BC" );
    }, function () {
        $(this).find( ".info" ).css( "background-color", "#FFF6E6" );
    }
);

//code that is sectioned as such it only gets activated on the right html document
if ( document.URL.includes("tutorials.html") ) {
    $( ".myAccordion" ).accordion();

}
