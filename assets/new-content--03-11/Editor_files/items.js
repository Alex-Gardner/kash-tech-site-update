/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.107 $:

function Items()
{
	
	this.itemList = [];
	this.folderList = [];
	this.itemListDefault = [];
	this.folderListDefault = [];
	this.saveItemList = [];
	this.saveFolderList = [];
	this.allFolders = [];
	this.sortedValue =	"default";
	this.sortedValueType = "alpha";
	this.sortedOrder = "up";
	this.multiSelectAllowed = true;
	this.propertiesSet = null;
	this.appPath = "";
	this.appPathList = [];
	this.fileTypesList = [];
	this.categoryList = [];
	this.categorySel = [];
	this.domainList = [];
	this.autogenList = [ibx.resourceMgr.getString("home_shared"), ibx.resourceMgr.getString("home_personal")];
	this.autogenSel = [false, false];
	this.haveMyContent = false;
	this.otherString = ibx.resourceMgr.getString("home_other");
	if(this.otherString == "")this.otherString = "Other";
	this.showExtraColumnsOnRoot = false;
	this.deferSelectedItemPath = "";
	this.userName = "";
	
	//this.this = this;
}
	var protoItems = Items.prototype;	
	
	protoItems.clearItems = function()
	{
		this.itemList.length=0;		
		this.folderList.length=0;
		this.itemListDefault.length=0;		
		this.folderListDefault.length=0;
		this.categoryList.length = 0;
		this.categorySel.length = 0;
		this.domainList.length =0;
		this.autogenSel[0] = false;
		this.autogenSel[1] = false;
		this.haveMyContent = false;
	};
	protoItems.getItemList = function()
	{
		return this.itemList;
	};
	protoItems.setUserName = function(userName)
	{
		this.userName = userName;
	};
	protoItems.getCategoryList = function(bDomains)
	{
		var carray = [];
		if(this.userName.length > 0)
		{			
			// any my content folders?
			var ilen=this.folderList.length;				
			if(ilen > 0)
			{
				for (var i=0; i < ilen; i++)
				{	
					var ibfsitem=this.folderList[i];
					if(ibfsitem.inMyContent)
					{
						this.haveMyContent = true;
						break;
					}
				}
			}
			var ilen=this.itemList.length;				
			if(ilen > 0)
			{
				for (var i=0; i < ilen; i++)
				{	
					var ibfsitem=this.itemList[i];
					if(ibfsitem.inMyContent)
					{
						this.haveMyContent = true;
						break;
					}
				}
			}
			if(this.haveMyContent)
			{
				// is everything in my content?
				var notMyContent = false;
				var iShared = false;
				var iMyContent = false;
				var ilen=this.itemList.length;				
				if(ilen > 0)
				{
					for (var i=0; i < ilen; i++)
					{	
						var ibfsitem=this.itemList[i];
						// shared
						if(ibfsitem.inMyContent && ibfsitem.ownerName != this.userName)
							iShared = true;
						// mycontent
						if(ibfsitem.inMyContent && ibfsitem.ownerName == this.userName)
							iMyContent = true;					
						if(!ibfsitem.inMyContent)
						{
							notMyContent = true;
							break;
						}
					}
				}
				if(!notMyContent && (!iShared || !iMyContent) )
					this.haveMyContent = false;
			}	
			if(this.haveMyContent)
			{
				for(var i = 0; i < this.autogenList.length; i++)
				{	
					var row = [];
					row.push(this.autogenList[i]);
					row.push(this.autogenSel[i]);
					row.push(false);
					row.push(false);
					row.push(i + 1);
					carray.push(row);
				}
			}	
		}
		if(bDomains)
		{
			if(this.domainList.length > 0)
			{
				this.domainList.sort();
				for(var i = 0; i < this.domainList.length; i++)
				{	
					var row = [];				
					if (this.domainList[i] == 'Domains')
						continue;
					
					row.push(this.domainList[i]);
					row.push(this.categorySel[i]);
					row.push(false);
					row.push(true);
					row.push(0);
					carray.push(row);	
				}
			}	
		}
		else
			this.domainList.length = 0;
		
		var len = this.categoryList.length;		
		if(len > 1)
		{			
			this.categoryList.sort();						
			var other = this.categoryList.indexOf(this.otherString);
			if(other >  -1 && other != len - 1)
			{
				this.categoryList.splice(other,1);
				this.categoryList.push(this.otherString);		
			}
			var j = bDomains ? this.domainList.length : 0;
			for(var i = 0; i < this.categoryList.length; i++)
			{   
				var row = [];				
				row.push(this.categoryList[i]);
				row.push(this.categorySel[i + j]);
				row.push(this.categoryList[i] == this.otherString);
				row.push(false);
				row.push(0);
				carray.push(row);			
			}	
		}		
		return carray;
	};
	protoItems.categorySelToggle = function(e, index, mode)
	{
		if(mode == 0)
		{	
			var currVal = true;
			if(index >= 0)
			{
				var xindex = index;
				// account for shared and personal...
				if(this.haveMyContent)xindex = xindex - 2;
				this.categorySel[xindex] = !this.categorySel[xindex];
				currVal = this.categorySel[xindex];				
			}	
			else
			{	
				// shared and personal have a negative index... 
				var xindex = -(index + 1);
				this.autogenSel[xindex] = !this.autogenSel[xindex];
				currVal = this.autogenSel[xindex];
			}	
			
			if(currVal)
			{	
				e.removeClass("sd-category-button-toggle-off");
				e.ibxButton("option", "glyphClasses", "fa fa-check");
			}	
			else
			{	
				e.addClass("sd-category-button-toggle-off");
				e.ibxButton("option", "glyphClasses", "");
			}
		}
		else this.updateTiles();
	};
	protoItems.updateTiles = function()
	{
		// apply the category and domain selection buttons...
		var categoryHideShow = false;
		var dLen = this.domainList.length;
		for(var i = dLen; i < this.categorySel.length; i ++)
		{
			if(this.categorySel[i])
			{	
				categoryHideShow = true;
				break;
			}	
		}
		var domainHideShow = false;
		for (var i = 0; i < dLen; i++)
		{
			if(this.categorySel[i])
			{	
				domainHideShow = true;
				break;
			}	
		}
		var autogenHideShow = false;
		for (var i = 0; i < this.autogenList.length; i++)
		{
			if(this.autogenSel[i])
			{
				autogenHideShow = true;
				break;
			}
		}	
		
		// update the tiles....
		var ilen=this.folderList.length;				
		if(ilen > 0)
		{
			for (var i=0; i < ilen; i++)
			{	
				var ibfsitem=this.folderList[i];	
				if(ibfsitem.jqObject)ibfsitem.jqObject.hide();
				if(ibfsitem.jqObject_grid)ibfsitem.jqObject_grid.hide();
			}
			for (var i=0; i < ilen; i++)
			{	
				var ibfsitem=this.folderList[i];				
				var dLen = this.domainList.length;
				var dshow = true;
				if(dLen > 0 && domainHideShow)
				{					
					if(ibfsitem.parentDescription && ibfsitem.parentDescription.length > 0)
					{
						var j = this.domainList.indexOf(ibfsitem.parentDescription);
						if(j > -1)
						{
							dshow = this.categorySel[j];
						}	
					}					
				}
				if(dshow)
				{
					if(ibfsitem.jqObject)ibfsitem.jqObject.show();
					if(ibfsitem.jqObject_grid)ibfsitem.jqObject_grid.show();
				}
			}	
		}		
		var ilen=this.itemList.length;		
		if(ilen > 0)			
		{
			for (var i = 0; i < ilen; i++)				
			{	
				var ibfsitem=this.itemList[i];
				if(ibfsitem.jqObject)ibfsitem.jqObject.hide();
				if(ibfsitem.jqObject_grid)ibfsitem.jqObject_grid.hide();
			}
			for (var i = 0; i < ilen; i++)
			{	
				var show = true;
				var dshow = true;
				var ibfsitem=this.itemList[i];
				var dLen = this.domainList.length;
				
				if(dLen > 0 && domainHideShow)
				{
					if(ibfsitem.parentDescription.length > 0)
					{
						var j = this.domainList.indexOf(ibfsitem.parentDescription);
						if(j > -1)
						{
							dshow = this.categorySel[j];
						}	
					}
					else
						dshow = false;
				}
				var dLen = this.domainList.length;
				if(this.categoryList.length > 1)
				{	
					var category = [];
					if(ibfsitem.clientInfo && ibfsitem.clientInfo.properties && ibfsitem.clientInfo.properties.Category)
						category = String(ibfsitem.clientInfo.properties.Category).split(",");
					else if(ibfsitem.properties && ibfsitem.properties.Category)
						category = String(ibfsitem.properties.Category).split(",");
					else if(ibfsitem.clientInfo && ibfsitem.clientInfo.properties && ibfsitem.clientInfo.properties.LinkToCategory)
						category = String(ibfsitem.clientInfo.properties.LinkToCategory).split(",");					
					else
						category[0]=this.otherString;				
					for(var j = 0; j < category.length; j++)
					{
						var cat = category[j].trim();
						var catf = this.categoryList.indexOf(cat);
						if(catf == -1)
							show=false;
						else 
						{	
							show = this.categorySel[catf + dLen];
							if(show)break;
						}	
					}
				}
				var ashow = false;
				if(autogenHideShow)
				{
					// shared
					if(this.autogenSel[0] && ibfsitem.inMyContent && ibfsitem.ownerName != this.userName)
						ashow = true;
					// mycontent
					if(this.autogenSel[1] && ibfsitem.inMyContent && ibfsitem.ownerName == this.userName)
						ashow = true;
				}	
				// determine if we want to show this item...
				var doShow = false;
				if(!categoryHideShow && !domainHideShow && !autogenHideShow)
					doShow = true;
				else
				{	
					if(domainHideShow)
					{
						if(dshow && (!categoryHideShow || show) && (!autogenHideShow || ashow) )
							doShow = true;
					}
					else 
					{
						if((!categoryHideShow || show) && (!autogenHideShow || ashow) )
							doShow = true;
					}	
				}	
				
				if(doShow)
				{	
					if(ibfsitem.jqObject)ibfsitem.jqObject.show();
					if(ibfsitem.jqObject_grid)ibfsitem.jqObject_grid.show();
				}				
			}	
		}	
	};
	
	protoItems.endsWithx = function(input, str) 
	{
		return (input.match(str+"$")==str);
	};	
	protoItems.getFolderList = function()
	{
		return this.folderList;
	};
	protoItems.setFileTypesList = function(fileTypes)
	{
		this.fileTypesList = fileTypes;
	};
	protoItems.getShowExtraColumnsOnRoot = function()
	{
		return this.showExtraColumnsOnRoot;
	};
	protoItems.setAppPath = function(appPath)
	{
		this.appPath = appPath;
		if(this.appPath.length > 0)
			this.appPathList = appPath.split(" ");
	};
	protoItems.addItem = function(item)
	{
		if(item.type == "PRTLXBundle")
		{
			// add portals to global folder storage...
			this.allFoldersAdd(item);
		}
		if(item.type == "LinkItem")
		{
			// a link.. perhaps this is a link to a folder?
			if(item.clientInfo.properties.LinkToContainer == "TRUE" && item.clientInfo.properties.LinkToObjType != "PRTLXBundle")
			{	
				this.addFolderItem(item);
				return;
			}	
			else
			{
				if(item.clientInfo.typeInfo)
				{	
					glyph = item.clientInfo.typeInfo.glyphClasses;
					if(glyph.indexOf("unknown") > -1)
					{
						if(item.extension == "mas")
							item.clientInfo.typeInfo.glyphClasses = "ibx-icons ds-icon-master";
					}	
				}			
			}
		}
		addFlag = true;
		var len = this.fileTypesList.length;
		var extension = item.extension;
		if(len > 0)
		{			
			if(!extension)
			{	
				if(item.type == "PGXBundle" || (item.type == "LinkItem" && item.clientInfo.properties.LinkToObjType == "PGXBundle"))
				{	
					extension = "pgx";					
				}	
				else
				{
					if(item.name && typeof(item.name) == "string")
					{
						var parts = item.name.split(".");
						if(parts.length > 0)
							extension = parts[parts.length-1];
						else
							extension = "";
					}	
				}
				item.extension = extension;					
			}				
			addFlag = false;
			for (var i = 0; i<len; i++ )
			{				 
				if(extension && (this.fileTypesList[i][1] == "*" || (this.fileTypesList[i][1].toLowerCase() == extension.toLowerCase())))
				{
					addFlag = true;
					break;
				}	
			}						
		}
		if(extension == "man")
			addFlag = false;
		else if(item.fullPath.indexOf("IBFS:/WFC") == 0 && item.type != "PRTLXBundle")
		{	
			// is one of the parents a portal?
			// if it is we only want to show this item if user has createItem or createFolder permissions on it.
			var parent = this.findallFoldersByPath(item.parentPath);
			{
				if(!parent)	
				{	
					parent = this.getFolderInfo(item.parentPath);
					if(parent)
						this.allFoldersAdd(parent);
				}	
			}

			if (parent.type == "MyReportFolder" && parent.ownerName != this.userName)
			{
				addFlag = true;
			}
			else
			{
				while(parent && parent.type != "MRRepository" && parent.type != "EDANode" && parent.type != "BipPortalsSubArea" && parent.type != "WebFOCUSEnvironmentRoot"
						&& parent.type != "WEBFolder" && parent.type != "IBFSFolder")
				{			
					if(parent && parent.type == "PRTLXBundle")
					{				
						if(parent.actions.indexOf("createFolder") == -1 && parent.actions.indexOf("createItem") == -1)
						{
							addFlag = false;
							break;
						}
					}				
					if(parent && parent.parentPath)
					{	
						var parentPath = parent.parentPath;
						parent = this.findallFoldersByPath(parentPath);
						if(!parent)	
						{	
							parent = this.getItem(parentPath);
							if(parent)
								this.allFoldersAdd(parent);
						}
					}	
					else
						break;
				}
			}
		}		
		if(addFlag)
		{	
			item.selected = false;		
			item.jqObject = null;
			var category = [];			
			if(item.clientInfo && item.clientInfo.properties && item.clientInfo.properties.Category)				
				category = String(item.clientInfo.properties.Category).split(",");
			else if(item.properties && item.properties.Category)
				category = String(item.properties.Category).split(",");
			else if(item.clientInfo && item.clientInfo.properties && item.clientInfo.properties.LinkToCategory)
				category = String(item.clientInfo.properties.LinkToCategory).split(",");
			else
				category[0]=this.otherString;				
			for(var i = 0; i < category.length; i++)
			{
				var cat = category[i].trim();					
				if(this.categoryList.indexOf(cat) == -1)
				{
					this.categoryList.push(cat);
					this.categorySel.push(false);
				}
			}
			// add some flags to the item...
			if(item.clientInfo && !item.clientInfo.typeInfo)
			{	
				if(item.type == "IBFSFile")
				{
					if(item.fullPath.indexOf(".mas") > -1)					
						item.altglyph = "ibx-icons ds-icon-master";
				}	
			}
			if(item.type == "PGXBundle")
			{			
				if(item.clientInfo && item.clientInfo.properties.PGXType && item.clientInfo.properties.PGXType == "workbook")
					item.altglyph = "ibx-icons ds-icon-book-open";
			}	
			var published = true;
			if((item.ownerId && item.ownerId != "") || (item.inheritedPrivacy && item.inheritedPrivacy == "true"))published = false;
			var shown = true;
			if(item.clientInfo && item.clientInfo.properties && item.clientInfo.properties.hidden && (item.clientInfo.properties.hidden == "on" || item.clientInfo.properties.hidden == true))
				shown = false;
			item.shown = shown;
			item.published = published;
			var parentPath = item.parentPath;		
			if(parentPath.charAt(parentPath.length-1)=="/")					
					parentPath = parentPath.substring(0, parentPath.length-1);
			if(this.deferSelectedItemPath && this.deferSelectedItemPath == item.fullPath)
			{	
				//item.selected = true;
				
				$(document).trigger( "treeSetSelection", {"path" : parentPath, "inFocus": false});
				this.deferSelectedItemPath = "";	
			}	
			// find the domain and store it's description.
			item.parentDescription = this.findDomainDescription(item);			
			
			if(item.parentDescription && item.parentDescription.length > 0 && this.domainList.indexOf(item.parentDescription) == -1)
			{	
				this.domainList.push(item.parentDescription);
				this.categorySel.push(false);
			}	
				
			// add item to list...
			if(item.type == "PRTLXBundle")
				this.allFoldersAdd(item);
				
			this.itemList.push(item);
			this.itemListDefault.push(item);			
		}	
	};
	
	protoItems.getFolderInfo = function(path)
	{
		var item;
		Ibfs.ibfs.getItemInfo(path, false, {asJSON:true, async:false}).done(function(cInfo)
		{
				item = cInfo.result;
				this.enhanceItemActions(item);
		}.bind(this));
		return item;
	};
	
	protoItems.getItem = function(path)
	{
		var item;
		Ibfs.ibfs.getItemInfo(path, true, {asJSON:true, async:false}).done(function(cInfo)
		{
				item = cInfo.result;
				this.enhanceItemActions(item);
		}.bind(this));
		return item;
	};
	protoItems.enhanceItemActions = function(item)
	{		
		var uriExec = sformat("{1}/iteminfo.bip", applicationContext);					
		var randomnum = Math.floor(Math.random() * 100000);	
		var argument=
		{
				"BIP_REQUEST_TYPE": "BIP_GET_ITEM_INFO",
				"path": item.fullPath,
				"type": item.container ? "folder" : "item",
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
			item.actions = node.attr("privileges");			
		});
	};
	protoItems.findDomainDescription = function(item)
	{
		var parentDescription = "";
		var parentPath = item.parentPath;					
		var paths = parentPath.split("/");		
		var iDomain = false;
		var nPath = "";
		for (var i = 0; i < paths.length; i++)
		{
			if(i > 0)
				nPath += "/";
			nPath += paths[i];				
			if(iDomain)
				break;
			if(paths[i] == "Repository")
				iDomain = true;				
		}		
		if(iDomain)
		{	
			var parentItem = this.findallFoldersByPath(nPath);
			if(parentItem)
				parentDescription = parentItem.description;
			else
				parentDescription = paths[i];
		}
		return parentDescription;
		
	};
	protoItems.addFolderItem = function(item)
	{
		if(item.type == "BipPortalsPortal")
		{	
			this.addItem(item);
			return;
		}	
		item.selected = false;		
		item.jqObject = null;
		var addItem = true;
		if(this.appPathList.length > 0)
		{ // if we have a pathlist and folder item is on first level filter it...	
			if(item.fullPath.split("/").length < 5)
				if(this.appPathList.indexOf(item.name) < 0)addItem = false; 
		}
		if(addItem)
		{
			var eitem = this.enhanceFolderItem(item);
			var parentPath = eitem.parentPath;		
			if(parentPath.charAt(parentPath.length-1)=="/")					
					parentPath = parentPath.substring(0, parentPath.length-1);
			if(this.deferSelectedItemPath && this.deferSelectedItemPath == eitem.fullPath)
			{	
				eitem.selected = true;
				$(document).trigger( "treeSetSelection", {"path" : parentPath, "inFocus": false});
				this.deferSelectedItemPath = "";				
			}	
			
			// find the domain and store it's description.
			eitem.parentDescription = this.findDomainDescription(item);			
			
			if(eitem.parentDescription && eitem.parentDescription.length > 0 && this.domainList.indexOf(eitem.parentDescription) == -1)
			{	
				this.domainList.push(eitem.parentDescription);
				this.categorySel.push(false);
			}
			
			
			this.folderList.push(eitem);
			this.allFoldersAdd(eitem);
			this.folderListDefault.push(eitem);
		}
	};
	protoItems.enhanceFolderItem = function(initem)
	{
		var item = initem;
		if(typeof item.showExtraColumns != "undefined")return item;
		if(!item.clientInfo)return item;
		var actions = item.actions.toLowerCase();
		var showExtraColumns = false;
		if(actions.indexOf("publish") > -1 || actions.indexOf("unpublish") > -1 || actions.indexOf("show") > -1 || actions.indexOf("hide") > -1)showExtraColumns = true;
		item.showExtraColumns = showExtraColumns;
		if(showExtraColumns)this.showExtraColumnsOnRoot = true;
		var published = true;
		if((item.ownerId && item.ownerId != "") || (item.inheritedPrivacy && item.inheritedPrivacy == "true"))published = false;
		var shown = true;
		if(item.clientInfo.properties.hidden && item.clientInfo.properties.hidden == "on")shown = false;
		item.shown = shown;
		item.published = published;
		return item;
	};
	protoItems.getShowExtraColumns = function()
	{		
		var flen=this.folderList.length;		
		var i=0;		
		if(flen > 0)
		{
			for (i=0; i < flen; i++)
			{	
				var item = this.folderList[i];
				var actions = item.actions.toLowerCase();				
				if(actions.indexOf("publish") > -1 || actions.indexOf("unpublish") > -1 || actions.indexOf("show") > -1 || actions.indexOf("hide") > -1)return true;
			}
		}
		var ilen=this.itemList.length;		
		var i=0;		
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var item = this.itemList[i];
				if(item.actions)
				{	
					var actions = item.actions.toLowerCase();								
					if(actions.indexOf("publish") > -1 || actions.indexOf("unpublish") > -1 || actions.indexOf("show") > -1 || actions.indexOf("hide") > -1)return true;
				}				
			}
		}	
		return false;
	};
	protoItems.getFolderCount = function()
	{
		return this.folderList.length;
	};
	protoItems.getItemCount = function()
	{
		return this.itemList.length;
	};
	protoItems.setSortedValue = function(value)
	{
		this.sortedValue = value;
	};
	protoItems.setSortedValueType = function(value)
	{
		this.sortedValueType = value;
	};
	protoItems.setSortedOrder = function(value)
	{
		this.sortedOrder = value;
	};
	protoItems.getSortedValue = function()
	{
		return this.sortedValue;
	};
	protoItems.getSortedValueType = function()
	{
		return this.sortedValueType;
	};
	protoItems.getSortedOrder = function()
	{
		return this.sortedOrder;
	};
	protoItems.setPropertiesSet = function(value)
	{
		this.propertiesSet = value;
	};
	protoItems.setSortedDefaults = function()
	{
		this.sortedValue = "default";
		this.sortedOrder = "up";
	};
	protoItems.setDeferSelectedItem = function(item)
	{
		if(item)this.deferSelectedItemPath = item.fullPath;
	};
	protoItems.scrollIntoView = function(path)
	{
		var foundItem = this.findItemByPath(path);
		if(foundItem && foundItem.selected)
		{
			if(foundItem.jqObject)
				foundItem.jqObject.trigger("selectSet");
			if(foundItem.jqObject_grid)
				foundItem.jqObject_grid.trigger("selectSet");				
		}	
	};
	protoItems.toggleSelected = function(item, key)
	{
		var fp;
		if (typeof item == "string")
			fp = item;
		else
			fp = item.fullPath;

		var foundItem = this.findItemByPath(fp);
		if(!foundItem)return false;
		if (typeof item == "string")
			item = foundItem;
		var parentPath = foundItem.parentPath;		
		if(parentPath.charAt(parentPath.length-1)=="/")
			parentPath = parentPath.substring(0, parentPath.length-1);
		//$(document).trigger( "treeSetSelection", {"path" : parentPath, "inFocus": false});
		if(key == 3)
		{
			// context key
			if(foundItem.selected)
				return foundItem.selected;			
		}	
		if(key != 2 || !this.multiSelectAllowed)
		{	
			foundItem.selected = foundItem.selected ? false : true;
			if(foundItem.selected)
			{
				if(foundItem.jqObject)
					foundItem.jqObject.trigger("selectSet");
				if(foundItem.jqObject_grid)
					foundItem.jqObject_grid.trigger("selectSet");
				if(this.propertiesSet != null && key != -1)
					this.propertiesSet(foundItem);
			}
			else 
			{
				if(foundItem.jqObject)
					foundItem.jqObject.trigger("selectUnset");
				if(foundItem.jqObject_grid)
					foundItem.jqObject_grid.trigger("selectUnset");
/*				
				if(foundItem.jqObject)
					foundItem.jqObject.trigger("cutUnset");
				if(foundItem.jqObject_grid)
					foundItem.jqObject_grid.trigger("cutUnset");
*/					
			}		
			// ctrl key?	
			if(key == 1 && this.multiSelectAllowed)
				return foundItem.selected;
		}
		if(key == 2 && this.multiSelectAllowed)
		{
			// shift key
			this.multiSelect(foundItem);
			
			return foundItem.selected;
		}		
		// make sure no other items are selected....
		this.removeAllSelections(item);		
		return foundItem.selected;		
	};	
	
	protoItems.multiSelect = function(item)
	{
		// our item number?
		var itemNumber;		
		if(item.container && item.type != 'PGXBundle')
		{				
			var ilen=this.folderList.length;		
			var i=0;		
			if(ilen > 0)
			{
				for (i=0; i < ilen; i++)
				{	
					var ibfsitem=this.folderList[i];					
					if(ibfsitem.fullPath == item.fullPath)
					{	
						itemNumber = i;
						break;
					}	
				}
			}							
		}
		else
		{	
			var ilen=this.itemList.length;		
			var i=0;		
			if(ilen > 0)
			{
				for (i=0; i < ilen; i++)
				{	
					var ibfsitem=this.itemList[i];	
					if(ibfsitem.fullPath == item.fullPath)
					{
						itemNumber = i + this.folderList.length;
					}	
				}	
			}							
		}
		// find the first selected folder
		var firstSelectedFolder = -1;
		var flen=this.folderList.length;		
		var i=0;		
		if(flen > 0)
		{
			for (i=0; i < flen; i++)
			{	
				var ibfsitem=this.folderList[i];
				if(ibfsitem.selected)
				{	
					firstSelectedFolder  = i;
					break;
				}	
			}
		}	
		// find the first selected item
		var firstSelectedItem = -1;
		var ilen=this.itemList.length;		
		var i=0;		
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=this.itemList[i];
				if(ibfsitem.selected)
				{	
					firstSelectedItem = flen + i;
					break;
				}	
			}
		}	
		
		if(firstSelectedItem > -1 || firstSelectedFolder > -1)
		{
			// remove all selections...
			this.removeAllSelections(null);			
			// start selecting items...
			var firstSelected = (firstSelectedFolder == -1)? firstSelectedItem : firstSelectedFolder;
			var steps = 1;
			var starting = firstSelected;
			var ending = itemNumber; 
			if(firstSelected > itemNumber)
			{					
					ending = firstSelected;
					starting = itemNumber;
					
			}
			flen = this.folderList.length;
			var ibfsitem = null;
			for(i=starting; i <= ending; i += steps)
			{
				if(i < flen)			
					ibfsitem = this.folderList[i];
				else
					ibfsitem = this.itemList[i-flen];
				
				if(ibfsitem.jqObject)ibfsitem.jqObject.trigger("selectSet");
				if(ibfsitem.jqObject_grid)ibfsitem.jqObject_grid.trigger("selectSet");
				ibfsitem.selected = true;
			}	
			
		}		
	};	
	protoItems.cutIndicate = function(bSet)
	{
		var items = this.getAllSelectedItems();
		var i;
		for(i = 0; i < items.length; i++)
		{	
			var ibfsitem = items[i];
			if(bSet)
			{	
				if(ibfsitem.jqObject)ibfsitem.jqObject.trigger("cutSet");
				if(ibfsitem.jqObject_grid)ibfsitem.jqObject_grid.trigger("cutSet");
			}
			else
			{
				if(ibfsitem.jqObject)ibfsitem.jqObject.trigger("cutUnset");
				if(ibfsitem.jqObject_grid)ibfsitem.jqObject_grid.trigger("cutUnset");
			}
		}	
	};
	protoItems.filterItems = function(filter)
	{		
		var srchDlg = $(".div-search");
		var useField = srchDlg.ibxWidget("option", "search");
		var matchType = srchDlg.ibxWidget("option", "matchingBehavior");
		var resourceType = srchDlg.ibxWidget("option", "basicType");
		
		
		this.itemList.length=0;		
		this.folderList.length=0;		
		var lfilter = filter;
		if(lfilter.length == 0)
			return;
		lfilter = lfilter.toLocaleLowerCase();
		if(lfilter.charAt(0) == "*")
		{
			lfilter = lfilter.substring(1);
		}
		else if(lfilter.charAt(lfilter.length - 1) == "*")
		{
			lfilter = lfilter.substring(0,lfilter.length-1);
		}	
			
		
		ilen=this.itemListDefault.length;		
		i=0;			
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=this.itemListDefault[i];
				if (resourceType != "any")
				{
					var typeMatch = false;
					var portalTypes = resourceType.split(',');
					for (var p = 0; p < portalTypes.length; p++)
					{
						if (ibfsitem.type == portalTypes[p])
						{
							typeMatch = true;
							break;
						}
					}
					if (!typeMatch)
						continue;
				}
				
				var add = false;
				var matchText = "";
				switch(useField)
				{
					case "description":
					{
						matchText = ibfsitem.description.toLocaleLowerCase();
						break;
					}
					case "name":
					{
						matchText = ibfsitem.name.toLocaleLowerCase();
						break;
					}
					case "summary":
					{
						matchText = ibfsitem.summary ? ibfsitem.summary.toLocaleLowerCase() : "";
						break;
					}
					case "tag":
					{
						matchText = ibfsitem.clientInfo.properties.Category ? ibfsitem.clientInfo.properties.Category.toLocaleLowerCase() : "";
						break;
					}
				}
				switch(matchType)
				{
					case "contains":
					{	
						if(matchText.indexOf(lfilter) > -1)
							add = true;
						
						break;
					}	
					case "starts_with":
					{
						if(matchText.indexOf(lfilter) == 0)
							add = true;
						
						break;
					}	

					case "ends_with":
					{
						if(matchText.lastIndexOf(lfilter) == matchText.length-1)
							add = true;
						
						break;
					}	
					case "exact_match":
					{
						if (matchText == lfilter)
							add = true;
						
						break;
					}
				}
				
				if(add)
					this.itemList.push(ibfsitem);	
			}	
		}	
	};	
	protoItems.removeAllSelections = function(item)
	{
		
		var ilen=this.folderList.length;		
		var i=0;		
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=this.folderList[i];	
				if(!item || (item && ibfsitem.fullPath != item.fullPath))
				{	
					// if item is passed in we preserve it's selection...
					if(ibfsitem.selected)
						{	
							
							if(ibfsitem.jqObject)ibfsitem.jqObject.trigger("selectUnset");
							if(ibfsitem.jqObject_grid)ibfsitem.jqObject_grid.trigger("selectUnset");
//							if(ibfsitem.jqObject)ibfsitem.jqObject.trigger("cutUnset");
//							if(ibfsitem.jqObject_grid)ibfsitem.jqObject_grid.trigger("cutUnset");
							ibfsitem.selected = false;
						}
				}	
			}							
		}
	
			
		ilen=this.itemList.length;		
		i=0;			
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=this.itemList[i];	
				if(!item || (item && ibfsitem.fullPath != item.fullPath))
				{
					// if item is passed in we preserve it's selection...
					if(ibfsitem.selected)
						{							
							if(ibfsitem.jqObject)ibfsitem.jqObject.trigger("selectUnset");
							if(ibfsitem.jqObject_grid)ibfsitem.jqObject_grid.trigger("selectUnset");
//							if(ibfsitem.jqObject)ibfsitem.jqObject.trigger("cutUnset");
//							if(ibfsitem.jqObject_grid)ibfsitem.jqObject_grid.trigger("cutUnset");
							ibfsitem.selected = false;
						}
				}	
			}							
		}
		
	};
	
	protoItems.findItemByPath = function(fullPath)
	{
		// find the item...		
		var ilen=this.folderList.length;		
		var i=0;
		
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=this.folderList[i];	
				if(ibfsitem.fullPath == fullPath)
				{					
					return this.folderList[i];					
				}	
			}							
		}	
			
		ilen=this.itemList.length;
				
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=this.itemList[i];	
				if(ibfsitem.fullPath == fullPath)
				{					
					return this.itemList[i];						
				}	
			}							
		}
		return null;
			
	};
	protoItems.setCallBack = function(fullPath, jobject, grid)
	{
		var foundItem = this.findItemByPath(fullPath);
		if(grid)
			foundItem.jqObject_grid = jobject;
		else
			foundItem.jqObject = jobject;
	};
	
	
	
	protoItems.getAllSelectedItems = function()
	{
		var selectedList=[];
		var ilen=this.folderList.length;		
		var i=0;		
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=this.folderList[i];
				if(ibfsitem.selected)selectedList.push(ibfsitem);
			}							
		}			
		ilen=this.itemList.length;		
					
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{
				var ibfsitem=this.itemList[i];
				if(ibfsitem.selected)selectedList.push(ibfsitem);						
			}							
		}
		return selectedList;		
	};
	protoItems.allFoldersAdd = function(item)
	{
		var eitem = this.enhanceFolderItem(item);
		var fullPath = eitem.fullPath;
		if(!this.findallFoldersByPath(fullPath))		
			this.allFolders.push(eitem);		
	};
	protoItems.allFoldersRemove = function(item)
	{
		var i = this.allFolders.indexOf(item);		
		if(i > -1)
			this.allFolders.splice(i,1);			
	};
	protoItems.setMultiSelectAllowed = function(multiSelectAllowed)
	{
		this.multiSelectAllowed = multiSelectAllowed;
	};
	protoItems.findallFoldersByPath = function(fullPath)
	{
		if(fullPath.charAt(fullPath.length-1)=="/")
			fullPath = fullPath.substring(0, fullPath.length-1);
		var ilen=this.allFolders.length;		
		var i;	
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=this.allFolders[i];	
				if(ibfsitem.fullPath == fullPath)
				{					
					return this.allFolders[i];					
				}	
			}							
		}
		return null;
	};
	protoItems.findAllChildFoldersByPath = function(fullPath)
	{
		if(!this.endsWithx(fullPath,"/"))		
			fullPath += "/";
		var ilen=this.allFolders.length;		
		var i;
		var children=[];
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=this.allFolders[i];				
				if(ibfsitem.parentPath == fullPath)
				{
					var addItem = true;
					if(this.appPathList.length > 0)
					{ // if we have a pathlist and folder item is on first level filter it...	
						if(ibfsitem.fullPath.split("/").length < 5)
							if(this.appPathList.indexOf(ibfsitem.name) < 0)addItem = false; 
					}
					if(addItem)
						children.push(ibfsitem);				
				}	
			}							
		}
		return children;
		
	};
	protoItems.deleteAllChildFoldersByPath = function(fullPath)
	{
		if(!this.endsWithx(fullPath,"/"))
			fullPath += "/";
		var ilen=this.allFolders.length;		
		var i;
		var deleteList=[];
		if(ilen > 0)
		{
			for (i=0; i < ilen; i++)
			{	
				var ibfsitem=this.allFolders[i];	
				if(ibfsitem.parentPath == fullPath)
				{
					deleteList.push(i);
				}	
			}							
		}		
		if(deleteList.length > 0)
		{
			for(i = deleteList.length - 1; i >= 0; i--)
				this.allFolders.splice(deleteList[i],1);
		}	
	};
	
	protoItems.saveItems = function()
	{
		this.categoryList.length = 0;
		this.categorySel.length = 0;
		this.domainList.length = 0;
		var ilen = this.folderList.length;
		this.saveFolderList.length = 0;
		if(ilen > 0)
		{
			for (var i=0; i < ilen; i++)
			{	
				var item = this.folderList[i];
				this.saveFolderList.push(item);
			}							
		}			
		ilen=this.itemList.length;	
		this.saveItemList.length = 0;
		if(ilen > 0)
		{
			for (var i=0; i < ilen; i++)
			{
				var item=this.itemList[i];
				this.saveItemList.push(item);						
			}							
		}				
		return;
	};
	
	protoItems.restoreItems = function()
	{
		this.categoryList.length = 0;
		this.categorySel.length = 0;
		this.domainList.length = 0;
		var ilen = this.saveFolderList.length;
		this.folderList.length = 0;
		if(ilen > 0)
		{
			for (var i=0; i < ilen; i++)
			{	
				var item = this.saveFolderList[i];
				this.folderList.push(item);
			}							
		}			
		ilen=this.saveItemList.length;	
		this.itemList.length = 0;
		if(ilen > 0)
		{
			for (var i=0; i < ilen; i++)
			{
				var item=this.saveItemList[i];
				this.addItem(item);										
			}							
		}				
		return;
	};
	
	protoItems.clearSavedItems = function()
	{
		this.saveFolderList.length = 0;
		this.saveItemList.length = 0;
	};
	
	protoItems.sortItems = function(key, type, toggle)
	{	
		this.removeAllSelections(null);
		if(key == "default")
		{
			var ilen = this.folderListDefault.length;
			this.folderList.length = 0;
			if(ilen > 0)
			{
				for (i=0; i < ilen; i++)
				{	
					var item = this.folderListDefault[i];
					this.folderList.push(item);
				}							
			}			
			ilen=this.itemListDefault.length;	
			this.itemList.length = 0;
			if(ilen > 0)
			{
				for (i=0; i < ilen; i++)
				{
					var item=this.itemListDefault[i];
					this.itemList.push(item);						
				}							
			}
			this.sortedValue=key;
			this.sortedOrder = "up";			
			return;
		}	
			
		if(toggle == null || toggle == true)
		{	
			if(this.sortedOrder=="up")
				this.sortedOrder="down";
			else 
				this.sortedOrder="up";
		}
		if(this.itemList.length > 1 || this.folderList.length > 1)
		{	
		 	if(this.itemList.length > 1)
		  		this.itemList=this._sortit(key, type, this.itemList, this.sortedOrder);
			if(this.folderList.length > 1)
				this.folderList = this._sortit(key, type, this.folderList, this.sortedOrder);	
			
		  	this.sortedValue=key;
		  	this.sortedValueType=type;		  	  	
		}
	};
	
	protoItems._getScmSortValue = function(scmStatus)
	{
		var scmText="";
		switch(scmStatus)
		{
			case "NONE":
			case "NOT_CONTROLLABLE":
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
		
		return scmText;
	}
	
	protoItems._sortit = function(key, type, list, sortedOrder)
	{
		if(sortedOrder == "up")
		{
			// sort up...	
			var aa="a." + key;
			var bb="b." + key;
			if (key == "scmStatus")
			{
				aa = "this._getScmSortValue(" + aa + ")";
				bb = "this._getScmSortValue(" + bb + ")";
			}
			var aal="nameA";
			var bbl="nameB";
			var cmp="";
			if(type == "alpha")
			{
				aal="nameA && typeof(nameA) == 'string' ? nameA.toLocaleLowerCase():' '";
				bbl="nameB && typeof(nameB) == 'string' ? nameB.toLocaleLowerCase():' '";	
				cmp="var x=nameA.localeCompare(nameB);";	
			}
			else if(type == "boolean")
			{
				cmp = "var x=0;if (nameA < nameB)x=-1;else if (nameA > nameB)x=1;";
			}	
			else	
			{
				aa = "parseInt(" + aa + ")";
				bb = "parseInt(" + bb + ")";
				cmp = "var x=0;if (nameA < nameB)x=-1;else if (nameA > nameB)x=1;";
			}	
			list.sort(function(a, b) 
			{								
					var nameA = eval(aa);
					nameA = eval(aal);				
					var nameB = eval(bb);
					nameB = eval(bbl);
					eval(cmp);
					return x;									
			}.bind(this));			
		}
		else
		{
			var aa="a." + key;
			var bb="b." + key;
			if (key == "scmStatus")
			{
				aa = "this._getScmSortValue(" + aa + ")";
				bb = "this._getScmSortValue(" + bb + ")";
			}
			var aal="nameA";
			var bbl="nameB";
			var cmp="";
			if(type == "alpha")
			{
				aal="nameA && typeof(nameA) == 'string' ? nameA.toLocaleLowerCase():' '";
				bbl="nameB && typeof(nameB) == 'string' ? nameB.toLocaleLowerCase():' '";	
				cmp="var x=nameB.localeCompare(nameA);";	
			}
			else if(type == "boolean")
			{
				cmp ="var x=0;if(nameA < nameB)x=1;else if (nameA > nameB)x=-1;";
			}	
			else
			{
				aa = "parseInt(" + aa + ")";
				bb = "parseInt(" + bb + ")";	
				cmp ="var x=0;if(nameA < nameB)x=1;else if (nameA > nameB)x=-1;";
			}	
			// sort down....							
			list.sort(function(a, b) 
			{								
				var nameA = eval(aa);
				nameA = eval(aal);				
				var nameB = eval(bb);
				nameB = eval(bbl);
				eval(cmp);
				return x;
								
			}.bind(this));																
		}
		return list;
	};


	

//# sourceURL=items.js
