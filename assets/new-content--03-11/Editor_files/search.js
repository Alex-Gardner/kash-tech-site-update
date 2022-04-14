/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.21 $:
function getSearchString(path, field, filter, noCase)
{
	var acase="";
	if(noCase)acase="nocase";
	var useField = field;
	var useFilter = filter;
	var fs = filter.split(".");
	if(fs.length > 1)
	{
		if(fs[0].indexOf("*") == -1)
			useFilter = "*" + fs[0] + "*";
		else 
			useFilter = fs[0];
		
		useFilter = useFilter + "." + fs[1];
		useField = "name";
	}	
//	else if(filter.indexOf("*") == -1)
//		useFilter = "*" + filter + "*";
//	else
//		useFilter = filter;
	
	var useTag = false;
	var srchDlg = $(".div-search");
	var useField = srchDlg.ibxWidget("option", "search");
	if (useField == "tag")
		useTag = true;
	var matchType = srchDlg.ibxWidget("option", "matchingBehavior");
	var resourceType = srchDlg.ibxWidget("option", "type");
	var tagMatchType;
	filter = searchaddslashes(filter);
	switch(matchType)
	{
		case "contains":
		{
			useFilter = '*' + filter + '*';
			tagMatchType = "contains";
			break;
		}
		case "starts_with":
		{
			useFilter = filter + '*';
			tagMatchType = "startsWith";
			break;
		}
		case "ends_with":
		{
			useFilter = '*' + filter;
			tagMatchType = "endsWith";
			break;
		}
		case "exact_match":
		{
			useFilter = filter;
			tagMatchType = "matches";
			break;
		}
	}

	var searchString = [];
	
	var isFavSearch = path.indexOf("Favorites") != -1;
	var coreSearch = path + (!useTag ? '/##FILTER("attribute","' + useField +'","' + useFilter + '","' + acase + '")' : '/##FILTER("properties","Category=' + tagMatchType + '(\'' + filter + '\')","nocase")');
	console.log(coreSearch);
	if (resourceType != "any")
	{
		var searchObjectTypeString =  !isFavSearch ? 'FILTER("attribute","type","' : 'FILTER("properties","LinkToObjType=matches(';
		var searchObjectExtensionString = 'FILTER("file","';
		
		var useSOTS = false;
		var useSOES = false;
		var objTypes = resourceType.split(',');
		for (var i = 0; i < objTypes.length; i++)
		{
			if (objTypes[i].indexOf("--") == 0)
			{
				useSOES = true;
				searchObjectExtensionString += (';' + objTypes[i].substring(2));
			}
			else if (objTypes[i].indexOf("^^") == 0)
			{
				if (useSOTS)
					searchObjectTypeString += ',';
				else
					useSOTS = true;
				
				var parts = objTypes[i].split(';');
				searchObjectTypeString += parts[0].substring(2);

				if (useSOES)
					searchObjectExtensionString += (';');
				else
					useSOES = true;
				searchObjectExtensionString += (parts[1]);
			}
			else
			{
				if (useSOTS)
					searchObjectTypeString += ',';
				else
					useSOTS = true;
				if (!isFavSearch)
					searchObjectTypeString += objTypes[i];
				else
					searchObjectTypeString += ("'" + objTypes[i] + "'");
			}
		}
		
		if (!isFavSearch)
			searchObjectTypeString += '")';
		else
			searchObjectTypeString +=  ')")';
		
		searchObjectExtensionString += '")';
		
		if (useSOTS && !useSOES)
		{
			searchString[0] = coreSearch + ';' + searchObjectTypeString;
		}
		else if (useSOES && !useSOTS)
		{
			searchString[0] = coreSearch + ';' + searchObjectExtensionString;
		}
		else
		{
			searchString[0] = coreSearch + ';' + searchObjectTypeString;
			searchString[1] = coreSearch + ';' + searchObjectExtensionString;
		}
	}
	else
		searchString[0] = coreSearch;
	
	return searchString; 
}
function getSearchStringSimple(path, field, filter, noCase)
{
	var iEda = (path.indexOf("IBFS:/EDA") > -1) ? true: false;
	var acase="";
	if(noCase)acase="nocase";
	var useField = field;
	var useFilter;
	var fs = filter.split(".");
	if(fs.length > 1)
	{
		if(fs[0].indexOf("*") == -1)useFilter = "*" + fs[0] + "*";
		else useFilter = fs[0];
		useFilter = useFilter + "." + fs[1];
		useField = "name";
	}	
	else if(filter.indexOf("*") == -1)
	{	
		var useFilter = "";
		if(iEda)
			useFilter = "*" + filter + "*.*";
		else
			useFilter = "*" + filter + "*";
	}	
	else
		useFilter = filter;
	if(iEda)
		useField = "name";
	useFilter = searchaddslashes(useFilter);
	var searchString = path + '/##FILTER("attribute","' + useField +'","' + useFilter + '","' + acase + '")';
	return searchString; 
}
function searchaddslashes(str) {
	str=str.replace(/\\/g,'\\\\');	
	str=str.replace(/\?/g,'\\?');
	str=str.replace(/\(/g,'\\(');
	str=str.replace(/\)/g,'\\)');
//	str=str.replace(/\*/g,'\\*');
	str=str.replace(/"/g, '\\"');
	return str;
}
function TextSearch(txtField, refreshCallback, searchCallback, thisContext)
{
	this._refreshCallback = refreshCallback;
	this._searchCallback = searchCallback;
	this._thisContext = thisContext;
	if(typeof txtField === "string")
	{
		this._txtField = $(txtField);
		this._txtField.on("ibx_textchanged", this._onTextChanged.bind(this));
	}	
	else
	{
		this._txtField = txtField;
		this._txtField.on("ibx_textchanged", this._onTextChanged.bind(this));
	}	
      
}

_p = TextSearch.prototype = new Object();

_p.destroy = function()
{
    //console.log("cleanup: %s", this._txtField.data("name"));
    window.clearInterval(this._searchTimer1);
    window.clearInterval(this._searchTimer2);
};
_p._searchText = "";

_p._onTextChanged = function(e, data)
{
	console.log("textChanged: %s", data.text);
    this._searchText = data.text;
    window.clearInterval(this._searchTimer1);
    window.clearInterval(this._searchTimer2);
    if(this._searchText != "")
    	this._searchTimer1 = window.setInterval(this._onSearchTimer1.bind(this), 500);
    else
    {	
    	//home_globals.homePage.refreshfolder();
    	this._clearSearch();
    	var cb = this._refreshCallback.bind(this._thisContext);
    	cb();    	
    }	
   
};
_p._clearSearch = function()
{
	console.log("clear Search for: %s", this._searchText);
	this._txtField.ibxTextField("option","text","");	
	this._searchText = "";
	this._lastSearchText = "";
	window.clearInterval(this._searchTimer1);
    window.clearInterval(this._searchTimer2);
};
_p.setSearchPlacholder = function(text)
{
	this._txtField.ibxTextField("option","placeholder",text);
};
_p.getSearchText = function()
{
	return this._searchText;
};
_p._lastSearchText = "";
_p._onSearchTimer1 = function()
{
	//console.log("Search Timer1 for: %s", this._searchText);
	if(this._searchText == "")
		window.clearInterval(this._searchTimer1);
	else 	//if(this._searchText != this._lastSearchText)
    {
		//console.log("Search Timer2 begin: %s", this._searchText);
    	window.clearInterval(this._searchTimer1);
    	this._lastSearchText = this._searchText;
    	window.clearInterval(this._searchTimer2);
    	this._searchTimer2 = window.setInterval(this._onSearchTimer2.bind(this), 500);
    }	
};

_p._onSearchTimer2 = function()
{	
	//console.log("in Search Timer2 for: %s", this._searchText);
    if(this._searchText == this._lastSearchText)
    {
    	window.clearInterval(this._searchTimer2);	
    	window.clearInterval(this._searchTimer1);
	    //console.log("Search for: %s",  this._searchText);
	    if(this._searchText.length > 0)
	    {
	    	console.log("Search for: %s",  this._searchText);
	    	var cb = this._searchCallback.bind(this._thisContext, this._searchText);
	    	cb();
	    	//home_globals.homePage.searchfolder(this._searchText);
	    }	
	    else
	    {	
	    	//home_globals.homePage.refreshfolder();	    	
	    	var cb = this._refreshCallback.bind(this._thisContext);
	    	cb();
	    }	
    }
};
//# sourceURL=search.js





