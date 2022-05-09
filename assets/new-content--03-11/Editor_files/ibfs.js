/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.44 $:

/******************************************************************************
IBFS wrapper
******************************************************************************/
function Ibfs(webAppContext, sesAuthParm, sesAuthVal, options)
{
	var ibfsOptions = 
	{
		sesAuthParm:sesAuthParm,
		sesAuthVal:sesAuthVal,
		eNamespace:"ibfs",
		webAppName:"wfirs"//[IBX-39]
	};
	options = $.extend({}, ibfsOptions, options);

	WebApi.call(this, webAppContext, options);
	this._baseImagePath = this._defaultExInfo.appContext + "/resource/image/bid/";
}
var _p = Ibfs.prototype = new WebApi();
Ibfs.base = WebApi.prototype;

_p._getExInfo = function()
{
	var exInfo = Ibfs.base._getExInfo.call(this);

	//add default parms that must be present
	exInfo.parms["IBFS_service"] = "ibfs";
	exInfo.parms["IBIVAL_returnmode"] = "XMLENFORCE";
	exInfo.parms[exInfo.sesAuthParm] = exInfo.sesAuthVal;
	return exInfo;
};

_p.exec = function(options)
{
	//Manage default post processing options.
	options.ppFun = options.ppFun || Ibfs._ppGenericIbfsItems;
	options.ppPattern = options.ppPattern || "rootObject > children > item";
	var exInfo = Ibfs.base.exec.call(this, options);
	return exInfo;
};

_p._onBeforeSend = function(exInfo, xhr, settings) {
	Ibfs.base._onBeforeSend(exInfo, xhr, settings);
	exInfo.requestMonitor = new requestMonitor();
	exInfo.requestMonitor.monitorRequest(exInfo.xhr, exInfo.tStart);
	
};

//check to see if ibfs call succeeded...if base returns then there was an xhr error.
_p._errorCheck = function(xhr, res, exInfo)
{
	if(exInfo.requestMonitor) {
		exInfo.requestMonitor.stopMonitoringRequest();
	}
	var error = Ibfs.base._errorCheck(xhr, res, exInfo);
	//The base class only handles HTTP communication, so it will return an HTTP-related error.
	//That means if we get the error from the base class we can just bail out as there is no response body to process.
	//Otherwise, you really need to check the response for errors, even if HTTP 200 was returned and the base class
	//says there are no errors.
	if(error)
		return error;
	
	//only validate wfirs calls, and only look at xml answer sets...that is, not getContent string results, for example.
	if(exInfo.appName == "wfirs")
	{
		if(exInfo.ajax.dataType == "xml")
		{
			if(exInfo.eSuccess == Ibfs.DEFINES.EVENTS.SERVERINFO)
				return error;
			var rpc = $(res).find("ibfsrpc");
			var status = parseInt(rpc.attr("returncode"), 10);
			if(status != 10000)
			{
				var name = rpc.attr("returndesc");
				error = exInfo.error = new Error(sformat("{1} ({2})", name, status));
				error.name = name;
				error.code = status;
			}
		}
		/****
			EVENTUALLY PUT IN CHECKS FOR OTHER FORMATS LIKE JSON/HTML/ETC,
		or you could check for HTTP response headers and look for IBI_MessageXYZ with errors
		 var numberOfMessages = xhr.getResponseHeader("IBI_Messages");
		 if(numberOfMessages > 0)
		 {
		 	//the convention is that the error status is in the first message
		 	var firstMessage = xhr.getResponseHeader("IBI_Message1"); //Example, (IBFS1055)  Folder already exists... or (WFC1012) .... or (IBFS10000) success
		 	//Now parse the message string however you like.
		 }
		****/
	}
	
	return error;
};

_p._handleError = function(error, res, exInfo)
{
	if($(window).dispatchEvent(WebApi.genEventType(exInfo.eError, exInfo), exInfo) && exInfo.errorHandling)
	{
		var options = 
		{
			"resizable":true,
			"type":"std error",
			"caption":ibx.resourceMgr.getString("IDS_IBFS_ERROR_CAPTION"),
			"messageOptions":{text: sformat("{1} {2}", ibx.resourceMgr.getString("IDS_IBFS_ERROR_MESSAGE_OPTIONS"), error.name)},
			"buttons":"ok"
		};
		var info = ibx.resourceMgr.getResource(".ibfs-dlg-error", false);
		var dlg = $.ibi.ibxDialog.createMessageDialog(options).addClass("ibfs-error-dialog");
		dlg.ibxWidget("add", info.children()).resizable();
		ibx.bindElements(dlg[0]);
		widget = dlg.data("ibxWidget");
		widget._errDetails.ibxWidget("option", "text", this._getErrorDetails(error, exInfo));
		dlg.ibxWidget("open");
	}
};

_p._getErrorDetails = function(error, exInfo)
{
	var strMsg = error.message + ":\n  " + exInfo.ajax.url + "\n";
	var strParms = ibx.resourceMgr.getString("IDS_IBFS_ERROR_DETAILS_PARMS") + "\n";
	for(var parm in exInfo.parms)
		strParms = sformat("{1}  {2}: {3}\n", strParms, parm, exInfo.parms[parm]);
	var strDoc = ibx.resourceMgr.getString("IDS_IBFS_ERROR_DETAILS_RET_DOC") + "\n" + exInfo.xhr.responseText;
	var strErr = sformat("{1}\n{2}\n{3}", strMsg, strParms, strDoc);
	return strErr;
};

//Generic post processing function to retrieve items from ibfs response.
Ibfs._ppGenericIbfsItems = function _ppGenericIbfsItems(res, exInfo)
{
	var result = null;
	if(res instanceof XMLDocument)
	{
		var xDoc = $(res);
		if(!exInfo.asJSON)
			result = xDoc.find(exInfo.ppPattern);
		else
		{
			result = $();
			xDoc.find(exInfo.ppPattern).each(function(result, shallow, idx, item)
			{				
				var json = Ibfs.toJSON(item, shallow);
				result.push(json);
			}.bind(this, result, exInfo.asJSONShallow));
		}
	}
	else
		result = res;//in this case xDoc is something else...maybe JSON or HTML...or something else.
	return result;
};

Ibfs.ibfs = null;//Static load instance of ibfs.
Ibfs.loaded = null;
Ibfs.systemInfo = {initialized:false};
Ibfs.load = function (webAppContext, sesAuthParm, sesAuthVal, options)
{
	if(!Ibfs.loaded)
	{
		//if WFGlobals is included and no parms passed, just default to the usual values.
		var WFGlobals = window.WFGlobals || {};
		var applicationContext = window.applicationContext || null;
		webAppContext = webAppContext || applicationContext;
		sesAuthParm = sesAuthParm || WFGlobals.ses_auth_parm;
		sesAuthVal = sesAuthVal || WFGlobals.ses_auth_val;
		var ibfs = Ibfs.ibfs = new Ibfs(webAppContext, sesAuthParm, sesAuthVal, options);
		Ibfs.loaded = $.Deferred();
		ibfs.getSystemInfo({ibfsLoaded:Ibfs.loaded});
	}
	return Ibfs.loaded;
};

Ibfs.DEFINES = 
{
	IGNORE_JSON_ATTRS:
	{
		"_jt":true,
		"class":true,
		"index":true,
		"ordinal":true,
		"dummy":true,
		"applyTo":true,
	},
	NO_COERCE_JSON_ATTR:
	{
		"handle":true,
		"Category":true,
		"description":true,
		"summary":true,
		"name":true,
		"searchScore": true,
	},
	OWNER_TYPES:
	{
		PUBLIC:"P",
		USER:"U",
		GROUP:"G"
	},
	SUB_SYSTEM:
	{
		UNKNOWN:	"Unknown",
		PREVAL:		"Prevalidation",
		WFIRS:		"WFIRS",
		IBFS:		"IBFS",
		FDM:		"FDM",
		SPRING:		"Spring"
	},
	PARMS:
	{
		INTERNAL_PARENT_PATH:"INTERNAL_PARENT_PATH"
	},
	EVENTS:
	{
	},
	RETURN_CODES:
	{
		SUCCESS:"10000"
	},
	ITEM_TYPE_INFO:
	{
		/**** BUILT IN WEBFOCUS TYPES ****/
		"WebFOCUSComponent":{"bContainer":true, "strMask":"", "icon":"folder_closed_16.png", "iconSel":"folder_open_16.png", "extension":"", "glyph":"", "glyphClasses": "ibx-icons ds-icon-plus"},
		"MRFolder": { "bContainer": true, "strMask": "", "icon": "folder_closed_16.png", "iconSel": "folder_open_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-plus" },
		"ReposStructure": { "bContainer": true, "strMask": "", "icon": "folder_closed_16.png", "iconSel": "folder_open_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-plus" },
		"IBFSFolder": { "bContainer": true, "strMask": "", "icon": "folder_closed_16.png", "iconSel": "folder_open_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-plus" },
		"RecycleBin": { "bContainer": true, "strMask": "", "icon": "recycle_16.png", "iconSel": "recycle_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-plus" },
		"IBFSFile": { "bContainer": false, "strMask": "", "icon": "new_document_lined_16_h.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-unknown" },
		"MRRepository": { "bContainer": true, "strMask": "", "icon": "discovery_domain_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-plus" },
		"MyReportFolder": { "bContainer": true, "strMask": "", "icon": "myfolder_closed_16.png", "iconSel": "myfolder_open_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-plus" },
		"MemoryVirtualFolder": { "bContainer": true, "strMask": "", "icon": "folder_closed_16.png", "iconSel": "folder_open_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-plus" },
		"WEBFolder": { "bContainer": true, "strMask": "", "icon": "folder_closed_16.png", "iconSel": "folder_open_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-plus" },
		"EDANode": { "bContainer": true, "strMask": "", "icon": "reporting_server_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-plus" },
		"BipPortalsSubArea": { "bContainer": true, "strMask": "", "icon": "bip_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-plus" },
		"BipPortalsPortal": { "bContainer": false, "strMask": "", "icon": "portal_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-portal" },
		"BIPWFCPortalPageItem": { "bContainer": false, "strMask": "", "icon": "portal_pagev4_16.png", "extension": ".page", "glyph": "", "glyphClasses": "ibx-icons ds-icon-page" },
		"BIPWFCPortalItem": { "bContainer": false, "strMask": "", "icon": "portalv4_16.png", "extension": ".prtl", "glyph": "", "glyphClasses": "ibx-icons ds-icon-unknown" },
		"URLFile": { "bContainer": false, "strMask": "*.url", "icon": "url_16.png", "extension": "url", "glyph": "", "glyphClasses": "ibx-icons ds-icon-connected" },
		"ROFexFile": { "bContainer": false, "strMask": "*.fex", "icon": "reporting_objects_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ds-icon-reporting-object" },
		"DeferredOutput": { "bContainer": false, "strMask": "*.orw", "icon": "deferred_output_16.png", "extension": ".orw", "glyph": "", "glyphClasses": "ibx-icons ds-icon-deferred-output" },
		"CasterSchedule": { "bContainer": false, "strMask": "*.sch", "icon": "schedule_16.png", "extension": ".sch", "glyph": "", "glyphClasses": "ibx-icons ds-icon-schedule" },
		"CasterAccessList": { "bContainer": false, "strMask": "*.acl", "icon": "library_accesslist_16.png", "extension": ".acl", "glyph": "", "glyphClasses": "ibx-icons ds-icon-access-list" },
		"CasterDistributionList": { "bContainer": false, "strMask": "*.adr", "icon": "", "extension": ".adr", "glyph": "", "glyphClasses": "ibx-icons ds-icon-address-book" },
		"CasterLibrary": { "bContainer": false, "strMask": "*.lib", "icon": "library_16.png", "extension": ".lib", "glyph": "", "glyphClasses": "ibx-icons ds-icon-library" },
		"Group": { "bContainer": true, "strMask": "", "icon": "group_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-plus" },
		"User": { "bContainer": false, "strMask": "", "icon": "user_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-address-book" },
		"PermissionSet": { "bContainer": false, "icon": "permissionset_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-unknown" },
		"HtmlFile": { "bContainer": false, "icon": "html_16.png", "extension": ".htm", "glyph": "", "glyphClasses": "ibx-icons ds-icon-html" },
		"LinkItem": { "bContainer": false, "icon": "", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-shortcut" },
		"blog": { "bContainer": false, "icon": "annotation_restore.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-commented" },
		"PGXBundle": { "bContainer": false, "icon": "", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-page" },
		"PRTLXBundle": { "bContainer": false, "icon": "", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-portal" },
		"BIPWFCPortalItem": { "bContainer": false, "icon": "", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ds-icon-portal" },
		"StyFile": { "bContainer": false, "strMask": "*.sty", "icon": "", "extension": ".sty", "glyph": "", "glyphClasses": "ibx-icons ds-icon-sty" },
		"Property": { "bContainer": false, "strMask": "*.prop", "icon": "", "extension": ".prop", "glyph": "", "glyphClasses": "fa fa-cog" },
		"WhatIfFile": { "bContainer": false, "strMask": "*.wif", "icon": "", "extension": ".wif", "glyph": "", "glyphClasses": "ibx-icons ds-icon-what-if" },
		
		/**** FEX FILES ARE SPECIAL. See the '_ppdir' function to see how they are handled separately. ****/
		"FexFile": { "bContainer": false, "strMask": "*.fex", "icon": "new_document_lined_16_h.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ds-icon-document" },
		"FexEditor": { "bContainer": false, "strMask": "*.fex", "icon": "new_document_lined_16_h.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ds-icon-document" },
		"FexChart": { "bContainer": false, "strMask": "*.fex", "icon": "output_chart_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ds-icon-chart-bar" },
		"FexInsight": { "bContainer": false, "strMask": "*.fex", "icon": "enhanced_run_32.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ds-icon-tap" },
		"FexCompose": { "bContainer": false, "strMask": "*.fex", "icon": "document_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ds-icon-document" },
		"FexAlert": { "bContainer": false, "strMask": "*.fex", "icon": "alert_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ds-icon-document" },
		"FexInfoMini": { "bContainer": false, "strMask": "*.fex", "icon": "infomini_report_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ds-icon-document" },
		"FexDataVis": { "bContainer": false, "strMask": "*.fex", "icon": "ID_dashboard_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ds-icon-visualization-1" },
		"FexDataPrep": { "bContainer": false, "strMask": "*.fex", "icon": "data_extract_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ds-icon-document" },
		"fex": { "bContainer": false, "strMask": "*.fex", "icon": "new_document_lined_16_h.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ds-icon-document" },

		/**** STANDARD FILE TYPES ****/
		"mas": { "bContainer": false, "strMask": "*.mas", "icon": "master_16.png", "extension": ".mas", "glyph": "", "glyphClasses": "ibx-icons ds-icon-master" },
		"sty": { "bContainer": false, "strMask": "*.sty", "icon": "sty_16.png", "extension": ".sty", "glyph": "", "glyphClasses": "ibx-icons ds-icon-sty" },
		"jpg": { "bContainer": false, "strMask": "*.jpg", "icon": "jpeg_16.png", "extension": ".jpg", "glyph": "", "glyphClasses": "ibx-icons ds-icon-image" },
		"jpeg": { "bContainer": false, "strMask": "*.jpeg", "icon": "jpeg_16.png", "extension": ".jpeg", "glyph": "", "glyphClasses": "ibx-icons ds-icon-image" },
		"gif": { "bContainer": false, "strMask": "*.gif", "icon": "gif_16.png", "extension": ".gif", "glyph": "", "glyphClasses": "ibx-icons ds-icon-image" },
		"png": { "bContainer": false, "strMask": "*.png", "icon": "png_16.png", "extension": ".png", "glyph": "", "glyphClasses": "ibx-icons ds-icon-image" },
		"bmp": { "bContainer": false, "strMask": "*.bmp", "icon": "bmp_16.png", "extension": ".bmp", "glyph": "", "glyphClasses": "ibx-icons ds-icon-image" },
		"htm": { "bContainer": false, "strMask": "*.htm", "icon": "html_16.png", "extension": ".htm", "glyph": "", "glyphClasses": "ibx-icons ds-icon-html" },
		"html": { "bContainer": false, "strMask": "*.html", "icon": "html_16.png", "extension": ".html", "glyph": "", "glyphClasses": "ibx-icons ds-icon-html" },
		"pdf": { "bContainer": false, "strMask": "*.pdf", "icon": "format_pdf_16.png", "extension": ".pdf", "glyph": "", "glyphClasses": "ibx-icons ds-icon-pdf" },
		"acl": { "bContainer": false, "strMask": "*.acl", "icon": "library_accesslist_16.png", "extension": ".acl", "glyph": "", "glyphClasses": "ibx-icons ds-icon-access-list" },
		"adr": { "bContainer": false, "strMask": "*.adr", "icon": "distributionlist_16.png", "extension": ".adr", "glyph": "", "glyphClasses": "ibx-icons ds-icon-address-book" },
		"css": { "bContainer": false, "strMask": "*.css", "icon": "css_16.png", "extension": ".css", "glyph": "", "glyphClasses": "ibx-icons ds-icon-css" },
		"CssFile": { "bContainer": false, "strMask": "*.css", "icon": "css_16.png", "extension": ".css", "glyph": "", "glyphClasses": "ibx-icons ds-icon-css" },
		"wri": { "bContainer": false, "strMask": "*.wri", "icon": "mr_ex_wri.png", "extension": ".wri", "glyph": "", "glyphClasses": "ibx-icons ds-icon-unknown" },
		"xls": { "bContainer": false, "strMask": "*.xls", "icon": "format_excel_16.png", "extension": ".xls", "glyph": "", "glyphClasses": "ibx-icons ds-icon-excel" },
		"xlsx": { "bContainer": false, "strMask": "*.xlsx", "icon": "format_excel_16.png", "extension": ".xlsx", "glyph": "", "glyphClasses": "ibx-icons ds-icon-excel" },
		"doc": { "bContainer": false, "strMask": "*.doc", "icon": "word_16.png", "extension": ".doc", "glyph": "", "glyphClasses": "ibx-icons ds-icon-word" },
		"docx": { "bContainer": false, "strMask": "*.docx", "icon": "word_16.png", "extension": ".docx", "glyph": "", "glyphClasses": "ibx-icons ds-icon-word" },
		"ppt": { "bContainer": false, "strMask": "*.ppt", "icon": "format_ppt_16.png", "extension": ".ppt", "glyph": "", "glyphClasses": "ibx-icons ds-icon-powerpoint" },
		"pptx": { "bContainer": false, "strMask": "*.pptx", "icon": "format_ppt_16.png", "extension": ".pptx", "glyph": "", "glyphClasses": "ibx-icons ds-icon-powerpoint" },
		"svg": { "bContainer": false, "strMask": "*.svg", "icon": "svg_16.png", "extension": ".svg", "glyph": "", "glyphClasses": "ibx-icons ds-icon-image" },
		"xml": { "bContainer": false, "strMask": "*.xml", "icon": "format_xml_16.png", "extension": ".xml", "glyph": "", "glyphClasses": "ibx-icons ds-icon-xml" },
		"txt": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },
		"csv": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },
		"tab": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },
		"ftm": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },
		"ps": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },
		"wp": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },
		"wk1": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },
		"mht": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ds-icon-html" },
		"swf": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "fa fa-file-video-o" },		
		"xht": { "bContainer": false, "strMask": "*.xht", "icon": "format_excel_16.png", "extension": ".xht", "glyph": "", "glyphClasses": "ibx-icons ds-icon-excel" },
		"zip": { "bContainer": false, "strMask": "*.zip", "icon": "format_zip_16.png", "extension": ".zip", "glyph": "", "glyphClasses": "ibx-icons ds-icon-zip" },
		"ely": { "bContainer": false, "strMask": "*.ely", "icon": "format_ely_16.png", "extension": ".ely", "glyph": "", "glyphClasses": "ibx-icons ds-icon-ely" },
		"wif": { "bContainer": false, "strMask": "*.wif", "icon": "format_wif_16.png", "extension": ".wif", "glyph": "", "glyphClasses": "ibx-icons ds-icon-what-if" },
		"js": { "bContainer": false, "strMask": "*.js", "icon": "new_document_lined_16_h.png", "extension": ".js", "glyph": "", "glyphClasses": " ibx-icons ds-icon-file-text" },
		"py": { "bContainer": false, "strMask": "*.py", "icon": "new_document_lined_16_h.png", "extension": ".py", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },
		"r": { "bContainer": false, "strMask": "*.r", "icon": "new_document_lined_16_h.png", "extension": ".r", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },
		"prop": { "bContainer": false, "strMask": "*.prop", "icon": "new_document_lined_16_h.png", "extension": ".prop", "glyph": "", "glyphClasses": "fa fa-cog" },
		"foc": { "bContainer": false, "strMask": "*.foc", "icon": "new_document_lined_16_h.png", "extension": ".foc", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },
		"acx": { "bContainer": false, "strMask": "*.acx", "icon": "new_document_lined_16_h.png", "extension": ".acx", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },
		"dat": { "bContainer": false, "strMask": "*.dat", "icon": "new_document_lined_16_h.png", "extension": ".dat", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },
		"sql": { "bContainer": false, "strMask": "*.sql", "icon": "new_document_lined_16_h.png", "extension": ".sql", "glyph": "", "glyphClasses": "ibx-icons ds-icon-file-text" },

		/**** DEFAULT UNKNOWN FILE TYPE ****/
		"unknownType": { "bContainer": false, "strMask": "", "icon": "new_document_lined_16_h.png", "extension": "*", "glyph": "", "glyphClasses": "ibx-icons ds-icon-unknown" }
	}
};

Ibfs.isWFCPath = function(path)
{
	return (-1 != path.search(/IBFS:\/WFC/i) || -1 != path.search(/IBFS:\/BIP/i));
};

Ibfs.decodePolicy = function(base64Policy)
{
	var opInfo = Ibfs.systemInfo.roleInfo.operations;
	base64Policy = base64Policy || "";
	var retPolicy = {};
	for(var op in opInfo)
	{
		var char64 = base64Policy.charCodeAt(opInfo[op].byteOffset);
		var nbyte = 0;
		if(47 < char64 && char64 < 58)
			nbyte = (char64 + 4);
		else if(64 < char64 && char64 < 91)
			nbyte = (char64 - 65);
		else if(96 < char64 && char64 < 123)
			nbyte = (char64 - 71);
		else if(43 == char64)
			nbyte = 62;
		else if(47 == char64)
			nbyte = 63;
		retPolicy[op] = ((opInfo[op].bitMask & nbyte) != 0);
	}
	return retPolicy;
};

Ibfs.coerceAttVal = function(key, val)
{
	var retVal = val || "";
	if(Ibfs.DEFINES.NO_COERCE_JSON_ATTR[key] !== undefined)//moved this here so it's centralized.
		retVal = retVal;
	else
	if(retVal == "true" || retVal == "false")
		retVal = (retVal == "true");
	else
	if(retVal != "" && $.isNumeric(retVal))
		retVal = parseInt(retVal, 10);
	return retVal;
};

Ibfs.getProperties = function getProperties(xItem)
{
	var item = $(xItem);
	var props = {};
	item.children("properties").children("entry").each(function(props, idx, prop)
	{
		var key = prop.getAttribute("key");
		props[key] = Ibfs.coerceAttVal(key, prop.getAttribute("value"));
	}.bind(this, props));

	props.extended = {};
	item.find("extendedProperties entry").each(function(props, idx, prop)
	{
		var key = prop.getAttribute("key");
		props.extended[key] = Ibfs.coerceAttVal(key, prop.getAttribute("value"));
	}.bind(this, props));

	props.fexParameters = [];
	item.find("fexParameters item").each(function(props, idx, items)
	{
		var fexParameter = Ibfs.toJSON(items, true);		
		fexParameter.item = Ibfs.toJSON($(items).find("item > amperVar")[0], true);
		props.fexParameters.push(fexParameter);
		
	}.bind(this, props));

	return props;
};

Ibfs.toJSON = function(xItem, bShallow)
{
	var json = {};
	xItem = (xItem instanceof jQuery) ? xItem[0] : xItem;
	if(!xItem)
		return json;

	var item = $(xItem);
	//Serialize the xItem itself...and save the raw xml node too.
	$.each(xItem.attributes, function(item, i, attr)
	{
		var name = attr.name;
		if(Ibfs.DEFINES.IGNORE_JSON_ATTRS[name])
			return;
		else
		if(name == "policy")
			json[name] = Ibfs.decodePolicy(attr.value);
		else
		if(name == "lastAnnotatingUser")
			json[name] = "IBFS:/SSYS/USERS/" + attr.value;
		else
			json[name] = Ibfs.coerceAttVal(name, attr.value);

		if(name == "fullPath")
		{
			json.parentPath = json.fullPath.substring(0, json.fullPath.lastIndexOf("/")) + "/";
			json["isMyContent"] = (name.search("~") != -1);
		}
	}.bind(this, item));

	//shallow will only do the node.
	if(bShallow)
		return json;

	var clientInfo = json.clientInfo = {};
	clientInfo.xItem = xItem;

	//Add properties, if any.
	var oProps = clientInfo["properties"] = Ibfs.getProperties(xItem);

	//Add file type information, if any (fex types are turned into their specific type).
	//When item is a link...swap its type LinkItem for the type it's linked to...HACK!
	var strType = this._pFindType(json, oProps, clientInfo);	
	if(strType == "RecycleBag")
		strType =  item.find("entry[key='OriginalObjectType']").attr("value");
	else
	if(strType == "PGXBundle")//BIG HACK...CHANGING INTERNAL TYPE...BAD IDEA!
		item.attr("container", false);

	//save the now decoded proper type for the item (what kind of fex is it?)
	clientInfo.type = strType;
	clientInfo.typeInfo = Ibfs.DEFINES.ITEM_TYPE_INFO[strType];

	//[HOME-708] portal pages can have abreviated names (alias)
	clientInfo.alias = item.find("wfbipAlias item").attr("wfbipAliasId");

	//Add all the children recursively if item is a container.
	if(json.container)
	{
		json["children"] = [];
		var childItems = item.children("children").children("item").each(function(json, bShallow, idx, item)
		{
			var child = Ibfs.toJSON(item, bShallow);
			child.clientInfo.parentItem = json;
			child.clientInfo.listPath = json.fullPath;
			json.children.push(child);
		}.bind(this, json, bShallow));
	}

	//Add status, if any.
	json["status"] = item.find("status").attr("name");

	//Add groups, if any.
	var groups = json["groups"] = {};
	item.find("groups > item").each(function(groups, idx, item)
	{
		groups["fullPath"] = Ibfs.toJSON(item);
	}.bind(this, groups));


	//If we have a permission set, then stitch the default list of all operations with the ones this set has currently turned on.
	var operations = json["operations"] = {};
	var pset = item.find("pSet");
	json["shipped"] =  Ibfs.coerceAttVal("shipped", pset.attr("shipped"));
	json["compLvl"] =  Ibfs.coerceAttVal("compLvl", pset.attr("compLvl"));
	json["externalType"] = Ibfs.coerceAttVal("externalType", pset.attr("externalType"));
	pset.find("policy > entry").each(function(operations, idx, entry)
	{
		var tempOps = {};
		var arPset = xItem.querySelectorAll("policy > entry");
		for(var i = 0; i < arPset.length; ++i)
		{
			var pset = $(arPset[i]);
			var key = pset.find("key > [name]").value;
			var value = pset.find("value > [name]").value;
			tempOps[key] = Ibfs.coerceAttVal(key, value);
		}

		var sysOps = Ibfs.systemInfo.roleInfo.operations;
		for(var op in sysOps)
		{
			var op = sysOps[op];
			operations[op.name] = tempOps[op.name] ? tempOps[op.name] : "NOT_SET";
		}
	}.bind(this, operations));

	var subsystems = json["subsystems"] = {};
	var subSysItems = item.find("subsysList item");
	if(subSysItems.length)
	{
		subSysItems.each(function(subsystems, idx, subsys)
		{
			var name = subsys.getAttribute("name").value;
			subsystems[name] = Ibfs.systemInfo.subsystemInfo[name];
		}.bind(this, subsystems));
	}
	else
	if(Ibfs.systemInfo.subsystemInfo)
		subsystems["*"] = Ibfs.systemInfo.subsystemInfo["*"];

	//Add the UDR information, if any.
	var udRoles = json["udRoles"] = {};
	item.find("pSetList item").each(function(udRoles, idx, pset)
	{
		udRoles[pset.getAttribute("value")] = "SELECTED";
	}.bind(this, udRoles));

	json["verb"] = item.find("verb[name]").attr("value");
	json["applyTo"] = item.find("applyTo").attr("name");

	//Get Report Caster Information.
	json["casterInfo"] = Ibfs.toJSON(item.find("casterObject")[0]);

	//Add content, if any
	var content = item.find("content");
	var decode_text = window.atob(content.text());
	try {
		decode_text = decodeURIComponent(escape(decode_text));
	} catch (e) {}

	json["content"] = {"charSet":content.attr("char_set"), "Base64":content.text(), "decoded":decode_text};

	return json;
};

Ibfs.DEFINES.EVENTS.GOT_SYSTEM_INFO = "system_info_loaded";
_p.getSystemInfo = function(options, bRefresh)
{
	if(Ibfs.systemInfo.initialized && !bRefresh)
		return Ibfs.systemInfo;
	else
	{
		var parms = {"IBFS_action":"getSystemInfoEx"};
		options = WebApi.genExecOptions(parms, null, null, options);
		options.eSuccess = Ibfs.DEFINES.EVENTS.GOT_SYSTEM_INFO;
		options.ppFun = options.ppFun || this._ppgetSystemInfo;
		return this.exec(options);
	}
};
_p._ppgetSystemInfo = function(res, exInfo)
{
	var oReturn = {};
	var xDoc = $(res);
	
	oReturn.general = Ibfs.toJSON(res.querySelector("rootObject"), true);
	oReturn.currentUser = Ibfs.toJSON(res.querySelector("currentUser"));

	oReturn.installOptions = {};
	xDoc.find("installOptions > item").each(function(json, idx, item)
	{
		json.installOptions[item.getAttribute("name")] = {"featureCode":Ibfs.coerceAttVal("featureCode", item.getAttribute("featureCode")), "value":Ibfs.coerceAttVal("value", item.getAttribute("value"))};
		
	}.bind(this, oReturn));

	oReturn.enabledLanguages = {};
	xDoc.find("enabledLanguages > item").each(function(json, idx, item)
	{
		json.enabledLanguages[item.getAttribute("name")] = {"language":item.getAttribute("name2"), "description":item.getAttribute("description")};
		
	}.bind(this, oReturn));

	oReturn.subsystemInfo = {"*":{"name":"ALL", "subsysName":"ALL", "subsysDesc":"All", "canHaveSpecificRoles":false}};
	xDoc.find("subsystems > item").each(function(json, idx, item)
	{
		var name = item.getAttribute("name");
		var sso = json.subsystemInfo[name] = Ibfs.toJSON(item, true);
		sso["name"] = name;
		sso["pathValidationInfo"] = Ibfs.toJSON(item.querySelector("pvi"), true);

		var xtraItem = item.querySelector("extraInfo");
		sso["contentType"] = Ibfs.coerceAttVal("contentType", xtraItem.getAttribute("contentType"));
		sso["canHaveSpecificRoles"] = Ibfs.coerceAttVal("canHaveSpecificRoles", xtraItem.getAttribute("canHaveSpecificRoles"));
		sso["allowScmOperation"] = Ibfs.coerceAttVal("allowoScmOperation", xtraItem.getAttribute("allowScmOperation"));
	}.bind(this, oReturn));

	oReturn.seatInfo = {};
	xDoc.find("seatList > item").each(function(json, idx, item)
	{
		oReturn.seatInfo[item.getAttribute("seatCode")] = Ibfs.toJSON(item, true);
	}.bind(this, oReturn));


	oReturn.roleInfo = {"verbs":{}, "groups":{}, "operations":{}};
	xDoc.find("verbs > item").each(function(json, idx, item)
	{
		var name = item.getAttribute("name");
		json.roleInfo.verbs[name] = {"displayName":item.getAttribute("strName"), "value":name};
	}.bind(this, oReturn));
	
	xDoc.find("opGroups > item").each(function(json, idx, item)
	{
		json.roleInfo.groups[item.getAttribute("name")] = Ibfs.toJSON(item, true);
	}.bind(this, oReturn));

	xDoc.find("operations > item").each(function(json, idx, item)
	{
		var $item = $(item);
		var opItem = json.roleInfo.operations[$item.attr("name")] = Ibfs.toJSON(item, true);

		//initialize the base64 decoding information for the item policies.
		var bitMask = 0;
		switch(parseInt($item.attr("ordinal"), 10) % 6)
		{
			case 0 :bitMask = 32;break;  // 2 ^ 5
			case 1 :bitMask = 16;break;  // 2 ^ 4
			case 2 :bitMask = 8;break;   // 2 ^ 3
			case 3 :bitMask = 4;break;   // 2 ^ 2
			case 4 :bitMask = 2;break;   // 2 ^ 1
			case 5 :bitMask = 1;break;   // 2 ^ 0
			default:bitMask = 0;
		}
		opItem["byteOffset"] = Math.floor(idx/6);
		opItem["bitMask"] = bitMask;

		opItem.groups = {};
		$item.find("groups > item").each(function(json, opItem, idx, item)
		{
			var name = item.getAttribute("name");
			opItem.groups[name] = json.roleInfo.groups[name];
		}.bind(this, json, opItem));

		var ssDisplayName = "";
		opItem.subsystems = {};
		var $subSystems = $item.find("subsysList > item").each(function(json, opItem, idx, item)
		{
			var name = item.getAttribute("name");
			var subSys = json.subsystemInfo[name];
			opItem.subsystems[name] = subSys;
			ssDisplayName += subSys.subsysDesc + ", ";
		}.bind(this, json, opItem));

		if(!$subSystems.length)
		{
			opItem.subsystems["*"] = json.subsystemInfo["*"];//No subsystems listed means applies to all - '*'
			ssDisplayName = "*";
		}
		opItem.subsystemsDisplayName = ssDisplayName;
	}.bind(this, oReturn));

	oReturn.cmdActions = {};
	xDoc.find("menuActions > item").each(function(json, idx, item)
	{
		item = $(item);
		var name = item.attr("name");
		json.cmdActions[name] = {"bitMask":Ibfs.coerceAttVal("bitMask", item.attr("bitMask")), "byteOffset":Ibfs.coerceAttVal("byteOffset", item.attr("byteOffset"))};
	}.bind(this, oReturn));

	oReturn.initialized = true;
	Ibfs.systemInfo = oReturn;
	if(exInfo.ibfsLoaded)
		exInfo.ibfsLoaded.resolve(this);
	return Ibfs.systemInfo;
};

Ibfs.DEFINES.EVENTS.LOGIN = "login";
_p.login = function(user, password, forceSignon, urlRedirect, options)
{
	var parms = {"IBIB_userid":user, "IBIB_password":password, "IBIB_force_signon":!!forceSignon, "webfocus-security-direct-response":true, "webfocus-security-redirect":urlRedirect};
	options = WebApi.genExecOptions(parms, null, null, options);
	options.appName = "service/wf_security_check.jsp";
	options.eSuccess = Ibfs.DEFINES.EVENTS.LOGIN;
	options.ppFun = options.ppFun || this._pplogin.bind(this);
	return this.exec(options);
};
_p._pplogin = function(res, exInfo)
{
	var result = $(res).find("result");
	var res = {};
	$.each(result[0].attributes, function(res, idx, attr)
	{
		res[attr.nodeName] = attr.value;
	}.bind(this, res));
	this.setExOptions({sesAuthParm:res.CSRFTokenName, sesAuthVal:res.CSRFTokenValue});
	return res;
};

Ibfs.DEFINES.EVENTS.LOGOUT = "logout";
_p.logout = function(urlRedirect, options)
{
	var parms = {"webfocus-security-direct-response":true, "webfocus-security-redirect":urlRedirect};
	options = WebApi.genExecOptions(parms, null, null, options);
	options.appName = "service/wf_security_logout.jsp";
	options.eSuccess = Ibfs.DEFINES.EVENTS.LOGOUT;
	options.ppFun = options.ppFun || this._pplogout.bind(this);
	return this.exec(options);
};
_p._pplogout = function(res, exInfo)
{
	var result = $(res).find("result");
	var res = {};
	$.each(result[0].attributes, function(res, idx, attr)
	{
		res[attr.nodeName] = attr.value;
	}.bind(this, res));
	return res;
};

Ibfs.DEFINES.EVENTS.GOT_ITEM_INFO = "item_info_loaded";
_p.getItemInfo = function(strSrcPath, withContent, options)
{
	var parms = {"IBFS_action": withContent ? "get" : "properties", "IBFS_path":strSrcPath};
	options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.GOT_ITEM_INFO;
	options.ppFun = options.ppFun || this._ppgetItemInfo;
	options.ppPattern = options.ppPattern || "rootObject";
	return this.exec(options);
};

_p.putFolderPropertiesIBFS = function(strSrcPath, folderObject, options)
{
	var parms = {"IBFS_action": "put", "IBFS_path":strSrcPath, "IBFS_object":folderObject, "IBFS_replace":true};
	options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.GOT_ITEM_INFO;
	options.ppFun = options.ppFun || this._pputFolderProperties;
	options.ppPattern = options.ppPattern || "rootObject";
	return this.exec(options);
};

_p.updateDescIfChanged = function(strSrcPath, rootObject, newDesc)
{
	if(rootObject === undefined)
		return $.Deferred().resolve(rootObject);
	var oldDesc = rootObject.getAttribute('description');
	if(oldDesc == newDesc) 
  		return $.Deferred().resolve(rootObject);
	rootObject.setAttribute('description', newDesc); 
	var nlsValues = rootObject.getElementsByTagName('nlsValues');
	if(nlsValues[0])
	{

		var nlsValues = nlsValues[0].getElementsByTagName('value');
		var len = nlsValues.length;
		for (var i = 0; i < len; i++) {
		
	 		var nlsValue = nlsValues[i];
	  		var valueNode = nlsValue.getElementsByTagName('item')[0];
	  		var curValue = valueNode.getAttribute('value');
	  		if(curValue == oldDesc)
				valueNode.setAttribute('value', newDesc);  
		}
	}
	return this.putFolderPropertiesIBFS(strSrcPath, rootObject.outerHTML, {async:true});
}

_p._ppgetItemInfo = function(res, exInfo)
{
	var ret = Ibfs._ppGenericIbfsItems(res, exInfo);
	return ret[0];
};

Ibfs.DEFINES.EVENTS.LIST_ITEMS = "list_items";
_p.listItems = function(strPath, depth, flatten, options)
{
	//overload so you can just pass the path if you want.
	if(depth instanceof Object)
	{
		options = depth;
		depth = 1;
	}

	var parms = 
	{
		"IBFS_action":"list",
		"IBFS_path":strPath,
		"IBFS_flatten": flatten || "false",
		"IBFS_recursionDepth": depth || "1",
		"IBFS_options":""
	};
	options = WebApi.genExecOptions(parms, null, null, options);
	options.clientSort = (options.clientSort === undefined) ? false : options.clientSort;
	options.clientSortDescending = (options.clientSortDescending === undefined) ? false : options.clientSortDescending;
	options.clientSortAttr = options.clientSortAttr || "description";
	options.eSuccess = Ibfs.DEFINES.EVENTS.LIST_ITEMS;
	options.ppFun = options.ppFun || this._pplistItems;
	options.ppPattern = "rootObject > item";
	return this.exec(options);
};
_p._pplistItems = function(res, exInfo)
{
	var result = Ibfs._ppGenericIbfsItems(res, exInfo);
	if(exInfo.clientSort)
	{
		result.sort(function(exInfo, item1, item2)
		{
			var ascending = !exInfo.clientSortDescending;
			var attr1 = (exInfo.asJSON ? item1[exInfo.clientSortAttr || "name"] : $(item1).attr(exInfo.clientSortAttr || "name"));
			var attr2 = (exInfo.asJSON ? item2[exInfo.clientSortAttr || "name"] : $(item2).attr(exInfo.clientSortAttr || "name"));
			attr1.toLowerCase();
			attr2.toLowerCase();

			if(attr1 < attr2)
				return  ascending ? -1 : 1;
			else
			if(attr1 > attr2)
				return ascending ? 1 : -1;
			return 0;
		}.bind(this, exInfo));
	}

	return result;
};

Ibfs.DEFINES.EVENTS.SEARCH_DIM_IDX	= "SEARCH_DIMENSIONAL_INDEX";
_p.searchDimensionalIndex = function(pattern, options)
{
	options = options || {};
	var parms = 
	{
		"IBFS_service":"search",
		"IBFS_action":"searchDimensionIndex",
		"IBFS_format": options.asJSON ? "json" : "xml",
		"IBFS_fieldlist": options.fieldList || "All",
		"IBFS_sort": options.sort || "SCORE",
		"IBFS_filterQuery": options.filterQuery || "",
		"IBFS_searchSelectivity": options.searchSelectivity || "AllHits", //AllHits, BestHit, BestHitEachDim, 
		"IBFS_searchQuery": pattern,
	};
	options.dataType = options.asJSON ? "json" : "xml";
	options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.SEARCH_DIM_IDX;
	options.ppFun = options.ppFun || this._ppsearchDimensionalIndex;
	options.ppPattern = "rootObject > item";
	return this.exec(options);
};
_p._ppsearchDimensionalIndex = function(res, exInfo)
{
	var result = Ibfs._ppGenericIbfsItems(res, exInfo);
	if(exInfo.asJSON)
		result = result.query_result_object;
	return result;
};

Ibfs.DEFINES.EVENTS.SEARCH_DIM_INFO = "SEARCH_DIMENSIONAL_INFORMATION";
_p.searchDimensionalInformation = function(pattern, options)
{
	options = options || {};
	var parms = 
	{
		"IBFS_service":"search",
		"IBFS_action":"searchDimensionInformation",
		"IBFS_format": "xml",
		"IBFS_fieldlist": options.fieldList || "All", //Type,Display,Send,etc,
		"IBFS_sort": options.sort || "SCORE",
		"IBFS_filterQuery": options.filterQuery || "",
		"IBFS_searchSelectivity": options.searchSelectivity || "AllHits", //AllHits, BestHit, BestHitEachDim, 
		"IBFS_searchQuery": pattern,
		"IBFS_magRowType": options.rowType || "DimData",
	};

	options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.SEARCH_DIM_IDX;
	options.ppFun = options.ppFun || this._ppsearchDimensionalInformation;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.SEARCH_RESP_DESC = "SEARCH_REPOSITORY_DESCRIPTION";
_p.searchRepositoryDesc = function(pattern, options)
{
	options = options || {};
	var parms = 
	{
		"IBFS_action":"searchRepositoryDesc",
		"IBFS_cssIdentifier":"wf-highlightquery",
		"IBFS_searchQuery": pattern,
		"IBFS_format": "xml",
		"IBFS_sort": "__null",
		"IBFS_descriptionFields": "*",
		"IBFS_domainsFilter": "",	
		"IBFS_bundleContent": "false",
		"IBFS_excludeExt": "*.man",
		"IBFS_args":	"__null",
		"IBFS_service":"search",
	};

	if(options && options.IBFS_domainsFilter)
		parms.IBFS_domainsFilter = options.IBFS_domainsFilter;
	
	options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.SEARCH_RESP_DESC;
	options.ppFun = options.ppFun || this._ppsearchRepositoryDesc;
	return this.exec(options);
};

_p._ppsearchRepositoryDesc = function(res, exInfo)
{
	var result = [];
	if(exInfo.ajax.dataType == "xml")
	{	
		var xDoc = $(res);
		xDoc.find("rootObject > item").each(function(result, idx, item)
		{
			item = $(item);
			var jItem = Ibfs.toJSON(item[0], false);
			result.push(jItem);
			jItem.fexParameters = [];
			item.find("fexParameters > item").each(function(fexParameters, idx, item)
			{
				var fexParameter = Ibfs.toJSON(item, true);
				fexParameter.item = Ibfs.toJSON($(item).find("item > amperVar")[0], true);
				fexParameters.push(fexParameter);
			}.bind(this, jItem.fexParameters));
			jItem.properties = {};
			item.find("properties > entry").each(function(props, idx, prop)
			{
				prop = $(prop);							
				props[prop.attr("key")] = prop.attr("value");
			}.bind(this, jItem.properties));
			jItem.searchResults = [];
			item.find("searchResultList > resultList > item").each(function(searchResults, idx, item)
			{
				searchResult = Ibfs.toJSON(item, true);
				searchResults.push(searchResult);
			}.bind(this, jItem.searchResults));
			
		}.bind(this, result));
		return result;
	}	
};

Ibfs.DEFINES.EVENTS.SEARCH_DIM_INFO = "SEARCH_DOMAIN_INDEX";
_p.searchDomainIndexes = function(pattern, options)
{
	options = options || {};
	var parms = 
	{
		"IBFS_service":"search",
		"IBFS_action":"searchDomainIndexs",
		"IBFS_magRowType": options.rowType || "WFCDesc",
		"IBFS_startingIndex": options.startingIndex || "0", 
		"IBFS_operations": options.ibfsOperations || "opRun",
		"IBFS_maxCount": options.maxCount || "-1",		
		"IBFS_domainsFilter": options.domainsFilter || "",  
		"IBFS_searchQuery": pattern,
		"IBFS_filterQuery": options.filterQuery || "",		
	};

	options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.SEARCH_DIM_INFO;
	options.ppFun = options.ppFun || this._ppsearchDomainInformation;
	return this.exec(options);
};
Ibfs._pFindType = function(jItem, oProps, clientInfo)
{
	var strType;
	if(jItem.type == "WEBFile" || jItem.type == "IBFSFile")
	{
		if(jItem.name)
		{
			if(!jItem.extension)
			{	
				var exts = jItem.name.split(".");
				if(exts.length > 0)	
				{	
					jItem.extension = exts[exts.length-1].toLowerCase();
					strType = jItem.extension;
				}	
				else
					strType = jItem.type;
			}
			else
				strType = jItem.extension;
		}	
	}	
	else		
		strType = jItem.type;
	
	if(strType == "LinkItem")
	{
		clientInfo.isLink = true;
		clientInfo.typeInfoLink = Ibfs.DEFINES.ITEM_TYPE_INFO["LinkItem"];
		strType = clientInfo.properties.LinkToObjType;
		if(strType == "IBFSFile" && jItem.extension)strType = jItem.extension;
	}
	if(strType == "FexFile" && oProps.tool)
	{
		if (oProps.EnhancedRun && oProps.EnhancedRun == "on")
			strType = "FexInsight";
		else
		if(oProps.tool.indexOf("infoMiniEnable") != -1)
			strType = "FexInfoMini";
		else
		if(oProps.tool.indexOf("chart") != -1)
			strType = "FexChart";
		else
		if(oProps.tool.indexOf("compose") != -1)
			strType = "FexCompose";
		else
		if(oProps.tool.indexOf("alert") != -1)
			strType = "FexAlert";
		else
		if(oProps.tool.indexOf("editor") != -1)
			strType = "FexEditor";
		else
		if(oProps.tool.indexOf("DataVis") != -1)
			strType = "FexDataVis";
		else
		if(oProps.tool.indexOf("DataPrep") != -1)
			strType = "FexDataPrep";
	}	
	return strType;
};


_p._ppsearchDomainInformation = function(res, exInfo)
{
	var result = [];
	if(exInfo.ajax.dataType == "xml")
	{	
		var xDoc = $(res);
		xDoc.find("rootObject > item").each(function(result, idx, item)
		{
			item = $(item);
			var jItem = Ibfs.toJSON(item[0], true);
			result.push(jItem);
			jItem.fexParameters = [];
			item.find("fexParameters > item").each(function(fexParameters, idx, item)
			{
				var fexParameter = Ibfs.toJSON(item, true);
				fexParameter.item = Ibfs.toJSON($(item).find("item > amperVar")[0], true);
				fexParameters.push(fexParameter);
			}.bind(this, jItem.fexParameters));
			jItem.properties = {};
			item.find("properties > entry").each(function(props, idx, prop)
			{
				prop = $(prop);							
				props[prop.attr("key")] = prop.attr("value");
			}.bind(this, jItem.properties));
			jItem.searchResults = [];
			item.find("searchResultList > resultList > item").each(function(searchResults, idx, item)
			{
				searchResult = Ibfs.toJSON(item, true);
				searchResults.push(searchResult);
			}.bind(this, jItem.searchResults));
			
		}.bind(this, result));
		return result;
	}	
};
_p._ppsearchDimensionalInformation = function(res, exInfo)
{
	if(exInfo.ajax.dataType == "xml" && exInfo.asJSON)
	{
		var result = [];
		var xDoc = $(res);
		xDoc.find("rootObject > item").each(function(result, idx, item)
		{
			item = $(item);
			var jItem = Ibfs.toJSON(item[0], true);
			result.push(jItem);
			jItem.children = [];
			item.find("children > item").each(function(children, idx, item)
			{
				var child = Ibfs.toJSON(item, true);
				child.dimInfo = Ibfs.toJSON($(item).find("dimensionsUsed > item")[0], true);
				children.push(child);
			}.bind(this, jItem.children));

			jItem.properties = {};
			item.find("properties > entry").each(function(props, idx, prop)
			{
				prop = $(prop);
				props[prop.attr("key")] = prop.attr("value");
			}.bind(this, jItem.properties));

			jItem.fexParameters = {};
			item.find("fexParameters > item").each(function(fexParms, idx, parm)
			{
				parm = $(parm);
				var parmInfo = fexParms[parm.attr("parmname")] = Ibfs.toJSON(parm[0], true);

				var amper = parm.children("amperVar");
				$.extend(parmInfo, Ibfs.toJSON(amper[0], true));

				parmInfo.type = amper.children("type").attr("name");
				parmInfo.displayType = amper.children("displayType").attr("name");
				parmInfo.dynamicValues = Ibfs.toJSON(amper.children("dynValues"), true);
				parmInfo.defaultValues = [];
				amper.find("defValues item").each(function(defValues, idx, item)
				{
					defValues.push(item.getAttribute("value"));
				}.bind(this, parmInfo.defaultValues));
				parmInfo.values = {};
				amper.find("values entry").each(function(values, idx, item)
				{
					item = $(item);
					values[item.find("key").attr("value")] = item.find("value").attr("value");
				}.bind(this, parmInfo.values));
				parmInfo.parameters = {};
				amper.find("parameters entry").each(function(parms, idx, item)
				{
					item = $(item);
					parms[item.find("key").attr("value")] = item.find("value").attr("value");
				}.bind(this, parmInfo.parameters));

			}.bind(this, jItem.fexParameters));		
			
			var clientInfo = jItem.clientInfo = {};
			var strType = Ibfs._pFindType(jItem, jItem.properties, clientInfo);			
			if(strType == "RecycleBag")
				strType =  item.find("entry[key='OriginalObjectType']").attr("value");
			else
			if(strType == "PGXBundle")//BIG HACK...CHANGING INTERNAL TYPE...BAD IDEA!
				item.attr("container", false);
			
			//save the now decoded proper type for the item (what kind of fex is it?)			
			clientInfo.type = strType;
			clientInfo.typeInfo = Ibfs.DEFINES.ITEM_TYPE_INFO[strType];
			
			
		}.bind(this, result));
	}
	else
		result = Ibfs._ppGenericIbfsItems(res, exInfo);
	return result;
};


/****
	[IBX-48] This is really a utility function that will take a context path and locate the 'nearest' writable
****/
Ibfs.DEFINES.EVENTS.FIND_FOLDER_TO_CREATE_IN = "FIND_FOLDER_TO_CREATE_IN";
_p.findFolderToCreateIn = function findFolderToCreateIn(strCtxPath, strRootPath, options)
{
	var parms =
	{
		"IBFS_action": "findFolderToCreateIn",
		"IBFS_path": strCtxPath,
		"IBFS_topPath": strRootPath,
		"IBFS_args": ""
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.FIND_FOLDER_TO_CREATE_IN;
	options.ppPattern = "rootObject";
	return this.exec(options);
};
Ibfs.DEFINES.EVENTS.ADHOC_FEX = "adhoc_fex";
_p.adhocFex = function adhocFex(strPath, bFexContent, nodeName, options)
{
	var parms =
	{
		"IBFS_action": "runAdHocFex",
		"IBFS_path": strPath,
		"IBFS_fexContent": bFexContent,
		"IBFS_nodeName": nodeName
	};
	options = WebApi.genExecOptions(parms, null, null, options);
	//options.dataType = "text";
	options.eSuccess = Ibfs.DEFINES.EVENTS.ADHOC_FEX;
	options.ppFun = options.ppFun || this._ppadhocFex;
	return this.exec(options);
};
_p._ppadhocFex = function(xDoc, exInfo)
{	
	return xDoc;
};

Ibfs.DEFINES.EVENTS.DESCRIBE_FEX = "describe_fex";
_p.describeFex = function describeFex(strPath, doubleAmperMap, bVerbose, options)
{
	const doubleAmperEntry = doubleAmperMap ? 
	`<entry><key _jt="string" value="WFDescribe_userDefValues"/>
		<value _jt="HashMap" loadFactor="0.75" threshold="12">
			${doubleAmperMap.reduce((acc, entry) => 
				acc.concat(`
				<entry>
					<key _jt="string" value="${entry.amperName}"/>
					<value _jt="array" itemsClass="string" size="1">
						<item _jt="string" index="0" value="&amp;&amp;${entry.doubleAmperName}"/>
					</value>
				</entry>`)
			, "")}
		</value>
	</entry>`
	: "";

	const object = `
	<rootObject _jt='HashMap'>
		${!bVerbose ? 
			`
			<entry>
			<key _jt='string' value='WFDescribe_getValues'/>
			<value _jt='string' value='__noChainData__'/>
			</entry>
			`
			: ''
		}
		${doubleAmperEntry}
	</rootObject>`;

	const parms =
	{
		"IBFS_action": "describeFex",
		"IBFS_path": strPath,
		"IBFS_args": object,
		"IBFS_responseFormat": "REDUCED",
	};

	options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.DESCRIBE_FEX;
	options.ppFun = options.ppFun || this._ppdescribeFex;
	return this.exec(options);
};
_p._ppdescribeFex = function(xDoc, exInfo)
{
	return xDoc;
};

Ibfs.DEFINES.EVENTS.GET_GLOBAL_AMPER_VALUE = "get_global_amper_value";
_p.getGlobalAmperValue = function getGlobalAmperValue(varName, operation, nodeName, bVerbose, options)
{
	var parms =
	{
		"IBFS_action": "getGlobalAmperValue",
		"IBFS_varName": varName,
		"IBFS_operation": operation,
		"IBFS_nodeName": nodeName,
		"IBFS_service": "utils",
	};

	options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.GET_GLOBAL_AMPER_VALUE;
	options.ppFun = options.ppFun || this._ppgetGlobalAmperValue;
	return this.exec(options);
};
_p._ppgetGlobalAmperValue = function(xDoc, exInfo)
{
	return xDoc;
};

Ibfs.DEFINES.EVENTS.ITEM_CREATED = "ITEM_CREATED";
_p.saveTextContentFile = function saveTextContentFile(fileContents, fullPath, type, desc, bPrivate, options)
{
	var object =
	"\
		<rootObject _jt='IBFSMRObject' binary='false' description='{1}' type='{2}'>\
			<content _jt='IBFSByteContent' char_set='UTF8'>\
				{3}\
			</content>\
		</rootObject>\
	";
	object =  sformat(object, escapeXmlString(desc), escapeXmlString(type), window.btoa(unescape(encodeURIComponent(fileContents))));
	
	var parms =
	{
		"IBFS_action": "put",
		"IBFS_path": fullPath,
		"IBFS_object": object,
		"IBFS_private": bPrivate ? "true" : "false",
		"IBFS_replace": "true"
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.ITEM_CREATED;
	options.ppFun = options.ppFun || this._ppcreateItem;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.PGX_CREATED = "PGX_CREATED";
_p.createPGX = function createPGX(fullPath, desc, type, content, referencePath, bPrivate, options, extraProps)
{
	var props = "PGXType=" + type;
	if(extraProps)
	{
		for(var parm in extraProps)
			props += ';' + parm + '=' + extraProps[parm];	
	}	
	
	var parms =
	{
		"IBFS_action": "createPGX",
		"IBFS_path": fullPath,
		"IBFS_description": desc,
		"IBFS_base64content": window.btoa(unescape(encodeURIComponent(content))),
		"IBFS_referencePath": referencePath || "",
		"IBFS_private": bPrivate ? "true" : "false",
		"IBFS_replace": "true",
		"IBFS_properties": props,
	};

	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.PGX_CREATED;
	options.ppFun = options.ppFun || this._ppcreateItem;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.PRTLX_CREATED = "PRTLX_CREATED";
_p.createPRTLX = function createPRTLX(fullPath, desc, content, referencePath, bPrivate, options)
{
	var parms =
	{
		"IBFS_action": "createPRTLX",
		"IBFS_path": fullPath,
		"IBFS_description": desc,
		"IBFS_base64content": window.btoa(unescape(encodeURIComponent(content))),
		"IBFS_referencePath": referencePath || "",
		"IBFS_private": bPrivate ? "true" : "false",
		"IBFS_replace": "true"
	};

	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.PRTLX_CREATED;
	options.ppFun = options.ppFun || this._ppcreateItem;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.PRTLX_UPDATED = "PRTLX_UPDATED";
_p.updatePRTLX = function updatePRTLX(fullPath, desc, newName, content, referencePath, bPrivate, options)
{
	var parms =
	{
		"IBFS_action": "updatePRTLX",
		"IBFS_path": fullPath,
		"IBFS_name": newName, 
		"IBFS_description": desc,
		"IBFS_base64content": window.btoa(unescape(encodeURIComponent(content))),
		"IBFS_referencePath": referencePath || "",
		"IBFS_private": bPrivate ? "true" : "false",
		"IBFS_replace": "true"
	};

	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.PRTLX_UPDATED;
	options.ppFun = options.ppFun || this._ppcreateItem;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.PGX_RESOURCES_UPDATED = "PGX_RESOURCES_UPDATED";
_p.updatePGXResources = function updatePGXResources(fullPath, bPrivate, options)
{
	var parms =
	{
		"IBFS_action": "generatePropFilesForLanguage",
		"IBFS_service": "utils",
		"IBFS_path": fullPath,
		"IBFS_language": "*",
		"IBFS_update": "true"
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.PGX_RESOURCES_UPDATED;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.ITEM_CREATED = "ITEM_CREATED";
_p.createItem = function createItem(strPath, strObject, bPrivate, options)
{
	var parms =
	{
		"IBFS_action": "put",
		"IBFS_path": strPath,
		"IBFS_object": strObject,
		"IBFS_private": bPrivate ? "true" : "false",
		"IBFS_replace": "false"
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.ITEM_CREATED;
	options.ppFun = options.ppFun || this._ppcreateItem;
	return this.exec(options);
};
_p._ppcreateItem = function _ppcreateItem(res, exInfo)
{
	var json = Ibfs.toJSON(res.querySelector('rootObject'));
	return json;
};

Ibfs.DEFINES.EVENTS.ITEM_CONTENTS_LOADED = "EVENT_ITEM_CONTENTS_LOADED";
_p.getItem = function getItem(strPath, contentOnly, options)
{
	var parms =
	{
		"IBFS_action": contentOnly ? "getContent" : "get",
		"IBFS_path": strPath,
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.dataType = contentOnly ? "text" : "xml";
	options.eSuccess = Ibfs.DEFINES.EVENTS.ITEM_CONTENTS_LOADED;
	options.ppFun = options.ppFun || this._ppgetItem;
	return this.exec(options);
};
_p._ppgetItem = function _ppgetItem(res, exInfo)
{
	var json = (exInfo.parms.IBFS_action == "getContent") ? res : Ibfs.toJSON(res.querySelector('rootObject'));
	return json;
};

Ibfs.EVENT_ITEMS_DELETED = "EVENT_ITEMS_DELETED";
_p.deleteItem = function deleteItem(strPath)
{
	var parms = 
	{
		"IBFS_action": "delete",
		"IBFS_path":strPath 
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENT_ITEMS_DELETED;
	options.ppFun = options.ppFun || this._ppgetItem;
	return this.exec(options);
};
_p._ppdeleteItem = function _ppdeleteItem(cInfo)
{
	var xItem = this.findItem(cInfo.parms.IBFS_path);
	if(xItem)
		xItem.parentNode.removeChild(xItem);
	return this._ppGenericObject(cInfo);
};

Ibfs.EVENT_ANNOTATION_CONTAINER_CREATED = "ANNOTATION_CONTAINER_CREATED";
_p.createAnnotationContainer = function createAnnotationContainer(strPath, name, desc, options)
{
	var template =
	"\
		<object type='AnnotationContainer'\
			typeDescription='Annotation'\
			_jt='IBFSObject'\
			fullPath={1}\
			rsPath={1}\
			name={2}\
			description={3}\
		>\
		</object>\
	";
	var strObj = sformat(template, XPathStringLiteral(escapeXmlString(strPath)), XPathStringLiteral(escapeXmlString(name)),
					XPathStringLiteral(escapeXmlString(desc)));
	return this.createItem(strPath, strObj, false, options);
};

Ibfs.DEFINES.EVENTS.LIST_ANNOTATIONS = "LIST_ANNOTATIONS";
_p.listAnnotations = function listAnnotations(idRes, idEntry, strArgs, bUpdateSubscriptions, options)
{
	var parms = 
	{
		"IBFS_action":"listAnnotations",
		"IBFS_path":idRes,
		"IBFS_entryId":idEntry || "",
		"IBFS_flatten": options ? options.flatten : "false",
		"IBFS_recursionDepth": options ? options.depth : "1",
		"IBFS_args": strArgs ? strArgs : "",
		"INTERNAL_SUB_UPDATE": bUpdateSubscriptions
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.LIST_ANNOTATIONS;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.ANNOTATION_SAVED = "ANNOTATION_SAVED";
_p.putAnnotation = function putAnnotation(idRes, annId, refId, text, metaTags, options)
{
	var parms =
	{
		"IBFS_action": "putAnnotation",
		"IBFS_path": idRes,
		"IBFS_entryId": annId || "",
		"IBFS_refId": refId || "",
		"IBFS_text": text,
		"IBFS_metaTags": metaTags || ""
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.ANNOTATION_SAVED;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.ANNOTATION_CREATED = "ANNOTATION_CREATED";
_p.createAnnotation = function createAnnotation(idRes, text, metaTags, idRef, options)
{
	return this.putAnnotation(idRes, "", idRef || "", text, metaTags, options);
};

Ibfs.DEFINES.EVENTS.ANNOTATION_UPDATED = "ANNOTATION_UPDATED";
_p.updateAnnotation = function updateAnnotation(idRes, annId, text, metaTags, options)
{
	return this.putAnnotation(idRes, annId, "", text, metaTags, options);
};

Ibfs.DEFINES.EVENTS.ANNOTATION_DELETED = "ANNOTATION_DELETED";
_p.deleteAnnotation = function deleteAnnotation(idRes, annId, options)
{
	var parms =
	{
		"IBFS_action": "deleteAnnotation",
		"IBFS_path": idRes,
		"IBFS_entryId": annId || ""
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.ANNOTATION_DELETED;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.GET_OWNER = "EVENT_GET_OWNER";
_p.getOwner = function getOwner(idRes, options)
{
	var parms = 
	{
	  "IBFS_action":"getOwner",
	  "IBFS_path":idRes
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.GET_OWNER;
	options.ppFun = options.ppFun || this._pplistShares;
	return this.exec(options);
};
_p._ppgetOwner = function _ppgetOwner(res, exInfo)
{
	var res = (exInfo.asJSON) ? Ibfs.toJSON(res.querySelector('rootObject')) : $(res.querySelectorAll("rootObject"));
	return res;
};

Ibfs.DEFINES.EVENTS.SET_OWNER = "EVENT_SET_OWNER";
_p.setOwner = function setOwner(idRes, idOwner, bClearShares, bPrivate, bOverrideNoListParent, options)
{
	var parms = 
	{
	  "IBFS_action": bPrivate ? "unpublish" : "publish",
	  "IBFS_path": idRes,
	  "IBFS_ownerPath": idOwner,
	  "IBFS_clearShares": (bClearShares) ? "true" : "false"
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.SET_OWNER;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.LIST_SHARES = "EVENT_LIST_SHARES";
_p.listShares = function listShares(idRes, options)
{
	var parms = 
	{
	  "IBFS_action": "listShares",
	  "IBFS_path": idRes
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.LIST_SHARES;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.SET_SHARES = "EVENT_SET_SHARES";
_p.setShares = function setShares(idRes, arShareIds, options)
{
	var object =
	"\
		<rootObject _jt='ArrayList' size='{1}'>\
			{2}\
		</rootObject>\
	";
	var shares = "";
	var nLen = arShareIds.length;
	for(var i = 0; i < nLen; ++i)
	{
		var idItem = arShareIds[i];
		shares += sformat("<item _jt='string' index='{1}' value='{2}'/>", i, escapeXmlString(idItem));
	}
	object = sformat(object, nLen, shares);

	var parms = 
	{
		"IBFS_action": "setShares",
		"IBFS_path": idRes,
		"IBFS_subjectsList": object
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.SET_SHARES;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.ITEMS_COPIED = "EVENT_ITEMS_COPIED";
_p.copyItem = function copyItem(strSrcPath, strDestName, strDestPath, bReplace, bAsync, bPublic, data)
{
	var parms = 
	{
		"IBFS_action": "copy",
		"IBFS_path": strSrcPath,
		"IBFS_destination": sformat("{1}/{2}", strDestPath, strDestName),
		"IBFS_replace": bReplace ? true : false
	};
	var options = WebApi.genExecOptions(parms, null, null, null);
	options.eSuccess = Ibfs.DEFINES.EVENTS.ITEMS_COPIED;
	return this.exec(options);
};
// Copy item and append suffixvalue to description.
_p.copyItemAddDescriptionSuffix = function copyItemAddDescriptionSuffix(strSrcPath, strDestName, strDestPath, bReplace, bAsync, suffixValue)
{
	var suffix = "";
	if ( suffixValue != null && suffixValue != "undefined" && suffixValue.length != 0)
	{
		 var suffix = "<rootObject _jt='HashMap'>"
			 suffix += "<entry><key _jt='string' value='AppendDescriptionSuffix'/><value _jt='string' value=\'" + suffixValue + "\'/></entry>";
		 	 suffix += "</rootObject>";
	}
	var parms = 
	{
		"IBFS_action": "copy",
		"IBFS_path": strSrcPath,
		"IBFS_destination": sformat("{1}/{2}", strDestPath, strDestName),
		"IBFS_args": suffix,
		"IBFS_replace": bReplace ? true : false
	};
	var options = WebApi.genExecOptions(parms, null, null, null);
	options.eSuccess = Ibfs.DEFINES.EVENTS.ITEMS_COPIED;
	return this.exec(options);
};


Ibfs.DEFINES.EVENTS.SERVERINFO = "EVENT_SERVERINFO";
_p.serverInfo = function(edaNode, cacheAction)
{
	var parms = 
	{
		"IBFS_service": "utils",
		"IBFS_action": "getServerInfoXML",
		"IBFS_nodeName": edaNode,
		"IBFS_LruCacheAction": cacheAction,		
	};
	var options = WebApi.genExecOptions(parms, null, null, null);
	options.eSuccess = Ibfs.DEFINES.EVENTS.SERVERINFO;
	options.ppFun = options.ppFun || this._ppServerInfo;
	return this.exec(options);
};
_p._ppServerInfo = function(res, exInfo)
{
	var result = [];
	var desc = $(res).find("column_desc");	
	var col = desc.find("col");
	var table = $(res).find("table");
	var tds = table.find("td");
	
	for (var i = 0; i < col.length; i ++)
	{
		var name = $(col[i]).attr("fieldname");
		var value = $(tds[i]).text();
		var resultLine = {"name": name, "value": value};
		result.push(resultLine);
	}	
	return result;
};

Ibfs.DEFINES.EVENTS.REMOVE_CUSTOMIZATIONS = "REMOVE_CUSTOMIZATIONS";
_p.removeCustomizations = function removeCustomizations(path, custUserNames, custNames, recursionDepth, bPrivate, options)
{
	var parms =
	{
		"IBFS_action": "removeCustomizations",
		"IBFS_path": path,
		"IBFS_custNames": custNames,
		"IBFS_custUserName": custUserNames,
		"IBFS_recursionDepth" : recursionDepth         
	};

	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.REMOVE_CUSTOMIZATIONS;
	options.ppFun = options.ppFun || this._ppremoveCustomizations;
	return this.exec(options);
};

_p._ppremoveCustomizations = function _ppremoveCustomizations(res, exInfo)
{
	var cust  = $(res).find("rootObject").text();
	if (!cust)
	{
		cust = $(res).find ("rootObject").attr("value");
	}
	
	return cust;
};

Ibfs.DEFINES.EVENTS.PUT_CUSTOMIZATION = "PUT_CUSTOMIZATION";
_p.putCustomization = function putCustomization(custName, path, custValue, bPrivate, options)
{
	var parms =
	{
		"IBFS_action": "putCustomization",
		"IBFS_path": path,
		"IBFS_custName": custName,
		"IBFS_custValue": custValue
	};

	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.PUT_CUSTOMIZATION;
	options.ppFun = options.ppFun || this._ppcreateItem;
	return this.exec(options);
};

Ibfs.DEFINES.EVENTS.GET_CUSTOMIZATION = "GET_CUSTOMIZATION";
_p.getCustomization = function getCustomization(custName, path, bPrivate, options)
{
	var parms =
	{
		"IBFS_action": "getCustomizationObject",
		"IBFS_path": path,
		"IBFS_custName": custName,
	};

	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.GET_CUSTOMIZATION;
	options.ppFun = options.ppFun || this._ppgetCustomization;
	return this.exec(options);
};

_p._ppgetCustomization = function _ppgetCustomization(res, exInfo)
{
	var cust  = $(res).find("rootObject").text();
	if (!cust)
	{
		cust = $(res).find ("rootObject").attr("value");
	}
	
	return cust;
};

Ibfs.DEFINES.EVENTS.PROPERTY_SET = "IBFS_PROPERTY_SET";
_p.putItemProperty = function putItemProperty(fullPath, propName, propValue)
{
	var parms =
	{
		"IBFS_action": "putProperty",
		"IBFS_path": fullPath,
		"IBFS_propertyName" :	propName,
		"IBFS_propertyValue":  propValue,
		"IBFS_args" : "__null",
		"IBFS_service" : "ibfs" 
	};
	var options = WebApi.genExecOptions(parms, null, null, options);
	options.eSuccess = Ibfs.DEFINES.EVENTS.PROPERTY_SET;
	return this.exec(options);
};

//# sourceURL=ibfs.js
