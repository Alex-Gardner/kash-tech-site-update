/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.2 $:
//////////////////////////////////////////////////////////////////////////

$.widget("ibi.aboutWebFocus", $.ibi.ibxDialog,
{
	options:
	{
		"type": "medium",
		"nameRoot": true,
		"movable": false,
		"closeSelector": "",
	},
	_widgetClass: "about-webfocus",
	
	_create: function()
	{
		this._super();
        this.element.on("ibx_close", function(e, btn)
        {
               $(this.options.closeSelector).focus();
        }.bind(this));

	},
	initData: function(initialData)
	{
	    this.element.find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("hpreboot_helpabout"));
		this.element.find(".help-about-edition").ibxWidget('option', 'text', initialData.aboutWebFocus.edition);
		this.element.find(".help-about-product_release").ibxWidget('option', 'text', initialData.aboutWebFocus.prduct_release);	
		this.element.find(".help-about-service_pack").ibxWidget('option', 'text', initialData.aboutWebFocus.service_pack);	
		this.element.find(".help-about-package_id").ibxWidget('option', 'text', initialData.aboutWebFocus.package_id);	
		this.element.find(".help-about-release_id").ibxWidget('option', 'text', initialData.aboutWebFocus.release_id);
		this.element.find(".help-about-build_number").ibxWidget('option', 'text', initialData.aboutWebFocus.build_number);	
		this.element.find(".help-about-build_date").ibxWidget('option', 'text', initialData.aboutWebFocus.build_date);	
		this.element.find(".help-about-application_server").ibxWidget('option', 'text', initialData.aboutWebFocus.application_server);
		  
	},
});


//# sourceURL=aboutWebFocus.js