/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.12 $:
//////////////////////////////////////////////////////////////////////////

$.widget("ibi.homeTileContents", $.ibi.ibxHBox,
{
	options:
	{
		"navKeyRoot": true,
		"selMgrOpts": 
		{
			"type":	"multi",
			"rubberBand":true,					
			"rubberBandPartialSelect":true,	
			"selectableChildren": '.test-item, .home-content-page-folder',
		},
		"caller": "",
		"type": "",
		"children": [],
	},
	
	_widgetClass: "home-tile-contents",

	_tags: null,
	
	_create: function ()
	{
		this._super();
	}, 
	
	_init: function()
	{
		this._super();
		this._sm = this.element.ibxSelectionManager("instance");
		this.element.on('ibx_selchange', function(e)
		{
//			console.log("selc")
//			var selItems = this._sm.selected();
//			console.log(selItems);
		}.bind(this));
	},
	
	_setOption: function(key, value)
	{
		this._super(key, value);
	},
	
	getSelected: function()
	{
		return this._sm.selected();
	},
	
	setTags: function(tags)
	{
		this._tags = tags;
	},
	
	filter: function(data)
	{
		
		var tiles = this.element.ibxWidget("children");
		tiles.show();

		for (var df = 0; df < data.length; df++)
		{
			var colId = data[df].colId;
			var matchType = data[df].matchType;
			var text = data[df].text;
			if (!text.length)
				continue;
			
			var filters = text.toLowerCase().split(',');
	
			for (var fi = 0; fi < filters.length; fi++)
			{
				filters[fi] = filters[fi].trim();
			}
			
			for (var i = 0; i < tiles.length; i++)
			{
				var tile = $(tiles[i]);
				var item = tile.data('item');
				
				switch(colId)
				{
					case "title":
					{
						if (item.description.toLowerCase().indexOf(filters[0]) == -1)
							tile.hide();
						break;
					}
					case "type":
					{
						switch(text)
						{
							case "ro":
							{
								if (item.type != "ROFexFile")
									tile.hide();
								break;
							}
							case "mf": 
							{
								if (item.extension != "mas")
									tile.hide();
								break;
							}
						}
						break;
					}
					case "tags":
					{
						var tags = item.clientInfo.properties.Category;
						if (!tags)
							tile.hide();
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
								tile.hide();
						}
						break;
					}
				}
			}
		}
	},
	
	
	load: function(items)
	{
		this.element.ibxWidget("remove");
		this.options.children = items;
		
		for (var i = 0; i < items.length; i++)
		{
			var tileData = items[i];
			
			var tile = ibx.resourceMgr.getResource('.test-item');
			var thumb = tile.find('.item-thumb');
			var thumbWrapper = item.find('.item-thumb-wrapper');

			tile.data("item", tileData);
			thumbWrapper.data("item", tileData);
			
			if (!tileData.glyphThumb)
			{
				tile.find("img").hide();
				tile.find('.glyph-thumb').ibxAddClass(tileData.glyphThumb);
			}
			else
			{
				tile.find('.glyph-thumb').hide();
				tile.find("img").attr("src", tileData.thumbPath);
			}
			tile.find('.ibx-label-text').text(tileData.description);
//			tile.find('.image-text').attr('title', 'Title=\t\t'+tileData.description+"\nLast Modified=\t"+tileData.lastModified);
			var glyph = "ibx-icons ds-icon-unknown";	
			if(tileData.altglyph)
				glyph = tileData.altglyph;			
			else if(tileData.clientInfo && tileData.clientInfo.typeInfo)				
				glyph = tileData.clientInfo.typeInfo.glyphClasses;				
			tile.find('.ibx-label-glyph').ibxAddClass(glyph);

			if (this.options.type != 'favorites' && tileData.ownerName && tileData.type != 'MyReportFolder')
			{
				thumbWrapper.ibxAddClass("home-tile-private");
				thumb.ibxAddClass('home-content-private');
			}
			if (tileData.clientInfo.properties.hidden)
				tile.ibxAddClass('home-content-hidden');

			tile.attr("data-ibfs-path", tileData.fullPath);
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
			
			this.element.ibxWidget('add', tile);
		}

	},
	
	createTileTitle: function(e)
	{
		// Tile = <Content Type> , <Tile Title>, <Business State>
		var tile = $(e.target);
		var tileTitle = "Tile = "
		var item = tile.data('item'); 
		var cType = item.type;
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
				
		tileTitle = tileTitle.concat(cType, 
									 ", ",
									 tileName,
									 ", ",
									 bStatus);
		tile.attr("aria-label", tileTitle);
	},
	
	update: function(mode)
	{
		var selItems = this._sm.selected();
		switch (mode)
		{
			case 'remove_favorite':
			case 'remove_recent':
			case 'delete':
			{
				var curChildren = this.options.children;
				$.each(selItems, function(idx, selItem)
				{
					var selPath = $(selItem).data('item').fullPath;
					for (var i = 0; i < curChildren.length; i++)
					{
						if (selPath === curChildren[i].fullPath)
						{
							curChildren.splice(i, 1);
							break;
						}
					}
				}.bind(this));				
				break;
			}
		}
		
		for (var s = 0; s < selItems.length; s++)
		{
			var tile = $(selItems[s]);
			switch(mode)
			{
				case "remove_recent":
				case "remove_favorite":
				{
					this.element.ibxWidget("remove", tile);
					this.element.closest('.view-all-items').dispatchEvent('decrement_count', 1);
					break;
				}
				case 'share':
				case 'unshare':
				{
					if (s === 0)	// do only once
					{
						var root = this.element.closest('.hpreboot-tool');
						var curView = root.ibxWidget('getCurrentView');
						switch(curView)
						{
							case "myWorkspace":
							{
								root.find('.myworkspace-button').dispatchEvent('click');
								break;
							}
						}
					}
					break;
				}
				case "delete":
				{
					if (s == 0)
					{
						if (this.options.type == "impexp")
						{
							var dlg = this.element.closest('.chg-mgmnt-dialog');
							dlg.ibxWidget('load');
						}
						else
						{
							var root = this.element.closest('.hpreboot-tool');
							var curView = root.ibxWidget('getCurrentView');
							switch(curView)
							{
								case "myWorkspace":
								{
									root.find('.myworkspace-button').dispatchEvent('click');
									break;
								}
							}
						}
					}
					break;
				}
				case 'dup':
				{
					var root = this.element.closest('.hpreboot-tool');
					var curView = root.ibxWidget('getCurrentView');
					switch(curView)
					{
						case "myWorkspace":
						{
							root.find('.myworkspace-button').dispatchEvent('click');
							break;
						}
					}
					break;
				}
			}
		}
	}
});

//# sourceURL=homeTileContents.js