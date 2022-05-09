// JavaScript Document/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.20 $:
//////////////////////////////////////////////////////////////////////////

$.widget("ibi.homeListContents", $.ibi.ibxVBox,
{
	options:
	{
		"domainContents": null,
		"navKeyRoot": false,
		"children": null,
		"align": "stretch",
		"caller": "",
		"type": "",
		"performSort": true,
		"sortCol": "title",
		"sortDir": "asc",
		"selType": "multi",
		"initLoad": -1,
		"secondaryLoad": 200,
		"dynamic": false,
		"resizableColumns": false,
	},
	
	_widgetClass: "home-list-contents",
	
	_showCols: 	[],
	_showTypeCols: [[]],
		
	_showNoCols: [],
	_showTypeNoCols: [[]],

	_orgShowCols: [],
	_orgTypeShowCols: [[]],
	
	_resizeCols: [],
	_resizeTypeCols: [[]],

	_colWidths: [],
	_colTypeWidths: [[]],
	
	_orgColWidths: [],
	_orgTypeColWidths: [[]],
	
	_colIdentifiers: [],
	_colTypeIdentifiers: [[]],
	
	_headers: null,
	_typeHeaders: [[]],
	
	_sortCol: [],
	_sortDir: [],

	_sm: null,
	
	_loadingHandle:null,
	
	_grid: null,

	_domainContents: null,
	
	_domainMenus: null,
	
	_displayPublish: true,

	_displayShow: true,

	_tags: null,
	
	_create: function ()
	{
		this._super();
		
		this._domainContents = this.options.domainContents;
		this._domainMenus = new domainMenus(this._domainContents, new domainMenuHandlers(this._domainContents));
		
		this._typeHeaders['default'] =
		[
			ibx.resourceMgr.getString("hpreboot_lang_header_type"), 
			ibx.resourceMgr.getString("hpreboot_title"), 
			ibx.resourceMgr.getString("hpreboot_name"), 
			ibx.resourceMgr.getString("hpreboot_lang_header_summary"), 
			ibx.resourceMgr.getString("hpreboot_tags"), 
			ibx.resourceMgr.getString("hpreboot_column_owner"), 
			ibx.resourceMgr.getString("hpreboot_lang_header_domain"), 
			ibx.resourceMgr.getString("hpreboot_lmod"), 
			ibx.resourceMgr.getString("hpreboot_creon"), 
			ibx.resourceMgr.getString("hpreboot_fsize"), 
			ibx.resourceMgr.getString("hpreboot_full_path"), 
		];
		this._resizeTypeCols['default'] =     [false, true, true, true, true,      false,  true,    false,    false,  false,   true,     false, /*false*/];
		this._colTypeWidths['default'] =      [70,     300,     190,    380,      380,    190,      190,      190,   190,     80,       190,   /*100*/];
		this._orgTypeColWidths['default'] =   [70,     300,     190,    380,      380,    190,      190,      190,   190,     80,       190,   /*100*/];
		this._colTypeIdentifiers['default'] = ["type", "title", "name", "summary", "tags", "owner", "domain", "lmod", "creon", "fsize", "path", /*"app"*/];
		this._showTypeCols['default'] =       [true,   true,    false,  true,      true,   false,   true,     true,   false,   false,   false, /*false*/];
		this._orgTypeShowCols['default'] =    [true,   true,    false,  true,      true,   false,   true,     true,   false,   false,   false, /*false*/];
		this._showTypeNoCols['default'] =     [false,  false,   false,  false,     false,  false,   false,    false,  false,   false,   false, /*false*/];
		this._sortCol['default']         = "title";
		this._sortDir['default']    	 = "asc";
		
		this._typeHeaders['carousel'] =
		[
			ibx.resourceMgr.getString("hpreboot_lang_header_type"), 
			ibx.resourceMgr.getString("hpreboot_title"), 
			ibx.resourceMgr.getString("hpreboot_name"), 
			ibx.resourceMgr.getString("hpreboot_lang_header_summary"), 
			ibx.resourceMgr.getString("hpreboot_tags"), 
			ibx.resourceMgr.getString("hpreboot_column_owner"), 
			ibx.resourceMgr.getString("hpreboot_lang_header_domain"), 
			ibx.resourceMgr.getString("hpreboot_lmod"), 
			ibx.resourceMgr.getString("hpreboot_creon"), 
			ibx.resourceMgr.getString("hpreboot_fsize"), 
			ibx.resourceMgr.getString("hpreboot_full_path"), 
		];
		this._resizeTypeCols['carousel'] =     [false, true, true, true, true,      false,  true,    false,    false,  false,   true,     false, /*false*/];
		this._colTypeWidths['carousel'] =      [60,     300,     190,    380,      380,    190,      190,      190,   190,     80,       190,   /*100*/];
		this._orgTypeColWidths['carousel'] =   [60,     300,     190,    380,      380,    190,      190,      190,   190,     80,       190,   /*100*/];
		this._colTypeIdentifiers['carousel'] = ["type", "title", "name", "summary", "tags", "owner", "domain", "lmod", "creon", "fsize", "path", /*"app"*/];
		this._showTypeCols['carousel'] =       [true,   true,    false,  true,      true,   false,   true,     true,   false,   false,   false, /*false*/];
		this._orgTypeShowCols['carousel'] =    [true,   true,    false,  true,      true,   false,   true,     true,   false,   false,   false, /*false*/];
		this._showTypeNoCols['carousel'] =     [false,  false,   false,  false,     false,  false,   false,    false,  false,   false,   false, /*false*/];
		this._sortCol['carousel']         = "title";
		this._sortDir['carousel']    	 = "asc";
		
		this._typeHeaders['myWorkspace'] =
		[
			ibx.resourceMgr.getString("hpreboot_lang_header_type"), 
			ibx.resourceMgr.getString("hpreboot_title"), 
			ibx.resourceMgr.getString("hpreboot_name"), 
			ibx.resourceMgr.getString("hpreboot_lang_header_summary"), 
			ibx.resourceMgr.getString("hpreboot_tags"), 
			ibx.resourceMgr.getString("hpreboot_column_owner"), 
			ibx.resourceMgr.getString("hpreboot_lang_header_domain"), 
			ibx.resourceMgr.getString("hpreboot_lmod"), 
			ibx.resourceMgr.getString("hpreboot_creon"), 
			ibx.resourceMgr.getString("hpreboot_fsize"), 
			ibx.resourceMgr.getString("hpreboot_full_path"), 
		];
		this._resizeTypeCols['myWorkspace'] =      [false,  true,    true,     true,   true,   true,     true,    false,  false,   false,   true];
		this._colTypeWidths['myWorkspace'] =       [60,    300,     190,      380,    380,    190,      190,     190,     190,    80,      190];
		this._orgTypeColWidths['myWorkspace'] =    [60,    300,     190,      380,    380,    190,      190,     190,     190,    80,      190];
		this._colTypeIdentifiers['myWorkspace'] = ["type", "title", "name", "summary", "tags", "owner", "domain", "lmod", "creon", "fsize", "path"];
		this._showTypeCols['myWorkspace'] =        [true,   true,    false,    true,   true,   false,    true,    true,  false,    false,   false];
		this._orgTypeShowCols['myWorkspace'] =     [true,   true,    false,    true,   true,   false,    true,    true,  false,    false,   false];
		this._showTypeNoCols['myWorkspace'] =      [false,  false,   false,    false,  false,  false,    false,   false, false,    false,   false];
		this._sortCol['myWorkspace']         = "lmod";
		this._sortDir['myWorkspace']    	 = "desc";
		
		this._typeHeaders['sharedWithMe'] =
		[
			ibx.resourceMgr.getString("hpreboot_lang_header_type"), 
			ibx.resourceMgr.getString("hpreboot_title"), 
			ibx.resourceMgr.getString("hpreboot_name"), 
			ibx.resourceMgr.getString("hpreboot_lang_header_summary"), 
			ibx.resourceMgr.getString("hpreboot_tags"), 
			ibx.resourceMgr.getString("hpreboot_column_owner"), 
			ibx.resourceMgr.getString("hpreboot_lang_header_domain"), 
			ibx.resourceMgr.getString("hpreboot_lmod"), 
			ibx.resourceMgr.getString("hpreboot_creon"), 
			ibx.resourceMgr.getString("hpreboot_fsize"), 
			ibx.resourceMgr.getString("hpreboot_full_path"), 
		];
		this._resizeTypeCols['sharedWithMe'] =      [false,  true,    true,     true,   true,   true,     true,    false,  false,   false,   true];
		this._colTypeWidths['sharedWithMe'] =       [60,    300,     190,      380,    380,    190,      190,     190,     190,    80,      190];
		this._orgTypeColWidths['sharedWithMe'] =    [60,    300,     190,      380,    380,    190,      190,     190,     190,    80,      190];
		this._colTypeIdentifiers['sharedWithMe'] = ["type", "title", "name", "summary", "tags", "owner", "domain", "lmod", "creon", "fsize", "path"];
		this._showTypeCols['sharedWithMe'] =        [true,   true,    false,    true,   true,   true,     false,   true,  false,    false,   false];
		this._orgTypeShowCols['sharedWithMe'] =     [true,   true,    false,    true,   true,   true,     false,   true,  false,    false,   false];
		this._showTypeNoCols['sharedWithMe'] =      [false,  false,   false,    false,  false,  false,    false,   false, false,    false,   false];
		this._sortCol['sharedWithMe']         = "lmod";
		this._sortDir['sharedWithMe']    	  = "desc";
		
		this._typeHeaders['impexp'] =
		[
			ibx.resourceMgr.getString("hpreboot_title"), 
			ibx.resourceMgr.getString("hpreboot_name"), 
//			ibx.resourceMgr.getString("hpreboot_lang_header_summary"), 
			ibx.resourceMgr.getString("hpreboot_lmod"), 
		];
		this._resizeTypeCols['impexp'] =      [true,    true,     false];
		this._colTypeWidths['impexp'] =       [430,     330,      190];
		this._orgTypeColWidths['impexp'] =    [430,     330,      190];
		this._colTypeIdentifiers['impexp'] = ["title", "name", "lmod"];
		this._showTypeCols['impexp'] =        [true,    false,    true];
		this._orgTypeShowCols['impexp'] =     [true,    false,    true];
		this._showTypeNoCols['impexp'] =      [false,   false,    false];
		this._sortCol['impexp']         = "title";
		this._sortDir['impexp']    	  = "asc";
		
		this._typeHeaders['datasource'] =
		[
			ibx.resourceMgr.getString("hpreboot_lang_header_type"), 
			ibx.resourceMgr.getString("hpreboot_name"), 
			ibx.resourceMgr.getString("hpreboot_title"), 
			ibx.resourceMgr.getString("hpreboot_lang_header_summary"), 
			ibx.resourceMgr.getString("hpreboot_tags"), 
			ibx.resourceMgr.getString("hpreboot_column_owner"), 
			ibx.resourceMgr.getString("hpreboot_folder"),
			ibx.resourceMgr.getString("hpreboot_lmod"), 
			ibx.resourceMgr.getString("hpreboot_creon"), 
			ibx.resourceMgr.getString("hpreboot_fsize"), 
			ibx.resourceMgr.getString("hpreboot_full_path"), 
		];
		this._resizeTypeCols['datasource'] =     [false,   true,    true,   true,     true,   false,  true,    false,    false,  false,    true];
		this._colTypeWidths['datasource'] =      [60,     190,     300,    380,      380,    190,      190,      190,   190,     80,       190];
		this._orgTypeColWidths['datasource'] =   [60,     190,     300,    380,      380,    190,      190,      190,   190,     80,       190];
		this._colTypeIdentifiers['datasource'] = ["type", "name", "title", "summary", "tags", "owner", "app",   "lmod",  "creon", "fsize", "path"];
		this._showTypeCols['datasource'] =       [true,   true,    true,   false,    false,  false,    true,     false,  false,    false,   false];
		this._orgTypeShowCols['datasource'] =    [true,   true,    true,   false,    false,  false,    true,     false,  false,    false,   false];
		this._showTypeNoCols['datasource'] =     [false,  false,   false,  false,    false,  false,    false,    false,  false,    false,   false];
		this._sortCol['datasource']         = "title"; 
		this._sortDir['datasource']    	    = "asc";
		

		this._sortCol['recents']         = "lmod";
		this._sortDir['recents']    	 = "desc";
		this._sortCol['favorites']       = "creon";
		this._sortDir['favorites']    	 = "desc";
		
		switch(this.options.type)
		{
			case "myWorkspace":
			case "impexp":
			case "sharedWithMe":
			case "datasource":
			{
				this._showCols = this._showTypeCols[this.options.type];
				this._resizeCols = this._resizeTypeCols[this.options.type];				
				this._colWidths = this._colTypeWidths[this.options.type];
				this._orgColWidths = this._orgTypeColWidths[this.options.type];
				this._colIdentifiers = this._colTypeIdentifiers[this.options.type];
				this._orgShowCols = this._orgTypeShowCols[this.options.type];
				this._showNoCols = this._showTypeNoCols[this.options.type];
				this._headers = this._typeHeaders[this.options.type];
				this.options.sortCol = this._sortCol[this.options.type];
				this.options.sortDir = this._sortDir[this.options.type];
				break;
			}
			case 'gettingStarted':
			case 'recents':
			case 'favorites':
			case 'portals':
			{
				this._showCols = this._showTypeCols['carousel'];
				this._resizeCols = this._resizeTypeCols['carousel'];				
				this._colWidths = this._colTypeWidths['carousel'];
				this._orgColWidths = this._orgTypeColWidths['carousel'];
				this._colIdentifiers = this._colTypeIdentifiers['carousel'];
				this._orgShowCols = this._orgTypeShowCols['carousel'];
				this._showNoCols = this._showTypeNoCols['carousel'];
				this._headers = this._typeHeaders['carousel'];
				this.options.sortCol = this._sortCol['carousel'];
				this.options.sortDir = this._sortDir['carousel'];
				if (this.options.type == "recents" || this.options.type == "favorites" || this.options.type == "gettingStarted")
				{
					this.options.sortCol = this._sortCol[this.options.type];
					this.options.sortDir = this._sortDir[this.options.type];
					if (this.options.type == 'favorites')
					{
						this._showCols[6] = false;
						this._showCols[7] = false;
						this._showCols[8] = true;
						this._orgShowCols[6] = false;
						this._orgShowCols[7] = false;
						this._orgShowCols[8] = true;
					}
					else if (this.options.type == "gettingStarted")
					{
						this._showCols[6] = false;
						this._orgShowCols[6] = false;
					}
				}
				break;
			}
			default:
			{
				this._resizeCols = this._resizeTypeCols['default'];				
				this._colWidths = this._colTypeWidths['default'];
				this._orgColWidths = this._orgTypeColWidths['default'];
				this._colIdentifiers = this._colTypeIdentifiers['default'];
				this._showCols = this._showTypeCols['default'];
				this._orgShowCols = this._orgTypeShowCols['default'];
				this._showNoCols = this._showTypeNoCols['default'];
				this._headers = this._typeHeaders['default'];
				this.options.sortCol = this._sortCol['default'];
				this.options.sortDir = this._sortDir['default'];
				break;
			}
		}

		$( window ).resize(function() 
		{
			if ($('.home-list-contents').length != 0)
				this._adjustLastColumnForResize(this._grid);
/*			
			if(this._sm != null)
			{
				if (this.options.selType == "multi")
				{
					if(window.innerWidth < 851)
					{
						this._sm.option({"rubberBand":false, "rubberBandPartialSelect":false});
		
					}
					else
					{
						this._sm.option({"rubberBand":true, "rubberBandPartialSelect":true});
		
					}
				}
			}
*/			
		}.bind(this));		

		this.element.on('stop_loading', function(e)
		{
			e.stopPropagation();
			clearInterval(this._loadingHandle);
		}.bind(this));	
		
		this.element.on('prop-opening', function(e)
		{
			this._adjustLastColumnForResize(this._grid);
			e.stopPropagation();
		}.bind(this));

		this.element.on('prop-closing', function(e)
		{
			this._adjustLastColumnForResize(this._grid);
			e.stopPropagation();
		}.bind(this));
		
		this.element.on('recent-dblclick', function(e)
        {
            this.options.reselect = true;
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
	
	_init: function()
	{
		this._super();
		if (this.options.type == "datasource")
			this.options.selType = "single";
	},
	
	_setOption: function(key, value)
	{
		this._super(key, value);
		switch(key)
		{
			case "colShowList":
			{
				if (!value || !value.length)
					this._showCols = this._orgShowCols;
				else
					this._showCols = this._showNoCols;
				
				for (var i = 0; i < value.length; i++)
				{
					for (var j = 0; j < this._colIdentifiers.length; j++)
					{
						if (value[i] == this._colIdentifiers[j])
						{
							this._showCols[j] = true;
						}
					}
				}
				break;
			}
			case "colHeaderSub":
				for (var i = 0; i < value.length; i++)
				{
					var colId = value[i].colId;
					var text = value[i].text;
					for (var j = 0; j < this._colIdentifiers.length; j++)
					{
						if (colId == this._colIdentifiers[j])
						{
							this._headers[j] = text;
						}
					}
				}				
				break;
		}
	},
	
	_sortRows: function(colId, direction, rows)
	{
		function revRow(a, b)
		{
			a = $(a);
			b = $(b);
			var itemA = a.data('item');
			var itemB = b.data('item');
			
			var aVal = "";
			var bVal = "";
			switch (colId)
			{
				case "type":
					aVal = itemA.type;
					bVal = itemB.type;
					if (this.options.type != 'datasource')
					{
						var aVal = "ibx-icons ds-icon-unknown";	
						if(itemA.altglyph)
							aVal = itemA.altglyph;			
						else if(itemA.clientInfo && itemA.clientInfo.typeInfo)				
							aVal = itemA.clientInfo.typeInfo.glyphClasses;			
						
						if (itemA.container && this.options.caller != "viewAllItems")
							aVal = "fa fa-folder";

						var bVal = "ibx-icons ds-icon-unknown";	
						if(itemB.altglyph)
							bVal = itemB.altglyph;			
						else if(itemB.clientInfo && itemB.clientInfo.typeInfo)				
							bVal = itemB.clientInfo.typeInfo.glyphClasses;			
						
						if (itemB.container && this.options.caller != "viewAllItems")
							bVal = "fa fa-folder";
					}
					break;
				case "title":	// title
					aVal = itemA.description.trim();
					bVal = itemB.description.trim();
					break;
				case "summary":	// summary
					aVal = itemA.summary ? itemA.summary : "";
					bVal = itemB.summary ? itemB.summary : "";
					break;
				case "path":	// path
					if (this.options.type == "favorites")
					{
						aVal = itemA.clientInfo.properties.LinkToPath;
						bVal = itemB.clientInfo.properties.LinkToPath;
					}
					else
					{
						aVal = itemA.fullPath;
						bVal = itemB.fullPath;
					}
					break;
				case "tags":	// tags
					aVal = itemA.clientInfo.properties.Category ? itemA.clientInfo.properties.Category : "";
					bVal = itemB.clientInfo.properties.Category ? itemB.clientInfo.properties.Category : "";
					break;
				case "lmod":	// lmod
					if (this.options.type == "recents")  
					{
						aVal = itemA.lastaccessOn;
						bVal = itemB.lastaccessOn;
					}
					else
					{
						aVal = itemA.lastModified;
						bVal = itemB.lastModified;
					}
					break;
				case 5:
					break;
				case "fsize":	// size
					aVal = (itemA.container || itemA.type == "PGXBundle") ? 0 : itemA.length;
					bVal = (itemB.container || itemB.type == "PGXBundle") ? 0 : itemB.length;
					break;
				case "publish":	// publish
					aVal = itemA.ownerName ? itemA.ownerName : " "; 
					bVal = itemB.ownerName ? itemB.ownerName : " ";
					break;
				case "show":	// show
					aVal = itemA.clientInfo.properties.hidden ? itemA.clientInfo.properties.hidden : " "; 
					bVal = itemB.clientInfo.properties.hidden ? itemB.clientInfo.properties.hidden : " "; 
					break;
				case "name": // name
					aVal = itemA.name;
					bVal = itemB.name;
					break;
				case "creon":	// creon
					aVal = itemA.createdOn;
					bVal = itemB.createdOn;
					break;
				case "owner":	// owner
					aVal = itemA.ownerName ? itemA.ownerName : ""; 
					bVal = itemB.ownerName ? itemB.ownerName : "";
					break;
				case "app":
					aVal = itemA.application ? itemA.application : ""; 
					bVal = itemB.application ? itemB.application : "";
					break;
				case "domain":
					aVal = itemA.clientInfo.properties.DomainDescription ? itemA.clientInfo.properties.DomainDescription : ""; 
					bVal = itemB.clientInfo.properties.DomainDescription ? itemB.clientInfo.properties.DomainDescription : ""; 
					break;
				case "objtype":
					aVal = itemA.typeDescription;
					bVal = itemB.typeDescription;
					break;
			}
			
			var retVal;
			
/*			if (this.options.caller == "viewAllItems")
			{
				if (direction == 'desc')
					retVal = aVal.localeCompare(bVal)*-1;	//(aVal < bVal ? 1 : aVal > bVal ? -1 : 0);
				else
					retVal = aVal.localeCompare(bVal);	//(aVal < bVal ? -1 : aVal > bVal ? 1 : 0);
				return retVal;
			}
*/			
			if (colId == "lmod")
			{
				if (direction == 'desc')
					retVal = (aVal < bVal ? 1 : aVal > bVal ? -1 : 0);
				else
					retVal = (aVal < bVal ? -1 : aVal > bVal ? 1 : 0);
				
				return retVal;
			}
			
			if (itemA.container == itemB.container || this.options.type == "portals")
			{
				if (typeof aVal == "string")
				{
					aVal = aVal.toLocaleLowerCase();
					bVal = bVal.toLocaleLowerCase();

					if (direction == 'desc')
						retVal = aVal.localeCompare(bVal)*-1;	//(aVal < bVal ? 1 : aVal > bVal ? -1 : 0);
					else
						retVal = aVal.localeCompare(bVal);	//(aVal < bVal ? -1 : aVal > bVal ? 1 : 0);
				}
				else
				{
					if (direction == 'desc')
						retVal = (aVal < bVal ? 1 : aVal > bVal ? -1 : 0);
					else
						retVal = (aVal < bVal ? -1 : aVal > bVal ? 1 : 0);
				}
			}
			else
			{
				if (itemA.container)
				{
					if (direction == 'desc')
						retVal = 1;
					else
						retVal = -1;
				}
				else
				{
					if (direction == 'desc')
						retVal =  -1;
					else
						retVal = 1;
				}
			}
			
			if (colId != "title" && retVal == 0)
			{
				aVal = itemA.description;
				bVal = itemB.description;
				aVal = aVal.toLocaleLowerCase();
				bVal = bVal.toLocaleLowerCase();
				if (direction == 'desc')
					retVal = aVal.localeCompare(bVal)*-1;	//(aVal < bVal ? 1 : aVal > bVal ? -1 : 0);
				else
					retVal = aVal.localeCompare(bVal);	//(aVal < bVal ? -1 : aVal > bVal ? 1 : 0);
			}
			return retVal;
		}
		
		rows = rows.sort(revRow.bind(this));
	
		return rows;
	},
	
	_getColumnNum: function(colId)
	{
		var colMap = this._grid.ibxWidget('option', 'colMap');
		for (var i = 0; i < colMap.length; i++)
		{
			if (colMap[i].identifier == colId)
				return i;
		}
		
		return -1;
	},
	_fixRowColor: function(rows)
	{
		var vis = 0;
		for (var i = 0; i < rows.length; i++)
		{
			var row = $(rows[i]);
			if (row.is(":visible"))
				vis++;
			if (!(vis%2))
				row.css("background", "#e6e6e6");
			else
				row.css("background", "white");
		}
	},
	
	filter: function(data)
	{
		var rows = this._grid.ibxWidget("getRow");
		rows.show();

		for (var df = 0; df < data.length; df++)
		{
			var colId = data[df].colId;
			var matchType = data[df].matchType;
			var text = data[df].text;
			var colMap = this._grid.ibxWidget('option', 'colMap');
			var colNum = -1;
			for (var c = 0; c < colMap.length; c++)
			{
				if (colMap[c].identifier == colId)
				{
					colNum = c;
					break;
				}
			}
	
	
			if (!text)
			{
				this._fixRowColor(rows);
				continue;
			}
			
			var filters = text.toLowerCase().split(',');
	
			for (var fi = 0; fi < filters.length; fi++)
			{
				filters[fi] = filters[fi].trim();
			}
			
			for (var i = 0; i < rows.length; i++)
			{
				var row = $(rows[i]);
				var cell = row.ibxDataGridRow('getCell', colNum);
				cell = $(cell)
				if (colId == "type")
				{
					if (filters[0] == "all")
						continue;
					
					var type;
					switch(filters[0])
					{
						case "mf":
						{
							type = "ibx-icons ds-icon-master";
							break;
						}
						case "ro":
						{
							type = "ibx-icons ds-icon-reporting-object"; 
							break;
						}
					}

					var glyph = cell.ibxWidget('option', 'glyphClasses');
					if (type != glyph)
						row.hide();
				}
				else
				{
					var cellVal = cell.text();
					if (cellVal)
					{
						cellVal = cellVal.toLowerCase();
						
						if (colId != "tags")
						{
							var isMatch = false;
							switch (matchType) 
							{
								case "contains":
								  if (cellVal.indexOf(filters[0]) != -1)
									  isMatch = true;
								  break;
								default:
								  if (cellVal.indexOf(filters[0]) != 0)
									  isMatch = true;
								  break;
							}
							if (!isMatch)
								row.hide();
						}
						else //if (colId == "tags")
						{
							var shouldShow = false;
							for (var f = 0; f < filters.length; f++)
							{
								if (cellVal.indexOf(filters[f]) == 0 || cellVal.indexOf(","+filters[f]) != -1 || cellVal.indexOf(", "+filters[f]) != -1)
								{
									shouldShow = true;
									break;
								}
							}
							if (!shouldShow)
								row.hide();
						}
					}
					else
						row.hide();
				}
			}
		}
		this._fixRowColor(rows);
	},
	
	getSelectedResources: function()
	{
		var selectedItems = this._sm ? this._sm.selected() : [];
		return selectedItems;
	},

	_adjustLastColumnForResize: function(grid)
	{
		this._adjustLastColumn(grid);
	},


	_adjustLastColumn: function(grid, fromSelector, colNum, showColumn)
	{
		$('.dgrid-grid').css('overflow-x', 'auto');

		var colMap = grid.ibxWidget('option', 'colMap');
		var lastVis = 0;
		var totColWidth = 0;
		var gridWidth = grid.width();
		for (var i = 0; i < colMap.length; i++)
		{
			colMap[i].size = this._orgColWidths[i];
		
			if (colMap[i].visible)
			{
				lastVis = i;
				totColWidth += colMap[i].size;
			}
		}
		
		if (totColWidth < gridWidth)
		{
			var inc = gridWidth - totColWidth;
			colMap[lastVis].size += inc;
			$('.dgrid-grid').css('overflow-x', 'hidden');
			totColWidth = gridWidth;
		}

		grid.ibxWidget('option', 'colMap', colMap);
		
		if (this.options.performSort)
		{
			var headers = grid.ibxWidget("getHeaders"); 
			headers.data('sortdir', this.options.sortDir);
			var dirGlyph = (this.options.sortDir == 'desc' ? "fa fa-caret-down" : "fa fa-caret-up");
			$(headers[this._getColumnNum(this.options.sortCol)]).ibxWidget('option', {'glyphClasses': dirGlyph, 'iconPosition': 'right'});
		}

		var rows = grid.ibxWidget("getRow");

		for (var r = 0; r < rows.length; r++)
			$(rows[r]).width(totColWidth-2);
		
        grid.find(".dgrid-grid").dispatchEvent("scroll");

        grid.ibxWidget("getHeaders").on("click", function(grid, e)
		{
			var hdrs = grid.ibxWidget('getHeaders');
			$.each(hdrs, function(idx, hdr)
			{
				$(hdr).ibxWidget('option', 'glyphClasses', "");
				$(hdr).ibxWidget('option', 'iconPosition', 'right');
			});

			var header = $(e.currentTarget); 
			
			var direction = header.data('sortdir');
			if (!direction)
				direction = "desc";
			else if (direction == "desc")
				direction = "asc";
			else
				direction = "desc";

			this.options.sortDir = direction;
			header.data('sortdir', direction);

			header.ibxWidget('option', 'glyphClasses', (direction == "desc" ? 'fa fa-caret-down' : 'fa fa-caret-up'));		
			
			var colInfo = header.data("ibxDataGridCol");
			var colId = colInfo.identifier;
			this.options.sortCol = colId;

			var rows = grid.ibxWidget("getRow");
			grid.ibxWidget("removeAll");

			rows = this._sortRows(colId, direction, rows);

			grid.ibxWidget("addRows", rows);
			this._fixRowColor(rows);
			if (ibxPlatformCheck.isIE)
			{
				this._adjustLastColumnForResize(grid);
			}

			grid.find(".dgrid-grid").dispatchEvent("scroll");
		}.bind(this, grid));
	},
/* original
	_adjustLastColumn: function(grid, fromSelector, colNum, showColumn)
	{
		$('.dgrid-grid').css('overflow-x', 'auto');

		var colMap = grid.ibxWidget('option', 'colMap');
		for (var i = 0; i < colMap.length; i++)
			colMap[i].size = this._orgColWidths[i];
		
		grid.ibxWidget('option', 'colMap', colMap);
		
		
		if (fromSelector)
		{
			colMap[colNum].visible = showColumn;
			grid.ibxWidget('option', 'colMap', colMap);
		}
		
		colMap = grid.ibxWidget('option', 'colMap');
		var lastVis = 0;
		var totColWidth = 0;
		var gridWidth = grid.width();
		for (var c = 0; c < colMap.length; c++)
		{
			if (colMap[c].visible)
			{
				lastVis = c;
				totColWidth += colMap[c].size;
			}
		}

		if (totColWidth < gridWidth)
		{
			var inc = gridWidth - totColWidth;
			colMap[lastVis].size += inc;
			$('.dgrid-grid').css('overflow-x', 'hidden');
		}
		grid.ibxWidget("updateHeaders");
		
		var headers = grid.ibxWidget("getHeaders"); 
		headers.data('sortdir', this.options.sortDir);
		var dirGlyph = (this.options.sortDir == 'desc' ? "fa fa-caret-down" : "fa fa-caret-up");
		$(headers[this._getColumnNum(this.options.sortCol)]).ibxWidget('option', {'glyphClasses': dirGlyph, 'iconPosition': 'right'});

		grid.ibxWidget("getHeaders").on("click", function(grid, e)
		{
			var hdrs = grid.ibxWidget('getHeaders');
			$.each(hdrs, function(idx, hdr)
			{
				$(hdr).ibxWidget('option', 'glyphClasses', "");
				$(hdr).ibxWidget('option', 'iconPosition', 'right');
			});

			var header = $(e.currentTarget); 
			
			var direction = header.data('sortdir');
			if (!direction)
				direction = "desc";
			else if (direction == "desc")
				direction = "asc";
			else
				direction = "desc";

			this.options.sortDir = direction;
			header.data('sortdir', direction);

			header.ibxWidget('option', 'glyphClasses', (direction == "desc" ? 'fa fa-caret-down' : 'fa fa-caret-up'));		
			
			var colInfo = header.data("ibxDataGridCol");
			var colId = colInfo.identifier;
			this.options.sortCol = colId;

			var rows = grid.ibxWidget("getRow");
			grid.ibxWidget("removeAll");

			rows = this._sortRows(colId, direction, rows);

			grid.ibxWidget("addRows", rows);
		}.bind(this, grid));
	},
*/	
	reload: function()
	{
		this._grid.ibxWidget("removeAll");
		if (this.options.children.length > 0)
		{
			var colMap = this._grid.ibxWidget('option', 'colMap');
			this.addRows(this._grid, colMap);		
			var rows = this._grid.ibxWidget("getRow");
			this._grid.ibxWidget("removeAll");
	
			if (this.options.performSort)
				rows = this._sortRows(this.options.sortCol, this.options.sortDir, rows);
	
			this._grid.ibxWidget("addRows", rows);
			this._fixRowColor(rows);
			if (this.options.reselect)
            {
                this.options.reselect = false;
                setTimeout(function()
                {
                    if ($('.output-area').length)
                        $('.output-area-close-button').focus();
                }, 1000);
            }
		}
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
			var row = $(selItems[s]);
			switch(mode)
			{
				case 'remove_favorite':
				case 'remove_recent':
				{
					this._grid.ibxWidget('removeRow', row);
					this.element.closest('.view-all-items').dispatchEvent('decrement_count', 1);
					break;
				}
				case 'unshare':
				{
					var cell = row.ibxDataGridRow('getCell', 0);
					cell.ibxLabel('option', 'overlays', []);
					break;
				}
				case 'share':
				{
					var overlays = [];
					overlays.push({'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'});
					var cell = row.ibxDataGridRow('getCell', 0);
					cell.ibxLabel('option', 'overlays', overlays);
					break;
				}
				case 'delete':
				{
					if (s == 0)	// do only once
					{
						this.element.closest('.view-all-items').dispatchEvent('decrement_count', selItems.length);
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
	},
	
	load: function(startIdx)
	{
		var maxNum = (this.options.initLoad < 0 ? 9999999 : this.options.initLoad);				

		if (this.options.caller != 'viewAllItems')
		{
			// set up flags for displaying Publish/Show columns
			if (this._displayPublish && !this._domainMenus._menuHandlers.isGranted(this.options.parent, "publish"))
				this._displayPublish = false;
			else if (this._displayPublish && !this._domainMenus._menuHandlers.isGranted(this.options.parent, "unpublish"))
				this._displayPublish = false;
	
			if (this._displayShow && !this._domainMenus._menuHandlers.isGranted(this.options.parent, "show"))
				this._displayShow = false;
			else if (this._displayShow && !this._domainMenus._menuHandlers.isGranted(this.options.parent, "hide"))
				this._displayShow = false;
			
			// set up flags for displaying Publish/Show columns
			for (var c = 0; c < this.options.children.length; c++)
			{
				var child = this.options.children[c];
				if (!this._displayPublish && this._domainMenus._menuHandlers.isGranted(child, "publish"))
					this._displayPublish = true;
				else if (!this._displayPublish && this._domainMenus._menuHandlers.isGranted(child, "unpublish"))
					this._displayPublish = true;
				
				if (!this._displayShow && this._domainMenus._menuHandlers.isGranted(child, "show"))
					this._displayShow = true;
				else if (!this._displayShow && this._domainMenus._menuHandlers.isGranted(child, "hide"))
					this._displayShow = true;
			}
		}
		var colMap = [];

		for (var i = 0; i < this._headers.length; i++)
		{
			// set Publish/Show columns to hidden
			if (!this._displayPublish && this._colIdentifiers[i] == "publish")
				this._showCols[i] = false;
			if (!this._displayShow && this._colIdentifiers[i] == "show")
				this._showCols[i] = false;
			
			// reset any type dependent columns
			if (this.options.caller != 'viewAllItems'  && this._colIdentifiers[i] == "path")
				this._showCols[i] = false;

//			if (this.options.type != "myWorkspace" && this.options.type != "sharedWithMe" && this._colIdentifiers[i] == "domain")
//				this._showCols[i] = false;

//			if (this.options.type != "datasource" && this._colIdentifiers[i] == "app")
//				this._showCols[i] = false;

			if (this.options.optimize)
			{
				if (this._showCols[i] == true)
					colMap.push({"identifier": this._colIdentifiers[i], "title": this._headers[i], "size": this._colWidths[i], 'visible': 
								this._showCols[i], 'resizable': (this.options.resizableColumns ? this._resizeCols[i] : false), 'justify': 'start'});
			}
			else
				colMap.push({"identifier": this._colIdentifiers[i], "title": this._headers[i], "size": this._colWidths[i], 'visible': 
							this._showCols[i], 'resizable': (this.options.resizableColumns ? this._resizeCols[i] : false), 'justify': 'start'});
		}
		
		var grid = $('<div class="home-content-grid">').ibxDataGrid({'rowSelect': true});
		
		this._grid = grid;
		if (!this.options.children.length)
		{
			this.element.dispatchEvent('list_done_loading');
			return;
		}

		this._sm = grid.ibxWidget('getSelectionManager');
		this._sm.option({"rubberBand":false, "rubberBandPartialSelect":false});

		if (this.options.selType != "multi")
		{
			grid.ibxWidget("option", 'selType', this.options.selType);
//			this._sm.option({"rubberBand":false, "rubberBandPartialSelect":false});
		}
//		else
//		{
//			
//			if(window.innerWidth < 851)
//			{
//				this._sm.option({"rubberBand":false, "rubberBandPartialSelect":false});
//
//			}
//			else
//			{
//				this._sm.option({"rubberBand":true, "rubberBandPartialSelect":true});
//
//			}
//		}
		grid = grid.ibxWidget("option",
		{
			"colMap":colMap,
			"showColumnHeaders":true,
			"showRowHeaders":false,
			"defaultColConfig":{"resizable":true}
		});
		grid.on('ibx_selchange', function(e)
		{
			if (e.originalEvent.data.selected)
			{
				var row = $(e.originalEvent.data.items[0]);
				var item = row.data('item');
				$('.cbox-file-box').dispatchEvent('ITEM_SELECTED', {"item": item});
				this.element.dispatchEvent('grid_click', item);
			}
		}.bind(this));
		
		if (!this.options.noDblClick)
		{
			grid.on('dblclick', function(e)
			{
				this.dblClickHandle(e);
				e.stopPropagation();
			}.bind(this));
		}
		else
		{
			grid.on('dblclick', function(e)
			{
				this.element.dispatchEvent('grid_dblclick');
				e.stopPropagation();
			}.bind(this));
		}

		grid.on('clickx', function(e)
		{
			var row = $(e.target).closest('.ibx-data-grid-row')
			row = row[0];
			var selRows = this._sm.selected();
			for (var r = 0; r < rows.length; r++)
			{
				if (row == selRows[r])
				{
					this._sm.deselectAll();
					this._sm.selected(row, true);
				}
			}
		}.bind(this));
		
		grid.on('keydown', function(e)
		{
			if(e.keyCode == $.ui.keyCode.ENTER)
			{
				var row = $(e.target).closest('.ibx-data-grid-row')
				var item = row.data('item');
				if (item && item.container)
				{
					this._curPath = item.fullPath;	
					this.element.dispatchEvent('chg_curpath_descend', item);
					$('.home-tree').dispatchEvent('chg_curpath_descend', item);
					e.stopPropagation();
				}
			}
		}.bind(this));

		grid.on('ibx_ctxmenu', function(e)
		{
			if (this.options.type == "datasource")
				return;
			
			var selectedItems = this._sm.selected();
			// HOME-2430: right-click on column header
			if (!selectedItems.length)
				return;
			if ($(e.target).closest('.dgrid-header-col').length)
				return;

			if (selectedItems.length == 1)
			{
				var row = $(e.target).closest('.ibx-data-grid-row');
				var cell = $(e.target).closest('.dgrid-cell');
				var item = row.data('item');
				
				var menu = (item.container ? this._domainMenus.folderMenu(null, item, null, 'domainBoth') : this._domainMenus.fileMenu(null, item, null, 'domainBoth'));
				menu = $(menu);
				e.menu = menu;
				e.stopPropagation();
			}
			else
			{
				var multi_menu = this._domainMenus.folderMenu(null, item);
				var jqMultiMenu = $(multi_menu);
				if (multi_menu)
					e.menu = jqMultiMenu;
				else
					e.menu = null;
			}
		}.bind(this));
		
		this.element.on('colSelector_list', function(grid, e)
		{
			var colSelector = e.originalEvent.data.btnDiv;
			colSelector.prop('title', ibx.resourceMgr.getString("hpreboot_choose_columns"));
			colSelector.data('colHeaders', this._headers);
			colSelector.data('showCols', this._showCols);

			var options = 
			{
				my: "right top",
				at: "left+10px bottom+4px",
				collision: "fit",
				of: colSelector,
				effect: "scale"
			};
			var colMenu = $("<div class='home-col-selector-menu'>").ibxMenu({'position':options, 'multiSelect': false}).data('colSelector', colSelector);
			var showCols = colSelector.data('showCols');
			var headers = colSelector.data('colHeaders');
			for (var i = 0; i < showCols.length; i++)
			{
				if (this.options.type == "favorites")
				{
					if (this._colIdentifiers[i] == "fsize" || this._colIdentifiers[i] == "name"	|| this._colIdentifiers[i] == "domain")
						continue;
				}
				else if (this.options.type == "gettingStarted" && this._colIdentifiers[i] == "domain")
				{
					continue
				}
				
				var mi = $("<div class='wf-check-square'>").ibxMenuItem({'labelOptions': {'text': headers[i]}}).data('colMenu', colMenu);
				if (showCols[i])
					mi.ibxWidget({'labelOptions': {'glyphClasses': 'fas fa-check-square'}});
				
				mi.on('click', function(colSelector, mi, colNum, grid, e)
				{
					var showCols = colSelector.data('showCols');
					showCols[colNum] = !showCols[colNum];
					if (showCols[colNum])
						mi.ibxWidget({'labelOptions': {'glyphClasses': 'fas fa-check-square'}});
					else
						mi.ibxWidget({'labelOptions': {'glyphClasses': ''}});
					
					grid.ibxWidget('showColumn', colNum, showCols[colNum]);
					
					this._adjustLastColumn(grid, true, colNum, showCols[colNum]);
					if (ibxPlatformCheck.isIE)
					{
						this._adjustLastColumnForResize(grid);
						grid.css('height', '100%');
					}

			        grid.find(".dgrid-grid").dispatchEvent("scroll");
			        
				}.bind(this, colSelector, mi, i, grid));
				
				colMenu.ibxWidget("add", mi);
			}
			
			colMenu.ibxWidget('open');
			
		}.bind(this, grid));
		
		this.element.ibxWidget('add', grid);

		var start = new Date().getTime();
		this.addRows(grid, colMap, startIdx, maxNum);
		if (maxNum < this.options.children.length)
		{
			this._loadingHandle = setInterval(function()
			{
				this.addRows(grid, colMap, maxNum, maxNum + this.options.secondaryLoad);
				maxNum += this.options.secondaryLoad;
				if (maxNum >= this.options.children.length)
				{
					var rows = grid.ibxWidget("getRow");
					grid.ibxWidget("removeAll");

//					if (this.options.performSort)
//						rows = this._sortRows(this.options.sortCol, this.options.sortDir, rows);

					grid.ibxWidget("addRows", rows);
					this.element.dispatchEvent('list_done_loading');
					clearInterval(this._loadingHandle);
				}
			}.bind(this), 100);	
		}
		else
		{
			var rows = grid.ibxWidget("getRow");
			grid.ibxWidget("removeAll");

			if (this.options.performSort)
				rows = this._sortRows(this.options.sortCol, this.options.sortDir, rows);

			grid.ibxWidget("addRows", rows);
			this._fixRowColor(rows);
			this.element.dispatchEvent('list_done_loading');
		}

		this._adjustLastColumn(grid);

		if (ibxPlatformCheck.isIE)
			$('.ibx-data-grid').css('height', '100%');


		var end = new Date().getTime();
	},
	
	dblClickHandle: function(e)
	{
		var selectedItems = this._sm.selected();
		if (selectedItems.length >= 1)
		{	
			var item = $(selectedItems[0]).data('item');
			if (this.options.type == 'datasource')
			{				
				if (item.container && item.type != "PGXBundle")
				{
					this.element.dispatchEvent('dblclick_navigate', item);
					this.element.dispatchEvent('folder_dblclick', item);
				}
				else
				{
					this.element.dispatchEvent('grid_dblclick');
				}
			}
			else if (item.container && item.type != "BipPortalsPortal" && item.type != "PRTLXBundle")
			{
				this._curPath = item.fullPath;	
				this.element.dispatchEvent('chg_curpath_descend', item);
				$('.home-tree').dispatchEvent('chg_curpath_descend', item);
			}
			else
			{
				this._sm.deselectAll();
				var row = $(e.target).closest('.ibx-data-grid-row')
				this._sm.selected(row, true);
				 if (this.options.type == "recents")
	                this.element.dispatchEvent('recent-dblclick');
				this._domainMenus._menuHandlers.dblClick(item);
			}
		}
	},
	
	setTags: function(tags)
	{
		this._tags = tags;
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

	setSelected: function(selItems)
	{
		var rows = this._grid.ibxWidget("getRow");
		var selPath;
		var rowPath;

		for (var i = 0; i < selItems.length; i++)
		{
			selPath = selItems[i].data('item').fullPath;
			for (var r = 0; r < rows.length; r++)
			{
				rowPath = $(rows[r]).data('item').fullPath;
				if (rowPath == selPath)
				{
					this._sm.selected(rows[r], true);
				}
			}
		}
	},
	
	createRow: function(grid, rowData)
	{
		if (rowData.type == 'PGXBundle' || rowData.type === 'BipPortalsPortal')	// || rowData.type == 'PRTLXBundle')
			rowData.container = false;
		if (rowData.container === undefined)
			rowData.container = false;
		
		var cols = [];
		var text;
		var tileTitle;
		var colMap = this._grid.ibxWidget('option', 'colMap');
		for(var j = 0; j < colMap.length; ++j)
		{
			var id = colMap[j].identifier;
			switch (id)
			{
				case "type":
					var glyph = "ibx-icons ds-icon-unknown";	
					if(rowData.altglyph)
						glyph = rowData.altglyph;			
					else if(rowData.clientInfo && rowData.clientInfo.typeInfo)				
						glyph = rowData.clientInfo.typeInfo.glyphClasses;			
					
					if (rowData.container)
					{	
						if (rowData.type == "MRFolder" || rowData.type == "MyReportFolder")
							text = "fa fa-folder";
						else if (rowData.type == "PRTLXBundle")
							text = "ibx-icons ds-icon-portal";
						else if (glyph)
							text = glyph;
					}
					else if (rowData.type == "LinkItem")
					{
						if (rowData.clientInfo.properties.LinkToContainer == "TRUE")
						{
							if (rowData.clientInfo.properties.LinkToObjType == "PRTLXBundle")
								text = "ibx-icons ds-icon-portal";
							else
								text = "fa fa-folder";
						}
						else
						{
							switch(rowData.extension)
							{
								case "mas":
								{
									text = "ibx-icons ds-icon-master";
									break;
								}
								case "fex":
								{
									if (rowData.clientInfo.properties.LinkToObjType == "ROFexFile")
										text = "ibx-icons ds-icon-reporting-object";
									else
									{
										var oProps = rowData.clientInfo.properties;
										var tool = oProps.tool;
										if (oProps.EnhancedRun && oProps.EnhancedRun == "on")
											text = "ibx-icons ds-icon-tap";
										else if (tool)
										{
											if(tool.indexOf("DataVis") != -1)
												text = "ibx-icons ds-icon-visualization-1";
											else
												text = "ibx-icons ds-icon-document";
/*											
											if(tool.indexOf("infoMiniEnable") != -1)
												text = "ibx-icons ds-icon-document";
											else if(tool.indexOf("chart") != -1)
												text = "ibx-icons ds-icon-chart-bar";
											else if(tool.indexOf("compose") != -1)
												text = "ibx-icons ds-icon-document";
											else if(tool.indexOf("alert") != -1)
												text = "ibx-icons ds-icon-document";
											else if(tool.indexOf("editor") != -1)
												text = "ibx-icons ds-icon-document";
											else if(tool.indexOf("DataVis") != -1)
												text = "ibx-icons ds-icon-visualization-1";
											else if(tool.indexOf("DataPrep") != -1)
												text = "ibx-icons ds-icon-document";
											else if(tool.indexOf("report") != -1)
												text = "ibx-icons ds-icon-document";
											else
												text = "ibx-icons ds-icon-document";
*/												
										}
										else
											text = "ibx-icons ds-icon-document";
									}
									break;
								}
								default:
									text = glyph;
							}
						}
					}
					else
						text = glyph;
					break;
				case "title":	// title
					text = rowData.description ? rowData.description.trim() : "";
					if (text && text.indexOf('.') != -1 && this.options.type != 'impexp')
						text = text.split('.')[0];
					if (!text && this.options.fillMissingTitle)
						text = rowData.name.split('.')[0]
					break;
				case "summary":	// summary
					text = rowData.summary ? rowData.summary.trim() : "";
					break;
				case "path":	// path
					if (rowData.fullPath.indexOf('/WFC/') != -1)
					{
						var fp;
						if (this.options.type == "favorites")
						{
							fp = rowData.clientInfo.properties.LinkToPath;
							text = fp.substring(21, fp.lastIndexOf('/'));
						}
						else
						{
							fp = rowData.fullPath;
							text = fp.substring(21, fp.length - rowData.name.length-1);
						}
					}
					else
						text = rowData.fullPath.substring(5);
					break;
				case "tags":	// tags
					text = rowData.type == "LinkItem" ? rowData.clientInfo.properties.LinkToCategory : rowData.clientInfo.properties.Category;
					break;
				case "domain":	// domain description
					text = rowData.clientInfo.properties.DomainDescription;
					break;
				case "lmod":	// lmod
					var d;
					var lmod = (this.options.type == "recents" ? rowData.lastaccessOn : rowData.lastModified);
					if (lmod)
					{
						if (typeof lmod == 'string' && lmod.indexOf('Z') != -1 && lmod.indexOf('T') != -1)
							d = new Date(lmod);
						else
							d = new Date(parseInt(lmod, 10));

						text = d.toLocaleDateString(ibx.resourceMgr.language) + "  " + d.toLocaleTimeString(ibx.resourceMgr.language);
					}
					else
						text = " - ";
					break;
				case "objtype":	// object type
					text = (rowData.type == "LinkItem" ? rowData.clientInfo.properties.LinkToObjType : rowData.typeDescription);
					break;
				case "fsize":	// size
					text = '-';
					if(rowData.length && rowData.length > 0)
						text = this._bytesToSize(rowData.length);
					break;
				case "publish":	// publish
					text = "";
					break;
				case "show":	// show
					text = "";
					break;
				case "name": // name
					text = rowData.name;
					break;
				case "creon":	// creon
					var d;
					var creon = rowData.createdOn;
					if (creon)
					{
						if (typeof creon == 'string' && creon.indexOf('Z') != -1 && creon.indexOf('T') != -1)
							d = new Date(lmod);
						else
							d = new Date(parseInt(creon, 10));

						text = d.toLocaleDateString(ibx.resourceMgr.language) + "  " + d.toLocaleTimeString(ibx.resourceMgr.language);
					}
					else
						text = " - ";
					break;
				case "owner":	// owner
					text = rowData.ownerName ? rowData.ownerName : "";
					break;
				case "app":
					text = rowData.application ? rowData.application : "";
					break;
			}
			
			if (text && typeof text == 'string')
				text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
			var cell;
			switch(id)
			{
				case "type":
				{
					var overlays = [];
					cell = $("<div style='user-select:none;'>").ibxLabel({'glyphClasses': text});
					cell.prop('title', rowData.type);
					
					if (rowData.type === "LinkItem")
						overlays.push({'position':'bl','glyphClasses':'home-item-overlay ds-icon-shortcut'});
					
					if(rowData.sharedToOthers)
						overlays.push({'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'});

					if (rowData.actions.indexOf('unsubscribe') != -1)
						overlays.push({'position':'ur','glyphClasses':'home-item-overlay fas fa-circle'});

					if (overlays.length)
						cell.ibxLabel('option', 'overlays', overlays);

//					var ttext = (rowData.type == "LinkItem" ? rowData.clientInfo.properties.LinkToObjType : rowData.typeDescription);
//					ttext = "&nbsp;-&nbsp;" + ttext;
//					cell.ibxLabel('option', {'text': ttext, 'textIsHtml': true});
					if (rowData.type == "IBFSFolder")
					{
						cell.ibxAddClass('rs-folder');
						cell.ibxWidget('option', 'glyphClasses', "");
						cell.ibxWidget('option', 'icon', rowData.clientInfo.typeInfo.icon);
					}
					else
					{
						if (this.options.type == "datasource")
							cell.css('font-size', '14px');
					}
					
					if (this.options.type == "datasource")
					{
						var title;
						switch(rowData.type)
						{
							case "ROFexFile":
							{
								title = ibx.resourceMgr.getString('dataselect_filter_type_ro');
								break;
							}
							case "LinkItem":
							case "FexFile":
							{
								title = ibx.resourceMgr.getString('dataselect_filter_type_mf');
								break;
							}
							case "IBFSFolder":
							{
								title = ibx.resourceMgr.getString('dataselect_filter_type_appdir');
								break;
							}
							case "MRFolder":
							{
								title = ibx.resourceMgr.getString('dataselect_filter_type_reposdir');
								break;
							}
						}
						cell.prop('title', title);
					}
					break;
				}
				case "title":	// title
				{
					cell = $(sformat("<div style='user-select:none; display: inline=block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis'>{1}</div>", text));
					if (this.options.type != 'favorites' && rowData.ownerName && rowData.type != 'MyReportFolder')
						cell.ibxAddClass('home-cell-private');
						
					if (rowData.clientInfo.properties.hidden)
						cell.ibxAddClass('home-content-hidden');
					
					cell.prop('title',text);
					tileTitle = text;
					break;
				}
				case "summary":
				{
					cell = $(sformat("<div style='user-select:none; display: inline=block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis'>{1}</div>", text));
					cell.prop('title', text);
					break;
				}
				case "tags":
				{
					if (text)
						cell = $(sformat("<div style='user-select:none; display: inline=block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis'>{1}</div>", text));
					else
						cell = $(sformat("<div style='user-select:none; display: inline=block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis'>{1}</div>", ""));
					break;
					cell.prop('title', text);
				}
				case "publish":
				{
					if (!rowData.ownerName)
						cell = $("<div class='wf-check-square'><span class='fas fa-check-square'></span></div>");
					else
						cell = $("<div style='user-select:none;'></div>");
					break;
				}
				case "show":
				{
					if (!rowData.clientInfo.properties.hidden)
						cell = $("<div class='wf-check-square'><span class='fas fa-check-square'></span></div>");
					else
						cell = $("<div style='user-select:none;'></div>");
					break;
				}
				case "path":
				{
					cell = $(sformat("<div style='user-select:none; display: inline=block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis'>{1}</div>", text));
					cell.prop('title', text);
					break;						
				}
				default:
				{
					cell = $(sformat("<div style='user-select:none; display: inline=block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis'>{1}</div>", text));
					cell.prop('title', text);
					break;
				}
			}

			cols.push(cell[0]);
		}
		var row = $("<div>").ibxDataGridRow().ibxAddClass('home-grid-row');
		row.data('item', rowData);
		row.append(cols);
		row.attr("data-ibfs-path", rowData.fullPath);
		row.on('focus', function(e)
		{
			this.createTitle(e);
			var counter = row.attr('aria-row-counter');
			if(counter == null || counter != '0')
			{
				row.attr('aria-row-counter', '0');
			}
		}.bind(this));
		row.on('blur', function(e)
		{
			var row = $(e.target);
			row.removeAttr("aria-label");
			row.attr('aria-row-counter', '0');
		}.bind(this));
		
		row.on('keydown', function(r, e)
		{
			if(e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE)
			{
				var row = r;
				var item = row.data('item');
				if(row.hasClass('ibx-sm-selected'))
				{
					var counter = row.attr('aria-row-counter');
					if(counter == '0')
					{
						row.attr('aria-row-counter', '1');
						row.attr('aria-selected', 'false');
						var ariaText = "";
						ariaText = ariaText.concat(tileTitle, " ", ibx.resourceMgr.getString('hpreboot_row_selected'));
						this.element.dispatchEvent('add-alert', {"ariatext": ariaText});
					}
					else
					{
						this.dblClickHandle(e);
					}
				}
			}
		}.bind(this, row));
		
		return row;
	},
	
	createTitle: function(e)
	{
		var showLength = this._showCols.length;
		var row = $(e.target);
		var rowTitle = ibx.resourceMgr.getString("hpreboot_row"); // "Row = {" 
		for(var i = 0; i < showLength; ++i)
		{
		    var cellTitle = "";
			            
            if(this._showCols[i])
            {
            	var clnName = this._headers[i];
                cellTitle = cellTitle.concat(clnName, " ");
                
                var cells = row.children();
        		var cell = cells[i];
                var cellvalue =  "";
                if (WFGlobals.isFeatureEnabled("UserFriendlyObjectTypeStrings"))
                {
	                if (this._colIdentifiers[i] == 'type')
	                {
	                	var gc = $(cell).ibxWidget('option', 'glyphClasses');
	                	var idx = 1;
	                	if (gc.charAt(0) == ' ')
	                		idx = 2;
	                	cellvalue = rebootUtil.glpyhToAnnouncement(gc.split(' ')[idx], row.data('item'));
	                }
	                else
	                	cellvalue = cell.title;
                }
                else
                	cellvalue = cell.title;
                	
                if(cellvalue == null || cellvalue.length < 1)
                {
                	cellvalue =  cell.outerText;
                	if(cellvalue == null || cellvalue.length < 1)
                    {
                		continue;
                    }
                }
                if(i != 0)
    			{
    				rowTitle = rowTitle.concat(", ");
    			}
                else
                {
                	rowTitle = rowTitle.concat(" = {");
                }
                cellTitle = cellTitle.concat(cellvalue);
                rowTitle = rowTitle.concat(cellTitle);
            }
            
		}
        rowTitle = rowTitle.concat("}");
        row.attr("aria-label", rowTitle);
	},
	
	getNumChildren: function()
	{
		return this.options.children.length;
	},
	
	addRows: function(grid, colMap, startIdx, maxNum)
	{
		if (typeof startIdx == "undefined")
			startIdx = 0;

		if (typeof maxNum == "undefined")
			maxNum = this.options.children.length;
		else
		{
			if (maxNum > this.options.children.length)
				maxNum = this.options.children.length;
		}
		var rows = [];
		var children = this.options.children;
		var children = children;
		var start = new Date().getTime();
		var numRows = 0;
		for(var i = startIdx; i < maxNum; ++i)
		{
			var rowData = children[i];
			if (this.options.dynamic && rowData.container && rowData.type != "PGXBundle" && rowData.type != "PRTLXBundle")
				continue;
			var row = this.createRow(grid, rowData);
			rows.push(row);
			numRows++;
		}

		grid.ibxWidget("addRows", rows, null, null);

		if (this.options.type == 'favorites')
		{
			for (var i =0; i < this._colIdentifiers.length; i++)
			{
				if (this._colIdentifiers[i] == "creon")
				{
					colMap[i].visible = true;
					this._showCols[i] = true;
					break;
				}
			}
			grid.ibxWidget('option', 'colMap', colMap);
		}

		var end = new Date().getTime();

		if (this.options.performSort)
		{
			var headers = grid.ibxWidget("getHeaders"); 
			headers.data('sortdir', this.options.sortDir);
			var dirGlyph = (this.options.sortDir == 'desc' ? "fa fa-caret-down" : "fa fa-caret-up");
			$(headers[this._getColumnNum(this.options.sortCol)]).ibxWidget('option', {'glyphClasses': dirGlyph, 'iconPosition': 'right'});
		}
		
			var curbgclr;
			var curotln;
			
			this.element.find('.dgrid-row').hover(function(e){curbgclr = $(this).css('background-color'); curotln = $(this).css('outline');$(this).css({'background-color': '#f7f8fe', 'outline': '0'})}, 
												  function(e){$(this).css({'background-color': curbgclr, 'outline': curotln})});
			this.element.find('.dgrid-row').focus(function(e){curbgclr = $(this).css('background-color'); curotln = $(this).css('outline');$(this).css({'background-color': '#f7f8fe', 'outline': '0'})}); 
			this.element.find('.dgrid-row').blur(function(e){$(this).css({'background-color': curbgclr, 'outline': curotln})});
	},
});

//# sourceURL=homeListContents.js