<?php
	header("Content-Type: text/html; charset=utf-8");
	require("server.php");
	$data = getData();
	if ($data["stage"] === 0)
		header("Location:index.php");
	//Define user
	$user = $data["users"][$_GET["user"]];
	//Get all questions
	$questions = getQuestions();
	
	//Check for the last question
	if ($user["currentQuestion"] == count($questions))
	{		
		//Go to the last page if user passed through all question 
		header("Location:wait.php?user=".$_GET["user"]."&message=вы%20ответили%20на%20все%20вопросы,<br>набрав%20".$user["score"]."%20балл(а/ов).&stage=2");
		return;
	}
	//Get needed question
	$questionText = $questions[$user["questions"][$user["currentQuestion"]]]["text"];
	//Send question text
	echo "<script>var questionText=\"".$questionText."\";";
	//Send user's id
	echo "var user=\"".$_GET["user"]."\";</script>";
	include("view/question/frame.html");
	include("jsconnections.html");
?>