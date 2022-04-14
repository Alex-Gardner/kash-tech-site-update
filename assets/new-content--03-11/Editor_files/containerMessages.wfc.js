/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.1 $:

/* DEV NOTES:
     type - type of box dev wants:
     	blank	- used to have a completely blank container
     	drop	- used to show drop fields or drop content messages
     	empty	- used to display message that there is no content
     	error	- used to show error messages
     	loading	- used to show loading spinner
     errorDetails - if type is error, show additional information about the error
     dropcontext -  valid values are "designer" and "assemble", to pull the right string from 
     				resrouce bundles for these contexts
	 
	 See examples in 
	 \webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\ibxtools\wfcomponents\canvas\testing\containerMessaging.jsp
 */

$.ibi.CONTAINER_MESSAGE_TYPE_BLANK = "blank";
$.ibi.CONTAINER_MESSAGE_TYPE_DROP = "drop";
$.ibi.CONTAINER_MESSAGE_TYPE_EMPTY = "empty";
$.ibi.CONTAINER_MESSAGE_TYPE_ERROR = "error";
$.ibi.CONTAINER_MESSAGE_TYPE_LOADING = "loading";
$.ibi.CONTAINER_MESSAGE_TYPE_CANCEL = "cancel";

$.widget("ibi.containerMessage", $.ibi.ibxVBox,
{
	options:
	{
		'nameRoot':true,
		'align': "stretch",
		'type': $.ibi.CONTAINER_MESSAGE_TYPE_BLANK,
		'errorDetails': '',
		'dropcontext': undefined
	},
	iconClassPrefix: "messageIcon ",
	iconClasses: {
		"blank" : " ",
		"drop": " ds-icon-drag-drop",
		"empty" : " ds-icon-empty-box",
		"error" : " ds-icon-status-alert",
		"loading" : " ibx-busy-img svg-gray-rings",
		"cancel" : " ds-icon-status-alert"
	},
	messageTypeClassPrefix: "messageTypeWrapper canvas-messaging-",
	messagePrefix: "canvasMessages.",
	waitWidget: undefined,
	_widgetClass: "ds-container-message",
	_create: function ()
	{
		this._super();
		var markup = this._loadWidgetTemplate(".wfc-ds-container-message");
		this.messageLabel.ibxWidget("option", "textAlign", "center");
	},
	
	refresh: function() {
		this._super();
		
		//Add correct styling based on widget type
		this.messageTypeWrapper[0].className = this.messageTypeClassPrefix + this.options.type;
		this.messageIcon[0].className = this.iconClassPrefix + this.iconClasses[this.options.type];
		
		//if the widget type includes a message, add that in
		if(this.options.type === $.ibi.CONTAINER_MESSAGE_TYPE_EMPTY ||
				this.options.type === $.ibi.CONTAINER_MESSAGE_TYPE_ERROR ||
				this.options.type === $.ibi.CONTAINER_MESSAGE_TYPE_CANCEL) {
			var message = ibx.resourceMgr.getString(this.messagePrefix + this.options.type);
			this.messageLabel.ibxWidget("option", "text", message);
			this.messageLabel.show();
		} else if(this.options.type === $.ibi.CONTAINER_MESSAGE_TYPE_DROP) {
			var message = ibx.resourceMgr.getString(this.messagePrefix + this.options.type + "." + this.options.dropcontext);
			this.messageLabel.ibxWidget("option", "text", message);
			this.messageLabel.show();
		} else {
			this.messageLabel.hide();
		}
		
		//if we have an error type and if we have additional details, show the details part of the widget
		if(this.options.type !== 'cancel' && (this.options.type !== 'error' || !this.options.errorDetails)) {
			this.messageDetails[0].hidden = true;
		} else {
			var msgToShow = this.options.errorDetails;
			if(this.options.type === $.ibi.CONTAINER_MESSAGE_TYPE_CANCEL) {
				msgToShow = ibx.resourceMgr.getString(this.messagePrefix + this.options.type + ".filterMsg");
			}
			this.messageDetails[0].innerHTML = msgToShow;
			this.messageDetails[0].hidden = false;
		}
	},
	
	hideMessage: function () {
		this.element.addClass('container-message-hidden');
	},
	
	showMessage: function () {
		this.element.removeClass('container-message-hidden');
	}
});