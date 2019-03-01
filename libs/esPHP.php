<?php 
	$previousLevel = Error_Reporting();
	Error_Reporting(E_ALL & ~E_NOTICE);
	if (isset($_GET["useFunction"]) && $_GET["useFunction"])
		requestParse();
	Error_Reporting($previousLevel);
	
	function requestParse()
	{
		$headers = GetAllHeaders();
		foreach($headers as $header=>$value)
		{
			if (strtolower($header) == "functionrequest")
				$calledFunction = urldecode($value);
			if (strtolower($header) == "filename")
			{
				$script = getProjectPath().urldecode($value);
			}
		}
		
		if (!endsWith(strtolower($script),".php"))
			$script .= ".php";
		$functionName = preg_split("/\\s*[(]/",$calledFunction);
		$functionName = $functionName[0];
		
		if(file_exists($script))
			require_once($script);
		else
		{
			echo "<!--error-->Warning: Script file has not found!";
			return;
		}
		
		if (is_callable($functionName))
		{
			$phpFile = fread(fopen($script,"r"),filesize($script));
			$functionSearch = "/function +".$functionName."[(]([^)]*)[)]\\s*[{]\\s*invokable\\W/";
			if (preg_match($functionSearch,$phpFile))
			{
				$paramsString = preg_split("/\\s*[(]/",$calledFunction);
				unset($paramsString[0]);
				$paramsString = implode("(",$paramsString);;
				$paramsString = preg_replace("/[)]?;?$/","",$paramsString);
				$paramsString = preg_replace("/\"*'*/","",$paramsString);
				$params = explode(",",$paramsString);
				echo urlencode(call_user_func_array($functionName,$params));
			}
			else
				echo "<!--error-->Warning: Function has not found!";
		}
		else
			echo "<!--error-->Warning: Function has not found!";
	}
	
	function startsWith($haystack, $needle)
	{
		$length = strlen($needle);
		return (substr($haystack,0,$length) === $needle);
	}
	
	function endsWith($haystack, $needle)
	{
		$length = strlen($needle);
		return $length === 0 ||
			(substr($haystack, -$length) === $needle);
	}
	
	function getProjectPath()
	{
		$path = "";
		while (is_dir($path) || $path == "")
		{
			if (file_exists($path."index.php"))
				return $path;
			else
				$path .= "../";
		}
		return $_SERVER["DOCUMENT_ROOT"];
	}
?>