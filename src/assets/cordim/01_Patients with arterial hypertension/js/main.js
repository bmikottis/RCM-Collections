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
		$(".gp_dropdown_cta").show();
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
		$(".cardio_cta").hide();
		$(".gp_cta").hide();
		$(".gp_dropdown_cta").hide();
		$(".cardio_dropdown_cta").hide();
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
		$(".cardio_cta").hide();
		$(".gp_cta").hide();
		$(".gp_dropdown_cta").hide();
		$(".cardio_dropdown_cta").hide();
	  });
	  $(".sidebar2_cardio").click(function(){
		$(".sidebar2_cardio").hide();
		$(".sidebar2_dropdown2").show();
		$(".cardio_cta").show();
		$(".gp_cta").show();
		$(".cardio_dropdown_cta").show();
		
	  });
	  $(".gp_dropdown_cta").click(function(){
		$(".sidebar2_dropdown1").hide();
		$(".gp_dropdown_cta").hide();
		$(".sidebar2").show();
	  });
	  $(".cardio_dropdown_cta").click(function(){
		$(".sidebar2_dropdown2").hide();
		$(".cardio_dropdown_cta").hide();
		$(".sidebar2_cardio").show();
	  });
	  $(".pi_cta").click(function(){
		$(".pi_active").fadeIn();
		
	  });
	  $(".close").click(function(){
		$(".pi_active").fadeOut();
		
	  });
	//   $("#feedposi").click(function(){
	// 	$("#feedposi").addClass("feedposi_cta");
	//   });
	//   $("#feednone").click(function(){
	// 	$("#feednone").addClass("feednone_cta");
	//   });
	//   $("#feednega").click(function(){
	// 	$("#feednega").addClass("feednega_cta");
	//   });
	

});

// function menuOpenFunction() {
// 	var x = document.getElementById("menubar");
// 	if (x.style.display === "none") {
// 	  x.style.display = "block";
// 	} else {
// 	  x.style.display = "none";
// 	}
//   }