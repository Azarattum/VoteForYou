<?php
	function start()
	{
		invokable;
		$data = getData();
		$data["stage"] = 1;
		
		//Define empty data
		$maxQuestionId = count(getQuestions()) - 1;
		$usersCount = count($data["users"]);
		//Reset all user's data
		for ($i = 0; $i < $usersCount; $i++)
		{
			$questions = range(0, $maxQuestionId);
			shuffle($questions);
			$data["users"][$i]["questions"] = $questions;
			$data["users"][$i]["currentQuestion"] = 0;
			$data["users"][$i]["score"] = 0;
		}
		saveData($data);
		
		//Testing
		$dataTest = getData();
		if ($dataTest != null && $dataTest["stage"] == 1 && $dataTest["users"] != null)
			return true;
		else
			return false;
	}
	
	function stop()
	{
		invokable;
		$data = getData();
		$data["stage"] = 0;
		saveData($data);
		
		//Testing
		$dataTest = getData();
		if ($dataTest["stage"] == 0)
			return true;
		else
			return false;
	}
	
	function answerByUser($userId, $answer)
	{
		invokable;
		$data = getData();
		if (!isset($data["users"][$userId]))
			return null;
		//Get all questions
		$questions = getQuestions();
		if ($data["users"][$userId]["currentQuestion"] == count($questions))
			return false;
		//Get needed question
		$question = $questions[$data["users"][$userId]["questions"][$data["users"][$userId]["currentQuestion"]]];
		//Check is answer right
		if ($question["rightAnswer"] == $answer)
		{
			//Adding score for the right answer
			$data["users"][$userId]["score"] += $question["score"];
			$reslut = false;
			
			//Checking for questions count
			if ($data["users"][$userId]["currentQuestion"] < count($questions))
				$data["users"][$userId]["currentQuestion"]++;
			else
				$reslut = "end:".$data["users"][$userId]["score"].":".$question["correctionText"].":".$data["users"][$userId]["score"];
			
			//Saving changes
			saveData($data);
			
			//Forming result
			if (!$reslut)
				$reslut = $question["score"].":".$data["users"][$userId]["score"];
			
			return $reslut;
		}
		else
		{
			$reslut = false;
			//Checking for questions count
			if ($data["users"][$userId]["currentQuestion"] < count($questions))
				$data["users"][$userId]["currentQuestion"]++;
			else
				$reslut = "end:".$data["users"][$userId]["score"].":".$question["correctionText"];
			
			//Saving changes
			saveData($data);
			
			//Forming result
			if (!$reslut)
				$reslut = $question["correctionText"];
			
			return $reslut;
		}
	}
	
	function getQuestion($userId)
	{
		invokable;
		$data = getData();
		//Define user
		$user = $data["users"][$userId];
		if (!isset($user))
			return null;
		//Get all questions
		$questions = getQuestions();
		//Get needed question
		return $questions[$user["questions"][$user["currentQuestion"]]]["text"];
	}
	
	function getUsers()
	{
		invokable;
		$data = getData();
		return json_encode($data["users"]);
	}
	
	function getOnlineUsers()
	{
		invokable;
		
		$data = getData(); //Load data
		$users = $data["users"];
		$result = array();
		//Search for online users
		foreach	($users as $id=>$user)
		{
			if ($user["online"])
				array_push($result, $id);
		}
		//Returning online users
		return json_encode($result);
	}
	
	function getScores()
	{
		invokable;		
		$data = getData(); //Load data
		$users = $data["users"];
		$result = array();
		//Select users' score
		foreach	($users as $user)
			array_push($result, $user["score"]);
		//Returning users' score
		return json_encode($result);
	}
	
	function getReadyUsers()
	{
		invokable;		
		$data = getData(); //Load data
		$users = $data["users"];
		$result = array();
		
		$questions = getQuestions();
		$questionsCount = count($questions);
		//Select ready users
		foreach	($users as $id=>$user)
			if ($user["currentQuestion"] == $questionsCount)
				array_push($result, $id);
		//Returning ready users
		return json_encode($result);
	}
	
	function getMaxScore()
	{
		invokable;		
		$questions = getQuestions(); //Load questions
		$scoreSum = 0;
		//Select ready users
		foreach	($questions as $question)
			$scoreSum += $question["score"];
		//Returning ready users
		return $scoreSum;
	}
	
	function checkOfflineUsers($users)
	{
		foreach ($users as $id=>$user)
			if (time() - $user["time"] > 10)
				$users[$id]["online"] = false;
		return $users;
	}
	
	//Invokable function for checking users' online status
	function knock($userId)
	{
		invokable;
		$data = getData();
		if (isset($data["users"][$userId]))
		{
			//Reset user's time and online status
			$data["users"][$userId] = reOnlineUser($data["users"][$userId]);
			//Save changes
			saveData($data);
		}
		return $data["stage"];
	}
	
	function reOnlineUser($user)
	{
		$user["time"] = time();
		$user["online"] = true;
		return $user;
	}
	
	function getQuestions()
	{
		invokable;
		$str_data = false;
		$questionPath = getCoreFolder()."data/questions.json";
		while ($str_data == false)
			$str_data = file_get_contents($questionPath);
		$data = json_decode($str_data,true);
		return $data;
	}
	
	function getData()
	{
		$dataPath = getCoreFolder()."data/data.json"; //Construct path to file
		if (!file_exists($dataPath)) //Checking file for existing
			createDataFile($dataPath);
		
		$str_data = false; //Define file resource
		//Trying to read file
		while ($str_data == false)
			$str_data = file_get_contents($dataPath);
		$data = json_decode($str_data,true);
		//Updating users' online
		if ($data["stage"] == 0)
		{
			$data["users"] = checkOfflineUsers($data["users"]);
			saveData($data);
		}
		return $data;
	}
	
	function createDataFile($path)
	{
		//Define empty data
		$data = array("stage" => 0, "users" => array());
		$maxQuestionId = count(getQuestions()) - 1;
		$usersCount = 12; //Define count of all users
		//Define user by user array
		for ($i = 0; $i < $usersCount; $i++)
		{
			$questions = range(0, $maxQuestionId);
			shuffle($questions);
			$data["users"][$i]["questions"] = $questions;
			$data["users"][$i]["currentQuestion"] = 0;
			$data["users"][$i]["score"] = 0;
			$data["users"][$i]["online"] = false;
			$data["users"][$i]["time"] = 0;
		}
		
		//Creating file
		$resource = false;
		while ($resource == false)
			$resource = fopen($path, 'w');
		fwrite($resource, json_encode($data));
		fclose($resource);
	}
	
	function saveData($data)
	{
		$dataPath = getCoreFolder()."data/data.json";
		if (!file_exists($dataPath)) //Checking file for existing
			createDataFile($dataPath);
		$fh = false; //Define file resource
		//Trying to open file
		while ($fh == false)
			$fh = fopen($dataPath, 'w');
		//Writing to file
		fwrite($fh, json_encode($data));
		fclose($fh);
	}
	
	function getCoreFolder()
	{
		if (is_dir("data"))
			return "";
		else if (is_dir("../data"))
			return "../";
		else
			return null;
	}
?>