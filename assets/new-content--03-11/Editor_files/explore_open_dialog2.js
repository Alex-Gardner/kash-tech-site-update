/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.46 $:
//////////////////////////////////////////////////////////////////////////
$.widget("ibi.opensavedialog2", $.ibi.ibxDialog, 
{
    options:
    {
        
        rootPath:"",
        ctxPath: "",
        viewAs:"tiles",
        'dlgType': "",
        title: "",
        fileTypes: [],        
        multiSelect: false,
        appPath: "",
        selectFolder: false,
        foldersOnly: false,
        singlePathMasters: false,
        okbuttonText: "",
        flatten: false,        
        disableKeyboardInput: false,
		navigation: true,
		hideInput: false,
		hideBreadcrumb: false,
		resizable: true,
		hideTags: false,
		propFilter: "",
		attrFilter: "",
		fileFilter: "",
		tabTitles: [],
		customButtons: [],
		alwaysShowFiletypes: false,
    },
    _ibfs:null,
    _fileName: '',
    _fileTitle: '',
    _items:null,
    _bSearch: false,    
    _applicationContext: "",
    _loaded:null,
    _ses_auth_parm: null, 
	_ses_auth_val: null,
	_psortFieldsList: null,
	_pfileTypesMenu: null,
	_fileTypesList: [],
	_currentFileType: "",
	_noCheck : false,
	_disallowedChars: "",	
	_textSearch: null,	
	_titleSet: false,
	_tilesViewed: false,
	_listViewed: false,
	_tilesPainted: false,
	_listPainted: false,	
	_singlePathMasters: false,
	_appPath: "",
	_bshowBreadcrumb: false,
	_titleMode: true,
	_upDated: false,
	_ctxPath: [],
	_rootPath: [],
	
    _create:function()    
    {
        this._super();
        
        this.sdtxtFileTitle.on('ibx_textchanged', function (e){
        	
        	this._fileTitle = this.sdtxtFileTitle.ibxWidget("option", "text");  
        	var tvalue = this.replaceDisallowedChars(this._fileTitle); 
        	tvalue = this.truncateNameToLength(tvalue);
            this._fileName = tvalue.toLowerCase();        	
        	this.sdtxtFileName.ibxWidget("option", "text", this._fileName);
        	if(this.options.dlgType == "save")
        	{	
        		// can't save at root...        		
				this.setOKButton();        		
        	}
        	else
        		this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);        	
        }.bind(this));
        this.sdtxtFileName.on('ibx_textchanged', function (e){        	
        	this._fileName = this.sdtxtFileName.ibxWidget("option", "text");
        	this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);        	
        }.bind(this));
       
        this.btnOK.ibxWidget('option', 'disabled', true);  
        
        
    	this._ses_auth_parm = WFGlobals.getSesAuthParm(); 
		this._ses_auth_val =WFGlobals.getSesAuthVal();
		
		this._applicationContext=applicationContext;
		fileTypesList = this.options.fileTypes;
		
		$(this.element).resize(function()
		{
			
		}.bind(this));
		this.sdtxtFileName.on('ibx_textchanging', function (e)				
		{			
			if(!this.validateChar(e.key, e.keyCode))
				e.preventDefault();
			else if (this._fileName.length >= this.getMaxNameLength())
				e.preventDefault();
		}.bind(this));
    },
    _init:function()
    {
    	this._super();
    },
    close:function(closeInfo)
	{
    	if(typeof closeInfo == "string" && closeInfo.indexOf("custom") == 0)
    	{
    		this._super(closeInfo);
    	}	
    	else if(typeof closeInfo == "string" && !this._noCheck && this.options.dlgType == "save" && closeInfo != "cancel")
    	{  
    		// coordinate the dialog's filename with the widget...
    		var nameToCheck = this._fileName;    			
    		var endsWith = new RegExp("\\."+this._currentFileType+'$').test(nameToCheck);
    		if (this._currentFileType.length > 0 && this._currentFileType != "pgx" && !endsWith )    			
    			nameToCheck += '.'+this._currentFileType;
    		this._tabpane.ibxWidget("selected").find(".explore_widget_resources").ibxWidget("fileName", nameToCheck);
    		var items = this.ibfsItems();
    		if(items.length > 0)
    		{ 
    			// extract the filename from the path.
    			var filenameParts = items[0].fullPath.split("/");
    			var tfileName = filenameParts[filenameParts.length - 1];
	    		var text = sformat(ibx.resourceMgr.getString("op_file_exists"), tfileName);    			
				var options = 
				{
					type:"medium warning",
					caption: ibx.resourceMgr.getString("op_confirm_save"),
					buttons:"okcancel",		
					messageOptions:{text:text}
				};
				var dlg = $.ibi.ibxDialog.createMessageDialog(options);			
				dlg.ibxDialog("open").on("ibx_close", function(e, btn)
				{
						if(btn=="ok")
						{
							this._noCheck = true;
							this.close("ok");							
						}	
						
				}.bind(this));
		    	
    		}
    		else
    			this._super(closeInfo);
    	}	
    	else if(typeof closeInfo == "string" && !this._noCheck && this.options.dlgType == "open" && closeInfo != "cancel")
    	{
			var items = this.ibfsItems();			
			if(items.length == 0)
			{
				// extract the filename from the path.
    			var filenameParts = this.fileName().split("/");
    			var tfileName = filenameParts[filenameParts.length - 1];
				var text = sformat(ibx.resourceMgr.getString("op_file_not_found"), tfileName);    			
				var options = 
				{
					type:"medium warning",
					caption:ibx.resourceMgr.getString("op_error"),
					buttons:"ok",		
					messageOptions:{text:text}
				};
				var dlg = $.ibi.ibxDialog.createMessageDialog(options);			
				dlg.ibxDialog("open").on("ibx_close", function(e, btn)
				{			
							
						
				}.bind(this));
			}	
			else
	    		this._super(closeInfo);
		}
    	else 
    		this._super(closeInfo);
	},	
    isMicrosoft:function()
	{
		if (document.documentMode)return true;
		else return false;		
	},
    _onFolderClick:function(e)
    {
        var path = $(e.currentTarget).data("ibfsPath");
        Ibfs.load().done(function(folderItem, ibfs)
        {
            ibfs.listItems(path, null, null, {asJSON:true});
        }.bind(this, path));
    },
    _onFileClick:function(e)
    {
        var item = $(e.currentTarget);
        var ibfsItem = item.data("ibfsItem");
        if(!ibfsItem.container || ibfsItem.type == 'PGXBundle')
        {
            this.txtFilename.ibxWidget("option", "text", ibfsItem.description);
            this._fileName = ibfsItem.name;
        }
    },
    _onFileDblClick:function(e)
    {
        var item = $(e.currentTarget);
        var ibfsItem = item.data("ibfsItem");
        if(ibfsItem.container)
            this.option("ctxPath", ibfsItem.fullPath);
    },    
    fileExists:function()
    {
    	return this._noCheck;
    },
    
    fileTitle: function (value)
    { 
    	var name = this._tabpane.ibxWidget("selected").find(".explore_widget_resources").ibxWidget("fileTitle", value);
    	return name; 
    },
    fileTitle: function (value)
    {  	
        if (typeof (value) == "undefined") 
        {	
        	if(this._fileTitle.length == 0)
        	{	
        		var title = this._fileName;
        		if(title.indexOf(".") > -1)
        			title = title.substring(0, title.indexOf("."));
        		this._fileTitle = title;
        	}	
        	return this._fileTitle;
        }	
        else
        {        	
        	this._fileTitle = value;
            this.sdtxtFileTitle.ibxWidget("option", "text", value);
            return this;
        }
    },
    fileName: function (value)
    {  
        if (typeof (value) == "undefined")
        {
        	var fullPath = "";
        	var fileName = this._fileName;
        	if(fileName.length > 0)
        	{
        		var extension = "";
        		if(fileName.indexOf(".") > -1)
        		{	
        			// remove the extension for now...
        			var i = fileName.lastIndexOf(".");
        			extension = fileName.substring(i);
        			fileName = this._fileName.substring(0, i);
        		}
        		// temporary remove first character '~' if fileName start with folder/~Name
        		if(this.options.dlgType == "save")
        			fileName = (this.options.selectFolder && fileName.indexOf("~") == 0) ? "~" + this.replaceDisallowedChars(fileName.substring(1,fileName.length)) : this.replaceDisallowedChars(fileName);
        		else
        			fileName = (this.options.selectFolder && fileName.indexOf("~") == 0) ? "~" + fileName.substring(1,fileName.length) : fileName;
        		if (extension.length > 0) fileName += extension;
        		var path = this._tabpane.ibxWidget("selected").find(".explore_widget_resources").ibxWidget("path");   
        		fullPath = path + "/" + fileName;
        		if (this.options.selectFolder)
        		{// is this a folder?
        			//var item = this._items.findItemByPath(fullPath);
        			
        			var item = this._tabpane.ibxWidget("selected").find(".explore_widget_resources").ibxWidget("findItemByPath", fullPath);
        			if(item && item.container && item.type != "PGXBundle")
        				return fullPath;
        		}	
        		var filenameParts = fullPath.split("/");
        		var tfileName = filenameParts[filenameParts.length - 1];        		
        		if(this._currentFileType.length > 0 && this._currentFileType != "pgx" && this._currentFileType != "*" && tfileName.indexOf(".") == -1)
        			fullPath += "." + this._currentFileType;
        	}	
        	return fullPath;           
        }
        else
        {
        	if(this.options.dlgType == "save")
        	{	
	        	var tvalue = this.replaceDisallowedChars(value);        	
	            this._fileName = tvalue.toLowerCase();
	            this.sdtxtFileName.ibxWidget("option", "text", this._fileName);  
        		// can't save at root...            	
				this.setOKButton();        		
        	}
        	else
        	{
        		this._fileName = value;
        		this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);        		
        		this.sdtxtFileName.ibxWidget("option", "text", this._fileName);
        	}
            return this;
        }
    },
    /*
    fileName: function (value)
    {
        	// get the filename from the currently selected tab pane.
        	var name = this._tabpane.ibxWidget("selected").find(".explore_widget_resources").ibxWidget("fileName", value)
        	return name;    	
    },    
    replaceDisallowedChars: function(value)
    {    	
    	var tvalue;
    	if(this._disallowedChars.length == 0)    	
    		tvalue = value.replace(/ /g, '_');    		
    	else
    	{	
    		tvalue = value.replace(this._disallowedChars, "_");
    	}
    	tvalue = tvalue.replace(/_+/g,'_');
    	if(tvalue.indexOf("~") == 0)tvalue = tvalue.replace("~", "_");
    	return tvalue;
    },
    */
    replaceDisallowedChars: function(value)
    {    	
    	var tvalue;
    	if(this._disallowedChars.length == 0)    	
    		tvalue = value.replace(/ /g, '_');    		
    	else
    	{	
    		tvalue = value.replace(this._disallowedChars, "_");
    	}
    	tvalue = tvalue.replace(/_+/g,'_');
    	if(tvalue.indexOf("~") == 0)
    		tvalue = tvalue.replace("~", "_");
    	return tvalue;
    },
    truncateNameToLength: function(value)
    {   
    	var maxLen = this.getMaxNameLength();
    	var tvalue = value;
    	if (tvalue.length > maxLen ) 
    		tvalue = tvalue.substring(0,maxLen);
    	return tvalue;
    },
    getMaxNameLength: function()
    {
    	var maxLen = 64;
    	if (this._currentFileType.length > 0 && this._currentFileType != "pgx" )
    	{
    		maxLen -= (this._currentFileType.length+1); // extension and .
    	}
    	return maxLen;
    },
    validateChar: function(key, code)
    {
    	if (code == 37 || code == 39 || code == 8 || code == 46 || code == 9) // left/right/backspace/delete/tab
			return true;
		if (key && key.length > 1)
			return false;
       	if(this._disallowedChars.length == 0 && key == ' ')return false;
    	if(key.replace(this._disallowedChars, "") == "")return false;    	
    	else return true;   	
    },
    ibfsItems: function ()
    {
    	// get the selected items for the currently selected tab pane.
    	var items = this._tabpane.ibxWidget("selected").find(".explore_widget_resources").ibxWidget("ibfsItems");
    	return items;    	
    },
    path: function (value)
    {
        if (typeof (value) == "undefined")        
            return this.options.ctxPath;
        else
        {
            this.options.ctxPath = value;
            this.refresh();
            return this;
        }
    },
    refresh:function()
    {
		this._super();
		if (this.options.hideInput)
			this.element.find(".sd-text-input").hide();
		else 
			this.element.find(".sd-text-input").show();
		if (this.options.hideBreadcrumb)
			this.element.find(".sd-crumb-box").hide();
		else 
			this.element.find(".sd-crumb-box").show();
    	if(!this._titleSet && this.options.title.length > 0)
    	{
    		this._titleSet = true;  
    		if(this.options.okbuttonText == "")
    			this.btnOK.ibxWidget("option", "text", this.options.title);
    		else
    			this.btnOK.ibxWidget("option", "text", this.options.okbuttonText);
    	    this.option("captionOptions", {text:this.options.title});
    	    
    	    if(this.options.disableKeyboardInput)
    	    {	
    	    	this.sdtxtFileTitle.ibxWidget('option', 'disabled', true);            	    	
                this.sdtxtFileName.ibxWidget('option', 'disabled', true);     	    
    	    }
    	}    	
    	if(Array.isArray(this.options.ctxPath) || this.options.ctxPath.length > 0)
    	{ 
    		if(Array.isArray(this.options.ctxPath))
    			this._ctxPath = this.options.ctxPath;
   			else	
   				this._ctxPath[0] = this.options.ctxPath;
    		
    		if(Array.isArray(this.options.rootPath))
    			this._rootPath = this.options.rootPath;
    		else
    			this._rootPath[0] = this.options.rootPath;
    		if(!this._loaded)
    		{	
		    	this._loaded=Ibfs.load(this._applicationContext, this._ses_auth_parm, this._ses_auth_val);
		    	this._loaded.done(function(ibfs)
				{
				        this._ibfs=ibfs;
				        var sysinfo=ibfs.getSystemInfo();
				        if(sysinfo.subsystemInfo.WFC)
				        {
					        var dis = sysinfo.subsystemInfo.EDA.pathValidationInfo.disallowedChars;	
					        dis += "%";
					        dis += ".";
					        dis = dis.replace(/\\/,"\\\\").replace(/\(/,"\\(").replace(/\)/,"\\)").replace(/\//,"\\/").replace(/\</,"\\<").replace(/\>/,"\\>")
					        	.replace(/\[/,"\\[").replace(/\]/,"\\]");
					        this._disallowedChars = new RegExp("[" + dis + "]", "g");
					        
					        appPath = this.options.appPath;
					        if(appPath)
					        {	
					        	this._appPath = appPath;					        					        	
					        }	
					        this._fileTypesList = this.options.fileTypes;
				    		//this._items.setFileTypesList(this._fileTypesList);
				    		this._singlePathMasters = this.options.singlePathMasters;
				    		var fileTypesShown = true;
				    		if(this._fileTypesList.length == 0 || this._ctxPath.length > 1)
				    		{	
				    			if(!this.options.alwaysShowFiletypes)
				    			{
				    				this.sdInputDivType.hide();				    			
				    				fileTypesShown = false;
				    			}
				    			else
				    			{
				    				this.fileTypesList();
					    			this._currentFileType = this._fileTypesList[0][1];
				    			}
				    		}	
				    		else
				    		{	
				    			this._currentFileType = this._fileTypesList[0][1];
				    			
				    			if(this._fileTypesList.length < 2)
				    			{
				    				this.sdInputDivType.hide(); 
				    				fileTypesShown = false;
				    			}
				    			else
				    			{    				
				    				this.fileTypesList();
				    			}
				    		}
				    	
				    		if(this.options.customButtons.length > 0)
				    		{
				    			for (var i=0; i < this.options.customButtons.length; i++)
				    			{
				    				var customButton = $("<div>").ibxButton({"text": this.options.customButtons[i][0],"glyphClasses":""});
				    				var notification = "custom_" + this.options.customButtons[i][1];
				    				customButton.data("notification", notification);
				    				customButton.on('click', function (e)
				    				{ 
				    					var notification = $(e.currentTarget).data("notification");
				    			        this.close(notification);        	
				    			    }.bind(this));
				    			
				    				if(this.btnOK)
				    					customButton.insertBefore(this.btnOK);
				    			}
				    		}	
				    						    		
				    		for (var i = 0; i < this._ctxPath.length; i++)
				    		{
				    			var title = ibx.resourceMgr.getString("home_repository");
				    			if(Array.isArray(this.options.tabTitles))
				    				title = this.options.tabTitles[i];
				    			else
				    			{	
				    				if(this._ctxPath[i].indexOf("/EDA") > -1)
				    					title = ibx.resourceMgr.getString("home_server");
				    			}
					    		var page = $("<div class='sd-tab-page'>").ibxTabPage({ tabOptions: { 'text': title, 'selected': (i==0) ? "true":"false" } });	
								page.on("ibx_selected", function(currentContextPath, contextPathLength, i, e)
								{
									// tab changed... so clear item selection.
									this.selectItem(false);
									if (!$(e.currentTarget).data("explore"))
									{
										var fileTypesShown = true;
										if(this._fileTypesList.length == 0 || contextPathLength > 1)
										{	
											if(!this.options.alwaysShowFiletypes)
											{
												this.sdInputDivType.hide();				    			
												fileTypesShown = false;
											}
											else
											{
												this.fileTypesList();
												this._currentFileType = this._fileTypesList[0][1];
											}
										}	
										else
										{	
											this._currentFileType = this._fileTypesList[0][1];
											
											if(this._fileTypesList.length < 2)
											{
												this.sdInputDivType.hide(); 
												fileTypesShown = false;
											}
											else
											{    				
												this.fileTypesList();
											}
										}
			
										if(currentContextPath.indexOf("/EDA") > -1) // Check server access
										{
											var serverName = currentContextPath.substring(currentContextPath.lastIndexOf("/") + 1);
											
											var sa = new ServerAccess();
											sa.checkCredentials(serverName, this._createExploreWidget.bind(this, page, i, fileTypesShown), "", false);
											
											return;
										}
										
										this._createExploreWidget( $(e.currentTarget), $(e.currentTarget).closest(".ibx-tab-pane").ibxWidget("selectedIndex"), fileTypesShown);
									}
									
									$(e.target).data("explore").dispatchEvent("tab_activated", true);
									
								}.bind(this, this._ctxPath[i], this._ctxPath.length, i));
								
								if (i == 0)
									this._createExploreWidget(page, i, fileTypesShown);
								
								this._tabpane.ibxWidget('add', page);
								
								if (i==0)
									page.ibxWidget("option", "selected", true);
				    		}
				        }
				        else
			        	{
				        	var captionText = ibx.resourceMgr.getString("unrecoverable_error");
				        	var text = ibx.resourceMgr.getString("no_server_connection");
	    					var options = 
	    					{
	    						type:"medium error",
	    						caption:captionText,
	    						buttons:"ok",		
	    						messageOptions:{text:text}
	    					};
	    					var dlg = $.ibi.ibxDialog.createMessageDialog(options);		
	    					
	    					dlg.ibxDialog("open").on("ibx_close", function(e, btn)
	    					{
    						});
				       }
				       // hide the tab if only one context path... 
				       if(this._ctxPath.length == 1)				    	   
				    	   this._tabpane.find(".ibx-tab-group").css("display", "none");
				    	   
				}.bind(this));
    		}
    	}
	},
    
	_createExploreWidget: function (page, i, fileTypesShown)
	{
		// now create the tabs...
		var viewAs = "tiles";
		if(Array.isArray(this.options.viewAs))
		{
			if(this.options.viewAs.length > i)
				viewAs = this.options.viewAs[i];
		}
		else
			viewAs = this.options.viewAs;

		var appPath = "";
		if(this._ctxPath[i].indexOf("/EDA") > -1)
			appPath = this.options.appPath;
		
		var rootPath = "";
		if(this._rootPath.length > i)
			rootPath = this._rootPath[i];				    			
		
		var propFilter = this.options.propFilter;				    			
		if(Array.isArray(this.options.propFilter))
		{
			if(this.options.propFilter.length > i)
				propFilter = this.options.propFilter[i];
		}
		else
			propFilter = this.options.propFilter;
		
		var attrFilter = this.options.attrFilter;				    			
		if(Array.isArray(this.options.attrFilter))
		{
			if(this.options.attrFilter.length > i)
				attrFilter = this.options.attrFilter[i];
		}
		else
			attrFilter = this.options.attrFilter;

		var fileFilter = this.options.fileFilter;
		if (Array.isArray(this.options.fileFilter))
		{
			if (this.options.fileFilter.length > i)
				fileFilter = this.options.fileFilter[i];
			else
				fileFilter = "";
		}
		var flatten = this.options.flatten;
		if(Array.isArray(this.options.flatten))
		{
			if(this.options.flatten.length > i)
				flatten = this.options.flatten[i];
			else
				flatten = false;
				
		}	
			
		var filetypesList = [];
		
		if(Array.isArray(this._fileTypesList) && this._ctxPath.length > 1 && !this.options.alwaysShowFiletypes)
		{
			if(this._fileTypesList.length > i)
				filetypesList = this._fileTypesList[i];
		}
		else
			filetypesList = this._fileTypesList;

		var explore = ibx.resourceMgr.getResource('.explore_widget_resources', true);					
		explore.ibxWidget({viewAs: viewAs, fileTypes: filetypesList,
		multiSelect: this.options.multiSelect, appPath: appPath,
		selectFolder: this.options.selectFolder,
		foldersOnly: this.options.foldersOnly,
		singlePathMasters: this.options.singlePathMasters,
		'dlgType': this.options.dlgType,
		flatten: flatten,
		navigation: this.options.navigation,
		hideBreadcrumb: this.options.hideBreadCrumb,
		propFilter: propFilter,
		attrFilter: attrFilter,
		fileFilter: fileFilter,
		specialFolders: this.options.specialFolders,
		hideTags: this.options.hideTags,
		fileTypesShown: fileTypesShown,
		rootPath: rootPath,
		ctxPath: this._ctxPath[i]});
		
		explore.on("explore_widget_doubleclick", function(e)
		{									
			var item = e.originalEvent.data;
			this.selectItem(item);
			if(!this.btnOK.ibxWidget('option','disabled'))
				this.close("ok");
		
		}.bind(this));
		
		explore.on("explore_widget_select", function(e)
		{									
			var item = e.originalEvent.data;
			this.selectItem(item);							        
		}.bind(this));
		
		explore.on("explore_widget_click", function(e)
		{
			var item = e.originalEvent.data;
			this.selectItem(item);																
		}.bind(this));	
		
		explore.on("explore_widget_navigation", function(e)
		{
			if(this.options.dlgType == "save")
			this.setOKButton();
			else if (this.options.dlgType == "open")
			{
			// deselect item
			this.selectItem(null);
			}
													
		}.bind(this));
		
		page.append(explore);
		page.data("explore", explore);
		explore.data("page", page);
		
		explore.on("explore_tile_view", function(e)
		{	
			var pagex = $(this).data("page");
			pagex.removeClass("sd-tab-page-white");									        
		});
		
		explore.on("explore_list_view", function(e)
		{	
			var pagex = $(this).data("page");
			pagex.addClass("sd-tab-page-white");									        
		});
	},

    selectItem:function(item)
    {
    	var title;
    	var name;
    	if(!item || !item.name)
    	{
    		title = "";
    		name = "";
    	}	
    	else
    	{	
	    	title = item.description;
	    	name = item.name;
	    	if (this.options.dlgType == "save") // strip extension ?
	    	{
	    		if(name.indexOf(".") > -1)
	    			name = name.substring(0, name.indexOf("."));    		
	    	}	    	
	    	if(!title || title.length == 0)
	    	{	
	    		title = name;
	    		if(title.indexOf(".") > -1)
	    			title = title.substring(0, title.indexOf("."));    		
	    	}
    	}
    	this.sdtxtFileTitle.ibxWidget("option", "text", title);
    	this.sdtxtFileName.ibxWidget("option", "text", name);    	
        this._fileName = name;        
        this._fileTitle = title;
        if(this.options.dlgType == "save")
        	this.setOKButton();
        else
        	this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);
    },    
    fileSingleClick: function(item)
    {
    	this.selectItem(item);
    },
    setOKButton: function()
    {
    	var tabpane = this._tabpane.ibxWidget("selected");
    	if(tabpane)
    	{	
    		this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);	
    		if(this._fileName.length > 0)    		
    		{	
	    		var path = tabpane.find(".explore_widget_resources").ibxWidget("path");        		
				if(path.charAt(path.length - 1) == "/")
				path = path.substring(0, path.length-1);
				var x = path.split("/");
				if(x[x.length-1] == "Repository")
						this.btnOK.ibxWidget('option','disabled', true);				 
				else if(this.options.dlgType == "save")
				{
					var item = tabpane.find(".explore_widget_resources").ibxWidget("pathItem"); 
					if(item && item.actions)
					{	
						if(item.actions.indexOf("createFolder") == -1 && item.actions.indexOf("createItem") == -1)
							this.btnOK.ibxWidget('option','disabled', true);						
					}
					else
					{
						var actions = this.getActions(path);
						if(actions && actions.indexOf("createFolder") == -1 && actions.indexOf("createItem") == -1)
							this.btnOK.ibxWidget('option','disabled', true);
					}
				}
				
    		}
    	}
    },
    getActions: function(path)
    {
    	var privleges = null;
    	var uriExec = sformat("{1}/iteminfo.bip", applicationContext);					
		var randomnum = Math.floor(Math.random() * 100000);	
		var argument=
		{
				"BIP_REQUEST_TYPE": "BIP_GET_ITEM_INFO",
				"path": path,
				"type": "folder", 
				"area": "",
		};
		argument[IBI_random] = randomnum;
		argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal(); 
		
		ajaxOptions = 
		{
		    type: "POST",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			url: uriExec,
			async: false, 
			data: argument,		
			context: this,
		};
		
		$.when($.ajax(ajaxOptions)).always(function(data)
		{
			var node = $("node", data); 
			privileges = node.attr("privileges");									
		}.bind(this));
    	return privileges;
    },
    fileDoubleClick: function(item)
    {
    	this.selectItem(item);
    	this.close("ok");
    }, 
    destroy:function()
    {
    	 this_ibfs=null;
    	 this._fileName="";
    	 this._fileTitle= "";
    	 this._items=null;
    	 this._bSearch=false;    	 
    	 this._loaded=null;
    	 this._tilesPainted=false;
    	 this._listPainted=false;
    	 this._tilesViewed=false;
    	 this._listViewed=false;    	 
    	 this._titleSet = false;
    },  
   
    fileTypesList: function()
    {
    	if(this._fileTypesList)
    	{	
    		// create the menu....	
    		var types = this._fileTypesList;  
    		var i = 0;
    		for (i=0; i < types.length; i++)
    		{ 
    			var selected = (i == 0)? true: false;
    			var textvalue;
    			if(types[i][1] == "all")textvalue = types[i][0];
				else textvalue = types[i][0] + " (" + types[i][1] + ")";
    			var xitem = $("<div class='amper-select-null'>").ibxSelectItem({text: textvalue, userValue: types[i][1], selected: selected});    			
    			this.sdlistFileType.ibxWidget('addControlItem', xitem);    						
    		} 
    		this.sdlistFileType.on("ibx_change", function(e)
    		{  
				var item = $(e.currentTarget).ibxWidget('selected').filter('.sel-anchor');
				if (item && item.length == 1)
					this._currentFileType = item.ibxWidget('userValue'); 
				var name = this._tabpane.ibxWidget("selected").find(".explore_widget_resources").ibxWidget("setCurrentFileType", this._currentFileType);    			
    		}.bind(this));
    	}    	
    	 
    }
    
	
});
//# sourceURL=explore_open_dialog2.js