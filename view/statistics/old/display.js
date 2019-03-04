function loadPage()
{
	//$("div").css("left","0vw");

	/*interval_CheckingPlayers = window.setInterval(function()
	{
		var playersInf_new = JSON.parse(CallFunc("getUsers","server.php"));

		console.log(playersInf_new);
	},50000);*/

	$(".avatar").each(function() {
		//$(this).parent().css( "background-color", "red" );
		//var num = $(this).parent().id.replace("result", "");

		//$(this).css("background-image","url(\"view/profile/images/"+encodeURIComponent(encodeURIComponent($("#box"+num).first-child().text()))+".jpg\")");
	});

	CheckPlayers();
}

function CheckPlayers() {
	playersInf = {
		10: {
			"score": 5
		},
		0: {
			"score": 15
		}
	};

	$("#Profiles").html("");

	for (var player in playersInf) {
		var score = playersInf[player]["score"];

		NewPlayer(player);
	}
}

function NewPlayer(player) {
	$("#Profiles").append(`
		<div class = "player">
			<div class = "gradient-border box" id = "box`+player+`">
				<p class = "name">`+playersAll[player]+`</p>	
			</div>

			<div class = "gradient-border score-box" id = "score`+player+`">
				<div class = "score">0</div>	
			</div>
		</div>
	`);
}

function NewScore() {

}

var status = 0;
var interval_CheckingPlayers;
var playersInf = [];
var playersAll = ["Анастасия Покладова","Анастасия Сечкина","Ангелина Янько","Арина Кузьмичёва","Арина Чистякова",
"Валерия Вашурина","Виолетта Меняйло","Галина Колесникова","Дарья Рябова","Елена Ермак","Елизавета Кожекина","Ксения Клименко"];


/*[id]["score"]

JSON.parse(CallFunc("getUsers","server.php"))[0]["score"]

$userNames[0]

JSON.parse(CallFunc("getUsers","server.php"))[0]["online"]*/