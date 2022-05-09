/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.1 $:
//////////////////////////////////////////////////////////////////////////

window.addEventListener('CHECK_SESSION_RESPONSE_EVENT', checkSessionResponse);

function sessionExpirationWarningMessage(event) 
{
	form = ibx.resourceMgr.getResource('.session-timeout');
	$(form).find(".ibx-dialog-cancel-button").hide();
	$(form).find(".ibx-title-bar-close-button").hide();

	var lCountdown = event.detail.WARNING_DIALOG_DURATION;	
    var mins = Math.round(lCountdown / 60000);  //Set the number of minutes you need
    var secs = mins * 60;
    var currentSeconds = 0;
    var currentMinutes = 0;
    
	var msg = sformat(ibx.resourceMgr.getString("session_expire_message_1"), mins);
   	form.find(".session-timeout-label-warning").ibxWidget("option", "text", msg);
	form.ibxWidget('open');	
	
	var myTimer = setTimeout(Decrement,1000); 

    function Decrement() {
    	var msg;
        currentMinutes = Math.floor(secs / 60);
        currentSeconds = secs % 60;
        secs--;
        if (currentMinutes == 0)
        {
        	if (currentSeconds == 1)
               	form.find(".session-timeout-label-warning").ibxWidget("option", "text", ibx.resourceMgr.getString("session_expire_message_3"));
        	else
        		form.find(".session-timeout-label-warning").ibxWidget("option", "text", sformat(ibx.resourceMgr.getString("session_expire_message_2"), currentSeconds));
        }
        else
        {
        	if (currentMinutes == 1 && currentSeconds == 0) // instead of 1 minute we put 60 seconds 
        		form.find(".session-timeout-label-warning").ibxWidget("option", "text", sformat(ibx.resourceMgr.getString("session_expire_message_2"), 60));
        	else
	        	if (currentSeconds == 0)
	        		form.find(".session-timeout-label-warning").ibxWidget("option", "text", sformat(ibx.resourceMgr.getString("session_expire_message_1"), currentMinutes));
        }
        
        if(secs !== -1) 
        	myTimer = setTimeout(function() { Decrement(); }, 1000);
        else
        {
			form.ibxWidget('close');

			var event = document.createEvent('CustomEvent');
		    event.initCustomEvent('MANAGER_CHECK_SESSION_EVENT', true, true, null);
		    window.dispatchEvent(event);
        }       	
    }
	
	form.on('ibx_close', function (e, btn)
	{
		if(btn=="ok")
		{
			clearTimeout(myTimer);
			var uriExec = sformat("{1}/ping", applicationContext);					
			var randomnum = Math.floor(Math.random() * 100000);	
		 	var argument= {};
			argument[IBI_random] = Math.floor(Math.random() * 100000);
			$.post(uriExec, argument)
			.done(function( data ) 
			{
				if ($("ping", data)[0].getAttribute("anonymous") == "false")
				{
					var event = document.createEvent('CustomEvent');
				    event.initCustomEvent('MANAGER_RESTART_EVENT', true, true, null);
				    window.dispatchEvent(event);
				}
			});
		}
	});
}


function checkSessionResponse(event) 
{
	if (!event.detail.SESSION_STATUS)
		hpsignout();

}
//# sourceURL=sessiontimeout.js


	