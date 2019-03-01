function loadPage()
{
	$(".page").css("opacity","1");
	knockingToServer();
	startAnimatedDots()
}

function startAnimatedDots()
{
	window.setInterval(function(){
		if ($(".text").html().endsWith("ы<br>..."))
			$(".text").html($(".text").html().replace("ы<br>...","ы<br>&nbsp;"));
		else if ($(".text").html().endsWith("ы<br>.."))
			$(".text").html($(".text").html().replace("ы<br>..","ы<br>..."));
		else if ($(".text").html().endsWith("ы<br>."))
			$(".text").html($(".text").html().replace("ы<br>.","ы<br>.."));
		else if ($(".text").html().endsWith("ы<br>&nbsp;"))
			$(".text").html($(".text").html().replace("ы<br>&nbsp;","ы<br>."));
	},600);
}

function knockingToServer()
{
	CallFuncA("knock("+user+")", function(stage) {
		if (stage == 1 && waitingStage == 1) //Go to questions when game has started
			goToPage("question.php?user="+user);
		else if (stage == 0 && waitingStage == 2)
			goToPage("index.php");
		setTimeout(function() {
			knockingToServer();
		}, 1500);
	},"server.php");
}

function goToPage(page)
{
	$(".page").css("opacity","0");
	window.setTimeout(function(){
		location.replace(page);
	},800
	);
}