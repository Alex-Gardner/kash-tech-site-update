/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.18 $:
//////////////////////////////////////////////////////////////////////////

$.widget("ibi.ibfsTree", $.ibi.ibxTree,
{
	options:
	{
        "ibfs": null,
        "startPath": "",
        "rootPaths": [],
        "singleClickExpand": true,
	},
	_widgetClass: "ibfs-tree",	
	_init: function ()
	{
        this._super();								
        this._buildTree();
    },
    _buildTree: function ()
    {
        var defRoot = [];
        for (var i = 0; i < this.options.rootPaths.length; i++)
        {
            defRoot.push(this._addRoot(this.options.rootPaths[i]));
        }

		$.when.apply($, defRoot).done(function ()
		{
            this.refresh(true);
        }.bind(this));
    },
    _createNode: function (item)
    {
        return $("<div>").ibfsTreeNode({"ibfs": this.options.ibfs, "ibfsInfo": item});
    },
    _addRoot: function (path)
    {
        var deferred = jQuery.Deferred();
        this.options.ibfs.getItemInfo(path, null, {"asJSON": true}).done(function (deferred, cInfo)
        {
            var node = this._createNode(cInfo.result);
            this.add(node);
            node.ibxWidget("expanded", true);
            deferred.resolve();
        }.bind(this, deferred));
        return deferred;
    },
});

$.widget("ibi.ibfsTreeNode", $.ibi.ibxTreeNode,
{
	options:
	{
        "ibfs": null,
        "ibfsInfo": null,
        "refreshOnExpand": false,
        "fileTypes": null,
	},
	_widgetClass: "ibfs-tree-node",	
	_init: function ()
	{
        var options = this.options;
        var info = options.ibfsInfo;
        options.labelOptions.text = info.description;
        options.container = info.container;
        if (options.container)
        {
            options.btnCollapsed = "ibx-icons ds-icon-plus";
            options.btnExpanded = "ibx-icons ds-icon-minus";
        }
        else
        {
            options.labelOptions.glyphClasses = (info.clientInfo.typeInfo && info.clientInfo.typeInfo.glyphClasses) ? info.clientInfo.typeInfo.glyphClasses : "ibx-icons ds-icon-unknown";
        }
        this._super();
    },
    _isValidType: function (item)
    {
        if (this.options.fileTypes)
            return this.options.fileTypes.indexOf(item.extension.toLowerCase()) >= 0;
        else
            return true;
    },
    _createNode: function (item)
    {
        return $("<div>").ibfsTreeNode({"ibfs": this.options.ibfs, "ibfsInfo": item});
    },
    expanded:function(expanded)
	{
        if (expanded === undefined)
            return this.options.expanded;
        
        if (expanded)
        {
            if (this.options.refreshOnExpand)
                this.remove();

            
            if (!this.children().length)
            {
                var listItemsParams = {"strPath": this.options.ibfsInfo.fullPath, "depth": null, "flatten": null, "options": { asJSON: true, clientSort: false }};
                if (!this.element.dispatchEvent("ibfstree_beforelist", listItemsParams, true, true, this.tree()).defaultPrevented)
                {
                    this.options.ibfs.listItems(listItemsParams.strPath, listItemsParams.depth, listItemsParams.flatten, listItemsParams.options).done(function (exInfo)
                    {

                        this.element.dispatchEvent("ibfstree_afterlist", exInfo.result, true, false, this.tree());
                        var startPath = this.element.closest(".ibfs-tree").ibxWidget("option", "startPath");
                        var navigated = false;
                        $.each(exInfo.result, function (idx, item)
                        {
                            if (this._isValidType(item))
                            {
                                var node = this._createNode(item);
                                var bPrivate = (((item.ownerId && item.ownerId != "") || (item.inheritedPrivacy && item.inheritedPrivacy == "true" )) && item.fullPath.indexOf("/~") == -1);
                                if (bPrivate)
                                    node.addClass('ibfs-tree-node-private');
                                var hidden = (item.clientInfo.properties.hidden && item.clientInfo.properties.hidden == "on" && item.fullPath.indexOf("/~") == -1);
                                if (hidden)
                                    node.addClass('ibfs-tree-node-hidden');
                                this.add(node);

                                if (item.container && startPath && (startPath.indexOf(item.fullPath + "/") == 0 || startPath == item.fullPath))
                                {
                                    navigated = true;
                                    var tree = $(this.tree());
                                    tree.ibxTreeSelectionManager("selected", this.element, false);
                                    tree.ibxTreeSelectionManager("selected", node, true);
                                    node.ibxWidget("expanded", true);
                                    node[0].scrollIntoView();
                                }
                            }
                        }.bind(this));
                        if (!navigated)
                            this.element.closest(".ibfs-tree").ibxWidget("option", "startPath", "");
                    }.bind(this));
                }
            }
        }
        return this._super(expanded);
	},
});


$.widget("ibi.ibfsTreeBrowser", $.ibi.ibxTreeBrowser,
{
	options:
	{
        "ibfs": null,
        "startPath": "",
        "rootPaths": [],
        "singleClickExpand": true,
        "searchBox": true,
	},
	_widgetClass: "ibfs-tree-browser",	
	_init: function ()
	{
        this.element.addClass("ibfs-tree"); // for styling
        this._super();								
        if (this.options.searchBox)
            this._buildSearchBox();
        this._buildTree();
    },
    _buildSearchBox: function ()
    {
        this._searchBox = ibx.resourceMgr.getResource(".ibfs-tree-search-box", true);
        this._searchBox.find(".ibfs-tree-search-btn").on("click", this._onSearch.bind(this));
        this._searchBox.find(".ibfs-tree-search-edit").on("ibx_change", this._onSearch.bind(this));
        this._searchBox.find(".ibfs-tree-search-edit").on("ibx_textchanged", this._onTextChanged.bind(this));
        this._searchBox.find(".ibfs-tree-search-edit").on("keydown keyup keypress", (e) => e.stopPropagation());
        this.element.prepend(this._searchBox);
    },
    _onTextChanged: function (e, data)
    {
        this._searchBox.find(".ibfs-tree-search-edit").data("ibiIbxTextField")._focusVal = data.text;
        if (this._autoSearchTimeout)
            clearTimeout(this._autoSearchTimeout);
        this._autoSearchTimeout = setTimeout(this._onAutoSearch.bind(this), 500);
    },
    _onAutoSearch: function (){
        if (this._autoSearchTimeout)
        {
            clearTimeout(this._autoSearchTimeout);
            this._autoSearchTimeout = null;
        }
        this._onSearch();
    },
    _onSearch: function ()
    {
        var searchText = this._searchBox.find(".ibfs-tree-search-edit").ibxWidget("option", "text");
        if (searchText == this._lastSearch)
            return;
        this._lastSearch = searchText;
        this.children(".tnode-root").ibxWidget("search", searchText);        
    },
    cleanSearch: function ()
    {
    	if (this._searchBox){
            this._lastSearch = "";
            this._searchBox.find(".ibfs-tree-search-edit").ibxWidget("option", "text", "");
        }
    },
    _buildTree: function ()
    {
        var defRoot = [];
        for (var i = 0; i < this.options.rootPaths.length; i++)
        {
            defRoot.push(this._addRoot(this.options.rootPaths[i]));
        }

		$.when.apply($, defRoot).done(function ()
		{
            this.refresh(true);
        }.bind(this));
    },
    _createNode: function (item)
    {
        return $("<div>").ibfsTreeBrowserNode({"ibfs": this.options.ibfs, "ibfsInfo": item});
    },
    _addRoot: function (path)
    {
        var deferred = jQuery.Deferred();
        this.options.ibfs.getItemInfo(path, null, {"asJSON": true}).done(function (deferred, cInfo)
        {
            var node = this._createNode(cInfo.result);
            this.add(node);
            deferred.resolve();
        }.bind(this, deferred));
        return deferred;
    },
});

$.widget("ibi.ibfsTreeBrowserNode", $.ibi.ibxTreeBrowserNode,
{
	options:
	{
        "ibfs": null,
        "ibfsInfo": null,
        "fileTypes": null,
        "showEmptyNode": false,
	},
	_widgetClass: "ibfs-tree-browser-node",	
	_init: function ()
	{
        this.element.addClass("ibfs-tree-node"); // for styling
        var options = this.options;
        var info = options.ibfsInfo;
		var myContentFolder = info.inMyContent;
        options.labelOptions.text = info.description;
        options.container = info.container;

		if (myContentFolder) {
			var paths = info.parentPath.split("/");
			var i;
			for (i = 0; i < paths.length; i++) {
				if (paths[i].indexOf("~") == 0) {
					myContentFolder = false;
					break;
				}
			}
		}
		
		if (options.container)
			options.labelOptions.glyphClasses = "ibx-icons ds-icon-folder";
		else
			options.labelOptions.icon = info.thumbPath;

		/* Add Overlays */
		var overlays = [];
		if (myContentFolder && info.sharedToOthers) {
			overlays.push({'position':'bl','glyphClasses':'home-item-overlay fa fa-user'});
			overlays.push({'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'});
		}
		else if (myContentFolder)
			overlays.push({'position':'bl','glyphClasses':'home-item-overlay fa fa-user'});
		else if(info.inMyContent && info.sharedToOthers)
			overlays.push({'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'});
		else if (info.fullPath.indexOf("/##SHARE") != -1)
			overlays.push({'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'});
			
		if (info.type == "LinkItem")
			overlays.push({'position':'bl','glyphClasses':'home-item-overlay ibx-icons ds-icon-shortcut'});
		
		if (overlays.length > 0)
			options.labelOptions.overlays = overlays;

        this._super();
    },
    _isValidType: function (item)
    {
        if (this.options.fileTypes)
            return this.options.fileTypes.indexOf(item.extension.toLowerCase()) >= 0;
        else
            return true;
    },
    _createNode: function (item)
    {
        return $("<div>").ibfsTreeBrowserNode({"ibfs": this.options.ibfs, "ibfsInfo": item});
    },
    search: function (searchText)
    {
        var listItemsParams;
        if (searchText)
        {
            this._searched = true;
            listItemsParams = {"strPath": this.options.ibfsInfo.fullPath + '/##FILTER("attribute","description","*' + searchText + '*","nocase")', "depth": -1, "flatten": true, "options": { asJSON: true, clientSort: false }};
        }
        else
        {
            this._searched = false;
            listItemsParams = {"strPath": this.options.ibfsInfo.fullPath, "depth": null, "flatten": null, "options": { asJSON: true, clientSort: false }};
        }
        if (!this.element.dispatchEvent("ibfstree_beforelist", listItemsParams, true, true, this.tree()).defaultPrevented)
        {
            var tree = $(this.tree());
			ibx.waitStart(tree);
            if (searchText) {            	
        		var options = {IBFS_domainsFilter: this.options.ibfsInfo.fullPath.split('/')[3]	};
        		this._lastRequest = this.options.ibfs.searchRepositoryDesc(searchText, options).done(this._processSearchItems.bind(this));            	
            }
            else
                this._lastRequest = this.options.ibfs.listItems(listItemsParams.strPath, listItemsParams.depth, listItemsParams.flatten, listItemsParams.options).done(this._processItems.bind(this));
        }
    },
    expanded: function(expanded)
    {
        if (expanded === undefined)
            return this.options.expanded;
        
        var tree = $(this.tree());
        if (!expanded)
        {
            tree.ibxWidget("cleanSearch");
            if (this._searched)
            {
                this.children().remove();
                if (this.isRoot())
                {
                    // force root reload
                    expanded = true;
                    this.options.expanded = false;
                }
            }
        }
        this._searched = false;

        if (expanded && this.options.expanded != expanded)
        {
            if (!this.children().length)
            {
                var listItemsParams = {"strPath": this.options.ibfsInfo.fullPath, "depth": null, "flatten": null, "options": { asJSON: true, clientSort: false }};
                if (!this.element.dispatchEvent("ibfstree_beforelist", listItemsParams, true, true, this.tree()).defaultPrevented)
                {
                    this._lastRequest = this.options.ibfs.listItems(listItemsParams.strPath, listItemsParams.depth, listItemsParams.flatten, listItemsParams.options).done(this._processItems.bind(this));
                }
            }
        }
        return this._super(expanded);
    },
	_onNodeLabelEvent:function(e)
	{
        this._cleanNode();
        this._super(e);
	},
	_onBtnExpandClick:function(e)
	{
        this._cleanNode();
        this._super(e);
    },
    _cleanNode: function ()
    {
        if (this.options.refreshOnExpand && !this.options.expanded)
            this.children().remove();
    },
    _processSearchItems: function (exInfo)
    {
        this._processItems(exInfo, true);
    },
    _processItems: function (exInfo, isSearch)
    {
        var tree = $(this.tree());
        ibx.waitStop(tree);
        if (this._lastRequest != exInfo)
            return;
        this.children().remove();
        this.element.dispatchEvent("ibfstree_afterlist", exInfo.result, true, false, this.tree());
        var startPath = tree.ibxWidget("option", "startPath");
        var navigated = false;
        var nodeCount = 0;
        $.each(exInfo.result, function (idx, item)
        {
            if (this._isValidType(item) && (!isSearch || !item.container))
            {
                var node = this._createNode(item);
                if (isSearch)
                    node.attr("title", item.fullPath);
                var bPrivate = (((item.ownerId && item.ownerId != "") || (item.inheritedPrivacy && item.inheritedPrivacy == "true" )) && item.fullPath.indexOf("/~") == -1);
                if (bPrivate)
                    node.addClass('ibfs-tree-node-private');
                var hidden = (item.clientInfo.properties.hidden && item.clientInfo.properties.hidden == "on" && item.fullPath.indexOf("/~") == -1);
                if (hidden)
                    node.addClass('ibfs-tree-node-hidden');
                this.add(node);
                nodeCount++;

                if (item.container && startPath && (startPath.indexOf(item.fullPath + "/") == 0 || startPath == item.fullPath))
                {
                    navigated = true;
                    tree.ibxTreeSelectionManager("selected", this.element, false);
                    tree.ibxTreeSelectionManager("selected", node, true);
                    node.ibxWidget("expanded", true);
                }
            }
        }.bind(this));
        this.element.removeClass("no_content_node_parent");
		if (nodeCount == 0 && this.options.showEmptyNode)
		{
            var dfMediator = SharedUtil.getDFMediator(this.element);
            var node;
            if (dfMediator){
                this.element.addClass("no_content_node_parent");
                node = $("<div class='no_content_node'>").pdEmbeddedTreeNode({"justify": "center", "candrag": false, "labelOptions": {"text": ibx.resourceMgr.getString('str_ibfs_tree_empty_folder'), "icon": ibx.resourceMgr.getString("folder_open", "", "resource_strings"), "iconPosition": "top"}});
            }
            else{
                node = $("<div class='no_content_node'>").pdEmbeddedTreeNode({"candrag": false, "labelOptions": {"text": ibx.resourceMgr.getString('str_ibfs_tree_no_content'), "glyphClasses": "fa fa-info-circle"}});
            }
			this.add(node);
		}

        this.refreshIndent(0, true);
        if (!navigated)
            tree.ibxWidget("option", "startPath", "");
    },
});


//# sourceURL=ibfstree.js
