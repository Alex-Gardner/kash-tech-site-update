/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.1 $:

/* DEV NOTES:
     type - type of box dev wants (information / success / warning / error)
	 info - string of a message to be displayed or array of strings or objects if there are multiple messages to be displayed
	 	If an array is passed, one of two configurations will be shown depending on if the element is a string or an object
	 		If a string is passed, then a simple bulleted message will be displayed
	 		If an object is passed then we look for an object of the following form:
	 			{
	 				"label": "Quick description of the error",
	 				"details": "Long form description of the error",
	 				"overrideFn: function()
	 			}
	 		The "details" text will be hidden until the user clicks the "See Details..." link in the child component that appears after the label
	 		If overrideFn is specified, it will be called instead of the default functionality of displaying the additional details.  This function is 
	 			bound such that the value of "this" will refer to the child errorWarningMessageDetails element.  Following doing whatever additional 
	 			processing the passed function does, you can call this.updateAndShowDetails(string) to update and display the new error message.
	 isMultiMessages - if there are multiple messages: true/false
	 displayCloseIcon - if the info box is allowed to be hidden by dev: true/false
	 
	 See examples in 
	 \webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\ibxtools\wfcomponents\subtotalDialog\testing\dsMessaging.jsp
 */

$.widget("ibi.errorWarningMessages", $.ibi.ibxVBox,
{
	options:
	{
		'nameRoot':true,
		'align': "stretch",
		'data': null,
		'type': "information",
		'info': ibx.resourceMgr.getString('errorWarningMessages.default_message'),
		'isMultiMessages': false,
		'multiMessagesTitle': ibx.resourceMgr.getString('errorWarningMessages.multiple_messages'),
		'displayCloseIcon': false,
		'detailsViewMaxLines': undefined
	},
	_widgetClass: "ds-messaging-ui",
	_create: function ()
	{
		this._super();
		var markup = this._loadWidgetTemplate(".wfc-ds-messaging");
		this.information.ibxWidget("option", "wrap", true);
		this.information.ibxWidget("option", "textWrap", true);
		this.hideCloseButton();
		this.hideMultipleMessageContainer();
		this.hideExpandMessagesButton();
		this.hideCollapseMessagesButton();
		this.hideInformationBtn.on("click", this.hideInformationBox.bind(this));
		this.expandInformationBtn.on("click", this.showMultipleMessageContainer.bind(this));
		this.collapseInformationBtn.on("click", this.hideMultipleMessageContainer.bind(this));
	},
	
	// to hide the current information box
	hideInformationBox: function()
	{
		this.element.hide();
	},
	// show any existing information box
	showInformationBox: function()
	{
		this.hideExistingInformationBox(); // before showing any information box make sure all other boxes are hidden so only one information box is visible at a time
		this.element.show();
	},
	// remove any specific information box from the DOM
	removeExistingInformationBox: function()
	{
		this.element.remove();
	},
	// hide the container of multiple messages
	hideMultipleMessageContainer: function()
	{
		this.multipleMessagesContainer.hide();
		this.hideCollapseMessagesButton();
		this.showExpandMessagesButton();
	},
	// show the container of multiple messages
	showMultipleMessageContainer: function()
	{
		this.multipleMessagesContainer.show();
		this.hideExpandMessagesButton();
		this.showCollapseMessagesButton();
	},
	// toggle expand / collapse button
	hideExpandMessagesButton: function()
	{
		this.expandInformationBtn.hide();
	},
	showExpandMessagesButton: function()
	{
		this.expandInformationBtn.show();
	},
	hideCollapseMessagesButton: function()
	{
		this.collapseInformationBtn.hide();
	},
	showCollapseMessagesButton: function()
	{
		this.collapseInformationBtn.show();
	},
	// toggle close button upon dev's choice
	hideCloseButton: function()
	{
		this.hideInformationBtn.hide();
	},
	showCloseButton: function()
	{
		this.hideInformationBtn.show();
	},
	// format multiple messages
	appendMessagesToTheContainer: function(messages)
	{
		for (var i = 0; i < messages.length; i++) {
			if(typeof messages[i] === 'string') {
				var _option = {
						'wrap': true,
						'textWrap': true,
						'glyphClasses': 'fas fa-circle',
						'text': messages[i]
				}
				var message = $('<div tabIndex="0" class="message" role="listitem" data-ibxp-nav-key-root="true" data-ibxp-focus-default="true">').ibxLabel(_option);//.text(messages[i]);
				this.multipleMessagesContainer.append(message);
			} else if (typeof messages[i] === 'object') {
				if(messages[i].label && messages[i].details) {
					var message = $('<div tabIndex="0" class="message" role="listitem" data-ibxp-nav-key-root="true" data-ibxp-focus-default="true">').errorWarningMessageDetails();
					message.ibxWidget("option", messages[i]);
					if(messages[i].overrideFn) {
						message.errorWarningMessageDetails("bindOverrideFn");
					}
					// If we have configured a size for the child component, pass that along
					if(this.options.detailsViewMaxLines) {
						message.ibxWidget("option", "maxRows", this.options.detailsViewMaxLines);
					}
					this.multipleMessagesContainer.append(message);
				} else {
					console.error("Passed message object needs to have elements called 'label' and 'details'.  The following object will not be displayed: " + messages[i]);
				}
			} else {
				console.error("Passed message needs to be a string or an object with elements called 'label' and 'details'.  The following will not be displayed: " + messages[i]);
			}
		}
	},
	// method to append new messages into the multimessages
	addMessage: function(newMessage)
	{
		if (this.options.isMultiMessages)
			this.appendMessagesToTheContainer(newMessage);
	},
	// method to update the message or multimessages
	updateMessage: function(newMessage)
	{
		if (this.options.isMultiMessages)
		{
			// remove previous text before updating with new text
			var child = this.multipleMessagesContainer[0].lastElementChild;  
	        while (child) { 
	        	this.multipleMessagesContainer[0].removeChild(child); 
	            child = this.multipleMessagesContainer[0].lastElementChild; 
	        }
			this.appendMessagesToTheContainer(newMessage);
		}
		else
			this.information.ibxWidget("option", "text", newMessage);
	},
	// method to update the type of message on go
	updateTypeOfMessage: function(newType)
	{
		this.element.removeClass("ds-" + this.options.type)
		this.element.addClass("ds-" + newType);
		switch (newType)
		{
			case "success":
			{
				this.dsMessageTypeIcon.ibxWidget("option", "glyphClasses", "fas fa-check");
				break;
			}
			case "warning":
			{
				this.dsMessageTypeIcon.ibxWidget("option", "glyphClasses", "fas fa-bell");
				break;
			}
			case "error":
			{
				this.dsMessageTypeIcon.ibxWidget("option", "glyphClasses", "fas fa-star-of-life");
				break;
			}
			default:
			{
				this.dsMessageTypeIcon.ibxWidget("option", "glyphClasses", "ds-icon-comment-empty");
				break;
			}
		}
	},
	refresh: function()
	{
		this._super();
		this.updateTypeOfMessage(this.options.type);
		if (this.options.displayCloseIcon)
			this.showCloseButton();
		if (this.options.isMultiMessages)
		{
			this.hideInformationBtn.find('.ibx-label-glyph')[0].style.marginLeft = "10px";
			this.showExpandMessagesButton();
			this.information.ibxWidget("option", "text", this.options.multiMessagesTitle);
			this.appendMessagesToTheContainer(this.options.info);
		}
		else
			this.information.ibxWidget("option", "text", this.options.info);
	}
});

$.widget("ibi.errorWarningMessageDetails", $.ibi.ibxVBox,
{
	options:
	{
		'nameRoot':true,
		'align': "stretch",
		'type': "information",
		'seeDetailsMsg': ibx.resourceMgr.getString('errorWarningMessages.see_details'),
		'hideDetailsMsg': ibx.resourceMgr.getString('errorWarningMessages.hide_details'),
		'label':'',
		'details':'',
		'overrideFn': undefined,
		'maxRows': 7,
	},
	_widgetClass: "ds-messaging-with-details-ui",
	detailsHidden: true,
	_create: function ()
	{
		this._super();
		var markup = this._loadWidgetTemplate(".wfc-ds-messaging-with-details");
		this.errorDetails.hide();
		this.detailsLink[0].text = this.options.seeDetailsMsg;
		this.detailsLink.on("click", this.options.overrideFn === undefined ? this.showHideErrorDetailsBox.bind(this) : this.options.overrideFn.bind(this));
		this.errorDetails.ibxWidget("option", "readonly", "true");
		this.errorDetails.ibxWidget("option", "wrap", "true");
		this.errorDetails.ibxWidget("option", "textwrap", "true");
	},
	
	showHideErrorDetailsBox: function() {
		if(this.detailsHidden) {
			this.detailsLink[0].text = this.options.hideDetailsMsg;
			this.errorDetails.show();
		} else {
			this.detailsLink[0].text = this.options.seeDetailsMsg;
			this.errorDetails.hide();
		}
		this.detailsHidden = !this.detailsHidden;
	},
	
	refresh: function() {
		this._super();
		this.errorHeaderText[0].textContent = this.options.label;
		
		//if the new text that we are displaying is longer than the configured maximum number of rows
		//then we cap out the size of our text area and add a scroll bar
		var tmpDetails = this.options.details.split('\n');
		var addScrolling = tmpDetails.length > this.options.maxRows;
		this.errorDetails.ibxWidget("option", "text", this.options.details);
		this.errorDetails.ibxWidget("option", "rows", addScrolling ? this.options.maxRows : tmpDetails.length);
		if(addScrolling) {
			this.errorDetails[0].firstChild.style.overflow = 'scroll';
		} 
	},
	
	bindOverrideFn: function() {
		this.detailsLink.off("click");
		this.detailsLink.on("click", this.options.overrideFn.bind(this));
	},
	
	updateAndShowDetails: function(detailsStr) {
		this.options.details = detailsStr;
		this.refresh();
		this.detailsHidden = true;
		this.showHideErrorDetailsBox();
	}
});