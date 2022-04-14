/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.56 $:

$.widget( "ibi.view_list", $.ibi.ibxVBox,
{
	options:
	{
		sortColumn: null,
		folderlist: null,
		itemlist: null,
		columns: null,
		sortorder: null,
		sortedvalue: null,
		sortedvaluetype: null,
		sortCallBack: null,
		selectedCallBack: null,
		setCallBack: null,
		bSearch: false,
		openFolderCallBack: null,
		runCallBack: null,
		isMobile: false,
		isPhone: false,
		foldermenu: null,
		filemenu: null,
		thisContext: null,
		fileSingleClick: null,
		sortFieldMenu: null,
		columnmenu: null,
		filetypeFilter: "",
		selectFolder: false,
		triModeSort: true,
		titleMode: true,
		showExtraColumns: null,
		maxShownItems: 5000,
		hideLength: false,
		nothingToShowString: "",
		categoryList: null,
		categoryToggle: null,
		updateTilesCallback: null,
		isDraggable: false
		
	},

	_haveTags: false,
	_categoryDiv: null,
	
	_destroy: function()
	{
		//this.element.empty();
		this.element.children().each(function(index,el){$(el).detach();});
	},
	refreshTags: function(categoryList)
	{		
		if(this._haveTags)
		{	
			this._categoryDiv.empty();
			this._createTags(categoryList);
		}	
	},
	_createTags: function(categoryList)
	{
		var domainsCount = 0;
		for(var i = 0; i < categoryList.length; i++)
		{
			if(categoryList[i][3])domainsCount++;
		}	
		for(var i = 0; i < categoryList.length; i++)
		{
			// don't show the 'other'
			if(categoryList[i][2])
				continue;
			// if domain and we have less that 2 don't show it.
			if(categoryList[i][3] && domainsCount < 2)
				continue;
			//var categoryButton = $("<div>").ibxButton({"text":categoryList[i][0],"glyphClasses":"fa fa-check","iconPosition":"right"}).addClass("sd-category-button");
			var categoryButton = $("<div>").ibxButton({"text":categoryList[i][0],"glyphClasses":"","iconPosition":"right"}).addClass("sd-category-button sd-category-button-toggle-off");
			if(categoryList[i][1])
			{	
				categoryButton.ibxButton("option", "glyphClasses", "fa fa-check");
				categoryButton.removeClass("sd-category-button-toggle-off");
			}	
			// ask webfocus domain category?
			if(categoryList[i][3])categoryButton.addClass("sd-category-button-green");
			// shared and personal...
			if(categoryList[i][4] > 0)categoryButton.addClass("sd-category-button-purple");
			// if shared or personal send a negative index...
			var index = i;
			if(categoryList[i][4] > 0)index = -categoryList[i][4];
			$(categoryButton).on("click", this.options.categoryToggle.bind(this.options.thisContext, categoryButton, index, 0));
			$(categoryButton).on("click", this.options.categoryToggle.bind(this.options.thisContext, categoryButton, index, 1));
			this._categoryDiv.append(categoryButton);
		}	
	},
	_create: function()
	{	
		var folderlist = this.options.folderlist;
		var itemlist = this.options.itemlist;
		var filetypeFilter = this.options.filetypeFilter;
		if(filetypeFilter && (filetypeFilter == "*"))filetypeFilter="";
		
		var columns = this.options.columns;
		
		// need to splice out scm column is appropriate
		if (typeof home_globals != "undefined" && $('.pvd-run-tool').length === 0 
				&& home_globals.currentItem && !home_globals.currentItem.pwa 
				&& columns[3][2] === 'scmStatus')
			columns.splice(3, 1);
		
		// if isPhone... find first display column....
		var firstCol = 0;
		var i;
		for(i=0; i < columns.length; i++)
		{
			var type = columns[i][1];
			var display = columns[i][3];
			if(display == true && (type == "alpha" || type == "number" || type == "date"))
			{
				firstCol = i;
				break;
			}	
		}	
		var showColumns = [];
		for(i=0; i < columns.length; i++)
		{	
			columns[i][4]="";
			if(columns[i][2].toLowerCase() == this.options.sortedvalue.toLowerCase())
				columns[i][4] = this.options.sortorder;
			
			showColumns[i]=columns[i][3];
			
			if(this.options.hideLength && columns[i][2] == "length")
				showColumns[i] = false;
			
			// menu is only
			if(!this.options.isMobile && columns[i][1] == "menu")
				showColumns[i] = false;
			
			// mobile never shows the publish/show columns
			if(this.options.isMobile && columns[i][1] == "boolean")
				showColumns[i] = false;
			
			// hide the publish/show columns if the parent folder doesn't support them.
			if((!this.options.showExtraColumns || !this.options.showExtraColumns) && columns[i][1] == "boolean" )
				showColumns[i] = false;
			
			if(this.options.isPhone && i != firstCol && columns[i][1] != "menu" && columns[i][1] != "icon")
				showColumns[i] = false;
			
		}
		
		var noResults = false;		
		if(this.options.bSearch && this.options.folderlist.length == 0 && this.options.itemlist.length == 0)
		{
			//var errorText = $("<div>").ibxLabel({"text":ibx.resourceMgr.getString("home_no_results")}).addClass("files-no-search-results");
			//this.element.append(errorText);		
			noResults = true;
		}	
		this.element.empty();
		// are there more than one category?
		if(!noResults /*&& this.options.bSearch*/ && this.options.categoryList && this.options.categoryList.length > 1)
		{
			var categoryList = this.options.categoryList;			
			this._haveTags = true;
			var categoryDiv1='<div class="files-box-files-categories"  data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-justify="start" data-ibxp-wrap="true" >';
			var categoryDiv = $(categoryDiv1);
			this._categoryDiv = categoryDiv;
			this._createTags(categoryList);			
			this.element.append(this._categoryDiv);
		}	
		
		
		
		// initialize the grid and add titles.
		
		var lang = ibx.resourceMgr.language;
		
		var grid=new filegrid();
		grid.init(this.element, columns, this.options.sortCallBack, this.options.selectedCallBack, this.options.setCallBack, 
				showColumns, this.options.openFolderCallBack, this.options.runCallBack, 
				this.options.isMobile, this.options.thisContext, this.options.fileSingleClick, this.options.columnmenu, this.options.filemenu, 
				this.options.foldermenu, this.options.triModeSort,this.options.sortColumn );
			
		// add the folders
		var ilen;
		ilen=folderlist.length;
		var glyph="fa fa-folder";
		var i=0;
		var row=0;		
		if(ilen > 0)
		{
			var i;
			for (i=0; i < ilen; i++)
			{								
				var ibfsitem=folderlist[i];		
				var glyph = (ibfsitem.type != "PRTLXBundle") ? "fa fa-folder" : "ibx-icons ds-icon-portal";
				this._addgriditem(grid, ibfsitem, glyph, true, row, lang, this.options.isDraggable);
				row++;
			}							
		}
		
		// add the files
		ilen=itemlist.length;		
		if(ilen > 0)
		{
			// add first 400 then the rest.
			iLoad = 400;
			if(ilen > this.options.maxShownItems)ilen = this.options.maxShownItems;
			var leftLen = (ilen <= iLoad) ? 0 : ilen - iLoad;
			totLen = ilen;
			if(leftLen > 0)ilen = iLoad;
			for (i=0; i<ilen; i++)
			{ 							
				var ibfsitem=itemlist[i];
				row = this._createGridItem(ibfsitem, row, filetypeFilter, grid, lang, this.options.isDraggable);				
			}
			if(leftLen > 0)
			{
				ibx.waitStart(this.element);
				setTimeout(function()
				{	
					var s = iLoad;
					var sn = totLen;											
					for (i = s ; i < sn ; i++)
					{								
						var ibfsitem=itemlist[i];
						if(!ibfsitem)
							continue;
						row = this._createGridItem(ibfsitem, row, filetypeFilter, grid, lang, this.options.isDraggable);						
					}					
					ibx.waitStop(this.element);
				}.bind(this), 1000);
			}	
			
		}
		
		if(this.options.bSearch && this.options.folderlist.length == 0 && this.options.itemlist.length == 0)
		{
			var errorText = $("<div>").ibxLabel({"text":ibx.resourceMgr.getString("home_no_results")}).addClass("files-no-search-results");
			this.element.append(errorText);			
		}
		else if(this.options.nothingToShowString.length > 0)
		{
			var errorText = $("<div>").ibxLabel({"text":this.options.nothingToShowString}).addClass("files-no-search-results");
			this.element.append(errorText);			
		}	
		
		grid.addtoMain();
		if(this.options.categoryList && this.options.categoryList.length > 1 && this.options.updateTilesCallback)
			this.options.updateTilesCallback();
		
										
	},
	_bytesToSize: function(bytes) 
	{
		  var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
		  if(bytes < 1024)return "1 KB";
		  else if ( bytes == 0)return  "0 KB";
		  for (var i = 0; i < sizes.length; i++) {
		    if (bytes <= 1024) {
		      return bytes + 1 + ' ' + sizes[i];
		    } else {
		      bytes = parseFloat(bytes / 1024).toFixed(0);
		    }
		  }
		  return bytes + ' P';
	},
	_createGridItem: function(ibfsitem, row, filetypeFilter, grid, lang, isDraggable)
	{
		var extension = ibfsitem.extension;				
		if(extension && filetypeFilter && filetypeFilter.length > 0 && filetypeFilter.toLowerCase() != extension.toLowerCase())return;					
		var glyph = "ibx-icons ds-icon-unknown";	
		if(ibfsitem.altglyph)
			glyph = ibfsitem.altglyph;
		else if(ibfsitem.clientInfo.typeInfo)			
			glyph = ibfsitem.clientInfo.typeInfo.glyphClasses;
		
		if(ibfsitem.clientInfo.properties && ibfsitem.clientInfo.properties.EnhancedRun == "on")
			glyph = "ibx-icons ds-icon-tap";
			
		this._addgriditem(grid, ibfsitem, glyph, false, row, lang, isDraggable);
		row++;
		return row;
	},
	_addgriditem: function(grid, ibfsitem, glyph, folder, row, lang, isDraggable)
	{
		var summary = (ibfsitem.summary)? ibfsitem.summary : " ";
		if(summary.length > 160)summary = summary.substring(0, 160) + "...";
		summary = summary.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		summary = summary.replace(/\n/g, "<br/>");
		var columns = this.options.columns;		
		var ddate = "";
		var ddate2 = "";
		var lmodIdx = 6;
		var creonIdx = 7;
		// mess with indices only if home_globals defined and not in portal
		if (typeof home_globals != "undefined" && $('.pvd-run-tool').length === 0 && home_globals.currentItem && home_globals.currentItem.pwa)
		{
			lmodIdx = 7;
			creonIdx = 8;
		}	
		
		if(columns[lmodIdx][3] && ibfsitem.lastModified)
		{
			var d  = new Date(parseInt(ibfsitem.lastModified, 10));			
			ddate = d.toLocaleDateString(lang) + "  " + d.toLocaleTimeString(lang);
		}
		if(columns[creonIdx][3] && ibfsitem.createdOn)
		{	
			d = new Date(parseInt(ibfsitem.createdOn, 10));			
			ddate2 = d.toLocaleDateString(lang) + "  " + d.toLocaleTimeString(lang);
		}	
		var showLength = '-';
		if(ibfsitem.length && ibfsitem.length > 0)
			showLength = this._bytesToSize(ibfsitem.length);
		
		var description = ibfsitem.description;

		if(!description || description.length == 0)
			description = ibfsitem.name;
		
//		description = description.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		
		if(ibfsitem.adornment)
			description += (" (" + ibfsitem.adornment + ")");
		
		var ownerName = (ibfsitem.ownerName ? ibfsitem.ownerName : "-");
		var category = (ibfsitem.clientInfo && ibfsitem.clientInfo.properties && ibfsitem.clientInfo.properties.Category) ? ibfsitem.clientInfo.properties.Category : "";
		if (!category && ibfsitem.type == "LinkItem")
			category = (ibfsitem.clientInfo && ibfsitem.clientInfo.properties && ibfsitem.clientInfo.properties.LinkToCategory) ? ibfsitem.clientInfo.properties.LinkToCategory : "";
			
		//var published = ibfsitem.published ? "fa fa-check" : " ";
		//var shown = ibfsitem.shown ? "fa fa-check" : " ";
		var data=
			[
			 glyph,
			 "",
			 description,
			 ibfsitem.name,
			 summary,
			 category,
			 ddate,
			 ddate2,
			 showLength,
			 ownerName,
			 ibfsitem.published,
			 ibfsitem.shown,
			 "fa fa-ellipsis-v"			 
			];
		
		// mess with indices only if home_globals defined and not in portal
		if (typeof home_globals != "undefined" && $('.pvd-run-tool').length === 0 && home_globals.currentItem && home_globals.currentItem.pwa)
		{
			data=
				[
				 glyph,
				 "",
				 description,
				 "",
				 ibfsitem.name,
				 summary,
				 category,
				 ddate,
				 ddate2,
				 showLength,
				 ownerName,
				 ibfsitem.published,
				 ibfsitem.shown,
				 "fa fa-ellipsis-v"			 
				];
		}
		
		if (typeof home_globals != "undefined" && home_globals.currentItem && home_globals.currentItem.pwa)
		{
			
			var scmText="";
			switch(ibfsitem.scmStatus)
			{
				case "NONE":
					scmText = "";	//"Staged";
					break;
				case "UNTRACKED":
				case "UNTRACKED|UNTRACKED_FOLDER":
					scmText = "Un-tracked";
					break;
				case "TRACKED":
					scmText = "Tracked";
					break;
				case "MODIFIED":
					scmText = "Modified";
					break;
				case "CONFLICT":
					scmText = "Conflict";
					break;
				case "ADDED":
					scmText = "Added";
					break;
				case "MISSING":
					scmText = "Missing";
					break;
				case "DELETED":
					scmText = "Deleted";
					break;
				case "IGNORED":
					scmText = "Ignored";
					break;
			}

			data[3] = scmText;
		}
		grid.addrow(data, ibfsitem, folder, row, isDraggable);	
	}				
});
//# sourceURL=view_list.js