var includes = [
    "global.js",
    "config.js",
    "feedbacker.js",
    "drawer.js"
];

for(var i=0;i<includes.length;i++) {
    document.write('<script src="js/' + includes[i] + '" type="text/javascript"></script>');
}

var drawer;

function Initialize() {
    var feedbacker = new Feedbacker();
    feedbacker.initialize();
    
    drawer = new Drawer();
    drawer.initialize();
}

function RestoreInitialState() {
    drawer.stop();
}

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

	  $(".btn1").click(function(){
		$(".btn1").hide();
		$(".btn1_active").show();
		$(".bottom_txt1").show();
		$(".bottom_txt2").show();
		$(".bottom_txt3").show();
		
	  });
	  $(".btn1_active").click(function(){
		$(".btn1_active").hide();
		$(".btn1").show();

	  });

	  $(".btn2").click(function(){
		$(".btn2").hide();
		$(".btn2_active").show();
		
	  });
	  $(".btn2_active").click(function(){
		$(".btn2_active").hide();
		$(".btn2").show();

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