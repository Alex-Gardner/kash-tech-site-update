/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.3 $:

var ajaxDAO = {};
ajaxDAO.listShares = function(path)
{
	var uriExec = sformat("{1}/wfirs", applicationContext);
	var argument=
	{
		IBFS_service: "ibfs",		
		IBIVAL_returnmode: "XMLENFORCE",
		IBFS_action: "listShares",
		IBFS_path: path,
		IBFS_flatten: "false",
		IBFS_recursionDepth: "1"	
	 };	
	argument[IBI_random] = Math.floor(Math.random() * 100000);
	argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();
	
	return $.post(uriExec, argument);
};	

ajaxDAO.listUserGroup = function(url,searchString,searchRows,searchIndex,shareWith)
{
	return $.ajax({
	    type: "POST",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		url: url,
		data: {"searchPath":"*" + searchString + "*","searchRows": searchRows ,"searchIndex": searchIndex ,"shareWith": shareWith},		
		dataType: "json",	
	 }); 
};

//# sourceURL=ajaxDAO.js