/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.9 $:

/******************************************************************************
	Reporting Server Access
******************************************************************************/
function ServerAccess()
{
 	this._checkUriExec = sformat("{1}/chksrvacc.bip", applicationContext);
	this._sendUriExec = sformat("{1}/views.bip", applicationContext);


}
var _p = ServerAccess.prototype = new Object();

_p.sendCredentials = function sendCredentials(userName, password, server, func, item)
{
 	var randomnum = Math.floor(Math.random() * 100000);	
 	var argument=
	{
		BIP_REQUEST_TYPE: "BIP_SET_SRV_CRED",		
		server: server,
		IBIR_userid: userName,
		IBIR_password: password,		 		
	};
	argument[WFGlobals.getSesAuthParm()]=WFGlobals.getSesAuthVal(); 	
 	argument[IBI_random] = randomnum;

 		
 	$.when($.post({"async": false, "url": this._sendUriExec, "data": argument}).always(function(data)
	{
		var statusNode = $("status", data); 
		var statusValue = statusNode.attr("result");
				
		if (statusValue == "credentials")
		{
			//this.StandardMessage("Warning",sformat(ibx.resourceMgr.getString("sa_bad_credentials")));						
			
			var options = 
			{
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"ok",
				messageOptions:
				{
					text:ibx.resourceMgr.getString("sa_bad_credentials")
				}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");
        	
			dlg.on("ibx_close", function (e, closeData)
			{				
				this.checkCredentials.call(this, server, func, item, false);
				return;				
			}.bind(this));	

		}
		else if (statusValue == "serverdown")
		{
			emsg = statusNode.attr("message");
			emsg = emsg.split("=")[1]; // server that is actually tried and is down might be different than one requested
			emsg = emsg.trim();
			
			//this.InformationalDialog("Warning",sformat(ibx.resourceMgr.getString("str_server_down"), emsg));		
			var options = 
			{
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"ok",
				messageOptions:
				{
					text:ibx.resourceMgr.getString("sa_server_down")
				}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");
		}
		else if (statusValue == "error")
		{
			msg = statusNode.attr("message");
			
			//this.InformationalDialog("Warning",sformat(ibx.resourceMgr.getString("str_server_error"), msg));		
			var options = 
			{
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"ok",
				messageOptions:
				{
					text:sformat(ibx.resourceMgr.getString("sa_server_error"), msg)
				}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");
		}
		else if (statusValue == "success")
		{
			if (func)
				func.call(this, item, true);
		}
		else
		{
			var options = 
			{
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"ok",
				messageOptions:
				{
					text:ibx.resourceMgr.getString("sa_bad_credentials")
				}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");
        	
			dlg.on("ibx_close", function (e, closeData)
			{				
				this.checkCredentials.call(this, server, func, item, false);
				return;				
			}.bind(this));	
		}
	}.bind(this)));
};

_p.serverLogon = function(server, func, item)
{
	form = ibx.resourceMgr.getResource('.server-signin');
	$(form).find(".ibx-title-bar-caption").ibxWidget('option', 'text', sformat(ibx.resourceMgr.getString("str_server_signin"), server));
	$(form).find(".ibx-dialog-ok-button").ibxWidget("option", "text", ibx.resourceMgr.getString("str_btn_signin"));
	
	$(form).find(".ibx-dialog-ok-button").on('click', function (e){ 
 		var userName = $(form).find(".hp-form-field-text-user-name").ibxWidget('option', 'text');
 		var password = $(form).find(".hp-form-field-text-password").ibxWidget('option', 'text');
 		this.sendCredentials(userName, password, server, func, item);
 	}.bind(this));
	
	form.ibxWidget('open');
};
	
_p.checkCredentials = function checkCredentials(server, func, item, fromDefer)
{
	var msg;
	var emsg;
	var randomnum = Math.floor(Math.random() * 100000);
	var path = "";
	if (item)
	{
		if (item.fullPath)
			path = item.fullPath;
		else
		{
			if (item.item)
				path = item.item.fullPath;
		}
	}
	
	var argument=
	{
		"BIP_REQUEST_TYPE": "BIP_CHK_SRVR_ACCESS",
		"server":  server,
		"ibfsPath": path
	};
	argument[WFGlobals.getSesAuthParm()]=WFGlobals.getSesAuthVal();
	argument[IBI_random] = randomnum;
	
	if (fromDefer)
		argument["isDeferred"] ="true";

	$.when($.post({	"async": false, "url": this._checkUriExec,	"context": this, "data": argument}).always(function(data)
	{
		var statusNode = $("status", data); 
		var statusValue = statusNode.attr("result");
		
		if (statusValue != "credentials" && statusValue != "success")
			$(".select-data-source").dispatchEvent('chk_srvr_access_error');			
			
		if (statusValue == "credentials")	// need to do better for down servers
		{
			emsg = statusNode.attr("message");
			emsg = emsg.split("=")[1]; // server that is actually tried and is down might be different than one requested
			var rsrv = emsg.trim();	//emsg.substring(0, emsg.length-1);
			
			this.serverLogon(rsrv, func, item);
		}
		else if (statusValue == "badlink")
		{
			var path = (item.clientInfo ? item.clientInfo.properties.LinkToPath : (item.item ? item.item.clientInfo.properties.LinkToPath : ""));
			var options = 
			{
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"ok",
				messageOptions:
				{
					text: sformat(ibx.resourceMgr.getString("sa_invalid_shortcut"), path)
				}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");
		}
		else if (statusValue == "badmaslink")
		{
			var path = (item.clientInfo ? item.clientInfo.properties.LinkToPath : (item.item ? item.item.clientInfo.properties.LinkToPath : ""));
			var options = 
			{
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"ok",
				messageOptions:
				{
					text: sformat(ibx.resourceMgr.getString("sa_invalid_mfd_shortcut"), path)
				}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");
		}
		else if (statusValue == "serverdown")
		{
			emsg = statusNode.attr("message");
			emsg = emsg.split("=")[1]; // server that is actually tried and is down might be different than one requested
			emsg = emsg.trim();
			
			//this.InformationalDialog("Warning",sformat(ibx.resourceMgr.getString("str_server_down"), emsg));
			var options = 
			{
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"ok",
				messageOptions:
				{
					text:sformat(ibx.resourceMgr.getString("sa_server_down"), emsg)
				}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");
		}
		else if (statusValue == "serverundefined")
		{
			//this.InformationalDialog("Warning",sformat(ibx.resourceMgr.getString("str_server_undefined"), server));	
			var options = 
			{
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"ok",
				messageOptions:
				{
					text:sformat(ibx.resourceMgr.getString("sa_server_undefined"), server)
				}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");
		}
		else if (statusValue == "error")
		{
			msg = statusNode.attr("message");
			//this.InformationalDialog("Warning",sformat(ibx.resourceMgr.getString("str_server_error"), msg));	
			var options = 
			{
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"ok",
				messageOptions:
				{
					text:sformat(ibx.resourceMgr.getString("sa_server_error"), msg)
				}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");
		}
		else if (statusValue == "success")
		{
			if (func)
				func.call(this, item, true);
		}
		else
		{
			var options = 
			{
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"ok",
				messageOptions:
				{
					text:ibx.resourceMgr.getString("sa_bad_credentials")
				}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");
        	
			dlg.on("ibx_close", function (e, closeData)
			{				
				this.serverLogon(rsrv, func, item);
				return;				
			}.bind(this));	
			
		}
	}.bind(this)));
};

