/*Copyright 1996-2019 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.0 $:
//////////////////////////////////////////////////////////////////////////

$.widget("ibi.selectdatasource", $.ibi.ibxDialog, {
	options: 
	{
		"state": "flat",
		"mode":	"list",
		"type": "sds", /* define in selectdatasource.css */
		"nameRoot": true,
		"opaque": false,
		"fullPath": "IBFS:/WFC/Repository",
		"curRSPath": "",
		"captionOptions": 
		{
			"text": ibx.resourceMgr.getString("str_select_data_source")
		},
	},
	
	_widgetClass: "select-data-source",
	_contentPage: null,
	_dsStateBtn: null,
	_dsColSelBtn: null,
	_breadCrumbContainer: null,
	_bcLevel: 0,
	_curWorkspace: null,
	_firstGridDisplay: true,
	
	_create: function () {
		this._super();
		this._dsStateBtn = this.element.find(".flat-view-menu-control-btn");
		this._dsStateBtn.ibxWidget('option', "icon",  applicationContext + "/ibxtools/shared_resources/images/flatten.png")
		this._colSelBtn = this.element.find('.grid-view-menu-control-btn');
		this.__breadCrumbContainer = this.element.find('.breadcrumb-hbox');
		this.element.find('.ibx-title-bar-close-button').prop('tabindex', '0').prop('title', ibx.resourceMgr.getString("dataselect_close_dialog"));
		this.element.find('.ibx-dialog-cancel-button').prop('tabindex', '0').prop('title', ibx.resourceMgr.getString("dataselect_cancel_dialog"));
		this.element.find('.ibx-dialog-ok-button').prop('tabindex', '0').prop('title', ibx.resourceMgr.getString("dataselect_select_dialog"));
		this.element.find('.ibx-title-bar-caption').prop('title', ibx.resourceMgr.getString('dataselect_select_datasource'));
	},
	
	_setOption: function(key, value)
	{
		this._super(key, value);
		if (key == 'state')
		{
			this._setStateBtn();
			if (value == 'folder')
			{
				this._contentPage.ibxWidget('option', "noDblClick", false);
			}
		}
		if (key == "mode")
		{
			if (this._contentPage)
			{
				this._contentPage.ibxWidget('option', "mode", value);
				this._setModeBtn();
			}
		}
	},
	
	_setColSelBtn: function()
	{
		if (this.options.mode == "tile")
			this._colSelBtn.ibxWidget('option', 'disabled', true);
		else
			this._colSelBtn.ibxWidget('option', 'disabled', false);
	},
	
	_setStateBtn: function()
	{
		if (this.options.state == "folder")
		{
			this._dsStateBtn.ibxWidget('option', 'icon', applicationContext + "/ibxtools/shared_resources/images/flatten.png");
			this._dsStateBtn.prop('title', ibx.resourceMgr.getString("dataselect_switch_to_flat"));
			this._contentPage.ibxWidget('option', "noDblClick", false);
		}
		else
		{
			this._dsStateBtn.ibxWidget('option', 'icon', applicationContext + "/ibxtools/shared_resources/images/folder-open.png");
			this._dsStateBtn.prop('title', ibx.resourceMgr.getString("dataselect_switch_to_folder"));
		}
	},
	
	_setModeBtn: function()
	{
		if (this.options.mode == "list")
		{
			this.element.find(".grid-view-btn").ibxRemoveClass("list-view-btn-focus");
			this.element.find(".list-view-btn").ibxAddClass("grid-view-btn-focus");
		}
		else
		{
			this.element.find(".grid-view-btn").ibxAddClass("list-view-btn-focus");
			this.element.find(".list-view-btn").ibxRemoveClass("grid-view-btn-focus");
		}
		
		this._setColSelBtn();
	},
	
	_init: function () 
	{
		this._super();
		var dataSourceFilter = this.element.find('.select-data-source-type-filter');
		var dataSourceFilterGlyph = this.element.find('.select-data-source-type-filter-glyph');
		dataSourceFilterGlyph.ibxWidget('option', 'icon', applicationContext + "/ibxtools/shared_resources/images/simple@2x.png")
		dataSourceFilterGlyph.on('click', function(e)
		{
			this.element.find('.select-data-source-type-filter > input').dispatchEvent('click');
		}.bind(this));
		
		this.element.find('.new-workspace-selector .ibx-label-text').on('click', function(e)
		{
			this.element.find('.new-workspace-selector > .ibx-menu-button').dispatchEvent('click');
		}.bind(this));
		
		dataSourceFilter.on('ibx_change', function(e)
		{
			this._contentPage.ibxWidget('filter',
				[
					{
						'colId': "type",
						'matchType': "contains",
						'text': $(e.target).ibxWidget('selected').ibxWidget('userValue')
					},
					{
						'colId': "title",
						'matchType': "contains",
						'text': this.element.find('.select-data-source-search').ibxWidget('option', 'text')
					}

				]
			);
			
			this._checkForNoMatch();
		}.bind(this));
		
		var dsColSel = this.element.find('.select-data-source-hbox').find('.grid-view-menu-control-btn'); 
		dsColSel.on('click', function(e)
		{
			var colSelector = this.element.find('.view-all-items-results').find('.grid-view-menu-control-btn')
			colSelector.dispatchEvent('click', dsColSel);
		}.bind(this));
		
		this._setModeBtn();
		this._setStateBtn();
		
		this._dsStateBtn.on('click', function(e)
		{
			this.options.state = (this.options.state == 'folder' ? "flat" : "folder");
			this._setStateBtn();
			ibx.waitStart('.select-data-source');
			this._loadGrid(this._curWorkspace);
		}.bind(this));		
		
		var dsGridBtn = this.element.find('.select-data-source-hbox').find('.grid-view-btn'); 
		var dsListBtn = this.element.find('.select-data-source-hbox').find('.list-view-btn'); 
		dsGridBtn.on('click', function(e)
		{
			this.element.find(".home-domains-content-page").ibxWidget('remove', this.selectDataSourceEmptyState);
			this.element.find(".home-domains-content-page").ibxWidget('remove', this.selectFilterEmptyState);
			this.options.mode = "tile";
			this._setModeBtn();
			var vb = this.element.find('.view-all-items-results').find('.grid-view-btn')
			vb.dispatchEvent('click');
			if (!this._firstGridDisplay)
			{
				this._checkForNoChildren();
				this._contentPage.ibxWidget('filter',
						[
							{
								'colId': "type",
								'matchType': "contains",
								'text': this.element.find('.select-data-source-type-filter').ibxWidget('selected').ibxWidget('userValue')
							},
							{
								'colId': "title",
								'matchType': "contains",
								'text': this.element.find('.select-data-source-search').ibxWidget('option', 'text')
							}
	
						]);
				this._checkForNoMatch();
			}
			else
			{
				this._firstGridDisplay = false;
				this.element.find('.view-all-items').on('render-done part_render_done all_render_done', function(e)
				{
					this._checkForNoChildren();
					this._contentPage.ibxWidget('filter',
							[
								{
									'colId': "type",
									'matchType': "contains",
									'text': this.element.find('.select-data-source-type-filter').ibxWidget('selected').ibxWidget('userValue')
								},
								{
									'colId': "title",
									'matchType': "contains",
									'text': this.element.find('.select-data-source-search').ibxWidget('option', 'text')
								}
		
							]);
					this._checkForNoMatch();
				}.bind(this));
			}
		}.bind(this));
		
		dsListBtn.on('click', function(e)
		{
			this.element.find(".home-domains-content-page").ibxWidget('remove', this.selectDataSourceEmptyState);
			this.element.find(".home-domains-content-page").ibxWidget('remove', this.selectFilterEmptyState);
			this.options.mode = "list";
			this._setModeBtn();
			var vb = this.element.find('.view-all-items-results').find('.list-view-btn')
			vb.dispatchEvent('click');
			this._checkForNoChildren();
			this._contentPage.ibxWidget('filter',
					[
						{
							'colId': "type",
							'matchType': "contains",
							'text': this.element.find('.select-data-source-type-filter').ibxWidget('selected').ibxWidget('userValue')
						},
						{
							'colId': "title",
							'matchType': "contains",
							'text': this.element.find('.select-data-source-search').ibxWidget('option', 'text')
						}

					]);
			this._checkForNoMatch();
		}.bind(this));
		
		this.listItemsNumber = 1; // there is always one
		this.selectDataSourceEmptyState = ibx.resourceMgr.getResource('.select-data-source-empty-state');
		this.selectFilterEmptyState = ibx.resourceMgr.getResource('.select-data-source-filter-empty-state');
		
		this.element.on('grid_click', function (e) 
		{
			var item = e.originalEvent.data;
			if (!item.container)
				this.element.find('.ibx-dialog-ok-button').ibxWidget('option', 'disabled', false);
			else
				this.element.find('.ibx-dialog-ok-button').ibxWidget('option', 'disabled', true);
		}.bind(this));
		
		this.element.on('chk_srvr_access_error', function (e) {
			ibx.waitStop(".select-data-source");
		}.bind(this));

		this.element.find('.ibx-dialog-ok-button').on("click", function (e) {
			this._contentPage.dispatchEvent('stop_loading');
		}.bind(this));

		this.element.on('grid_dblclick', function (e) {
			this.element.find('.ibx-dialog-ok-button').click();
		}.bind(this));

		this.element.on('dblclick_loaded', function (e)
		{
			this._checkForNoChildren();
			this._contentPage.ibxWidget('filter',
					[
						{
							'colId': "type",
							'matchType': "contains",
							'text': this.element.find('.select-data-source-type-filter').ibxWidget('selected').ibxWidget('userValue')
						},
						{
							'colId': "title",
							'matchType': "contains",
							'text': this.element.find('.select-data-source-search').ibxWidget('option', 'text')
						}

					]);
			this._checkForNoMatch();
		}.bind(this));
		
		this.element.on('folder_dblclick', function (e)
		{
			var item = e.originalEvent.data;
			this._folderLoad(item);
		}.bind(this))
		
		this.element.on('dblclick_navigate', function (e)
		{
			var item = e.originalEvent.data;
			var fp = item.fullPath;
			var pathParts = fp.split('/');  //IBFS:/EDA/EDASERVE/ibisamp or IBFS:/WFC/Repository/Foo
			var bcBtn;
			if (this._bcLevel == 0)
			{
				if (fp.indexOf('/EDA/') != -1)
				{
					bcBtn = $("<div tabindex='0' class='bc-btn' style='user-select: none;'>").ibxButton({'text':pathParts[2]});
					bcBtn.data('item', this._curWorkspace);	//{fullPath: "IBFS:/EDA/"+pathParts[2]});
					bcBtn.prop('title', pathParts[2]);
				}
				else
				{
					var workspace = this.element.find('.new-workspace-selector').ibxWidget('option', 'text').split('>')[3].split('</')[0];
					bcBtn =  $("<div tabindex='0' class='bc-btn' style='user-select: none;'>").ibxButton({'text': workspace});
					bcBtn.data('item', this._curWorkspace);
					bcBtn.prop('title', workspace);
				}
				
				bcBtn.data('level', this._bcLevel);
				bcBtn.on('click', function(e)
				{
					this.element.dispatchEvent('breadcrumb_click', $(e.target).closest('.ibx-button'));
				}.bind(this));
				this.__breadCrumbContainer.ibxWidget('add', bcBtn);
			}
			
			this.__breadCrumbContainer.ibxWidget('add', $("<div class='bc-divider'>").ibxLabel({text: '/'}));
			var desc = (item.fullPath.indexOf('/EDA') != -1 ? pathParts[pathParts.length-1] : item.description);
			bcBtn = $("<div tabindex='0' class='bc-btn' style='user-select: none;'>").ibxButton({'text': desc}).data('item', item);
			bcBtn.data('level', ++this._bcLevel);
			bcBtn.prop('title', desc);
			bcBtn.on('click', function(e)
			{
				this.element.dispatchEvent('breadcrumb_click', $(e.target).closest('.ibx-button'));
			}.bind(this));
			this.__breadCrumbContainer.ibxWidget('add', bcBtn);
			
			e.stopPropagation();
		}.bind(this));
		
		this.element.on('breadcrumb_click', function(e)
		{
			var shouldShowMasters = this._curWorkspace.policy['opDesignerMetadata']; 
			var shouldShowROs = this._curWorkspace.policy['opDesignerReportingObject'] && !this.options.ignoreROs;
			var hasWorkbookDesigner = this._curWorkspace.policy['opWorkbookDesigner'];
			if (!shouldShowMasters && !shouldShowROs && hasWorkbookDesigner)
			{
				shouldShowMasters = true;
				shouldShowROs = true;
			}

			var bcBtn = e.originalEvent.data;
			var item = bcBtn.data('item');
			var level = bcBtn.data('level')
			if (level == 0)
				this.element.find('.breadcrumb-hbox').ibxWidget('remove');
			else
				this._cleanBreadcrumb(level);
			
			this._bcLevel = level;
			
			var app = item.effectiveAppName;
			var server = item.effectiveRSName;

			this._folderLoad(item);
		}.bind(this))
		
		this.element.on('list_done_loading', function () {
			ibx.waitStop(".select-data-source");
			this.element.focus();
		}.bind(this));

		this.element.find(".ibx-dialog-ok-button").ibxWidget('option', 'text', ibx.resourceMgr.getString("hpreboot_select"));
		this.element.find('.ibx-dialog-ok-button').ibxWidget('option', 'disabled', true);

		this._contentPage = this.element.find('.view-all-items');
		this._contentPage.ibxWidget('option',
				{
					"mode": this.options.mode, 
					"noDblClick": true,
					"performSort":true, 
					"fillMissingTitle": true,
					"type": "datasource", 
					"hideCloseBtn": true, 
					"selType": "single",
				});

		this.splitMenuItem = this.element.find(".select-data-source-split-menu-items");
		this.splitMenuButton = this.element.find(".select-data-source-split-menu-button");

		this.element.find('.select-data-source-search').on('ibx_textchanged', function (e) 
		{
			this.element.find('.ibx-dialog-ok-button').ibxWidget('option', 'disabled', true);
			var txt = $(e.currentTarget).ibxWidget('option', 'text')
			this._contentPage.ibxWidget('filter',
					[
						{
							'colId': "title",
							'matchType': "contains",
							'text': txt
						},
						{
							'colId': "type",
							'matchType': "contains",
							'text': this.element.find('.select-data-source-type-filter').ibxWidget('selected').ibxWidget('userValue')
						}
					]
				);
			
			this._checkForNoMatch();
		}.bind(this));
	},
	
	_checkForNoChildren: function()
	{
		var numChildren = 0;
		numChildren = this._contentPage.ibxWidget('getNumChildren', true);
		if (this.options.mode == 'list')
		{
			if (numChildren == 0)
			{
				this.element.find('.select-data-source-search').ibxWidget('option', 'disabled', true);
				this.element.find('.select-data-source-type-filter').ibxWidget('option', 'disabled', true);
				this.element.find(".home-domains-content-page").ibxWidget('add', this.selectDataSourceEmptyState);
			}
			else
			{
				this.element.find(".home-domains-content-page").ibxWidget('remove', this.selectDataSourceEmptyState);
				this.element.find('.select-data-source-type-filter').ibxWidget('option', 'disabled', false);
				this.element.find('.select-data-source-search').ibxWidget('option', 'disabled', false);
			}
		}
		else
		{
/*
 			var numFolders = 0;
			var numItems = 0;
			this.element.find('.domains-folder-div-w-label').show();
			this.element.find('.domains-item-div-w-label').show();
			
			numFolders = this.element.find('.domains-folder-div').ibxWidget('children').length; 
			numItems = this.element.find('.domains-item-div').ibxWidget('children').length;
			numChildren = numFolders + numItems;
*/			
			if (numChildren == 0)
			{
				this.element.find('.domains-folder-div-w-label').hide();
				this.element.find('.domains-item-div-w-label').hide();
				this.element.find('.select-data-source-search').ibxWidget('option', 'disabled', true);
				this.element.find('.select-data-source-type-filter').ibxWidget('option', 'disabled', true);
				this.element.find(".home-domains-content-page").ibxWidget('add', this.selectDataSourceEmptyState);
			}
		}
		
		this._numListedChildren = numChildren;
	},
	
	_checkForNoMatch: function()
	{		
		if (this._numListedChildren == 0)
			return;
		
		var numChildren = 0;
		if (this.options.mode == 'list')
		{
			var rows = this.element.find('.home-content-grid .ibx-data-grid-row');
			$.each(rows, function(i, elt) 
			{
				if ($(elt).is(':visible'))
				{
					numChildren++
					return false;
				}
			});
			if (numChildren == 0)
			{
				this.element.find(".home-domains-content-page").ibxWidget('add', this.selectFilterEmptyState);
			}
			else
			{
				this.element.find(".home-domains-content-page").ibxWidget('remove', this.selectFilterEmptyState);
				this.element.find('.select-data-source-type-filter').ibxWidget('option', 'disabled', false);
				this.element.find('.select-data-source-search').ibxWidget('option', 'disabled', false);
			}
		}
		else
		{
			var numFolders = 0;
			var numItems = 0;
			this.element.find('.domains-folder-div-w-label').show();
			this.element.find('.domains-item-div-w-label').show();
			
			var folders = this.element.find('.domains-folder-div').ibxWidget('children'); 
			$.each(folders, function(i, elt) 
			{
				if ($(elt).is(':visible'))
				{
					numFolders++;
					return false;
				}
			});
			
			if (numFolders == 0)
				this.element.find('.domains-folder-div-w-label').hide();
			
			var items = this.element.find('.domains-item-div').ibxWidget('children');
			$.each(items, function(i, elt) 
			{
				if ($(elt).is(':visible'))
				{
					numItems++;
					return false;
				}
			});
			
			if (numItems == 0)
				this.element.find('.domains-item-div-w-label').hide();
			
			if ((numFolders+numItems) == 0)
			{
				this.element.find(".home-domains-content-page").ibxWidget('add', this.selectFilterEmptyState);
			}
			else
			{
				this.element.find(".home-domains-content-page").ibxWidget('remove', this.selectFilterEmptyState);
				this.element.find('.select-data-source-type-filter').ibxWidget('option', 'disabled', false);
				this.element.find('.select-data-source-search').ibxWidget('option', 'disabled', false);
			}
		}
	},
	
	_cleanBreadcrumb: function(level)
	{
		var children = this.__breadCrumbContainer.ibxWidget('children');
		for (var i = children.length-1; i > 0; i--)
		{
			var child = $(children[i]);
			if (child.is('.bc-btn') && child.data('level') == level)
				break;
			
			this.__breadCrumbContainer.ibxWidget('remove', child);
		}
	},
	
	_flatLoad: function(item)
	{
		var app = item.effectiveAppName;
		var server = item.effectiveRSName;
		
		var shouldShowMasters = item.policy['opDesignerMetadata']; 
		var shouldShowROs = item.policy['opDesignerReportingObject'] && !this.options.ignoreROs;
		var hasWorkbookDesigner = item.policy['opWorkbookDesigner'];
		if (!shouldShowMasters && !shouldShowROs && hasWorkbookDesigner)
		{
			shouldShowMasters = true;
			shouldShowROs = true;
		}
		var path;
		var masters = [];

		setTimeout(function()
		{
			if (shouldShowMasters)
			{
				if (!app) 
				{
					path = "IBFS:/EDA/" + server + "/*.mas";
					Ibfs.ibfs.listItems(path, "-1", true, 
					{
						async: false,
						asJSON: true
					}).done(function (cInfo) 
					{
						for (var i = 0; i < cInfo.result.length; i++) 
						{
							cInfo.result[i].clientInfo.typeInfo.glyphClasses = "ibx-icons ds-icon-master";
							cInfo.result[i].description = cInfo.result[i].name;
							cInfo.result[i].application = cInfo.result[i].fullPath.split('/')[3];
						}
						masters = cInfo.result;
					}.bind(this));
				}
				else 
				{
					var apps = [];
					path = item.fullPath + "/##APPPATH";
					Ibfs.ibfs.listItems(path, "1", true, 
					{
						async: false,
						asJSON: true,
						parms:{"IBFS_options":"includeDefAppPathFolders;omit=foccache"}
					}).done(function (cInfo) 
					{
						for (var i = 0; i < cInfo.result.length; i++)
						{
							var app = cInfo.result[i].name;
							apps.push(app);
						}
					});
					
					for (var i = 0; i < apps.length; i++) 
					{
						path = "IBFS:/EDA/" + server + "/" + apps[i] + "/*.mas";
						Ibfs.ibfs.listItems(path, "-1", true, 
						{
							async: false,
							asJSON: true
						}).done(function (cInfo) 
						{
							for (var i = 0; i < cInfo.result.length; i++) 
							{
								cInfo.result[i].clientInfo.typeInfo.glyphClasses = "ibx-icons ds-icon-master";
								cInfo.result[i].description = cInfo.result[i].name;
								cInfo.result[i].application = cInfo.result[i].fullPath.split('/')[3];
								masters.push(cInfo.result[i]);
							}
						}.bind(this));
					}
				}
	
				path = item.fullPath + '/*.mas';
				Ibfs.ibfs.listItems(path, "-1", true, 
				{
					async: false,
					asJSON: true
				}).done(function (cInfo) 
				{
					for (var i = 0; i < cInfo.result.length; i++)
					{
						cInfo.result[i].clientInfo.typeInfo.glyphClasses = "ibx-icons ds-icon-master";
						cInfo.result[i].application = cInfo.result[i].fullPath.split('/')[3];
						masters.push(cInfo.result[i]);
					}
				}.bind(this));
			}
			
			if (shouldShowROs)
			{
				path = item.fullPath + '/##FILTER("attribute","type","ROFexFile","")';
				Ibfs.ibfs.listItems(path, "-1", true, 
				{
					async: false,
					asJSON: true
				}).done(function (cInfo) 
				{
					for (var i = 0; i < cInfo.result.length; i++) 
					{
						cInfo.result[i].application = cInfo.result[i].fullPath.split('/')[3];
						masters.push(cInfo.result[i]);
					}
				}.bind(this));
			}
		
			ibx.waitStop(".select-data-source");
			if (masters.length == 0)
			{
				this._contentPage.ibxWidget('reset');
				this._contentPage.dispatchEvent("child_list", {'children': masters});
				vair.hide();
				this.element.find('.select-data-source-search').ibxWidget('option', 'disabled', true);
				this.element.find(".home-domains-content-page").ibxWidget('add', this.selectDataSourceEmptyState);
			}
			else
			{
				this.element.find('.select-data-source-search').ibxWidget('option', 'disabled', false);
				this._contentPage.ibxWidget('setDetailLabel', ["","","datasource"]);
				this._contentPage.ibxWidget('reset');
				this._contentPage.dispatchEvent("child_list", {'children': masters});
			}
		}.bind(this), 50);
	},
	
	
	_folderLoad: function(item)
	{
		var server = item.effectiveRSName;
		
		var isEDAPath = item.fullPath.includes('/EDA/');
		var shouldShowMasters = (isEDAPath ? true : item.policy['opDesignerMetadata']); 
		var shouldShowROs = (isEDAPath ? true : item.policy['opDesignerReportingObject'] && !this.options.ignoreROs);
		var hasWorkbookDesigner = item.policy['opWorkbookDesigner'];
		if (!shouldShowMasters && !shouldShowROs && hasWorkbookDesigner)
		{
			shouldShowMasters = true;
			shouldShowROs = true;
		}

		var path;
		var masters = [];
		var deferredList = [];

		ibx.waitStart(".select-data-source");

		if (shouldShowMasters)
		{
			if (isEDAPath) 	// EDA paths use regular list
			{
				path = item.fullPath;
				
				var dfr1 = Ibfs.ibfs.listItems(path, "1", true, 
				{
					async: true,
					asJSON: true
				}).done(function (cInfo) 
				{
					var child;
					for (var i = 0; i < cInfo.result.length; i++) 
					{
						child = cInfo.result[i];
						if (child.extension && cInfo.result[i].extension == "mas")
						{
							child.clientInfo.typeInfo.glyphClasses = "ibx-icons ds-icon-master";
							child.description = cInfo.result[i].name;
							child.application = cInfo.result[i].fullPath.split('/')[3];
						}
						else if (child.container)
						{
							child.description = cInfo.result[i].name;
							child.clientInfo.typeInfo.icon = applicationContext + "/ibxtools/shared_resources/images/data-server@2x.png";
						}
						else
							continue;

						masters.push(child);
					}
				}.bind(this));
				deferredList.push(dfr1.deferred);
			}
			else  // WFC paths use #APPPATH list				
			{
				var child;
				var apps = [];
				path = item.fullPath + "/##APPPATH";
				var dfr2 = Ibfs.ibfs.listItems(path, "1", true, 
				{
					async: true,
					asJSON: true,
					parms:{"IBFS_options":"includeDefAppPathFolders;omit=foccache"}
				}).done(function (cInfo) 
				{
					for (var i = 0; i < cInfo.result.length; i++)
					{
						child = cInfo.result[i];
						child.description = cInfo.result[i].name;
						child.clientInfo.typeInfo.icon = applicationContext + "/ibxtools/shared_resources/images/data-server@2x.png";
						masters.push(child);
					}
				}.bind(this));
				deferredList.push(dfr2.deferred);
			}
		}
		
		path = item.fullPath + '/##FILTER("attribute","type","MRFolder","")';
		var dfr3 = Ibfs.ibfs.listItems(path, "1", true, 
		{
			async: true,
			asJSON: true
		}).done(function (cInfo) 
		{
			var child;
			for (var i = 0; i < cInfo.result.length; i++) 
			{
				child = cInfo.result[i];
				if (!child.container && child.extension == "mas")
				{
					child.clientInfo.typeInfo.glyphClasses = "ibx-icons ds-icon-master";
					child.application = child.fullPath.split('/')[3];
					masters.push(child);
				}
				else
				{
					masters.push(child);
				}
			}
		}.bind(this));
		deferredList.push(dfr3.deferred);
		
		if (shouldShowROs)
		{
			path = item.fullPath + '/##FILTER("attribute","type","ROFexFile,LinkItem","")';
			var dfr4 = Ibfs.ibfs.listItems(path, "1", true, 
			{
				async: true,
				asJSON: true
			}).done(function (cInfo) 
			{
				var child;
				for (var i = 0; i < cInfo.result.length; i++) 
				{
					child = cInfo.result[i];
					if (!child.container && child.extension == "mas")
					{
						child.clientInfo.typeInfo.glyphClasses = "ibx-icons ds-icon-master";
						child.application = child.fullPath.split('/')[3];
						masters.push(child);
					}
					else
					{
						masters.push(child);
					}
				}
			}.bind(this));
			
			deferredList.push(dfr4.deferred);
		}

		$.when.apply($, deferredList).always(function()
		{
			ibx.waitStop(".select-data-source");

			if (masters.length == 0)
			{
				this._contentPage.ibxWidget('reset');
				this._contentPage.dispatchEvent("child_list", {'children': masters});
				this.element.find('.select-data-source-search').ibxWidget('option', 'disabled', true);
				this.element.find(".home-domains-content-page").ibxWidget('add', this.selectDataSourceEmptyState);
			}
			else
			{
				this._contentPage.ibxWidget('setDetailLabel', ["","","datasource"]);
				this._contentPage.ibxWidget('reset');
				this._contentPage.dispatchEvent("child_list", {'children': masters});
			}
		}.bind(this));
		
	},
	
	_loadGrid: function (item, skipCheck) 
	{
		if (!skipCheck) 
		{
			var sa = new ServerAccess();
			sa.checkCredentials(item.effectiveRSName, this._loadGrid.bind(this), item, false);
			return;
		}

		this.element.find('.new-workspace-selector').prop('title', item.description);
		this.element.find('.breadcrumb-hbox').ibxWidget('remove');
		var description = "<span style='user-select: none; font-weight: bold; color:#34515e; font-size: 14px'>" + ibx.resourceMgr.getString("hpreboot_workspace").toUpperCase() + ": " + "</span>" +  "<span style='user-select: none; font-size: 14px;'>" + item.description + "</span>";
		this.splitMenuButton.ibxWidget('option', 'text', description);

		this._bcLevel = 0;
		this.workSpace = item;
//		this.element.find('.select-data-source-search').ibxWidget('option', 'text', "");
		this.element.find(".home-domains-content-page").ibxWidget('remove');
		
		var vair = this.element.find('.view-all-items-results');
		if (this.options.state == 'flat')
		{
			this._flatLoad(item);
		}
		else	// folder mode
		{			
			this._folderLoad(item);
		}
	},

	loadstd: function (workSpace) {
		this.workSpaceIdx = 0; // default
		ibx.waitStart(".select-data-source");
		Ibfs.ibfs.listItems(this.options.fullPath, "1", false, {
			asJSON: true
		}).done(function (cInfo) {
			this.splitMenuButton.ibxWidget("option", "textIsHtml", true);
			this.listItemsNumber = 0;
			var mi;
			for (var i = 0; i < cInfo.result.length; i++) // Level 2
			{
				child = cInfo.result[i];
				if (child.container && child.type !== 'PGXBundle' && child.type !== 'PRTLXBundle')
				{
					if (child.fullPath == workSpace)
						this.workSpaceIdx = i;
					
					mi = $("<div class='select-data-source-menu-item'>").ibxMenuItem({'labelOptions': {'text': child.description}}).data("item", child.description);
					mi.data("item", child);
					mi.on('click', function (e) 
					{
						if (this.listItemsNumber > 1) 
						{ // in case that you only have one workspace then do nothing
							this.element.find('.ibx-dialog-ok-button').ibxWidget('option', 'disabled', true);
							e.stopPropagation();
							var item = $(e.currentTarget).data("item");	
							this._curWorkspace = item;
							ibx.waitStart(".select-data-source");
							setTimeout(function () {
								this._loadGrid(item);
							}.bind(this), 0);
						}	
					}.bind(this));
					this.listItemsNumber++;
					this.splitMenuItem.ibxWidget("add", mi);
				}
			}
			var maxRows = this.listItemsNumber > 10 ? 10 : this.listItemsNumber;
			this.splitMenuItem.css({"height": (maxRows * 31) + "px"});

			var description = ibx.resourceMgr.getString("hpreboot_workspace") + ": <span style=color:#34515e>" + cInfo.result[this.workSpaceIdx].description + "</span>";
			this.splitMenuButton.ibxWidget('option', 'text', description); // first time

			this._curWorkspace = cInfo.result[this.workSpaceIdx];
			this._loadGrid(cInfo.result[this.workSpaceIdx]);
		}.bind(this));
	},
	getSelected: function () {
		var selItems = this._contentPage.ibxWidget('getSelectedResources');
		return $(selItems[0]).data('item');
	},
	getWorkSpace: function () {
		return this.workSpace;
	},
});


//# sourceURL=selectdatasource.js