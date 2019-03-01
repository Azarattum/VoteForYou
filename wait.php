<?php
	$userNames = array("Анастасия Покладова","Анастасия Сечкина","Ангелина Янько",
	"Арина Кузьмичёва","Арина Чистякова","Валерия Вашурина","Виолетта Меняйло",
	"Галина Колесникова","Дарья Рябова","Елена Ермак","Елизавета Кожекина","Ксения Клименко");
	
	header("Content-Type: text/html; charset=utf-8");
	echo "<script>var user=\"".$_GET["user"]."\"</script>";
	include("view/wait/frame.html");
	echo "<p class=\"text\">".$userNames[$_GET["user"]].",<br>".$_GET["message"]."</p>";
	echo "<script>var waitingStage=".$_GET["stage"]."</script>";
	echo "</div></body></html>";
	include("jsconnections.html");
?>