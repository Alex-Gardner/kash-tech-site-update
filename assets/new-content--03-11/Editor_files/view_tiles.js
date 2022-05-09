/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.54 $:

$.widget( "ibi.view_tiles", $.ibi.ibxHBox,
{
	options:
	{
		fromSort: false,
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
		categoryList: null,
		categoryToggle: null,
		titleMode: true,
		maxShownitems: 5000,
		nothingToShowString: "",
		askWebfocus: false,
		runUrl: null,
		updateTilesCallback: null,
		scope: "",
		isDraggable: false,
		deferSelectionItem : null
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
		this.element.append($("<div>").addClass("class-created"));
		var noResults = false;
	
		if(this.options.bSearch && this.options.folderlist.length == 0 && this.options.itemlist.length == 0)
		{
			var errorText = $("<div>").ibxLabel({"text":ibx.resourceMgr.getString("home_no_results")}).addClass("files-no-search-results");
			this.element.append(errorText);		
			noResults = true;
		}	
		else if(this.options.nothingToShowString.length > 0)
		{
			var errorText = $("<div>").ibxLabel({"text":this.options.nothingToShowString}).addClass("files-no-search-results");
			this.element.append(errorText);		
			noResults = true;
		}	
		var folderlist = this.options.folderlist;
		var itemlist = this.options.itemlist;
		var filetypeFilter = this.options.filetypeFilter;
		if(filetypeFilter && (filetypeFilter == "*"))filetypeFilter="";
		var divitem;
	
	// build the image view...
		// are there more than one category?
		if(!noResults /*&& this.options.bSearch*/ && this.options.categoryList && this.options.categoryList.length > 1)
		{
			var categoryList = this.options.categoryList;			
			this._haveTags = true;
			var categoryDiv = ibx.resourceMgr.getResource(".sd-category-buttons");
			this._categoryDiv = categoryDiv;
			this._createTags(categoryList);			
			this.element.append(categoryDiv);
		}	
		
	// folders						
		var ilen=folderlist.length;
		if(ilen > 0)
		{
			var folderslabel = ibx.resourceMgr.getResource(".sd-content-title-label-folders");			
			this.element.append(folderslabel);		
			var i;
			for (i=0; i < ilen; i++)
			{								
				var ibfsitem=folderlist[i];	
				
				divitem = $("<div>");
				divitem.itembox({item: ibfsitem,
					mobile: this.options.isMobile, 
					context: this.options.foldermenu, 
					doubleclick: this.options.openFolderCallBack,
					toggleSelected: this.options.selectedCallBack,
					setCallBack: this.options.setCallBack,
					fileSingleClick: this.options.fileSingleClick,
					thisContext: this.options.thisContext,
					selectFolder: this.options.selectFolder,
					titleMode: this.options.titleMode,
					isContainer: true,
					isDraggable: this.options.isDraggable
				});					
				this.element.append(divitem);			
			}
			
			
		}	
		
		// files					
		ilen=itemlist.length;											
		if(ilen > 0)
		{
			if(ilen > this.options.maxShownItems)ilen=this.options.maxShownItems;
			if(!this.options.askWebfocus)
			{	
				var fileslabel = ibx.resourceMgr.getResource(".sd-content-title-label-files");
				var flabel = $(fileslabel);		
				if(folderlist.length == 0)
				{					
					this.element.append(flabel);									
				}
				else
				{			
					$(flabel).find(".content-title-btn-name").hide();
					$(flabel).find(".content-title-btn-arrow").hide();
					this.element.append(flabel);				
				}
			}
			else
			{
				var fileslabel = ibx.resourceMgr.getResource(".sd-content-title-label-ask");
				var flabel = $(fileslabel);		
				this.element.append(flabel);									
				
			}	
			// add the first 50, then add the rest...
			var iLoad = 50;
			var ifrom = 0;
			var ito = iLoad;
			if(ito > ilen)ito = ilen;
			
			this._additems(itemlist, ifrom, ito, filetypeFilter);

			
			// now add the rest...
			if(ilen > iLoad)
			{				
				ibx.waitStart(this.element);
				setTimeout(function()
				{	
					irest = ilen - iLoad;
					this._additems(itemlist, iLoad, ilen, filetypeFilter);
					if(this.options.categoryList && this.options.categoryList.length > 1 && this.options.updateTilesCallback)
						this.options.updateTilesCallback();
					ibx.waitStop(this.element);
				}.bind(this), 1000);			
			}
			else
			{
				if(this.options.categoryList && this.options.categoryList.length > 1 && this.options.updateTilesCallback)
					this.options.updateTilesCallback();
			}	
				
			/*
			var i;
			for (i=0; i<ilen; i++)
			{								
				var ibfsitem=itemlist[i];
				var extension = ibfsitem.extension;	
				if(extension && filetypeFilter && filetypeFilter.length > 0 && filetypeFilter.toLowerCase() != extension.toLowerCase())continue;			
				var glyph = "ibx-icons ds-icon-unknown";	
				if(ibfsitem.clientInfo.typeInfo)
				{	
					glyph = ibfsitem.clientInfo.typeInfo.glyphClasses;
					
				}
				if(ibfsitem.sharedToOthers)glyph += " fa fa-share-alt";
				if(ibfsitem.inMyContent)glyph += " fa fa-user";		
				
				
				divitem = $("<div>");
				$(divitem).itembox(
							{
								item: ibfsitem,
								mobile: this.options.isMobile, 
								context: this.options.filemenu, 
								doubleclick: this.options.runCallBack,
								toggleSelected: this.options.selectedCallBack, 
								setCallBack: this.options.setCallBack,
								fileSingleClick: this.options.fileSingleClick,
								bSearch: this.options.bSearch,
								thisContext: this.options.thisContext,
								glyph: glyph,
								titleMode: this.options.titleMode
								
							}
						);
				ibx.bindElements(divitem);
				this.element.append(divitem);	
				
			}
			*/
		}
		
		if (folderlist.length || itemlist.length)
		{
			$('.content-title-btn-name').on('keydown', function(e)
			{
				if (!$(e.target).next().ibxWidget('option', 'disabled'))
					return;
				
				if (e.key == "Tab" && !e.shiftKey)
				{
					var isExplore = $(e.target).closest('.explore_widget_resources').length;
					var containerSelector = isExplore ? '.sd-files-box-files' : '.files-box-files';
					e.preventDefault();
					var curCanvasIdx = 1;
					var children = $(containerSelector).ibxWidget('children');
                    $.each(children, function(idx, child)
                    {
                        child = $(child);
                        if (child.hasClass('folder-item') && child.hasClass('focused')
                            || child.hasClass('fbx-block') && child.hasClass('focused'))
                        {
                            curCanvasIdx = idx;
                            return false;
                        }
                    });

                    if (curCanvasIdx == 1)
                    	curCanvasIdx++;
                    
                    var curChild = $(children[curCanvasIdx]); 
                    curChild.ibxAddClass('focused')
                    if (curChild.hasClass('folder-item'))
                    	curChild.focus();
                    else
                    	curChild.children().first().focus();

                    curChild[0].scrollIntoView();
                    if (Math.floor(curChild[0].getBoundingClientRect().top) == Math.floor($(containerSelector)[0].getBoundingClientRect().top))
                    	$('.files-box-files')[0].scrollTop = 0;
				}
			});
			
			$('.content-title-btn-arrow').on('keydown', function(e)
			{
				if (e.key == "Tab" && !e.shiftKey)
				{
					e.preventDefault();
					var curCanvasIdx = 1;
					var children = $('.files-box-files').ibxWidget('children');
                    $.each(children, function(idx, child)
                    {
                        child = $(child);
                        if (child.hasClass('folder-item') && child.hasClass('focused')
                            || child.hasClass('fbx-block') && child.hasClass('focused'))
                        {
                            curCanvasIdx = idx;
                            return false;
                        }
                    });

                    if (curCanvasIdx == 1)
                    	curCanvasIdx++;
                    
                    var curChild = $(children[curCanvasIdx]); 
                    curChild.ibxAddClass('focused')
                    if (curChild.hasClass('folder-item'))
                    	curChild.focus();
                    else
                    	curChild.children().first().focus();

                    curChild[0].scrollIntoView();
                    if (Math.floor(curChild[0].getBoundingClientRect().top) == Math.floor($('.files-box-files')[0].getBoundingClientRect().top))
                    	$('.files-box-files')[0].scrollTop = 0;
				}
			});
			
			$('.content-title-btn-arrow').on('focus', function(e)
			{
				e.preventDefault();
				if(($('.content-title-btn-arrow').text()) == "arrow_upward")
				{
					$('.content-title-btn-arrow').attr("aria-label", "");
					$('.content-title-btn-arrow').removeAttr("title");
					var ariaArrow_up = ibx.resourceMgr.getString("hpreboot_workspaces_sort_icon_up");
					$('.content-title-btn-arrow').dispatchEvent('add-alert', {"ariatext": ariaArrow_up});
				}
				else
				{
					$('.content-title-btn-arrow').attr("aria-label", "");
					$('.content-title-btn-arrow').removeAttr("title");
					var ariaArrow_down = ibx.resourceMgr.getString("hpreboot_workspaces_sort_icon_down");
					$('.content-title-btn-arrow').dispatchEvent('add-alert', {"ariatext": ariaArrow_down});
					
				}
			});
			
			$('.content-title-btn-arrow').on('mouseover', function(e)
			{
				e.preventDefault();
				if(($('.content-title-btn-arrow').text()) == "arrow_upward")
				{   
					var ariaArrow_up = ibx.resourceMgr.getString("str_reverse_sort_order");
					$('.content-title-btn-arrow').attr("title", ariaArrow_up);
				}
				else
				{
					var ariaArrow_down = ibx.resourceMgr.getString("str_reverse_sort_order");
					$('.content-title-btn-arrow').attr("title", ariaArrow_down);
				}
			});
			
			$('.content-title-btn-arrow').on('mouseout', function(e)
			{
				e.preventDefault();
				$('.content-title-btn-arrow').removeAttr("title");
				$('.content-title-btn-arrow').removeAttr("aria-label");
			});
			
			$('.content-title-btn-arrow').on('add-alert', function(e)
			{   
				window.setTimeout(function (e)
				{
			    	var oldAlert = document.getElementById("alert");
			        if (oldAlert)
			        {
			        	document.body.removeChild(oldAlert);
			        } 
				    var newAlert = document.createElement("div");
				    newAlert.setAttribute("class", "sr-only");
				    newAlert.setAttribute("role", "alert");
				    newAlert.setAttribute("id", "alert");
				    var aMsg = e.originalEvent.data.ariatext;
				    var msg = document.createTextNode(aMsg);
				    newAlert.appendChild(msg);
				    document.body.appendChild(newAlert);
				}.bind(this, e), 1000);
		    }.bind(this));
				
		}
		
		this._updateTitleButtons(this.options.sortorder, this.options.sortedvalue, this.options.sortedvaluetype, 
				this.options.columns, this.options.thisContext, this.options.sortFieldMenu, this.options.sortCallBack, 
				this.options.scope, this.options.fromSort);	
		
		
		//ibx.bindElements(this.element);
	},	
	_additems:function(itemlist, ifrom, ito, filetypeFilter)
	{
		var i;
		for (i = ifrom; i < ito; i++)
		{								
			var ibfsitem=itemlist[i];
			if (!ibfsitem)
				continue;
			var extension = "";
			if(ibfsitem.extension)
				extension = ibfsitem.extension;	
			if(extension && filetypeFilter && filetypeFilter.length > 0 && filetypeFilter.toLowerCase() != extension.toLowerCase())continue;			
			var glyph = "ibx-icons ds-icon-unknown";	
			if(ibfsitem.altglyph)
				glyph = ibfsitem.altglyph;			
			else if(ibfsitem.clientInfo && ibfsitem.clientInfo.typeInfo)				
				glyph = ibfsitem.clientInfo.typeInfo.glyphClasses;				
			/*	
			if(ibfsitem.sharedToOthers)
				glyph += " fa fa-share-alt";
			if(ibfsitem.inMyContent)
				glyph += " fa fa-user";		
			*/
			
			divitem = $("<div>");
			$(divitem).itembox(
						{
							item: ibfsitem,
							mobile: this.options.isMobile, 
							context: this.options.filemenu, 
							doubleclick: this.options.runCallBack,
							toggleSelected: this.options.selectedCallBack, 
							setCallBack: this.options.setCallBack,
							fileSingleClick: this.options.fileSingleClick,
							bSearch: this.options.bSearch,
							thisContext: this.options.thisContext,
							glyph: glyph,
							titleMode: this.options.titleMode,
							askWebfocus: this.options.askWebfocus,
							runUrl: this.options.runUrl,
							isContainer: false,
							isDraggable: this.options.isDraggable
						}
					);
			ibx.bindElements(divitem);
			this.element.append(divitem);	
			
			if (this.options.deferSelectionItem != null && (ibfsitem.fullPath == this.options.deferSelectionItem.fullPath))
			{
				home_globals.Items.toggleSelected(ibfsitem, 0);
				home_globals.Items.scrollIntoView(ibfsitem.fullPath);
				this.options.deferSelectionItem = null;
				home_globals.deferSelectionItem = null;
			}
			
			//this._createTileTitle(divitem);
		}
	},	
	_createTileTitle: function(e)
	{
		// Tile = <Content Type> , <Tile Title>, <Business State>
		var tile = $(e);
		var tileTitle = ibx.resourceMgr.getString("hpreboot_tile");  
		var item = tile.data('item'); 
		var cType = item.type;
        if (WFGlobals.isFeatureEnabled("UserFriendlyObjectTypeStrings"))
        {
	    	var gc = item.clientInfo.typeInfo.glyphClasses;
	    	var idx = 1;
	    	if (gc.charAt(0) == ' ')
	    		idx = 2;
	    	cType = rebootUtil.glpyhToAnnouncement(gc.split(' ')[idx], item);
        }
        
		var tileName = item.description;
		var bStatus = "";
		if(!item.ownerName)
		{
			bStatus = ibx.resourceMgr.getString("hpreboot_published");
		}
		else
		{
			bStatus = ibx.resourceMgr.getString("hpreboot_unpublished");
		}
		if (item.actions.indexOf('hide') != -1)
		{
			bStatus = bStatus.concat(', ', ibx.resourceMgr.getString("hpreboot_show_l"));
		}
		else
		{
			bStatus = bStatus.concat(', ', ibx.resourceMgr.getString("hpreboot_hidden"));
		}
				
		tileTitle = tileTitle.concat(" = ",
									 cType, 
									 ", ",
									 tileName,
									 ", ",
									 bStatus);
		tile.attr("aria-label", tileTitle);
	},
	_updateTitleButtons:function(sortedorder, sortedvalue, sortedvaluetype, columns, thisContext, sortFieldMenu, sortItems, scope, fromSort)
	{
		var sortedvalueText = "";
		var i;
		for(i=0; i < columns.length; i++)
		{	
			columns[i][4]="";
			if(columns[i][2].toLowerCase() == sortedvalue.toLowerCase())sortedvalueText = columns[i][0];		
		}
		var sorticon;
		if(sortedorder == "up")
			sorticon="arrow_upward";
		else if(sortedorder == "down")
			sorticon="arrow_downward";
		
		$(scope).find(".sd-content-title-label-folders").find(".content-title-btn-arrow").ibxWidget("option", "disabled", sortedvalue == "default");
		$(scope).find(".sd-content-title-label-files").find(".content-title-btn-arrow").ibxWidget("option", "disabled", sortedvalue == "default");	
		
		$(scope).find(".sd-content-title-label-folders").find(".content-title-btn-name").ibxWidget("option", "text", sortedvalueText);
		$(scope).find(".sd-content-title-label-folders").find(".content-title-btn-arrow").ibxWidget("option", "glyph", sorticon);	
		$(scope).find(".sd-content-title-label-files").find(".content-title-btn-name").ibxWidget("option", "text", sortedvalueText);
		$(scope).find(".sd-content-title-label-files").find(".content-title-btn-arrow").ibxWidget("option", "glyph", sorticon);
		
		var ariaLabel = "";
		var ariaArrow = "";
		var tooltipText = ibx.resourceMgr.getString("hpreboot_workspaces_default_sort_button");
		ariaLabel = sformat(tooltipText, sortedvalueText);
		
		
		if(sortedvalue == "default")
		{
			ariaArrow = ibx.resourceMgr.getString("hpreboot_workspaces_sort_icon_disabled");
		}
		else
		{
			//ariaArrow = ibx.resourceMgr.getString("str_reverse_sort_order");
		}
		var theButton = $(scope).find(".sd-content-title-label-folders").find(".content-title-btn-name");
		$(theButton).on("click", sortFieldMenu.bind(thisContext,theButton));
		$(theButton).attr("aria-label", ariaLabel);
		
		theButton = $(scope).find(".sd-content-title-label-files").find(".content-title-btn-name");
		$(theButton).on("click", sortFieldMenu.bind(thisContext,theButton));
		$(theButton).attr("aria-label", ariaLabel);
		
		theButton = $(scope).find(".sd-content-title-label-folders").find(".content-title-btn-arrow");
		$(theButton).on("click", sortItems.bind(thisContext, sortedvalue, sortedvaluetype, true));
						
		theButton = $(scope).find(".sd-content-title-label-files").find(".content-title-btn-arrow");
		$(theButton).on("click", sortItems.bind(thisContext, sortedvalue, sortedvaluetype, true));
				
		if (fromSort)
		{
			var sortBtns = $('.content-title-btn-name');
			if ($(sortBtns[0]).is(":visible"))
				$(sortBtns[0]).focus();
			else
				$(sortBtns[1]).focus();
		}
	}
					
});
//# sourceURL=view_tiles.js