/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.2 $:

var hprbUtil = {};

function rebootUtil()
{
}

rebootUtil.InformationalDialog = function(caption,message)
{
	var options = 
	{
		type:"medium info",
		caption:caption,
		buttons:"ok",
		movable:false,
		messageOptions:
		{
			text: message
		}
	};
	var dlg = $.ibi.ibxDialog.createMessageDialog(options);
	dlg.ibxDialog("open");						
};

rebootUtil.StandardMessage = function(caption,message, type, selector)
{
	var type = typeof type==='undefined'? 'info' : type;
	var options = 
	{
			"my":"right top",
			"at":"right-10 top+50",
			"of": ".cbox-file-box",
			"collision":"flip"
	};		
	
	var popup = ibx.resourceMgr.getResource(".notify-popup").addClass(type);
	popup.find(".notify-popup-content").ibxHBox();
	popup.find(".notify-popup-content-text").ibxLabel("option", "textIsHtml", true);
	popup.find(".notify-popup-content-text").ibxLabel("option", "text", message);
	popup.find(".notify-popup-content-close-button").click(function(){	
		$(this).closest(".notify-popup").ibxPopup("close");
	});

	if (type=='error'||type=='warning')
		popup.ibxPopup("option", "autoClose", false);
	else
		popup.ibxPopup("option", "closeOnTimer", 4000);
	
	if (selector)
		options.of = selector;
	else
	{
		if ($('.cbox-file-box').length == 0 && $(selector).length == 0)
			options.of = "";
	}
	popup.ibxWidget("open").position(options);	
	
};

rebootUtil.fatalError = function(text, restart)
{
	captionText = ibx.resourceMgr.getString("unrecoverable_error");
	var options = 
	{
		type:"medium error",
		caption:captionText,
		buttons:"ok",		
		messageOptions:{text:text}
	};
	var dlg = $.ibi.ibxDialog.createMessageDialog(options);		
	
	dlg.ibxDialog("open").on("ibx_close", function(e, btn)
	{
		if(restart)
		{	
			var uriExec = sformat("{1}/service/wf_security_logout.jsp", applicationContext);
			$(location).attr('href', uriExec);
		}	
	}.bind(this));
	
	return dlg;
};	

rebootUtil.reportingServerLogoff = function reportingServerLogoff(opener, win, ibfsPath)
{
	function serverLogoff()
	{
		try
		{
		if (!win || win.closed)
		{
			if (opener)
			{
				clearInterval(id);

			 	var uriExec = sformat("{1}/rsconsole.bip", applicationContext);
			 	var randomnum = Math.floor(Math.random() * 100000);	
			 	var argument=
			 	{
			 		BIP_REQUEST_TYPE: "BIP_RS_CONSOLE_LOGOFF",		
			 		ibfsPath: encodeURIComponent(ibfsPath),
			 		IBIS_auth: "out"
			 	};
	    		argument[IBI_random] = randomnum;
	    		argument[hprbUtil.environment.SesAuthParm] = hprbUtil.environment.SesAuthParmVal;
			 	
	    		$.post(uriExec, argument);
//			 	home_globals.homePage.postCall(uriExec,argument,false,"");	

			 	clearInterval(id);
			}
			else
			{
				clearInterval(id);
			}
		}
		}
		catch (e)
		{
			clearInterval(id);

		 	var uriExec = sformat("{1}/rsconsole.bip", applicationContext);
		 	var randomnum = Math.floor(Math.random() * 100000);	
		 	var argument=
		 	{
		 		BIP_REQUEST_TYPE: "BIP_RS_CONSOLE_LOGOFF",		
		 		ibfsPath: encodeURIComponent(ibfsPath),
		 		IBIS_auth: "out"
		 	};
    		argument[IBI_random] = randomnum;
    		argument[hpbrbUtil.environment.SesAuthParm] = hpbrbUtil.environment.SesAuthParmVal;
		 	
    		$.post(uriExec, argument);
//		 	home_globals.homePage.postCall(uriExec,argument,false,"");	
		}
	}

	var id = setInterval(serverLogoff, 1000);
};

rebootUtil.glpyhToAnnouncement = function glyphToAnnouncement(glyph, item)
{
	var announcement = "";
	if (glyph)
	{
		switch(glyph)
		{
			case "ds-icon-file-text":
			case "ds-icon-excel":
			case "ds-icon-powerpoint":
			case "ds-icon-word":
			case "ds-icon-zip":
			case "ds-icon-schedule":
			case "ds-icon-address-book":
			case "ds-icon-access-list":
			case "ds-icon-library":
			case "ds-icon-sty":
			case "ds-icon-css":
			case "ds-icon-html":
			{
				announcement = item.typeDescription;
				break;
			}
			case "ds-icon-portal":
			{
				if (item.type == "PRTLXBundle")
					announcement = ibx.resourceMgr.getString("v5Portal");
				else if (item.type == "BIPWFCPortalItem")
					announcement = ibx.resourceMgr.getString("v4Portal");
				else
					announcement = ibx.resourceMgr.getString("v3Portal");
				break;
			}
			case "ds-icon-page":
			{
				if (item.clientInfo.properties.visualizationType)
					announcement = ibx.resourceMgr.getString(item.clientInfo.properties.visualizationType);
				else
					announcement = ibx.resourceMgr.getString(item.clientInfo.properties.PGXType);
				
				if (!announcement)
				{
					if (item.type == "BIPWFCPortalPageItem")
						announcement = ibx.resourceMgr.getString("v4Page");
					else
						announcement = item.type;
				}
				break;
			}
			case "ds-icon-chart-bar":
			{
				var chartType = item.clientInfo.properties.ChartType;
				if (chartType)
				{
					announcement = ibx.resourceMgr.getString(chartType);
				}
				else
					announcement = item.clientInfo.type;
				break;
			}
			default:
			{
				announcement = ibx.resourceMgr.getString(glyph);
				if (!announcement)
					announcement = item.typeDescription;
				break;
			}
		}
	}
	
	return announcement; 
}

//# sourceURL=homeUtil.js
