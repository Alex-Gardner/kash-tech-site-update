/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.11 $:
//////////////////////////////////////////////////////////////////////////

$.widget("ibi.pdTabOverflow", $.ibi.ibxTabPane,
{
	options:
	{
		"justify": "start",
        "showNew": true,
        "wantResize": true,
        "menuClasses": "",
		tabBarOptions:{
			"showPrevButton": false,
            "showNextButton": false,
            "hideDisabledButtons": true,
		},
	},
	_init: function ()
	{
        this._super();
        this._itemBox = this.element.find(".ibx-csl-items-box");
        this._itemBox.ibxWidget("option", "justify", this.options.justify);
        this.element.on("ibx_change", this._onChange.bind(this));
		this.element.on("ibx_resize", this._onResize.bind(this));
        var nextButton = this._tabBar.find(".ibx-csl-next-btn");
        this._overflowButton = $("<div class='tab-overflow-button'>").ibxButtonSimple({"glyphClasses": "ibx-icons ds-icon-ellipse"});
        this._overflowButton.on("click", this._onOverflow.bind(this));
        nextButton.parent().append(this._overflowButton, nextButton);
        this._newButton = $("<div class='tab-new-button' title='" + SharedUtil.escapeXml(ibx.resourceMgr.getString("tooltip_new_tab")) + "'>").ibxButtonSimple({"glyphClasses": "ibx-icons ds-icon-plus"});
        this._newButton.on("click", this._onNew.bind(this));
        if (!this.options.showNew)
            this._newButton.hide();
	},
    _widgetClass: "tab-overflow",
    _getOverflowMenu: function ()
    {
        return $("<div class='tab-overflow-menu ibx-menu-no-icons " + this.options.menuClasses + "'>").ibxMenu({destroyOnClose: true, multiSelect : false, position: {my: "right top", at: "right bottom", collision: "none", of: this._overflowButton, using: this._menuPosition.bind(this)}});
    },
	_menuPosition: function (pos, info)
	{
        var maxHeight = $(window).height() + $(window).scrollTop() - info.target.top - info.target.height - 50;
        if (maxHeight < 100)
            maxHeight = 100;
        this._overflowMenu.css("max-height", maxHeight + "px");
        this._overflowMenu.css("min-width", info.target.width + "px");
        this._overflowMenu.css(pos);
	},
	_onChange: function ()
	{
        this._fixNewOverflow();
	},
	_onResize: function ()
	{
        this._fixNewOverflow();
	},
    _fillOverflowMenu: function (overflowMenu)
    {
        var pages = this.children();
        var selPage = this.selected();
        for (var i = 0; i < pages.length; i++)
        {
            var page = $(pages[i]);
            var button = page.ibxWidget("button");
            var menu = $("<div class='tab-overflow-menu-item'>").ibxMenuItem({"labelOptions": {"text": button.ibxWidget("option", "text")}, "userValue": {"type": "page", "page": page, "index": i}});
            if (selPage && page[0] == selPage[0])
                menu.addClass("selected-page");
            overflowMenu.ibxWidget("add", menu);
        }
    },
    fixNewOverflow: function ()
    {
        this._fixNewOverflow();
    },
    _fixNewOverflow: function ()
    {
        this._itemBox.append(this._newButton);
        if (this._itemBox[0].scrollWidth > this._itemBox[0].offsetWidth)
        {
            this._overflowButton.show();
            if (this.options.showNew)
                this._newButton.hide();
        }
        else
        {
            if (this._overflowMenu)
            this._overflowMenu.ibxWidget("close");
            this._overflowButton.hide();
            if (this.options.showNew)
                this._newButton.show();
        }

        var selected = this.selected();
        if (selected)
        {
        	var selButton = selected.ibxWidget("button");
        	if (selButton.length > 0)
        		this._tabBar.ibxWidget("scrollTo", selButton);
        }
    },
    _onNew: function (e)
    {
        this._fixNewOverflow();
    },
    _onOverflow: function (e)
    {
        var overflowMenu = this._overflowMenu = this._getOverflowMenu();
        this._fillOverflowMenu(overflowMenu);
        overflowMenu.on("ibx_select", this._onOverflowSelect.bind(this));
        overflowMenu.on("ibx_beforeclose", this._onOverflowBeforeClose.bind(this));
        overflowMenu.ibxWidget("open");
    },
    _onOverflowBeforeClose: function (e)
    {
        this._overflowMenu = null;
    },
    _onOverflowSelect: function(e, menuItem)
    {
        var userValue = $(menuItem).ibxWidget("userValue");
        if (userValue && userValue.type == "page")
            this.selected(userValue.page);
    },
});


//# sourceURL=taboverflow.js
