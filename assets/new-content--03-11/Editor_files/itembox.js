/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.115 $:
$.widget( "ibi.itembox", $.ibi.ibxVBox,
{
	options:
	{
		item: null,
		mobile: false,
		context: null,
		doubleclick: null,
		toggleSelected: null,
		setCallBack: null,
		fileSingleClick: null,
		bSearch: null,
		thisContext: null,
		glyph: "",
		selectFolder: false,
		titleMode: true,
		askWebfocus: false,
		runUrl: null,
		isContainer: false,
		isDraggable: false
	},	
	
	_create: function ()
	{	
		this._super();
		
		if(this.options.isContainer)
			this._folderdiv();
		else
		{
			if(this.options.askWebfocus)
				this._askdiv();
			else
				this._itemdiv();	
		}	
		/*
		if (this.options.item.type == "PRTLXBundle")
		{
			if (home_globals.homepageMode == 0)
			{
				if ((this.options.item.actions.indexOf("createFolder") != -1) || (this.options.item.actions.indexOf("createItem") != -1))
					this._folderdiv();
				else
					this._itemdiv();
			}
			 else
				 this._itemdiv();
		}
		else if((this.options.item.container 
			&& this.options.item.type != "PGXBundle" 
			&& this.options.item.type != "BipPortalsPortal") 
			||	(this.options.item.type == "LinkItem" && this.options.item.clientInfo.properties.LinkToContainer == "TRUE" ))
		{			
			this._folderdiv();			
		}
		else
		{	
			if(this.options.askWebfocus)
				this._askdiv();
			else
				this._itemdiv();			
		}
		*/	
	},	

	//folder item boxes
	_folderdiv: function()
	{		
		var options = this.options;
		var item = options.item;
		this.element.ibxAddClass("folder-item").attr('tabindex', "-1");
		this.element.on("ibx_ctxmenu", function(e) 
		{	
			e.stopPropagation();
			
			options.toggleSelected(item, 3);
			
			var res = options.context(this, item);
			if(res)
				e.menu = res;
			else 
				e.preventDefault();
			
		});
		
		var glyph = "fa fa-folder";		
		if (item.type == "PRTLXBundle")
			glyph = "ibx-icons ds-icon-portal";
		var glyphdiv=$('<div>').ibxAddClass("folder-image-icon").ibxLabel({'glyphClasses': glyph});
		var myContentFolder = item.inMyContent;
		if(myContentFolder)
		{
			var paths = item.parentPath.split("/");
			var i;
			for (i = 0; i < paths.length; i++)
			{
				if(paths[i].indexOf("~") == 0)
				{
					myContentFolder = false;
					break;					
				}	
			}	
		}	
		var overlays = [];	
		if(myContentFolder && item.sharedToOthers)
		{	
			overlays.push({'position':'bl','glyphClasses':'home-item-overlay fa fa-user'});
			overlays.push({'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'});
		}
		else if(myContentFolder)
			overlays.push({'position':'bl','glyphClasses':'home-item-overlay fa fa-user'});
		else if(item.inMyContent && item.sharedToOthers)
			overlays.push({'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'});
		else if (item.fullPath.indexOf("/##SHARE") != -1)
			overlays.push({'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'});
			
		if(item.type == "LinkItem")
			overlays.push({'position':'bl','glyphClasses':'home-item-overlay ibx-icons ds-icon-shortcut'});
		
		if(overlays.length > 0)
			glyphdiv.ibxLabel('option', 'overlays', overlays);			
		
		var ellipsisdiv;
		if(options.mobile)
		{	
			
			ellipsisdiv = $('<div>').ibxAddClass("image-menu2").ibxMenuButton({'glyphClasses':'fa fa-ellipsis-v','iconPosition': 'top'});
			ellipsisdiv.on("ibx_click", function(e){
				e.stopPropagation();
				options.toggleSelected(item, 3);
				e.menu = options.context(this, item);
			});
			ellipsisdiv.on("click", function(e){
				e.stopPropagation();			
			});
		}
		else ellipsisdiv = $('<div>').ibxAddClass("image-menu2");
				
		
		var hboxdiv = null;
		if (this.options.isDraggable && !this.options.mobile)
			hboxdiv = $('<div data-ibxp-draggable="true">').ibxAddClass("folder-div").ibxHBox({'align':'stretch'});
		else
			hboxdiv = $('<div>').ibxAddClass("folder-div").ibxHBox({'align':'stretch'});
			
		if (item.type == "PRTLXBundle")
			hboxdiv.ibxAddClass("folder-portal-bundle");

		var publishText = ibx.resourceMgr.getString("hpreboot_unpublished");
		var showText = ibx.resourceMgr.getString("hpreboot_hidden");
		if(item.published || item.type == "MyReportFolder" || item.inMyContent)
		{
			hboxdiv.ibxAddClass("folder-item-published");
			publishText = ibx.resourceMgr.getString("hpreboot_published");
		}
		
		if(item.shown)
		{
			hboxdiv.ibxAddClass("folder-item-shown");
			showText = ibx.resourceMgr.getString("hpreboot_show_l");
		}
		hboxdiv.append(glyphdiv);
		var tileTitle = ibx.resourceMgr.getString("hpreboot_tile");
		var titleName = item.description;
		tileTitle = tileTitle.concat(' = ', titleName, ', ', publishText, ', ', showText);
		hboxdiv.attr("aria-label", tileTitle);
		
		
		imagetextstring = $('<div>').ibxAddClass("image-text folder-image-text").ibxLabel({'justify':'left',});
		
		imagetext = $(imagetextstring);
		//ibx.bindElements(imagetext);
		var description = item.description;
		if(item.adornment)
			description += (" (" + item.adornment + ")");
		if(!description || description.length == 0)
			description = item.name;
		var text = description;
		if(!this.options.titleMode)
			text = item.name;
		imagetext.ibxWidget("option", "text", text);
		hboxdiv.append(imagetext);
		hboxdiv.append(ellipsisdiv);
		hboxdiv.attr("tabindex", "-1");
		hboxdiv.data("item", this.options.item);
		this.element.append(hboxdiv);

		if(this.options.isDraggable)
		{	
			hboxdiv.on("ibx_dragstart ibx_dragover ibx_dragleave ibx_drop", function(e)	// for folder
			{
				e.stopPropagation();	// don't allow drop to get to parent
				
				var target = $(e.currentTarget);
				var dt = e.originalEvent.dataTransfer;
				if(e.type == "ibx_dragstart")
				{
					if (!this.element.hasClass("folder-item-selected"))	// dragstart must select if !selected
					{
						var ev = jQuery.Event("click");
						ev.ctrlKey = e.ctrlKey;
						this.element.trigger(ev);
					}
					
					var selItems =  home_globals.Items.getAllSelectedItems();
					if (!selItems.length)
						selItems = [target.data("item")];
					
					for (var i = 0; i < selItems.length; i++)
					{
						var item = selItems[i];
						var actions = item.actions;
						if (!e.ctrlKey)
						{
							if (actions.indexOf("delete") == -1)	// not allowed to Cut
								return false;
							if (item.type == "PRTLXBundle")
								return false;
						}
						else
						{
							if (item.type == "PRTLXBundle")
								return false;
						}
					}

					var doStart = true;
					$.each(selItems, function()
					{
						if (item.clientInfo.properties.Cascade)
						{
							doStart = false;
							return false;
						}
					});
					
					if (!doStart)
						return false;
					
					dt.setData("dragItem", selItems);
					var img = new Image(40, 40);
					img.src = sformat("./resource/image/bid/folder_closed_16.png");
					dt.setDragImage(img, 5, 5);
				}
				else if(e.type == "ibx_dragover")
				{
					var canDrop = true;
					var trg = target.data("item");
					var trgPath = trg.fullPath;
					var dragItems = dt.getData("dragItem");
					if (!dragItems)
						return false;
					for (var i = 0; i < dragItems.length; i++)
					{
						if (trg.actions.indexOf(dragItems[i].clientInfo.typeInfo.bContainer ? "createFolder" : "createItem") == -1)
						{
							canDrop = false;
							break;
						}
						
						if (trgPath == dragItems[i].fullPath)
						{
							canDrop = false;
							break;
						}
					}	
					
					
					if (canDrop)
					{
						dt.dropEffect = e.ctrlKey ? "copy": "move";
						e.preventDefault();
					}
					else
						dt.dropEffect = "none";
				}
				else if(e.type == "ibx_drop")
				{
					var trgPath = target.data("item").fullPath;
					var dragItems = dt.getData("dragItem");
					if (!dragItems)
						return;
					
					var dragItem = dt.getData("dragItem");
					var trgFolder = target.data("item");
					
					if (home_globals.confirmDropCut)
					{
						if (!e.ctrlKey)
						{
							// Save Confirm Dialog
							var options = 
							{		
								type:"medium warning",
								caption:ibx.resourceMgr.getString("home_warning"),
								buttons:"okcancel",
								movable:false,
								closeButton:true,
								messageOptions:{text:ibx.resourceMgr.getString("str_are_you_sure")}
							};
	
							var dlg = $.ibi.ibxDialog.createMessageDialog(options);
							dlg.ibxWidget("member", "btnOK").ibxWidget("option", "text", ibx.resourceMgr.getString("home_yes")).ibxAddClass("ibx-primary");
							dlg.ibxWidget("member", "btnCancel").ibxAddClass("ibx-default");
							
							dlg.on("ibx_close", function (e, closeData)
							{	
								if (closeData == "ok")
								{
									home_globals.homePage.cut(dragItem[0], dragItem);
									home_globals.homePage.paste(trgFolder, null, false, false);
								}
							});
							
							dlg.ibxDialog("open");
						}
						else
						{
							home_globals.homePage.copy(dragItem[0], dragItem);
							home_globals.homePage.paste(trgFolder, null, false, false);
						}
	
					}	
					else
					{
						if (e.ctrlKey)
							home_globals.homePage.copy(dragItem[0], dragItem);
						else
							home_globals.homePage.cut(dragItem[0], dragItem);
						
						home_globals.homePage.paste(trgFolder);
					}
				}
			}.bind(this));
		}	

		
		if(!options.mobile)
			this.element.on("dblclick", options.doubleclick.bind(this.options.thisContext,item));
		
		this.element.click(function(event)
		{
				var key=0;
				if (event.ctrlKey || event.metaKey)
					key=1;
				if (event.shiftKey)
					key=2;
				var isSelected = options.toggleSelected(item, key);
				
		});

		this.element.on('keydown', function(e)
        {
            if (e.key == ' ' || e.key == "Enter")
            {
                var key=0;
                if (event.ctrlKey || event.metaKey)
                    key=1;
                if (event.shiftKey)
                    key=2;        

                if (key == 0 && $(e.target).closest('.folder-item').hasClass('folder-item-selected'))
                {
                	options.doubleclick.bind(this.options.thisContext,item)(); 
                }
                else
                {
                    if (!$(e.target).closest('.fbx-block').hasClass('navmap-focused'))
                        options.toggleSelected(item, key);
                    else
                        $(e.target).closest('.fbx-block').ibxRemoveClass('navmap-focused');
                }
            }
        }.bind(this));
		
		if(!options.mobile && options.fileSingleClick && options.selectFolder)
			this.element.on("click", options.fileSingleClick.bind(this.options.thisContext,item));
		else if(options.mobile && options.doubleclick)
			this.element.on("click", options.doubleclick.bind(this.options.thisContext,item));
		
		options.setCallBack(item.fullPath, this.element, false);
		
		if(item.selected)
			$(this.element).ibxAddClass("folder-item-selected");
		
		this.element.on( "selectSet", function( event ) {
			$(this).ibxAddClass("folder-item-selected focused");
			if (!ibxPlatformCheck.isIE)
				iscrollIntoView($(this), $("#files-box-area"));
		});
		this.element.on( "selectUnset", function( event ) {
			
			$(this).removeClass("folder-item-selected focused");
			
		});
		this.element.on( "cutSet", function( event ) {
			$(this).ibxAddClass("folder-item-cut");
			if (!ibxPlatformCheck.isIE)
				iscrollIntoView($(this), $("#files-box-area"));
		});
		this.element.on( "cutUnset", function( event ) {
			
			$(this).removeClass("folder-item-cut");
			
		});
		//ibx.bindElements(this.element);
	},
	
	// file item boxes	
	_itemdiv: function()
	{
		var options = this.options;
		var item = options.item;
		var glyphs = options.glyph;	
		if(item.clientInfo.properties && item.clientInfo.properties.EnhancedRun == "on")
			glyphs = "ibx-icons ds-icon-tap";
		
		// is this a default image?
		
		var imageClass="item-image";		
		if(item.thumbPath && item.thumbPath.indexOf("ibi_html") > 0)
		{			
			imageClass = "item-image-default";
		}
		
		var ellipsisdiv;
		if(options.mobile)
		{	
			
			ellipsisdiv = $('<div>').ibxAddClass("image-menu2").ibxMenuButton({'glyphClasses':'fa fa-ellipsis-v','iconPosition': 'top'});
			ellipsisdiv.on("ibx_click", function(e){
				e.stopPropagation();
				options.toggleSelected(item, 3);
				e.menu = options.context(this, item);
			});
			ellipsisdiv.on("click", function(e){
				e.stopPropagation();			
			});
			
		}
		else ellipsisdiv = $('<div>').ibxAddClass("image-menu2");				
		
		var d = new Date(parseInt(item.lastModified, 10));	
		
		var lang = ibx.resourceMgr.language;
		
		var ddate = d.toLocaleDateString(lang) + "  " + d.toLocaleTimeString(lang);
		
		var jitemhbox;
		var jitemhbox0;
		var jitemvbox1;
		
		jitemhbox = $('<div>').ibxAddClass("file-item-hbox").ibxHBox({'align':'stretch'});
		var tooltip="";	
		var description = item.description;
		if(!description || description.length == 0)description = item.name;
		if(options.bSearch)
		{	
			var tooltipText = ibx.resourceMgr.getString("ITEM_TOOLTIP1");
			tooltip = sformat(tooltipText, description, item.fullPath,ddate);
		}	
		else
		{
			var tooltipText = ibx.resourceMgr.getString("ITEM_TOOLTIP2");
			tooltip = sformat(tooltipText, description, ddate);			
		}		
		var text = description;
		if(item.adornment)text += (" (" + item.adornment + ")");
		if(!this.options.titleMode)text = item.name;
		
		var jglyphdiv = "";
		var jglyphdiv0 = "";
				
		jglyphdiv = $('<div>').ibxAddClass("image-text web-clamp").ibxLabel({'align': 'start', 'textWrap': 'true'});
		if (item.pwa && typeof gitInterface != "undefined")
		{
			jglyphdiv = $('<div>').ibxHBox().ibxAddClass('scmTileLabel');
			jglyphdiv.ibxWidget('add', $('<div class="scm-title-text">').ibxLabel({'text': text, 'glyphClasses': glyphs}));
			var scmText="";
			switch(item.scmStatus)
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
			jglyphdiv.ibxWidget('add', $('<div class="scm-text">').ibxAddClass(scmText).ibxLabel({'text': scmText}));
		}
		else
			jglyphdiv.ibxLabel("option","text", text);
		
		if (item.type == 'LinkItem')
		{
			jglyphdiv.ibxWidget('option', 'glyphClasses', 'ds-icon-shortcut')
			jglyphdiv.find('.ibx-label-glyph').css({'font-size': '14px'});
		}
		
		jglyphdiv.prop("title", tooltip);
		
		
//		if(item.parent != "Favorites" && item.parent != "MobileFavorites")
//		{	
//			if(item.sharedToOthers && item.type == "LinkItem")
//				jglyphdiv.ibxLabel('option', 'overlays',[{'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'},
//				                                     {'position':'bl','glyphClasses':'home-item-overlay ibx-icons ds-icon-shortcut'}]);		
//			else if(item.sharedToOthers)
//				jglyphdiv.ibxLabel('option', 'overlays', [{'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'}]);			
//			else if(item.type == "LinkItem")										
//				jglyphdiv.ibxLabel('option', 'overlays', [{'position':'bl','glyphClasses':'home-item-overlay ibx-icons ds-icon-shortcut'}]);
//		}	
		
		var summary = item.summary ? item.summary: "";
		summary = summary.replace(/</g, "&lt;").replace(/>/g, "&gt;");

		summary = summary.replace(/\n/g, "<br/>");
		var uSummary = summary;
		
		var jclass = "file-item";
		
		var insightDiv = "";
		/*
		if(item.clientInfo.properties && item.clientInfo.properties.EnhancedRun == "on")
		{			
			var insightDiv = "<div class='insight-div' data-ibx-type='ibxLabel' data-ibxp-glyph-classes='ibx-icons ds-icon-tap'></div>";
		}
		*/
		
		var pathParts = item.thumbPath.split("?");
		var tp = encodeURIComponent(encodeURIComponent(pathParts[0]));
		tp = tp.replace(/%252F/g, "/");
		if (pathParts[1])
			tp += ("?" + pathParts[1]);

		var divstring = null;
		if (this.options.isDraggable && !this.options.mobile)
			divstring=sformat(
					'<div tabindex="-1" class="' + jclass + '" data-ibx-type="ibxWidget" data-ibxp-draggable="true">' + 
						'<div class="tibco-color-bar"></div>' + 
						'<div data-ibx-type="ibxHBox" class="ws-wrapper ibx-widget ibx-flexbox ibx-flexbox-horizontal fbx-block fbx-row fbx-nowrap fbx-justify-content-start fbx-justify-items-start fbx-align-items-center fbx-align-content-center fbx-child-sizing-content-box">' + 
							'<img draggable="false" style="pointer-events: none;"  class="{2}" src=" {1} " >' +
							'<div class="type-label" data-ibx-type="ibxLabel">' +
								'<div class="ibx-label-glyph ibx-label-icon aria-hidden="true"></div>' +
								'<div class="ibx-label-text"></div>' +
							'</div>' +							
							'<div class="publish-label" data-ibx-type="ibxLabel">' +
								'<div class="ibx-label-glyph ibx-label-icon aria-hidden="true"></div>' +
								'<div class="ibx-label-text"></div>' +
							'</div>' +
							'<div class="show-label" data-ibx-type="ibxLabel">' +
								'<div class="ibx-label-glyph ibx-label-icon aria-hidden="true"></div>' +
								'<div class="ibx-label-text"></div>' +
							'</div>' +
							'<div class="shared-label" data-ibx-type="ibxLabel">' +
								'<div class="ibx-label-glyph ibx-label-icon aria-hidden="true"></div>' +
								'<div class="ibx-label-text"></div>' +
							'</div>' +
					'</div>{4}<div class="file-item-text-box">{3}</div></div>', 
				tp, imageClass, uSummary, insightDiv);
		else 
			divstring=sformat(
				'<div tabindex="-1" class="' + jclass + '" data-ibx-type="ibxWidget">' + 
					'<div class="tibco-color-bar"></div>' + 
					'<div data-ibx-type="ibxHBox" class="ws-wrapper ibx-widget ibx-flexbox ibx-flexbox-horizontal fbx-block fbx-row fbx-nowrap fbx-justify-content-start fbx-justify-items-start fbx-align-items-center fbx-align-content-center fbx-child-sizing-content-box">' + 
						'<img draggable="false" style="pointer-events: none;" class="{2}" src=" {1} ">' +
						'<div class="type-label" data-ibx-type="ibxLabel">' +
							'<div class="ibx-label-glyph ibx-label-icon aria-hidden="true"></div>' +
							'<div class="ibx-label-text"></div>' +
						'</div>' +							
						'<div class="publish-label" data-ibx-type="ibxLabel">' +
							'<div class="ibx-label-glyph ibx-label-icon aria-hidden="true"></div>' +
							'<div class="ibx-label-text"></div>' +
						'</div>' +
						'<div class="show-label" data-ibx-type="ibxLabel">' +
							'<div class="ibx-label-glyph ibx-label-icon aria-hidden="true"></div>' +
							'<div class="ibx-label-text"></div>' +
						'</div>' +
						'<div class="shared-label" data-ibx-type="ibxLabel">' +
							'<div class="ibx-label-glyph ibx-label-icon aria-hidden="true"></div>' +
							'<div class="ibx-label-text"></div>' +
						'</div>' +
				'</div>{4}<div class="file-item-text-box">{3}</div></div>', 
			tp, imageClass, uSummary, insightDiv);

		var jitembox = $(divstring);
		var publishText = ibx.resourceMgr.getString("hpreboot_unpublished");
		var showText = ibx.resourceMgr.getString("hpreboot_hidden");
		if(item.published || item.inMyContent || item.parent == "MobileFavorites" || item.parent == "Favorites")
		{
			jitembox.ibxAddClass("file-item-published");
			publishText = ibx.resourceMgr.getString("hpreboot_published");
		}
//		jitembox.ibxAddClass("file-item-published");
		
		
		var actions = item.actions.toLowerCase();
		var hasShowPermission = false;
		if(actions.indexOf("publish") > -1 || actions.indexOf("unpublish") > -1 || actions.indexOf("show") > -1 || actions.indexOf("hide") > -1)
			hasShowPermission = true;	
		
		if(item.shown || !hasShowPermission)
		{
			jitembox.ibxAddClass("file-item-shown");
			showText = ibx.resourceMgr.getString("hpreboot_show_l");
		}
		
		jitembox.append($('<div class="rc-not-used"></div>'))
		
		jitemhbox.append(jglyphdiv);
		var tileTitle = ibx.resourceMgr.getString("hpreboot_tile");
		var titleName = text;
		tileTitle = tileTitle.concat(' = ', titleName, ', ', publishText, ', ', showText);
		jitemhbox.attr("aria-label", tileTitle);
		
		if(options.mobile)
			jitemhbox.append(ellipsisdiv);
		
//		if (this.options.item.pwa)
//			jitembox.ibxAddClass('scm-under-scm-control');
		
		jitembox.append(jitemhbox);		
		jitembox.find(".file-item-text-box").hide();
		jitembox.data("item", this.options.item);
		
		if (typeof home_globals != "undefined" && home_globals.isWorkspace)
		{
			if (this.options.item.actions.indexOf('unsubscribe') != -1)
			{
				jitembox.ibxAddClass('item-subscribed');
				jitembox.find('img').css('padding-bottom',  '20px');
				jitembox.find('.rc-not-used').ibxRemoveClass('rc-not-used').ibxAddClass('rc-subscribed-ohp');
			}
		}
		
		this.element.append(jitembox);	

		var unpublished = 1;
		var hidden      = 2;
		var shared		= 4;
		var type		= 8;
		
		var iconState = 0;
		if (!item.published && item.fullPath.indexOf('/~') == -1)
		{
			iconState |= unpublished;
			jitembox.find('.publish-label .ibx-label-glyph').ibxAddClass('ds-icon-unpublished');
		}

		if (!item.shown && item.fullPath.indexOf('/~') === -1)
		{
			iconState |= hidden
			
			jitembox.find('.show-label .ibx-label-glyph').ibxAddClass('ds-icon-hide');
		}
		
		if (item.sharedToOthers)
		{
			iconState |= shared;
			jitembox.find('.shared-label .ibx-label-glyph').ibxAddClass('ds-icon-share');
		}
		
		if (item.clientInfo && item.clientInfo.properties && item.clientInfo.properties.EnhancedRun === 'on')
		{
			iconState |= type;
			jitembox.find('.type-label .ibx-label-glyph').ibxAddClass('ds-icon-tap');
		}
		
		
		switch (iconState)
		{
			case 1: // private
				jitembox.find('.show-label').hide();
				jitembox.find('.shared-label').hide();
				jitembox.find('.type-label').hide();
				break;
			case 2:	// hidden
				jitembox.find('.publish-label').hide();
				jitembox.find('.shared-label').hide();
				jitembox.find('.type-label').hide();
				break;
			case 3:	// private & hidden
				jitembox.find('.shared-label').hide();
				jitembox.find('.type-label').hide();
				jitembox.find('img').css('margin-right', '72px');
				break;
			case 4:	// shared
				jitembox.find('.publish-label').hide();
				jitembox.find('.show-label').hide();
				jitembox.find('.type-label').hide();
				break;
			case 5:	// private & shared
				jitembox.find('.show-label').hide();
				jitembox.find('.type-label').hide();
				jitembox.find('img').css('margin-right', '72px');
				break;
			case 6:	// hidden & shared
				jitembox.find('.publish-label').hide();
				jitembox.find('.type-label').hide();
				jitembox.find('img').css('margin-right', '72px');
				break;
			case 7:  // private, hidden & shared
				jitembox.find('.type-label').hide();		
				jitembox.find('img').css('margin-right', '36px');
				break;
			case 8: // type
				jitembox.find('.publish-label').hide();
				jitembox.find('.show-label').hide();
				jitembox.find('.shared-label').hide();
				break;
			case 9:	// private & type
				jitembox.find('.show-label').hide();
				jitembox.find('.shared-label').hide();		
				jitembox.find('img').css('margin-right', '72px');
				break;
			case 10: // hidden & type
				jitembox.find('.publish-label').hide();
				jitembox.find('.shared-label').hide();		
				jitembox.find('img').css('margin-right', '72px');
				break;
			case 11: // private, hidden & type 
				jitembox.find('.shared-label').hide();		
				jitembox.find('img').css('margin-right', '36px');
				break;
			case 12: // shared & type
				jitembox.find('.publish-label').hide();
				jitembox.find('.show-label').hide();		
				jitembox.find('img').css('margin-right', '72px');
				break;
			case 13: // private, shared & type (1, 4 & 8)
				jitembox.find('.show-label').hide();
				jitembox.find('img').css('margin-right', '36px');
				break
			case 14: // private, hidden, shared & type
				break;
		}
		
		jitembox.on("drop", function(e)
		{
			e.preventDefault();				// best way to interact with IBX when ancestor is droppable, but this is not
		});
		
		if(this.options.isDraggable)
		{	
			jitembox.on("ibx_dragstart ibx_dragover ibx_dragleave ibx_drop", function(e)	// for items
			{
				var target = $(e.currentTarget);
				var dt = e.originalEvent.dataTransfer;
				if(e.type == "ibx_dragstart")
				{
					if (!this.element.find(".file-item-hbox").hasClass("file-item-selected"))	// dragstart must select if !selected
					{
						var ev = jQuery.Event("click");
						ev.ctrlKey = e.ctrlKey;
						this.element.trigger(ev);
					}
					
					var selItems =  home_globals.Items.getAllSelectedItems();
					if (!selItems.length)
						selItems = [target.data("item")];
					
					for (var i = 0; i < selItems.length; i++)
					{
						var item = selItems[i];
						var actions = item.actions;
						if (!e.ctrlKey)
						{
							if (actions.indexOf("delete") == -1 || actions.indexOf("open") == -1)
								return false;
						}
						else
						{
							if (actions.indexOf("open") == -1)
								return false;
						}
					}
					
					dt.setData("dragItem", selItems);
					var img = new Image(40, 40);
					$(img)
					img.src = target.data("item").thumbPath;
					dt.setDragImage(img, 5, 5);
				}
				
	 			else if(e.type == "ibx_dragover")
				{		
	 				dt.dropEffect = "none";
				}
				else if (e.type == "ibx_drop")
				{
					e.stopPropagation();	// don't let parent get this
				}
			}.bind(this));
		}
		
		if(item.summary)
		{	
			this.element.hover(function()
			{
				
				$(this).find(".file-item-text-box").show();
			    
			    }, function(){	    	
			    
			    $(this).find(".file-item-text-box").hide();	
			});
		}
		
		this.element.on("click", function(event)				
		{
			var key=0;
			if (event.ctrlKey || event.metaKey)
				key=1;
			if (event.shiftKey)
				key=2;		
			
			options.toggleSelected(item,key);
		});
		
		if(!options.mobile && options.fileSingleClick)
			this.element.on("click", options.fileSingleClick.bind(this.options.thisContext,item));
		else if(options.mobile && options.doubleclick)
			this.element.on("click", options.doubleclick.bind(this.options.thisContext,item));
			
		this.element.on('keyup', function(e)
        {
            if (e.key == ' ' || e.key == "Enter")
            {
                var key=0;
                if (event.ctrlKey || event.metaKey)
                    key=1;
                if (event.shiftKey)
                    key=2;        

 

                if (key == 0)
                {
                	if ($(e.target).find('.file-item-hbox').hasClass('file-item-selected'))
                        options.doubleclick(item);
                    else
                    {
                        if (!$(e.target).closest('.fbx-block').hasClass('navmap-focused'))
                            options.toggleSelected(item, key);
                        else
                            $(e.target).closest('.fbx-block').ibxRemoveClass('navmap-focused');
                    }
                }
            }
        }.bind(this));
		
		this.element.on("ibx_ctxmenu", function(e) 
		{
			e.stopPropagation();
			
			var res = options.context(this, item);
			if(res)
				e.menu = res;
			else 
				e.preventDefault();			
			options.toggleSelected(item, 3);
		});
		
		if(!options.mobile)
			this.element.on("dblclick", options.doubleclick.bind(this.options.thisContext,item));
		
		options.setCallBack(item.fullPath, this.element, false);
		
		if(item.selected)
			$(this.element).find(".file-item-hbox").ibxAddClass("file-item-selected");
		
		this.element.on( "selectSet", function( event )
		{			
//			$(this).find(".file-item-hbox").ibxAddClass("file-item-selected");
			$(this).find(".file-item").ibxAddClass("file-item-selected");
			$(this).find(".file-item").parent().ibxAddClass("focused");
			$(this).find(".tibco-color-bar").ibxAddClass("item-selected");
			iscrollIntoView($(this), $("#files-box-area"));
			
		});
		this.element.on( "selectUnset", function( event ) 
		{
			$(this).find(".tibco-color-bar").ibxRemoveClass("item-selected");
			$(this).find(".file-item").ibxRemoveClass("file-item-selected");
			$(this).find(".file-item").parent().ibxRemoveClass("focused");
//			$(this).find(".file-item-hbox").removeClass("file-item-selected");
		});
		
		this.element.on( "cutSet", function( event ) 
		{
			$(this).ibxAddClass("file-item-cut");
			
		});
		this.element.on( "cutUnset", function( event ) {
			
			$(this).removeClass("file-item-cut");
			
		});
	},
	// ask webfocus item boxes	
	_askdiv: function()
	{
		var options = this.options;
		var item = options.item;
		var glyphs = options.glyph;	
		if(item.properties && item.properties.EnhancedRun == "on")		
			glyphs = "ibx-icons ds-icon-tap";
		
		// is this a default image?
		
		var imageClass="item-image";		
		if(item.thumbPath && item.thumbPath.indexOf("ibi_html") > 0)
			{			
				imageClass = "item-image-default";
			}
		
		var ellipsisdiv;
		if(options.mobile)
		{	
			
			ellipsisdiv = $('<div>').ibxAddClass("image-menu2").ibxMenuButton({'glyphClasses':'fa fa-ellipsis-v','iconPosition': 'top'});
			ellipsisdiv.on("ibx_click", function(e){
				e.stopPropagation();
				options.toggleSelected(item, 3);
				e.menu = options.context(this, item);
			});
			ellipsisdiv.on("click", function(e){
				e.stopPropagation();			
			});
			
		}
		else ellipsisdiv = $('<div>').ibxAddClass("image-menu2");				
		
		var d = new Date(parseInt(item.lastModified, 10));	
		
		var lang = ibx.resourceMgr.language;
		
		var ddate = d.toLocaleDateString(lang) + "  " + d.toLocaleTimeString(lang);
		
		var jitemhbox;
		var jitemhbox0;
		var jitemvbox1;
		
		jitemhbox = $('<div>').ibxAddClass("ask-file-item-hbox").ibxHBox({'align':'stretch'});
		jitemhbox0 = $('<div>').ibxAddClass("ask-file-item-hbox").ibxHBox({'align':'stretch'});
		
		var tooltip="";	
		var description = item.description;
		if(!description || description.length == 0)
			description = item.name;
		description = description.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		if(options.bSearch)
		{	
			var tooltipText = ibx.resourceMgr.getString("ITEM_TOOLTIP1");
			tooltip = sformat(tooltipText, description, item.fullPath,ddate);
		}	
		else
		{
			var tooltipText = ibx.resourceMgr.getString("ITEM_TOOLTIP2");
			tooltip = sformat(tooltipText, description, ddate);			
		}		
		var text = description;
		if(item.adornment)text += (" (" + item.adornment + ")");
		if(!this.options.titleMode)
			text = item.name;
		
		var jglyphdiv = "";
		var jglyphdiv0 = "";
		var jaskPillBox = "";
		
		jglyphdiv = $('<div>').ibxAddClass("ask-image-text").ibxLabel({'glyphClasses': glyphs});
		jglyphdiv0 = $('<div>').ibxAddClass("ask-domain-text").ibxLabel();
		if(item.parentDescription)jglyphdiv0.ibxLabel("option", "text", item.parentDescription);
		jaskPillBox = $('<div>').ibxAddClass("ask-pill-box").ibxHBox({wrap:true});
		{
			// put the pills			
			if(item.children)
			{	
				for (var i = 0; i < item.children.length; i ++)
				{
					var description = item.children[i].description;
					var url = item.children[i].url;
					var jpillButton = $("<div>").ibxButton({"text":description}).ibxAddClass("ask-pill-button");	
					//item.useUrl  = url;
					if(this.options.runUrl)
						$(jpillButton).on("click", options.runUrl.bind(this.options.thisContext, item, url, false));
					jaskPillBox.append(jpillButton);					
				}
			}
		}
		
		jglyphdiv.ibxLabel("option","text", text);		
				
		
		if(item.sharedToOthers && item.type == "LinkItem")
			jglyphdiv.ibxLabel('option', 'overlays',[{'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'},
			                                     {'position':'bl','glyphClasses':'home-item-overlay ibx-icons ds-icon-shortcut'}]);		
		else if(item.sharedToOthers)
			jglyphdiv.ibxLabel('option', 'overlays', [{'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'}]);			
		else if(item.type == "LinkItem")										
			jglyphdiv.ibxLabel('option', 'overlays', [{'position':'bl','glyphClasses':'home-item-overlay ibx-icons ds-icon-shortcut'}]);
			
		var uSummary = "";
		
		var insightDiv = "";
		
		var jclass = "ask-file-item";
		var divstring=sformat('<div class="' + jclass + '" data-ibx-type="ibxWidget"><img draggable="false" class="{2}" src=" {1} " >{4}<div class="file-item-text-box">{3}</div></div>', 
				encodeURI(encodeURI(item.thumbPath)), imageClass, uSummary, insightDiv);
			
		var jitembox = $(divstring);
		if(item.published || item.inMyContent || item.parent == "MobileFavorites" || item.parent == "Favorites")jitembox.ibxAddClass("file-item-published");
		if(item.shown)
		jitembox.ibxAddClass("file-item-shown");	
		
		$(jitemhbox0).append(jglyphdiv0);
		$(jitembox).append(jitemhbox0);
		
		$(jitemhbox).append(jglyphdiv);
		
		var summary = item.summary ? item.summary: "";
		summary = summary.replace(/\n/g, "<br/>");
		uSummary = summary;
		
		if(item.summary)
		{	
			var itemvbox1 = sformat('<div class="ask-file-item-vbox ask-summary-text" data-ibx-type="ibxVBox"> {1} </div>', uSummary);			
			var jitemvbox1 = $(itemvbox1);
		}	
		
		$(jitembox).append(jitemhbox);
		
		$(jitembox).append(jitemvbox1);
		$(jitembox).append(jaskPillBox);			
				
		$(jitembox).find(".file-item-text-box").hide();
		$(jitembox).find(".ask-pill-box").hide();
		
		this.element.append(jitembox);	
		
		this.element.prop("title", tooltip);
		
		this.element.prop("aria-label", "tang");
		
		this.element.ibxAddClass("ask-file-item-container");

		this.element.on("click", function(event)				
		{
			var key=0;
			if (event.ctrlKey || event.metaKey)key=1;
			if (event.shiftKey)key=2;		
			options.toggleSelected(item,key);
		});
		
		
		options.setCallBack(item.fullPath, this.element, false);
		
		if(item.selected)
			$(this.element).find(".file-item-hbox").ibxAddClass("file-item-selected");
		
		this.element.on( "selectSet", function( event )
		{
			var width = $(this).find(".ask-file-item").width();
			$(this).data("width", width);
			var height = $(this).find(".ask-file-item").height();
			$(this).data("height", height);
			var elem = $('<span />', {'class':'ask-itembox-big',
                style:'position:fixed;top:-9999px'}).appendTo('body');
			var bigHeight = elem.innerHeight();
			var bigWidth = width;
			if(!ibxPlatformCheck.isMobile || screen.width > 500)
				bigWidth = elem.innerWidth();
			elem.remove();
			$(this).find(".ask-file-item").animate({
			      'width' : bigWidth,
			      'height': bigHeight 
			    }, 200);			
			
			$(this).find(".ask-pill-box").show();
			if(!ibxPlatformCheck.isMobile || screen.width > 500)
			{	
				$(this).find("img").ibxAddClass("item-image-big");
				$(this).find(".insight-div").ibxAddClass("item-image-big-insight");
			}	
			iscrollIntoView($(this), $("#files-box-area"));	
			
		});
		
		this.element.on( "selectUnset", function( event ) 
		{
			var width = $(this).data("width");
			var height = $(this).data("height");
			$(this).find(".ask-pill-box").hide();
			$(this).find(".ask-file-item").animate({
			      'width' : width,
			      'height': height 
			    }, 200);			
			
			$(this).find("img").removeClass("item-image-big");
			$(this).find(".insight-div").removeClass("item-image-big-insight");
			
		});	
		
		
		this.element.on("ibx_ctxmenu", function(e) 
		{
			e.stopPropagation();
			
			var res = askResultsMenu(this, item);
			if(res)
				e.menu = res;
			else 
				e.preventDefault();			
//			options.toggleSelected(item, 3);
		});
	}
});
//# sourceURL=itembox.js