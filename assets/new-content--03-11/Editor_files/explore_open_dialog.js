/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.94 $:
//////////////////////////////////////////////////////////////////////////
$.widget("ibi.opensavedialog", $.ibi.ibxDialog, 
{
    options:
    {
        
        rootPath:"IBFS:/WFC/Repository",
        ctxPath:"",
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
		propFilter: ""
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
	_columns : [
	       			["", "icon", "", true, ""],
	       			["","default","default",false,""],
	       			["","alpha", "description", true, ""],
	       			["", "alpha", "name", false, ""],	       		
	       			["","alpha", "summary",true, ""],
	       			["","alpha","clientInfo.properties.Category", false, ""],
	       			["","date", "lastModified",true, ""],	       			
	       			["","date","createdOn", false, ""],
	       			["","number", "length", true, ""],
	       			["", "alpha", "createdBy", false, ""],	       			
	       			["", "menu", "", true, ""]	       		
	       		],
    _create:function()    
    {
        this._super();
        //this.option("caption", this.options.title);
        //this.btnOK.ibxWidget("option", "text", this.options.title);
        this.element.resizable(this.options.resizable);
        this.sdViewList.on('click', this._onViewAsList.bind(this));
        this.sdViewTiles.on('click', this._onViewAsTiles.bind(this));
        this.sdBtnRefresh.on('click', function(e)
        {
        	if(this._upDated)
        	{	
        		this.refreshit(this.options.ctxPath, false);
        		this._upDated = false;
        	}	
        }.bind(this));
        this.sdtxtFileTitle.on('ibx_textchanged', function (e){
        	
        	this._fileTitle = this.sdtxtFileTitle.ibxWidget("option", "text");  
        	var tvalue = this.replaceDisallowedChars(this._fileTitle);        	
            this._fileName = tvalue.toLowerCase();        	
        	this.sdtxtFileName.ibxWidget("option", "text", this._fileName);
        	if(this.options.dlgType == "save")
        	{	
        		// can't save at root...
        		var path = this.options.ctxPath;
        		if(path.charAt(path.length - 1) == "/")
    			path = path.substring(0, path.length-1);
    			var x = path.split("/");
    			if(x[x.length-1] == "Repository")
   					this.btnOK.ibxWidget('option','disabled', true);
    			else
    				this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);
        	}
        	else
        		this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);        	
        }.bind(this));
        this.sdtxtFileName.on('ibx_textchanged', function (e){        	
        	this._fileName = this.sdtxtFileName.ibxWidget("option", "text");
        	this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);        	
        }.bind(this));
        
        
        
        this.listBox.hide();
        this.btnOK.ibxWidget('option', 'disabled', true);  
        
        this._items=new Items();        
        this._items.setMultiSelectAllowed(this.options.multiSelect);
    	this._ses_auth_parm = WFGlobals.getSesAuthParm(); 
		this._ses_auth_val =WFGlobals.getSesAuthVal();
		
		this._applicationContext=applicationContext;
		fileTypesList = this.options.fileTypes;
		//fileTypesList=this.options.fileTypes.split(";");
		this._items.setFileTypesList(fileTypesList);
		this._textSearch = new TextSearch(".sd-txt-search",".sd-btn-clear-search", this.clearsearch, this.searchfolder, this);
		this._columns[1][0]=ibx.resourceMgr.getString("columns.default");		
		this._columns[2][0]=ibx.resourceMgr.getString("columns.title");
		this._columns[3][0]=ibx.resourceMgr.getString("columns.filename");	       		
		this._columns[4][0]=ibx.resourceMgr.getString("columns.summary");
		this._columns[5][0]=ibx.resourceMgr.getString("columns.tags");
		this._columns[6][0]=ibx.resourceMgr.getString("columns.lastmodified");	       			
		this._columns[7][0]=ibx.resourceMgr.getString("columns.created");
		this._columns[8][0]=ibx.resourceMgr.getString("columns.filesize");
		this._columns[9][0]=ibx.resourceMgr.getString("columns.owner");	  
	
		setTimeout(function()
   	    {
			this.formatSearchPlaceHolder();
			
        	var twidth = this._breadCrumbTrail.width();
        	this._bshowBreadcrumb = true;
        	if(twidth > 0 && this.options.ctxPath.length > 0 && this.options.navigation)
        		this._breadCrumbTrail.ibxWidget(
        				{ 	
        			    	currentPath: this.options.ctxPath,    
        			        isPhone: false,
        			        items: this._items,
        			        refreshFolder: this.refreshclear,
        			        thisContext: this
        			    }
        				);
  	    }.bind(this), 1000);
		$(this.element).resize(function()
		{
			var twidth = this._breadCrumbTrail.width();
        	if(twidth > 0 && this.options.ctxPath.length > 0 && this.options.navigation)
        		this._breadCrumbTrail.ibxWidget(
        				{ 	
        			    	currentPath: this.options.ctxPath,    
        			        isPhone: false,
        			        items: this._items,
        			        refreshFolder: this.refreshclear,
        			        thisContext: this
        			    }
        				);
        	if(this._listViewed)this._paintList();
		}.bind(this));
		this.sdtxtFileName.on('ibx_textchanging', function (e)				
		{			
			if(!this.validateChar(e.key, e.keyCode))e.preventDefault();
		}.bind(this));
    },
    _init:function()
    {
    	this._super();
		if (this.options.viewAs == "list")
		{
			this.sdViewTiles.show();
			this.sdViewList.hide();        
		}
		else
		{
			this.sdViewTiles.hide();
			this.sdViewList.show();        
		}
    },
    close:function(closeInfo)
	{	  
    	if(typeof closeInfo == "string" && !this._noCheck && this.options.dlgType == "save" && closeInfo != "cancel")
    	{    		
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
    _onViewAsList:function(e)
    {
        this.sdViewList.hide();
        this.sdViewTiles.show();  
        this.listBox.show();
        this.tilesBox.hide();
        this.options.viewAs = "list";
        if(!this._listPainted)this._paintList();
    },
    _onViewAsTiles:function(e)
    {
        this.sdViewList.show();
        this.sdViewTiles.hide(); 
        this.tilesBox.show();
        this.listBox.hide();
        this.options.viewAs = "tiles";
        if(!this._tilesPainted)this._paintTiles();
        
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
        if (typeof (value) == "undefined") 
        {	
        	if(!this._fileTitle || this._fileTitle.length == 0)
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
        		fileName = (this.options.selectFolder && fileName.indexOf("~") == 0) ? "~" + this.replaceDisallowedChars(fileName.substring(1,fileName.length)) : this.replaceDisallowedChars(fileName);
        		if (extension.length > 0) 
        			fileName += extension;
        		fullPath = this.options.ctxPath + "/" + fileName;
        		if (this.options.selectFolder)
        		{// is this a folder?
        			var item = this._items.findItemByPath(fullPath);
        			if(item.container && item.type != "PGXBundle")
        				return fullPath;
        		}	
        		if(this._currentFileType.length > 0 && this._currentFileType != "pgx" && this._currentFileType != "*" && fullPath.indexOf(".") == -1)
        			fullPath += "." + this._currentFileType;
        	}	
        	return fullPath;           
        }
        else
        {
        	var tvalue = this.replaceDisallowedChars(value);        	
            this._fileName = tvalue.toLowerCase();
            this.sdtxtFileName.ibxWidget("option", "text", this._fileName);
            this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);
            return this;
        }
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
    	var items = []; 
    	var fullPath = this.fileName();
    	if(fullPath.length > 0)
    	{	
    		if(this._currentFileType.length > 0 && this._currentFileType != "pgx" && this._currentFileType != "*" && fullPath.indexOf(".") == -1)fullPath += "." + this._currentFileType;    	 		
    		var item = this._items.findItemByPath(fullPath);
    		if(item)items.push(item);    		
    	}	
    	else
    		items = this._items.getAllSelectedItems();      		
    	return items;
    },
    path: function (value)
    {
        if (typeof (value) == "undefined")        
            return this.options.ctxPath;
        else
        {
            this.optins.ctxPath = value;
            this.refresh();
            return this;
        }
    },    
    checkForError: function(exInfo)
    {
    	
    		//check for error
    		var xmldata = exInfo.xhr.responseXML;
    		
    		$(xmldata).children().each(function()
    		{
    			var tagName=this.tagName;
    			if(tagName=="ibfsrpc")
    			{
    				var retcode=$(this).attr('returncode');	
    				if (retcode!="10000")
    				{
    					var text = $(this).attr('localizeddesc');
    					
    					captionText = ibx.resourceMgr.getString("unrecoverable_error");
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
    			}						
    		});
    					
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
    	if(this.options.ctxPath.length > 0)
    	{    		
	    	
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
					        dis = dis.replace(/\\/,"\\\\").replace(/\(/,"\\(").replace(/\)/,"\\)").replace(/\//,"\\/").replace(/\</,"\\<").replace(/\>/,"\\>")
					        	.replace(/\[/,"\\[").replace(/\]/,"\\]");
					        this._disallowedChars = new RegExp("[" + dis + "]", "g");
					        
					        appPath = this.options.appPath;
					        if(appPath)
					        {	
					        	this._appPath = appPath;
					        	this._items.setAppPath(this._appPath);					        	
					        }	
					        this._fileTypesList = this.options.fileTypes;
				    		this._items.setFileTypesList(this._fileTypesList);
				    		this._singlePathMasters = this.options.singlePathMasters;
				    		if(this._fileTypesList.length == 0)this.sdInputDivType.hide();   
				    		if(this._fileTypesList.length > 0)
				    		{	
				    			this._currentFileType = this._fileTypesList[0][1];
				    			//this.sdFileTypeButton.ibxWidget("option", "text", this._currentFileType);
				    			if(this._fileTypesList.length < 2)
				    				{
				    					this.sdInputDivType.hide();    					  					
				    				}
				    			else
				    				{    				
				    					this.fileTypesList();
				    				}
				    		}
				    		if(this.options.ctxPath.indexOf("/EDA") > -1)
				    		{
				    			// on EDA path show name by default
				    			this._columns[2][3] = false;
				    			this._columns[3][3] = true;
				    			this._titleMode = false;
				    		}
				    		else
				    		{
				    			// on other paths show title by default
				    			this._columns[2][3] = true;
				    			this._columns[3][3] = false;
				    			this._titleMode = true;
				    		}	
					        this.refreshit();
					        this.retrieveFolderPath();
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
				}.bind(this));
    		}
    		
	    	
    	}
    	
    },
    
    updateViews:function()
    {
    	this._listPainted = false;
    	this._tilesPainted = false;
    	
    		if(this.options.viewAs == "tiles")
				this._onViewAsTiles();
    		else
				this._onViewAsList();
    	this._upDated = true;	
    },
    _paintTiles:function()
    {
    	
    	var timeOut = 0;
		var leng = this._items.getFolderList().length;
		leng += this._items.getItemList().length;
		if(leng > 100)timeOut = 20;	
    	if(timeOut > 0)ibx.waitStart($(".open-dialog-resources"));
    	
    	var fileTypeFilter = (this._currentFileType == "all" || this._currentFileType == "*.*") ? "*" : this._currentFileType;
    	window.setTimeout(function()	  	        
    	{
	    	if(this._tilesViewed)$(this.tilesBox).view_tiles("destroy");
			this._tilesViewed = true;
			$(this.tilesBox).view_tiles
			(
				{
					folderlist: this._items.getFolderList(),
					itemlist: this._items.getItemList(),
					columns: this._columns,
					sortorder: this._items.getSortedOrder(),
					sortedvalue: this._items.getSortedValue(),
					sortedvaluetype: this._items.getSortedValueType(),
					sortCallBack: this.sortItems,
					selectedCallBack: this._items.toggleSelected.bind(this._items),
					setCallBack: this._items.setCallBack.bind(this._items),
					bSearch: this._bSearch,
					openFolderCallBack: this.openFolder,
					runCallBack: this.fileDoubleClick,
					isMobile: false,
					isPhone: false,
					foldermenu: this.foldermenu,
					filemenu: this.filemenu,
					thisContext: this,
					fileSingleClick: this.fileSingleClick,
					sortFieldMenu: this.sortFieldMenu,
					columnmenu: this.columnmenu,
					filetypeFilter: fileTypeFilter,
					selectFolder: this.options.selectFolder,
					titleMode: this._titleMode,
					categoryList: (this._bSearch || this.options.flatten)?this._items.getCategoryList(true) : null,
					categoryToggle: this._items.categorySelToggle.bind(this._items),
					scope: ".open-dialog-resources"
				}
	    	
			);
			if(timeOut > 0)ibx.waitStop($(".open-dialog-resources"));
    	}.bind(this),timeOut);
		
		this._tilesPainted = true;
    },
    _paintList:function()
    {
    	
    	var timeOut = 0;
		var leng = this._items.getFolderList().length;
		leng += this._items.getItemList().length;
		if(leng > 100)timeOut = 20;    	   
    	if(timeOut > 0)ibx.waitStart($(".open-dialog-resources"));	
    	var fileTypeFilter = (this._currentFileType == "all") ? "*" : this._currentFileType;
    	window.setTimeout(function()	  	        
    	{
	    	if(this._listViewed)$(this.listBox).view_list("destroy");
			this._listViewed = true;
			$(this.listBox).view_list
			(
				{
					folderlist: this._items.getFolderList(),
					itemlist: this._items.getItemList(),
					columns: this._columns,
					sortorder: this._items.getSortedOrder(),
					sortedvalue: this._items.getSortedValue(),
					sortedvaluetype: this._items.getSortedValueType(),
					sortCallBack: this.sortItems,
					selectedCallBack: this._items.toggleSelected.bind(this._items),
					setCallBack: this._items.setCallBack.bind(this._items),
					bSearch: this._bSearch,
					openFolderCallBack: this.openFolder,
					runCallBack: this.fileDoubleClick,
					isMobile: false,
					isPhone: false,
					foldermenu: this.foldermenu,
					filemenu: this.filemenu,
					thisContext: this,
					fileSingleClick: this.fileSingleClick,
					sortFieldMenu: this.sortFieldMenu,
					columnmenu: this.columnmenu,
					filetypeFilter: fileTypeFilter,
					selectFolder: this.options.selectFolder
				}
			);
			if(timeOut > 0)ibx.waitStop($(".open-dialog-resources"));
    	}.bind(this),timeOut);
    	this._listPainted = true;
    },
    sortItems:function(key, type, toggle)
    {
    		this._items.sortItems(key, type, toggle);
    		this.updateViews();    		
    },
    openFolder:function(item)
    {
    	this.refreshit(item.fullPath);    	
    },
    selectItem:function(item)
    {
    	var title = item.description;
    	if(!title || title.length == 0)
    	{	
    		var title = item.name;
    		if(title.indexOf(".") > -1)
    			title = title.substring(0, title.indexOf("."));    		
    	}
    	this.sdtxtFileTitle.ibxWidget("option", "text", title);
    	this.sdtxtFileName.ibxWidget("option", "text", item.name);    	
        this._fileName = item.name;        
        this._fileTitle = title;        
        this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);    	
    },    
    fileSingleClick: function(item)
    {
    	this.selectItem(item);
    },
    fileDoubleClick: function(item)
    {
    	this.selectItem(item);
    	this.close("ok");
    },    
    foldermenu:function()
    {
    	
    },
    filemenu:function()
    {
    	
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
    	 //this.options.dlgType="";
    	 //this.options.title="";
    	 //this.options.ctxPath="";
    	 this._titleSet = false;
    },  
    columnmenu: function(contextitem)
    {
    	var options = 
    	{
    		my: "right bottom",
    		at: "right top",
    		collision: "flip",
    		of:contextitem
    	};
    	// create the menu....
    	var columns = this._columns;    	
    	var cmenu = $("<div>").ibxMenu({multiSelect : true});
    	for (i=0; i < columns.length; i++)
    	{
    		var type=columns[i][1];
    		if(type != "icon" && type != "menu" && columns[i][2] != "default" && columns[i][2].indexOf("Category") == -1)
    		{
    				var cmenuitem = $("<div>").ibxCheckMenuItem();
    				cmenuitem.ibxCheckMenuItem("option", "labelOptions.text", columns[i][0]);
    				cmenuitem.ibxCheckMenuItem("option", "checked", columns[i][3]);
    				cmenuitem.data("row",i);
    				cmenuitem.on("ibx_menu_item_click",function(e)
    				{
    					var row = $(e.target).data("row");
    					this._columns[row][3]=!this._columns[row][3];	
    					this.refreshit();	
    				}.bind(this));									
    				cmenu.append(cmenuitem);
    		}			
    	}
    	$(cmenu).ibxMenu("open").position(options);
    	
    },
    sortFieldMenu:function(contextitem)
    {	
    	var options = 
    	{
    		my: "right bottom",
    		at: "right top",
    		collision: "flip",
    		of:contextitem
    	};
    	if(!this._psortFieldsMenu)
    	{	
    		// create the menu....	
    		var focusItem = null;
    		var columns = this._columns;
    		var cmenu = $("<div class='ibx-menu-no-icons'>").ibxMenu();
    		for (i=0; i < columns.length; i++)
    		{
    			var type=columns[i][1];
    			if(type != "icon" && type != "menu" )
    			{
    				// only show currently visible grid items on sort menu
    				if(columns[i][2] == "default" || columns[i][3])
    				{	
    					var cmenuitem = $("<div>").ibxMenuItem();    					
    					cmenuitem.ibxMenuItem("option", "labelOptions.text", columns[i][0]);	
    					if(columns[i][2] == this._items.getSortedValue())focusItem = cmenuitem;    						
    					cmenuitem.data("row",i);
    					cmenuitem.on("ibx_menu_item_click",function(e)
    					{
    						var row = $(e.target).data("row");
    						this._items.setSortedValue(columns[row][2]);
    						this._items.setSortedValueType(columns[row][1]);
    						this._items.sortItems(columns[row][2], columns[row][1], false);
    						this.updateViews();
    					}.bind(this));									
    					cmenu.append(cmenuitem);
    				}	
    			}			
    		}
    		//this._psortFieldsMenu = cmenu;
    		cmenu.on("ibx_open", function(e)
    		{
				if(focusItem)focusItem.focus();    	    			
    		}.bind(this));
    		cmenu.ibxMenu("open").position(options);
    		
    	}
    	//$(this._psortFieldsMenu).ibxMenu("open").position(options);    	
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
    			this.updateViews();
    		}.bind(this));
    	}    	
    	 
    },
    searchfolder:function(filter)
	{						
		var searchString = getSearchStringSimple(this.options.ctxPath, "description" , filter, true);
		this._bSearch = true;
		var path = "";
		if(Array.isArray(searchString))
			path = searchString[0];
		else
			path = searchString;
		this.refreshit(path);
	},

	clearsearch:function()
	{
		this._bSearch = false;
		this.refreshit(this.options.ctxPath);
	},
	refreshclear: function(path)
	{
		if(this._bSearch)
		{
			this._textSearch._clearSearch();
			this._bSearch = false;
		}	
		this.refreshit(path);
	},	
	retrieveFolderPath:function()
	{		
		var currentPath = this.options.ctxPath;
		if(currentPath.charAt(currentPath.length-1)=="/")
			currentPath = currentPath.substring(0, currentPath.length-1);
		// expand all tree nodes up to this path...
		var folders = currentPath.split("/");
		var buildPath = "";
		var slash = "";
		var start = false;
		var force = false;	
		var i = 0;
		var eda = 0;
		for (i = 0; i < folders.length - 1; i++)
		{			
			if(!start)
			{	
				if(folders[i] == "Repository" && i != (folders.length - 1))start = true;			
				else if(folders[i] == "EDA")eda = i;
				if(eda > 0 && i > eda)start = true;
			}	
			buildPath += slash + folders[i];
			slash = "/";
			if(start)
			{
				var usePath = buildPath;
				if(eda == 0)usePath = buildPath + "/*.";
				this.refreshit(usePath, true);
			}
		}		
		
	},
	formatSearchPlaceHolder:function()
	{
		if(this.options.ctxPath.charAt(this.options.ctxPath.length-1)=="/")
			this.options.ctxPath = this.options.ctxPath.substring(0, this.options.ctxPath.length-1);		
		
		var item = this._items.findallFoldersByPath(this.options.ctxPath);
		var text = "";
		var searchString = ibx.resourceMgr.getString("markup.search");
		if(item && this._titleMode)
		{	
			if(item.description)
				text = sformat(searchString, item.description);
			else 
				text = sformat(searchString, item.name);
		}	
		else
		{		
			var folders = this.options.ctxPath.split("/");
			var currentFolder = folders[folders.length-1];
			if(currentFolder == "Repository")
				currentFolder = ibx.resourceMgr.getString("home_repository_description");
			else 
				if(this._titleMode)
					currentFolder = " ";
			text = sformat(searchString,currentFolder);			
		}		
		this._textSearch.setSearchPlacholder(text);	
		
	},
    refreshit:function(path, silent)
    {
    	//this._super();
     if(this._ibfs)
     {	 
    	var fpath = ""; 
        var bSearch = this._bSearch;
		var depth = null;
		var flatten = null;
		
		if(bSearch || this.options.flatten)
		{
			depth = -1;
			flatten = true;
		}	
		else 
		{	
			if(path && !silent)
				this.options.ctxPath = path;			
		}
		if(!path)
			path = this.options.ctxPath;
		this._items.clearItems();
		
		if(this._bshowBreadcrumb && this.options.navigation)
			this._breadCrumbTrail.ibxWidget(
			{ 	
		    	currentPath: this.options.ctxPath,    
		        isPhone: false,
		        items: this._items,
		        refreshFolder: this.refreshclear,
		        thisContext: this
		    }
			);
		// set the search place holder string
		this.formatSearchPlaceHolder();
		var bClientSort = false;
		if(!this._titleMode)
		{	
			bClientSort = true;				
		}
		var loptions = { asJSON: true, clientSort: bClientSort, clientSortAttr: "name" , eError: "fatal_error"};
		if(this._singlePathMasters)
		{
			// on a folder?
			if(path.charAt(path.length - 1) == "/")
				path = path.substring(0, path.length-1);
			var x = path.split("/");
			if(x.length > 3 || bSearch)
				path += "/*.mas;*.";
			loptions = { asJSON: true, clientSort: bClientSort, clientSortAttr: "name", eError: "fatal_error",parms:{"IBFS_options":"useOnePartNames"}};
		}
		if(!silent && this.options.propFilter && this.options.propFilter.length > 0)
		{
			
			// FILTER("properties","(prop1=contains('val1')")
			if(bSearch)
			{
				path += ';FILTER'; 			
			}
			else
			{
				fpath = path;
				// need separate call to retrieve folders...
				fpath += '/##FILTER("attribute","type","MRFolder,MyReportFolder")';	
				path += "/##FILTER";
			}	
			path += '("properties","' + this.options.propFilter + '")';
		}	
		if(!silent && this.options.dlgType == "save")
		{
			// can't save at root...
			if(path.charAt(path.length - 1) == "/")
				path = path.substring(0, path.length-1);
			var x = path.split("/");
			if(x[x.length-1] == "Repository")
				this.btnOK.ibxWidget('option','disabled', true);  
			else
				this.btnOK.ibxWidget('option','disabled', this._fileName.length == 0);  
		}	
		this._ibfs.listItems(path, depth, flatten, loptions).done(function (exInfo)		
		{
			
			if(exInfo.result.length == 0)
			{
				this.checkForError(exInfo);				
			}
			$.each(exInfo.result, function (idx, item)
			{					
				if(item.container && item.type != "PGXBundle")
				{
					if(!silent && !bSearch && !this.options.flatten)
						this._items.addFolderItem(item);
					if(silent)
						this._items.allFoldersAdd(item);
					
				}	
				else
				{
					if(!silent && !this.options.foldersOnly)
						this._items.addItem(item);
				
				}	
			}.bind(this));				
			
			
			if(!silent)
				this.updateViews();
		}.bind(this));
		if(fpath.length > 0 && !this.options.flatten)
		{
			// have a propFilter so have a separate call to retieve folders...
			this._ibfs.listItems(fpath, depth, flatten, loptions).done(function (exInfo)		
			{
				
				if(exInfo.result.length == 0)
				{
					this.checkForError(exInfo);				
				}
				$.each(exInfo.result, function (idx, item)
				{					
					if(item.container && item.type != "PGXBundle")
					{
						this._items.addFolderItem(item);												
					}					
				}.bind(this));				
				
				
				if(!silent)
					this.updateViews();
			}.bind(this));
		}	
     }	
    }
   
});
//# sourceURL=explore_open_dialog.js