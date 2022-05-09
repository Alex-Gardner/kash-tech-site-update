/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.7 $:

$.widget("ibi.dialogMenuItem", $.ibi.ibxMenu, 
{
	options:
	{
		"destroyOnClose":false,
		"navKeyRoot":false,
		"focusRoot": true
	},
	_widgetClass: "dialog-menu-item",
	_create:function()
	{
		this._super();
		this._btnBox = $("<div class='dmi-btn-box ibx-dialog-button-box'>").ibxHBox({justify:'end'});
		this._btnOK = $("<div tabindex='0' class='dmi-btn-ok ibx-dialog-ok-button'>").ibxButton({text:ibx.resourceMgr.getString("IBX_STR_OK"), "userValue":"ok"});
		this._btnCancel = $("<div tabindex='0' class='dmi-btn-cancel ibx-dialog-cancel-button'>").ibxButton({text:ibx.resourceMgr.getString("IBX_STR_CANCEL"), "userValue":"cancel"});
		this._btnBox.append(this._btnOK, this._btnCancel);
		this.element.append(this._btnBox);
		this._btnOK.on("click",this._onClick.bind(this));
		this._btnCancel.on("click",this._onClick.bind(this));
	},
	_destroy:function()
	{
		this._super();
	},
	_init:function()
	{
		this._super();
		var children = this.element.children(":not(.ibx-menu-items-box, .dmi-btn-box)");
		this.add(children);
	},
	children:function(selector)
	{
		return this._box.ibxWidget("children", "*");
	},
	_onClick: function(e)
	{
		var info = $(e.currentTarget).ibxWidget("userValue");	
		this.close(info);
		this._trigger("menu_item_click", null, this.element);//bubble click event to owner menu to close.
	},
	_onMenuKeyDown:function(e)
	{
		if(e.keyCode == $.ui.keyCode.ESC)
			this.close();
	},
	close: function(closeInfo)
	{
		this.element.find('.ibx-select-base').ibxWidget('closePopup');
		this._super(closeInfo);
	},
	popupClosed:function()
	{		
	},
	_refresh:function()
	{
		this._super();
	}
});

//# sourceURL=dialogmenuitem.js
