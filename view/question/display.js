function loadDisplayPage()
{
	$("#question p").html(questionText);
	if (questionText == "" || questionText == undefined)
		$("#question p").html(CallFunc("getQuestion("+user+")", "server.php"));
	animateIncome();
	registerEvents();
	registerMobileEvents();
}

function animateIncome()
{
	$(".slide").animate({left: "0%"}, 600, function(){
		$(".gradient-border").animate({left: "10px"},100);
	});
}

function registerEvents()
{
	$("#answer1").click(function(){
		CallFuncA("answerByUser("+user+",1)",function(response) {
			parseResponseOnAnswer(response);
		},"server.php");
	});
	$("#answer2").click(function(){
		CallFuncA("answerByUser("+user+",0)",function(response) {
			parseResponseOnAnswer(response);
		},"server.php");
	});
}

function parseResponseOnAnswer(response)
{
	if (response.indexOf("end") == 0)
	{
		var text = response.split(':')[2];
		if (isNumeric(response.split(':')[2]))
			text = "Правильно! вы получили " + text.split(':')[2] + " балл(а).<br><b>Всего: "+ text.split(':')[3] +"</b>"
		niceAlert(text, function(){
			goToPage("wait.php?user="+user+"&message=вы%20ответили%20на%20все%20вопросы,<br>набрав%20"+response.split(':')[1]+"%20балл(а/ов).&stage=2");
		});
	}
	else
	{
		if (isNumeric(response.split(':')[0]))
			response = "Правильно! вы получили " + response.split(':')[0] + " балл(а).<br><b>Всего: "+ response.split(':')[1] +"</b>"
		niceAlert(response, function(){
			goToPage("?user="+user);
		});
	}
}

function niceAlert(text, callback)
{
	$("#question").animate({height: ($(window).height() - 128) + "px"}, 600, function(){
		$("#question").css("height","calc(100vh - 64px)");
		window.setTimeout(callback, 3000);
	});
	$(".gradient-border").animate({opacity: 0}, 600);
	$("p").animate({opacity: 0}, 300, function(){
		$("p").html(text);
		$("p").animate({opacity: 1}, 300);
	});
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function registerMobileEvents()
{
	$(".gradient-border").attr("ontouchstart",`
		$(this).css(\"background\",\"rgba(223,224,226,0)\");
		$(this).css(\"color\",\"white\");
	`);
	$(".gradient-border").attr("ontouchend",`
		$(this).css(\"background\",\"rgb(223,224,226)\");
		$(this).css(\"color\",\"#1d1f20\");
	`);
}

function goToPage(page)
{
	//Outcome animation
	$(".slide").animate({left: "-200vw"}, 600,function() {
		location.replace(page);
	});
}