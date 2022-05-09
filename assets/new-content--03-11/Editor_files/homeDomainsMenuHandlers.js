/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.14 $:

function domainMenuHandlers(domainsContent)
{
	this._domainsContent = domainsContent;
	// needs to be here, after function declarations; most item types will run, some edit, and other do something else, so below are the exceptions
	this.typeDefaultActionMap = [];
	this.typeDefaultActionMap["CasterSchedule"] = {"func":this.editIt, "op":"scheduleAdvancedTool", "altOp": "DENIED"};
	this.typeDefaultActionMap["CasterDistributionList"] = {"func":this.editIt, "op":"schedDistributionList"};
	this.typeDefaultActionMap["CasterAccessList"] = {"func":this.editIt, "op":"schedAccessList"};
	this.typeDefaultActionMap["CasterLibrary"] = {"func":(hprbUtil.environment.libraryViewAll ? this.viewAllVersion : this.viewLastVersion), "op":"library"};
	this.typeDefaultActionMap["BIPWFCPortalItem"] = {"func":this.runInNewWindow, "op":"viewPortal"};
	this.typeDefaultActionMap["BIPWFCPortalPageItem"] = {"func": this.editIt, "op":"pageDesigner"};
	this.typeDefaultActionMap["BipPortalsPortal"] = {"func":this.runInNewWindow, "op":"viewPortal"};
	this.typeDefaultActionMap["StyFile"] = {"func":this.editIt, "op":"editor"};
	this.typeDefaultActionMap["CssFile"] = {"func":this.editIt, "op":"editor"};
	this.typeDefaultActionMap["IBFSFile"] = {"func":this.editIt, "op":"editor"};
}

var dmhProto = domainMenuHandlers.prototype;

dmhProto.isGranted = function(item, op)
{
	if (!item)
		return false;
	if (!item.actions)
		return false;
	
	var actions = item.actions.split(',');
	var ta = [];
	for (var a = 0; a < actions.length; a++)
		ta[actions[a]] = true;
	
	if (ta[op])
		return true;
	else
		return false;
};

dmhProto.dblClick = function(inItem)
{
	var type = inItem.type;
	if (type == "LinkItem")
		type = inItem.clientInfo.properties.LinkToObjType;
	
	if (this.typeDefaultActionMap[type])
	{
    	var func = this.typeDefaultActionMap[type].func;
    	if (this.isGranted(inItem, this.typeDefaultActionMap[type].op))
    		func.call(this, inItem);
    	else if (this.typeDefaultActionMap[type].altOp)
    	{
    		if (this.typeDefaultActionMap[type].altOp == "DENIED")
    		{
    	    	if (!this.isGranted(inItem, this.typeDefaultActionMap[type].op))
    	    		func.call(this, inItem);
    		}
    	}
    	else
    	{
    		if (this.isGranted(inItem, "run"))
    			this.runIt(inItem);
    		else if (this.isGranted(inItem, "rundef"))
    			this.runIt(inItem);
    	}
	}
	else
	{
		switch (inItem.extension)
		{
    		case "blog":
    		case "txt":
    		{
	    		this.editIt(inItem);
	    		break;
    		}
    		case "prtl":
    		{
    			if (this.isGranted(inItem, "viewPortal"))
	    			this.runIt(inItem);
    			break;
    		}
    		case "ely":
    		{
    			return;
    		}
    		case "mas":
    		{
    			if (this.isGranted(inItem, "metadata"))
    				this.editMasterFile(inItem);
    			break;
    		}
    		default:
    		{
	    		if (this.isGranted(inItem, "run"))
	    			this.runIt(inItem);
	    		else if (this.isGranted(inItem, "rundef"))
	    			this.runIt(inItem);
	    		break;
    		}
		}
	}	
};

dmhProto.openFolder = function openFolder(item)
{
	this._domainsContent._curPath = item.fullPath;	
	this._domainsContent.element.dispatchEvent('chg_curpath_descend', item);
	this._domainsContent._tree.dispatchEvent('chg_curpath_descend', item);
};


dmhProto.callProperties = function callProperties(e)
{
	$(".propPage").ibxWidget("show", $(e.target).data("contextItem"),  $(e.target).data("selectedItems"), false, null);							
};


dmhProto.removeRecent = function removeRecent(contextItem, selectedItems)
{
	var item = selectedItems;
	if (this.useContextItem(selectedItems, contextItem))
		item = [contextItem];
	
	var uriExec = sformat("{1}/views.bip", applicationContext);
	var deferredList = [];
	for (var i = 0; i < item.length; i++)
	{
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_REMOVE_RECENT",		
	 		path: item[i].fullPath
	 	};
		argument[IBI_random] = randomnum;
		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
	 	
	 	deferredList.push($.post(uriExec, argument));
	}

	$.when.apply($, deferredList).always(function(data)
 	{
		$('.cbox-file-box').dispatchEvent('home_remove_recent');
 	});
};

dmhProto.popupWindow = function(url, title, w, h)
{
	var homeWindow;	
	if (w == 0 & h == 0) // open in a new tab
	{			
		setTimeout(function()
		{
			homeWindow = window.open(url, title);
			if(!homeWindow)
			{	
				rebootUtil.InformationalDialog("", ibx.resourceMgr.getString("home_popup")); 
			}
		}, 100);
	}
	else
	{
		setTimeout(function()
		{
			var left = Math.round((screen.width/2)-(w/2));
			var top = Math.round((screen.height/2)-(h/2));
			homeWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, '
					+ 'menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=' + w 
					+ ', height=' + h + ', top=' + top + ', left=' + left);
		}, 100);
	}
//	if(homeWindow)$(homeWindow).ready(hookCallBack);
	return false;
};

dmhProto.editParameters = function(item, skipCheck)
{
	if (!skipCheck)
	{
		//this.checkCredentials(item.effectiveRSName, this.editParameters, item, false);
		var sa = new ServerAccess();
		sa.checkCredentials(item.effectiveRSName, this.editParameters.bind(this), item, false);
	}
	else
	{
		uriExec = sformat("{1}/run.bip?BIP_REQUEST_TYPE=BIP_LAUNCH&BIP_folder={2}&BIP_item={3}", applicationContext,
				encodeURIComponent(encodeURIComponent(item.parentPath)), encodeURIComponent(encodeURIComponent(item.name)));

		if	(item.clientInfo.type != "FexInfoMini")
			this.runInOutputdiv(item, uriExec);
		else 		
			this.popupWindow(uriExec, "", 0, 0);
	}
};


dmhProto.runInNewWindow = function runInNewWindow(item, skipCheck)
{
	var uriExec;
	if(item.type == "BIPWFCPortalItem" || (item.type == "LinkItem" && item.clientInfo.properties["LinkToObjType"] == "BIPWFCPortalItem"))
	{
		var pth = (item.type == "LinkItem" ? item.clientInfo.properties["LinkToPath"] : item.fullPath);
		var repstring = "IBFS:/WFC/Repository/";
		var i = pth.indexOf(repstring);
		if(i>-1)
			pth=pth.substring(i+repstring.length);
		
		i = pth.lastIndexOf(".");
		
		if(i>-1)
			pth=pth.substring(0,i); 
		
		if (item.clientInfo && item.clientInfo.alias)
			uriExec = applicationContext + "/portal/" + encodeURI(item.clientInfo.alias);
		else
			uriExec = applicationContext + "/portal/" + encodeURI(pth);
	}
	else if (item.type == "BipPortalsPortal")
	{
		// v3 portal...
		var path = "/bip/portal/" + encodeURIComponent(item.name);			
		uriExec = applicationContext + path;			
	}
	else if (item.type == "PRTLXBundle" || (item.type == "LinkItem" && item.clientInfo.properties["LinkToObjType"] == "PRTLXBundle"))
	{

		var pth = (item.type == "LinkItem" ? item.clientInfo.properties["LinkToPath"] : item.fullPath);
		if (item.clientInfo.properties.PortalAlias)
			pth = item.clientInfo.properties.PortalAlias.toString();
		
		var repstring = "IBFS:/WFC/Repository/";
		var i = pth.indexOf(repstring);
		if(i>-1)
			pth=pth.substring(i+repstring.length);
		
		var uriExec = sformat("{1}/portal/{2}",applicationContext, encodeURI(pth));
		
	}
	else
	{
		if (!skipCheck)
		{
			//this.checkCredentials(item.effectiveRSName, this.runIt, item, false);
			var sa = new ServerAccess();
			sa.checkCredentials(item.effectiveRSName, this.runInNewWindow.bind(this), item, false);
			return;
		}
		// run.bip expects BIP_folder and BIP_items are double encoded
		uriExec = sformat("{1}/run.bip?BIP_REQUEST_TYPE=BIP_RUN&BIP_folder={2}&BIP_item={3}", applicationContext,
				encodeURIComponent(encodeURIComponent(item.parentPath)), encodeURIComponent(encodeURIComponent(item.name)));
		if (item.clientInfo && item.clientInfo.properties.parmrpt)
			uriExec += "&IBFS_wfDescribe=XMLRUN";
	}
	if(hprbUtil.environment["isMobileFaves"] == "false")
		this.popupWindow(uriExec, "", 0, 0);
	else
		this.runInOutputdiv(item, uriExec);

	setTimeout(function()
	{
		$('.home-recent').dispatchEvent('run-issued');
		$(document).dispatchEvent("action_required", {type: 'run_issued'});
	}, 1000);

};

dmhProto.runOffline = function(item, skipCheck)
{
	var uriExec;
	if (!skipCheck)
	{
		//this.checkCredentials(item.effectiveRSName, this.runIt, item, false);
		var sa = new ServerAccess();
		sa.checkCredentials(item.effectiveRSName, this.runOffline.bind(this), item, false);
		return;
	}

		// run.bip expects BIP_folder and BIP_items are double encoded
	uriExec = sformat("{1}/run.bip?BIP_REQUEST_TYPE=BIP_RUN&BIP_folder={2}&BIP_item={3}&IBIWF_saveas=YES", applicationContext,
			encodeURIComponent(encodeURIComponent(item.fullPath)), "document.fex");

	if (item.clientInfo && item.clientInfo.properties.parmrpt)
		uriExec += "&IBFS_wfDescribe=XMLRUN";

	if(hprbUtil.environment["isMobileFaves"] == "false")
		this.popupWindow(uriExec, "", 0, 0);
	else
		this.runInOutputdiv(item, uriExec);

	setTimeout(function()
	{
		$('.home-recent').dispatchEvent('run-issued');
		$(document).dispatchEvent("action_required", {type: 'run_issued'});
	}, 1000);
};


dmhProto.scheduleRun = function(jsonObj)
{	
	var options = null;
	if(jsonObj.exception) {
		var text = jsonObj.exception.message;
		options = 
		{
			type:"medium error",
			caption:ibx.resourceMgr.getString("home_run_schedule"),
			buttons:"ok",		
			messageOptions:{text:text}
		};
	}
	else {
		jobId = jsonObj.job.id;
		var text = ibx.resourceMgr.getString("home_schedule_ran");		
		var useText = sformat(text, jobId);
		options = 
		{
			type:"medium info",
			caption:ibx.resourceMgr.getString("home_run_schedule"),
			buttons:"ok",		
			messageOptions:{text:useText}
		};
	}
	var dlg = $.ibi.ibxDialog.createMessageDialog(options);	
	dlg.ibxDialog("open");
};


dmhProto.postCall = function(path, data, wfirsflag, callbackOption, shouldRefresh)
{
	var rf = true;
	if (shouldRefresh != undefined)
		rf = shouldRefresh;
	
	var outputformat=wfirsflag?"xml":"html";
	var retstatus=false;
	var jsonObj;
	callbackOption = (callbackOption != null) ? callbackOption : "";

	$.post(path, data , function(retdata, status)
	{
		if(status=="success")
		{
			if(retdata.indexOf)
			{// its a string	
				if(retdata.indexOf("<!DOCTYPE") == 0 || retdata.indexOf("<html") == 0)
				{
					// does it contain <FailedVariables>
					if(retdata.indexOf("<FailedVariables>") > 0)
					{
						item = ibx.resourceMgr.getString("validation_error");	
						rebootUtil.fatalError(item, false);
					}
					if(retdata.indexOf("webconsole") > 0)
					{
						return;
					}	
					else
					{	
						// we got an html page back.. not good.
						item = ibx.resourceMgr.getString("fatal_error_signon");				
						rebootUtil.fatalError(item, true);
					}
					return;
				}
				
			}	
			if(wfirsflag)
			{	
				$(retdata).children().each(function()
				{
					var tagName=this.tagName;
					if(tagName=="ibfsrpc")
					{
						var retcode=$(this).attr('returncode');	
						if (retcode=="10000")
						{
							if (rf)
							{											
								_this.refreshfolderx(home_globals.currentPath);									
							}	
						}
					}						
				});
			}
			else
			{
				if(retdata.indexOf("{") == 0)
				{
					//json....
					jsonObj = JSON.parse(retdata);
					goodResult = true;
				}	
				else
				{	
					xmlDoc = $.parseXML( retdata );
					var goodResult = false;
					var message = "";
					var response=$(xmlDoc).find("RESPONSE");
					if(response.length)
					{
						var x = $(response).find("ACTION_DATA");
						if(x.length)
						{
							var status = $(x).find("status");
							if(status.length)
							{	
								var retvalue = $(status).attr('result');
								if(retvalue && retvalue == "success")goodResult = true;
							}	
							else
							{
								var x = $(response).find("ERROR_DATA");
								if(x.length)
								{
									x = $(x).find("ERROR_DETAILS");
									if(x.length)
									{
										x = $(x).find("ERROR_CODE");
										if(x.length)
										{
											var value = $(x).attr("value");
											if(value == "200")goodResult = true;
											else if(value == "-99")
											{
												x = $(response).find("ERROR_MESSAGE");													
												if(x.length)
												{
													message = $(x).attr("value");														
												}	
													
											}	
										}	
									}
								}								
							}
						}
					}
					else
					{
						var status = $(xmlDoc).find("status");
						if(status.length)
						{	
							var retvalue = $(status).attr('result');
							if(retvalue && retvalue == "success")goodResult = true;
						}	
					}
				}	
				if (goodResult)
				{
					switch (callbackOption)
					{
						case "finishPortalCreation":
							_this.finishPortalCreation();
							break;
						case "addFavorite":
							_this.favoriteOK();
							break;
						case "addMobileFavorite":
							_this.mobileFavoriteOK();
						case "scheduleRun":
							this.scheduleRun(jsonObj);
						case "setGenAccess":
						{
							var genA = $("status", data).attr("message") == "true";
							if (genA)
								$(".folder-menu").find("[data-ibx-name='foMenuItemAllowGenAccess']").ibxWidget("option", "checked", true);
							else
								$(".folder-menu").find("[data-ibx-name='foMenuItemDenyGenAccess']").ibxWidget("option", "checked", true);
							break;
						}
						case "savepreferences":
							_this.reloadHomepageWithLanguage();
							break;					
						default:
							break;			
					}

					if (rf)
					{	
						setTimeout(function()
						{	
							if (!_this.inSearch())
								_this.refreshfolderx(home_globals.currentPath);
							else
								_this.refreshfolder(home_globals.currentPath);
							
							
						}.bind(this), 500);	
					}
				}
				else
				{		
					if(message.length == 0)message = $(status).attr('message');
	//				_this.callbackfunction(callbackOption,message);	
					rebootUtil.fatalError(message, false);
					home_globals.inSavePreferences = false;
				}
							
			}
		}
	}.bind(this), outputformat)
	.fail(function(e) {
		var status = e.status;
		var statusText = e.statusText;
		var text = sformat(ibx.resourceMgr.getString("fatal_error_message"), status, statusText);
		var restart = true;
		if(status == 0)
		{	
			restart=false;
			text = ibx.resourceMgr.getString("no_server_connection");
		}	
		rebootUtil.fatalError(text, restart);			
	}.bind(this));
}

dmhProto.runInOutputdiv = function(item, uriExec, fromSearch, positionDiv)
{
	var oa = null
	oa = $("<div>").outputArea();
	oa.ibxWidget('open');
	oa.ibxWidget("run", item.description, uriExec, fromSearch, positionDiv);
}

dmhProto.runDeferred = function(inItem)
{
    // rundef.bip expects BIP_folder and BIP_items are double encoded
	uriExec = sformat("{1}/rundef.bip?BIP_REQUEST_TYPE=BIP_RUNDEF&BIP_folder={2}&BIP_item={3}", applicationContext,
			encodeURIComponent(encodeURIComponent(inItem.parentPath)), encodeURIComponent(encodeURIComponent(inItem.name)));
	this.popupWindow(uriExec, "", 0, 0);		
};


// run an item
dmhProto.runIt = function runIt(inItem, skipCheck, fromSearch, positionDiv)
{
	var item=inItem;
	// check the type
	var master=false;
	if(item.type=="LinkItem")
	{	
		if(item.name.endsWith && item.name.endsWith(".mas"))
			master=true;
		else if(item.clientInfo.properties.LinkToObjType == "BIPWFCPortalItem" 
			 || item.clientInfo.properties.LinkToObjType == "PRTLXBundle")
		{	
			this.runInNewWindow(item);
			return;
		}	
		
	}	
	var uriExec = "";
	if(item.type == "BIPWFCPortalItem" || item.clientInfo.properties.mustRunInNewWindow == "on")
	{
		this.runInNewWindow(item);
		return;
	}
	if(item.type == "PRTLXBundle" || item.extension == "xml" || item.extension == "zip")
	{
		this.runInNewWindow(item);
		return;
	}
	else if (item.type == "BIPWFCPortalPageItem")
	{
		if (this.isGranted(item, "pageDesigner"))
			this.editIt(item);
		else
			rebootUtil.fatalError(ibx.resourceMgr.getString("hpreboot_edit_permission_denied"), false);
		return;
	}
	else if (item.type == "CssFile" || item.type == "StyFile")
	{
		if (this.isGranted(item, "editor"))
			this.editIt(item);
		else
			rebootUtil.fatalError(ibx.resourceMgr.getString("hpreboot_edit_permission_denied"), false);

		return;
	}
	else if(item.type == "BipPortalsPortal")
	{
		setTimeout(function()
		{
			$('.home-recent').dispatchEvent('run-issued');
			$(document).dispatchEvent("action_required", {type: 'run_issued'});
		}, 1000);
		// v3 portal...
		var path = "/bip/portal/" + encodeURIComponent(item.name);			
		uriExec = applicationContext + path;			
		this.popupWindow(uriExec, "", 0, 0);
		return;
	}	
	else if(master)
	{
		var tool="EnhancedRun";
		//var fullitem=item.parentPath + item.name;
		uriExec = sformat("{1}/ia?is508=false&item={2}&tool={3}", applicationContext,
			encodeURIComponent(item.fullPath),tool);	
	}
	if(item.extension && item.extension == "blog")
	{
		var uriExec = applicationContext + "/tools/dsstart/dsstart.jsp?closeWindow=show&type=6&path=" + encodeURIComponent(item.fullPath);			
		this.popupWindow(uriExec, "", 800, 600);
		return;
	}
	else if (item.extension &&  (item.extension == "doc" || item.extension == "docx"))
	{
		this.runInNewWindow(item);
		return;
	}	
	else	
	{
		if(item.type == "WEBFile") // if from /WEB - there is no server to check
		{
			skipCheck = true;
		}
		if (!skipCheck)
		{
			//this.checkCredentials(item.effectiveRSName, this.runIt, item, false);
			var sa = new ServerAccess();
			sa.checkCredentials(item.effectiveRSName, this.runIt.bind(this, item, true, fromSearch, positionDiv));
		}
		else
		{
			if(item.type == "CasterSchedule")
			{
				var options = 
				{
					type:"medium info",
					caption:ibx.resourceMgr.getString("home_run_schedule"),
					buttons:"okcancel",		
					messageOptions:{text:ibx.resourceMgr.getString("home_schedule_question")}
				};
				var dlg = $.ibi.ibxDialog.createMessageDialog(options);	
				
				
				dlg.ibxDialog("open").on("ibx_close", function(e, btn)
				{
					if(btn=="ok")
					{				
						var uriExec = sformat("{1}/action.rc", applicationContext);					
						var randomnum = Math.floor(Math.random() * 100000);	
						var argument=
						{
								cmdConfigId: "xScheduleRun",
								type: "json",
								handle: item.handle,
								trace: "0",
								random: randomnum	
						};
			    		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
			    		this.postCall(uriExec, argument, false, "scheduleRun", false);
					}						
				}.bind(this));	
			}	
			else
			{
				// run.bip expects BIP_folder and BIP_items are double encoded
				uriExec = sformat("{1}/run.bip?BIP_REQUEST_TYPE=BIP_RUN&BIP_folder={2}&BIP_item={3}", applicationContext,
					encodeURIComponent(encodeURIComponent(item.parentPath)), encodeURIComponent(encodeURIComponent(item.name)));
				if (item.clientInfo && item.clientInfo.properties.parmrpt)
					uriExec += "&IBFS_wfDescribe=XMLRUN";
			}
		}
	}
	if(uriExec.length > 0)
	{			
		setTimeout(function()
		{
			$('.home-recent').dispatchEvent('run-issued');
			$(document).dispatchEvent("action_required", {type: 'run_issued'});
		}, 1000);

		var mini = (item.clientInfo && item.clientInfo.type == "FexInfoMini") ? true : false;
		if	(hprbUtil.environment.outputdiv && !mini)
			this.runInOutputdiv(item, uriExec);
		else 		
			this.popupWindow(uriExec, "", 0, 0);
	}	
};	

dmhProto.analyticsEvent = function(label, event, category)
{
	if(typeof gtag !== 'undefined')
	{			
		gtag('event', event, {
			'send_to:': hprbUtil.environment.ganalyticsKey,
			  'event_category': category,
			  'event_label': label,
			  'value': 1,
			  'SiteCode': hprbUtil.environment.siteCode,
			  'WebFOCUSRelease': sRelNumber,
			  'nonInteraction': true
			});		
	}	
	if(typeof aptrinsic !== 'undefined')			
		setTimeout(aptrinsic('track', category, {"type": event, "label": label }), 100);
};


dmhProto.editIt = function(item, skipCheck)
{
	var isLink = item.type == "LinkItem";
	var toolProperties=item.clientInfo.properties.tool;
	if(!toolProperties)
	{
		var type = isLink ? item.clientInfo.properties.LinkToObjType : item.type;
		switch(type)
		{
			case "ely": 
			{
				toolProperties="elyIA";
				break;
			}
			case "PGXBundle":
			{
				toolProperties="pagedesigner";
				break;
			}
			case "PRTLXBundle":
			{
				toolProperties="prtlxdesigner";
				break;
			}
			case "BipPortalsPortal":
			case "BIPWFCPortalItem":
			{
				toolProperties = "editPortal";
				break;
			}
			case "BIPWFCPortalPageItem":
			{
				toolProperties = "editPage";
				break;
			}
			default:	//no tool, no special type, use text editor
			{
				switch(item.clientInfo.type)
				{
					case "ely":
					{
						toolProperties="elyIA";
						break;
					}
					default:
					toolProperties = "editor";
				}
			}
		}
	}
	if(toolProperties && (toolProperties.indexOf("infoAssist")>-1 
			|| toolProperties.indexOf("DataVisualization")>-1 
			|| toolProperties.indexOf("rotool")>-1
			|| toolProperties.indexOf("alert")>-1))
	{
		if (!skipCheck)
		{
			//this.checkCredentials(item.effectiveRSName, this.editIt, item, false);
			var sa = new ServerAccess();
			sa.checkCredentials(item.effectiveRSName, this.editIt.bind(this), item, false);
		}
		else
		{				
			
			var fullitem = item.parentPath + item.name;
			
			var urlbase = item.clientInfo.properties.InsightDesigner ? "designer" : "ia" ;
			this.analyticsEvent(urlbase + " edit", urlbase, "home");
			var slPath = item.parentPath;
			var uriExec = sformat("{1}/{2}?is508=false&item={3}", applicationContext, urlbase,
						encodeURIComponent(fullitem));	
			if( item.clientInfo.properties.InsightDesigner && !item.policy['opWrite'])
			{
				Ibfs.ibfs.findFolderToCreateIn(slPath, "IBFS:/WFC/Repository", {async: false, asJSON:true, errorHandling: false}
				).fail(function(cInfo)
				{
					uriExec = uriExec + "&startlocation=" + encodeURIComponent(item.parentPath);
				}).done(function(cInfo)
				{
					uriExec = uriExec + "&startlocation=" + encodeURIComponent(cInfo.result[0].fullPath);
				}.bind(this));
			}
	
			this.popupWindow(uriExec, "", 0, 0);
		}
	}
	else if (toolProperties == "elyIA")
	{
		if (!skipCheck)
		{
			//this.checkCredentials(item.effectiveRSName, this.editIt, item, false);
			var sa = new ServerAccess();
			sa.checkCredentials(item.effectiveRSName, this.editIt.bind(this), item, false);
		}
		else
		{
			var folder = item.parentPath;
			var fullPath = item.fullPath;
			var uriExec = sformat("{1}/ia?is508=false&item={2}&tool=document&layoutTemplate={3}",
					applicationContext, encodeURIComponent(folder), encodeURIComponent(fullPath));
			this.popupWindow(uriExec, "", 0, 0);
		}
	}
	else if(toolProperties == "editor")
	{
//		if(_useNewTE)
		{
			var folder = item.parentPath;
			var name = item.name;
			if (isLink)
			{
				var ltp = item.clientInfo.properties.LinkToPath;
				folder = ltp.substring(0, ltp.lastIndexOf('/')) + '/';
				name = ltp.substring(ltp.lastIndexOf('/')+1);
			}
			
			this.analyticsEvent("TED edit", "TED", "home");
			if(hprbUtil.environment.tedWindowHandle && !hprbUtil.environment.tedWindowHandle.closed)
			{
				hprbUtil.environment.tedWindowHandle.openDocument("IBFS:/WFC/Repository", folder, name);
				hprbUtil.environment.tedWindowHandle.focus();
			}
			else
			{
				var uriExec = sformat("{1}/TED?rootFolderPath={2}&folderPath={3}&itemName={4}",								
					applicationContext,	encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository")), encodeURIComponent(encodeURIComponent(folder)), encodeURIComponent(encodeURIComponent(name)));	
				
				setTimeout(function()
				{
					hprbUtil.environment.tedWindowHandle = window.open(uriExec, "_tedWindow");
				}, 100);
			}
		}
/*		
		else
		{
			// SPEditorMarkup.jsp expects folderPath, description and itemName are double encoded.
			var uriExec = sformat("{1}/tools/portlets/resources/markup/sharep/SPEditorBoot.jsp?folderPath={2}&description={3}&itemName={4}&isReferenced=true&type=item",			
				applicationContext,	encodeURIComponent(encodeURIComponent(item.parentPath)), encodeURIComponent(encodeURIComponent(item.description)), encodeURIComponent(encodeURIComponent(item.name)));	
			this.popupWindow(uriExec, "", 800, 600);
		}
*/		
	}
	else if(toolProperties == "pagedesigner")
	{
		if (!skipCheck)
		{
			//this.checkCredentials(item.effectiveRSName, this.editIt, item, false);
			var sa = new ServerAccess();
			sa.checkCredentials(item.effectiveRSName, this.editIt.bind(this), item, false);
		}
		else
		{
			this.analyticsEvent("edit page designer", "designer", "home");
			var slPath = item.parentPath;
			var uriExec = sformat("{1}/designer?item={2}",applicationContext, encodeURIComponent(item.fullPath));
			if (!item.policy['opWrite'])
			{
				Ibfs.ibfs.findFolderToCreateIn(slPath, "IBFS:/WFC/Repository", {async: false, asJSON:true, errorHandling: false}
				).fail(function(cInfo)
				{
					slPath = item.parentPath;
				}).done(function(cInfo)
				{
					slPath = cInfo.result[0].fullPath;
				}.bind(this));
				
				uriExec = uriExec + "&startlocation=" + encodeURIComponent(slPath);
			}
			this.popupWindow(uriExec, "", 0, 0);
		}
	}
	else if(toolProperties == "prtlxdesigner")
	{
		if (!skipCheck)
		{
			//this.checkCredentials(item.effectiveRSName, this.editIt, item, false);
			var sa = new ServerAccess();
			sa.checkCredentials(item.effectiveRSName, this.editIt.bind(this), item, false);
		}
		else
		{
			this.analyticsEvent("edit v5 portal", "portal", "home");
			var uriExec = sformat("{1}/ibxtools/pvd/pvd.jsp?path={2}&mode=edit",applicationContext, encodeURIComponent(encodeURIComponent(isLink ? item.clientInfo.properties.LinkToPath : item.fullPath)));
			this.popupWindow(uriExec, "", 0, 0);
		}
	}
	else if(toolProperties == "schedule")
    {
		var tool = (item.actions.indexOf("scheduleAdvancedTool") == -1 ? "se.rc" : "sae.rc"); 
		var uriExec = sformat("{1}/" + tool + "?folderPath={2}&ibfsId={3}",			
				applicationContext,	encodeURIComponent(encodeURIComponent(hprbUtil.environment.currentPath)), encodeURIComponent(item.handle));
		this.popupWindow(uriExec, "", 0, 0);
			
    }
	else if(toolProperties == "addressbook")
    {
		var uriExec = sformat("{1}/ae.rc?folderPath={2}&ibfsId={3}",			
				applicationContext,	encodeURIComponent(encodeURIComponent(hprbUtil.environment.currentPath)), encodeURIComponent(item.handle));									
		this.popupWindow(uriExec, "", 0, 0);
    }	
	else if(toolProperties == "accesslist")
    {
		var uriExec = sformat("{1}/ale.rc?folderPath={2}&ibfsId={3}",			
				applicationContext,	encodeURIComponent(encodeURIComponent(hprbUtil.environment.currentPath)), encodeURIComponent(item.handle));									
		this.popupWindow(uriExec, "", 0, 0);
    }	
	else if (toolProperties == "editPortal")
	{
		if (item.fullPath.indexOf("/BIP/") != -1)	// V3
		{
			this.analyticsEvent("edit v3 portal", "portal", "home");
			var uriExec = sformat("{1}/bip/portal/PortalDesigner?path={2}",applicationContext, encodeURIComponent(encodeURIComponent(item.name)));
		}
		else	// V4
		{
			this.analyticsEvent("edit v4 portal", "portal", "home");
			var portalPath;
			if (isLink)
				portalPath = item.clientInfo.properties.LinkToPath;
			else
				portalPath = item.fullPath;
			portalPath = portalPath.substring("IBFS:/WFC/Repository".length);
			portalPath = portalPath.substring(0, portalPath.length-5);
			var uriExec = sformat("{1}/portal/PortalDesigner?path={2}",applicationContext, encodeURIComponent(encodeURIComponent(portalPath)));
		}
		this.popupWindow(uriExec, "", 0, 0);
	}
	else if (toolProperties == "url")
	{
		var urlUserInfo = new Array();
		var pos = item.fullPath.indexOf(item.name); 
		urlUserInfo["folder"] = item.fullPath.substring(0, pos-1);
		pos = item.name.toLowerCase().lastIndexOf('.url');
		urlUserInfo["name"] = item.name.substring(0, pos);
		urlUserInfo["summary"] = item.summary;
		urlUserInfo["title"] = item.description;
		urlUserInfo["handle"] = item.handle;
		this.urlEditor("edit",urlUserInfo);			
	}
	else if (toolProperties == "editPage")
	{
		var pagePath = item.fullPath;
		if (pagePath.indexOf("/Global") == -1)
			pagePath = pagePath.substring("IBFS:/WFC/Repository".length);
		else
			pagePath = pagePath.substring("IBFS:/WFC".length);
		var uriExec = sformat("{1}/portal/PageDesigner?path={2}",applicationContext, encodeURIComponent(encodeURIComponent(pagePath)));
		this.popupWindow(uriExec, "", 0, 0);
	}
	else if (toolProperties == "blog")
	{
		var uriExec = applicationContext + "/tools/dsstart/dsstart.jsp?closeWindow=show&type=6&path=" + encodeURIComponent(item.fullPath);
		this.popupWindow(uriExec, "", 800, 600);
	}
	else
	{ 
		if(!toolProperties)toolProperties="";
		var message="Tool not implemented: " + toolProperties;
		rebootUtil.InformationalDialog("Warning",message);								
	}	
					
};

dmhProto.replaceDisallowedChars = function(value)
{    	
	var tvalue = value.replace(hprbUtil.environment.disallowedChars, "_");  
	tvalue = tvalue.replace(/_+/g,'_');
	return tvalue;
};

dmhProto.validateMaxlength = function(fileName,Maxlength)
{
	// Maxlength = 0 if data-ibxp-max-length is not exist
	if (Maxlength > 0 && fileName.length > Maxlength)
		fileName = fileName.substring(0, Maxlength);
	return fileName;
};  

dmhProto.validateChar = function(key, code)
{
	if (code == 37 || code == 39 || code == 8 || code == 46 || code == 9) // left/right/backspace/delete/tab
		return true;
	if (key && key.length > 1)
		return false;       	
	if(key.replace(hprbUtil.environment.disallowedChars, "") == "")
		return false;    	
	else 
		return true;    	
};

dmhProto.urlEditor = function newUrl(option,urlUserInfo)
{
	// show the dialog....
	form = ibx.resourceMgr.getResource('.create-new-url');
	form.ibxWidget('open');
	$(form).find(".form-fill-error-text").hide();	
	$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', true);	
	if (option == "new")
		$(form).find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("str_create_new_url"));
	else
	{ // edit version
		$(form).find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("home_edit_url"));
		$('#sdtxtFileTitle').ibxWidget("option", "text", urlUserInfo["title"]);		
		$('#sdtxtFileName').ibxWidget("option", "text", urlUserInfo["name"]);
		$('#sdtxtFileName').addClass("hp-title-input");
		$('#sdtxtFileName').ibxWidget('option', 'disabled', true);
		$('#sdtxtFileSummary').ibxWidget("option", "text", urlUserInfo["summary"]);
		$(form).find(".ibx-dialog-ok-button").ibxWidget("option", "text", ibx.resourceMgr.getString("home_update"));
		
		var uriExec = sformat("{1}/views.bip", applicationContext);
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_URL_PROPS",
	 		folder: urlUserInfo["folder"],
	 		name: urlUserInfo["name"]+".url"
	 	};
	 	argument[IBI_random] = randomnum;
		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;

	 	$.post(uriExec, argument)
			.done(function( data ) 
			{
				var status = $("status", data);
				var result = status[0].getAttribute("result");
				if (result == "success")
				{
					var props = $("property", data);
					props.each(function(idx, el)
					{
						el = $(el);
						if (el.attr("name") == "url")
							$('#sdtxtFileURL').ibxWidget("option", "text", decodeHtmlEncoding(el.attr("value")));
					});
				}
			})
			.fail(function(e) {
	    		var status = e.status;
	    		var statusText = e.statusText;
	    		var text = sformat(ibx.resourceMgr.getString("fatal_error_message"), status, statusText);
				alert("Get Properties failed: " + textStatus);
			});							
	}
	
	$('#sdtxtFileTitle').on('ibx_textchanged', function (e)
	{		
    	var fileTitle = this.validateMaxlength( $('#sdtxtFileTitle').ibxWidget("option", "text") , $('#sdtxtFileTitle').ibxWidget("option", "maxLength") );
    	var fileName = this.validateMaxlength( this.replaceDisallowedChars(fileTitle) , $('#sdtxtFileName').ibxWidget("option", "maxLength") ); 	
		var URL = $('#sdtxtFileURL').ibxWidget("option", "text");
	    $('#sdtxtFileName').ibxWidget("option", "text", fileName);	
		$(form).find(".ibx-dialog-ok-button").ibxWidget('option', 'disabled', fileTitle.length == 0 || URL.length == 0 || fileName.length == 0);		    	
    }.bind(this));
	
	$('#sdtxtFileURL').on('ibx_textchanged', function (e)
	{
		var url = $('#sdtxtFileURL').ibxWidget("option", "text");
		var title = $('#sdtxtFileTitle').ibxWidget("option", "text");
		var name = $('#sdtxtFileName').ibxWidget('option', 'text');
		$(form).find(".ibx-dialog-ok-button").ibxWidget('option', 'disabled', url.length == 0 || title.length == 0 || name.length == 0);		    	
	}.bind(this));
	
	$('#sdtxtFileName').on('ibx_textchanged', function (e)
	{
		var url = $('#sdtxtFileURL').ibxWidget("option", "text");
		var title = $('#sdtxtFileTitle').ibxWidget("option", "text");
		var name = $('#sdtxtFileName').ibxWidget('option', 'text');
		$(form).find(".ibx-dialog-ok-button").ibxWidget('option', 'disabled', url.length == 0 || title.length == 0 || name.length == 0);		    	
	}.bind(this));

	$('#sdtxtFileSummary').on('ibx_textchanged', function (e)
			{
				var url = $('#sdtxtFileURL').ibxWidget("option", "text");
				var title = $('#sdtxtFileTitle').ibxWidget("option", "text");
				var name = $('#sdtxtFileName').ibxWidget('option', 'text');
				$(form).find(".ibx-dialog-ok-button").ibxWidget('option', 'disabled', url.length == 0 || title.length == 0 || name.length == 0);		    	
			}.bind(this));
	
	$('#sdtxtFileName').on('ibx_textchanging', function (e)				
	{
		if (!this.validateChar(e.key, e.keyCode))
			e.preventDefault();
	}.bind(this));


	$(form).find(".ibx-dialog-ok-button").on('click', function (e) 
	{
		$(".form-fill-error-text").empty(); // reset	
		var title = $('#sdtxtFileTitle').ibxWidget('option', 'text');
		var name = $('#sdtxtFileName').ibxWidget('option', 'text');
		var summary = $('#sdtxtFileSummary').ibxWidget('option', 'text');
		var url = $('#sdtxtFileURL').ibxWidget('option', 'text'); 

		var bipUrl = (option == "new") ? "createurl.bip" : "updateurl.bip";
		var bipReq = (option == "new") ? "BIP_CREATE_URL" : "BIP_UPDATE_URL";
		var bipFolder = (option == "new") ? /*home_globals.currentPath*/"" : urlUserInfo["folder"];
		var bipHandle = (option == "new") ? "" : urlUserInfo["handle"];
		
		var uriExec = sformat("{1}/{2}", applicationContext,bipUrl);
		var randomnum = Math.floor(Math.random() * 100000);	
		var argument=
		{
			BIP_REQUEST_TYPE: bipReq,		
			folder: bipFolder,
			name: name,
			desc: title,
			url: url,
			handle: bipHandle,
			summary: summary			 		
		};				 	

		argument[IBI_random] = randomnum;
		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
		this.postDialogCall(uriExec,argument,form, urlUserInfo["folder"] + '/' + urlUserInfo["name"] + ".url");
	}.bind(this));
	
	$(form).on("ibx_beforeclose", function(e, closeData)
	{				
		if(closeData == "ok")
		{
			e.preventDefault();
		}	
	}.bind(this));
}

dmhProto.postDialogCall = function(path, data,form, itemPath)
{
	$.post(path, data , function(retdata, status)
	{
		if (status=="success")
		{
			if(retdata.indexOf)
			{// its a string	
				if(retdata.indexOf("<!DOCTYPE") > -1 && retdata.indexOf("<!DOCTYPE") < 10)
				{
					// does it contain <FailedVariables>
					if(retdata.indexOf("<FailedVariables>") > 0)
					{
						item = ibx.resourceMgr.getString("validation_error");	
						rebootUtil.fatalError(item, false);
					}
					else
					{	
						// we got an html page back.. not good.
						item = ibx.resourceMgr.getString("fatal_error_signon");				
						rebootUtil.fatalError(item, true);
					}
					return;
				}
			}	
			xmlDoc = $.parseXML( retdata );
			var goodResult = false;
			var response=$(xmlDoc).find("RESPONSE");
			if (response.length)
			{
				var x = $(response).find("ACTION_DATA");
				if (x.length)
				{
					var status = $(x).find("status");
					if(status.length)
					{	
						var retvalue = $(status).attr('result');
						if (retvalue && retvalue == "success")
							goodResult = true;
					}	
				}
			}
			else
			{
				var status = $(xmlDoc).find("status");
				if (status.length)
				{	
					var retvalue = $(status).attr('result');
					if (retvalue && retvalue == "success")
						goodResult = true;
				}	
			}
			if (goodResult)
			{
				switch(data.BIP_REQUEST_TYPE)
				{
				
					case "BIP_TEMPLATE_CREATE_FL":
					case "BIP_CREATE_NEW_FOLDER":
					{
//						numItems = home_globals.Items.folderList.length;
//						home_globals.homePage.refreshfolder(home_globals.currentPath);
//						waitForNewFolder();
						break;
					}
					case "BIP_CREATE_URL":
					{
						break;
					}
					case "BIP_UPDATE_URL":
					{
						$(document).dispatchEvent('obj-edited', {path: itemPath});
//						if (home_globals.isWorkspace && window.parent)
//							$(window.parent.document).dispatchEvent('FORCE_ACTION_ON_FOLDER', { "detail":  home_globals.currentPath});
//						else
//						{
//							numItems = home_globals.Items.itemList.length;
//							home_globals.homePage.refreshfolder(home_globals.currentPath);
//							waitForNewItem();
//						}
						break;
					}
					case "BIP_NEW_LINK":
					{
//						if (decodeURIComponent(this.linkTargetPath).indexOf("IBFS:/EDA") != -1)
//							home_globals.homePage.metadataOK("str_new_metadata_available");
//
//						if (home_globals.isWorkspace && window.parent)
//							$(window.parent.document).dispatchEvent('FORCE_ACTION_ON_FOLDER', { "detail":  home_globals.currentPath});
//						else
//						{
//							numItems = home_globals.Items.itemList.length;
//							home_globals.homePage.refreshfolder(home_globals.currentPath);
//							waitForNewItem();
//						}
						break;
					}
					default:
					{
//						numItems = home_globals.Items.itemList.length;
//						home_globals.homePage.refreshfolder(home_globals.currentPath);
//						waitForNewItem();
						break;
					}
				}
				if (form)
					form.ibxWidget('close');
			}
			else
			{		
				var message = $(status).attr('message');
				if (form)
				{
					$(".form-fill-error-text").show();
					$(".form-fill-error-text").append(message);			
					/* Add focus to the 1st input control */
					form.find('.ibx-default-ctrl-focus:first').focus();
				}
				else
					alert(message);
			}									
		}
    }.bind(data), "html");
}


dmhProto.parseBipResponse = function(xmlDoc)
{
	/*
		<RESPONSE>
			<USER_DATA></USER_DATA>
			<ACTION_DATA><status type="" result="success" item="" message="" cascade="" /></ACTION_DATA>
			<ERROR_DATA>
				<ERROR_DETAILS>
					<ERROR_CODE value="200"/>
					<ERROR_DESCRIPTION value="Success"/>
					<ERROR_MESSAGE value=""/>
					<ERROR_RECOVERY_SUGGESTION value="N/A"/>
				</ERROR_DETAILS>
			</ERROR_DATA>
		</RESPONSE>		 
	 */
	var goodResult = null;
	var statusNode = $(xmlDoc).find("status");
	if (!statusNode.length)
	{
		goodResult = ibx.resourceMgr.getString("hpreboot_invalid_response");
	}
	else
	{
		if (statusNode.attr("result") != "success")
		{
			goodResult = $(xmlDoc).find("ERROR_MESSAGE").attr("value");
			if (!goodResult)
				goodResult = $(statusNode).attr("message");
		}
	}

	return goodResult;
};

dmhProto.parseWfirsResponse = function(doc)
{
	var goodResult = null;
	var root = $("ibfsrpc", doc);
	var retcode=root.attr('returncode');	
	if (retcode!="10000")
	{
		goodResult = ((retcode == "1250" || retcode == "1113") ? retcode : root.attr("localizeddesc"));
	}
	
	return goodResult;
};

dmhProto.processDeferredResults = function(args, wfirs)
{
	var allOK = true;
	var doc;
	var statString;
	var errorMsg;
	
	var numResults = args.length;
	if (typeof args[1] == "string")	// only one post
	{
		numResults = 1;
		doc = args[0];
		statString = args[1];
		xhr = args[2];
		if (wfirs)
			errorMsg = this.parseWfirsResponse(doc);
		else
			errorMsg = this.parseBipResponse(doc);
		if (statString != "success" || xhr.status != 200 || errorMsg)
		{
			allOK = false;
		}
	}
	else
	{
		for (var f = 0; f < numResults; f++)
		{
			doc = args[f][0];
			statString = args[f][1];
			xhr = args[f][2];
			if (wfirs)
				errorMsg = this.parseWfirsResponse(doc);
			else
				errorMsg = this.parseBipResponse(doc);
			if (statString != "success" || xhr.status != 200 || errorMsg)
			{
				allOK = false;
				break;
			}
		}
	}
	
	return [allOK, numResults, errorMsg];
};

dmhProto.useContextItem = function(selList, item)
{
	if (!selList || selList.length == 0)
		return true;
	
	if (!item)
		return false;
	
	var notContained = false;
/*	
	for (var i = 0; i < selList.length; i++)
	{
		if (selList[i].fullPath == item.fullPath)
		{
			notContained = false;
			break;
		}
	}
*/	
	return notContained;
};



dmhProto.publish = function(contextItem, selectedItems)
{
	var item = selectedItems;
	if (this.useContextItem(selectedItems, contextItem))
		item = [contextItem];
	
	var uriExec = sformat("{1}/publish.bip", applicationContext);
	var deferredList = [];
	for (var i = 0; i < item.length; i++)
	{
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_PUBLISH",		
	 		ibfsPath: item[i].fullPath
	 	};
		argument[IBI_random] = randomnum;
		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
	 	
	 	deferredList.push($.post(uriExec, argument));
	}

	$.when.apply($, deferredList).always(function()
	{
		var res = this.processDeferredResults(arguments);
		if (!res[0])
			rebootUtil.fatalError(res[2], false);

		$('.cbox-file-box').dispatchEvent('home_publish');
		
		$('.cbox-file-box').dispatchEvent("PROPERTY_CHANGE", {"item": contextItem});


		}.bind(this));
};

dmhProto.unpublish = function(contextItem, selectedItems)
{
	var item = selectedItems;
	if (this.useContextItem(selectedItems, contextItem))
		item = [contextItem];
	
 	var uriExec = sformat("{1}/unpublish.bip", applicationContext);
 	var deferredList = [];
	for (var i = 0; i < item.length; i++)
	{
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_UNPUBLISH",		
	 		ibfsPath: item[i].fullPath
	 	};
		argument[IBI_random] = randomnum;
		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
	 	
	 	deferredList.push($.post(uriExec, argument));
	}

	$.when.apply($, deferredList).always(function()
	{
		var res = this.processDeferredResults(arguments);
		if (!res[0])
			rebootUtil.fatalError(res[2], false);

		$('.cbox-file-box').dispatchEvent('home_unpublish');
		
		$('.cbox-file-box').dispatchEvent("PROPERTY_CHANGE", {"item": contextItem});

	}.bind(this));
};


dmhProto.hide = function(contextItem, selectedItems)
{
	var item = selectedItems;
	if (this.useContextItem(selectedItems, contextItem))
		item = [contextItem];
	
 	var uriExec = sformat("{1}/views.bip", applicationContext);
 	var deferredList = [];
	for (var i = 0; i < item.length; i++)
	{
		var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_HIDE",		
	 		ibfsPath: item[i].fullPath
	 	};
		argument[IBI_random] = randomnum;
		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
	 	
	 	deferredList.push($.post(uriExec, argument));
	}

 	$.when.apply($, deferredList).always(function()
	{
		var res = this.processDeferredResults(arguments);
		if (!res[0])
			rebootUtil.StandardMessage("", ibx.resourceMgr.getString("str_hide_error"), 'error');

		$('.cbox-file-box').dispatchEvent('home_hide');
		
		$('.cbox-file-box').dispatchEvent("PROPERTY_CHANGE", {"item": contextItem});

	}.bind(this));
};

dmhProto.show = function(contextItem, selectedItems)
{
	var item = selectedItems;
	if (this.useContextItem(selectedItems, contextItem))
		item = [contextItem];

	var uriExec = sformat("{1}/views.bip", applicationContext);
	var deferredList = [];
	for (var i = 0; i < item.length; i++)
	{
		var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_SHOW",		
	 		ibfsPath: item[i].fullPath
	 	};
		argument[IBI_random] = randomnum;
		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
	 	
	 	deferredList.push($.post(uriExec, argument));
	}

	$.when.apply($, deferredList).always(function()
	{
		var res = this.processDeferredResults(arguments);
		if (!res[0])
			rebootUtil.StandardMessage("", ibx.resourceMgr.getString("str_show_error"), 'error');

		$('.cbox-file-box').dispatchEvent('home_show');
		
		$('.cbox-file-box').dispatchEvent("PROPERTY_CHANGE", {"item": contextItem});

	}.bind(this));
};


dmhProto.favoriteOK = function(allOK, numFavs, errorMsg)
{
	var msg;
	var key;
	if (allOK)
		key = (numFavs == 1 ? "hpreboot_favorite_added": "hpreboot_favorites_added");
	else
		key = (numFavs == 1 ? "hpreboot_favorite_error" : "hpreboot_favorites_error");

	msg = sformat(ibx.resourceMgr.getString(key), errorMsg);
	rebootUtil.StandardMessage(ibx.resourceMgr.getString("hpreboot_add_to_favorites"), msg, allOK?'success':'warning');
	
	if (allOK)
		$(window.document).dispatchEvent("action_required", {type: 'add_favorite'});

};


dmhProto.addToFavorites = function(contextItem, selectedItems)
{
	var item = selectedItems;
	if (this.useContextItem(selectedItems, contextItem))
		item = [contextItem];
	
	var uriExec = sformat("{1}/views.bip", applicationContext);

	var deferredList = [];
 	for (var i = 0; i < item.length; i++)
	{
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_ADD_FAVORITE",		
	 		path: encodeURIComponent(item[i].fullPath)
	 	};
		argument[IBI_random] = randomnum;
		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
	 	
		deferredList.push($.post(uriExec, argument));
	}

 	$.when.apply($, deferredList).always(function()
	{
		var res = this.processDeferredResults(arguments);
		this.favoriteOK(res[0], res[1], res[2]);
		if (res[0])
			$('.cbox-file-box').dispatchEvent('add-favorite');
	}.bind(this));
};

dmhProto.removeFavorite = function(contextItem, selectedItems)
{
	var item = selectedItems;
	if (this.useContextItem(selectedItems, contextItem))
		item = [contextItem];
	
	var uriExec = sformat("{1}/views.bip", applicationContext);

	var deferredList = [];
 	for (var i = 0; i < item.length; i++)
	{
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_REMOVE_FAVORITE",		
	 		path: encodeURIComponent(item[i].fullPath)
	 	};
		argument[IBI_random] = randomnum;
		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
		deferredList.push($.post(uriExec, argument));
	}

 	$.when.apply($, deferredList).always(function()
	{
		var res = this.processDeferredResults(arguments);
		if (!res[0])
			rebootUtil.fatalError(res[2], false);
		else
			$('.cbox-file-box').dispatchEvent('remove_favorite');
	}.bind(this));
};

dmhProto.locateItem = function(contextItem)
{
	if ($('.view-all-items').is(":visible"))
		$('.cbox-file-box').dispatchEvent('close_view_all');

	
	var locPath;
	if (contextItem.clientInfo.isLink)
		locPath =  contextItem.clientInfo.properties.LinkToPath;
	else
		locPath =  contextItem.fullPath;

	ibx.waitStart();
	$('.home-tree').dispatchEvent('locate-item', {'locPath': locPath});
};

dmhProto.signalShared = function()
{
	$('.cbox-file-box').dispatchEvent('home_share', "domainBoth");
};

dmhProto.shareAdvanced = function(contextItem, selectedItems)
{
	var canShareBasic = ((contextItem.actions.indexOf("shareBasic") != -1) || (contextItem.actions.indexOf("sharedWithOthers") != -1));
	var sw = $("<div></div>").sharewith({dao: ajaxDAO, path: contextItem.fullPath, show: "all", refreshfolder: this.signalShared, shareBasic: canShareBasic});
};

dmhProto.shareBasic = function(contextItem, selectedItems)
{
	$('.cbox-file-box').dispatchEvent('home_sharing');
	var item = selectedItems;
	if (this.useContextItem(selectedItems, contextItem))
		item = [contextItem];
	
 	var uriExec = sformat("{1}/views.bip", applicationContext);
	var deferredList = [];
	for (var i = 0; i < item.length; i++)
	{
	 	var randomnum = Math.floor(Math.random() * 100000);	
		var argument = 
		{
			"BIP_REQUEST_TYPE": "BIP_SHARE_ITEM",
			"ibfsPath": item[i].fullPath
		};
		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
		argument[IBI_random] = randomnum;
		
		deferredList.push($.post(uriExec, argument));
	}
	
	$.when.apply($, deferredList).always(function()
	{
		var res = this.processDeferredResults(arguments);
		if (!res[0])
			rebootUtil.fatalError(res[2], false);

		$('.cbox-file-box').dispatchEvent('home_share');
	}.bind(this));
};

dmhProto.unshare = function(contextItem, selectedItems)
{
	$('.cbox-file-box').dispatchEvent('home_unsharing');
	var item = selectedItems;
	if (this.useContextItem(selectedItems, contextItem))
		item = [contextItem];
	
 	var uriExec = sformat("{1}/views.bip", applicationContext);
	var deferredList = [];
	for (var i = 0; i < item.length; i++)
	{
	 	var randomnum = Math.floor(Math.random() * 100000);	
		var argument = 
		{
			"BIP_REQUEST_TYPE": "BIP_UNSHARE_ITEM",
			"ibfsPath": item[i].fullPath
		};
		
		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
		argument[IBI_random] = randomnum;
		
		deferredList.push($.post(uriExec, argument));
	}
	
	$.when.apply($, deferredList).always(function()
	{
		var res = this.processDeferredResults(arguments);
		if (!res[0])
			rebootUtil.fatalError(res[2], false);

		$('.cbox-file-box').dispatchEvent('home_unshare');
	}.bind(this));
};

dmhProto.refreshFolder = function()
{
	this._domainsContent.element.closest('.home-domains').find('.home-content-top-controls-refresh-btn').dispatchEvent('click');
};

dmhProto.handleDeletes = function(item)
{
	/* prepare the delete....
	if(item.container && item.fullPath == home_globals.currentPath)
	{
		home_globals.currentPath = home_globals.rootPath;
		home_globals.currentItem = null;
	}
	*/	
	
	var uriExec = sformat("{1}/wfirs", applicationContext);					
	var randomnum = Math.floor(Math.random() * 100000);	
	var argument=
	{
			IBFS_path: item.fullPath,
			IBFS_action: "delete",
			IBFS_args: "__null",
			IBFS_random: randomnum,			 		
			IBFS_service: "ibfs"
	};
//	argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
	argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();
	
	return $.when($.post(uriExec, argument));
};

dmhProto.deleteItem = function(contextItem, selectedItems, fromKey)
{
	if (!contextItem && !selectedItems)
		return;
	
	if (hprbUtil.environment.homepageMode == 2)
		return this.removeFavorite(contextItem, selectedItems);
	else if (hprbUtil.environment.homepageMode == 3)
		return this.removeMobileFavorite(contextItem, selectedItems);
		
	if (contextItem && contextItem.fullPath == "IBFS:/WFC/Repository")	// del key on 'Domains'
		return;
	
	var item = selectedItems;
	if (!fromKey && this.useContextItem(selectedItems, contextItem))
		item = [contextItem];
	
	if (!item.length)
		item = [contextItem];

/*		
	// just in case we can ever pick a folder and its child
	function sortItems(a, b)
	{
		return (a.fullPath < b.fullPath ? -1 : a.fullPath > b.fullPath ? 1 : 0);
	}
	
	item.sort(sortItems);

	if (item.length > 1)
	{
		for (var i = item.length-1; i >= 0; i--)
		{
			for (var j = i-1; j >= 0; j--)
			{
				if (item[i].type != "PGXBundle" && item[i].container)
				{
					if (item[i].fullPath.indexOf(item[j].fullPath) == 0)
						item.splice(i, 1);
				}
			}
		}
	}
*/		
	var areYouSure = false;	// don't ask R U Sure?
	
	for (var i = 0; i < item.length; i++)
	{
		if (!item[i].clientInfo.properties.Cascade)
		{
			areYouSure = true;
			break;
		}
	}

	if (areYouSure)
	{
		var deltext = ibx.resourceMgr.getString("delete_question");
		var allquest = ibx.resourceMgr.getString("all_question");
		var itemText = item.length == 1 ? "'" + item[0].description + "'": allquest;
		 
		var text = sformat("{1} {2} ?", deltext, itemText);
		var options = 
		{
			type:"medium warning",
			caption: ibx.resourceMgr.getString("str_delete"),
			buttons:"okcancel",		
			messageOptions:{text:text}
		};
		var dlg = $.ibi.ibxDialog.createMessageDialog(options);	
		dlg.ibxDialog("open").on("ibx_close", {"itemList": item}, this.delete2.bind(this));
	}
	else
	{
		var e = jQuery.Event("click");
		e.data = {"itemList": item};
		this.delete2(e, "ok");
	}
};

dmhProto.delete2 = function(e, btn, curIndex, skipCascadeCheck, deferredList)
{
	if (btn != "ok")
		return;

	var itemList = e.data.itemList;
	
	var d = curIndex ? curIndex : 0;
	
	if (d != itemList.length)
	{
		if (!skipCascadeCheck && itemList[d].clientInfo.properties.Cascade)
		{
			var cascadeInfo = itemList[d].clientInfo.properties.Cascade.split(',');
			cascadeInfo = "<br/><br/>" + cascadeInfo.join('<br/>');
			var text = sformat(ibx.resourceMgr.getString("str_cascade"), cascadeInfo);
			var options = 
			{
				type:"medium warning",
				caption: ibx.resourceMgr.getString("str_delete_domain") + " - " + itemList[d].description,
				buttons:"okcancel",		
			};
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxWidget("member", "message").html(text);	// to allow formatting
			dlg.ibxDialog("open").on("ibx_close", {"itemList": itemList}, function(e, btn)
			{
				if(btn=="ok")
					this.delete2(e, "ok", d, true, deferredList);
				else
					this.delete2(e, "ok", ++d, false, deferredList);
			}.bind(this));
			return;
		}
	
		if (!deferredList)
			deferredList = [];
		
		ibx.waitStart();
		deferredList.push($.when(this.handleDeletes(itemList[d])).always(function()
		{
				var res = this.processDeferredResults(arguments, true);
				if (!res[0])
				{
					if (res[2] != "1250" && res[2] != "1113")
						rebootUtil.fatalError(res[2], false);
					else
					{
						// 1250: admin unable to delete, override?, 1113: non-admin unable to delete folder w/ private
						var text = sformat(ibx.resourceMgr.getString("str_delete_"+res[2]), itemList[d].description);
						var options = 
						{
							type:"medium warning",
							caption:"Delete",
							buttons: res[2] == "1250" ? "okcancel" : "ok",		
							messageOptions:{text:text}
						};
						var dlg = $.ibi.ibxDialog.createMessageDialog(options);	
						dlg.ibxDialog("open").on("ibx_close", {"itemList": itemList}, function(e, btn)
						{
							if(btn=="ok")
							{
								if (res[2] == "1113")	// non-admin unable to delete folder w/ private
								{
									this.delete2(e, "ok", ++d, false, deferredList);
									return;
								}
								
								var uriExec = sformat("{1}/mode.bip", applicationContext); 
								var randomnum = Math.floor(Math.random() * 100000);	
								var argument=
								{
									"BIP_REQUEST_TYPE": "BIP_SET_MODE",
									"mode": "manager"
								};
								argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
								argument[IBI_random] = randomnum;
	
								$.when($.post(uriExec, argument)).always(function(data)
								{
									var uriExec = sformat("{1}/wfirs", applicationContext);					
									var randomnum = Math.floor(Math.random() * 100000);	
									var argument=
									{
											IBFS_path: itemList[d].fullPath,
											IBFS_action: "delete",
											IBFS_args: "__null",
											IBFS_random: randomnum,			 		
											IBFS_service: "ibfs"
									};
									argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
									$.when($.post(uriExec, argument)).always(function(data)
											{
	 											var uriExec = sformat("{1}/mode.bip", applicationContext); 
	 											var randomnum = Math.floor(Math.random() * 100000);	
	 											var argument=
	 											{
	 												"BIP_REQUEST_TYPE": "BIP_SET_MODE",
	 												"mode": "normal"
	 											};
	 											argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
	 											argument[IBI_random] = randomnum;
	 											$.when($.post(uriExec, argument)).always(function(data)
	 											{
			 							 			this.delete2(e, "ok", ++d, false, deferredList);
	 											}.bind(this));
											}.bind(this));
								}.bind(this));
							}
						}.bind(this));
					}
				}
				else
				{
					ibx.waitStop();
					this.delete2(e, "ok", ++d, false, deferredList);
				}
		}.bind(this)));
	}
	
	if (d == itemList.length)
	{
		$.when.apply($, deferredList).always(function()
		{
			$(document).dispatchEvent('home_delete');
			$(window.document).dispatchEvent("action_required", {type: 'resource_deleted'});
		}.bind(this));
	}

};

dmhProto.duplicate = function(contextItem, selectedItems)
{		
	var item = selectedItems;
	if (this.useContextItem(selectedItems, contextItem))
		item = [contextItem];
	
 	var uriExec = sformat("{1}/duplicate.bip", applicationContext);
	var deferredList = [];
	for (var i = 0; i < item.length; i++)
	{
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_DUP",		
	 		ibfsPath: item[i].fullPath,
	 		type: (item[i].container ? "folder" : "item"),
	 		folder: item[i].fullPath.substring(0, item[i].fullPath.lastIndexOf('/'))
	 	};
		argument[IBI_random] = randomnum;
		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
	 	
	 	deferredList.push($.post(uriExec, argument));
	}
	
	$.when.apply($, deferredList).always(function()
	{
		var res = this.processDeferredResults(arguments);
		if (!res[0])
			rebootUtil.StandardMessage("", ibx.resourceMgr.getString("str_duplicate_error"), 'error');

		$('.cbox-file-box').dispatchEvent('home_dup');
		
	}.bind(this));
};

dmhProto.editScenario = function(contextItem)
{
	var scenarioName = contextItem.name;
	var state = contextItem.private ? "unpublished" : "published";

	// CM-48 - only a single encode required - bug shows up when blank in title
	var params =
		{
			"scenarioName": encodeURIComponent(scenarioName),
			"state": state,
			"canPublish": (contextItem.actions.indexOf(",publish") != -1)
		};
	params[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();

	var origin = location.origin;
	var context = location.pathname.split('/')[1]
	var ac = origin + '/' + context;
	var url = sformat("{1}/tools/change_management/changemanagement.jsp", ac);		

	var height = screen.height - 200;
	var width = (screen.width < 1100) ? screen.width : 1100;
	//	var width = screen.width - 140;
	var itop = (screen.height - height) / 2;
	var left = (screen.width - width) / 2;

	var win = window.open("", "_blank", "width=" + width + ", height=" + height + ", top=" + itop + ", left=" + left + ", resizable=yes");
	var doc = win.document;
	var form = SharedUtil.buildForm(doc, url, params);
	form.submit();
	return;
};

dmhProto.importPackage = function(contextItem)
{
	var gitImportDlg = ibx.resourceMgr.getResource('.cm-import-dlg');
	gitImportDlg.ibxWidget('option', {'captionOptions': {'text': ibx.resourceMgr.getString("hpreboot_import_package") + ': ' + contextItem.name}});
	gitImportDlg.ibxWidget('open')
	
	gitImportDlg.on("ibx_beforeclose", function (dlg, e, closeData)
	{						
		if(closeData == "ok")
		{
			var waitString = ibx.resourceMgr.getString("hpreboot_import_wait");
			var mdlg = ibx.resourceMgr.getResource('.bip-export-wait-dialog');
			var waitLabel = mdlg.find('.bip-export-wait-text');
			waitLabel.ibxWidget('option', 'glyphClasses', "fas fa-info-circle");
			waitLabel.ibxWidget('option', 'text', waitString);
			waitLabel.find('.ibx-label-glyph').css({'color': "blue", 'font-size': "18px"});
			mdlg.ibxWidget('option', {'buttons': "ok", 'captionOptions': {'text': ibx.resourceMgr.getString("hpreboot_message")}});
			mdlg.find('.ibx-dialog-ok-button').hide();
			mdlg.find('.ibx-title-bar-close-button').ibxWidget('option', 'disabled', true).hide();
			
			function rotateWaitMsg(waitLabel, waitString)
			{
				var t = waitLabel.ibxWidget('option', 'text');
				if (t.indexOf("...") != -1)
					waitLabel.ibxWidget('option', 'text', waitString);
				else if (t.indexOf("..") != -1)
					waitLabel.ibxWidget('option', 'text', waitString + "...");
				else if (t.indexOf(".") != -1)
					waitLabel.ibxWidget('option', 'text', waitString + "..");
				else if (t.indexOf(".") == -1)
					waitLabel.ibxWidget('option', 'text', waitString + ".");
			}

			mdlg.ibxWidget('open');
			var msgTimer = setInterval(rotateWaitMsg, 500, waitLabel, waitString);
			dlg = dlg.ibxWidget('instance');
			var uriExec = sformat("{1}/scenario.bip", applicationContext);
		 	var argument=
		 	{
		 		"BIP_REQUEST_TYPE": "BIP_IMPORT",
		 		"importName": contextItem.name,
		 		"resources": (dlg._addNew.ibxWidget('option', 'checked') ? "1" : "2"),
		 		"roles": (dlg._rolesCb.ibxWidget('option', 'checked') ? (dlg._rolesAddNew.ibxWidget('option', 'checked') ? "1" : "2") : "0"),
		 		"groups": (dlg._groupsCb.ibxWidget('option', 'checked') ? (dlg._groupsAddNew.ibxWidget('option', 'checked') ? "1" : "2") : "0"),
		 		"users": (dlg._usersCb.ibxWidget('option', 'checked') ? (dlg._usersAddNew.ibxWidget('option', 'checked') ? "1" : "2") : "0"),
		 		"rules": (dlg._usersCb.ibxWidget('option', 'checked') ? "true" : "false")
		 	};
			argument[IBI_random] =  Math.floor(Math.random() * 100000);
			argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();
		 	$.post(uriExec, argument)
				.done(function( data ) 
				{
					clearInterval(msgTimer);
					data = $(data);
					var status = data.find('status');
					var result = status.attr("result");
					if (result == "success")
						waitLabel.ibxWidget('option', 'text', ibx.resourceMgr.getString("hpreboot_import_ok"));
					else
						waitLabel.ibxWidget('option', 'text', status.attr('message'));

					mdlg.find('.ibx-dialog-ok-button').show();
				})
				.fail(function(e) {
		    		var status = e.status;
		    		var statusText = e.statusText;
		    		var text = sformat(ibx.resourceMgr.getString("fatal_error_message"), status, statusText);
					waitLabel.ibxWidget('option', 'text', text);
				});							
		}
	}.bind(this, gitImportDlg));
};

dmhProto.downloadTranslations = function(contextItem)
{
	
	var action = location.protocol + applicationContext + "/wfirs";
	var acceptCharset = (typeof (hprbUtil.environment.acceptCharset) == "undefined" ? "" : hprbUtil.environment.acceptCharset);

	var options =
	{
	        "action":action,
	        "encType": "application/x-www-form-urlencoded; charset=utf-8",
	        "acceptCharset": acceptCharset,
	        "fields":
	        {
		 		"IBFS_action": "exportPropFilesForLanguage",
		 		"IBFS_path": (contextItem.type == "LinkItem" ? contextItem.clientInfo.properties.LinkToPath : contextItem.fullPath),		
		 		"IBFS_service": "utils"
	        }
	};
	options.fields[IBI_random] = Math.random();
	options.fields[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
	
	$("<form>").ibxForm(options).ibxForm("submit");
};

dmhProto.scheduleViewLog = function(contextItem)
{
	var uriExec = sformat("{1}/slog.rc?ibfsId={2}",	applicationContext,	contextItem.handle);
	this.popupWindow(uriExec, "", 360, 435);
};

dmhProto.viewAllVersion = function(inItem)
{
 	var randomnum = Math.floor(Math.random() * 100000);	
	var uriExec = sformat("{1}/lib-versions.rc?ibfsId={2}" + "&" + IBI_random + "=" + randomnum, applicationContext,	inItem.handle);
	this.popupWindow(uriExec, "", 800, 600);
};


dmhProto.viewLastVersion = function(contextItem)
{
	var uriExec = sformat("{1}/lib-report.rc?id={2}",	applicationContext,	encodeURIComponent(contextItem.handle));
	this.runInOutputdiv(contextItem, uriExec);
};

dmhProto.scheduleItemEmail = function(inItem)
{
	var pp = inItem.parentPath;
	if (inItem.type == "LinkItem")
	{
		pp = inItem.clientInfo.properties.LinkToPath;
		pp = pp.substring(0, pp.lastIndexOf('/'));
	}
	var uriExec = sformat("{1}/se.rc?folderPath={2}&fexIbfsId={3}&distMethod=EMAIL",			
			applicationContext,	encodeURIComponent(encodeURIComponent(pp)), encodeURIComponent(inItem.handle));
	this.popupWindow(uriExec, "", 0, 0); 
};

dmhProto.scheduleItemFile = function(inItem)
{
	var pp = inItem.parentPath;
	if (inItem.type == "LinkItem")
	{
		pp = inItem.clientInfo.properties.LinkToPath;
		pp = pp.substring(0, pp.lastIndexOf('/'));
	}
	var uriExec = sformat("{1}/se.rc?folderPath={2}&fexIbfsId={3}",			
			applicationContext,	encodeURIComponent(encodeURIComponent(pp)), encodeURIComponent(inItem.handle));
	this.popupWindow(uriExec, "", 0, 0); 
};

dmhProto.scheduleItemPrinter = function(inItem)
{
	var pp = inItem.parentPath;
	if (inItem.type == "LinkItem")
	{
		pp = inItem.clientInfo.properties.LinkToPath;
		pp = pp.substring(0, pp.lastIndexOf('/'));
	}
	var uriExec = sformat("{1}/se.rc?folderPath={2}&fexIbfsId={3}&distMethod=PRINT",			
			applicationContext,	encodeURIComponent(encodeURIComponent(pp)), encodeURIComponent(inItem.handle));
	this.popupWindow(uriExec, "", 0, 0); 
};

dmhProto.scheduleItemFTP = function(inItem)
{
	var pp = inItem.parentPath;
	if (inItem.type == "LinkItem")
	{
		pp = inItem.clientInfo.properties.LinkToPath;
		pp = pp.substring(0, pp.lastIndexOf('/'));
	}
	var uriExec = sformat("{1}/se.rc?folderPath={2}&fexIbfsId={3}&distMethod=FTP",			
			applicationContext,	encodeURIComponent(encodeURIComponent(pp)), encodeURIComponent(inItem.handle));
	this.popupWindow(uriExec, "", 0, 0); 
};

dmhProto.scheduleItemLibrary = function(inItem)
{
	var pp = inItem.parentPath;
	if (inItem.type == "LinkItem")
	{
		pp = inItem.clientInfo.properties.LinkToPath;
		pp = pp.substring(0, pp.lastIndexOf('/'));
	}
	var uriExec = sformat("{1}/se.rc?folderPath={2}&fexIbfsId={3}&distMethod=LIBRARY",			
			applicationContext,	encodeURIComponent(encodeURIComponent(pp)), encodeURIComponent(inItem.handle));
	this.popupWindow(uriExec, "", 0, 0); 
};

dmhProto.scheduleItemMR = function(inItem)
{
	var pp = inItem.parentPath;
	if (inItem.type == "LinkItem")
	{
		pp = inItem.clientInfo.properties.LinkToPath;
		pp = pp.substring(0, pp.lastIndexOf('/'));
	}
	var uriExec = sformat("{1}/se.rc?folderPath={2}&fexIbfsId={3}&distMethod=MRE",			
			applicationContext,	encodeURIComponent(encodeURIComponent(pp)), encodeURIComponent(inItem.handle));
	this.popupWindow(uriExec, "", 0, 0); 
};



dmhProto.designerScheduler = function(contextItem)
{
	var dialogDemo = $("<div>").ibxEmailSchedulerDialog();
	var fp = contextItem.fullPath;
	if (contextItem.type == "LinkItem")
		fp = contextItem.clientInfo.properties.LinkToPath;
	
	dialogDemo.ibxEmailSchedulerDialog("new", fp);
};

dmhProto.designerSchedulerEdit = function(contextItem)
{
	var dialogDemo = $("<div>").ibxEmailSchedulerDialog();
	dialogDemo.ibxEmailSchedulerDialog("edit", contextItem.fullPath);
};


dmhProto.manageAlias = function(contextItem)
{
	var _portalId = "";
	var _portalPath = contextItem.fullPath;
	var _startPath = contextItem.parentPath;
	var _portalTitle = contextItem.description;
	var _portalName = contextItem.name;
	var _defaultURL = applicationScheme + ":" + applicationContext + "/portal/";
	var _startingURLPath = _startPath.replace("IBFS:/WFC/Repository/", "");

	var _isLink = contextItem.clientInfo.isLink && contextItem.clientInfo.isLink == true;

	if(_isLink)
	{
		_portalPath = contextItem.clientInfo.properties.LinkToPath;
	}
	
	var _manageAliasDlg = ibx.resourceMgr.getResource('.manage-aliases-dialog', true);		
	_manageAliasDlg.ibxWidget("option", "captionOptions", {text: ibx.resourceMgr.getString("portal_alias_manage_alias")});
	_manageAliasDlg.ibxWidget({buttons:"okcancel"});	
			
	_init();
	
	_manageAliasDlg.ibxWidget('open');	
	
	_resetError();
	
	$(_manageAliasDlg).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', true);		
	
	_manageAliasDlg.ibxWidget("member","_manageAliasesPortalAliasValue").on('ibx_textchanged', _AliasValueChanged.bind(this));	
	
	_manageAliasDlg.ibxWidget("member","_manageAliasesPortalAliasValue").on('ibx_textchanging', _AliasValueChanged.bind(this));		
	
	function _AliasValueChanged(e)
	{			
		var disallowedChars = Ibfs.ibfs.getSystemInfo().subsystemInfo.EDA.pathValidationInfo.disallowedChars;
		
		var descrVal = _manageAliasDlg.ibxWidget("member","_manageAliasesPortalAliasValue").ibxWidget("option", "text");	

		for(var i = 0; i < disallowedChars.length; i ++)
		{	
			var idx = 0;
			
			while(descrVal.indexOf(disallowedChars[i]) != -1)
			{			
				descrVal = descrVal.replace(disallowedChars[i], "");
				idx ++;
			}
		}
    	
    	if (descrVal.length > 0 )		
    		$(_manageAliasDlg).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);   
    	
    	_manageAliasDlg.ibxWidget("member", "_manageAliasesPortalAliasValue").ibxWidget("option", "text", descrVal);
    	
		_manageAliasDlg.ibxWidget("member", "_manageAliasesPortalAliasUrlValue").ibxWidget("option", "text", _defaultURL + descrVal);
	}
	
	var _portalTitleValue = _manageAliasDlg.ibxWidget("member", "_manageAliasesPortalTitleValue");
	_portalTitleValue.ibxWidget("option", "text", _portalTitle);
	
	var _portalPathValue = _manageAliasDlg.ibxWidget("member", "_manageAliasesPortalPathValue");
	_portalPathValue.ibxWidget("option", "text", _portalPath);

	if(_isLink)
	{		
		_manageAliasDlg.ibxWidget("member", "_manageAliasesPortalDefaultUrlValue").ibxWidget("option", "text", _defaultURL + _portalPath.replace("IBFS:/WFC/Repository/", "").replace(".prtl", ""));
	}
	else
	{			
		_manageAliasDlg.ibxWidget("member", "_manageAliasesPortalDefaultUrlValue").ibxWidget("option", "text", _defaultURL + _startingURLPath + _portalName.replace(".prtl", ""));
	}
	
	_manageAliasDlg.on("ibx_beforeclose", function (e, closeData)
	{						
		if(closeData == "ok")
		{
			e.preventDefault();

			_onOK(e, this);				
		}
		
	}.bind(this));
	
	var _portalAliasValue = _manageAliasDlg.ibxWidget("member", "_manageAliasesPortalAliasValue").focus();
	
	function _init()
	{
		
		var uriExec = sformat("{1}/views.bip", applicationContext);
		var randomnum = Math.floor(Math.random() * 100000);	
		var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_RETREIVE_ALIASES",		
	 		ViewPath: encodeURIComponent(_portalPath),
	 	};
		argument[IBI_random] = randomnum;
 	
		$.get({	"url": uriExec,	"data": argument})
			.done(function( data ) 
			{				
				
				var errorCode = $("ERROR_CODE", data);
				el = $(errorCode);
				
				var errorCodeValue = el.attr("value"); 
				
				var _portalAliasValue = _manageAliasDlg.ibxWidget("member", "_manageAliasesPortalAliasValue");

				if(errorCodeValue =="200")
				{
				
					var portal_summary = $("portal", data);	
					el = $(portal_summary);
					
					var rPortalid = el.attr("portalid");
					_portalId = rPortalid;
					
					var alias_summary = $("alias", data);
					el = $(alias_summary);
					
					var rAliasid = el.attr("aliasid");
					if(rAliasid)
						_portalAlis = rAliasid;
					
					_portalAliasValue.ibxWidget("option", "text", _portalAlis);
					
					_manageAliasDlg.ibxWidget("member", "_manageAliasesPortalAliasUrlValue").ibxWidget("option", "text", _defaultURL + _portalAlis);
				}
				else
				{
					var errorText = "";
					
					var errorDescription = $("ERROR_DESCRIPTION", data);
					if(errorDescription)
					{
						el = $(errorDescription);
						errorText += el.attr("value");
					}
					
					var errorMessage = $("ERROR_MESSAGE", data);
					if(errorMessage)
					{
						el = $(errorMessage);
						errorText += " - " + el.attr("value");	
					}
					
					_setError(errorText);

					$(_manageAliasDlg).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', true);
				}
			});
	}		
	
	function _onOK(e, home)
	{			
		_resetError();
		
		var newPortalAlias = _manageAliasDlg.ibxWidget("member", "_manageAliasesPortalAliasValue").ibxWidget("option", "text");
		
		if (_portalAlis == newPortalAlias)
		{
			_manageAliasDlg.ibxWidget('close');
		}
		else
		{		
			var disallowedChars = Ibfs.ibfs.getSystemInfo().subsystemInfo.EDA.pathValidationInfo.disallowedChars;
			
			var hasProhibitedCars = false;
			
			for(var i =0; i < disallowedChars.length; i++)
			{
				if(newPortalAlias.indexOf( disallowedChars[i] ) > -1)
				{
					hasProhibitedCars = true;
					break;
				}
			}
			
			if(hasProhibitedCars)
			{
				_setError(sformat(ibx.resourceMgr.getString("portal_alias_invalid_characters"), newPortalAlias));
				return;
			}
			
							
			var uriExec = sformat("{1}/views.bip", applicationContext);
			var randomnum = Math.floor(Math.random() * 100000);	

			if (_portalAlis.trim().length == 0)
			{ // Create       $.get() call encodes parameters automatically.  We now needs single encode in here
				newPortalAlias = encodeURIComponent(newPortalAlias);
				
				var argument=
			 	{
			 		BIP_REQUEST_TYPE: "BIP_CREATE_ALIAS",		
			 		ViewID: _portalId,
			 		ViewAlias: newPortalAlias
			 	};
	    		argument[IBI_random] = randomnum;
			}
			else
			{
				if (newPortalAlias.trim().length == 0)
				{ // Delete
					var argument=
				 	{
				 		BIP_REQUEST_TYPE: "BIP_DELETE_ALIASES",		
				 		ViewID: _portalId
				 	};
		    		argument[IBI_random] = randomnum;
				}
				else
				{ // Update   $.get() call encodes parameters automatically.  We now needs single encode in here
					newPortalAlias = encodeURIComponent(newPortalAlias);
					_portalAlis = encodeURIComponent(_portalAlis);
					var argument=
				 	{
				 		BIP_REQUEST_TYPE: "BIP_UPDATE_ALIAS",		
				 		ViewID: _portalId,
				 		ViewAlias: _portalAlis,
				 		ViewAliasNew: newPortalAlias
				 	};
		    		argument[IBI_random] = randomnum;
				}
			}
			
			$.get({	"url": uriExec,	"data": argument})
			.done(function( data ) 
			{				
				
				var errorCode = $("ERROR_CODE", data);
				el = $(errorCode);
				
				var errorCodeValue = el.attr("value"); 
				
				if(errorCodeValue =="200") 
				{
					_manageAliasDlg.ibxWidget('close');
					this.clientInfo.alias = newPortalAlias;
					//home.refreshfolder(_startPath);
				}
				else
				{
					var errorText = "";
					
					if(errorCodeValue == "10020")
					{
						errorText = sformat(ibx.resourceMgr.getString("portal_alias_duplicate_alias"), decodeURIComponent(newPortalAlias));
					}
					else
					{
						var errorDescription = $("ERROR_DESCRIPTION", data);
						if(errorDescription)
						{
							el = $(errorDescription);
							errorText += el.attr("value");
						}
						
						var errorMessage = $("ERROR_MESSAGE", data);
						if(errorMessage)
						{
							el = $(errorMessage);
							errorText += " - " + el.attr("value");	
						}
					}
					
					_setError(errorText);

					$(_manageAliasDlg).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', true);
					
					_portalAliasValue.focus();
				}
			}.bind(contextItem));
		}
		
	}
	
	function _resetError()
	{
		var errorLabel = _manageAliasDlg.ibxWidget("member", "_manageAliasesError");
		errorLabel.ibxWidget("option", "text", "");
		errorLabel.hide();
	}
	
	function _setError(message)
	{
		var errorLabel = _manageAliasDlg.ibxWidget("member", "_manageAliasesError");
		errorLabel.ibxWidget("option", "text", message);
		errorLabel.show();
	}
};


dmhProto.processV5Portal = function(mode, inItem, outputPath, isWorkspace, needSaveDlg)
{  // mode = New or Edit
	var manifest;
	var inSetup = false;
	var base = location.protocol + applicationContext + "/portal/"; 
	var form = ibx.resourceMgr.getResource('.create-pvd-dialog');
	var item = inItem;
	var isCreate = mode == 'new';
	
	if (!isCreate)
	{
		var itemPath = (item.type == "LinkItem" ? item.clientInfo.properties.LinkToPath : item.fullPath);
		var itemName = (item.type == "LinkItem" ? item.clientInfo.properties.LinkToPath.substring(item.clientInfo.properties.LinkToPath.lastIndexOf('/')+1) : item.name);
		var itemTitle;
		if (item.type != "LinkItem")
			itemTitle = item.description;
		else
		{
			Ibfs.ibfs.getItem(item.clientInfo.properties.LinkToPath, false, {asJSON: true, async: false}).done(function (cInfo)
			{
				itemTitle = cInfo.result.description;
			});
		}
		this._logoPath = (!inItem ) ?  /*home_globals.currentPath*/ "" : inItem.parentPath;
	}

	if (isCreate)
	{
		function validatePath(outputPath)
		{
			var path = outputPath;
			Ibfs.ibfs.getItemInfo(outputPath, false, {asJSON: true, async: false}).done(function(cInfo)
			{
				if (cInfo.result.fullPath == "IBFS:/WFC/Repository")
					path = null;
				else
				{
					if (cInfo.result.type == 'PRTLXBundle')
						path = cInfo.result.parentPath.substring(0, cInfo.result.parentPath.lastIndexOf('/'));
					else
						path = validatePath(cInfo.result.parentPath);
				}
			});
			
			return path;
		}
		
		var op = validatePath(outputPath);
		if (op)
		{
			outputPath = op;
			$('.home-old-workspaces iframe')[0].contentWindow.home_globals.homePage.expandTreeFolder(outputPath, true, true);
		}
		
		form.find(".pvd-url").closest('.sd-input-div').hide();
		if (outputPath.indexOf('~') != -1)
			form.find(".pvd-pages-menu").closest('.sd-input-div').hide();
	}
	
	function _getThemes()
	{
		Ibfs.ibfs.listItems("IBFS:/WFC/Global/Themes/Standard", null, null, { asJSON: true, clientSort: false, async: false }).done(function (exInfo)
		{						
			$.each(exInfo.result, function (idx, folder)
			{
				if (folder.type == 'MRFolder')
				{
					Ibfs.ibfs.listItems(folder.fullPath, null, null, { asJSON: true, clientSort: false, async:false }).done(function (exInfo)
					{									
						$.each(exInfo.result, function (i, item)
						{
							if (item.name == "theme.css")
							{
								var newItem= $("<div class='pvd-item-select'>").ibxSelectItem({ text: folder.description, userValue: item.fullPath, selected: $(".pvd-theme").find(".pvd-item-select").length == 0});
								$(".pvd-theme").ibxWidget("addControlItem", newItem);
						}	
						});
					});
				}
			});
		});
				
		Ibfs.ibfs.listItems("IBFS:/WFC/Global/Themes/Custom", null, null, { asJSON: true, clientSort: false, async:false }).done(function (exInfo)
		{							
			$.each(exInfo.result, function (idx, folder)
			{
				if (folder.type == 'MRFolder')
				{
					Ibfs.ibfs.listItems(folder.fullPath, null, null, { asJSON: true, clientSort: false, async : false }).done(function (exInfo)
					{
						$.each(exInfo.result, function (i, item)
						{
							if (item.name == "theme.css")
							{	
								var newItem= $("<div>").ibxSelectItem({ text: folder.description, userValue: item.fullPath});
								$(".pvd-theme").ibxWidget("addControlItem", newItem);
							}	
						});
					});
				}
			});
		});
	}
	
	function _onBrowse (e, skipChk) 
	{
		var allowFolder = false;
		var path = this._logoPath;
		var fileTypes = [[ibx.resourceMgr.getString("str_all_images"),"all"],["PNG", "png"], ["GIF", "gif"], ["JPG", "jpg"], ["SVG", "svg"]];
	
		var saveDlg = ibx.resourceMgr.getResource('.open-dialog-resources', true);
		saveDlg.ibxWidget({refocusLastActiveOnClose: false , fileTypes: fileTypes, disableKeyboardInput: true, dlgType:"open", selectFolder: allowFolder, title: ibx.resourceMgr.getString("home_select"), ctxPath: path});			
		saveDlg.ibxWidget('open');	
		saveDlg.on("ibx_beforeclose", function(e, closeData)
		{
	
		}).on("ibx_close", function (e, closeData)
		{
			$(".create-pvd-dialog").focus();
			if(closeData == "ok")
			{
				var fileName = saveDlg.ibxWidget('fileName');			
				var description = saveDlg.ibxWidget('fileTitle');
				var ibfsItems = saveDlg.ibxWidget('ibfsItems');
				var itemPath = (ibfsItems.length > 0) ? ibfsItems[0].fullPath : "";				
				$(".pvd-logo").ibxWidget('option', 'text', itemPath);

				form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (!form.find(".pvd-name").ibxWidget("option", "text").length || !form.find(".pvd-title").ibxWidget("option", "text").length));        	
			}
		});			
	}	
	
	
	form.ibxWidget('open');
	$(".form-fill-error-text").hide();
	form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', true);
	if (mode == "new")
	{
		$(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("str_create_new_V5_portal"));
		$(".ibx-dialog-ok-button").ibxWidget('option', 'text', ibx.resourceMgr.getString("str_create"));
//		if (home_globals.currentItem.inMyContent)
//			form.find('.pvd-pages-menu').hide();
	}
	else
	{
		$(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("str_create_edit_V5_portal"));
		$(".ibx-dialog-ok-button").ibxWidget('option', 'text', ibx.resourceMgr.getString("str_save"));
		$(".pvd-create-pages-menu").hide();
	}
	
	$(".navigation-two-level-side").prop('title', ibx.resourceMgr.getString("tooltips_Two_level_side"));
	$(".navigation-three-level").prop('title', ibx.resourceMgr.getString("tooltips_three_level"));
	$(".navigation-two-level-top").prop('title', ibx.resourceMgr.getString("tooltips_two_level_top"));

	form.find(".pvd-logo").on('ibx_textchanged', function (e)
	{
		if (!inSetup)
			form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (!form.find(".pvd-name").ibxWidget("option", "text").length || !form.find(".pvd-title").ibxWidget("option", "text").length));        	
	});
	
	$(".pvd-logo-browser").on('click', _onBrowse.bind(this));
	
	form.find(".pvd-hide-logo").on('ibx_change', function (e)
	{
		if ($(this).ibxWidget('option', 'checked'))
		{
			form.find(".pvd-logo").ibxWidget('option', 'disabled', true);
			form.find(".pvd-logo-browser").ibxWidget('option', 'disabled', true);
		}
		else
		{
			form.find(".pvd-logo").ibxWidget('option', 'disabled', false);
			form.find(".pvd-logo-browser").ibxWidget('option', 'disabled', false);
		}
	});

	
	$(".portal-show-banner").on("ibx_change", function(e)
	{
		if ($(e.target).ibxWidget('checked'))
		{			
			$(".pvd-show-title-banner").ibxWidget("option", "checked", true);
			$(".pvd-show-title-banner").ibxWidget("option", "disabled", false);		
			$('.pvd-hide-logo').ibxWidget('option', 'disabled', false);
			switch($(".pvd-navigation").ibxWidget('userValue'))
			{
				case "2-top":
				case "3-level": 
				{
					$(".pvd-top-navigation").ibxWidget("option", "disabled", false);
					break;
				}
			}
		}
		else
		{ 
			$(".pvd-top-navigation").ibxWidget("option", "checked", false);
			$(".pvd-top-navigation").ibxWidget("option", "disabled", true);
			$(".pvd-show-title-banner").ibxWidget("option", "checked", false);
			$(".pvd-show-title-banner").ibxWidget("option", "disabled", true);		
			$('.pvd-hide-logo').ibxWidget('option', 'disabled', true);
		}
	});
	
	form.find(".pvd-theme").on('ibx_textchanged', function (e)
	{
		if (!inSetup)
			form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (!form.find(".pvd-name").ibxWidget("option", "text").length || !form.find(".pvd-title").ibxWidget("option", "text").length));        	
	});
	
	$(".pvd-theme").on("ibx_change", function(e)
	{
		if (!inSetup)
			form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (!form.find(".pvd-name").ibxWidget("option", "text").length || !form.find(".pvd-title").ibxWidget("option", "text").length));        	
	});
	
	$(".pvd-navigation").on("ibx_change", function(e)
	{
		switch($(e.target).ibxWidget('userValue'))
		{
			case "2-side":
			{
				$(".pvd-top-navigation").ibxWidget("option", "checked", false);
				$(".pvd-top-navigation").ibxWidget("option", "disabled", true);
				break;
			}
			case "2-top":
			case "3-level": 
			default:	//no tool, no special type, use text editor
			{
				if ($(".portal-show-banner").ibxWidget('checked'))
					$(".pvd-top-navigation").ibxWidget("option", "disabled", false);
				else
					$(".pvd-top-navigation").ibxWidget("option", "disabled", true);
				break;
			}
		}
		
		if (item && !inSetup)
			form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (!form.find(".pvd-name").ibxWidget("option", "text").length || !form.find(".pvd-title").ibxWidget("option", "text").length));        	

	}.bind(item));
	
	var folder = "";
	if (item)
	{
		var fp = itemPath;
		folder = fp.split("/Repository/"); /*home_globals.currentPath.split("/Repository/");*/
	}
	this.urlBasePath = location.protocol + applicationContext + "/portal/" + folder[1];
	form.find(".pvd-url").ibxWidget("option", "text", this.urlBasePath);
	form.find(".pvd-url").prop('title',this.urlBasePath);

	form.find(".pvd-title").on('ibx_textchanged', function (e)
	{		
		var fileTitle = this.validateMaxlength( $('.pvd-title').ibxWidget("option", "text") , $(".pvd-title").ibxWidget("option", "maxLength") );
    	var fileName = this.validateMaxlength( this.replaceDisallowedChars(fileTitle) , $(".pvd-name").ibxWidget("option", "maxLength") );
    	var aliasName = form.find(".pvd-alias").ibxWidget("option", "text");
    	
    	if (mode != "edit")
    		form.find(".pvd-name").ibxWidget("option", "text", fileName);
       	
    	if (aliasName.length == 0)
    	{
	    	if (fileName.length == 0)
	    		form.find(".pvd-url").ibxWidget("option", "text", this.urlBasePath);
	    	else
	    	{
	    		if (mode != "edit")
	    		{
		    		var base2 = (item ? this.urlBasePath.substring(0, this.urlBasePath.lastIndexOf('/')) : this.urlBasePath); 
		    		form.find(".pvd-url").ibxWidget("option", "text", base2 + "/" + fileName);
	    		}
	    	}
    	}	

    	var url = form.find(".pvd-url").ibxWidget('option', 'text');		    	
	    form.find(".pvd-url").prop('title',url);
    	form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (fileName.length == 0 || fileTitle.length == 0));        	
    }.bind(this));
		
	form.find(".pvd-name").on('ibx_textchanged', function (e)
	{ 
		var fileTitle = form.find(".pvd-title").ibxWidget("option", "text");		

		var fileName = form.find(".pvd-name").ibxWidget("option", "text");		// For copy and paste with Disallowed Chars
		fileName = this.replaceDisallowedChars(fileName);
		form.find(".pvd-name").ibxWidget("option", "text", fileName);
       	
    	var aliasName = form.find(".pvd-alias").ibxWidget("option", "text");
    	aliasName = this.replaceDisallowedChars(aliasName);
		form.find(".pvd-alias").ibxWidget("option", "text", aliasName);

    	if (aliasName.length == 0)
    	{
	    	if (fileName.length == 0)
	    		form.find(".pvd-url").ibxWidget("option", "text", this.urlBasePath);
	    	else
	    	{
	    		var base2 = (item ? this.urlBasePath.substring(0, this.urlBasePath.lastIndexOf('/')) : this.urlBasePath); 
	    		form.find(".pvd-url").ibxWidget("option", "text", base2 + "/" + fileName);
	    	}
    	}
		var url = form.find(".pvd-url").ibxWidget('option', 'text');		    	
    	form.find(".pvd-url").prop('title',url);

    	form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (fileName.length == 0 || fileTitle.length == 0));        	
    }.bind(this));

	form.find(".pvd-max-width").on('ibx_textchanged', function (e)
	{ 
		var fileTitle = form.find(".pvd-title").ibxWidget("option", "text");		
		var fileName = form.find(".pvd-name").ibxWidget("option", "text");		// For copy and paste with Disallowed Chars
    	form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (fileName.length == 0 || fileTitle.length == 0));        	
    }.bind(this));
	form.find(".pvd-max-width").on('focusout', function (e)
	{ 
		var max_width = $(".pvd-max-width").ibxWidget('option', 'text');
		if (max_width == "100%")
			$(".pvd-max-width").ibxWidget("option", "text", ""); // default
		else
		{
			var idx = max_width.indexOf("%");
			if (idx > -1)
				max_width = max_width.replace(new RegExp("%",'g'), ""); // remove all the % sign
	
			parsed = parseInt(max_width, 10);
			if (!isNaN(parsed))
			{
				if (idx > -1) // %
				{
					if (parsed <= 100) // bigger then 100%
						maxWidth = parsed+"%";
					else
						maxWidth = "100%"; // user put for example 500%
				}
				else
					maxWidth = parsed+"px";
				$(".pvd-max-width").ibxWidget("option", "text", maxWidth);
			}
			else
				$(".pvd-max-width").ibxWidget("option", "text", "");
		}
			
	}.bind(this));
	
	form.find(".pvd-alias").on('ibx_textchanged', function (e)
	{ 

		var fileTitle = form.find(".pvd-title").ibxWidget("option", "text");
		var fileName = form.find(".pvd-name").ibxWidget("option", "text");

    	var aliasName = form.find(".pvd-alias").ibxWidget("option", "text");
    	aliasName = this.replaceDisallowedChars(aliasName);
		form.find(".pvd-alias").ibxWidget("option", "text", aliasName);

    	if (aliasName.length == 0)
    	{
    		if (isCreate)
    			form.find(".pvd-url").closest('.sd-input-div').hide();

    		if (fileName.length == 0)
	    		form.find(".pvd-url").ibxWidget("option", "text", this.urlBasePath);
	    	else
	    	{
	    		var base2 = (item ? this.urlBasePath.substring(0, this.urlBasePath.lastIndexOf('/')) : this.urlBasePath); 
	    		form.find(".pvd-url").ibxWidget("option", "text", base2 + "/" + fileName);
	    	}
		}
		else
		{			
			if (isCreate)
				form.find(".pvd-url").closest('.sd-input-div').show();

			var disallowedChars = Ibfs.ibfs.getSystemInfo().subsystemInfo.EDA.pathValidationInfo.disallowedChars;

			for(var i = 0; i < disallowedChars.length; i ++)
			{	
				var idx = 0;
				
				while(aliasName.indexOf(disallowedChars[i]) != -1)
				{			
					aliasName = aliasName.replace(disallowedChars[i], "");
					idx ++;
				}
			}
			
    		form.find(".pvd-url").ibxWidget("option", "text", base + aliasName);		
    		form.find(".pvd-alias").ibxWidget("option", "text", aliasName);
		}

		var url = form.find(".pvd-url").ibxWidget('option', 'text');		    	
    	form.find(".pvd-url").prop('title',url);

    	form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (fileName.length == 0  || fileTitle.length == 0));       
    	
    }.bind(this));
	
	form.find(".pvd-name").on('ibx_textchanging', function (e)
	{
		if(!this.validateChar(e.key, e.keyCode))
			e.preventDefault();
	}.bind(this));
	
	form.find(".pvd-alias").on('ibx_textchanging', function (e)
	{
		if(!this.validateChar(e.key, e.keyCode))
			e.preventDefault();
	}.bind(this));

	$(form).find(".ibx-dialog-ok-button").click(function(e)
	{		
		$(".form-fill-error-text").empty(); // reset
		var title = this.find(".pvd-title").ibxWidget('option', 'text');		
		var name = this.find(".pvd-name").ibxWidget('option', 'text');		
		var alias = this.find(".pvd-alias").ibxWidget('option', 'text');		
		var url = this.find(".pvd-url").ibxWidget('option', 'text');		
		var logo = this.find(".pvd-logo").ibxWidget('option', 'text');
		var banner = this.find(".portal-show-banner").ibxWidget('checked');
		var hideLogo = this.find('.pvd-hide-logo').ibxWidget('option', 'checked');
		var navigation = this.find(".pvd-navigation").ibxWidget("userValue"); // can be 2-side, 3-level or 2-top
		var showTopNavigationInBanner = this.find(".pvd-top-navigation").ibxWidget("checked");
		var showPortalTitleInBanner = this.find(".pvd-show-title-banner").ibxWidget("checked");
		
		var maxWidth = "100pc"; // default
		var max_width = this.find(".pvd-max-width").ibxWidget('option', 'text');
		var idx = max_width.indexOf("%");
		if (idx > -1)
			max_width = max_width.replace(new RegExp("%",'g'), ""); // remove all the % sign

		parsed = parseInt(max_width, 10);
		if (!isNaN(parsed))
		{
			if (idx > -1) // %
			{
				if (parsed <= 100) // bigger then 100%
					maxWidth = parsed+"pc";
			}
			else
				maxWidth = parsed+"px";
		}

		var createMyPageMenu = this.find(".pvd-pages-menu").ibxWidget("checked");	
		var theme = this.find(".pvd-theme").ibxWidget("userValue");
		var themeText = this.find(".pvd-theme").ibxWidget('option', 'text');
		if (themeText.indexOf('##{') != -1)
			theme = themeText;
		
		var manifestData = 
		{
			"navigation": navigation, 
			"logo": logo,
			"maxWidth" : maxWidth,
			"banner": banner,
			"hideLogo": hideLogo,
			"showPortalTitleInBanner": showPortalTitleInBanner,
			"showTopNavigationInBanner": showTopNavigationInBanner,
			"createMyPageMenu": createMyPageMenu,
			"theme": theme,
			"alias": alias
		};
		
		var manifest = JSON.stringify(manifestData);
		if (isCreate)
		{
			if (!needSaveDlg)
			{
				var deferred = Ibfs.ibfs.createPRTLX(outputPath+'/'+name, title, manifest, "", true);
				deferred.deferred.always(function (data)
				{
					if (!data.error)
					{
						form.ibxWidget("close");
						$(document).dispatchEvent('FORCE_ACTION_ON_FOLDER', {'type': "PRTLXBundle", 'navigateTo': outputPath+'/'+name});
					}
					else
					{
						var root = $("ibfsrpc", data.xhr.responseXML);
						var retcode = root.attr("returncode");
						$(".form-fill-error-text").show();
						$(".form-fill-error-text").append(root.attr("localizeddesc"));			
						/* Add focus to the 1st input control */
						form.find('.ibx-default-ctrl-focus:first').focus();
					}
		
				});
			}
			else
			{
				var saveDlg = ibx.resourceMgr.getResource('.open-dialog-resources', true);
				saveDlg.ibxWidget({disableKeyboardInput: true, rootPath: "IBFS:/WFC/Repository",  
					ctxPath: outputPath, dlgType:"save"});
				saveDlg.ibxWidget('fileTitle', title);
				saveDlg.ibxWidget('fileName', name);

				saveDlg.ibxWidget('open');								
				saveDlg.on("ibx_beforeclose", function(e, closeData)
				{
					
					
				}).on("ibx_close", function (e, closeData)
				{				
					
					if(closeData == "ok")
					{
						var fileName = saveDlg.ibxWidget('fileName');			
						var description = saveDlg.ibxWidget('fileTitle');
						var ibfsItems = saveDlg.ibxWidget('ibfsItems');
						var itemPath = (ibfsItems.length > 0) ? ibfsItems[0].fullPath : "";	
						
						var deferred = Ibfs.ibfs.createPRTLX(fileName, description, manifest, "", true);
						deferred.deferred.always(function (data)
						{
							if (!data.error)
							{
								form.ibxWidget("close");
								$(document).dispatchEvent('FORCE_ACTION_ON_FOLDER', {'type': "PRTLXBundle", 'expandTo': fileName});
							}
							else
							{
								var root = $("ibfsrpc", data.xhr.responseXML);
								var retcode = root.attr("returncode");
								$(".form-fill-error-text").show();
								$(".form-fill-error-text").append(root.attr("localizeddesc"));			
								/* Add focus to the 1st input control */
								form.find('.ibx-default-ctrl-focus:first').focus();
							}
				
						});
					} 	
					 	
				}.bind(this));	
			}
		}
		else
		{
			var deferred = Ibfs.ibfs.updatePRTLX(itemPath, title, name, manifest, "", true, {eError: "error", errorHandling: false});
			deferred.deferred.always(function (data)
			{
				if (!data.error)
				{
					form.ibxWidget("close");
					$(document).dispatchEvent('obj-edited', {path: item.fullPath});

//					if (home_globals.isWorkspace && window.parent)
//						$(window.parent.document).dispatchEvent('FORCE_ACTION_ON_FOLDER', { "detail":  item.fullPath});
//					else
//					{
//						if (item.fullPath == item.parentPath + name)	// name did not change
//						{
//							home_globals.homePage.refreshfolder();
//						}
//						else											// name changed 
//						{
//							if ($(".properties-page").ibxCollapsible('isOpen'))	// close properties if open
//								$(".properties-page").ibxCollapsible('close');
//							
//							item.name = name;								// adjust item to new name
//							item.fullPath = item.parentPath + name;
//							home_globals.homePage.refreshfolder(item.parentPath);	// reload parent
//						}
//					}
				}
				else
				{
					var root = $("ibfsrpc", data.xhr.responseXML);
					var retcode = root.attr("returncode");
					$(".form-fill-error-text").ibxAddClass('form-fill-error-bgc').show();
					$(".form-fill-error-text").show();
					$(".form-fill-error-text").append(root.attr("localizeddesc"));			
					/* Add focus to the 1st input control */
					form.find('.ibx-default-ctrl-focus:first').focus();
				}
	
			});
		}
    }.bind(form));
	
	$(form).on("ibx_beforeclose", function(e, closeData)
	{				
		if (closeData == "ok")
		{
			e.preventDefault();
		}	
	}.bind(this));	
	
	_getThemes();
	
	if (item)
	{
		form.find(".portal-show-banner").on("ibx_change", function()
		{
			if (!inSetup)
				form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (!form.find(".pvd-name").ibxWidget("option", "text").length || !form.find(".pvd-title").ibxWidget("option", "text").length));        	
		});
		
		form.find(".pvd-top-navigation").on("ibx_change", function()
		{
			if (!inSetup)
				form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (!form.find(".pvd-name").ibxWidget("option", "text").length || !form.find(".pvd-title").ibxWidget("option", "text").length));        	
		});

		form.find(".pvd-show-title-banner").on("ibx_change", function()
		{
			if (!inSetup)
				form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (!form.find(".pvd-name").ibxWidget("option", "text").length || !form.find(".pvd-title").ibxWidget("option", "text").length));        	
		});
		
		form.find(".pvd-hide-logo").on("ibx_change", function()
		{
			if (!inSetup)
				form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', (!form.find(".pvd-name").ibxWidget("option", "text").length || !form.find(".pvd-title").ibxWidget("option", "text").length));        	
		});
		
		var portalPath = itemPath + "/portal.man";
		Ibfs.ibfs.getItem(portalPath, false, {async: false}).done(function (dmh, cInfo)
		{
			if (cInfo.result.content.decoded.length)
				manifest = JSON.parse(cInfo.result.content.decoded);
			else
				manifest = {"navigation": "3-level"};
			
			if (typeof (manifest.maxWidth) == "undefined")
				manifest.maxWidth = "100pc"; // default

			inSetup = true;
			this.find(".pvd-title").ibxWidget("option", "text", itemTitle);
			this.find(".pvd-name").ibxWidget("option", "text", itemName);
			this.find(".pvd-logo").ibxWidget("option", "text", manifest.logo);
			this.find(".pvd-alias").ibxWidget("option", "text", manifest.alias);
			if (manifest.alias)
		   		form.find(".pvd-url").ibxWidget("option", "text", base + dmh.replaceDisallowedChars(manifest.alias));			
			
			var maxWidth = "";
			if (manifest.maxWidth != "100pc")
				maxWidth = manifest.maxWidth.indexOf("px") == -1 ? manifest.maxWidth.replace('pc', '%') : parseInt(manifest.maxWidth, 10) + "px";
			
			this.find(".pvd-max-width").ibxWidget("option", "text", maxWidth);
			
			this.find(".portal-show-banner").ibxWidget("checked", manifest.banner);
			this.find(".pvd-hide-logo").ibxWidget('option', "checked", manifest.hideLogo);
			this.find(".pvd-navigation").ibxWidget("userValue", manifest.navigation);
			this.find(".pvd-top-navigation").ibxWidget("checked", manifest.showTopNavigationInBanner);
			this.find(".pvd-show-title-banner").ibxWidget("checked", manifest.banner && manifest.showPortalTitleInBanner);			
	
			if (item && manifest.theme)
			{
				if (manifest.theme.indexOf("##{") != -1)
					form.find(".pvd-theme").ibxWidget("option", 'text', manifest.theme);
				else	
					form.find(".pvd-theme").ibxWidget("userValue", manifest.theme);
			}

			inSetup = false;
		}.bind(form, this));
	}
}

dmhProto.newIA = function(data, skipCheck)
{
	var item = data.item;
	var tool = data.tool;

	if(item == null/* && home_globals.currentPath == ""*/)
	{			
		rebootUtil.InformationalDialog("Warning",ibx.resourceMgr.getString("select_folder_warning"));	
	}
	else
	{
/*		
		var path = home_globals.currentPath;
		if(item != null)
			path = item.fullPath;
		else
		{
			item = home_globals.Items.findallFoldersByPath(path);
			if (item != null)
				path = item.fullPath;
		}	
*/
		path = item.fullPath;
		if (!skipCheck && item != null)
		{
			//this.checkCredentials(item.effectiveRSName, this.newIA, data, false);
			var sa = new ServerAccess();
			sa.checkCredentials(item.effectiveRSName, this.newIA.bind(this), data, false);
		}
		else
		{
			if(tool == "framework" || tool == "insightDesigner" || tool == "workbook" || (tool == "insightDesignerReport" && (item.type != "ROFexFile" && item.type != "LinkItem")))
			{	
				Ibfs.ibfs.serverInfo(item.effectiveRSName, "").done(function(exInfo)
				{
					var toolname = tool;
					if(tool == "insightDesigner")
						toolname = "designer chart";
					else if(tool == "insightDesignerReport")
						toolname = "designer report";
					
						var serverPath = "";
						var result = exInfo.result;	
						for (var i = 0; i < result.length; i++)
						{
							if(result[i].name == "ALLAPPS")
							{
								serverPath = result[i].value;
								serverPath = serverPath.replace(/;/g,' ');
								break;
							}	
						}							
						
						if ($(".open-dialog-resources").is(":visible"))
							return;
						
						if(tool == "insightDesigner")
						{
							this.newSampleContent(1, true, serverPath);					
						}
						else if(tool == "workbook")
						{
							this.newSampleContent(2, true, serverPath);				
						}	
						else if(tool == "insightDesignerReport")
						{
							this.newSampleContent(3, true, serverPath);				
						}
						else if (tool == "framework")
						{
							this.newSampleContent(4, true, serverPath);				
						}
				
				}.bind(this));
			
			}
			/*
			if(tool == "insightDesigner")
			{
				this.newSampleContent(1, skipCheck);					
			}
			else if(tool == "workbook")
			{
				this.newSampleContent(2, skipCheck);				
			}	
			else if(tool == "insightDesignerReport")
			{
				this.newSampleContent(3, skipCheck);				
			}
			*/	
			else if(tool == "framework" || tool == "insightDesignerChart" || tool == "insightDesignerWorkBook" || tool == "insightDesignerReport")
			{
				var tooluse = (tool == "insightDesignerChart") ? "chart" : (tool == "insightDesignerReport" ? "report" : "workbook");
				var uriExec = sformat("{1}/designer?is508=false&tool={3}&item={2}&startlocation={4}", applicationContext, encodeURIComponent(path), tooluse, encodeURIComponent(item.parentPath));
				this.popupWindow(uriExec, "", 0, 0);
			}	
			else
			{	
				
				var uriExec = sformat("{1}/ia?is508=false&item={2}&tool={3}", applicationContext,	encodeURIComponent(path), tool);
				this.popupWindow(uriExec, "", 0, 0);
			}
		}
	}
};

dmhProto.downloadZip = function(contextItem)
{
	setTimeout(function()
	{
		var name = contextItem.name
		
		var f = document.createElement("form");
		f.setAttribute('method', "post");
		var origin = location.origin;
		var context = location.pathname.split('/')[1]
		var ac = origin + '/' + context;
		
		f.setAttribute('action', sformat("{1}/views.bip", ac));
	
		var ibfsPath = document.createElement("input"); 
		ibfsPath.setAttribute('type', "text");
		ibfsPath.setAttribute('name', "path");
		ibfsPath.setAttribute('value', name);
		
		var pRequestType = document.createElement("input");
		pRequestType.setAttribute('type', "text");
		pRequestType.setAttribute('name', "BIP_REQUEST_TYPE");
		pRequestType.setAttribute('value', "BIP_DOWNLOAD_EXPORT");
		
		var pRand = document.createElement("input");
		pRand.setAttribute('type', "text");
		pRand.setAttribute('name', "IBI_random");
		pRand.setAttribute('value', Math.random());
		
		var pSessAuth = document.createElement("input");
		pSessAuth.setAttribute('type', "text");
		pSessAuth.setAttribute('name', WFGlobals.getSesAuthParm());
		pSessAuth.setAttribute('value', WFGlobals.getSesAuthVal());
		
		f.appendChild(ibfsPath);
		f.appendChild(pRequestType);
		f.appendChild(pRand);
		f.appendChild(pSessAuth);
	
		document.body.appendChild(f);
		
		f.submit();
		
		document.body.removeChild(f);
	}, 100);
};


dmhProto.subscribe = function (contextItem)
{
 	var uriExec = sformat("{1}/subscribe.bip", applicationContext);
 	var randomnum = Math.floor(Math.random() * 100000);	
 	var argument=
 	{
 		BIP_REQUEST_TYPE: "BIP_SUBSCRIBE",		
 		handle: contextItem.handle
 	};
	argument[IBI_random] = randomnum;
	argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();
	
	$.post(uriExec, argument).done(function(data)
	{
		$('.home-content').dispatchEvent('item_subscribed', contextItem);
	});
};

dmhProto.unsubscribe = function (contextItem)
{
 	var uriExec = sformat("{1}/unsubscribe.bip", applicationContext);
 	var randomnum = Math.floor(Math.random() * 100000);	
 	var argument=
 	{
 		BIP_REQUEST_TYPE: "BIP_UNSUBSCRIBE",		
 		handle: contextItem.handle
 	};
	argument[IBI_random] = randomnum;
	argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();

	$.post(uriExec, argument).done(function(data)
	{
		$('.home-content').dispatchEvent('item_unsubscribed', contextItem);
	});
};

//# sourceURL=homeDomainsMenuHandlers.js