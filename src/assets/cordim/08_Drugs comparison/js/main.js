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

	  $(".btn1").click(function(){
		$(".btn1").hide();
		$(".btn1_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn1.clicked = true;
		
	  });
	  $(".btn1_active").click(function(){
		$(".btn1_active").hide();
		$(".btn1").show();
		  
		btn1.clicked = false;

	  });

	  $(".btn2").click(function(){
		$(".btn2").hide();
		$(".btn2_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn2.clicked = true;
		
	  });
	  $(".btn2_active").click(function(){
		$(".btn2_active").hide();
		$(".btn2").show();
		  
		btn2.clicked = false;

	  });

	  $(".btn3").click(function(){
		$(".btn3").hide();
		$(".btn3_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn3.clicked = true;
		
	  });
	  $(".btn3_active").click(function(){
		$(".btn3_active").hide();
		$(".btn3").show();
		  
		btn3.clicked = false;

	  });

	  $(".btn4").click(function(){
		$(".btn4").hide();
		$(".btn4_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn4.clicked = true;
		
	  });
	  $(".btn4_active").click(function(){
		$(".btn4_active").hide();
		$(".btn4").show();
		  
		btn4.clicked = false;

	  });
	  $(".btn5").click(function(){
		$(".btn5").hide();
		$(".btn5_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn5.clicked = true;
		
	  });
	  $(".btn5_active").click(function(){
		$(".btn5_active").hide();
		$(".btn5").show();
		  
		btn5.clicked = false;

	  });
	  $(".btn6").click(function(){
		$(".btn6").hide();
		$(".btn6_active").show();
		$(".submit_btn").css('opacity', '1');
		$(".submit_btn").css('pointer-events', 'auto');
		  
		btn6.clicked = true;
		
	  });
	  $(".btn6_active").click(function(){
		$(".btn6_active").hide();
		$(".btn6").show();
		  
		btn6.clicked = false;

	  });

	  $(".submit_btn").click(function(){
		$(".submit_btn").hide();
		$(".submit_btn_active").show();
        $(".left_tab1").hide();
		$(".left_tab2").show();

		setTimeout(function(){ 
		if(document.getElementById('btn1').clicked == true)
		{
			$('.bar0').delay(0).animate({'height':241});
			$(".fugures0,.cta1").show();
			$(".cta1_active").hide();
		}else{
			$('.bar0').delay(0).animate({'height':0});
			$(".cta1_active").show();
			$(".fugures0,.cta1").hide();
		}}, 1000); 
		  
		setTimeout(function(){ 
		if(document.getElementById('btn2').clicked == true)
		{
			$('.bar1').delay(0).animate({'height':170});
			$(".fugures1,.cta2").show();
			$(".cta2_active").hide();
		}else{
			$('.bar1').delay(0).animate({'height':0});
			$(".cta2_active").show();
			$(".fugures1,.cta2").hide();
		}}, 1000); 
		
		setTimeout(function(){  
		if(document.getElementById('btn5').clicked == true)
		{
			$('.bar2').delay(0).animate({'height':94});
			$(".fugures2,.cta3").show();
			$(".cta3_active").hide();
		}else{
			$('.bar2').delay(0).animate({'height':0});
			$(".cta3_active").show();
			$(".fugures2,.cta3").hide();
		}}, 1000); 
	
	   setTimeout(function(){ 
	   if(document.getElementById('btn3').clicked == true)
		{
			$('.bar3').delay(0).animate({'height':182});
			$(".fugures3,.cta4").show();
			$(".cta4_active").hide();
		}else{
			$('.bar3').delay(0).animate({'height':0});
			$(".cta4_active").show();
			$(".fugures3,.cta4").hide();
		}}, 1000); 
		  
		setTimeout(function(){ 
		if(document.getElementById('btn4').clicked == true)
		{
			$('.bar4').delay(0).animate({'height':148});
			$(".fugures4,.cta5").show();
			$(".cta5_active").hide();
		}else{
			$('.bar4').delay(0).animate({'height':0});
			$(".cta5_active").show();
			$(".fugures4,.cta5").hide();
		}}, 1000); 
	
		  
		setTimeout(function(){ 
		if(document.getElementById('btn6').clicked == true)
		{
			$('.bar5').delay(0).animate({'height':49});
			$(".fugures5,.cta6").show();
			$(".cta6_active").hide();
		}else{
			$('.bar5').delay(0).animate({'height':0});
			$(".cta6_active").show();
			$(".fugures5,.cta6").hide();
		}}, 1000); 

	  //bar animation 
  });

  

$(".cta1").click(function(){
	$(".bar0").hide();
	$('.bar0').delay(0).animate({'height':0});
	$(".fugures0").hide();
	$(".info1").hide();
	$(".cta1").hide();
	$(".cta1_active").show();
	
  });
  $(".cta1_active").click(function(){
	$(".cta1_active").hide();
	$('.bar0').delay(0).animate({'height':241});
	$(".bar0").show();
	$(".fugures0").show();
	$(".info1").show();
	$(".cta1").show();
	
  });
  $(".cta2").click(function(){
	$(".bar1").hide();
	$('.bar1').delay(0).animate({'height':0});
	$(".fugures1").hide();
	$(".info2").hide();
	$(".cta2").hide();
	$(".cta2_active").show();
	
  });
  $(".cta2_active").click(function(){
	$(".cta2_active").hide();
	$('.bar1').delay(0).animate({'height':170});
	$(".bar1").show();
	$(".fugures1").show();
	$(".info2").show();
	$(".cta2").show();
	
  });
  $(".cta3").click(function(){
	$(".bar2").hide();
	$('.bar2').delay(0).animate({'height':0});
	$(".fugures2").hide();
	$(".info3").hide();
	$(".cta3").hide();
	$(".cta3_active").show();
	
  });
  $(".cta3_active").click(function(){
	$(".cta3_active").hide();
	$('.bar2').delay(0).animate({'height':94});
	$(".bar2").show();
	$(".fugures2").show();
	$(".info3").show();
	$(".cta3").show();
	
  });
  $(".cta4").click(function(){
	$(".bar3").hide();
	$('.bar3').delay(0).animate({'height':0});
	$(".fugures3").hide();
	$(".info4").hide();
	$(".cta4").hide();
	$(".cta4_active").show();
	
  });
  $(".cta4_active").click(function(){
	$(".cta4_active").hide();
	$('.bar3').delay(0).animate({'height':182});
	$(".bar3").show();
	$(".fugures3").show();
	$(".info4").show();
	$(".cta4").show();
	
  });
  $(".cta5").click(function(){
	$(".bar4").hide();
	$('.bar4').delay(0).animate({'height':0});
	$(".fugures4").hide();
	$(".info5").hide();
	$(".cta5").hide();
	$(".cta5_active").show();
	
  });
  $(".cta5_active").click(function(){
	$(".cta5_active").hide();
	$('.bar4').delay(0).animate({'height':148});
	$(".bar4").show();
	$(".fugures4").show();
	$(".info5").show();
	$(".cta5").show();
	
  });
  $(".cta6").click(function(){
	$(".bar5").hide();
	$('.bar5').delay(0).animate({'height':0});
	$(".fugures5").hide();
	$(".info6").hide();
	$(".cta6").hide();
	$(".cta6_active").show();
	
  });
  $(".cta6_active").click(function(){
	$(".cta6_active").hide();
	$('.bar5').delay(0).animate({'height':49});
	$(".bar5").show();
	$(".fugures5").show();
	$(".info6").show();
	$(".cta6").show();
	
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

});

// function menuOpenFunction() {
// 	var x = document.getElementById("menubar");
// 	if (x.style.display === "none") {
// 	  x.style.display = "block";
// 	} else {
// 	  x.style.display = "none";
// 	}
//   }