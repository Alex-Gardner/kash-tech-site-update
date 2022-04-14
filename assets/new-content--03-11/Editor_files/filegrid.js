/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.55 $:
function filegrid()
{	
}	
	

var protoGrid = filegrid.prototype;
protoGrid.initialized=false;
protoGrid.parenatera=null;
protoGrid.columns=null;
protoGrid.gridarea="";
protoGrid.flexitem="";
protoGrid.jfilebox="";


	protoGrid.init = function (parentarea, columns, sortCallBack, selectedCallBack, setCallBack, showColumns, 
			openFolderCallBack, runCallBack, isMobile, thisContext, fileSingleClick, columnmenu, filemenu, 
			foldermenu, triModeSort, sortColumn)
	{			
			this.parentarea = parentarea;		
			this.initialized = true;		
			//this.gridarea=".grid-main";
			this.gridarea = parentarea;
			this.selectedCallBack = selectedCallBack;
			this.setCallBack = setCallBack;
			this.openFolderCallBack = openFolderCallBack;
			this.isMobile = isMobile;
			this.runCallBack = runCallBack;
			this.thisContext = thisContext;
			this.fileSingleClick = fileSingleClick;
			this.filemenu = filemenu;
			this.foldermenu = foldermenu;
			
			//$(parentarea).empty();
			$(parentarea).append($("<div>").ibxAddClass("class-created"));
			//this.gridmain = ".files-listing";
			this.gridmain = parentarea;
			//$(this.gridmain).empty();
			this.columns = columns;	
			this.showColumns = showColumns;
			this.maxColumns = 7;
			if(parentarea.width() > 100)this.maxColumns = Math.floor((parentarea.width() / 150)) + 1; 
			if(this.maxColumns == 0)this.maxColumns = 1;
			
			var ilen = columns.length;
			// build the title area
			var titlebox='<div tabindex="0" class="files-box-files-title"  data-ibx-type="ibxHBox" data-ibxp-align="center" >';
			var jtitlebox=$(titlebox);
			var currcol=0;
			var numvisibleitems=0;
			var maxwidth=95;
			for(i=0; i<ilen; i++ )
			{
				if(showColumns[i])
				{
					var type=columns[i][1];
					if(type!="icon" && type!="menu")numvisibleitems++;
					if(type=="menu")maxwidth=maxwidth-10;	
				}	
			}
			var percentitem = Math.floor(maxwidth / numvisibleitems) + "%";
			var flexitem = "1 1 " + percentitem;
			this.flexitem = flexitem;
			var icon = false;
			
			for(i=0; i<ilen; i++ )
			{
				if(showColumns[i])
				{	
					currcol++;
					
					var type=columns[i][1];
					var cell="";
					var jcell="";				
					if(type == "icon")
					{
						
						cell="";
						icon=true;
					}
					else if(type=="menu")
					{
						//cell="<div class='grid-cell-title'></div>";
						//jcell=$(cell);	
						//$(jcell).css("width", "10px");	
					}	
					else
					{
						if(currcol < this.maxColumns)
						{	
							var sorticon = "";
							if(columns[i][4] == "up")sorticon="arrow_upward";
							else if(columns[i][4] == "down")sorticon="arrow_downward";			

							var columnSizeClass = columns[i][1]=='date'? 'medium': columns[i][1]=='number'? 'small' : columns[i][1]=='boolean'? 'small' : columns[i][2]=='createdBy'? 'small' : '';
							cell="<div tabindex='-1' class='grid-cell-title "+columnSizeClass+"' data-ibxp-justify='left' data-ibx-type='ibxButtonSimple' data-ibxp-icon-position='right' data-ibxp-glyph-classes='material-icons'";
							cell+=sformat(" data-ibxp-glyph='{1}' data-ibxp-text='{2}' </div>", sorticon, columns[i][0]);
							jcell=$(cell);											
							
							jcell.on('keydown', function(colIdx, e)
							{
								switch(e.key)
								{
									case "ArrowRight":
									{
										var curBtn = $(e.target);
										if (curBtn.next().length)
											curBtn.next().focus();
										else
											curBtn.parent().children().first()[0].focus();
										break;
									}
									case "ArrowLeft":
									{
										var curBtn = $(e.target);
										if (curBtn.prev().length)
											curBtn.prev().focus();
										else
											curBtn.parent().children().last()[0].focus();
										break;
									}
									case "Tab":
									{
										e.preventDefault();
										if (e.shiftKey)
										{
											var foundTile = false;
											var actionTiles = $('.create-new-box').find('.create-new-item');
											$.each(actionTiles, function(idx, tile)
											{
												tile = $(tile);
												if (tile.is(":visible"))
												{
													foundTile = true;
													tile.focus();
													return false;
												}
											});
											if (!foundTile)
											{
												$('.content-title-btn2').focus();
											}
										}
										else
										{
										
											const children = $('.files-box-files-area').children();
											if (children.length !== 0)
												children[0].focus();
										}
										break;
									}
									case "Enter":
									case " ":
									{
										//console.log(home_globals.Items.getSortedValue());
;										var curBtn = $(e.target);
										if(typeof home_globals != "undefined")
										{
											if (home_globals.Items.getSortedValue() == "default")
											{
												var ariaText = ibx.resourceMgr.getString("hpreboot_workspaces_sort_icon_down");
												$(jtitlebox).dispatchEvent('add-alert', {"ariatext": ariaText});
											}
											else
											{	
												if(home_globals.Items.getSortedOrder() == "up")
												{
													var ariaText = ibx.resourceMgr.getString("hpreboot_workspaces_sort_icon_default");
													$(jtitlebox).dispatchEvent('add-alert', {"ariatext": ariaText});
												}
												else
												{
													var ariaText = ibx.resourceMgr.getString("hpreboot_workspaces_sort_icon_up");
													$(jtitlebox).dispatchEvent('add-alert', {"ariatext": ariaText});
												}
											}
										}
										else
										{
											e.stopPropagation();
											if (columns[colIdx][4] == "up")
											{
												var ariaText = ibx.resourceMgr.getString("hpreboot_workspaces_sort_icon_default");
												$(jtitlebox).dispatchEvent('add-alert', {"ariatext": ariaText});
											}
											else if (columns[colIdx][4] == "down")
											{
												var ariaText = ibx.resourceMgr.getString("hpreboot_workspaces_sort_icon_up");
												$(jtitlebox).dispatchEvent('add-alert', {"ariatext": ariaText});
											}
											else
											{
												var ariaText = ibx.resourceMgr.getString("hpreboot_workspaces_sort_icon_down");
												$(jtitlebox).dispatchEvent('add-alert', {"ariatext": ariaText});
											}
										}
										break;
									}
								}
							}.bind(this, i));
							
							if(columns[i][4] == "up" && triModeSort)
							{
								jcell.on("click", sortCallBack.bind(this.thisContext, "default", "", true, currcol-2));							
							}
							else
							{
								jcell.on("click", sortCallBack.bind(this.thisContext, columns[i][2], columns[i][1], true, currcol-2));							
							}				
							if(icon == true)
							{							
								icon = false;
							}
														
						}
					}	
					if(cell != "")
					{					
						//if(type!="menu")$(jcell).css("flex", flexitem);
						if(type!="menu")$(jcell).css("width", "20px");
						$(jtitlebox).append(jcell);
					}				
				}			
			}
			
			jtitlebox.on('focus', function()
			{
				$(this).children()[0].focus();
			});

			// we now add an options menu at the end
			var cell="<div tabindex='-1' class='grid-cell-title grid-cell-title-cog' data-ibxp-justify='left' data-ibxp-glyph-classes='fa fa-cog' data-ibx-type='ibxButton' ></div>";
			var jcell=$(cell);	
			jcell.attr("title", ibx.resourceMgr.getString("button_choose_columns"));
			
			jcell.on("click", columnmenu.bind(this.thisContext, jcell));
			$(jtitlebox).append(jcell);

			jcell.on('keydown', function(e)
			{
				switch(e.key)
				{
					case "ArrowRight":
					{
						var curBtn = $(e.target);
						if (curBtn.next().length)
							curBtn.next().focus();
						else
							curBtn.parent().children().first()[0].focus();
						break;
					}
					case "ArrowLeft":
					{
						var curBtn = $(e.target);
						if (curBtn.prev().length)
							curBtn.prev().focus();
						else
							curBtn.parent().children().last()[0].focus();
						break;
					}
					case "Tab":
					{
						e.preventDefault();
						$('.files-box-files-area').children()[0].focus();
						break;
					}
				}
			});
			
			$(this.gridmain).append(jtitlebox);
			ibx.bindElements(this.gridmain);
			if (typeof sortColumn != 'undefined' && sortColumn !== null)
			{
				jtitlebox.children()[sortColumn].focus();
			}
			
			var filebox='<div class="files-box-files-area" id="files-box-files-area" data-ibx-type="ibxVBox" data-ibxp-align="stretch"></div>';
			filebox = $(filebox)
			filebox.on('keydown', function(e)
			{
				if (e.key == "ArrowDown")
				{
					e.preventDefault();
					if ($(e.target).next().length)
						$(e.target).next().focus();
					else
						$(e.target).parent().children()[0].focus();
				}
				else if (e.key == "ArrowUp")
				{
					e.preventDefault();
					if ($(e.target).prev().length)
						$(e.target).prev().focus();
					else
						$(e.target).parent().children().last().focus();
				}
			});
			
			$(jtitlebox).on('add-alert', function(e)
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
			
			
			
			
			this.jfilebox=filebox;
	};
	
	
	
	protoGrid.addrow = function(data, ibfsitem, folder, inrow, isDraggable)
	{
		
		var grname="grid_row" + inrow ;
		var rowTitle = ""; 	
		var jrowbox = null;
		if (folder)
		{
			if (isDraggable && !this.isMobile)
				jrowbox = $('<div tabindex="-1" data-ibxp-draggable="true" data-ibxp-external-drop-target="true">').ibxAddClass("files-box-files-row " + grname).ibxHBox({'align':'center'});
			else
				jrowbox = $('<div tabindex="-1" data-ibxp-external-drop-target="true">').ibxAddClass("files-box-files-row " + grname).ibxHBox({'align':'center'});
		}
		else
		{
			if (isDraggable && !this.isMobile)
				jrowbox = $('<div tabindex="-1" data-ibxp-draggable="true">').ibxAddClass("files-box-files-row " + grname).ibxHBox({'align':'center'});
			else
				jrowbox = $('<div tabindex="-1" >').ibxAddClass("files-box-files-row " + grname).ibxHBox({'align':'center'});
		}
			
		jrowbox.data("item", ibfsitem);
		if (folder)
		{
			jrowbox.on("ibx_beforefilesupload", function(e, ajaxOptions)
			{
				e.stopPropagation();
				numUploadFiles = e.originalEvent.dataTransfer.files.length;
	
				var applyToExisting = "";
				var fIdx = 0;
				var files = e.originalEvent.dataTransfer.files;
	
				var targetPath = null;
				var item =  $(e.originalEvent.target.parentElement).data("item");
				if (!item)
					item =  $(e.originalEvent.target.parentElement.parentElement).data("item");
				
				targetPath = item.fullPath;
				
				preprocessFiles(files, targetPath);
				processUpload({"index":fIdx, "files":files, "applyToExisting":applyToExisting, "targetPath": targetPath});
			});
		}
		
		var columns=this.columns;
		var showColumns=this.showColumns;
		var ilen=columns.length;
		var currcol=0;
		
		var icon = false;
		var iconcol = -1;
		var havemenu = false;
		var i;
		for(i=0; i<ilen; i++ )
		{	
			var cellTitle = "";
			if(showColumns[i])
			{			
					
				currcol++;
				var cell="";
				var jcell="";
				var cellvalue =  "";
				
				var type=columns[i][1];
				var name=columns[i][2];
				
				if(type=="icon")
				{				
					icon = true;
					iconcol = i;
				}	
				else if(type=="alpha" || type=="number" || type=="date" || type == "boolean")
				{	
					var columnSizeClass = type=='date'? 'medium': type=='number'? 'small' : type=='boolean'? 'small' : name=='createdBy'? 'small' : '';

					if(currcol < this.maxColumns)
					{	
						
						if(type == "boolean")
						{	
							if(data[i])
								jcell = $('<div class="grid-cell-data '+columnSizeClass+'"><i class="fa fa-check"></i></div>');
							else 
								jcell = $('<div class="grid-cell-data '+columnSizeClass+'"></div>');
						}	
						else if(!icon)
						{							
							if (columnSizeClass=='')								
								jcell = $('<div class="grid-cell-data">' + data[i] +'</div>');
							else								
								jcell = $('<div class="grid-cell-data ' + columnSizeClass + '">' + data[i] +'</div>');
							
							if (typeof home_globals != "undefined" && home_globals.currentItem && home_globals.currentItem.pwa)
							{
								if (columns[i][2] == 'scmStatus')
									jcell.ibxAddClass('list-scm-text ' + data[i]);
							}
						}	
						else
						{
							jcell = $('<div>').ibxAddClass("grid-cell-data " + columnSizeClass).ibxLabel({"iconPosition":"left","text":data[i]});
							//jcell = $('<div>').addClass("grid-cell-data " + columnSizeClass).ibxLabel({"iconPosition":"left","text":data[i]});
							jcell.ibxLabel("option", "glyphClasses", data[iconcol]);
							
							if (typeof home_globals != "undefined" && home_globals.currentItem && home_globals.currentItem.pwa)
							{
								if (columns[i][2] == 'scmStatus')
									jcell.ibxAddClass('list-scm-text ' + data[i]);
							}

							if(folder)
							{
								jcell.ibxAddClass(ibfsitem.type == "PRTLXBundle" ? "files-box-files-portal-icon" : "files-box-files-folder-icon");
								var myContentFolder = ibfsitem.inMyContent;
								if(myContentFolder)
								{
									var paths = ibfsitem.parentPath.split("/");
									var j;
									for (j = 0; j < paths.length; j++)
									{
										if(paths[j].indexOf("~") == 0)
										{
											myContentFolder = false;
											break;					
										}	
									}	
								}	
								var overlays = [];
								if(myContentFolder && ibfsitem.sharedToOthers)
								{	
									overlays.push({'position':'bl','glyphClasses':'home-item-overlay fa fa-user'});
									overlays.push({'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'});
								}
								else if(myContentFolder)
									overlays.push({'position':'bl','glyphClasses':'home-item-overlay fa fa-user'});
								else if(ibfsitem.inMyContent && ibfsitem.sharedToOthers)
									overlays.push({'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'});
								if(ibfsitem.type == "LinkItem")
									overlays.push({'position':'bl','glyphClasses':'home-item-overlay ibx-icons ds-icon-shortcut'});

								if(overlays.length > 0)jcell.ibxLabel('option', 'overlays', overlays);
																
							}
							else
							{	
								if(ibfsitem.parent != "Favorites" && ibfsitem.parent != "MobileFavorites")
								{
									var overlays = [];

									if(ibfsitem.sharedToOthers && ibfsitem.type == "LinkItem")
										jcell.ibxLabel('option', 'overlays',[{'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'},
										                                     {'position':'bl','glyphClasses':'home-item-overlay ibx-icons ds-icon-shortcut'}]);
									else if(ibfsitem.sharedToOthers)	
										overlays.push({'position':'br','glyphClasses':'home-item-overlay fa fa-share-alt'});
									else if(ibfsitem.type == "LinkItem")
										overlays.push({'position':'bl','glyphClasses':'home-item-overlay ibx-icons ds-icon-shortcut'});
										
									if (typeof home_globals != "undefined" && home_globals.isWorkspace && ibfsitem.actions.indexOf('unsubscribe') != -1)
										overlays.push({'position':'ur','glyphClasses':'home-item-overlay fas fa-circle'});
										
									if (overlays.length)
										jcell.ibxLabel('option', 'overlays', overlays);
								}
							}
							
							icon=false;
							
						}
						
						var colName = columns[i][0];
						cellTitle = cellTitle.concat(colName, " ");
						
						// Add a tooltip
						if(type == "alpha" && data[i].length > 0 && data[i].trim() != '')
						{
							var title = data[i].replace(/<br\/>/g, "\n");
							title = title.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
							jcell.attr('title', title);
							cellvalue = title;
						}
						else
						{
							var title = "";
							if(type != "boolean")
							{
								title = data[i].replace(/<br\/>/g, "\n");
								title = title.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
							}
							else
							{
								title = data[i];
							}
							cellvalue = title;
						}
						
					}					

				}	
				else if(type=="menu")
				{	
						
					jcell = $('<div>').ibxAddClass("cell-image").ibxMenuButton({'glyphClasses':'fa fa-ellipsis-v','iconPosition': 'top'});
					if(folder && this.foldermenu)
					{	
						jcell.on("ibx_click", function(event){
							this.selectedCallBack(ibfsitem,3);
							event.menu = this.foldermenu(event,ibfsitem);
						}.bind(this));
						jcell.on("click", function(event)
						{
							event.stopPropagation();
						});		
						
					}	
					else if(this.filemenu)
					{
						jcell.on("ibx_click", function(event){
							this.selectedCallBack(ibfsitem,3);
							event.menu = this.filemenu(event,ibfsitem);
						}.bind(this));
						jcell.on("click", function(event)
						{
							event.stopPropagation();
						});		
					}
					
					jcell.css("width", "10px");
					havemenu = true;
				}
				
				if(jcell != "" && this.isMobile && type != "menu")
				{
					if(!folder)
					{
						jcell.on("click", this.runCallBack.bind(this.thisContext,ibfsitem));
									
					}
					else
					{
						jcell.on("click", this.openFolderCallBack.bind(this.thisContext,ibfsitem));						
					}
				}	
				
				if(jcell!="")
				{
					//if(type!="menu")jcell.css("flex", this.flexitem);				
					if(type!="menu")jcell.css("width", "20px");
					
					jrowbox.append(jcell);
					if(!havemenu)
					{
						jcell = $('<div>').css("width", "10px");						
						//jrowbox.append(jcell);
					}
				}
				
				if(columns[i][3] && cellTitle != null && cellTitle.length > 0)
				{	
					if(cellvalue == null || cellvalue.length < 1)
	                {
	                	cellvalue =  jcell.outerText;
	                	if(cellvalue == null || cellvalue.length < 1)
						{
							cellvalue = "";
						}
	                }
					
					if(rowTitle == "")
	    			{
						rowTitle = ibx.resourceMgr.getString("hpreboot_row");
	    				rowTitle = rowTitle.concat(" = {");
	    			}
	                else
	                {
	                	rowTitle = rowTitle.concat(", ");
	                }
	                cellTitle = cellTitle.concat(cellvalue);
	                rowTitle = rowTitle.concat(cellTitle);
	                
				}
            }	
		}		
		var odd = false;
		if(inrow % 2 == 0)odd = true;
		if(odd)jrowbox.ibxAddClass("grid-row-odd");
		if(ibfsitem.published || ibfsitem.inMyContent || ibfsitem.parent == "MobileFavorites" || ibfsitem.parent == "Favorites")jrowbox.ibxAddClass("file-list-item-published");
		if(ibfsitem.shown)jrowbox.ibxAddClass("file-list-item-shown");	
		var x="."+grname;
		
		
		if(!this.isMobile)
		{	
			jrowbox.on('keydown', function(ibfsitem, e)
			{
				if (e.key == ' ' || e.key == 'Enter')
				{
					if (ibfsitem.selected)
						this.dispatchEvent('dblclick');
					else
						this.dispatchEvent('click');
				}
			}.bind(jrowbox, ibfsitem));

			if(!folder)
			{
				jrowbox.on("dblclick", this.runCallBack.bind(this.thisContext,ibfsitem));
				if(this.filemenu)
				{
					jrowbox.on("ibx_ctxmenu", function(event)
					{	
						event.stopPropagation();
						
						var res = this.filemenu(event,ibfsitem);
						if(res)
							event.menu = res;
						else
							event.preventDefault();
						this.selectedCallBack(ibfsitem,3);
					}.bind(this));
				}
			}
			else
			{
				jrowbox.on("dblclick", this.openFolderCallBack.bind(this.thisContext,ibfsitem));
				if(this.foldermenu)
				{
					jrowbox.on("ibx_ctxmenu", function(event)
					{
						event.stopPropagation();
						this.selectedCallBack(ibfsitem,3);
						var res = this.foldermenu(event,ibfsitem);
						if(res)
							event.menu = res;
						else
							event.preventDefault();
					}.bind(this));
				}
			}
		}
		
		
		jrowbox.hover(function()
				{
					if(odd)$(x).removeClass("grid-row-odd");
				    $(x).ibxAddClass("grid-row-hover");
				    }, function(){	    	
				    $(x).removeClass("grid-row-hover");
				    if(odd)$(x).ibxAddClass("grid-row-odd");
				});
		
		jrowbox.click(function(event)				
		{ 
				var key=0;
				if (event.ctrlKey || event.metaKey)key=1;
				if (event.shiftKey)key=2;
				var isSelected = this.selectedCallBack(ibfsitem,key);
									
		}.bind(this));
		if(this.fileSingleClick)jrowbox.on("click", this.fileSingleClick.bind(this.thisContext,ibfsitem));		
		
		if(ibfsitem.selected)jrowbox.ibxAddClass("grid-row-selected");
		
		jrowbox.on( "selectSet", function( event ) {	
			if(odd)jrowbox.removeClass("grid-row-odd");
			jrowbox.ibxAddClass("grid-row-selected");
			iscrollIntoView($(this), $("#files-box-files-area"));
		});
		jrowbox.on( "selectUnset", function( event ) {	
			
			jrowbox.removeClass("grid-row-selected");
			if(odd)jrowbox.ibxAddClass("grid-row-odd");
		});
		jrowbox.on( "cutSet", function( event ) {	
			if(odd)jrowbox.removeClass("grid-row-odd");
			jrowbox.ibxAddClass("grid-cell-data-cut");
		});
		jrowbox.on( "cutUnset", function( event ) {	
			
			jrowbox.removeClass("grid-cell-data-cut");
			if(odd)jrowbox.ibxAddClass("grid-row-odd");
		});
		
		
		this.setCallBack(ibfsitem.fullPath, jrowbox, true);
		
		this.jfilebox.append(jrowbox);
		
		if(isDraggable)
		{
			if (folder)
			{
				jrowbox.on("ibx_dragstart ibx_dragover ibx_dragleave ibx_drop", function(e)	// for folder
				{
					e.stopPropagation();	// don't allow drop to get to parent
					
					var target = $(e.currentTarget);
					var dt = e.originalEvent.dataTransfer;
					if(e.type == "ibx_dragstart")
					{
						if (!this.hasClass("grid-row-selected"))	// dragstart must select if !selected
							this.trigger("click");
						
						var selItems =  home_globals.Items.getAllSelectedItems();
						if (!selItems.length)
							selItems = [target.data("item")];
						
						var doStart = true;
						$.each(selItems, function()
						{
							if (this.clientInfo.properties.Cascade)
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
										home_globals.homePage.paste(trgFolder);
									}
								});
								
								dlg.ibxDialog("open");
							}
							else
							{
								home_globals.homePage.copy(dragItem[0], dragItem);
								home_globals.homePage.paste(trgFolder);
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
				}.bind(jrowbox));
			}
			else
			{
				jrowbox.on("ibx_dragstart ibx_dragover ibx_dragleave ibx_drop", function(e)	// for items
				{
					var target = $(e.currentTarget);
					var dt = e.originalEvent.dataTransfer;
					if(e.type == "ibx_dragstart")
					{
						if (!this.hasClass("grid-row-selected"))	// dragstart must select if !selected
							this.trigger("click");

						var selItems =  home_globals.Items.getAllSelectedItems();
						if (!selItems.length)
							selItems = [target.data("item")];
						
						dt.setData("dragItem", selItems);
						var img = new Image(40, 40);
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
				}.bind(jrowbox));
			}
		}
		
		rowTitle = rowTitle.concat("}");
		jrowbox.attr("aria-label", rowTitle);
		
		

	};
	
	
	protoGrid.addtoMain = function()
	{
		
		$(this.gridmain).append(this.jfilebox);
		
	};	


//# sourceURL=filegrid.js
