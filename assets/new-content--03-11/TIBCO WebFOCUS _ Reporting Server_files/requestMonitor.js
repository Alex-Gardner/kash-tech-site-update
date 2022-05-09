

function requestMonitor(timeoutInterval, eventProcessor) {
	if(timeoutInterval)
		this.timeoutInterval = timeoutInterval;
	else 
		this.timeoutInterval = this.getTimeoutInterval();
	if(eventProcessor)
		this.eventProcessor = eventProcessor;
	else {
		if(SharedUtil.getDFMediator())
			this.eventProcessor = new requestEventProcessorUIWithUndo();
		else
			this.eventProcessor = new requestEventProcessorUI();
	}
	this.timeoutID = null;
};

requestMonitor.prototype.getTimeoutInterval = function () {
	if(typeof WFGlobals !== 'undefined')
		return WFGlobals.IBI_AJAX_TIMEOUT*1000;
	else
		return 0;
};

requestMonitor.prototype.monitorRequest = function (xhttp, tStart) {
	if(!this.timeoutInterval)
		return; //timeout is not set, then not monitoring anything
	this.timeoutID = setTimeout(checkOnRequest, this.timeoutInterval, xhttp, this);
};

requestMonitor.prototype.doneMonitoringCleanup = function(monitorObject) {
	if(monitorObject.timeoutID) 
		clearTimeout(monitorObject.timeoutID);
	monitorObject.takingAction = false;
	monitorObject.timeoutID = null;
	monitorObject.finishedMonitoring = true;
}
requestMonitor.prototype.stopMonitoringRequest = function () {
	this.doneMonitoringCleanup(this);
	if(this.eventProcessor)
		this.eventProcessor.cleanup();
	//console.log('processed stopMonitoringRequest');
};
requestMonitor.prototype.cancelFunc = function(xhttp, monitorObject) {
	//console.log('aborting request...');
	monitorObject.doneMonitoringCleanup(monitorObject);
	xhttp.abort();
	monitorObject.eventProcessor.postAbortProcessing();			
};
requestMonitor.prototype.continueFunc = function(xhttp, monitorObject) {
	//console.log('user wants to continue, oh well...');
	monitorObject.takingAction = false;
	monitorObject.timeoutID = setTimeout(checkOnRequest, monitorObject.timeoutInterval, xhttp, monitorObject);
};

var checkOnRequest = function (xhttp, monitorObject) {
	
	if(xhttp.readyState == 4 || monitorObject.finishedMonitoring) {
    	//console.log('done monitoring');
        //clearInterval(requestCheck);
    }
    else {
    	
    	if(!monitorObject.takingAction)
        {
    		monitorObject.takingAction = true;
          //  console.log(' request is NOT done waited too long...');
            monitorObject.eventProcessor.needToCancel(xhttp, monitorObject)
            
        }
        else
        {
        	//console.log(' request is NOT done but continue');
        	monitorObject.timeoutID = setTimeout(checkOnRequest, monitorObject.timeoutInterval, xhttp, monitorObject);
        }
        
        
    }
};

function requestMonitorBatch(timeoutInterval, eventProcessor) {
	 requestMonitor.call(this, timeoutInterval, eventProcessor);
};

requestMonitorBatch.prototype = new requestMonitor();


requestMonitorBatch.prototype.monitorRequest = function (xhttp, tStart) {
	if(!this.timeoutInterval)
		return; //timeout is not set, then not monitoring anything
	this.timeoutID = setTimeout(checkOnRequestBatch, this.timeoutInterval, xhttp, this);
};

requestMonitorBatch.prototype.cancelFunc = function(xhttp, monitorObject) {
	monitorObject.doneMonitoringCleanup(monitorObject);
	xhttp.forEach(function(request) {
		if(request.readyState != 4)
			request.abort();
	});
	monitorObject.eventProcessor.postAbortProcessing();			
};

requestMonitorBatch.prototype.continueFunc = function(xhttp, monitorObject) {
	//console.log('user wants to continue, oh well...');
	monitorObject.takingAction = false;
	monitorObject.timeoutID = setTimeout(checkOnRequestBatch, monitorObject.timeoutInterval, xhttp, monitorObject);
};

var checkOnRequestBatch = function (xhttp, monitorObject) { 
	xhttp.forEach(function(request) {
		if((request.readyState != 4) && !monitorObject.finishedMonitoring && !monitorObject.takingAction) {
			monitorObject.takingAction = true;
	    	//console.log(' request is NOT done waited too long...');
	        monitorObject.eventProcessor.needToCancel(xhttp, monitorObject);
	        return;	       
		}
	});	
};
