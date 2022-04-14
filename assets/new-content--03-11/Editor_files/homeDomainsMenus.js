/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.22 $:

function domainMenus(domains, menuHandlers)
{
	this._domainsContent = domains;
	this._menuHandlers = menuHandlers;
	
	
	this.toolActionMap = [];
	this.toolActionMap["editor"] = "editor";
	this.toolActionMap["infoAssist,report,IAFull"] = "infoAssist,infoAssistBasic,designerMetadata,infoAssistViaReportingObject";
	this.toolActionMap["infoAssist,report,IAFull,DataPrep"] = "infoAssist";
	this.toolActionMap["infoAssist,report,IAFull,runasolap"] = "infoAssist";
	this.toolActionMap["infoAssist,chart,IAFull"] = "infoAssist,infoAssistBasic,designerMetadata,infoAssistViaReportingObject";
	this.toolActionMap["infoAssist,chart,IAFull,FrameWork"] = "infoAssist";	// latest for DF
	this.toolActionMap["infoAssist,compose,IAFull"] = "infoAssist";
	this.toolActionMap["infoAssist,dashboard,IAFull"] = "infoAssist";
	this.toolActionMap["infoAssist,report,IABasic"] = "infoAssistBasic,infoAssist";
	this.toolActionMap["infoAssist,chart,IABasic"] = "infoAssistBasic,infoAssist";
	this.toolActionMap["infoAssist,compose,IABasic"] = "infoAssistBasic";
	this.toolActionMap["infoAssist,report"] = "infoAssist";
	this.toolActionMap["infoAssist,chart"] = "infoAssist";
	this.toolActionMap["infoAssist,compose"] = "infoAssist";
	this.toolActionMap["infoAssist,dashboard"] = "infoAssist";
	this.toolActionMap["DataVisualization,IAFull"] = "infoAssist,infoAssistDataVisualize";
	this.toolActionMap["infoAssist,DataVisualization,IAFull"] = "infoAssist";
	this.toolActionMap["rotool,IAFull"] = "reportingObject";
	this.toolActionMap["alertwizard,alertAssist,IAFull"] = "alertAssist";
	this.toolActionMap["alertwizard,alertAssist,IABasic"] = "alertAssist";
	this.toolActionMap["AdvGassist"] = "infoAssist";
	this.toolActionMap["rassist"] = "infoAssist";
	this.toolActionMap["gassist"] = "infoAssist";
	this.toolActionMap["pwrpaint"] = "infoAssist";
	this.toolActionMap["infoassist"] = "infoAssist";
	this.toolActionMap["rotool"] = "reportingObject";
	this.toolActionMap["rotool,IAFull"] = "reportingObject";
	this.toolActionMap["rotool,IABasic"] = "reportingObject";
	this.toolActionMap["url"] = "url";
	this.toolActionMap["blog"] = "annotations";
	this.toolActionMap["schedule"] = "scheduleAdvancedTool,scheduleTaskMR";
	this.toolActionMap["addressbook"] = "addressbook";
	this.toolActionMap["accesslist"] = "accesslist";
	this.toolActionMap["reportLibrary"] = 
	this.toolActionMap["PGXBundle"] = "appDesigner";
	this.toolActionMap["PRTLXBundle"] = "prtlxDesigner";
	this.toolActionMap['FexInfoMini'] = "infoAssist";
	this.toolActionMap["BIPWFCPortalItem"] = "editPortal";
	this.toolActionMap["BIPWFCPortalPageItem"] = "pageDesigner";
	this.toolActionMap["BipPortalsPortal"] = "editPortal";
	this.toolActionMap["ely"] = "infoAssist";
}

var dmProto = domainMenus.prototype;


dmProto.shouldSuppressCommand = function shouldSuppressCommand(e)
{
	var suppress = false;
	
	if (e.relatedTarget.nodeName.toLowerCase() == "textarea")
		suppress = true;
	else if (e.relatedTarget.nodeName.toLowerCase() == "input")
	{ 
		var type = $(e.relatedTarget).attr("type").toLowerCase(); 
		if ( type == "text" || type == "search" || type == "password")
			suppress = true;
	}
	else if ($(e.relatedTarget).is(".ibx-dialog"))
		suppress = true;
	else if ($(e.relatedTarget).is(".ibx-tab-button"))
		suppress = true;
	else if ( $(e.relatedTarget).is(".file-item") && !$(e.relatedTarget).is(".ibx-draggable") )
		suppress = true;
	else if ($(e.relatedTarget).is(".sd-tab-pane"))
		suppress = true;
	else if ($(e.relatedTarget.parentNode).is(".grid-cell-data") || $(e.relatedTarget.parentNode).is(".image-text"))
		suppress = true;
	
	return suppress;
};

dmProto.initCommands = function initCommands()
{
	var cmds = ibx.resourceMgr.getResource(".cmd");
	for (var c = 0; c < cmds.length; c++)
	{
		var cmd = $(cmds[c]);
		switch(cmd.ibxWidget("option", "id"))
		{
			case "cmdCut":
				cmd.on("ibx_triggered", function(e)
				{
					if (this.shouldSuppressCommand(e))
						return;
					
					var fromKey = false;
					var contextItem;
					
					if ($(e.relatedTarget).attr("data-ibx-type") == "ibxMenuItem")
						contextItem = $(e.target).data("contextItem"); 
					else
					{
						contextItem = hprbUtil.environment.currentItem; // if nothing get selected, currentItem is null
						fromKey = true;
					}
					if (contextItem != null)
					{
						var selItems = hprbUtil.environment.Items.getAllSelectedItems();
						for (var i = 0; i < selItems.length; i++)
						{
							if (selItems[i].type == "PRTLXBundle")
								return;
						}
						hprbUtil.environment.homePage.cut(contextItem,  selItems, fromKey, contextItem.fromTree);
					}
				}.bind(this));
				break;
			case "cmdCopy":
				cmd.on("ibx_triggered", function(e)
				{
					if (this.shouldSuppressCommand(e))
						return;
					
					var fromKey = false;
					var contextItem;
					
					if ($(e.relatedTarget).attr("data-ibx-type") == "ibxMenuItem")
						contextItem = $(e.target).data("contextItem"); 
					else
					{
						contextItem = hprbUtil.environment.currentItem;
						fromKey = true;
					}
					
					if (contextItem != null)
					{
						var selItems = hprbUtil.environment.Items.getAllSelectedItems();
						for (var i = 0; i < selItems.length; i++)
						{
							if (selItems[i].type == "PRTLXBundle")
								return;
						}
						
						hprbUtil.environment.homePage.copy(contextItem,  selItems, fromKey);
					}
				}.bind(this));
				break;
			case "cmdPaste":
				cmd.on("ibx_triggered", function(e)
				{
					if (this.shouldSuppressCommand(e))
						return;

					if (hprbUtil.environment.homepageMode == 1)
						return;
					
					var options = {}; 
					var fromKey = false;
					var contextItem;
					
					if ($(e.relatedTarget).attr("data-ibx-type") == "ibxMenuItem")
					{
						contextItem = $(e.target).data("contextItem");
					}
					else
					{
						contextItem = hprbUtil.environment.currentItem; // if nothing get selected, currentItem is null
						fromKey = true;
					}
					
					
					if (contextItem != null)
					{
						if (hprbUtil.environment.copyCutVerb === 'cut')
						{
							var ccrs = hprbUtil.environment.copyCutResources.length;
							// menu paste disabled for cut to parent; for ctrl-v, clear selection
							for (var i = 0; i < ccrs; i++)
							{
								if (contextItem.fullPath + '/' === hprbUtil.environment.copyCutResources[i].parentPath)
								{
									$('.files-box-files').find('.file-item-cut').ibxRemoveClass('file-item-cut');
									return;
								}
							}
						}

						hprbUtil.environment.homePage.paste(contextItem, hprbUtil.environment.Items.getAllSelectedItems(), fromKey, contextItem.fromTree);
					}
				}.bind(this));
				break;
			case "cmdDelete":
				cmd.on("ibx_triggered", function(e)
				{
					if (this.shouldSuppressCommand(e))
						return;
					
					var fromKey = false;
					var contextItem;
					
					if ($(e.relatedTarget).attr("data-ibx-type") == "ibxMenuItem")
						contextItem = $(e.target).data("contextItem"); 
					else
					{
						contextItem = $(e.relatedTarget).data("item");
						fromKey = true;
					}
					
					this._menuHandlers.deleteItem(contextItem,  $(e.target).data("selectedItems"), fromKey);							
				}.bind(this));
				break;
			case "cmdPublish":
				cmd.on("ibx_triggered", function(e)
				{
					this._menuHandlers.publish($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
				}.bind(this));
				break;
			case "cmdUnpublish":
				cmd.on("ibx_triggered", function(e)
				{
					this._menuHandlers.unpublish($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
				}.bind(this));
				break;
			case "cmdShow":
				cmd.on("ibx_triggered", function(e)
				{
					this._menuHandlers.show($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
				}.bind(this));
				break;
			case "cmdHide":
				cmd.on("ibx_triggered", function(e)
				{
					this._menuHandlers.hide($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
				}.bind(this));
				break;
			case "cmdRun":
				cmd.on("ibx_triggered", function(e)
				{
					this._menuHandlers.runIt($(e.target).data("contextItem"));
				}.bind(this));
				break;
				
			case "cmdEdit":
				cmd.on("ibx_triggered", function(e)
				{
					this._menuHandlers.editIt($(e.target).data("contextItem"));
				}.bind(this));
				break;
				
			case "cmdShareBasic":
				cmd.on("ibx_triggered", function(e)
				{
					this._menuHandlers.shareBasic($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
				}.bind(this));
				break;
				
			case "cmdShareAdvanced":
				cmd.on("ibx_triggered", function(e)
				{
					this._menuHandlers.shareAdvanced($(e.target).data("contextItem"));							
				}.bind(this));
				break;
				
			case "cmdUnshare":
				cmd.on("ibx_triggered", function(e)
				{
					this._menuHandlers.unshare($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
				}.bind(this));
				break;
		}
	}
};

dmProto.initMenu = function initMenu(type)
{
	if (type == "item")
	{
		if (hprbUtil.environment.isMobile || hprbUtil.environment.lowHeight)
		{
			var mb_edit_menu = ibx.resourceMgr.getResource(".mobile-edit-menu");
			var jqMbItemMenu = $(mb_edit_menu);

/*			jqMbItemMenu.data('ibxWidget').mbMenuItemRun.on("ibx_menu_item_click",function(e)
			{
				hprbUtil.environment.homePage.runIt($(e.target).data("contextItem"));
			});
*/
			jqMbItemMenu.data('ibxWidget').mbMenuItemRunInNewWindow.on("ibx_menu_item_click",function(e)
			{
				hprbUtil.environment.homePage.runInNewWindow($(e.target).data("contextItem"));							
			});
			
/*			jqMbItemMenu.data('ibxWidget').mbMenuItemRunPortalInNewWindow.on("ibx_menu_item_click",function(e)
			{
				hprbUtil.environment.homePage.runInNewWindow($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
			}); */
			
			jqMbItemMenu.data('ibxWidget').mbMenuItemAddToFavorites.on("ibx_menu_item_click",function(e)
			{
				this._menuHandlers.addToFavorites($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
			}.bind(this));

			jqMbItemMenu.data('ibxWidget').mbMenuItemRemoveFavorite.on("ibx_menu_item_click",function(e)
			{
				this._menuHandlers.removeFavorite($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
			}.bind(this));

			/*jqMbItemMenu.data('ibxWidget').mbMenuItemRemoveRecent.on("ibx_menu_item_click",function(e)
			{
				hprbUtil.environment.homePage.removeRecent($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
			});*/

			return jqMbItemMenu;
		}
		
		var edit_menu = ibx.resourceMgr.getResource(".item-menu");
		var jqItemMenu = $(edit_menu);
		
		// adjust order of library submenu if configured so
		if (hprbUtil.environment.libraryViewAll)
		{
			var viewLastMenuItem = $(jqItemMenu).find("[data-ibx-name='miMenuItemLibViewLast']");
			var viewAllMenuItem = $(jqItemMenu).find("[data-ibx-name='miMenuItemLibViewAll']");
			viewLastMenuItem.insertAfter(viewAllMenuItem);
		}
		
		jqItemMenu.data('ibxWidget').miMenuItemEditParameters.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.editParameters($(e.target).data("contextItem"));
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').miMenuItemRunPortalInNewWindow.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.runInNewWindow($(e.target).data("contextItem"));
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').menuInteractiveRuntime.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.runIt($(e.target).data("contextItem"));
		});	
		jqItemMenu.data('ibxWidget').miMenuElyReportObject.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.elyFromRO($(e.target).data("contextItem"));
		});	
		jqItemMenu.data('ibxWidget').miMenuElyMasterFile.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.editIt($(e.target).data("contextItem"));							
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').miMenuItemEditPrtlx.on("ibx_menu_item_click",function(e)
		{
			setTimeout(function()
			{
				this._menuHandlers.processV5Portal("edit", $(e.target).data("contextItem"));
			}.bind(this), 10);
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').miMenuItemImport.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.importPackage($(e.target).data("contextItem"));							
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').miMenuItemEditScenario.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.editScenario($(e.target).data("contextItem"));							
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').miMenuItemDownloadZip.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.downloadZip($(e.target).data("contextItem"));							
		}.bind(this));
/*
		jqItemMenu.data('ibxWidget').miMenuItemRun.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.runIt($(e.target).data("contextItem"));
		});
		
		jqItemMenu.data('ibxWidget').miMenuItemEdit.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.editIt($(e.target).data("contextItem"));							
		});
		jqItemMenu.data('ibxWidget').miMenuItemEditSch.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.editIt($(e.target).data("contextItem"));							
		});
*/		
		jqItemMenu.data('ibxWidget').miMenuItemEditWithTE.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.editWithTE($(e.target).data("contextItem"));							
		});
/*		
		jqItemMenu.data('ibxWidget').miMenuItemDelete.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.deleteItem($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
*/
		
		jqItemMenu.data('ibxWidget').miMenuItemEditMas.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.editMasterFile($(e.target).data("contextItem"));							
		});
		jqItemMenu.data('ibxWidget').miMenuItemRunCube.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.launchCubeBrowser($(e.target).data("contextItem"));							
		});
/*		
		jqItemMenu.data('ibxWidget').miMenuInsightDesignerChart.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.newIA({"tool":"insightDesignerChart", "item":$(e.target).data("contextItem")});							
		});
				
		jqItemMenu.data('ibxWidget').miMenuInsightDesignerReport.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.newIA({"tool":"insightDesignerReport", "item":$(e.target).data("contextItem")});							
		});
		jqItemMenu.data('ibxWidget').miMenuInsightDesignerWorkbook.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.newIA({"tool":"insightDesignerWorkBook", "item":$(e.target).data("contextItem")});							
		});
*/				
		jqItemMenu.data('ibxWidget').miMenuDocument.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.newIA({"tool":"document", "item":$(e.target).data("contextItem")});							
		}.bind(this));		
		jqItemMenu.data('ibxWidget').miMenuChart.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.newIA({"tool":"chart", "item":$(e.target).data("contextItem")});							
		}.bind(this));
		jqItemMenu.data('ibxWidget').miMenuReport.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.newIA({"tool":"report", "item":$(e.target).data("contextItem")});							
		}.bind(this));
		jqItemMenu.data('ibxWidget').miMenuReport2.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.newIA({"tool":"report", "item":$(e.target).data("contextItem")});							
		}.bind(this));
		jqItemMenu.data('ibxWidget').miMenuChart2.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.newIA({"tool":"chart", "item":$(e.target).data("contextItem")});							
		}.bind(this));
		jqItemMenu.data('ibxWidget').miMenuDocument2.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.newIA({"tool":"document", "item":$(e.target).data("contextItem")});							
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').miMenuVis.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.newIA({"tool":"idis", "item":$(e.target).data("contextItem")});							
		});
		jqItemMenu.data('ibxWidget').miMenuItemDuplicate.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.duplicate($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));
/*		
		jqItemMenu.data('ibxWidget').miMenuVis2.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.newIA({"tool":"idis", "item":$(e.target).data("contextItem")});							
		});
		jqItemMenu.data('ibxWidget').miMenuItemCut.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.cut($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqItemMenu.data('ibxWidget').miMenuItemCopy.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.copy($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
	
		jqItemMenu.data('ibxWidget').miMenuItemPublish.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.publish($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqItemMenu.data('ibxWidget').miMenuItemUnpublish.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.unpublish($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqItemMenu.data('ibxWidget').miMenuItemHide.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.hide($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqItemMenu.data('ibxWidget').miMenuItemShow.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.show($(e.target).data("contextItem"));							
		});
*/			
		jqItemMenu.data('ibxWidget').miMenuItemRules.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.rules($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqItemMenu.data('ibxWidget').miMenuItemRulesOnResource.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.rulesOnResource($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqItemMenu.data('ibxWidget').miMenuItemEffPolicy.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.effectivePolicy($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqItemMenu.data('ibxWidget').miMenuItemOwner.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.owner($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqItemMenu.data('ibxWidget').miMenuItemRunDef.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.runDeferred($(e.target).data("contextItem"));
		}.bind(this));

		jqItemMenu.data('ibxWidget').miMenuItemRunSQL.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.runSQL($(e.target).data("contextItem"));							
		});
		
		jqItemMenu.data('ibxWidget').miMenuItemScheduleViewLog.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.scheduleViewLog($(e.target).data("contextItem"));							
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').miMenuItemEnableSchedule.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.scheduleEnable($(e.target).data("contextItem"));							
		});
		
		jqItemMenu.data('ibxWidget').miMenuItemDisableSchedule.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.scheduleDisable($(e.target).data("contextItem"));							
		});
				
		jqItemMenu.data('ibxWidget').miMenuItemScheduleFile.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.scheduleItemFile($(e.target).data("contextItem"));							
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').miMenuItemSchedEmail.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.scheduleItemEmail($(e.target).data("contextItem"));							
		}.bind(this));

		jqItemMenu.data('ibxWidget').miMenuItemDesignerScheduler.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.designerScheduler($(e.target).data("contextItem"));							
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').miMenuItemDesignerScheduler2.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.designerScheduler($(e.target).data("contextItem"));							
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').miMenuEditDesignerScheduler.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.designerSchedulerEdit($(e.target).data("contextItem"));							
		}.bind(this));
		jqItemMenu.data('ibxWidget').miMenuItemSchedPrinter.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.scheduleItemPrinter($(e.target).data("contextItem"));							
		}.bind(this));
				
		jqItemMenu.data('ibxWidget').miMenuItemSchedFTP.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.scheduleItemFTP($(e.target).data("contextItem"));							
		}.bind(this));
				
		jqItemMenu.data('ibxWidget').miMenuItemSchedLibrary.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.scheduleItemLibrary($(e.target).data("contextItem"));							
		}.bind(this));
				
		jqItemMenu.data('ibxWidget').miMenuItemSchedMR.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.scheduleItemMR($(e.target).data("contextItem"));							
		}.bind(this));
				
		jqItemMenu.data('ibxWidget').miMenuItemViewAdr.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.editIt($(e.target).data("contextItem"));							
		}.bind(this));
				
		jqItemMenu.data('ibxWidget').miMenuItemViewAcl.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.editIt($(e.target).data("contextItem"));							
		}.bind(this));
				
		jqItemMenu.data('ibxWidget').miMenuItemAddToFavorites.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.addToFavorites($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));

		jqItemMenu.data('ibxWidget').miMenuItemAddToFavorites2.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.addToFavorites($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));

		jqItemMenu.data('ibxWidget').miMenuItemAddToMobileFavorites.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.addToMobileFavorites($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});

		jqItemMenu.data('ibxWidget').miMenuItemRemoveFavorite.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.removeFavorite($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));

		jqItemMenu.data('ibxWidget').miMenuItemRemoveRecent.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.removeRecent($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));

		jqItemMenu.data('ibxWidget').miMenuItemRemoveMobileFavorite.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.removeMobileFavorite($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqItemMenu.data('ibxWidget').miMenuItemRunInNewWindow.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.runInNewWindow($(e.target).data("contextItem"));
		}.bind(this));

		jqItemMenu.data('ibxWidget').miMenuItemRunInNewWindow2.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.runInNewWindow($(e.target).data("contextItem"));
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').miMenuItemRunInNewWindow3.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.runInNewWindow($(e.target).data("contextItem"));
		}.bind(this));
									
		jqItemMenu.data('ibxWidget').miMenuItemRunInNewWindow4.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.runInNewWindow($(e.target).data("contextItem"));
		}.bind(this));
									
									

		jqItemMenu.data('ibxWidget').miMenuItemMustRunInNewWindow.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.runInNewWindow($(e.target).data("contextItem"));							
		}.bind(this));
		
		jqItemMenu.data('ibxWidget').miMenuItemRunOffline.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.runOffline($(e.target).data("contextItem"));
		}.bind(this));
									
		jqItemMenu.data('ibxWidget').miMenuItemMyCustomizations.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.myCustomizations($(e.target).data("contextItem"));											
		});

		jqItemMenu.data('ibxWidget').miMenuItemMyCustomizations2.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.myCustomizations($(e.target).data("contextItem"));											
		});

		jqItemMenu.data('ibxWidget').miMenuItemAllCustomizations.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.allCustomizations($(e.target).data("contextItem"));											
		});
		jqItemMenu.data('ibxWidget').miMenuItemMyCustomizations2p.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.removeMyV5Customizations($(e.target).data("contextItem"));											
		});
				
		jqItemMenu.data('ibxWidget').miMenuItemMyCustomizations3.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.removeMyV5Customizations($(e.target).data("contextItem"));											
		});
		jqItemMenu.data('ibxWidget').miMenuItemSubscribe.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.subscribe($(e.target).data("contextItem"));											
		}.bind(this));
						
		jqItemMenu.data('ibxWidget').miMenuItemUnsubscribe.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.unsubscribe($(e.target).data("contextItem"));											
		}.bind(this));
										
		jqItemMenu.data('ibxWidget').miMenuItemLibViewLast.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.viewLastVersion($(e.target).data("contextItem"));											
		}.bind(this));
				
		jqItemMenu.data('ibxWidget').miMenuItemLibViewAll.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.viewAllVersion($(e.target).data("contextItem"));											
		}.bind(this));							 
		jqItemMenu.data('ibxWidget').miMenuItemLocateItem.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.locateItem($(e.target).data("contextItem"));											
		}.bind(this));
		jqItemMenu.data('ibxWidget').miMenuItemLocateItem2.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.locateItem($(e.target).data("contextItem"));											
		}.bind(this));

		jqItemMenu.data('ibxWidget').miMenuItemCreateShortcut.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.createShortcut($(e.target).data("contextItem"));											
		});
		
		jqItemMenu.data('ibxWidget').miMenuItemManageAlias.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.manageAlias($(e.target).data("contextItem"));											
		}.bind(this));
		jqItemMenu.data('ibxWidget').miMenuViewComments.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.viewComments($(e.target).data("contextItem"));											
		});
		jqItemMenu.data('ibxWidget').miMenuRemoveComments.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.removeComments($(e.target).data("contextItem"));											
		});
/*
		jqItemMenu.data('ibxWidget').miMenuItemShareBasic.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.shareBasic($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});

		jqItemMenu.data('ibxWidget').miMenuItemUnshare.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.unshare($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});

		jqItemMenu.data('ibxWidget').miMenuItemShareAdvanced.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.shareAdvanced($(e.target).data("contextItem"));							
		});
*/		
		jqItemMenu.data('ibxWidget').miMenuItemXlate.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.downloadTranslations($(e.target).data("contextItem"));							
		}.bind(this));
								
		jqItemMenu.data('ibxWidget').miMenuItemUnlinkPage.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.unlinkPage($(e.target).data("contextItem"));							
		});
/*										
		jqItemMenu.data('ibxWidget').miMenuItemUnlinkPage2.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.unlinkPage($(e.target).data("contextItem"));							
		});
												
		jqItemMenu.data('ibxWidget').miMenuItemPushPage.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.pushPage($(e.target).data("contextItem"));							
		});
		jqItemMenu.data('ibxWidget').miMenuItemProperties.on("ibx_menu_item_click",function(e)
		{
			$(".propPage").ibxWidget("show", $(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
*/														
		jqItemMenu.data('ibxWidget').miMenuItemProperties.on("ibx_menu_item_click", this._menuHandlers.callProperties);
		return  jqItemMenu;
	}
	else if (type == "multi")
	{
		var multi_menu = ibx.resourceMgr.getResource(".multi-select-menu");
		var jqMultiMenu = $(multi_menu);
		
		jqMultiMenu.data('ibxWidget').msMenuItemDuplicate.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.duplicate($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));
/*		
		jqMultiMenu.data('ibxWidget').msMenuItemCut.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.cut($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqMultiMenu.data('ibxWidget').msMenuItemCopy.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.copy($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqMultiMenu.data('ibxWidget').msMenuItemPublish.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.publish($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqMultiMenu.data('ibxWidget').msMenuItemUnpublish.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.unpublish($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqMultiMenu.data('ibxWidget').msMenuItemHide.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.hide($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqMultiMenu.data('ibxWidget').msMenuItemShow.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.show($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqMultiMenu.data('ibxWidget').msMenuItemDelete.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.deleteItem($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));
		
*/		
		jqMultiMenu.data('ibxWidget').msMenuItemAddToFavorites.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.addToFavorites($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));
		jqMultiMenu.data('ibxWidget').msMenuItemAddToMobileFavorites.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.addToMobileFavorites($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));
		jqMultiMenu.data('ibxWidget').msMenuItemRemoveFavorite.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.removeFavorite($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));
		jqMultiMenu.data('ibxWidget').msMenuItemRemoveMobileFavorite.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.removeMobileFavorite($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqMultiMenu.data('ibxWidget').msMenuItemRemoveRecent.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.removeRecent($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));

/*				
		jqMultiMenu.data('ibxWidget').msMenuItemShareBasic.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.shareBasic($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
				
		jqMultiMenu.data('ibxWidget').msMenuItemUnshare.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.unshare($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
*/
		return jqMultiMenu;
	}
	else if (type == "folder")
	{
//		if (hprbUtil.environment.isMobile ||  hprbUtil.environment.lowHeight)
		if (false)
		{
			var mb_folder_menu = ibx.resourceMgr.getResource(".mobile-folder-menu");
			var jqMbFolderMenu = $(mb_folder_menu);

			jqMbFolderMenu.data('ibxWidget').mbMenuItemOpen.on("ibx_menu_item_click",function(e)
			{
				hprbUtil.environment.homePage.openfolder($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));
			});									

			jqMbFolderMenu.data('ibxWidget').mbMenuItemAddToFavorites.on("ibx_menu_item_click",function(e)
			{
				hprbUtil.environment.homePage.addToFavorites($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
			});									

			return mb_folder_menu;
		}
		var folder_menu = ibx.resourceMgr.getResource(".folder-menu");
		var jqFolderMenu = $(folder_menu);
		
		jqFolderMenu.data('ibxWidget').foMenuItemOpen.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.openFolder($(e.target).data("contextItem"));
		}.bind(this));

		jqFolderMenu.data('ibxWidget').foMenuItemAddToFavorites.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.addToFavorites($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));
		
		jqFolderMenu.data('ibxWidget').foMenuItemRemoveRecent.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.removeRecent($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		}.bind(this));

/*		
		jqFolderMenu.data('ibxWidget').foMenuItemExpand.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.menuExpandTreeFolder($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));
		});									
		jqFolderMenu.data('ibxWidget').foMenuItemCollapse.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.collapseTreeFolder($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));
		});	
/		
		jqFolderMenu.data('ibxWidget').foMenuItemDelete.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.deletefolder($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
/		
		jqFolderMenu.data('ibxWidget').foMenuItemRefresh.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.refreshFolder($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
/		
		jqFolderMenu.data('ibxWidget').foMenuItemPublish.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.publish($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqFolderMenu.data('ibxWidget').foMenuItemUnpublish.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.unpublish($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqFolderMenu.data('ibxWidget').foMenuItemHide.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.hide($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqFolderMenu.data('ibxWidget').foMenuItemShow.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.show($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
/		
		jqFolderMenu.data('ibxWidget').foMenuItemRules.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.rules($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		jqFolderMenu.data('ibxWidget').foMenuItemRulesOnResource.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.rulesOnResource($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqFolderMenu.data('ibxWidget').foMenuItemEffPolicy.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.effectivePolicy($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqFolderMenu.data('ibxWidget').foMenuItemOwner.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.owner($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqFolderMenu.data('ibxWidget').foMenuItemDuplicate.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.duplicate($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));
		});
		
		jqFolderMenu.data('ibxWidget').foMenuItemCut.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.cut($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqFolderMenu.data('ibxWidget').foMenuItemCopy.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.copy($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqFolderMenu.data('ibxWidget').foMenuItemPaste.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.paste($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
/
		jqFolderMenu.data('ibxWidget').foMenuItemAllowGenAccess.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.setGeneralAccess($(e.target).data("contextItem"),  true);							
		});

		jqFolderMenu.data('ibxWidget').foMenuItemDenyGenAccess.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.setGeneralAccess($(e.target).data("contextItem"),  false);							
		});
/		
		jqFolderMenu.data('ibxWidget').foMenuItemShareBasic.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.shareBasic($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
		
		jqFolderMenu.data('ibxWidget').foMenuItemUnshare.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.unshare($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});

		jqFolderMenu.data('ibxWidget').foMenuItemShareAdvanced.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.shareAdvanced($(e.target).data("contextItem"));							
		});
/				
//		jqFolderMenu.data('ibxWidget').foMenuItemProperties.on("ibx_menu_item_click",function(e)
//		{
//			$(".propPage").ibxWidget("show", $(e.target).data("contextItem"), $(e.target).data("selectedItems"));							
//		});

		jqFolderMenu.data('ibxWidget').foMenuItemRepSrvConsole.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.reportingServerConsole($(e.target).data("contextItem"));							
		});
		
		jqFolderMenu.data('ibxWidget').foMenuItemMyCustomizations.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.removeMyV5Customizations($(e.target).data("contextItem"));											
		});
		
		jqFolderMenu.data('ibxWidget').foMenuItemAllCustomizations.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.removeAllUsersV5Customizations($(e.target).data("contextItem"));											
		});
*/		
		
		jqFolderMenu.data('ibxWidget').foMenuItemEditPrtlx.on("ibx_menu_item_click",function(e)
		{
			setTimeout(function()
			{
				this._menuHandlers.processV5Portal("edit", $(e.target).data("contextItem"));
			}.bind(this), 10);
		}.bind(this));

		jqFolderMenu.data('ibxWidget').foMenuItemLocateItem.on("ibx_menu_item_click",function(e)
		{
			this._menuHandlers.locateItem($(e.target).data("contextItem"));											
		}.bind(this));

		jqFolderMenu.data('ibxWidget').foMenuItemProperties.on("ibx_menu_item_click", this._menuHandlers.callProperties);
		return jqFolderMenu;
	}
	else if (type == "canvas")
	{
		var canvas_menu = ibx.resourceMgr.getResource(".canvas-menu");
		var jqCanvasMenu = $(canvas_menu);
/*		
		jqCanvasMenu.data('ibxWidget').cnvMenuItemPaste.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.paste($(e.target).data("contextItem"),  $(e.target).data("selectedItems"));							
		});
*/		
		return jqCanvasMenu;
	}
	else if (type == "ask-results-menu")
	{
		var resultsMenu = ibx.resourceMgr.getResource(".ask-results-menu");
		var jqResultsMenu = $(resultsMenu);
		
		jqResultsMenu.data('ibxWidget').miMenuItemLocateItem.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.locateItem($(e.target).data("contextItem"));											
		});
		return jqResultsMenu;
	}
	else if (type == "ask-phrases-menu")
	{
		var phrasesMenu = ibx.resourceMgr.getResource(".ask-phrases-menu");
		var jqPhrasesMenu = $(phrasesMenu);
		
		jqPhrasesMenu.data('ibxWidget').miMenuItemLocateItem.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.locateItem($(e.target).data("contextItem"));											
		});
		
		return jqPhrasesMenu;
	}
	else
		return null;
};

dmProto.excluded = function excluded(menuItem, ibfsItem)
{	
	var exclude = false;
	var metadata = menuItem.attr("metadata");
	if (!metadata)
		return false;

	var itemActions = ibfsItem.actions ? ibfsItem.actions.split(',') : [];
	var ta = [];
	for (var a = 0; a < itemActions.length; a++)
		ta[itemActions[a]] = true;

	var mdParts = metadata.split(',');
	for (var i = 0; i < mdParts.length; i++)
	{
		var mdPart = mdParts[i];
		var directive = mdPart.split('=')[0];
		var value = mdPart.split('=')[1];
		switch(directive)
		{
			case "mustshortcut":
			{
				if (ibfsItem.clientInfo && ibfsItem.clientInfo.isLink)
				{
					if (!ta['shortcut'])
						exclude = true;
				}
				break;
			}
			case "mapMust":
			{
				var isExcluded = false;
				//mapMust=objonly(ROFexFile:LinkItem-ROFexFile)|designerReportingObject;linkext(mas)|designerMetadata
				var mapParts = value.split(';');
				for (var mp = 0; mp < mapParts.length; mp++)
				{
					var mpps = mapParts[mp].split('|');
					var verb = mpps[0].split('(')[0];
					var object = mpps[0].split('(')[1];
					switch(verb)
					{
						case "objonly":
						{
							if (ibfsItem.type == "LinkItem")
							{
								var ltot = object.split('-')[1];
								if (ltot == ibfsItem.clientInfo.properties.LinkToObjType+')')
								{
									if (ibfsItem.actions.indexOf(mpps[1]) == -1)
										isExcluded = true;
									else
										isExcluded = false;
								}
							}
							else
							{
								if (object.indexOf(ibfsItem.type) != -1)
								{
									if (ibfsItem.actions.indexOf(mpps[1]) == -1)
										isExcluded = true;
									else
										isExcluded = false;
								}
							}
							break;
						}
						case "linkext":
						{
							if (ibfsItem.type == "LinkItem")
							{
								if ((ibfsItem.name+')').indexOf('.' + object) != -1)
								{
									if (ibfsItem.actions.indexOf(mpps[1]) == -1)
										isExcluded = true;
									else
										isExcluded = false;
								}
							}
						}
					}
				}
				
				if (isExcluded)
					exclude = true;
				
				break;
			}
			case "suppress":
			{
				exclude = true;
				break;
			}
			case "typenot":
			{
				if (ibfsItem.type == value)
					exclude = true;
				
				break;
			}
			case "OR":
			{
				var parts = value.split("|");
				var excludeCount = 0;
				for (var o = 0; o < parts.length; o++)
				{
					var m = $("<div metadata='" + parts[o].replace(":", "=") + "'</div>");
					if (!excluded(m, ibfsItem))
						break;
					else
						excludeCount++;
				}
				
				if (excludeCount == parts.length)
					exclude = true;
				break;
			}
			case "notInMyContent":
			{
				if (ibfsItem.inMyContent)
					exclude=true;
				break;
			}	
			case "pathPattern":
			{
				break;
			}
			case "toolMustContain":
			{
				var tool = ibfsItem.clientInfo.properties.tool;
				if (!tool)
					exclude = true;
				else
				{
					var tp = value.split(";");
					for (var i = 0; i < tp.length; i++)
					{
						if (tool.indexOf(tp[i]) == -1)
						{
							exclude = true;
							break;
						}
					}
				}
				break;
			}
			case "toolnot":
			{
				if (value == ibfsItem.clientInfo.properties.tool)
					exclude = true;
				break;
			}
			case "toolContainsOnly":
			{
				if (!ibfsItem.clientInfo.properties.tool)
				{
					// master file link is like the rotool....
					if(value == "rotool" && ibfsItem.type=="LinkItem" && ibfsItem.name.endsWith && ibfsItem.name.endsWith(".mas"))
						break;
					else
						exclude = true;
				}	
				else if (ibfsItem.clientInfo.properties.tool.indexOf(value) == -1)
					exclude = true; 
				break;
			}
			case "toolnotincludes":
			{
				var tools = value.split(';');
				var tool = ibfsItem.clientInfo.properties.tool;
				for (var t = 0; t < tools.length; t++)
				{
					if (tool && tool.indexOf(tools[t]) != -1)
						exclude = true;
				}
				break;
			}
			case "hpgnot":
			{
//				if (home_page_globals[value] == "true")
					exclude = true;
				break;
			}
			case "extnot":
			{
				var extensions = value.split(';');
				var extension = ibfsItem.extension;
				for (var e = 0; e < extensions.length; e++)
				{
					if (extension == extensions[e])
					{
						exclude = true;
						break;
					}
				}
				break;
			}
			case "nameEndsWith":
			{
				if (ibfsItem.name.indexOf(value) != ibfsItem.name.length-4)
					exclude = true;
				break;
			}
			case "nameNotEndsWith":
			{
				if (ibfsItem.name.indexOf(value) == ibfsItem.name.length-4)
					exclude = true;
				break;
			}
			case "extonly":
			{
				var extension = ibfsItem.extension;
				if (extension != value)
					exclude = true;
				break;
			}
			case "mustObjFeature":
			{
				var objType = value.split('-')[0];
				var feature = value.split('-')[1];
				if (ibfsItem.type == objType)
				{
					if (!WFGlobals.isFeatureEnabled(feature))
						exclude = true;
				}
				break;
			}
			case "mustFeature":
			{
				var feature = value.split('-')[0];
				var objType = value.split('-')[1];
				
				var objTypes = objType.split('|');
				
				if (!WFGlobals.isFeatureEnabled(feature))
				{
					exclude = true;					// feature not enabled, exclude
				}
				else
				{
					var good = false;
					for (var o = 0; o < objTypes.length; o++)
					{
						objType = objTypes[o];				
						if (objType.indexOf("LinkItem", 0) === 0) // startsWith
						{
							objType = objType.split('+')[1];
							if (ibfsItem.clientInfo.properties.LinkToObjType == objType)
							{
								good = true;
								break;
							}
						}
						else	
						{
							if (ibfsItem.type == objType)
							{
								good = true;				// feature is enabled, but wrong type. exclude
								break;
							}
						}
					}
					
					if (!good)
						exclude = true;
				}
				
				break;
			}
			case "notContainer":
			{
				if (ibfsItem.container && ibfsItem.type != 'PGXBundle'  && ibfsItem.type != 'PRTLXBundle')
					exclude = true;
				break;
			}
			case "inCloudTrial":
			{
				if ((value == "true" && !hprbUtil.environment["isCloudTrial"]) 
					|| (value == "false" && hprbUtil.environment["isCloudTrial"]))
					exclude = true;
				break;
			}
			case "mustperm":
			{
				var actions = ibfsItem.actions;
				if (actions.indexOf(","+value) == -1)
					exclude = true;
				break;
			}
			case "mustnotperm":
			{
				var actions = ibfsItem.actions;
				if (actions.indexOf(","+value) != -1)
					exclude = true;
				break;
			}
			case "pathnot":
			{
				var path = ibfsItem.fullPath;
				if (path == value)
					exclude = true;
				break;
			}
			case "pathonly":
			{
				var path = ibfsItem.fullPath;
				if (path != value)
					exclude = true;
				break;
			}
			case "nodenot":
			{
				var path = ibfsItem.fullPath;
				if (path == value)
					exclude = true;
				break;
			}
			case "subsysnot":
			{
				var path = ibfsItem.fullPath;
				if (path.indexOf(value) != -1)
					exclude = true;
				break;
			}
			case "subsysonly":
			{
				var path = ibfsItem.fullPath;
				if (path.indexOf(value) == -1)
					exclude = true;
				break;
			}
			case "envnot":
			{
				var env = value.split('-')[0];
				if (!hprbUtil.environment[env])
				{
					var filterd = value.split('-')[1].split('^')[0];
					var filterv = value.split('-')[1].split('^')[1];
					switch(filterd)
					{
						case "hpmodenot":
						{
							var modes = filterv.split('|');
							for (var m = 0; m < modes.length; m++)
							{
								if (hprbUtil.environment.homepageMode+"" == modes[m])
								{
									exclude = true;
									break;
								}
							}
							break;
						}
					}
				}
				break;
			}
			case "objnot":
			{
				var objs = value.split(';');
				for (var o = 0; o < objs.length; o++)
				{
					if (ibfsItem.type == objs[o])
						exclude = true;
				}
				break;
			}
			case "objonly":
			{
				var objType = ibfsItem.type;
				if (ibfsItem.clientInfo && ibfsItem.clientInfo.isLink)
					objType = ibfsItem.clientInfo.properties.LinkToObjType;
				if (objType != value)
					exclude = true;
				break;
			}
			case "objany":
			{
				var objTypes = value.split(';');
				var found = false;
				var objType = ibfsItem.type;
				if (ibfsItem.clientInfo.isLink)
					objType = ibfsItem.clientInfo.properties.LinkToObjType;
				for (var t = 0; t < objTypes.length; t++)
				{
					if (objType == objTypes[t])
					{
						found = true;
						break;
					}
				}
				if (!found)
					exclude = true;
				break;
			}
			case "actionAny":
			{
				var actions = value.split(';');
				var found = false;
				var itemActions = ibfsItem.actions.split(',');
				for (var ta = 0; ta < actions.length; ta++)
				{
					for (var ia = 0; ia < itemActions.length; ia++)
					{
						if (actions[ta] == itemActions[ia])
						{
							found = true;
							break;
						}
					}
					
					if (found)
					{
						exclude = true;
						break;
					}
				}
				break;
			}
			case "actionIfNone":
			{
				exclude = true;
				var actions = value.split(';');
				var found = false;
				var itemActions = ibfsItem.actions.split(',');
				for (var ta = 0; ta < actions.length; ta++)
				{
					for (var ia = 0; ia < itemActions.length; ia++)
					{
						if (actions[ta] == itemActions[ia])
						{
							found = true;
							break;
						}
					}
					
					if (found)
					{
						exclude = false;
						break;
					}
				}
				break;
			}
			case "hpmodeonly":
			{
				var excludeCount = 0;
				var modes = value.split('|');
				for (var m = 0; m < modes.length; m++)
				{
					if (hprbUtil.environment.homepageMode+"" != modes[m])
						excludeCount++;
				}
				if (excludeCount == modes.length)
					exclude = true;
				break;
			}
			case "hpmodenot":
			{
				var modes = value.split('|');
				for (var m = 0; m < modes.length; m++)
				{
					if (hprbUtil.environment.homepageMode+"" == modes[m])
					{
						exclude = true;
						break;
					}
				}
				break;
			}
			case "hpconfignot":
			{
				if (hprbUtil.environment.config == value)
					exclude = true;
				break;
			}
			case "hpconfigonly":
			{
				if (hprbUtil.environment.config != value)
					exclude = true;
				break;
			}
			case "linkToObjTypeNot":
			{
				if (ibfsItem.type == "LinkItem")
				{
					var linkObjTypes = value.split(';');
					for (var lo = 0; lo < linkObjTypes.length; lo++)
					{
						if (ibfsItem.clientInfo.properties.LinkToObjType == linkObjTypes[lo])
						{
							exclude = true;
							break;
						}
					}
				}
				
				break;
			}
			case "mode":
			{
				if (value == "search")
				{
//					if (!hprbUtil.environment.homePage.inSearch())
						exclude = true;
				}
				break;
			}
			case "modenot":
			{
				var modes = value.split(';');
				for (var m = 0; m < modes.length; m++)
				{
					switch (modes[m])
					{
						case "search":
						{
							if (false)	//hprbUtil.environment.homePage.inSearch())
								exclude = true;
							break;
						}
						case "mobile":
						{
							if (false)		//(hprbUtil.environment.isMobile ||  hprbUtil.environment.lowHeight))
								exclude = true;
							
							break;
						}
						case "mobileApp":
						{
							if(false)		//home_page_globals["isMobileFaves"] == "true")
								exclude = true;
							break;
						}
						case "portal":
						{
							if (false)			//hprbUtil.environment.configMode > -1)
								exclude = true;
							break;
						}
						case "favorites":
						{
							if (false)		//hprbUtil.environment.homepageMode == 2)
								exclude = true;
							break;
						}
						case "mobileFavorites":
						{
							if (false)		//hprbUtil.environment.homepageMode == 3)
								exclude = true;
							break;
						}
					}
				}
				break;
			}
			case "parentPolicyMust":
			{
				var node = null;
				if (this._domainsContent.element.hasClass('home-domains-content-page'))
				{
					this._domainsContent._tree.find("[data-ibfs-path='"+ibfsItem.parentPath.substring(0, ibfsItem.parentPath.length-1)+"']");
					var parent = $(node).data('item');
				
					var found = false;
					if(parent && parent.actions)
					{
						var pActions = parent.actions.split(',');
						for (var ta = 0; ta < pActions.length; ta++)
						{
							if (value == pActions[ta])
							{
								found = true;
								break;
							}
						}
					}
					if (!found)
						exclude = true;
				}
				else
					exclude = true;
				break;
			}
			
			case "isAdmin":
			{
				if (value == "true")
				{
//					if (!hprbUtil.environment.isAdmin)
					if (false)
						exclude = true;
				}
				break;
			}
			case "propnot":
			{
				if (ibfsItem.clientInfo.properties[value])
					exclude = true;
				break;
			}	
			case "mustProp":
			{
				if (!ibfsItem.clientInfo.properties[value])
					exclude = true;
				break;
			}
			case "mustPropAndValue":
			{
				var prop = value.split('-')[0];
				var propValue = value.split('-')[1];

				if (!ibfsItem.clientInfo.properties[prop])
				{
						exclude = true;
				}
				else
				{
					if (ibfsItem.clientInfo.properties[prop] != propValue) 
						exclude = true;
				}
				break;
			}
			case "mustNotPropAndValue":
			{
				var prop = value.split('-')[0];
				var propValue = value.split('-')[1];

				if (ibfsItem.clientInfo.properties[prop] == propValue)
				{
						exclude = true;
				}
				break;
			}
			case "licenseonly":
			{
				if (value == "BUE")
				{
//					if (!hprbUtil.environment.isBUE)
						exclude = true;
				}
				break;
			}
			case "licensenot":
			{
				if (value == "BUE")
				{
//					if (hprbUtil.environment.isBUE)
						exclude = true;
				}
				break;
			}
			case "watchListEnabled":
			{
				if (value == "true")
				{
					if (!hprbUtil.environment.isWatchListEnabled)
						exclude = true;
				}
			}
		}
		
		if (exclude)
			break;
	}
	return exclude;
};


dmProto.cleanSeparators = function cleanSeparators(menu)
{
	// cleaning up separators
	var items = menu.find("[data-ibx-type^='ibxMenu']");
	var isVisible = true;
	var lastSep = null;
	
	
	for (var i = items.length-1; i >= 0; i--)
	{
		var div = $(items[i]);
		if (i == 0 && div.attr("data-ibx-type") == "ibxMenuSeparator")
			div.remove();
		
		if (i == items.length-1 && div.attr("data-ibx-type") == "ibxMenuSeparator")
		{
			div.remove();
		}
		if (div.attr("data-ibx-type") == "ibxMenuSeparator")
		{
			if ($(items[i-1]).attr("data-ibx-type") == "ibxMenuSeparator")
			{
				div.remove();
			}
		}
		if (div.attr("data-ibx-type") == "ibxMenu")
			cleanSeparators(div);
	}	
	items = menu.find("[data-ibx-type^='ibxMenu']");
	var ldiv = $(items[items.length-1]); 
	if (ldiv.attr("data-ibx-type") == "ibxMenuSeparator")
		ldiv.remove();
};

dmProto.pruneMenu2 = function pruneMenu2(jqfm, ibfsItem)
{
	var rdivs = jqfm.find("[data-ibx-type='ibxRadioMenuItem']");
	var divs = jqfm.find("[data-ibx-type='ibxMenuItem']").add(rdivs);
	for (var i = 0; i < divs.length; ++i)
	{
		var el = $(divs[i]);
		if (excluded(el, ibfsItem))
			el.remove();
	}
};

dmProto.pruneMenu = function pruneMenu(jqfm, ibfsItem)
{
	var actions = ibfsItem.actions ? ibfsItem.actions.split(',') : [];

	var ta = [];
	for (var a = 0; a < actions.length; a++)
		ta[actions[a]] = true;

	actions = ta;
	var rdivs = jqfm.find("[data-ibx-type='ibxRadioMenuItem']");
	var divs = jqfm.find("[data-ibx-type='ibxMenuItem']").add(rdivs);
	for (var i = 0; i < divs.length; ++i)
	{
		var el = $(divs[i]);
		var action = el.attr("action");
		if (!action)
		{
			if (this.excluded(el, ibfsItem))
				el.remove();
			continue;
		}
		
		if (action == "edit" && ibfsItem.clientInfo)
		{
			if (!actions["open"] && !ibfsItem.clientInfo.isLink 
					&& ibfsItem.type != "PRTLXBundle" 
					&& ibfsItem.type != "BIPWFCPortalItem"
					&& ibfsItem.type != "BipPortalsPortal")
			{
				el.remove();
				continue;
			}
			
			if (ibfsItem.type == "PRTLXBundle" || ibfsItem.type == "BIPWFCPortalItem" || ibfsItem.type == "BipPortalsPortal")
			{
				if (!actions["open"] && !actions["editPortal"])
				{
					el.remove();
					continue;
				}
			}


			action = this.toolActionMap[ibfsItem.clientInfo.properties["tool"]];	// get the required action from the tool map
			if (!action)
			{
				action = this.toolActionMap[ibfsItem.clientInfo.type];	// if no 'tool', use object type
				if (!action)
				{
					if (ibfsItem.clientInfo.type == "LinkItem")
						action = this.toolActionMap[ibfsItem.clientInfo.properties.LinkToObjType];
				}
				
				if (!action)
				{
					if (ibfsItem.clientInfo.properties.AdvGassist == "" 
						|| ibfsItem.clientInfo.properties.AdvGassist)
					{
						action = this.toolActionMap["AdvGassist"];
						ibfsItem.clientInfo.properties.tool = "infoAssist";
					}
					else if (ibfsItem.clientInfo.properties.rassist == ""
						|| ibfsItem.clientInfo.properties.rassist)
					{
						action = this.toolActionMap["gassist"];
						ibfsItem.clientInfo.properties.tool = "infoAssist";
					} 
					else if (ibfsItem.clientInfo.properties.gassist == ""
						|| ibfsItem.clientInfo.properties.gassist)
					{
						action = this.toolActionMap["rassist"];
						ibfsItem.clientInfo.properties.tool = "infoAssist";
					} 
					else if (ibfsItem.clientInfo.properties.pwrpaint == ""
						|| ibfsItem.clientInfo.properties.pwrpaint)
					{
						action = this.toolActionMap["pwrpaint"];
						ibfsItem.clientInfo.properties.tool = "infoAssist";
					} 
					else if (ibfsItem.clientInfo.properties.rotool == ""
						|| ibfsItem.clientInfo.properties.rotool)
					{
						action = this.toolActionMap["rotool"];
						ibfsItem.clientInfo.properties.tool = "infoAssist";
					} 
					else if (ibfsItem.clientInfo.properties.infoAssist == ""
						|| ibfsItem.clientInfo.properties.infoAssist)
					{
						action = this.toolActionMap["infoassist"];
						ibfsItem.clientInfo.properties.tool = "infoAssist";
					} 
				}
			}
		}
		
		// designer objects special cases
		if (action == 'appDesigner')
		{
			if (ibfsItem.clientInfo.properties.PGXType == 'workbook')
			{
				action = 'workbook';
				if (!actions['designerMetadata'] && !actions['designerReportingObject'])
					action = 'workbookx';	// force failure
			}
		}

		var found = false;
		if (action == "prtlxDesigner")
			found = true;
		var tActions = action ? action.split(',') : [];
		for (var ta = 0; ta < tActions.length; ta++)
		{
			if (actions[tActions[ta]])
			{
				found = true;
				break;
			}
		}
		
		if (!found)
		
			el.remove();
		else
		{
			if (this.excluded(el, ibfsItem))
				el.remove();
		}
	}

	for (var w = 0; w < divs.length; ++w)
	{
		var el = $(divs[w]);
		if (el.data("ibiIbxMenuItem"))
		{
			var subMenu = el.ibxWidget("subMenu");
			if (subMenu)	// has a subMenu
			{
//				console.log("calling processSubMenu for " + el.ibxWidget("option", "labelOptions.text"))
				this.processSubMenu(el, subMenu);
				if (el.data("ibiIbxMenuItem") && !el.ibxWidget("subMenu").find("[data-ibx-type='ibxMenuItem']").length
											  && !el.ibxWidget("subMenu").find("[data-ibx-type='ibxRadioMenuItem']").length)
				{
//					console.log("calling processing removal for " + el.ibxWidget("option", "labelOptions.text"))
					el.remove();
				}
			}
		}
	}
	
	this.cleanSeparators(jqfm);
	
	if (ibfsItem.type != "CasterLibrary")
		jqfm.find("[data-ibx-type='ibxMenuItem']").first().addClass("default-menu-item");
	else
		jqfm.find("[data-ibx-type='ibxMenuItem']").first().find("[data-ibx-type='ibxMenuItem']").first().addClass("default-menu-item");
};

/*
	<div data-ibx-type="ibxMenuItem" data-ibx-name="miNewMenu"  metadata="toolContainsOnly=rotool"  data-ibxp-label-options='{ "glyph":"open_in_new", "glyphClasses":"material-icons"}'>@ibxString('str_new')
		<div class="NewMenus sub-menu ibx-menu-no-icons" data-ibx-type="ibxMenu">		
			<div data-ibx-type="ibxMenuItem" metadata="mapMust=objonly(ROFexFile:LinkItem-ROFexFile)|designerReportingObject;linkext(mas)|designerMetadata" action="designerMetadata,designerReportingObject" >@ibxString('hpreboot_action_designer') 
				<div class="NewMenus sub-menu ibx-menu-no-icons" data-ibx-type="ibxMenu">
					<div data-ibx-type="ibxMenuItem" data-ibx-name="miMenuInsightDesignerWorkbook">@ibxString('buttons.workbook')</div>
					<div data-ibx-type="ibxMenuItem" data-ibx-name="miMenuInsightDesignerChart">@ibxString('buttons.insightDesigner')</div>
				</div>		
			</div>
			<div data-ibx-type="ibxMenuItem" >@ibxString('hpreboot_action_ia')
				<div class="NewMenus sub-menu ibx-menu-no-icons" data-ibx-type="ibxMenu">
					<div data-ibx-type="ibxMenuItem" action="infoAssistViaReportingObject,infoAssistReport" data-ibx-name="miMenuReport">@ibxString('str_report')</div>
					<div data-ibx-type="ibxMenuItem" action="infoAssistViaReportingObject,infoAssistGraph" data-ibx-name="miMenuChart">@ibxString('str_chart')</div>
					<div data-ibx-type="ibxMenuItem" action="infoAssistViaReportingObject,infoAssistDocument" data-ibx-name="miMenuDocument">@ibxString('str_document')</div>
					<div data-ibx-type="ibxMenuItem" metadata="toolnotincludes=rotool" data-ibx-name="miMenuVis">@ibxString('str_visualization')</div>
				</div>
			</div>
		</div>
	</div>
*/	

dmProto.processSubMenu = function processSubMenu(menuItem, subMenu)
{
//	console.log("entering processSubMenu for " + menuItem.ibxWidget("option", "labelOptions.text"))

	if (!subMenu.find("[data-ibx-type='ibxMenuItem']").length && !subMenu.find("[data-ibx-type='ibxRadioMenuItem']").length)
	{
//		console.log("removing menuItem " + menuItem.ibxWidget("option", "labelOptions.text"))
		menuItem.remove();
	}
	else
	{
		var subMenuChildren = subMenu.ibxWidget("children");
		for (var smc = 0; smc < subMenuChildren.length; smc++)
		{
			var subCh = $(subMenuChildren[smc]);
			if (subCh.data("ibiIbxMenuSeparator"))	// separators cannot have subMenus
				continue;
			var subMenu2 = subCh.ibxWidget("subMenu");
			if (subMenu2)	// has a subMenu
			{
//				console.log("processing subMenu for " + subCh.ibxWidget("option", "labelOptions.text"))
				this.processSubMenu(subCh, subMenu2);
				if (subCh.data("ibiIbxMenuItem") && !subCh.ibxWidget("subMenu").find("[data-ibx-type='ibxMenuItem']").length
												 && !subCh.ibxWidget("subMenu").find("[data-ibx-type='ibxRadioMenuItem']").length)
				{
//					console.log("post processing removal for " + subCh.ibxWidget("option", "labelOptions.text"))
					subCh.remove();
				}
			}
		}
	}
};

dmProto.pruneMultiMenu = function pruneMultiMenu(jqfm, selectedList)
{
	var actions = [];
	for (var i = 0; i < selectedList.length; i++)
	{
		actions[i] = selectedList[i].actions.split(',');
	}

	var divs = jqfm.find("[data-ibx-type='ibxMenuItem']");
	for (var i = 0; i < divs.length; ++i)
	{
		var el = $(divs[i]);
		var menuItemAction = el.attr("action");
		if (!menuItemAction)
		{
			for (var e = 0; e < selectedList.length; e++)
			{
				if (this.excluded(el, selectedList[e]))
				{
					el.addClass("should-remove");
					break;
				}
			}
			continue;
		}
		var found = false;
		for (var j = 0; j < actions.length; j++)	// loop for actions of each selected resource
		{
			found = false;
			var itemActions = actions[j];
			for (var k=0; k < itemActions.length; k++)
			{
				if (menuItemAction == itemActions[k])
				{
					found =  true;
					break;
				}
			}
			
			if (!found)
			{
				el.addClass("should-remove");
			}
			else
			{
				for (var e = 0; e < selectedList.length; e++)
				{
					if (this.excluded(el, selectedList[e]))
					{
						el.addClass("should-remove");
						break;
					}
				}
			}
		}
	}
	
	divs = jqfm.find(".should-remove");
	for (var r = 0; r < divs.length; ++r)
	{
		var el = $(divs[r]);
		el.remove();
	}
	
	this.cleanSeparators(jqfm);
};

dmProto.setContext = function setContext(menu, contextItem, selectedItems)
{
	var divs = menu.find("[data-ibx-type^='ibx']");
	for (var i = 0; i < divs.length; ++i)
	{
		var el = $(divs[i]);
		el.data("contextItem", contextItem);
		el.data("selectedItems", selectedItems);
	}
	
	var cmds = $.ibi.ibxCommand.cmds;
	for (var key in cmds)
	{
		var cmd = cmds[key];
		cmd.data("contextItem", contextItem);
		cmd.data("selectedItems", selectedItems);
	}
};

// called from home and content tabs
dmProto.fileMenu = function filemenu(contextItem, ibfsItem, container)
{		
	function determineRunOrView(ibfsItem)
	{
		if (ibfsItem.extension == "fex" 
			|| ibfsItem.type == "PGXBundle" 
			|| ibfsItem.type == "PRTLXBundle" 
			|| ibfsItem.type == "CasterSchedule" 
			|| ibfsItem.type == "BIPWFCPortalItem" 
			|| ibfsItem.type == "BipPortalsPortal" 
			|| (ibfsItem.type == "LinkItem" 
				&& (ibfsItem.clientInfo.properties.LinkToObjType == "PGXBundle" 
					|| ibfsItem.clientInfo.properties.LinkToObjType == "BIPWFCPortalItem"
					|| ibfsItem.clientInfo.properties.LinkToObjType == "PRTLXBundle")))
			return "run";
		else
			return "view";
	}

	if (!contextItem && !ibfsItem)
		return null;
	
	var selectedList = [];
	var selDivs = null;
	if (!container)
	{
		selDivs = this._domainsContent.element.hasClass('home-domains-content-page') ? this._domainsContent.getSelectedResources(this._domainsContent.options.mode) : [];
	}
	else
	{
		if (container.hasClass('ibx-carousel'))
			selDivs = container.ibxWidget('getSelectionManager').selected();
		else
			selDivs = container.ibxSelectionManager('instance').selected();
	}

	for (var i = 0; i < selDivs.length; i++)
		selectedList.push($(selDivs[i]).data('item'));
	
	var master = false;
	var ro = false;	
	if( ibfsItem.type=="LinkItem" && ibfsItem.name.endsWith && ibfsItem.name.endsWith(".mas"))
		master = true;
	else if(ibfsItem.type =="ROFexFile" || (ibfsItem.type == "LinkItem" && typeof ibfsItem.clientInfo.properties.tool !== 'undefined' && ibfsItem.clientInfo.properties.tool.indexOf("rotool") != -1))
		ro = true;
			
	if (selectedList.length <= 1)
	{
		var jqItemMenu = this.initMenu("item");
		var actions = ibfsItem.actions;
		this.setContext(jqItemMenu, ibfsItem, selectedList);
		if(master)
		{
			jqItemMenu.data('ibxWidget').miMenuItemRun.remove();
			jqItemMenu.data('ibxWidget').menuInteractiveRuntime.remove();
			jqItemMenu.data('ibxWidget').miMenuItemCreateShortcut.remove();
		}
		else
		{	
			if (!hprbUtil.environment.isMobile &&  !hprbUtil.environment.lowHeight)
			{
				jqItemMenu.data('ibxWidget').menuInteractiveRuntime.remove();
				if(!ro)
					jqItemMenu.data('ibxWidget').miNewMenu.remove();

				jqItemMenu.data('ibxWidget').midelsep.remove();
			}
		}	
		
		this.pruneMenu(jqItemMenu, ibfsItem);
		var rOrv = determineRunOrView(ibfsItem); 
		var mText = (rOrv == "run" ? ibx.resourceMgr.getString("hpreboot_run") : ibx.resourceMgr.getString("hpreboot_view"));
		if (!hprbUtil.environment.isMobile && !hprbUtil.environment.lowHeight)
		{
			jqItemMenu.find("[data-ibx-name='miMenuItemRun']").ibxWidget("option", "labelOptions.text", mText);
			mText = (rOrv == "run" ? ibx.resourceMgr.getString("hpreboot_run_in_new_window") : ibx.resourceMgr.getString("hpreboot_view_in_new_window"));
			jqItemMenu.find("[data-ibx-name='miMenuItemRunInNewWindow']").ibxWidget("option", "labelOptions.text", mText);
			jqItemMenu.find("[data-ibx-name='miMenuItemRunInNewWindow2']").ibxWidget("option", "labelOptions.text", mText);
			jqItemMenu.find("[data-ibx-name='miMenuItemRunInNewWindow3']").ibxWidget("option", "labelOptions.text", mText);
			jqItemMenu.find("[data-ibx-name='miMenuItemRunInNewWindow4']").ibxWidget("option", "labelOptions.text", mText);
			jqItemMenu.find("[data-ibx-name='miMenuItemMustRunInNewWindow']").ibxWidget("option", "labelOptions.text", mText);
		}
		else
		{
			jqItemMenu.find("[data-ibx-name='mbMenuItemRun']").ibxWidget("option", "labelOptions.text", mText);
			mText = (rOrv == "run" ? ibx.resourceMgr.getString("hpreboot_run_in_new_window") : ibx.resourceMgr.getString("hpreboot_view_in_new_window"));
			jqItemMenu.find("[data-ibx-name='mbMenuItemRunInNewWindow']").ibxWidget("option", "labelOptions.text", mText);
		}

		return jqItemMenu.find("[data-ibx-type='ibxMenuItem']").length ? jqItemMenu : null;
	}
	else
	{
		var jqMultiMenu = this.initMenu("multi");
		this.setContext(jqMultiMenu, ibfsItem, selectedList);
		this.pruneMultiMenu(jqMultiMenu, selectedList);

		return jqMultiMenu.find("[data-ibx-type='ibxMenuItem']").length ? jqMultiMenu : null;
	}
	
};

// never called from home
dmProto.folderMenu = function folderMenu(contextItem, ibfsItem)
{		
	var selectedList = [];
	var selDivs = null;
	selDivs = this._domainsContent.getSelectedResources(this._domainsContent.options.mode);
	for (var i = 0; i < selDivs.length; i++)
		selectedList.push($(selDivs[i]).data('item'));

	if (selectedList.length <= 1)
	{
		var jqFolderMenu = this.initMenu("folder");
		jqFolderMenu.find("[data-ibx-name='foMenuItemExpand']").remove();
		jqFolderMenu.find("[data-ibx-name='foMenuItemCollapse']").remove();
		this.setContext(jqFolderMenu, ibfsItem, selectedList, false);
		this.pruneMenu(jqFolderMenu, ibfsItem);

		jqFolderMenu.find("[data-ibx-name='foMenuItemPaste']").ibxWidget("option", "disabled", this._copyCutVerb ? false : true);

		$.each(this._copyCutResources, function(idx)
		{
			if (this.fullPath == ibfsItem.fullPath)
			{
				jqFolderMenu.find("[data-ibx-name='foMenuItemPaste']").ibxWidget("option", "disabled", true);
				return false;
			}
			
			if (this._copyCutVerb == "cut")
			{
				if (this.parentPath == ibfsItem.fullPath || this.parentPath == ibfsItem.fullPath + "/")
				{
					jqFolderMenu.find("[data-ibx-name='foMenuItemPaste']").ibxWidget("option", "disabled", true);
					return false;
				}
			}
		});
		
		
		if (jqFolderMenu.find("[data-ibx-name='foMenuGeneralAccess']").length)
		{
			var uriExec = sformat("{1}/genaccess.bip", applicationContext);
		 	var randomnum = Math.floor(Math.random() * 100000);	
		 	var argument=
		 	{
		 		BIP_REQUEST_TYPE: "BIP_GET_GEN_ACCESS",		
		 		ibfsPath: encodeURIComponent(ibfsItem.fullPath)
		 	};
		 	argument[IBI_random] = randomnum;
		 	
			$.get(uriExec, argument, 
					function(data) 
					{
						ibfsItem.genAccess = $("status", data).attr("message") == "true";
						if (ibfsItem.genAccess)
							jqFolderMenu.find("[data-ibx-name='foMenuItemAllowGenAccess']").ibxWidget("option", "checked", true);
						else
							jqFolderMenu.find("[data-ibx-name='foMenuItemDenyGenAccess']").ibxWidget("option", "checked", true);
					}
			);
		}
		
		return jqFolderMenu.find("[data-ibx-type='ibxMenuItem']").length ? jqFolderMenu : null;
	}
	else
	{
		var jqMultiMenu = this.initMenu("multi");
		this.setContext(jqMultiMenu, ibfsItem, selectedList);
		this.pruneMultiMenu(jqMultiMenu, selectedList);

		return jqMultiMenu.find("[data-ibx-type='ibxMenuItem']").length ? jqMultiMenu : null;
	}
};

dmProto.treeFolderMenu = function treeFoldermenu(event, treeItem)
{
	var selectedList = hprbUtil.environment.Items.getAllSelectedItems();
	var ibfsItem = treeItem._item;
	
	var jqFolderMenu = initMenu("folder");
	setContext(jqFolderMenu, ibfsItem, selectedList);
	
	if (jqFolderMenu.data('ibxWidget').foMenuItemProperties)
	{
		jqFolderMenu.data('ibxWidget').foMenuItemProperties.off("ibx_menu_item_click",callProperties);
		jqFolderMenu.data('ibxWidget').foMenuItemProperties.on("ibx_menu_item_click",function(e)
		{
			$(".propPage").ibxWidget("show", $(e.target).data("contextItem"), $(e.target).data("selectedItems"), true, hprbUtil.environment.currentPath);							
		});
	}
	
	pruneMenu(jqFolderMenu, ibfsItem);

	jqFolderMenu.find("[data-ibx-name='foMenuItemOpen']").remove();
	if (treeItem._expanded)
		jqFolderMenu.find("[data-ibx-name='foMenuItemExpand']").remove();
	else
		jqFolderMenu.find("[data-ibx-name='foMenuItemCollapse']").remove();
		
	jqFolderMenu.find("[data-ibx-name='foMenuItemPaste']").ibxWidget("option", "disabled", hprbUtil.environment.copyCutVerb ? false : true);
	
	$.each(hprbUtil.environment.copyCutResources, function(idx)
			{
				if (this.fullPath == ibfsItem.fullPath)
				{
					jqFolderMenu.find("[data-ibx-name='foMenuItemPaste']").ibxWidget("option", "disabled", true);
					return false;
				}
				
				if (hprbUtil.environment.copyCutVerb == "cut")
				{
					if (this.parentPath == ibfsItem.fullPath || this.parentPath == ibfsItem.fullPath + "/")
					{
						jqFolderMenu.find("[data-ibx-name='foMenuItemPaste']").ibxWidget("option", "disabled", true);
						return false;
					}
				}
			});

	if (jqFolderMenu.find("[data-ibx-name='foMenuGeneralAccess']").length)
	{
		var uriExec = sformat("{1}/genaccess.bip", applicationContext);
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_GET_GEN_ACCESS",		
	 		ibfsPath: encodeURIComponent(ibfsItem.fullPath)
	 	};
	 	argument[IBI_random] = randomnum;
	 	
		$.get(uriExec, argument, 
				function(data) 
				{
					ibfsItem.genAccess = $("status", data).attr("message") == "true";
					if (ibfsItem.genAccess)
						jqFolderMenu.find("[data-ibx-name='foMenuItemAllowGenAccess']").ibxWidget("option", "checked", true);
					else
						jqFolderMenu.find("[data-ibx-name='foMenuItemDenyGenAccess']").ibxWidget("option", "checked", true);
				}
		);
	}
	
	return jqFolderMenu.find("[data-ibx-type='ibxMenuItem']").length ? jqFolderMenu : null;
};

dmProto.canvasMenu = function canvasMenu(event, contextItem)
{
	if (hprbUtil.environment.homepageMode != 0)
		return null;
	if (!hprbUtil.environment.copyCutVerb)
		return null;
	
	var selectedList = hprbUtil.environment.copyCutResources;
	var jqCanvasMenu = initMenu("canvas");
	setContext(jqCanvasMenu, contextItem, selectedList);
	pruneMenu(jqCanvasMenu, contextItem);
	
	if (jqCanvasMenu.find("[data-ibx-type='ibxMenuItem']").length == 0)
		return null;

	if (selectedList.length)
	{
		$.each(selectedList, function(idx)
		{
			if (hprbUtil.environment.copyCutVerb == "cut")
			{
				if (contextItem.fullPath+'/' == this.parentPath || contextItem.fullPath == this.parentPath)
				{
					jqCanvasMenu.find("[data-ibx-name='cnvMenuItemPaste']").ibxWidget("option", "disabled", true);
					return false;
				}
			}
			
			if (contextItem.fullPath == this.fullPath)
			{
				jqCanvasMenu.find("[data-ibx-name='cnvMenuItemPaste']").ibxWidget("option", "disabled", true);
				return false;
			}
		});
	}
	else
		jqCanvasMenu.find("[data-ibx-name='cnvMenuItemPaste']").ibxWidget("option", "disabled", true);

	return jqCanvasMenu;
};

dmProto.askResultsMenu = function askResultsMenu(contextItem, ibfsItem)
{
	contextItem = $(contextItem);
	var jqAskResultsMenu = initMenu("ask-results-menu");
	setContext(jqAskResultsMenu, ibfsItem);
	pruneMenu(jqAskResultsMenu, ibfsItem);
	
	return jqAskResultsMenu;
};

dmProto.askPhrasesMenu = function askPhrasesMenu(askPhrase)
{
	var jqAskPhraseMenu = initMenu("ask-phrases-menu");
	setContext(jqAskPhraseMenu, askPhrase);
	pruneMenu2(jqAskPhraseMenu, askPhrase);
	return jqAskPhraseMenu;
};

dmProto.columnmenu = function columnmenu(contextitem)
{
	
	var options = 
	{
		my: "right top",
		at: "right bottom",
		collision: "flip",
		of:contextitem
	};
	// create the menu....
	var columns = hprbUtil.environment.columns;
	var cmenu = $("<div>").ibxMenu({multiSelect : true});
	for (i=0; i < columns.length; i++)
	{
		var type=columns[i][1];
		if(hprbUtil.environment.homepageMode == 1 && columns[i][2] == "length")continue;
		if(type != "icon" && type != "menu" && columns[i][2] != "default")
		{
			// publish/show?
			if(columns[i][1] == "boolean" && !hprbUtil.environment.homePage.showExtraColumns() )continue;
			// tags?
			if(columns[i][2].indexOf("Category") > -1 && !hprbUtil.environment.homePage.showTags() )continue;
				
			var cmenuitem = $("<div>").ibxCheckMenuItem({checked:columns[i][3], labelOptions:{text:columns[i][0]}});			
			cmenuitem.data("row",i);
			cmenuitem.on("ibx_menu_item_click",function(e)
			{
				var row = $(e.target).data("row");
				hprbUtil.environment.columns[row][3]=!hprbUtil.environment.columns[row][3];	
				hprbUtil.environment.homePage.updateViews();
				if(!hprbUtil.environment.isComponent)	
					hprbUtil.environment.homePage.savePreferences();
				
			});									
			cmenu.ibxWidget("add", cmenuitem);
		}			
	}
	$(cmenu).ibxMenu("open").position(options);
	
};

dmProto.sortfieldmenu = function sortfieldMenu(contextitem)
{	
	var options = 
	{
		my: "right top",
		at: "right bottom",
		collision: "flip",
		of:contextitem
	};
	//if(!hprbUtil.environment.psortFieldsMenu)
	{	
		// create the menu....	
		var focusItem = null;
		var bSearch = hprbUtil.environment.homePage.inSearch();		
		var columns = hprbUtil.environment.columns;
		var cmenu = $("<div class='ibx-menu-no-icons'>").ibxMenu();
		for (i=0; i < columns.length; i++)
		{
			// don't show size field in portals mode.
			if(hprbUtil.environment.homepageMode == 1 && columns[i][2] == "length")continue;
			var type=columns[i][1];
			if(type != "icon" && type != "menu")
			{
				
				// only show currently visible grid items on sort menu
				if((columns[i][2] == "default" && hprbUtil.environment.homepageMode != 1 && !bSearch) || columns[i][3] )
				{					
					if(hprbUtil.environment.homePage.showExtraColumns() || columns[i][1] != "boolean")
					{	
						var cmenuitem = $("<div>").ibxMenuItem();
						cmenuitem.ibxMenuItem("option", "labelOptions.text", columns[i][0]);				
						cmenuitem.data("row",i);
						if(columns[i][2] == hprbUtil.environment.Items.getSortedValue())focusItem = cmenuitem;  
						cmenuitem.on("ibx_menu_item_click",function(e)
						{
							var row = $(e.target).data("row");
							hprbUtil.environment.Items.setSortedValue(hprbUtil.environment.columns[row][2]);
							hprbUtil.environment.Items.setSortedValueType(hprbUtil.environment.columns[row][1]);
							hprbUtil.environment.homePage.sortItems(columns[row][2], columns[row][1], false);					
						});									
						cmenu.ibxWidget("add", cmenuitem);
					}
				}	
			}			
		}
		//hprbUtil.environment.psortFieldsMenu = cmenu;
		cmenu.on("ibx_open", function(e)
		{
			if(focusItem)focusItem.focus();    	    			
		}.bind(this));
		cmenu.ibxMenu("open").position(options);
	}
	//$(hprbUtil.environment.psortFieldsMenu).ibxMenu("open").position(options);	
};

dmProto.mobileHamburgerMenu = function mobileHamburgerMenu()
{
	var options = 
	{
		my: "left top",
		at: "left top",
		collision: "fit",
		of: $(".main-panel"),
		effect: "scale"
	};	
	if(!hprbUtil.environment.hamburgerMenu)
	{	
		var mb_edit_menu = ibx.resourceMgr.getResource(".menu-mobile-hamburger");
		var jqMbItemMenu = $(mb_edit_menu);
		
		jqMbItemMenu.data('ibxWidget').mmhAskWebFocus.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.switchMode(4, true);	
		});
		jqMbItemMenu.data('ibxWidget').mmhContent.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.switchMode(0, true);	
		});
		jqMbItemMenu.data('ibxWidget').mmhPortals.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.switchMode(1, true);							
		});	
		jqMbItemMenu.data('ibxWidget').mmhFavorites.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.switchMode(2, true);							
		});	
		jqMbItemMenu.data('ibxWidget').mmhMobileFavorites.on("ibx_menu_item_click",function(e)
		{
			hprbUtil.environment.homePage.switchMode(3, true);							
		});
		jqMbItemMenu.data('ibxWidget').mmhChangePassword.on("ibx_menu_item_click",function(e)
		{
			onChangePassword();							
		});
		jqMbItemMenu.data('ibxWidget').mmhsignout.on("ibx_menu_item_click",function(e)
		{
			hpsignout();							
		});
		jqMbItemMenu.data('ibxWidget').mmhsignin.on("ibx_menu_item_click",function(e)
		{
			hpsignin();							
		});
		
		if (home_page_globals["showFavorites"] == "false" || home_page_globals["isAnonymousUser"] == "true") 
			jqMbItemMenu.data('ibxWidget').mmhFavorites.hide();
		if (home_page_globals["showmobileFavorites"] == "false" || home_page_globals["isAnonymousUser"] == "true") 
			jqMbItemMenu.data('ibxWidget').mmhMobileFavorites.hide();
		if (home_page_globals["askWebFOCUS"] != "true")
			jqMbItemMenu.data('ibxWidget').mmhAskWebFocus.hide();
		if (home_page_globals["isCanChangePassword"] == "false")
			jqMbItemMenu.data('ibxWidget').mmhChangePassword.hide();	
		if (home_page_globals["showPortals"] == "false")
			jqMbItemMenu.data('ibxWidget').mmhPortals.hide();	

		if (hprbUtil.environment.configMode > -1)
		{
			jqMbItemMenu.data('ibxWidget').mmhFavorites.hide();
			jqMbItemMenu.data('ibxWidget').mmhMobileFavorites.hide();
			jqMbItemMenu.data('ibxWidget').mmhContent.hide();
			jqMbItemMenu.data('ibxWidget').mmhPortals.hide();
			jqMbItemMenu.data('ibxWidget').mmhAskWebFocus.hide();
			jqMbItemMenu.data('ibxWidget').mmhsignin.hide();
			jqMbItemMenu.find(".mmh-separator").hide();
		}
		if(home_page_globals["isMobileFaves"] == "true")
		{
			jqMbItemMenu.find(".mmh-separator").hide();
			jqMbItemMenu.data('ibxWidget').mmhChangePassword.hide();			
			jqMbItemMenu.data('ibxWidget').mmhsignout.hide();
			jqMbItemMenu.data('ibxWidget').mmhsignin.hide();
		}	
		
		if (home_page_globals["isAnonymousUser"] == "true")
		{
			jqMbItemMenu.data('ibxWidget').mmhChangePassword.hide();
			jqMbItemMenu.data('ibxWidget').mmhsignout.hide();									
		}
		else
			jqMbItemMenu.data('ibxWidget').mmhsignin.hide();									


		hprbUtil.environment.hamburgerMenu = jqMbItemMenu;
		
		hprbUtil.environment.hamburgerMenu.on("ibx_close", function(e, origEvent)
		{	
			if($(origEvent.target).closest(".mobile-banner-hamburger").length)
				hprbUtil.environment.hamburgerMenu.ignoreClick = true;
			hprbUtil.environment.hamburgerOpen = false;
		}.bind(this));
		
		hprbUtil.environment.hamburgerMenu.on("ibx_open", function(e)
		{			
			hprbUtil.environment.hamburgerMenu.data('ibxWidget').mmhAskWebFocus.ibxWidget('option','disabled', hprbUtil.environment.homepageMode == 4 );
			hprbUtil.environment.hamburgerMenu.data('ibxWidget').mmhContent.ibxWidget('option','disabled', hprbUtil.environment.homepageMode == 0 ); 
			hprbUtil.environment.hamburgerMenu.data('ibxWidget').mmhPortals.ibxWidget('option','disabled', hprbUtil.environment.homepageMode == 1 );
			hprbUtil.environment.hamburgerMenu.data('ibxWidget').mmhFavorites.ibxWidget('option','disabled', hprbUtil.environment.homepageMode == 2 );
			hprbUtil.environment.hamburgerMenu.data('ibxWidget').mmhMobileFavorites.ibxWidget('option','disabled', hprbUtil.environment.homepageMode == 3 );	
			hprbUtil.environment.hamburgerMenu.data('ibxWidget').mmhContent.focus();
			hprbUtil.environment.hamburgerOpen = true;
		}.bind(this));
	}
	if(hprbUtil.environment.hamburgerMenu.ignoreClick)
	{
		hprbUtil.environment.hamburgerMenu.ignoreClick = false;
		return;
	}	
	
	if(hprbUtil.environment.hamburgerOpen)
		hprbUtil.environment.hamburgerMenu.ibxMenu("close");
	else
	{			
		hprbUtil.environment.hamburgerMenu.ibxMenu("option", "position", options).ibxMenu("open");		
	}	
	
};

//# sourceURL=homeDomainsMenus.js