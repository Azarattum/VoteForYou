var DefaultPHP; 

//Main functions
function CallPHPFunction(functionRequest, scriptPath)
{
	if (scriptPath == null)
		scriptPath = DefaultPHP;
	var gettedData;	
	$.ajax({
        url: GetLibraryLocation()+"esPHP.php?useFunction=true",
		headers: {functionRequest: CustomEncode(ParseFunctionRequest(functionRequest)),
			fileName: CustomEncode(scriptPath)},
        async: false,
		method: "GET",
        success: function(data) {
            gettedData = data;
        }
    });
	if (gettedData != null && gettedData.indexOf("<!--error-->") == 0)
	{
		console.error(gettedData);
		return null;
	}
	else if (gettedData != undefined)
		return CustomDecode(gettedData);
}

function CallPHPFunctionAsync(functionRequest, callBackFunction, scriptPath)
{
	if (scriptPath == null)
		scriptPath = DefaultPHP;
	
	var gettedData;	
	$.ajax({
        url: GetLibraryLocation()+"esPHP.php?useFunction=true",
		headers: {functionRequest: CustomEncode(ParseFunctionRequest(functionRequest)),
			fileName: CustomEncode(scriptPath)},
        async: true,
		method: "GET",
        success: function(data) {
			gettedData = data + "";
			if (gettedData != null && gettedData.indexOf("<!--error-->") == 0)
			{
				console.error(gettedData);
			}
			else if (gettedData != undefined)
				callBackFunction(CustomDecode(gettedData));
        }
    });
}

//Shoter usage
function CallFunc(functionRequest, scriptPath)
{
	return CallPHPFunction(functionRequest, scriptPath);
}

function CallFuncA(functionRequest, callBackFunction, scriptPath)
{
	return CallPHPFunctionAsync(functionRequest, callBackFunction, scriptPath);
}

//Additional functions
function CustomDecode(encodedText)
{
	return decodeURIComponent(encodedText.replace(new RegExp("[+]","g"),"%20"));
}

function CustomEncode(decodedText)
{
	return encodeURIComponent(decodedText).replace(new RegExp("%20","g"),"+");
}

function GetLibraryLocation()
{
	var scripts = document.getElementsByTagName("script");
	var path;
	for (var script in scripts)
	{
		if (scripts[script].src != undefined)
		{
			if (scripts[script].src.indexOf("esPHP.js") != -1)
				path = scripts[script].src.split("?")[0];
		}
	}
	var libdir = path.replace(new RegExp("\\\\","g"),"/").split("/").slice(0,-1).join("/")+"/";
	return libdir;
}

function ParseFunctionRequest(requestToParse)
{
	var request = requestToParse;
	
	if (request.indexOf(";") != -1)
		request = request.split(';')[0];
	
	if (!request.endsWith(")") && !request.indexOf("(") != -1)
		request += "();";
	else if (!request.endsWith(")") && request.indexOf("(") != -1)
		request += ");";
	else if (request.endsWith(")"))
		request += ";";
		
	return request;
}

function SetDefaultPHP(scriptPath)
{
	DefaultPHP = scriptPath;
}