
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
	  $(".switcher_on").click(function(){
		$(".table_main").hide();
		$(this).hide();
		$(".switcher_off").show();
		$(".table_main2").show();
		$(".table_head5").show();
		$(".p1").hide();
		$(".profile_btn").css('opacity','1');
		// $(".input_btn").css('border','none');
		// $(".cal_btn").css('background','#00BFB3');
		// $(".cal_btn").css('opacity','1');
		// $(".cal_btn").css('pointer-events','auto');
	  });
	  $(".switcher_off").click(function(){
		$(".table_main2").hide();
		$(this).hide();
		$(".table_main").show();
		$(".switcher_on").show();
		$(".table_head5").hide();
		$(".p1").show();
		$(".profile_btn").css('opacity','0.3');
	  });
	  $(".profile_btn").click(function(){
		
		$(".profile_active").css('display','block');
		$(".hcp_popup").css('display','block');
		$(".home_cta").css('pointer-events','none');
		$(".pi_cta").css('pointer-events','none');
		
	  });

	//   $(".hcp").click(function(index){
	// 	let myclass = hcpactive+index;
	// 	let myclassActive = p4_active+index;
	// 	$(myclass).css('display','none');
	// 	$(myclassActive).css('display','block');
	// 	$(".p5_active").css('display','none');
	// 	$(".p5").css('display','block');
	//   });


	//   $(".p4").click(function(){
	// 	$(".p4_active").css('display','block');
	// 	$(".p4").css('display','none');
	// 	$(".p5_active").css('display','none');
	// 	$(".p5").css('display','block');
	//   });
	//   $(".p4_active").click(function(){
	// 	$(".p4_active").css('display','none');
	// 	$(".p4").css('display','block');
	// 	$(".p5").css('display','block');
	//   });

	//   $(".p5").click(function(){
	// 	$(".p5_active").css('display','block');
	// 	$(".p5").css('display','none');
	// 	$(".p4").css('display','block');
	// 	$(".p4_active").css('display','none');
	//   });
	//   $(".p5_active").click(function(){
	// 	$(".p5_active").css('display','none');
	// 	$(".p5").css('display','block');
	// 	$(".p4_active").css('display','none');
	//   });
	
	// document.querySelector('.close_btn').addEventListener('click', ()=> {
	// 	$(".hcp_popup").hide();
	// 	$(".pi_cta").css('pointer-events','auto');
	// })
	  

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