/* Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved. */
// $Revision: 1.5 $:
function IbiJSTrace()
{
} 
IbiJSTrace.onErrorChain = null;

IbiJSTrace.traceit = function traceit(traceLevel, traceArea, traceLine)
{
	// If structure is not in window - this method can not do anything
	if (!window.ibiLog) 
	{
		return;
	}
	IbiJSTrace.traceitIbiLog(window.ibiLog, traceLevel, traceArea, traceLine);
};
IbiJSTrace.traceitIbiLog = function traceit(ibiLog, traceLevel, traceArea, traceLine)
{
	// If logging is disabled or missing info or if timeout is expired, we're done here.
	if (!ibiLog || !ibiLog.url || !ibiLog.urlId || !ibiLog.monId) 
	{
		return;
	}
	if (IbiJSTrace.isTracingAtOrBelow(traceLevel)) 
	{
		var postParms = "IBIMON_area="  + encodeURIComponent(traceArea)
				     + "&IBIMON_level=" + encodeURIComponent(traceLevel)
				     + "&IBIMON_monId=" + encodeURIComponent(ibiLog.monId)
				     + "&IBIMON_urlId=" + encodeURIComponent(ibiLog.urlId)		     			     
				     + "&IBIMON_trace=" + encodeURIComponent(traceLine.replace(/[\r\n]/gm,"--cc--"))
				     + "&"+ibiLog.csrfTokenName 
				     + "=" + encodeURIComponent(ibiLog.csrfTokenValue) ;
		IbiJSTrace.postIt(ibiLog, postParms);
	}
};
IbiJSTrace.isTracingAtOrBelow = function isTracingAtOrBelow(callersLevel)
{
	if (!ibiLog || !ibiLog.level)
		return false;
	var levels = ["ERROR","WARN","INFO","DEBUG","TRACE"]; 
	var request = levels.indexOf(callersLevel);
	var current = levels.indexOf(ibiLog.level);
	if (request < 0 || current < 0)
		return false;
	return request <= current ;
};
IbiJSTrace.getJsTrace = function getJsTrace()
{
	if (!window.ibiLog && !window.ibiLog.popUp)
		return "";
	return window.ibiLog.popUp;
};
IbiJSTrace.setJsTrace = function setJsTrace(setting, monId)
{
	if (!window.ibiLog) 
		return;
	var ibiLog = window.ibiLog;
	if (!ibiLog.url) 
	{
		return;
	}
	var postParms = "IBIMON_jsTrace="  + encodeURIComponent(setting)
                 + "&IBIMON_monId=" + encodeURIComponent(monId)    			     
                 + "&"+ibiLog.csrfTokenName 
                 + "=" + encodeURIComponent(ibiLog.csrfTokenValue) ;
	IbiJSTrace.postIt(ibiLog, postParms);
};
IbiJSTrace.setSessionName = function setSessionName(sessionName)
{
	if (!window.ibiLog) 
		return;
	var ibiLog = window.ibiLog;
	if (!ibiLog.url) 
	{
		return;
	}
	var postParms = "IBIMON_monId=" + encodeURIComponent(ibiLog.monId)
                 + "&IBIMON_sessionName=" + encodeURIComponent(sessionName)
                 + "&"+ibiLog.csrfTokenName 
                 + "=" + encodeURIComponent(ibiLog.csrfTokenValue) ;
    IbiJSTrace.postIt(ibiLog, postParms);
};
IbiJSTrace.postIt = function postIt(ibiLog, postParms)
{
	try {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', ibiLog.url, true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(postParms);
	} catch (err) {
		console.log(err);
	}
};
//Inline setup of error trap
if (window.ibiLog && window.ibiLog.jsErrorTrap && ( (window.ibiLog.jsErrorTrap == 'ON') || (window.ibiLog.jsErrorTrap == 'POPUP') ) )
{
	if(window.onerror)
	{
		IbiJSTrace.onErrorChain = window.onerror; 
	}	
	window.onerror = function (msg, url, lineNo, columnNo, error) 
	{
		++window.ibiLog.errorCount;
		if (window.ibiLog.errorCount < 100) 
		{
			var msgLine = msg;
			msgLine += " ( " + lineNo;
			if (columnNo)
				msgLine += " : " + columnNo;
			msgLine += " )";
			if (error) {
				if (error.stack)
					msgLine += "\n" + error.stack;
			}
			IbiJSTrace.traceit("ERROR", "js_error", msgLine);
			if (window.ibiLog.jsErrorTrap == "POPUP") 
			{
				window.ibiLog.jsErrorTrap = "ON"; // lower popUp to ON
				if (!confirm("IbiJSTrace (Press Cancel to stop error pop up messages for session)\n" + msgLine)) 
				{
					IbiJSTrace.setJsTrace("POPUPOFF", ibiLog.monId); // turn off for session
				}
			}
		}
		if( IbiJSTrace.onErrorChain)
		{
			return IbiJSTrace.onErrorChain (msg, url, lineNo, columnNo, error);
		}
		return false;
	};
}
