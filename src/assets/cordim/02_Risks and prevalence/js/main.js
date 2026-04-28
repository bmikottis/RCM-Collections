$(document).ready(function () {
	
	"use strict";

	var images = [
		'../images/bg.jpg'
	];

	var $list = $('#imagesList');

	$.each(images, function (i, src) {
		var $li = $('<li class="loading">').appendTo($list);
		$('<img>').appendTo($li).one('load', function () {
			$li.removeClass('loading');
		}).attr('src', src);
	});
	$('img').on('dragstart', function (event) { event.preventDefault(); });
	
	  $("#plus_icon").click(function(){
		$(".menubar").hide();
		$(".menubar2").css('display', 'flex');
		// $(".sidebar2").hide();
		// $(".sidebar2_dropdown2").css('display', 'block');
		// $(".cardio_cta").show();
	  });
	  $("#plus_icon2").click(function(){
		$(".menubar").hide();
		$(".menubar2").css('display', 'flex');
		// $(".arrow_icon").hide();
		// $(".arrow_icon2").show();
		// $(".sidebar2").hide();
		// $(".sidebar2_dropdown2").css('display', 'block');
		// $(".cardio_cta").show();
	  });
	$("#plus_icon3").click(function(){
		$(".menubar").hide();
		$(".menubar2").css('display', 'flex');
		// $(".sidebar2").hide();
		// $(".sidebar2_dropdown2").css('display', 'block');
		// $(".cardio_cta").show();
	  });
	$("#plus_icon4").click(function(){
		$(".menubar").hide();
		$(".menubar2").css('display', 'flex');
		// $(".sidebar2").hide();
		// $(".sidebar2_dropdown2").css('display', 'block');
		// $(".cardio_cta").show();
	  });
	  $("#arrow_icon").click(function(){
		$(".menubar2").hide();
		$(".menubar").css('display', 'flex');
		// $(".sidebar2_dropdown2").hide();
		// $(".sidebar2").css('display', 'block');
		// $(".cardio_cta").hide();
	  });
	$("#arrow_icon2").click(function(){
		$(".menubar2").hide();
		$(".menubar").css('display', 'flex');
		// $(".sidebar2_dropdown2").hide();
		// $(".sidebar2").css('display', 'block');
		// $(".cardio_cta").hide();
	  });
	$("#arrow_icon3").click(function(){
		$(".menubar2").hide();
		$(".menubar").css('display', 'flex');
		// $(".sidebar2_dropdown2").hide();
		// $(".sidebar2").css('display', 'block');
		// $(".cardio_cta").hide();
	  });
	$("#arrow_icon4").click(function(){
		$(".menubar2").hide();
		$(".menubar").css('display', 'flex');
		// $(".sidebar2_dropdown2").hide();
		// $(".sidebar2").css('display', 'block');
		// $(".cardio_cta").hide();
	  });
	  $(".sidebar2").click(function(){
		$(".sidebar2").hide();
		$(".sidebar2_dropdown1").css('display', 'block');
		$(".cardio_cta").show();
		$(".gp_cta").show();
		$(".country_selection_cta").hide();
		$(".country_selection_cta2").hide();
		$(".mexcio_eng_cta").show();
		$(".mexcio_sp_cta").show();
	  });
	$("#spanich").click(function(){
		$(".wrapper").hide();
		$(".wrapper4").show();
		$(".sidebar2_dropdown1").hide();
		$(".sidebar2").show();
		$(".country_selection_cta").show();
	  });
	$("#enlinsh").click(function(){
		$(".wrapper4").hide();
		$(".wrapper").show();
		$(".sidebar2_dropdown1").hide();
		$(".sidebar2").show();
		$(".country_selection_cta").show();
	  });
	  $(".gp_cta").click(function(){
		$(".left_tab2").hide();
		$(".left_tab1").show();
		$(".sidebar2_cardio").hide();
		$(".sidebar2").show();
		$(".sidebar2_dropdown1").hide();
		$(".sidebar2_dropdown2").hide();
		$(".menubar").css('display', 'flex');
		$(".menubar2").hide();
	  });
	  $(".cardio_cta").click(function(){
		$(".left_tab1").hide();
		$(".left_tab2").show();
		$(".sidebar2_cardio").show();
		$(".sidebar2").hide();
		$(".sidebar2_dropdown2").hide();
		$(".sidebar2_dropdown1").hide();
		$(".menubar").css('display', 'flex');
		$(".menubar2").hide();
	  });
	  $(".sidebar2_cardio").click(function(){
		$(".sidebar2_cardio").hide();
		$(".sidebar2_dropdown2").show();
		
	  });
	  $(".pi_cta").click(function(){
		$(".pi_active").fadeIn();
		
	  });
	  $(".close").click(function(){
		$(".pi_active").fadeOut();
		
	  });

	  //tab js
	  $(".btn2_cta").click(function(){
		$(".left_tab1").hide();
		$(".left_tab2").show();
		
	  });
	  $(".btn1_cta").click(function(){
		$(".left_tab2").hide();
		$(".left_tab1").show();
		
	  });

	  //bar animation 

	  setTimeout(function(){ 
        $('.bar1').delay(0).animate({'height':213});
    }, 1000); 
    
    setTimeout(function(){ 
        $('.bar2').delay(0).animate({'height':170});
    }, 1000); 

	setTimeout(function(){ 
        $('.bar3').delay(0).animate({'height':147});
    }, 1000); 

	setTimeout(function(){ 
        $('.bar4').delay(0).animate({'height':132});
    }, 1000); 

	setTimeout(function(){ 
        $('.bar5').delay(0).animate({'height':103});
    }, 1000); 

	$("#spanich_country").click(function(){
		$(".wrapper2").hide();
		$(".wrapper3").show();
		$(".sidebar2_dropdown1").hide();
		$(".sidebar2").show();
		$(".country_selection_cta2").show();
	  });
	$("#enlinsh_country").click(function(){
		$(".wrapper3").hide();
		$(".wrapper2").show();
		$(".sidebar2_dropdown1").hide();
		$(".sidebar2").show();
		$(".country_selection_cta2").show();
	  });

	  $(".country_selection_cta").click(function(){
		$(".sidebar2").hide();
		$(".country_dropdown_usa").show();
		$("#usa_flag_cta").show();
		$(".usa_cta").show();
		$(".mexcio_cta").show();
	  });
	  $(".mexcio_cta").click(function(){
		$(".wrapper").hide();
		$(".wrapper2").show();
		$(".sidebar2").show();
		$(".sidebar2_dropdown1").hide();
		$(".country_selection_cta2").show();
		$(".wrapper4").hide();
		
	  });

	  $("#usa_flag_cta").click(function(){
		$(".country_dropdown_usa").hide();
		$(".sidebar2").show();
		$(".usa_cta").hide();
		$(".mexcio_cta").hide();
		$("#usa_flag_cta").hide();
	  });
	  $("#usa_flag_cta2").click(function(){
		$(".country_dropdown_usa").hide();
		$(".sidebar2").show();
		$(".usa_cta").hide();
		$(".mexcio_cta").hide();
		$("#usa_flag_cta2").hide();
	  });
      $(".country_selection_cta_wrapper4").click(function(){
		$("#usa_flag_cta2").show();
	  });
	  $(".country_selection_cta2").click(function(){
		$(".sidebar2").hide();
		$(".country_dropdown_mexcio").show();
		$(".usa_cta2").show();
		$(".mexcio_cta2").show();
		 $(".country_dropdown_usa").hide();
		 $("#mexcio_flag_cta").show();
		 $("#mexcio_flag_cta2").show();
	  });
	  $("#mexcio_flag_cta").click(function(){
		$("#mexcio_flag_cta").hide();
		$(".country_dropdown_mexcio").hide();
		$(".sidebar2").show();
		$(".usa_cta2").hide();
		$(".mexcio_cta2").hide();
	  });
	  $(".mexcio_eng_cta").click(function(){
		$(".mexcio_eng_cta").hide();
		$(".sidebar2_dropdown1").hide();
		$(".sidebar2").show();
		$(".country_selection_cta2").show();

	  });
	  $(".mexcio_sp_cta").click(function(){
		$(".mexcio_sp_cta").hide();
		$(".sidebar2_dropdown1").hide();
		$(".sidebar2").show();
		$(".country_selection_cta2").show();

	  });
	  $(".usa_cta2").click(function(){
		$(".wrapper").show();
		$(".wrapper2").hide();
		$(".sidebar2").show();
        $(".country_dropdown_mexcio").hide();
		$(".wrapper3").hide();
		$(".usa_cta2").hide();
		$(".mexcio_cta2").hide();
		$(".usa_cta").hide();
		$(".mexcio_cta").hide();
		$(".country_selection_cta").show();
		
	  });
	  $("#mexcio_flag_cta2").click(function(){
		$("#mexcio_flag_cta2").hide();
		$(".country_dropdown_mexcio").hide();
		$(".sidebar2").show();
		$(".usa_cta2").hide();
		$(".mexcio_cta2").hide();
	  });
	$("#feedposi").click(function(){
		$("#feedposi").addClass("feedposi_cta");
	  });
	  $("#feednone").click(function(){
		$("#feednone").addClass("feednone_cta");
	  });
	  $("#feednega").click(function(){
		$("#feednega").addClass("feednega_cta");
	  });

	  $("#eng_cta").click(function(){
		$(".sidebar2_dropdown1").hide();
		$(".sidebar2").show();
		$(".country_selection_cta").show();
		
	  });
	  $("#sp_cta").click(function(){
		$(".sp_dropdown").hide();
		$(".sp_sidebar").show();
		$(".country_selection_cta").show();
		
	  });

});

// function menuOpenFunction() {
// 	var x = document.getElementById("menubar");
// 	if (x.style.display === "none") {
// 	  x.style.display = "block";
// 	} else {
// 	  x.style.display = "none";
// 	}
//   }