function requestEventProcessor() {
	
};

requestEventProcessor.prototype.needToCancel = function() {
	
};

requestEventProcessor.prototype.postAbortProcessing = function() {
	
};

requestEventProcessor.prototype.cleanup = function() {
	
};

function requestEventProcessorUI() {
	
};

requestEventProcessorUI.prototype = new requestEventProcessor();

requestEventProcessorUI.prototype.needToCancel = function(xhttp, monitorObject) {
	//return confirm("Stop pending request?");
	
	var warnDlg = ibx.resourceMgr.getResource('.cancel-request-dlg');
	warnDlg.ibxWidget('option', 'captionOptions', { 'text': ibx.resourceMgr.getString("cancel-request-dlg-caption")});
	warnDlg.find(".ibx-dialog-button-box").hide();
	warnDlg.find('.ibx-dialog-title-box').hide();
	warnDlg.find('.cancel-request-dlg-cancel').on('click', function (dlg, request, monitor, e) {
			this.cleanup();
			//console.log('closed dialog, cancelling');
			monitor.cancelFunc(request, monitor);
		}.bind(this, warnDlg, xhttp, monitorObject));

	
	warnDlg.find('.cancel-request-dlg-wait').on('click', function (dlg, request, monitor, e) {
				this.cleanup();
				//console.log('closed dialog, waiting');
				monitor.continueFunc(request, monitor);
			}.bind(this, warnDlg, xhttp, monitorObject));
	
	this.warnDlg = warnDlg;
	warnDlg.ibxWidget('open');		
	
};

requestEventProcessorUI.prototype.cleanup = function() {
	if(this.warnDlg)
		this.warnDlg.ibxWidget('close');
	this.warnDlg = null;
};

requestEventProcessorUI.prototype.postAbortProcessing = function() {
	
};

function requestEventProcessorUIWithUndo() {
	
};

requestEventProcessorUIWithUndo.prototype = new requestEventProcessorUI();

requestEventProcessorUIWithUndo.prototype.postAbortProcessing = function() {
	var dfMediator = SharedUtil.getDFMediator();
	if(dfMediator) {
		//dfMediator.dfUndoManager.undo();
		dfMediator.dfUndoManager.loadTopOfFDMUndoStack();
	}
};

function requestEventProcessorForComLink(comLinkInstance) {
	this._comLinkInstance = comLinkInstance;
};

requestEventProcessorForComLink.prototype = new requestEventProcessorUI();

requestEventProcessorForComLink.prototype.postAbortProcessing = function() {
	var dfMediator = SharedUtil.getDFMediator();
	if(dfMediator) {
		dfMediator.dfUndoManager.loadTopOfFDMUndoStack(this._comLinkInstance);		
	}
};
