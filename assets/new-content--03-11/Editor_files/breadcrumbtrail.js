/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.23 $:

$.widget("ibi.breadCrumbTrail", $.ibi.ibxHBox,
{
    options:
    { 	
    	currentPath: "",    
        isPhone: false,
        items: null,
        refreshFolder: null,
        thisContext: null,
        titleMode: true,
        userName: "",
        bServers: true,
        rootPath: ""
    },
    
    _widgetClass: "bread-crumb-trail",
    _caratChar: "",
    _currentCrumb: 0,
    
    _create: function()
    {
    	this._super();
    	this._caratChar = ibx.resourceMgr.getResource(".sd-right-carat");
    	this.element.on("keyup", function(e)
    	{
    		var crumbs = this.element.ibxWidget('children');
    		var crumb = $(crumbs[this._currentCrumb]);
    		e.stopPropagation();
    		switch (e.keyCode)
    		{
    			case 39:	// right arrow
	    		{
	    			var crumbs = this.element.ibxWidget('children');
	    			this._currentCrumb++;
	    			if (this._currentCrumb == crumbs.length)
	    				this._currentCrumb = 0;
	    			
					crumb = $(crumbs[this._currentCrumb]);
					crumb.focus();
					break;
	    		}
    			case 37:
	    		{
	    			var crumbs = this.element.ibxWidget('children');
	    			this._currentCrumb--;
	    			if (this._currentCrumb < 0)
	    				this._currentCrumb = crumbs.length-1;
	    			
					crumb = $(crumbs[this._currentCrumb]);
					crumb.focus();
					break;
	    		}
    			case 9:
    			{
    				break;
    			}
    			default:
    				return;
    		}	
    		
			if (this._currentCrumb == 0)
				crumb.attr('aria-label', sformat(ibx.resourceMgr.getString("home_bread_crumb_select_result"), crumb.prop('title')));
			else
			{
				if ((this._currentCrumb%2) == 0)
					crumb.attr('aria-label', crumb.prop('title'));
				else
				{
					//crumb.prop('title', crumbs[this._currentCrumb-1].textContent);
					crumb.attr('aria-label', ibx.resourceMgr.getString("home_bread_crumb_submenu") + crumbs[this._currentCrumb-1].textContent);
				}
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
    _destroy:function()
    {    	
    	this._super();
    },
    refresh: function()
	{
		this._super();
		if(!this.options.items || !this.options.thisContext)return;
		
		this.element.empty();
		var currentPath = this.options.currentPath;		
		if(currentPath.charAt(currentPath.length-1)=="/")
			currentPath=currentPath.substring(0, currentPath.length-1);
		
		var startRoot = -1;
		if(this.options.rootPath.length > 0)
		{
			var pitems = this.options.rootPath.split("/");
			startRoot = pitems.length - 2;
		}	
		var pathitems=currentPath.split("/");		
		var ilen=pathitems.length;		
		// shared folder kludge job... add phoney shared folder to the path when missing
		if(currentPath.indexOf("~") > -1 && currentPath.indexOf("##SHARE") == -1)
		{			
			// we're in a mycontent path....
			var bpath = "";			
			for (var i = 0; i < ilen; i ++)
			{
				bpath += pathitems[i];
				if(pathitems[i].indexOf("~") == 0)
				{
					var item = this.options.items.findallFoldersByPath(bpath);
					if(item && item.clientInfo.type == "MyReportFolder" && !item.policy.opCreateItem)
					{
						// shared folder...
						pathitems.splice(i, 0, "##SHARE");
						ilen ++;
						break;
					}	
				}
				else
					bpath += "/";
			}
		}
		// end of kludge
		var start = 0;
		var xpath = "";
		var startItem = -1;		
		var caratChar = this._caratChar;
		var isPhone = this.options.isPhone;
		var tWidth = 0;
		if(this.element.width)tWidth = this.element.width();
		if(tWidth == 0 && this.options.thisContext)
		{
			if(this.options.thisContext.element)
				tWidth = this.options.thisContext.element.width() / 2;
		}
		var maxPaths = 7;
		if(isPhone)
			maxPaths = 3;
		else if(tWidth > 0 && tWidth < 500)
			maxPaths = 4;
		else if(tWidth > 0 && tWidth < 800)
			maxPaths = 5;		
		
		if(maxPaths != -1 && ilen > maxPaths)
		{	
			startItem = ilen - maxPaths;	
		}	
		var children = [];

		for(var i = 0; i < ilen; i++)
		{														
			var itemx = pathitems[i];
			if (itemx == "WEB" || itemx == "Global" || (this.options.bServers && itemx == "EDA"))
				start = 1;
			
			xpath += itemx ;
			if(i < ilen - 1)
				xpath+="/";	
		
			if(start > 0 && i >= startItem)
			{
				// try to get the description...
				var item = this.options.items.findallFoldersByPath(xpath);
				// part of shared items kludge - we added phoney shared folder to the path... so need to get description from original path					
				if(!item && pathitems[i] != "##SHARE" && xpath.indexOf("##SHARE/") > -1)					
				{
					var npath = xpath.replace("/##SHARE", "");	
					item = this.options.items.findallFoldersByPath(npath);
				}	
				//
				var title = itemx;
				if(item)
				{	
					if (item.description)
						title = item.description;
					if(item.adornment)
						title += (" (" + item.adornment + ")");
				}
				else if (pathitems[i] == "##SHARE")
				{
					title = ibx.resourceMgr.getString("home_shared_content");
					itemx = title;
				}	
				else if (i == 1)
				{
					if (itemx == "WEB")
						itemx = title = ibx.resourceMgr.getString("home_web_description");
					else
						itemx = title = ibx.resourceMgr.getString("home_repSrv_description");
				}	
				else if(i == 2)
				{
					if (itemx == "Repository")
						title = itemx = ibx.resourceMgr.getString("home_repository_description");
					else if (itemx == "Global")
						itemx = title = ibx.resourceMgr.getString("home_global_resources_description");
				}
				if(i == startItem)
					itemx="...";
				else if(this.options.titleMode && item)
				{	
					if (item.description)
						itemx = item.description;
					if(item.adornment)
						itemx += (" (" + item.adornment + ")");
				}	
				var crumbitem=this._crumbbutton(xpath, itemx, title);			
				var carat = ' ';
				var rCaret = false;
				if(start > 1)
				{
					rCaret = true;
					carat = this._caratMenu(children, this.options.userName);
					$(carat).on('keydown', function(e)
					{
						if (e.key == "Tab" && e.shiftKey)
						{
							e.preventDefault();
							this._currentCrumb = 0;
							$(window.parent.document).find('.AdvancedSearchComponent__SubmitBtn-sc-123avfj-5').focus();
						}
					}.bind(this));
				}
				
				start++;								
				if(start > 1 && i < ilen)
				{
					if (rCaret)
					{
						var children = this.element.ibxWidget('children');
						var prevText = $(children[children.length-1]).ibxWidget('option', 'text')
						//carat.prop('title', ibx.resourceMgr.getString("home_bread_crumb_submenu") + prevText);
					}
					this.element.append(carat);
				}
				
				this.element.append(crumbitem);
				
				// find all children of this path...
				children = this.options.items.findAllChildFoldersByPath(xpath);
			}
			else 
			{	
				if(startRoot > -1 )
				{
					if(i >= startRoot)
						start = 1;
				}	
				else if(itemx == "WFC" || itemx == "EDA")
					start=1;
			}	
		}
		
	},

	resetCurrentCrumb: function(idxNum)
    {
        this._currentCrumb = (idxNum ? idxNum : 0);
    },

	_crumbbutton: function(path, text, title)
	{								
		var crumbitem;		
		if (path == "IBFS:/WFC/Repository/")
		{
			crumbitem = $('<div tabindex="0">').ibxButtonSimple({"text":text}).data("ibfsPath", path).addClass("crumb-button").prop("title",title);
			crumbitem.attr('aria-label', sformat(ibx.resourceMgr.getString("home_bread_crumb_select_result"), title));	
			// when first crumb is focused dispatch the message to the search widget
			$(crumbitem).on('focus', function(e)
			{
				$(window.parent.document).find('#searchContainer .AdvancedSearchComponent__SearchContainer-sc-123avfj-3').dispatchEvent('hp_iframe_clicked');
			});
		}
		else
		{
			crumbitem = $('<div tabindex="-1">').ibxButtonSimple({"text":text}).data("ibfsPath", path).addClass("crumb-button").prop("title",title);
			crumbitem.attr('aria-label', title);
			/*$(crumbitem).on('focus', function(e)
			{
				if(!crumbitem[0].nextSibling)
			    {
					var ariaText = sformat(ibx.resourceMgr.getString("hpreboot_workspaces_tree_breadcrumb_loaded"), title);
					crumbitem.dispatchEvent('add-alert', {"ariatext": ariaText});
				}
            });	*/
			
		}
				
		$(crumbitem).on("click", function(e)
		{
			var rf = this.options.refreshFolder.bind(this.options.thisContext, path)
			rf(path);
		}.bind(this));
		
		$(crumbitem).on('keydown', function(crumb, e)
		{
			if (e.key == "Tab" && e.shiftKey)
			{
				if (crumbitem.data('ibfsPath') != "IBFS:/WFC/Repository/")
				{
					e.preventDefault();
					this._currentCrumb = 0;
					$(window.parent.document).find('.AdvancedSearchComponent__SubmitBtn-sc-123avfj-5').focus();
				}
			}
		}.bind(this, crumbitem));
		
		return crumbitem;
	},
	
	
	_caratMenu: function(ichildren, userName)
	{		
		var carat = ibx.resourceMgr.getResource(".sd-right-carat");
		if(ichildren.length > 0)
		{
			$(carat).data("ichildren", ichildren);
			$(carat).data("options", this.options);	
			
			$(carat).click(function(e)
			{
				var options = 
				{
						my: "left top",
						at: "right bottom",
						collision: "fit",
						of: $(carat)
				};	
				
			
				// create the menu....
			
				var cmenu = $("<div class=\"ibx-menu-no-icons bread-menu-scroll-bar\">").ibxMenu();
				var ichildren = $(this).data("ichildren");
				var xoptions = $(this).data("options");				
				for (i=0; i < ichildren.length; i++)
				{
					if(userName.length > 0 && ichildren[i].ownerName && userName != ichildren[i].ownerName && ichildren[i].name.indexOf("~") == 0)
						continue;
					var cmenuitem = $("<div>").ibxMenuItem();	
					var description = "";
					if(ichildren[i].description && ichildren[i].description.length > 0)
						description = ichildren[i].description;
					else
						description = ichildren[i].name;
					cmenuitem.ibxMenuItem("option", "labelOptions.text", description);	
					// is this item on the currentPath?
					var ii = xoptions.currentPath.indexOf(ichildren[i].fullPath);
					if(ii >= 0)cmenuitem.css("font-weight","bold");	
					//cmenuitem.data("ibfsPath",ichildren[i].fullPath);
					//cmenuitem.data("options", xoptions);	
					var path = ichildren[i].fullPath;					
					cmenuitem.on("ibx_menu_item_click", xoptions.refreshFolder.bind(xoptions.thisContext,path));
					cmenu.append(cmenuitem);							
				}
				
				cmenu.ibxMenu("open").position(options);	
			});
		}	
		return carat;	
	}
});
//# sourceURL=breadcrumbtrail.js
