function loadPage()
{
	//settingImages
	$(".avatar").each(function(i) {
		$(this).css("background-image","url(\"view/avatars/"+i+".jpg\")");
		$(this).parent().attr("userId",i);
	});
	animateIncome();
	registerEvents();
	registerMobileEvents();
}

function registerMobileEvents()
{
	$(".box").attr("ontouchstart",`
		$(this).css(\"background\",\"rgba(223,224,226,0)\");
		$(this).css(\"color\",\"white\");
		$(this).children(\".avatar\").css(\"box-shadow\",\"rgb(223,224,226) 0px 0px 25px\");
	`);
	$(".box").attr("ontouchend",`
		$(this).css(\"background\",\"rgb(223,224,226)\");
		$(this).css(\"color\",\"#1d1f20\");
		$(this).children(\".avatar\").css(\"box-shadow\",\"rgb(29, 31, 32) 0px 0px 20px\");
	`);
}

function registerEvents()
{
	//User click
	$(".box").click(function(){
		goToPage("wait.php?user="+$(this).attr("userId")+"&message=ожидайте начала игры<br>...&stage=1");
	});
}

function animateIncome()
{
	$(".slide").animate({left: "0%"}, 600);
}

function goToPage(page)
{
	//Outcome animation
	$(".slide").animate({left: "-200vw"}, 600,function() {
		location.replace(page);
	});
}