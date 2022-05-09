/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/

$.ibi.ibxDialog.createBaseDialog = function(options, msg)
{
	options.aria = $.extend(true, {}, {"describedby":msg.prop("id")}, options.aria);
	var dlg = $("<div>").ibxDialog(options).ibxDialog("add", msg);
	ibx.bindElements(msg);
	
	var statusType = options.statusType;
	if (statusType) $(dlg).addClass("common-status-"+ statusType);
	
	dlg.find(".ibx-dialog-button").each(function() {
		var text = "";
		if ($(this).hasClass("ibx-dialog-ok-button")) {
			$(this).addClass("common-btn btn-solid");
		  $(this).css("order", "1");
			if (options.okText) text = options.okText;
    }
		if ($(this).hasClass("ibx-dialog-no-button")) {
			$(this).addClass("common-btn btn-link");
			if (options.noText) text = options.noText;
    }
		if ($(this).hasClass("ibx-dialog-cancel-button")) {
			$(this).addClass("common-btn btn-link");
			if (options.cancelText) text = options.cancelText;
    }
		if (text) this.textContent = text;
		
    text = text?text:this.textContent;
    if (text) $(this).attr("qa", text)
  });
	return dlg;
};

$.ibi.ibxDialog.createAlertDialog = function(options)
{
	options = options || {};
	
	var btns = options.buttons;
	if (!btns) btns = "ok";
	
	options = $.extend(true, {}, {
		type: "common-dlg common-alert-dlg",
		buttons: btns,
		closeButton: false,
		captionOptions: {
			text: options.caption
		},
		messageOptions: {
			text: options.message,
			textWrap: true,
			justify: "center"
		},
		aria: { role:"alertdialog" }
	}, options);
	var msg = $("<div data-ibx-name='alertdlg'>").ibxLabel(options.messageOptions).ibxAddClass("ibx-dialog-message").ibxAriaId();

  return $.ibi.ibxDialog.createBaseDialog(options, msg);	
};

$.ibi.ibxDialog.createConfirmDialog = function(options)
{
	options = options || {};
	
	var btns = options.buttons;
	if (!btns) btns = "okno";

	options = $.extend(true, {},
	{
		type: "common-dlg common-confirm-dlg",
		buttons: btns,
		captionOptions: {
			text: options.caption
		},
		messageOptions: {
			text: options.message,
			textWrap: true,
			justify: "start"
		},
		aria: { role:"alertdialog" }
	}, options);
	var msg = $("<div data-ibx-name='confirmdlg'>").ibxLabel(options.messageOptions).ibxAddClass("ibx-dialog-message").ibxAriaId();

  return $.ibi.ibxDialog.createBaseDialog(options, msg);	
};

$.ibi.ibxDialog.createPopupDialog = function(options)
{
	options = options || {};

	var btns = options.buttons;
	if (!btns) btns = "oknocancel";

	options = $.extend(true, {}, {
		type: "common-dlg common-popup-dlg",
		buttons: btns,
		captionOptions: {
			text: options.caption
		},
		messageOptions: {
			text: options.message,
			textWrap: true,
			justify: "start"
		},
		aria: { role:"alertdialog" }
	}, options);
	var msg = $("<div data-ibx-name='popupdlg'>").ibxLabel(options.messageOptions).ibxAddClass("ibx-dialog-message").ibxAriaId();

  return $.ibi.ibxDialog.createBaseDialog(options, msg);	
};

$.widget("ibi.commonTestPage", $.ibi.ibxVBox, {
	options: {
		"nameRoot": true
  },  
  _widgetClass: "common-testpage",
  _create: function() {
		this._super();
		this._loadWidgetTemplate(".common-testpage");
		this._addEventHandlers();

		var divFlowChartPage = $(".divFlowChartPage");
		var fcItem = {
			name: "sampleFlowChart",
			class: "wcx-sample-flowchart"
		};
		var fcOptions = {
		};
		if (WcFlowChart) {
  		var wcFlowChart = new WcFlowChart(fcItem, fcOptions);
			if (wcFlowChart) {
				divFlowChartPage.append(wcFlowChart._element);
				if (wcFlowChart.doSample) wcFlowChart.doSample();
			}
		}
  },  
	_addEventHandlers: function() {
		this.testAlertDlgBtn.on('click', function() { this._testAlertDlgBtnClick(); }.bind(this));
		this.testConfirmDlgBtn.on('click', function() { this._testConfirmDlgBtnClick(); }.bind(this));
		this.testPopupDlgBtn.on('click', function() { this._testPopupDlgBtnClick(); }.bind(this));
  },
	_testAlertDlgBtnClick: function()
	{
		var dlg = $.ibi.ibxDialog.createAlertDialog({ statusType: "info", message: "Alert message", caption: "Alert Title" });	
		dlg.ibxDialog("open").on("ibx_close", function(e, btn) {
			
		});
  },
	_testConfirmDlgBtnClick: function() {
		var dlg = $.ibi.ibxDialog.createConfirmDialog({ statusType: "warn", message: "Testing.  \nAre you sure?", caption: "Confirm Title", okText: "Save", noText: "Discard" });
		dlg.ibxDialog("open").on("ibx_close", function(e, btn) {
			
		});
  },
	_testPopupDlgBtnClick: function() {
		var dlg = $.ibi.ibxDialog.createPopupDialog({ message: "Popup content", caption: "Popup Title" });
		dlg.ibxDialog("open").on("ibx_close", function(e, btn) {
			
		});
  }  
});

//# sourceURL=common.js
