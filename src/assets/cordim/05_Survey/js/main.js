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
	
	
	  $(".value").hide();
	  $("#plus_icon").click(function(){
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
	  $(".sidebar2").click(function(){
		$(".sidebar2").hide();
		$(".sidebar2_dropdown1").css('display', 'block');
		$(".cardio_cta").show();
		$(".gp_cta").show();
		$(".usa_flag_droupdown_cta").show();
		btn1.clicked = false;
		btn2.clicked = false;
		btn3.clicked = false;  
		btn4.clicked = false;
		btn5.clicked = false;
		btn6.clicked = false;
		btn7.clicked = false;
		btn8.clicked = false;
	  });
	  $(".usa_flag_droupdown_cta").click(function(){
		$(".usa_flag_droupdown_cta").hide();
		$(".sidebar2_dropdown1").hide();
		$(".Page1_sidebar2").show();
	  });

	  $(".mexcio_flag_droupdown_cta").click(function(){
		$(".mexcio_flag_droupdown_cta").hide();
		$(".section2_dropdown1").hide();
		$(".Page2_sidebar2").show();
	  });
	//   $(".sidebar2_cardio").click(function(){
	// 	$(".sidebar2_cardio").hide();
	// 	$(".sidebar2_dropdown2").show();
		
	//   });
	  $(".pi_cta").click(function(){
		$(".pi_active").fadeIn();
		
	  });
	  $(".close").click(function(){
		$(".pi_active").fadeOut();
		
	  });


	  $("#btn1").click(function(){
		$(".btn1").hide();
		$(".btn1_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn1.clicked = true;
		
	  });
	  $("#btn1_active").click(function(){
		$(".btn1_active").hide();
		$(".btn1").show();
		  
		btn1.clicked = false;

	  });

	  $("#btn2").click(function(){
		$(".btn2").hide();
		$(".btn2_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn2.clicked = true;
		
	  });
	  $("#btn2_active").click(function(){
		$(".btn2_active").hide();
		$(".btn2").show();
		  
		btn2.clicked = false;

	  });

	  $("#btn3").click(function(){
		$(".btn3").hide();
		$(".btn3_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn3.clicked = true;
		
	  });
	  $("#btn3_active").click(function(){
		$(".btn3_active").hide();
		$(".btn3").show();
		  
		btn3.clicked = false;

	  });

	  $("#btn4").click(function(){
		$(".btn4").hide();
		$(".btn4_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn4.clicked = true;
		
	  });
	  $("#btn4_active").click(function(){
		$(".btn4_active").hide();
		$(".btn4").show();
		  
		btn4.clicked = false;

	  });
	
	
	 $("#btn5").click(function(){
		$(".btn1").hide();
		$(".btn1_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn5.clicked = true;
		
	  });
	  $("#btn5_active").click(function(){
		$(".btn1_active").hide();
		$(".btn1").show();
		  
		btn5.clicked = false;

	  });

	  $("#btn6").click(function(){
		$(".btn2").hide();
		$(".btn2_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn6.clicked = true;
		
	  });
	  $("#btn6_active").click(function(){
		$(".btn2_active").hide();
		$(".btn2").show();
		  
		btn6.clicked = false;

	  });

	  $("#btn7").click(function(){
		$(".btn3").hide();
		$(".btn3_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn7.clicked = true;
		
	  });
	  $("#btn7_active").click(function(){
		$(".btn3_active").hide();
		$(".btn3").show();
		  
		btn7.clicked = false;

	  });

	  $("#btn8").click(function(){
		$(".btn4").hide();
		$(".btn4_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn8.clicked = true;
		
	  });
	  $("#btn8_active").click(function(){
		$(".btn4_active").hide();
		$(".btn4").show();
		  
		btn8.clicked = false;

	  });
	

	  $(".submit_btn").click(function(){
		$(".submit_btn").hide();
		$(".submit_btn_active").show();
        $(".left_tab1").hide();
		$(".left_tab2").show();
		
		setTimeout(function(){
		if(document.getElementById('btn1').clicked == true)
		{
			$('#bar1').delay(0).animate({'height':308});
			$(".fugures1").show();
		}else{
			$('#bar1').delay(0).animate({'height':0});
			$(".fugures1").hide();
		}}, 1000);
	
		setTimeout(function(){
		if(document.getElementById('btn3').clicked == true)
		{
			$('#bar2').delay(0).animate({'height':170});
			$(".fugures2").show();
		}else{
			$('#bar2').delay(0).animate({'height':0});
			$(".fugures2").hide();
		}}, 1000);
	
		setTimeout(function(){
		if(document.getElementById('btn2').clicked == true)
		{
			$('#bar3').delay(0).animate({'height':80});
			$(".fugures3").show();
		}else{
			$('#bar3').delay(0).animate({'height':0});
			$(".fugures3").hide();
		}}, 1000);
	  
		setTimeout(function(){
		if(document.getElementById('btn4').clicked == true)
		{
			$('#bar4').delay(0).animate({'height':197});
			$(".fugures4").show();
		}else{
			$('#bar4').delay(0).animate({'height':0});
			$(".fugures4").hide();
		}}, 1000);

	  //bar animation 
  });

  $(".submit_btn2").click(function(){
	$(".submit_btn2").hide();
	$(".submit_btn_active").show();
	$(".left_tab1").hide();
	$(".left_tab2").show();

  //bar animation 
	  
	  
		if(document.getElementById('btn5').clicked == true)
		{
			$('#bar5').show();
			$('#bar5').delay(0).animate({'height':305});
			$(".slide2_fugures1").show();
		}else{
			$('#bar5').delay(0).animate({'height':0});
			$('#bar5').hide();
			$(".slide2_fugures1").hide();
		}
	
		
		if(document.getElementById('btn7').clicked == true)
		{
			$('#bar6').show();
			$('#bar6').delay(0).animate({'height':99});
			$(".slide2_fugures2").show();
		}else{
			$('#bar6').delay(0).animate({'height':0});
			$('#bar6').hide();
			$(".slide2_fugures2").hide();
		}
	
		
		if(document.getElementById('btn6').clicked == true)
		{
			$('#bar7').show();
			$('#bar7').delay(0).animate({'height':80});
			$(".slide2_fugures3").show();
		}else{
			$('#bar7').delay(0).animate({'height':0});
			$('#bar7').hide();
			$(".slide2_fugures3").hide();
		}
	  
		
		if(document.getElementById('btn8').clicked == true)
		{
			$('#bar8').show();
			$('#bar8').delay(0).animate({'height':29});
			$(".slide2_fugures4").show();
		}else{
			$('#bar8').delay(0).animate({'height':0});
			$('#bar8').hide();
			$(".slide2_fugures4").hide();
		}

});
// $(".refresh_btn_div").click(function(){
// 	$(".submit_btn2").show();
// 	$(".submit_btn_active").hide();
// 	$(".left_tab1").show();
// 	$(".left_tab2").hide();
// 	$(".btn1").show();
// 	$(".btn2").show();
// 	$(".btn3").show();
// 	$(".btn4").show();
// });	
$("#feedposi").click(function(){
	$("#feedposi").addClass("feedposi_cta");
  });
  $("#feednone").click(function(){
	$("#feednone").addClass("feednone_cta");
  });
  $("#feednega").click(function(){
	$("#feednega").addClass("feednega_cta");
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