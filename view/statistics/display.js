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
		<div id = "numbers_y">
			<div class = "value">0</div>
			<div class = "value">5</div>
			<div class = "value">10</div>
			<div class = "value">15</div>
			<div class = "value">20</div>
			<div class = "value">25</div>
		</div>

		<div id = "chart">
			<div id = "results"></div>

			<div id = "numbers_x"></div>
		</div>
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
			<div id = "numbers_y">
				<div class = "value">0</div>
				<div class = "value">5</div>
				<div class = "value">10</div>
				<div class = "value">15</div>
				<div class = "value">20</div>
				<div class = "value">25</div>
			</div>

			<div id = "chart">
				<div id = "results"></div>

				<div id = "numbers_x"></div>
			</div>
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
			scores = JSON.parse(Scores);

			for (var i = 0; i < players.length; i++) {
				var current_score = scores[ players[i] ];

				$("#number"+players[i]).text(current_score);

				$("#column"+players[i]).animate({height: current_score * 3 + 2 + "%"}, 600);
				//$("#column"+players[i]).css("height", current_score * 3 + 2 + "%");
			}

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

			if (status == 1) {
				setTimeout(function() {
					CheckReadyUsers();
				}, 2000);
			}
		});
	}

	function ColumnStyle() {
		$("#numbers_y").css("height", $("#results").css("height"));
		$(".value").css("margin-top", $("#results").css("height").replace("px", "") * 0.09 + 3);

		$(".result").css("width", $("#results").css("width").replace("px", "") / (players.length + 1) + "px");

		if ( +$(".result").css("height").replace("px", "") - +$(".column").css("height").replace("px", "") - 64 >
			$(".result").css("height").replace("px", "") / 2 ) {
			$(".avatar").css("height", $(".result").css("height").replace("px", "") / 2);
		} else {
			$(".avatar").css("height", +$(".result").css("height").replace("px", "") - +$(".column").css("height").replace("px", "") - 64 + "px");
		}
		

		if ( +$(".result").css("width").replace("px", "") / 2 > +$(".avatar").css("height").replace("px", "") ) {
			$(".avatar").css("width", $(".avatar").css("height").replace("px", ""));
		} else {
			$(".avatar").css("width", $(".result").css("width").replace("px", "") / 2);
			$(".avatar").css("height", $(".result").css("width").replace("px", "") / 2);
		}
	}
}

function Stage_2() {
	console.log('Stage_2');
}

var status = 0;
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