function loadPage() {
	SetDefaultPHP("server.php");

	CallFuncA("knock", function(Status) {
		status = Status;
		RunStage(status);
	});
}

function RunStage(stage) {
	if (stage == 0) {
		Stage_0();
	} else if (stage == 1) {
		Stage_1();
	} else if (stage == 2) {
		Stage_2();
	} else {

	}
}

function Stage_0() {
	console.log('Stage_0');

	$("#handler").html(`
		<div class = "gradient-box" id = "list">
			<div id = "users">
					<p id = "user_inf">Список игроков:</p>

					<div id = "users_list"></div>
			</div>

			<img id="NiceImg" src="view/statistics/images/cat.svg">
		</div>

		<div id = "OnlineUsers">0</div>

		<div class = "gradient-border" id = "StartButton">
			<p id = "start">Начать игру</p>	
		</div>`);

	$(window).resize(function() {
		if (status == 0) {
			ListBackground();
		}
  	});

	CheckPlayers();

	$("#StartButton").click(function() {
		if ( players.length >= 2 ) {
			CallFuncA("start", function(response) {
				if (response == "1") {
					status = 1;
					TransitionToStage_1();
				}
			});
		}
	});

	function CheckPlayers() {
		CallFuncA("getOnlineUsers", function(OnlineUsers) {
			var players_new = JSON.parse(OnlineUsers);

			var flag = CompareArrays(players, players_new);
			if (!flag) {
				players = players_new;
				$("#OnlineUsers").text(players.length);

				$("#users_list").html("");

				for (var i = 0; i < players.length; i++) {
					$("#users_list").append("<p class = \"user\" id = \"user"+i+"\">"+playersAll[ players[i] ]+"</p>");
				}

				ListBackground();
			}

			if (status == 0) {
				setTimeout(function() {
						CheckPlayers();
				}, 2000);
			}
		});
	}

	function ListBackground() {
		if ( +$("#users_list").prop("scrollHeight") > Math.ceil( +$("#users_list").css("height").replace("px", "") ) ||
			+$("#users_list").prop("scrollWidth") > Math.ceil( +$("#users_list").css("width").replace("px", "") ) ) {
			$("#users_list").css("background-color", "rgba(29, 31, 32, 0.2)");
		} else {
			$("#users_list").css("background-color", "transparent");
		}
	}

	function TransitionToStage_1() {
		window.onresize = null;
		$("#users_list").css("overflow", "hidden");
		$("#OnlineUsers").css("opacity", "0");

		$("p").animate({opacity: 0}, 1000);
		$("#NiceImg").animate({opacity: 0}, 1000);

		$("#StartButton").css({position: "absolute", top: $(window).height() * 0.85 - 64 + "px"});
		$("#StartButton").animate({opacity: 0}, 1000);

		$("#list").css("position", "absolute");
		$( "#list" ).animate({
			height: "6px",
			top: $(window).height() * 0.85 - 96 + "px"
		}, 1300, function() {
			$("#list").empty();
			$("#OnlineUsers").remove();
			$("#StartButton").remove();

			setTimeout(function() {
				$("#list").animate({top: $(window).height() * 0.925 - 64 + "px"}, 1000);

				setTimeout(function() {StartStage_1();}, 1000);
			}, 400);
		});
	}
}

function StartStage_1() {
	$("#handler").html(`
	<div id = "ColumnChart">
		<div id = "results"></div>

		<div id = "numbers_x"></div>
	</div>`);

	Stage_1();
}

function Stage_1() {
	console.log('Stage_1');

	players = [];

	$(window).resize(function() {
		if (status == 1) {
			ColumnStyle();
		}
  	});

	$("#handler").html(`
		<div id = "ColumnChart">
			<div id = "results"></div>

			<div id = "numbers_x"></div>
		</div>`);

	//только после окончания анимации
  	SetPlayers();
  	CheckScores();
  	CheckReadyUsers();

  	function SetPlayers() {
  		CallFuncA("getOnlineUsers", function(OnlineUsers) {
			var players_new = JSON.parse(OnlineUsers);

			players = players_new;

			$("#results").html("");
			$("#numbers_x").html("");

			for (var i = 0; i < players.length; i++) {
				//$("#results").append("<p class = \"user\" id = \"user"+i+"\">"+playersAll[ players[i] ]+"</p>");

				$("#results").append(`
					<div class = "result" id = result`+players[i]+`>
						<div class = "column" id = "column`+players[i]+`"></div>
						<div class = "avatar" id = "avatar`+players[i]+`" style = "background-image:url(view/avatars/`+players[i]+`.jpg);"></div>	
					</div>`);

				if ( scores[ players[i] ] != undefined ) {
						$("#numbers_x").append("<div class = \"number\" id = \"number"+players[i]+"\">"+scores[ players[i] ]+"</div>");
					} else {
						$("#numbers_x").append("<div class = \"number\" id = \"number"+players[i]+"\">0</div>");
					}
			}

			ColumnStyle();

			if (status == 1) {
				setTimeout(function() {
						CheckPlayers();
				}, 4000);
			}
		});
  	}

	function CheckPlayers() {
		CallFuncA("getOnlineUsers", function(OnlineUsers) {
			var players_new = JSON.parse(OnlineUsers);

			var flag = CompareArrays(players, players_new);
			if (!flag) {
				players = players_new;

				$("#results").html("");
				$("#numbers_x").html("");

				for (var i = 0; i < players.length; i++) {
					//$("#results").append("<p class = \"user\" id = \"user"+i+"\">"+playersAll[ players[i] ]+"</p>");

					$("#results").append(`
						<div class = "result" id = result`+players[i]+`>
							<div class = "column" id = "column`+players[i]+`"></div>
							<div class = "avatar" id = "avatar`+players[i]+`" style = "background-image:url(view/avatars/`+players[i]+`.jpg);"></div>
						</div>`);

					if ( scores[ players[i] ] != undefined ) {
						$("#numbers_x").append("<div class = \"number\" id = \"number"+players[i]+"\">"+scores[ players[i] ]+"</div>");
					} else {
						$("#numbers_x").append("<div class = \"number\" id = \"number"+players[i]+"\">0</div>");
					}
				}

				ColumnStyle();
			}

			if (status == 1) {
				setTimeout(function() {
						CheckPlayers();
				}, 4000);
			}
		});
	}

	function CheckScores() {
		CallFuncA("getScores" , function(Scores) {
			scores_new = JSON.parse(Scores);

			var score_max = 0;

			for (var i = 0; i < players.length; i++) {
				var current_new_score = scores_new[ players[i] ];
				var current_score = scores[ players[i] ];

				if (current_new_score != current_score) {
					$("#number"+players[i]).text(current_new_score);

					$("#column"+players[i]).animate({height: Math.floor( (current_new_score * 3 + 2) * 0.01 * +$("#result"+players[i]).css("height").replace("px", "") ) }, 600);
				}

				//определить игрока с максимальными очками и присвоить его аватару класс winner
			}

			scores = scores_new;

			ColumnStyle();

			if (status == 1) {
				setTimeout(function() {
					CheckScores();
				}, 800);
			}
		});
	}

	function CheckReadyUsers() {
		CallFuncA("getReadyUsers" , function(ReadyUsers) {
			ready_players = JSON.parse(ReadyUsers);

			for (var i = 0; i < ready_players.length; i++) {
				var current_player = ready_players[i];

				$("#column"+current_player).addClass("gold_column");
			}

			if (ready_players.length == players.length) {
				CallFuncA("stop", function(response) {
					if (response == "1") {
						status = 2;
						TransitionToStage_2();
					}
				});
			}

			if (status == 1) {
				setTimeout(function() {
					CheckReadyUsers();
				}, 2000);
			}
		});
	}

	function ColumnStyle() {
		$(".result").css("width", $("#results").css("width").replace("px", "") / (players.length + 1) + "px");

		for (var i = 0; i < players.length; i++) {
			var current_score = scores[ players[i] ];

			$("#column"+players[i]).css("height", Math.floor( (current_score * 3 + 2) * 0.01 * +$("#result"+players[i]).css("height").replace("px", "") ));
		}

		var highest_column = 0;

		for (var i = 0; i < players.length; i++) {
			var column_height = Math.floor( +$("#column"+players[i]).css("height").replace("px", "") );

			if (column_height > highest_column) {
				highest_column = column_height;
			}
		}

		if ( +$(".result").css("height").replace("px", "") - highest_column - 64 >
			$(".result").css("width").replace("px", "") / 2 ) {
			$(".avatar").css("height", Math.floor( $(".result").css("width").replace("px", "") / 2) );
			$(".avatar").css("width", Math.floor( $(".result").css("width").replace("px", "") / 2) );
		} else {
			$(".avatar").css("height", Math.floor( +$(".result").css("height").replace("px", "") ) - highest_column - 64 + "px");
			$(".avatar").css("width", Math.floor( +$(".result").css("height").replace("px", "") ) - highest_column - 64 + "px");
		}

		/*if ( +$(".avatar").css("width").replace("px", "") > +$(".avatar").css("height").replace("px", "") ) {
				$(".avatar").css("width", $(".avatar").css("height"));
		}*/
	}

	function TransitionToStage_2() {
		window.onresize = null;
		
		StartStage_2();
	}
}

function StartStage_2() {
	$("#handler").html();

	Stage_2();
}

function Stage_2() {
	console.log('Stage_2');
}

var status = 0;

var count_winners = 1;

var players = [];
var ready_players = [];
var scores = [];
var playersAll = ["Анастасия Покладова", "Анастасия Сечкина", "Ангелина Янько", "Арина Кузьмичёва", "Арина Чистякова",
	"Валерия Вашурина", "Виолетта Меняйло", "Галина Колесникова", "Дарья Рябова", "Елена Ермак", "Елизавета Кожекина", "Ксения Клименко"];

function CompareArrays(arr1, arr2) {
	if (arr1.length != arr2.length) {
		return false;
	}

	for (var i = 0; i < arr2.length; i++) {
		if (arr1[i] != arr2[i]) {
			return false;
		}
	}

	return true;
}