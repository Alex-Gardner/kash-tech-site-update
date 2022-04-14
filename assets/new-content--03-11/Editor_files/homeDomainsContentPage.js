/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.35 $:
//////////////////////////////////////////////////////////////////////////

$.widget("ibi.homeDomainsContentPage", $.ibi.ibxVBox,
{
	options:
	{
		"initialData": null,
		"mode": "tile",
		"domains": null,
		"align": "stretch",
		"lastFolder": "IBFS:/WFC/Repository/Retail_Samples/Charts",
		"caller": "",
		"type": "",
		"selType": "multi",
		"performSort": false,
		"colHeaderSub": [],
		"sortCol": 'title',
		"sortDir":	"asc",
	},

	_widgetClass: "home-domains-content-page",

	_breadCrumb: $('.home-domains-breadcrumb'), 

	_domains: null,
	
	_tree: null,
	
	_curPath: "IBFS:/WFC/Repository",
	
	_curChildren: [],
	
	_curParent: null,
	
	_folderDiv: null,
	_itemDiv: null,
	_listContents: null,
	
	_domainMenus: null,
	
	_selectedItems: [],
	
	_propItem: null,
	
	_locFolderPath: null, 
	_locItemPath: null,
	
	_tags: [],
	
	_existsFlag: 0, 	// 0=neither, 1=tile, 2=list, 3=both

	_tile: 	null,

	_create: function()
	{
		this._super();
		
		if (!hprbUtil.environment)
			hprbUtil.environment={};
		
//		this.options.tabOptions.text = ibx.resourceMgr.getString("hpreboot_content");
		
		this._tile = ibx.resourceMgr.getResource('.test-item');
		
		this._tree = $('.home-tree');
		
		this._domains = this.options.domains;
		
		this._domainMenus = new domainMenus(this, new domainMenuHandlers(this));
		this._domainMenus.initCommands();
		
		this.element.on('stop_loading', function(e)
		{
			if (this.options.mode == "list")
			{
				this._listContents.dispatchEvent('stop_loading');
			}
		}.bind(this));		

		this.element.on('chg_curpath_descend', function(e)
		{
			var item = e.originalEvent.data;
			this._breadCrumb.dispatchEvent(e);
		}.bind(this));
		
		this.element.on('breadcrumb_click', function(e)
		{
			this._curPath = e.originalEvent.data.fullPath;
			this.redraw(this.options.mode);
			e.stopPropagation();
		}.bind(this));
				
		this.element.on('render_last_folder', function(e)
		{
			this.render(0, 50);
			e.stopPropagation();
		}.bind(this));

		this.element.on('set_curchildren', function(e)
		{
			var children = e.originalEvent.data;
			this._curChildren = children;
			e.stopPropagation();
		}.bind(this));

		this.element.on('child_list', function(e)
		{
			var children = e.originalEvent.data.children;
			var parent = e.originalEvent.data.parent;
			this._curChildren = children;
			this._curParent = parent;
			this.reset();
			this.render(0, 50);
			e.stopPropagation();
		}.bind(this));

		this.element.on('get-children', function(e)
		{
			this._clear();
			e.stopPropagation();
		}.bind(this));

		$('.cbox-file-box').on('properties-changed-item', function(e)
		{
			this._propItem = e.originalEvent.data;
			
			if (this.options.mode == "list")
			{
				// 0=neither, 1=tile, 2=list, 3=both
				this._existsFlag = 2;
			}
			else
			{
				// 0=neither, 1=tile, 2=list, 3=both
				this._existsFlag = 1;
			}

		}.bind(this));
		
		$('.cbox-file-box').on('home_unpublish', function(e)
		{
			if (!this.element.is(":visible"))
				return;

			selItems = this.getSelectedResources(this.options.mode);

			$.each(selItems, function(idx, el)
			{
				el = $(el);
				var item = el.data('item'); 
				item.ownerName = hprbUtil.environment.userName;
				item.actions = item.actions.replace(/unpublish/, "publish");
				if (!item.container)
					el.ibxAddClass('home-tile-private');
				el.ibxAddClass('home-content-private');
			});
		}.bind(this));
		
		$('.cbox-file-box').on('home_publish', function(e)
		{
			if (!this.element.is(":visible"))
				return;

			selItems = this.getSelectedResources(this.options.mode);

			$.each(selItems, function(idx, el)
			{
				el = $(el);
				var item = el.data('item'); 
				item.ownerName = null;
				item.actions = item.actions.replace(/publish/, "unpublish");
				if (!item.container)
					el.ibxRemoveClass('home-tile-private');
				el.ibxRemoveClass('home-content-private');
			});
		}.bind(this));

		$('.cbox-file-box').on('home_hide', function(e)
		{
			if (!this.element.is(":visible"))
				return;

			selItems = this.getSelectedResources(this.options.mode);

			$.each(selItems, function(idx, el)
			{
				el = $(el);
				var item = el.data('item'); 
				item.actions = item.actions.replace(/hide/, "show");
				el.ibxAddClass('home-hidden-node');
				item.clientInfo.properties.hidden = 'on';
			});
		}.bind(this));
		
		$('.cbox-file-box').on('home_show', function(e)
		{
			if (!this.element.is(":visible"))
				return;

			selItems = this.getSelectedResources(this.options.mode);

			$.each(selItems, function(idx, el)
			{
				el = $(el);
				var item = el.data('item'); 
				item.actions = item.actions.replace(/show/, "hide");
				el.ibxRemoveClass('home-hidden-node');
				item.clientInfo.properties.hidden = null;
			});
		}.bind(this));
		
		$('.cbox-file-box').on('home_unshare', function(e)
		{
			if (!this.element.is(":visible"))
				return;

			if (this.options.mode != 'list')
				this._existsFlag = 1;

			this.element.closest('.view-all-area').find('.grid-view-btn').ibxWidget('option', "disabled", false);
			this.element.closest('.view-all-area').find('.list-view-btn').ibxWidget('option', "disabled", false);
			
			selItems = this.getSelectedResources(this.options.mode);

			$.each(selItems, function(idx, el)
			{
				el = $(el);
				var item = el.data('item'); 
				item.actions = item.actions.replace(/unshare/, "shareBasic");
				var child = this._findItem(item.fullPath);
				child.sharedToOthers = false;
			}.bind(this));

			if (this.options.mode == "list")
			{
				this._listContents.ibxWidget('update', 'unshare');
				// 0=neither, 1=tile, 2=list, 3=both
				this._existsFlag = 2;
			}
			else
			{
				this._itemDiv.ibxWidget('update', 'unshare');
				// 0=neither, 1=tile, 2=list, 3=both
				this._existsFlag = 1;
			}
		}.bind(this));

		$('.cbox-file-box').on('home_share', function(e)
		{
			if (!this.element.is(":visible"))
				return;

			if (this.options.mode != 'list')
				this._existsFlag = 1;

			this.element.closest('.view-all-area').find('.grid-view-btn').ibxWidget('option', "disabled", false);
			this.element.closest('.view-all-area').find('.list-view-btn').ibxWidget('option', "disabled", false);

			selItems = this.getSelectedResources(this.options.mode);

			$.each(selItems, function(idx, el)
			{
				el = $(el);
				var item = el.data('item'); 
				item.actions = item.actions.replace(/shareBasic/, "unshare");
				var child = this._findItem(item.fullPath);
				child.sharedToOthers = true;
			}.bind(this));
			
			if (this.options.mode == "list")
			{
				this._listContents.ibxWidget('update', 'share');
				// 0=neither, 1=tile, 2=list, 3=both
				this._existsFlag = 2;
			}
			else
			{
				this._itemDiv.ibxWidget('update', 'share');
				// 0=neither, 1=tile, 2=list, 3=both
				this._existsFlag = 1;
			}
		}.bind(this));

		$(document).on('home_delete', function(e)
		{
			if (!this.element.is(":visible"))
				return;

			if (this.options.mode == "list")
			{
				this._listContents.ibxWidget('update', 'delete');
				// 0=neither, 1=tile, 2=list, 3=both
				this._existsFlag = 2;
			}
			else
			{
				this._folderDiv.ibxWidget('update', 'delete');
				this._itemDiv.ibxWidget('update', 'delete');
				// 0=neither, 1=tile, 2=list, 3=both
				this._existsFlag = 1;
			}
		}.bind(this));

		$('.cbox-file-box').on('home_dup', function(e)
		{
			if (!this.element.is(":visible"))
				return;

			if (this.options.mode == "list")
			{
				this._listContents.ibxWidget('update', 'dup');
				// 0=neither, 1=tile, 2=list, 3=both
				this._existsFlag = 2;
			}
			else
			{
				this._folderDiv.ibxWidget('update', 'dup');
				this._itemDiv.ibxWidget('update', 'dup');
				// 0=neither, 1=tile, 2=list, 3=both
				this._existsFlag = 1;
			}
		}.bind(this));

		$('.cbox-file-box').on('home_remove_recent', function(e)
		{
			if (!this.element.is(":visible"))
				return;

			if (this.options.type == "recents")
			{
				if (this.options.mode == "list")
				{
					this._listContents.ibxWidget('update', 'remove_recent');
					// 0=neither, 1=tile, 2=list, 3=both
					this._existsFlag = 2;
				}
				else
				{
					this._itemDiv.ibxWidget('update', 'remove_recent');
					// 0=neither, 1=tile, 2=list, 3=both
					this._existsFlag = 1;
				}
			}
		}.bind(this));

		$('.cbox-file-box').on('remove_favorite', function(e)
		{
			if (!this.element.is(":visible"))
				return;

			if (this.options.type == "favorites")
			{
				if (this.options.mode == "list")
				{
					this._listContents.ibxWidget('update', 'remove_favorite');
					// 0=neither, 1=tile, 2=list, 3=both
					this._existsFlag = 2;
				}
				else
				{
					this._itemDiv.ibxWidget('update', 'remove_favorite');
					// 0=neither, 1=tile, 2=list, 3=both
					this._existsFlag = 1;
				}
			}
		}.bind(this));
		
		$('.cbox-file-box').on('locate-item', function(e)
		{
			var locPath = e.originalEvent.data.locPath;
//			console.log("domains: locate-item received for " + locPath);
			this._locItemPath = locPath;
			e.stopPropagation();
		}.bind(this));

		$('.cbox-file-box').on('render-done', function(e)
		{
			e.stopPropagation();
			if (this._locItemPath)
			{
				ibx.waitStop();
				var locPath = this._locItemPath;
				this._locItemPath = null;
//				console.log("domains: render-done with locPath of " + locPath);
				var cbox = this.element.closest('.cbox-file-box'); 
				var phbox = this.element.closest('.hpreboot-tool'); 
				phbox.find('.workspaces-button').dispatchEvent('click');
				
				if (this._itemDiv)
				{
					var sm = this._itemDiv.ibxSelectionManager('instance');
					var res = this._itemDiv.find("[data-ibfs-path='"+ locPath +"']");
					if (res.length)
					{
						sm.selected(res.find('.item-thumb-wrapper'), true);
						res.get(0).scrollIntoView(true);
						cbox.find('.home-domains-content-page').get(0).scrollBy(0, -40);
					}
					else
					{
						if (this._folderDiv)
						{
							sm = this._folderDiv.ibxSelectionManager('instance');
							var res = this._folderDiv.find("[data-ibfs-path='"+ locPath +"']");
							if (res.length)
							{
								sm.selected(res, true);
								res.get(0).scrollIntoView(true);
								cbox.find('.home-domains-content-page').get(0).scrollBy(0, -40);
							}
						}
					}
				}
			}
		}.bind(this));
		
		this.element.on('add_tile', function(e)
		{
			var item = e.originalEvent.data.item;
			var type = e.originalEvent.data.type;
			var tile = this._createTile(item);
			if (type == 'item')
			{
				var first = $(this._itemDiv.ibxWidget('children')[0]);
				this._itemDiv.ibxWidget('add', tile, first, true);
			}
		}.bind(this));
		
		this.element.on('add-alert', function(e)
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
		
	},

	refreshTiles: function(children)
	{
		this._curChildren = children;
		this.reset();
		this.render();
	},
	
	refreshGrid: function(children)
	{
		this._curChildren = children;
		this._listContents.ibxWidget('option', "children", this._curChildren);
		this._listContents.ibxWidget('reload');
	},

	setSelected: function(selItems)
	{
		if (this.options.mode == 'list')
		{
			this._listContents.ibxWidget('setSelected', selItems);
		}
	},
	
	reset: function()
	{
		this._existsFlag = 0;
		this.element.ibxWidget("remove");
	}, 
	
	filter: function(data)
	{
		if (this.options.caller == "viewAllItems")
		{
			if (this.options.mode == "list")
				this.element.find('.home-list-contents').ibxWidget('filter', data);
			else
			{
				this.element.find('.domains-folder-div').ibxWidget('filter', data);
				this.element.find('.domains-item-div').ibxWidget('filter', data);
			}
		}
	},

	_findItem: function(path)
	{
		var item = null;
		for (var i = 0; i < this._curChildren.length; i++)
		{
			if (this._curChildren[i].fullPath == path)
			{
				item = this._curChildren[i];
				break;
			}
		}
		
		return item;
	},
	
	setChildren: function(children)
	{
		this._curChildren = children;
	},
	
	getFolderDiv: function()
	{
		return this._folderDiv;
	},
	
	getItemDiv: function()
	{
		return this._itemDiv;
	},
	
	_findTreeNode: function(node)
	{
		if (node.fullPath == this._curPath)
			return node;
		
		if (node.fullPath.split('/').length == this._curPath.split('/').length)
			return null;
		
		var children = node.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = this._findTreeNode(children[i]);
			if (child)
				return child;
		}
		
		return null;
	},

	_clear: function()
	{
//		ibx.waitStart();	    			
		this.element.ibxWidget("remove");
	},
	
	getNumChildren: function(fromSelectDataSource)
	{
		var numChildren;
		if (this.options.mode == 'list')
			numChildren = this._listContents.ibxWidget('getNumChildren');
		else
		{
//			if (!fromSelectDataSource)
//			{
	 			var numFolders = this.element.find('.domains-folder-div').ibxWidget('children').length; 
				var numItems = this.element.find('.domains-item-div').ibxWidget('children').length;
				numChildren = numFolders + numItems;
//			}
//			else
//				numChildren = this._itemDiv.ibxWidget('option', 'children');
		}
		
		return numChildren;
	},
	
	getSelectedResources: function(mode)
	{
		var selItems = [];
		if (mode == "tile")
		{
			var folderContainer = this.getFolderDiv();	
			var fldrSelectedItems = folderContainer ? folderContainer.ibxWidget('getSelected') : [];
			var itemContainer = this.getItemDiv();	
			var itemSelectedItems = itemContainer ? itemContainer.ibxWidget('getSelected') : [];	
			
			for (var i = 0; i < fldrSelectedItems.length; i++)
				selItems.push($(fldrSelectedItems[i]));
			for (var j = 0; j < itemSelectedItems.length; j++)
				selItems.push($(itemSelectedItems[j]));
		}
		else
		{
			selItems = $('.home-list-contents').ibxWidget('getSelectedResources');
			for (var l = 0; l < selItems.length; l++)
				selItems[l] = $(selItems[l]);
		}
		return selItems;
	},
	
	_shouldFilter: function(data, item)
	{
		if (!data.length)
			return false;
		
		var filters = data.toLowerCase().split(',');

		for (var fi = 0; fi < filters.length; fi++)
		{
			filters[fi] = filters[fi].trim();
		}
		
		var tags = item.clientInfo.properties.Category;
		if (!tags)
			return true;
		else
		{
			tags = tags.toLowerCase();
			var shouldShow = false;
			for (var f = 0; f < filters.length; f++)
			{
				if (tags.indexOf(filters[f]) == 0 || tags.indexOf(","+filters[f]) != -1 || tags.indexOf(", "+filters[f]) != -1)
				{
					shouldShow = true;
					break;
				}
			}
			if (!shouldShow)
				return true;
			else 
				return false;
		}
	},
	
	_setHPMode: function()
	{
		switch (this.options.type)
		{
			case "portals":
			{
				hprbUtil.environment.homepageMode = 1;
				break;
			}
			case "favorites":
			{
				hprbUtil.environment.homepageMode = 2;
				break;
			}
			case "recents":
			{
				hprbUtil.environment.homepageMode = 3;
				break;
			}
			case "myWorkspace":
			{
				hprbUtil.environment.homepageMode = 4;
				break;
			}
			case "sharedWithMe":
			{
				hprbUtil.environment.homepageMode = 5;
				break;
			}
			case "gettingStarted":
			{
				hprbUtil.environment.homepageMode = 6;
				break;
			}
			case "searchResults":
			{
				hprbUtil.environment.homepageMode = 7;
				break;
			}
			default:
			{
				hprbUtil.environment.homepageMode = 0;
				break;
			}
		}
	},
	
	_sortChildren: function(colId, direction)
	{
		function sortCh(itemA, itemB)
		{
			var aVal;
			var bVal;
			switch(colId)
			{
				case 'lmod':
				{
					aVal = itemA.lastModified;
					bVal = itemB.lastModified;
					break;
				}
				default:
				{
					aVal = itemA.description.trim().toLowerCase();
					bVal = itemB.description.trim().toLowerCase();
					break;
				}
			}
			
			if (direction == 'asc')
				return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0);
			else
				return (aVal < bVal ? 1 : aVal > bVal ? -1 : 0);
		}
		
		this._curChildren.sort(sortCh);
	},

	_createTile: function(item)
	{
		var pageData = item;
		var tileDesc = '<div tabindex="-1" class="test-item ibx-widget ibx-flexbox ibx-flexbox-vertical fbx-block fbx-column fbx-nowrap fbx-justify-content-start fbx-justify-items-start fbx-align-items-stretch fbx-align-content-stretch 	fbx-child-sizing-content-box ibx-csl-item" data-ibx-type="ibxVBox" id="ibx-aria-id-153" aria-disabled="false" role="listitem">' + 
			'<div class="tibco-color-bar"></div>' +
			'<div class="item-thumb-wrapper ibx-widget ibx-flexbox ibx-flexbox-vertical fbx-block fbx-column fbx-nowrap fbx-justify-content-start fbx-justify-items-start fbx-align-items-stretch fbx-align-content-stretch 	fbx-child-sizing-content-box ibx-csl-item" data-ibx-type="ibxVBox" id="ibx-aria-id-153" aria-disabled="false" role="listitem">' +
				'<div class="item-summary"></div>' + 
				'<div class="ibx-widget ibx-flexbox ibx-flexbox-horizontal fbx-block fbx-row fbx-nowrap fbx-justify-content-start fbx-justify-items-start fbx-align-items-center fbx-align-content-center fbx-child-sizing-content-box">' +
					'<img draggable="false" class="item-thumb" src=""/>' +
					'<div class="type-label ibx-widget ibx-flexbox ibx-label icon-left fbx-inline fbx-row fbx-nowrap fbx-justify-content-start fbx-justify-items-start fbx-align-items-start fbx-align-content-start fbx-child-sizing-content-box" data-ibx-type="ibxLabel" id="ibx-aria-id-154" aria-disabled="false">' +
						'<div class="ibx-label-glyph ibx-label-icon aria-hidden="true"></div>' +
						'<div class="ibx-label-text"></div>' +
					'</div>' +
					'<div class="publish-label ibx-widget ibx-flexbox ibx-label icon-left fbx-inline fbx-row fbx-nowrap fbx-justify-content-start fbx-justify-items-start fbx-align-items-start fbx-align-content-start fbx-child-sizing-content-box" data-ibx-type="ibxLabel" id="ibx-aria-id-154" aria-disabled="false">' +
						'<div class="ibx-label-glyph ibx-label-icon aria-hidden="true"></div>' +
						'<div class="ibx-label-text"></div>' +
					'</div>' +
					'<div class="show-label ibx-widget ibx-flexbox ibx-label icon-left fbx-inline fbx-row fbx-nowrap fbx-justify-content-start fbx-justify-items-start fbx-align-items-start fbx-align-content-start fbx-child-sizing-content-box" data-ibx-type="ibxLabel" id="ibx-aria-id-154" aria-disabled="false">' +
						'<div class="ibx-label-glyph ibx-label-icon aria-hidden="true"></div>' +
						'<div class="ibx-label-text"></div>' +
					'</div>' +
					'<div class="shared-label ibx-widget ibx-flexbox ibx-label icon-left fbx-inline fbx-row fbx-nowrap fbx-justify-content-start fbx-justify-items-start fbx-align-items-start fbx-align-content-start fbx-child-sizing-content-box" data-ibx-type="ibxLabel" id="ibx-aria-id-154" aria-disabled="false">' +
						'<div class="ibx-label-glyph ibx-label-icon aria-hidden="true"></div>' +
						'<div class="ibx-label-text"></div>' +
					'</div>' +
				'</div>' +
				'<div class="glyph-thumb"></div>' +			
				'<div class="item-label web-clamp ibx-widget ibx-flexbox ibx-label icon-left fbx-inline fbx-row fbx-nowrap fbx-justify-content-start fbx-justify-items-start fbx-align-items-start fbx-align-content-start fbx-child-sizing-content-box" data-ibx-type="ibxLabel" id="ibx-aria-id-154" aria-disabled="false">' +
					'<div class="ibx-label-glyph ibx-label-icon ds-icon-cursor" style="display: none" aria-hidden="true"></div>' +
					'<div class="ibx-label-text"></div>' +
				'</div>' +
			'</div>' +
		'</div>';
		
		var tile = $(tileDesc);		//ibx.resourceMgr.getResource('.test-item');
		var thumbWrapper = tile.find('.item-thumb-wrapper');
		var thumb = tile.find('.item-thumb');

		tile.data("item", pageData);
		thumbWrapper.data("item", pageData);
		if (pageData.thumbPath.indexOf('/ibi_html/') != -1)
		{
			tile.find('.item-thumb-wrapper').ibxAddClass('item-thumb-wrapper-default');
//			tile.find('.item-thumb').ibxAddClass('item-thumb-default');
//			tile.find('.item-thumb').css({"height": "120px", "margin-top": "15px", "margin-bottom": "15px"});
			tile.find("img").attr("src", pageData.thumbPath);
			tile.find('.glyph-thumb').hide();
		}
		else
		{
			if (hprbUtil.environment.useOslo)
			{
				if (!pageData.glyphThumb)
				{
					console.log('folders oslo associated image');
					tile.find("img").attr("src", hprbUtil.oslo.associatedImage(pageData));
					tile.find('.glyph-thumb').hide();
				}
				else
				{
					tile.find("img").hide();
					tile.find('.glyph-thumb').ibxAddClass(pageData.glyphThumb);
				}
			}
			else
			{
				tile.find("img").attr("src", pageData.thumbPath).ibxAddClass("non-default-thumb");
				tile.find('.glyph-thumb').hide();
			}
			tile.find('.item-thumb').css({"margin-bottom": "18px"});
		}

		tile.find('.item-label .ibx-label-text').text(pageData.description);
		if (pageData.type == 'LinkItem' && this.options.type != "favorites")
			tile.find('.item-label .ibx-label-glyph').css({'display': '', 'font-size': '14px', 'padding-right': '8px'}).ibxAddClass('ds-icon-shortcut');

		if (pageData.summary)
		{
			tile.find('.item-summary').text(pageData.summary);
			tile.hover(function()
			{
				$(this).find(".item-summary").show();
			    
			    }, function(){	    	
			    
			    $(this).find(".item-summary").hide();	
			});
		}
		tile.find('.item-summary').hide();
		
		var unpublished = 1;
		var hidden      = 2;
		var shared		= 4;
		var type		= 8;
		
		var iconState = 0;
		if (!pageData.fullPath.includes('/EDA/'))
		{
			if (pageData.actions.indexOf('unpublish') === -1 && pageData.fullPath.indexOf('/~') == -1 && this.options.type != "favorites" && this.options.type !== 'impexp')
			{
				iconState |= unpublished;
				tile.find('.publish-label .ibx-label-glyph').ibxAddClass('ds-icon-unpublished');
			}
			tile.find('.image-text').attr('title', 'Title=\t\t'+pageData.description+"\nLast Modified=\t"+pageData.lmod);
	
			if (this.options.type != 'favorites' && pageData.ownerName && pageData.type != 'MyReportFolder' && !pageData.inMyContent)
			{
				thumbWrapper.ibxAddClass('home-tile-private');
				thumb.ibxAddClass('home-content-private');
			}
	
			if (pageData.clientInfo && pageData.clientInfo.properties)	// && pageData.clientInfo.properties.hidden && (this.options.type != 'myWorkspace' || pageData.fullPath.indexOf("/~") == -1))
			{
				if (pageData.clientInfo.properties.hidden)
				{
					iconState |= hidden;
					tile.find('.show-label .ibx-label-glyph').ibxAddClass('ds-icon-hide');
				}
				if (pageData.clientInfo.properties.EnhancedRun === 'on')
				{
					iconState |= type;
					tile.find('.type-label .ibx-label-glyph').ibxAddClass('ds-icon-tap');
				}
			}
			
			if (pageData.sharedToOthers)
			{
				iconState |= shared;
				tile.find('.shared-label .ibx-label-glyph').ibxAddClass('ds-icon-share');
			}
		}

//		var unpublished = 1;
//		var hidden      = 2;
//		var shared		= 4;
//		var type		= 8;

		switch (iconState)
		{
			case 0:
				tile.find('.publish-label').hide();
				tile.find('.show-label').hide();
				tile.find('.shared-label').hide();
				tile.find('.type-label').hide();
				break;
			case 1: // private
				tile.find('.show-label').hide();
				tile.find('.shared-label').hide();
				tile.find('.type-label').hide();
				break;
			case 2:	// hidden
				tile.find('.publish-label').hide();
				tile.find('.shared-label').hide();
				tile.find('.type-label').hide();
				break;
			case 3:	// private & hidden (1 & 2)
				tile.find('.shared-label').hide();
				tile.find('.type-label').hide();
				tile.find('.item-thumb').css('margin-right', '72px');
				break;
			case 4:	// shared
				tile.find('.publish-label').hide();
				tile.find('.show-label').hide();
				tile.find('.type-label').hide();
				tile.find('.item-thumb').css('margin-right', '104px');
				break;
			case 5:	// private & shared (2 & 3)
				tile.find('.show-label').hide();
				tile.find('.type-label').hide();
				tile.find('.item-thumb').css('margin-right', '72px');
				break;
			case 6:	// hidden & shared (2 & 4)
				tile.find('.publish-label').hide();
				tile.find('.type-label').hide();
				tile.find('.item-thumb').css('margin-right', '72px');
				break;
			case 7:  // private, hidden & shared (1, 2 & 4) 
				tile.find('.type-label').hide();
				tile.find('.item-thumb').css('margin-right', '36px');
				break;
			case 8: // type
				tile.find('.publish-label').hide();
				tile.find('.show-label').hide();
				tile.find('.shared-label').hide();
				break;
			case 9:	// private & type (1 & 8)
				tile.find('.show-label').hide();
				tile.find('.shared-label').hide();		
				tile.find('.item-thumb').css('margin-right', '72px');
				break;
			case 10: // hidden & type (2 & 8)
				tile.find('.publish-label').hide();
				tile.find('.shared-label').hide();		
				tile.find('.item-thumb').css('margin-right', '72px');
				break;
			case 11: // private, hidden & type (1, 2 & 8)
				tile.find('.shared-label').hide();		
				tile.find('.item-thumb').css('margin-right', '36px');
				break;
			case 12: // shared & type (4 & 8)
				tile.find('.publish-label').hide();
				tile.find('.show-label').hide();		
				tile.find('img').css('margin-right', '72px');
				break;
			case 13: // private, shared & type (1, 4 & 8)
				tile.find('.show-label').hide();
				tile.find('.item-thumb').css('margin-right', '36px');
				break
			case 14: // hidden, shared & type (2, 4 & 8)
				tile.find('.publish-label').hide();
				tile.find('.item-thumb').css('margin-right', '36px');
				break
			case 15: // private, hidden, shared & type (1, 2, 4 & 8)
				break;
		}

		tile.attr("data-ibfs-path", pageData.fullPath);

		return tile;
	},
	
	_setSelectedTileItems: function()
	{
		var sm = this._folderDiv.ibxSelectionManager('instance');
		sm.deselectAll();
		var res;
		for (var s = 0; s < this._selectedItems.length; s++)
		{
			res = this._folderDiv.find("[data-ibfs-path='"+this._selectedItems[s].attr('data-ibfs-path')+"']");
			if (res.length)
				sm.selected(res, true);	
		}
		
		if (this._propItem)
		{
			res = this._folderDiv.find("[data-ibfs-path='"+this._propItem.fullPath+"']");
			if (res.length)
			{
				sm.selected(res, true);
				this._propItem = null;
			}
		}
		
		var sm = this._itemDiv.ibxSelectionManager('instance');
		sm.deselectAll();
		var res;
		for (var s = 0; s < this._selectedItems.length; s++)
		{
			res = this._itemDiv.find("[data-ibfs-path='"+this._selectedItems[s].attr('data-ibfs-path')+"']");
			if (res.length)
				sm.selected(res, true);	
		}

		if (this._propItem)
		{
			res = this._itemDiv.find("[data-ibfs-path='"+this._propItem.fullPath+"']");
			if (res.length)
			{
				sm.selected(res, true);
				this._propItem = null;
			}
		}

	},
	
	render: function(startIdx, maxNum)
	{
		if (false)
		{
			if (this.options.caller != 'viewAllItems')
			{
				if (this.options.mode == "list")
					this._selectedItems = this.getSelectedResources("tile");
				else
					this._selectedItems = this.getSelectedResources("list");
			}
			else
			{
				this._setHPMode();
			}
		}
		else
		{
			if (this.options.mode == "list")
				this._selectedItems = this.getSelectedResources("tile");
			else
				this._selectedItems = this.getSelectedResources("list");
	
			this._setHPMode();
		}

		if (typeof startIdx == "undefined")
			startIdx = 0;

		if (typeof maxNum == "undefined")
			maxNum = this._curChildren.length;
		
//		this.element.ibxWidget("remove");
//		_existsFlag: 0, 	// 0=neither, 1=tile, 2=list, 3=both

		var filterData = this.element.closest('.view-all-items').find('.view-all-top-controls-tag-filter').ibxWidget('option', 'text')

		if (this.options.mode == "list")
		{
			if (this._existsFlag == 0 || this._existsFlag == 1) // not created yet
			{
				if (this._existsFlag == 1)
				{
					this._folderDiv.hide();
					this._itemDiv.hide();
				}
				this._existsFlag = (this._existsFlag == 1 ? 3 : 2); 
				this.options.domainContents = this;
				this._listContents = $('<div>').homeListContents(this.options); 
				this._listContents.ibxWidget('option', {"children": this._curChildren, "parent": this._curParent});
				this.element.ibxWidget('add', this._listContents);
				this._listContents.ibxWidget('load', startIdx, maxNum);
				this.element.dispatchEvent('dblclick_loaded');
			}
			else
			{
				if (this._folderDiv)
					this._folderDiv.hide();
				if (this._itemDiv)
					this._itemDiv.hide();

/*				if (this.options.type == "datasource")
				{
					this._existsFlag = (this._existsFlag == 2 ? 3 : 3); 
					this.element.ibxWidget('remove', ".home-list-contents");
					this._listContents = $('<div>').homeListContents(this.options); 
					this._listContents.ibxWidget('option', {"children": this._curChildren, "parent": this._curParent});
					this.element.ibxWidget('add', this._listContents);
					ibx.waitStart();
					this._listContents.ibxWidget('load', startIdx, maxNum);
					ibx.waitStop();
					this.element.dispatchEvent('dblclick_loaded');
				}
				else */
				{
					this._listContents.show();
//					if (this.options.caller == "viewAllItems")
//						this._listContents.ibxWidget('filter', {'colId': "tags", 'text': filterData});
				}
			}
			
			var sm = $('.ibx-data-grid').ibxWidget('getSelectionManager');
			if (sm.length)
			{
				sm.deselectAll();
				var row;
				for (var s = 0; s < this._selectedItems.length; s++)
				{
					row = this.element.find("[data-ibfs-path='"+this._selectedItems[s].attr('data-ibfs-path')+"']");
					sm.selected(row, true);	
				}
			}
		}
		else
		{
//			_existsFlag: 0, 	// 0=neither, 1=tile, 2=list, 3=both
			switch(this._existsFlag)
			{
				case 1:	// tiles created
				{
					if (this.options.type == "datasource")
					{
						this.element.ibxWidget('remove', this._folderDiv);
						this.element.ibxWidget('remove', this._itemDiv);
					}
					else
					{
						this._folderDiv.show();
						this._itemDiv.show();
						this._setSelectedTileItems();
//						if (this.options.caller == "viewAllItems")
//							this._itemDiv.ibxWidget('filter', {'colId': "tags", 'text': filterData});
						return;
					}
				}
				case 2:	// list created
				{
					this._listContents.hide();
					break;
				}
				case 3:
				{
					this._listContents.hide();
/*					if (this.options.type == "datasource")
					{
						this.element.ibxWidget('remove', '.domains-folder-div-w-label');
						this.element.ibxWidget('remove', this._folderDiv);
						this.element.ibxWidget('remove', '.domains-item-div-w-label');
						this.element.ibxWidget('remove', this._itemDiv);
					}
					else */
					{
						this._folderDiv.show();
						this._itemDiv.show();
						this._setSelectedTileItems();
//						if (this.options.caller == "viewAllItems")
//							this._itemDiv.ibxWidget('filter', {'colId': "tags", 'text': filterData});
						return;
					}
				}
			}
			
			this._existsFlag = (this._existsFlag == 0 ? 1 : 3); 
			
			var fldrVBox = $("<div class='domains-folder-div-w-label'>").ibxVBox();
			if (this.options.caller != "viewAllItems" && this.options.type != "datasource")
			{
				var fldrLabel = $("<div tabindex='-1' class='folderdiv-label home-content-displayer-label'>").ibxLabel({text: ibx.resourceMgr.getString("hpreboot_folders")});
				fldrVBox.ibxWidget('add', fldrLabel);
			}

			var selType = (this.options.type == "datasource" ? "single" : "multi");
			this._folderDiv = $("<div class='domains-folder-div' tabIndex='0'>").homeTileContents({'focusDefault': true, 'type': this.options.type, 'selMgrOpts': {'type': selType}});	
			fldrVBox.ibxWidget('add', this._folderDiv);
			this.element.ibxWidget('add', fldrVBox);
	
			var itemVBox = $("<div class='domains-item-div-w-label'>").ibxVBox({align: "stretch"});
			if (this.options.caller != "viewAllItems" && this.options.type != "datasource")
			{
				var itemLabel = $("<div tabindex='-1' class='itemdiv-label home-content-displayer-label'>").ibxLabel({text: ibx.resourceMgr.getString("hpreboot_items")});
				itemVBox.ibxWidget('add', itemLabel);
			}
			this._itemDiv = $("<div tabindex='0' class='domains-item-div'>").homeTileContents({'focusDefault': true, 'caller': this.options.caller, 'type': this.options.type, 'selMgrOpts': {'type': selType}});		
			itemVBox.ibxWidget('add', this._itemDiv);
			this.element.ibxWidget('add', itemVBox);
	
			if (this.options.performSort && (this.options.type != "recents" && this.options.type != "favorites"))
			{
				if (!this.options.sortCol)
					this.options.sortCol = "title";
				if (!this.options.sortDir)
					this.options.sortDir = "asc";
				this._sortChildren(this.options.sortCol, this.options.sortDir);
			}
			
			if (this.options.caller == "viewAllItems")
				this._itemDiv.ibxWidget('option', 'children', this._curChildren);
			
			var fldrContainer = this._folderDiv;	
			var itemContainer = this._itemDiv;		
			var numTiles = 0;
			var parentPath = "";
			
			if (this.options.type == 'datasource')
				ibx.waitStart('.select-data-source');
			else
				ibx.waitStart('.view-all-area');
			setTimeout(function()
			{
				var tileArray = [];
				var start = new Date();
					
				for (var i = 0; i < this._curChildren.length; i++)
				{
					var pageData = this._curChildren[i];
					parentPath = pageData.parentPath;
					
					if (this.options.dynamic && pageData.container && pageData.type != "PGXBundle" && pageData.type != "PRTLXBundle")
						continue;

					if ((this.options.caller != "viewAllItems" || this.options.type == 'datasource') && pageData.container && pageData.type != 'PGXBundle')
					{
						if (this.options.type == "datasource" && pageData.type == "PRTLXBundle")
							continue;
											
						var folder = $("<div tabindex='-1'>").homeContentPageFolder({'text': pageData.description});
						if (this.options.type == "datasource" && pageData.type == "IBFSFolder")
						{
							folder.ibxWidget('option', {'glyphClasses': "", 'icon': applicationContext + "/ibxtools/shared_resources/images/data-server@2x.png"});
							folder.css({'padding-top': '7px', 'padding-bottom': '6px'});
							folder.find('.ibx-label-glyph').css({'font-size': '28px', 'margin-right': '0px', 'padding-right': '0px'});
						}
	
						folder.data("item", pageData);
	
						switch (pageData.type)
						{
							case 'MyReportFolder':
							{
								var overlays = [];	
								
								overlays.push({'position':'bl','glyphClasses':'home-item-overlay fa fa-user'});
								if (pageData.sharedToOthers)
									overlays.push({'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'});
		
								folder.ibxWidget('option', 'overlays', overlays);			
								break;
							}
							case 'PRTLXBundle':
							{
								folder.ibxWidget('option', 'glyphClasses', 'ibx-icons ds-icon-portal');
								break;
							}
						}
						
						if (pageData.ownerName && pageData.type != 'MyReportFolder')
						{
							folder.ibxAddClass('home-tile-private');
							folder.find('.ibx-label-glyph').ibxAddClass('home-content-private');
						}	
						if (pageData.clientInfo.properties.hidden)
							folder.ibxAddClass('home-content-hidden');
						
						folder.on('ibx_ctxmenu', function(item, e)
						{
							if (this.options.type == "datasource")
								return;
	
							var folder_menu = this._domainMenus.folderMenu(null, item, 'domainBoth');
							var jqFolderMenu = $(folder_menu);
							e.stopPropagation();
							e.menu = jqFolderMenu;
						}.bind(this, pageData));
						
						folder.on('keydown', function(fldr, e)
						{
							if(e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE)
							{
								var tile = fldr;
								var item = tile.data('item');
								if(tile.hasClass('ibx-sm-selected'))
								{
									var counter = tile.attr('aria-tile-counter');
									if(counter == '0')
									{
										tile.attr('aria-tile-counter', '1');
										var ariaText = "";
										var tileTitle = item.description;
										ariaText = ariaText.concat(tileTitle, " ", ibx.resourceMgr.getString('hpreboot_tile_selected'));
										this.element.dispatchEvent('add-alert', {"ariatext": ariaText});
									}
									else
									{
										fldr.dispatchEvent(dblclick);
									}
									
								}
							}
									
						}.bind(this, folder));
						
						folder.on('dblclick', function(e)
						{
							var item = $(e.currentTarget).data("item");
							if (this.options.type == 'datasource')
							{
								this.element.dispatchEvent('dblclick_navigate', item);
								this.element.dispatchEvent('folder_dblclick', item);
							}
							else
							{
								this._curPath = item.fullPath;	
								this.element.dispatchEvent('chg_curpath_descend', item);
								this._tree.dispatchEvent('chg_curpath_descend', item);
							}
							e.stopPropagation();
						}.bind(this));
						
						folder.on('focus', function(e)
						{
							this.createFolderTitle(e)
							var tile = $(e.target);
							var counter = tile.attr('aria-tile-counter');
							if(counter == null || counter != '0')
							{
								tile.attr('aria-tile-counter', '0');
							}
						}.bind(this));
						folder.on('blur', function(e)
						{
							var tile = $(e.target);
							tile.removeAttr("aria-label");
							tile.attr('aria-tile-counter', '0');
						}.bind(this));
						
						
						
						
						folder.attr("data-ibfs-path", pageData.fullPath);
						this._folderDiv.ibxWidget('add', folder);
					}
					else
					{
						if (pageData.type == 'Manifest')
							continue;
	
	//					if (this._fromCarousel() && pageData.container)
	//						continue;
	
						var tile = this._createTile(pageData);
						tileArray.push(tile);
	
						tile.on('contextmenu', function(tile, item, e)
						{
							if (this.options.type == "datasource")
							{
								e.stopPropagation();
								e.preventDefault();
								return;
							}
							var file_menu = this._domainMenus.fileMenu(null, item, null, 'domainBoth');
							var jqItemMenu = $(file_menu);
							var options = 
							{
								my: "left top",
								at: "",
								collision: "fit",
								of: e,
								effect: "scale"
							};	
							jqItemMenu.ibxWidget("option", "position", options);
							jqItemMenu.ibxWidget('open');
							
							e.stopPropagation();
							e.preventDefault();
						}.bind(this, tile, pageData));
	
						tile.on('keydown', function(tl, e)
						{
							if(e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE)
							{
								var tile = tl;
								var item = tile.data('item');
								if(tile.hasClass('ibx-sm-selected'))
								{
									var counter = tile.attr('aria-tile-counter');
									if(counter == '0')
									{
										tile.attr('aria-tile-counter', '1');
										var ariaText = "";
										var tileTitle = item.description;
										ariaText = ariaText.concat(tileTitle, " ", ibx.resourceMgr.getString('hpreboot_tile_selected'));
										this.element.dispatchEvent('add-alert', {"ariatext": ariaText});
									}
									else
									{
										tl.dispatchEvent('dblclick');
									}
									
								}
							}
						}.bind(this, tile));
						
						tile.on('dblclick', function(tile, e)
						{
							if (this.options.type == "datasource")
								this.element.dispatchEvent('grid_dblclick')
							else
							{
								this._itemDiv.ibxSelectionManager('deselectAll');
								this._itemDiv.ibxSelectionManager('selected', tile, true);
								var item = tile.data('item');
								this._domainMenus._menuHandlers.dblClick(item);
							}
						}.bind(this, tile));
						
						tile.on('focus', function(e)
						{
							this.createTileTitle(e)
							var tile = $(e.target);
							var counter = tile.attr('aria-tile-counter');
							if(counter == null || counter != '0')
							{
								tile.attr('aria-tile-counter', '0');
							}
						}.bind(this));
						tile.on('blur', function(e)
						{
							var tile = $(e.target);
							tile.removeAttr("aria-label");
							tile.attr('aria-tile-counter', '0');
						}.bind(this));
	
						if (this.options.caller == "viewAllItems" && this._shouldFilter(filterData, pageData))
							tile.hide();
					}
				}
	
				var end = new Date();
//				alert("----->" + (end - start));
				if (this.options.type == 'datasource')
					ibx.waitStop('.select-data-source')
				else
					ibx.waitStop('.view-all-area');
				
				// assume length = 505 for discussion
				var chunk = 64;	//250;
				var max = chunk;
				
				// do first 250 (0->249)
				$.each(tileArray, function(idx, tile)
				{
					if (idx == max)
						return false;
			
					this._itemDiv.ibxWidget('add', tile);
				}.bind(this));

				if (!this._folderDiv.ibxWidget("children").length)
				{
					//fldrVBox.ibxWidget('remove', this.element.find('.folderdiv-label'));
					this.element.ibxWidget('remove', fldrVBox);
				}
				else
				{
					this._folderDiv.on("ibx_selchange", function(e)
					{
						if (e.originalEvent.data.selected)
						{
							var item = $(e.originalEvent.data.items[0]).data('item');

							if (this.options.type == "datasource")
								this.element.dispatchEvent('grid_click', item);

							this._setHPMode();
							this._itemDiv.ibxSelectionManager('deselectAll');
								
							this.element.closest('.cbox-file-box').dispatchEvent('ITEM_SELECTED', {"item": item});
						}
					}.bind(this));
					
				}
				
				if (!this._itemDiv.ibxWidget("children").length)
				{
					//itemVBox.ibxWidget('remove', this.element.find('.itemdiv-label'));
					this.element.ibxWidget('remove', itemVBox);
				}
				else
				{
					this._itemDiv.on("ibx_selchange", function(e)
					{
						if (e.originalEvent.data.selected)
						{
							var item = $(e.originalEvent.data.items[0]).data('item');

							if (this.options.type == "datasource")
								this.element.dispatchEvent('grid_click', item);

							this._setHPMode();
							this._folderDiv.ibxSelectionManager('deselectAll');
							this.element.closest('.cbox-file-box').dispatchEvent('ITEM_SELECTED', {"item": item});
						}
					}.bind(this));
				}
				
				this._setSelectedTileItems();

//				console.log('render-done for ' + parentPath);
				$('.cbox-file-box').dispatchEvent('render-done');
				$('.view-all-items').dispatchEvent('render-done');
				this.element.dispatchEvent('dblclick_loaded');

				// this will be true
				if (tileArray.length > max)
				{
					var start = max;			// start set to 250
					var end = start + chunk; 	// end set to 500
					var loopCnt = 1;
					while(start < tileArray.length)
					{
						// 1) 
						setTimeout(function(start, end, tileArray, itemDiv)
						{
							// 1) 250, 500 process 250->500 with 250ms delay
							// 2) 500, 750 process 500->505 (tileArray.length) with 500ms delay

							for (var i = start; i < end && i < tileArray.length; i++)
							{
								itemDiv.ibxWidget('add', tileArray[i]);
							}
							
							if (i == tileArray.length)
								$('.view-all-items').dispatchEvent('all_render_done');
							else
								$('.view-all-items').dispatchEvent('part_render_done');

						}, (loopCnt * 250), start, end, tileArray, this._itemDiv);
						
						start = end;	// start set to 500
						end += chunk;	// end set to 750
						loopCnt++;		// looCnt now 2
					}
				}
				
			}.bind(this), 250);
		}
	},
	
	createTileTitle: function(e)
	{
		// Tile = <Content Type> , <Tile Title>, <Business State>
		var tile = $(e.target);
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
	
	createFolderTitle: function(e)
	{
		var folder = $(e.target);
		var folderTitle = ibx.resourceMgr.getString("hpreboot_tile"); 
		var item = folder.data('item'); 
		var cType = item.type;
		var folderName = item.description;
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
				
		folderTitle = folderTitle.concat(cType, 
									 ", ",
									 folderName,
									 ", ",
									 bStatus);
		folder.attr("aria-label", folderTitle);
	},
	
	_fromCarousel: function()
	{
		var fromCarousel = false;
		switch (this.options.type)
		{
			case "gettingStarted":
			case "recents":
			case "favorites":
			case "portals":
			{
				fromCarousel = true;
				break;
			}
			default:
				fromCarousel = false;
		}
		
		return fromCarousel;
	},
});

//# sourceURL=homeDomainsContentPage.js