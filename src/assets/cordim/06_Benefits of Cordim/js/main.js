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
	  $(".pi_cta").click(function(){
		$(".pi_active").fadeIn();
		
	  });
	  $(".close").click(function(){
		$(".pi_active").fadeOut();
		
	  });
	  $(".input_btn").click(function(){
		$(".input_btn").css('color','#175587');
		$(".input_btn").css('opacity','1');
		$(".input_btn").css('border','none');
		$(".cal_btn").css('background','#00BFB3');
		$(".cal_btn").css('opacity','1');
		$(".cal_btn").css('pointer-events','auto');
		
	  });
	  $(".cal_btn").click(function(){
		$(".left_tab1").hide();
		$(".left_tab2").show();
		
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