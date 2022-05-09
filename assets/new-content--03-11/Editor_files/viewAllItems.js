/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.3 $:
//////////////////////////////////////////////////////////////////////////


$.widget("ibi.viewAllItems", $.ibi.ibxVBox,
{
	options:
	{
		"align": "stretch",
		"mode": "list",
		"focusDefault": ".view-all-area-close-button",
		"label1": "",
		"label2": "",
		"label2a": "",
		"type": "",
		"performSort": true,
		"hideCloseBtn": false,
		"sortCol": 'title',
		"sortDir":	"asc",
	},
	
	_widgetClass: "view-all-items",
	
	_contentPage: null,

	_tags: [],
	
	_gTexts: [],
	
	_setOption: function(key, value)
	{
		this._super(key, value);
		switch(key)
		{
			case "mode":
			case "type":
			case "performSort":
			case "sortCol":
			case "sortDir":
			case "noDblClick":
			case "fillMissingTitle":
			{
				this._contentPage.ibxWidget('option', key, value);
				break;
			}
			case "hideCloseBtn":
				break;
		}
	},
	
	_create: function()
	{
		this._super();
		this.element.ibxAddClass("homepage-content");
		var va = ibx.resourceMgr.getResource('.view-all-area');
		this._contentPage = va.find('.home-domains-content-page');
		this._contentPage.ibxWidget('option', {'mode': this.options.mode, 'caller': "viewAllItems", "type": this.options.type, 
									"performSort": this.options.performSort, "dynamic": this.options.dynamic, 
									'fillMissingTitle': this.options.fillMissingTitle, 'noDblClick': this.options.noDblClick});
		
		this.element.ibxWidget('add', va);
		this.element.find('.view-all-area-close-button').focus();
		this.element.find('.view-all-area-close-button').on('click', function(e)
		{
			$('.cbox-file-box').dispatchEvent('close_view_all');
		}.bind(this));

		this.element.find('.wf-left-arrow').on('click', function(e)
		{
			$('.cbox-file-box').dispatchEvent('close_view_all');
		}.bind(this));	
		
		this.element.on('new_row_count', function(e)
		{
			var rowCount = e.originalEvent.data;
			this.element.find('.wf-va-count-squre').text(rowCount);
		}.bind(this));
		
		this.element.on('list_done_loading', function(e)
		{
			window.setTimeout(function (e)
			{
				if(this.element.find('.wf-left-arrow').length != 0)
				{
					var tileString = "";
					var tile_sub_String = "";
					if(this._gTexts[2] == "searchResults")
					{
						tile_sub_String = sformat(ibx.resourceMgr.getString("hpreboot_num_search_view"), this._gTexts[1], this._gTexts[0])
					}
					else
					{
						var cName = this.getContentName(this._gTexts[2]);
						tile_sub_String = tile_sub_String.concat(cName, " ", sformat(ibx.resourceMgr.getString("hpreboot_num_list_view"), this._gTexts[0]));
					}
					tileString = tileString.concat(tile_sub_String);
					var targetNode = this.element.find('.wf-left-arrow');
					targetNode.attr("title", ibx.resourceMgr.getString("hpreboot_wf_left_arrow"));
					targetNode.attr("aria-disabled", "false");
					targetNode.attr("aria-label", tileString);
					this.element.find('.wf-left-arrow').focus();
					targetNode.attr("aria-label", tileString);
				}
				else
				{
					var tileString2 = "";
					var cName2 = this.getContentName(this._gTexts[2]);
					tileString2 = tileString2.concat(cName2, " ", sformat(ibx.resourceMgr.getString("hpreboot_num_list_view"), this._gTexts[0]));
					var targetNode2 = this.element.find('.wf-search-results-reve-margin');
					targetNode2.attr("aria-disabled", "false");
					targetNode2.attr("aria-label", tileString2);
					//targetNode2.css('outline', 'none');
				}
			}.bind(this, e), 500);
		}.bind(this));
					
/*
		this.element.on('tag_list', function(e)
		{
			var tf = this.element.find('.view-all-top-controls-tag-filter')
			tf.ibxWidget('option', 'disabled', false);
			
			var tags = this._contentPage.ibxWidget('getTags');
			tags = tags.sort();
			for (var t = 0; t < tags.length; t++)
				tf.ibxWidget('addControlItem', $("<div class='view-all-tag-select-item'>").ibxSelectCheckItem({'text': tags[t]}));
			
			var filterData = this.element.closest('.view-all-items').find('.view-all-top-controls-tag-filter').ibxWidget('option', 'text')
			this._contentPage.ibxWidget('filter', {'colId': "tags", 'text': filterData});

		}.bind(this));
*/
		
		this.element.on('decrement_count', function(e)
		{
			var decCount = e.originalEvent.data;
			var curCount = Number(this.element.find('.wf-va-count-squre').text());
			curCount -= decCount;
			this.element.find('.wf-va-count-squre').text(curCount);
			if (curCount == 0)
				this.element.dispatchEvent('child_list', {children: []});
		}.bind(this));
		
		this.element.on('child_list', function(e)
		{
			var children = e.originalEvent.data.children;
			if (children.length == 0)
			{
				this._contentPage.ibxWidget('setChildren', children);

				switch (this.options.type) 
				{			
					case "recents":
						var recentsEmptyState = ibx.resourceMgr.getResource('.recents-empty-state');
						this._contentPage.ibxWidget('add', recentsEmptyState);
						break;
					case "favorites":
						var favoritesEmptyState = ibx.resourceMgr.getResource('.favorites-empty-state');
						this._contentPage.ibxWidget('add', favoritesEmptyState);
						break;
					case "portals":
						var portalsEmptyState = ibx.resourceMgr.getResource('.portals-empty-state');
						this._contentPage.ibxWidget('add', portalsEmptyState);
						break;
					case "gettingStarted":
						var dynamicEmptyState = ibx.resourceMgr.getResource('.dynamic-empty-state');
						this._contentPage.ibxWidget('add', dynamicEmptyState);
						break;
					case "myWorkspace":
						var myworkspaceEmptyState = ibx.resourceMgr.getResource('.myworkspace-empty-state');
						this._contentPage.ibxWidget('add', myworkspaceEmptyState);
						break;
					case "sharedWithMe":
						var sharedWithMeEmptyState = ibx.resourceMgr.getResource('.sharedWithMe-empty-state');
						this._contentPage.ibxWidget('add', sharedWithMeEmptyState);
						this.element.closest(".hpreboot-tool").find(".grid-view-menu-control").hide();						
						break;
					default:
						break;
				}
				if (window.top !== window)	// no back button if embedded
				{
					this.element.find(".myworkspace-back-to-home").hide();
				}
					
				this.element.closest(".hpreboot-tool").find(".grid-view-controls").hide();
				$(".myworkspace-back-to-home").on("click", function(e)
				{
					this.element.closest(".hpreboot-tool").find(".home-button").dispatchEvent('click');
				}.bind(this));
				$(".myworkspace-back-to-home").hover(function(e)
				{
					$(e.target).find('.ibx-label-glyph').ibxAddClass("myworkspace-back-to-home-hover");
				}, function(e)
				{
					$(e.target).find('.ibx-label-glyph').ibxRemoveClass("myworkspace-back-to-home-hover");
				}.bind(this));
			}
			else
			{
				for (var i = 0; i < children.length; i++)
				{
					var text = children[i].clientInfo.properties.Category;
					if (text)
					{
						var tags = text.split(',');
						for (var t = 0; t < tags.length; t++)
						{
							var tg = tags[t].trim();
							if (!this._includes(tg))
								this._tags[this._tags.length] = tg;
			// IE doesn't support includes
			//				if (!this._tags.includes(tg))
			//					this._tags[this._tags.length] = tg;
						}
					}
				}
				this._tags = this._tags.sort();
				
				var tf = this.element.find('.view-all-top-controls-tag-filter')
				for (var t = 0; t < this._tags.length; t++)
					tf.ibxWidget('addControlItem', $("<div class='view-all-tag-select-item'>").ibxSelectCheckItem({'text': this._tags[t]}));
	
				this._contentPage.ibxWidget('option', {'type': this.options.type, 'performSort': this.options.performSort, 'dynamic':this.options.dynamic});
				this._contentPage.ibxWidget('setChildren', children);
				this._contentPage.ibxWidget('render', 0, 50);
			}
			e.stopPropagation();
		}.bind(this));
		
		this.element.find('.view-all-top-controls-tag-filter').on('ibx_textchanged', function(e)
		{
			var txt = $(e.currentTarget).ibxWidget('option', 'text')
			this._contentPage.ibxWidget('filter', [{'colId':"tags", 'text': txt}]);
		}.bind(this));
		this.element.find('.view-all-top-controls-tag-filter').on('ibx_change', function(e)
		{
			var txt = $(e.currentTarget).ibxWidget('option', 'text')
			this._contentPage.ibxWidget('filter', [{'colId':"tags", 'text': txt}]);
		}.bind(this));
		
		$('.cbox-file-box').on('home_unsharing home_sharing', function(e)
		{
			this.element.find('.grid-view-btn').ibxWidget('option', "disabled", true);
			this.element.find('.list-view-btn').ibxWidget('option', "disabled", true);
		}.bind(this));		


	},

	_includes: function(tg)
	{
		var findTag = false;
		for (var i=0 ; i < this._tags.length ; i++)
			if (this._tags[i].indexOf("tg") > -1)
				findTag = true;
		return findTag
	},
	
	filter: function(data)
	{
		this._contentPage.ibxWidget('filter', data);
	},
	
	render: function()
	{
		this._contentPage.ibxWidget('render', 0, 50);
	},

	refreshViewAll: function(children)
	{
		this.refreshDisplay(children);
	},
	
	refreshDisplay: function(children)
	{
		this._tags = [];
		if (this.options.mode == "list")
		{
			this._enrichWithWorkspace(children);
			var selItems = this._contentPage.ibxWidget('getSelectedResources')
			this._contentPage.ibxWidget('refreshGrid', children);
			this._contentPage.ibxWidget('setSelected', selItems);
		}
		else
		{
			this._contentPage.ibxWidget('refreshTiles', children)
		}
	},
	
	_enrichWithWorkspace: function(items)
	{
		Ibfs.ibfs.listItems('IBFS:/WFC/Repository', "1", false, {asJSON: true, async: false}).done(function(cInfo)
		{
			var domDescMap = [];
			var domains = cInfo.result;
			for (var i = 0; i < items.length; i++)
			{
				var item = items[i];
				var itemDomainPath = item.fullPath.substring(0, item.fullPath.indexOf('~')-1);
				if (!itemDomainPath)	//??????
				{
					var pp = item.fullPath.split('/');
					pp.length = 4;
					itemDomainPath = pp.join('/');
				}
				var domDesc = domDescMap[itemDomainPath];
				if (domDesc)
					item.clientInfo.properties.DomainDescription = domDesc;
				else
				{
					for (var d = 0; d < domains.length; d++)
					{
						var domain = domains[d];
						if (domain.fullPath == itemDomainPath)
						{
							domDescMap[itemDomainPath] = domain.description;
							item.clientInfo.properties.DomainDescription = domain.description;
							break;
						}
					}
				}
			}
		});
	},
	
	reset: function()
	{
		this._tags = [];
		this._contentPage.ibxWidget('reset');
	},
	
	getSelectedResources: function()
	{
		return this._contentPage.ibxWidget('getSelectedResources', this.options.mode);
	},
	
	getNumChildren: function(fromSelectDataSource)
	{
		return this._contentPage.ibxWidget('getNumChildren', fromSelectDataSource);
	},
	
	getContentName: function(tests2)
	{
		switch (tests2) 
		{
			case "searchResults":
				return ibx.resourceMgr.getString("hpreboot_search_results");
			case "recents":
				return ibx.resourceMgr.getString("hpreboot_recent");
			case "favorites":
				return ibx.resourceMgr.getString("hpreboot_banner_favorites");
			case "portals":
				return ibx.resourceMgr.getString("hpreboot_banner_portals");
			case "gettingStarted":
				return ibx.resourceMgr.getString("hpreboot_getting_started");
			case "sharedWithMe":
				return ibx.resourceMgr.getString("hpreboot_nav_sharedwithme");
			case "myWorkspace":	
				return ibx.resourceMgr.getString("hpreboot_nav_myworkspace");
			default:
				return "";
		}
		
	},
	
	_addAlert: function(aMsg)
    {   
		window.setTimeout(function (aMsg)
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
		    var msg = document.createTextNode(aMsg);
		    newAlert.appendChild(msg);
		    document.body.appendChild(newAlert);
		}.bind(this, aMsg), 500);
    	
    },

	setDetailLabel: function(texts)
	{
		if (!texts[0])
			texts[0] = "0";
		if (!texts[1])
			texts[1] = "";
		if (!texts[2])
			texts[2] = "";
		
		this._gTexts = texts;
		var va = this.element.find(".view-all-items-results");			//$(".view-all-items-results");
		va.empty();
		
		var leftArrow = $("<div class='wf-left-arrow circle-btn-x-large' tabindex='0'> <i class='ds-icon-arrow-left'></i> </div>");
		
		switch (texts[2]) 
		{
			case "searchResults":
			case "recents":
			case "favorites":
			case "portals":
			case "gettingStarted":
				va.ibxWidget('add',leftArrow);
				break;
			case "sharedWithMe":
			case "myWorkspace":							
			default:
				break;
		}

		this.element.find('.wf-left-arrow').on('click', function(e)
		{
			$('.cbox-file-box').dispatchEvent('close_view_all');
		}.bind(this));
		
		this.element.find('.wf-left-arrow').on('keydown', function(e)
		{
			if(e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE)
			{
				$('.cbox-file-box').dispatchEvent('close_view_all');
			}
		}.bind(this));
		
		var resultsLabel;
		if (texts[2] == "searchResults")
			resultsLabel = $("<div class='wf-search-results-reve'>").ibxLabel({'text': this.options.label1 + ':'});
		else
			resultsLabel = $("<div class='wf-search-results-reve wf-search-results-reve-margin'>").ibxLabel({'text': this.options.label1});	
		va.ibxWidget('add', resultsLabel);
		var tileString1 = " ";
		switch (texts[2]) 
		{
			case "sharedWithMe":
			case "myWorkspace":
				resultsLabel.attr("tabindex", "0");
			default:
				break;
		}

		var resultsName = $("<div class='wf-search-results-reve wf-search-results-reve-result'>").ibxLabel({'text': texts[1]});
		va.ibxWidget('add', resultsName);				

		var vaCountStr = "";
		switch (texts[2]) 
		{
			case "searchResults":
			case "recents":
			case "favorites":
			case "portals":
			case "gettingStarted":
			case "sharedWithMe":
			case "myWorkspace":	
				vaCountStr = sformat("<div class='wf-va-squre-count'><div class='wf-va-count-squre'>{1}</div></div>",  texts[0]); // number count				
				break;
			default:
				break;
		}

		var vaCount = $(vaCountStr);	
		va.ibxWidget('add', vaCount);      // Square red 

		var combinedShapeMiddle = $("<div class='wf-combined-Shape-middle'>");
		va.ibxWidget('add', combinedShapeMiddle); // right line always there
		
		var gvc = ibx.resourceMgr.getResource('.grid-view-controls');
		va.ibxWidget('add', gvc);
		
		var combinedMiddleShape = $("<div class='wf-combined-Shape-middle-16'>");
		va.ibxWidget('add', combinedMiddleShape);
		
		var colSelector = ibx.resourceMgr.getResource('.grid-view-menu-control');
		va.ibxWidget('add', colSelector);

		var combinedShape = $("<div class='wf-combined-Shape-16'>");
		va.ibxWidget('add', combinedShape); // right line always there

		if (texts[2] == 'datasource')
			va.hide();
		else
			va.show();
		
		va.find(".grid-view-menu-control-btn").on('click', function(e)
		{
			var dsColSel = (e.originalEvent ? e.originalEvent.data : undefined);
			this.element.find(".list-view-btn").addClass("list-view-btn-focus");
			var colButton = dsColSel ? dsColSel : this.element.find(".grid-view-menu-control-btn");
			this.element.find(".home-list-contents").dispatchEvent('colSelector_list',{"btnDiv": colButton});
		}.bind(this));	
		
		if (this.options.mode == "tile")
		{
			this.element.find(".grid-view-menu-control").css("display","none");
			va.find(".list-view-btn").removeClass("list-view-btn-focus");
			va.find(".grid-view-btn").addClass("grid-view-btn-focus");				
		}
		else
		{
			this.element.find(".grid-view-menu-control").css("display","block");
			va.find(".grid-view-btn").removeClass("grid-view-btn-focus");					
			va.find(".list-view-btn").addClass("list-view-btn-focus");
		}
		
		if(texts[2] == "searchResults" || texts[2] == "myWorkspace")
		{
			this.element.dispatchEvent('list_done_loading');
		}

		va.find(".grid-view-btn").on('click', function(e)
		{
			if (this.options.mode == 'tile')
				return;
			
			if (this.options.type == "datasource")
			{
				var hdcp = this.element.find('.home-domains-content-page');
				hdcp.find('.domains-folder-div-w-label').show();
				hdcp.find('.domains-item-div-w-label').show();
			}
			
			this.element.find(".wf-combined-Shape-middle-16").css("display","none");				
			this.element.find(".grid-view-menu-control").css("display","none");
			this.element.find(".list-view-btn").removeClass("list-view-btn-focus");
			this.element.find(".grid-view-btn").addClass("grid-view-btn-focus");
			this.options.mode = "tile";
			this._contentPage.ibxWidget('option', {'mode': this.options.mode});
			this._contentPage.ibxWidget('render', 0, 50);
			let message = e.target.getAttribute('data-message');
			this._addAlert(message);
		}.bind(this));		

		va.find(".list-view-btn").on('click', function(e)
		{
			if (this.options.mode == 'list')
				return;

			if (this.options.type == "datasource")
			{
				var hdcp = this.element.find('.home-domains-content-page');
				hdcp.find('.domains-folder-div-w-label').hide();
				hdcp.find('.domains-item-div-w-label').hide();
			}
			
			this.element.find(".wf-combined-Shape-middle-16").css("display","block");
			this.element.find(".grid-view-menu-control").css("display","block");
			this.element.find(".grid-view-btn").removeClass("grid-view-btn-focus");
			this.element.find(".list-view-btn").addClass("list-view-btn-focus");				
			this.options.mode = "list";
			this._contentPage.ibxWidget('option', {'mode': this.options.mode});
			this._contentPage.ibxWidget('render', 0, 50);
			
			let message = e.target.getAttribute('data-message');
			this._addAlert(message);
		}.bind(this));	
	},
});