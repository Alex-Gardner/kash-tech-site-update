/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.82 $:

jQuery.event.special['ibx_change'] = { noBubble: true };

var editorActionHandler = "/editor.bip";
var aceModelist = "ace/ext/modelist";
var modePrefix = "ace/mode/";

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

$.widget("ibi.textEditorTabPage", $.ibi.ibxTabPage, 
{
	options:
	{
		nameRoot : true,
		selected : true
	},
	
	_widgetClass:"text-editor-tab-page",

	_create:function()
	{
		this._super();

	    this._editorWidget = null;
		
		this._defaultSearchOptions = 
		{
		    backwards: false,
		    wrap: true,
		    caseSensitive: false,
		    wholeWord: false,
		    regExp: false
		};
		
		this._supportedFormatIcons = 
		{
				"txt":"ibx-icons ds-icon-txt",
				"fex":"ibx-icons ds-icon-foc",
				"mas":"ibx-icons ds-icon-master",
				"man":"ibx-icons ds-icon-page",
				"js":"ibx-icons ds-icon-js",
				"htm":"ibx-icons ds-icon-html1",
				"html":"ibx-icons ds-icon-html1",
				"css":"ibx-icons ds-icon-css",
				"sty":"ibx-icons ds-icon-style",
				"r":"ibx-icons ds-icon-r-file",
				"py":"ibx-icons ds-icon-logo-python",
				"sql":"ibx-icons ds-icon-sql",
				"prop":"fa fa-cog"
		};
				
		this._search = null;
		
		this.currentAction = 0; // 1-New, 2-Open, 3-Close, 4-Exit, -1-Exit unconditional

		this.tool = "";
		this.type = "";
		this.mode = "";
		this._callbackFunc = null;
		
		this.fullName = "";
		this.itemName = "";
		this.extension = "";
		this.itemDescription = "";			
		this.rootPath = "";
		this.folderPath = "";
		this.fullItemPath = "";
		this.newDoc = true;
		this.linkName = true;
				
	    this.fromClose = false;
	    this.editor_options = 
	    {
			"fType":this.extension,
			"newDoc":this.newDoc,
			"servers":[],
			"srvChk":false, 
		  	"server":"EDASERVE",
		  	"appChk":false,
		  	"appPath":"",
		  	"myReport":false,
		  	"paramPrompt":true,
		  	"roPath":"" 
		};
		this.iaMode = false;		
		this.canchangeserverprops = true;
		
		this._myDirtyLabel =  $("<div class='text-editor-tab-page-dirty_label'>").ibxLabel();
		this._tabButton.ibxWidget("add", this._myDirtyLabel);
		
		var mybutton = $("<div class='text-editor-tab-page-close-button'>").ibxButtonSimple({'glyphClasses':'ibx-icons ds-icon-close'});
        this._tabButton.ibxWidget("add", mybutton);
        mybutton.on("click", this._onTabCloseButton.bind(this));        
		
		this._searchPanel = ibx.resourceMgr.getResource('.te-search-panel', false);
		this.element.append(this._searchPanel);
		ibx.bindElements(this._searchPanel);	

       
	    this._editorWidget = $("<div></div>");
		this.element.append(this._editorWidget);

		this._editorWidget.aceEditor({ "config": 
		                                  {"enableLiveAutocompletion": true,
										   "displayIndentGuides": true,
										   "enableSnippets": true}, 
									   "props":  
										   {"statusBar" : true,
										    "disabledHotkeys": []}}); 
		ibx.bindElements(this._editorWidget);
		
		this.edWid = this._editorWidget.data("ibiAceEditor");
		
		this._contextMenu = ibx.resourceMgr.getResource(".te-edit-menu");
		this.edWid.option("ctxMenu", this._contextMenu);
		ibx.bindElements(this._contextMenu);
		
		this._contextMenu.find(".menu-edit-copy").on("ibx_menu_item_click", this._onMenuEditCopy.bind(this));
		this._contextMenu.find(".menu-edit-cut").on("ibx_menu_item_click", this._onMenuEditCut.bind(this));
		this._contextMenu.find(".menu-edit-paste").on("ibx_menu_item_click", this._onMenuEditPaste.bind(this));

		this._contextMenu.find(".menu-edit-selectall").on("ibx_menu_item_click", this._onMenuEditSelectAll.bind(this));
		this._contextMenu.find(".menu-edit-clear").on("ibx_menu_item_click", this._onMenuEditClear.bind(this));
		this._contextMenu.find(".menu-edit-uppercase").on("ibx_menu_item_click", this._onMenuEditUpperCase.bind(this));
		this._contextMenu.find(".menu-edit-lowercase").on("ibx_menu_item_click", this._onMenuEditLowerCase.bind(this));
		
		this._contextMenu.find(".menu-edit-undo").on("ibx_menu_item_click", this._onMenuEditUndo.bind(this));
		this._contextMenu.find(".menu-edit-redo").on("ibx_menu_item_click", this._onMenuEditRedo.bind(this));
		
		this._contextMenu.find(".menu-edit-comment").on("ibx_menu_item_click", this._onMenuEditComment.bind(this));
		//this._contextMenu.find(".menu-edit-comment-block").on("ibx_menu_item_click", this._onMenuEditCommentBlock.bind(this));
		//this._contextMenu.find(".menu-edit-run").on("ibx_menu_item_click", this._onMenuEditRun.bind(this));
		this._contextMenu.find(".menu-edit-copy").ibxWidget("option", "disabled", true);
		this._contextMenu.find(".menu-edit-cut").ibxWidget("option", "disabled", true);
		this._contextMenu.find(".menu-edit-paste").ibxWidget("option", "disabled", true);

		this.element.on("SET_EDITOR_CLIPBOARD_METADATA", this._onSetEditorClipdoardMetadata.bind(this));     
		this.element.on("SET_STATUS_BAR_CURSOR_METADATA", this._onSetStatusBarCursorMetadata.bind(this));

	},
	
	_init:function()
	{
		this._super();
	},

	_destroy:function()
	{
		this._super();
	},
	
	_refresh:function()
	{
		this._super();
	},
	
	initEditor:function(rootPath, folderPath, itemName, fileExtension, mode)
	{
		this.rootPath = rootPath;
		
		if(folderPath && folderPath.length > 0)
			this.folderPath = folderPath;
		else
			this.folderPath = rootPath;
		
		this._currentFolderPath(this.folderPath);
		
		if(fileExtension)
			this.extension = fileExtension;
			
		if(!fileExtension)
		{
	    	if(itemName && itemName.length > 0)
	    	{
	    		 var extSeparatorIdx = itemName.lastIndexOf(".");
	    		 fileExtension = itemName.substring(extSeparatorIdx + 1);   // do not include '.'
	    	}
	    }		

		this.element.ibxWidget("option", {"tabOptions": {'glyphClasses':this._supportedFormatIcons[fileExtension]}});
				
		if(mode)
		{  
		    this.edWid.option("mode", mode);
		}
		
	    if(folderPath)
	    {
	    	this._getEditorContent (folderPath, itemName);	    	
	    }
	    else
	    {
	    	this.newDoc = true;
	    }
	    
	    this._searchPanel.hide();
		this.edWid.refreshEditor();

		this._cbMatchCase.on("ibx_change", this._onMatchCaseChange.bind(this));
		this._cbMatchWholeWord.on("ibx_change", this._onMatchWholeWordChange.bind(this));
		this._cbWrapAround.on("ibx_change", this._onWrapAroundChange.bind(this));
		
		this._findText.on("ibx_textchanged", this._onFindTextChange.bind(this));

		this._btnFindNext.on("click", this._onFindNext.bind(this));
		this._btnReplaceNext.on("click", this._onReplaceNext.bind(this));	
		this._btnReplaceAll.on("click", this._onReplaceAll.bind(this));	    
		this._btnSearchClose.on("click", this._onSearchCloseButton.bind(this));
		
		this.edWid.getEditor().commands.removeCommand('find'); // remove default ACE Editor's "Ctrl-F" "find" dialog
		this.edWid.getEditor().commands.removeCommand('replace'); // remove default ACE Editor's "Ctrl-H" "find" dialog	
		this.edWid.getEditor().commands.removeCommand('gotoline'); // remove default ACE Editor's "Ctrl-L" "gotoline" dialog		
		
		this.edWid.getEditor().commands.addCommand({
		    name: "find",
		    bindKey: {
		        win: "Ctrl-F",
		        mac: "Command-F"
		    },
		    exec: function(editor, line) {
		        this.toggleSearchPanel();
		    }.bind(this),
		    readOnly: true
		});
		
		this.edWid.getEditor().commands.addCommand({
		    name: "find",
		    bindKey: {
		        win: "Ctrl-H",
		        mac: "Command-H"
		    },
		    exec: function(editor, line) {
		        this.toggleSearchPanel();
		    }.bind(this),
		    readOnly: true
		});

	    this.getStatusBarInfo();
	    
		this.edWid.focus(); 
		
		return this._editorWidget;
	},	

	setEditorFocus:function()
	{
		this.edWid.getEditor().focus();
	},
	
	getFullItemPath:function()
	{
		return this.fullItemPath;
	},
	
	setDirtyLabelValue:function(s)
	{
		this._myDirtyLabel.ibxWidget("option", "text", s);
	},
	
	setTabTitle:function(s)
	{
		this._tabButton.attr('title', s);
	},
	
	setUndoRedoCotextMenu:function(bUndo, bRedo)
	{		
		this._contextMenu.find(".menu-edit-undo").ibxWidget("option", "disabled", !bUndo);
		this._contextMenu.find(".menu-edit-redo").ibxWidget("option", "disabled", !bRedo);
	},
	
	_onSetStatusBarCursorMetadata:function (e, data)
	{  			
		if(data.rangeSelected)
		{
			this._contextMenu.find(".menu-edit-copy").ibxWidget("option", "disabled", false);
			this._contextMenu.find(".menu-edit-cut").ibxWidget("option", "disabled", false);
		}
		else
		{
			this._contextMenu.find(".menu-edit-copy").ibxWidget("option", "disabled", true);
			this._contextMenu.find(".menu-edit-cut").ibxWidget("option", "disabled", true);
		}
	},
	
	_onSetEditorClipdoardMetadata:function(bUndo, bRedo)
	{		
		this._contextMenu.find(".menu-edit-paste").ibxWidget("option", "disabled", false);
	},
	
	_getEditorFormatName:function(name)
	{
		var data = {"_format":name};
		this.element.trigger("GET_EDITOR_FORMAT_BY_EXTENSION_EVENT", data);		
		return data._format;
	},
	
	_getEditorSaveTypes:function()
	{
		var data = {"_folderPath":this.folderPath, "_fileExtension":this.extension};
		this.element.trigger("GET_EDITOR_SAVE_TYPES_EVENT", data);		
		return data._saveTypes;
	},
	
	_getEditorOpenTypes:function()
	{
		var data = {"_folderPath":this.folderPath, "_fileExtension":this.extension};
		this.element.trigger("GET_EDITOR_OPEN_TYPES_EVENT", data);		
		return data._openTypes;
	},
	
	_onTabCloseButton:function(e)
	{
		this.selected(true);
		this.closeFile(e);
	},	
	
	_onMenuEditCopy:function(e)
	{
		document.execCommand("copy");
		this.edWid.editorCopy();
	},
	
	_onMenuEditCut:function(e)
	{
		this.edWid.editorCut();
		document.execCommand("cut");
	},
	
	_onMenuEditPaste:function(e)
	{
		this.element.trigger("PASTE_EDITOR_CLIPBOARD_METADATA");
	},
	
	_onMenuEditClear:function(e)
	{
		this.edWid.deleteSelection();
	},
	
	_onMenuEditSelectAll:function(e)
	{
		this.edWid.selectAll();
	},
	
	_onMenuEditUpperCase:function(e)
	{
		this.edWid.selectionToUpperCase();
	},

	_onMenuEditLowerCase:function(e)
	{
		this.edWid.selectionToLowerCase();
	},
	
	_onMenuEditUndo:function(e)
	{
		this.edWid.editorUndo();
	},
	_onMenuEditRedo:function(e)
	{
		this.edWid.editorRedo();
	},
	
	_onMenuEditComment:function(e)
	{
		this.edWid.editorComment();
	},

	_onMenuEditCommentBlock:function(e)
	{
		this.edWid.editorCommentBlock();
	},
	
	_onMenuEditRun:function(e)
	{
		this.runFile();
	},
	
	_onFindNext:function(e)
	{
		this._findNext(e);
	},
	_onReplaceNext:function(e)
	{
		this._replaceNext(e);
	},
	_onReplaceAll:function(e)
	{
		this._replaceAll(e);
	},	
	_onFindTextChange:function(e)
	{
		this._findTextChange(e);
	},
	_onMatchCaseChange:function(e)
	{
		this._setMatchCase(e);
	},
	_onMatchWholeWordChange:function(e)
	{
		this._setMatchWholeWord(e);
	},
	_onWrapAroundChange:function(e)
	{
		this._setWrapAround(e);
	},
	
	_onSearchCloseButton:function(e)
	{
		this.toggleSearchPanel(e);
	},
	
	_getEditorContent:function(folderPath, fileName)
	{		
		this.newDoc = !fileName || fileName.length == 0;

		if(folderPath && folderPath.length > 0)
		{
			this._currentFolderPath(folderPath);
			this.folderPath = folderPath;
		}
		
		if(fileName && fileName.length > 0)
		{
	        var extSeparatorIdx = fileName.lastIndexOf(".");
	        
	        this.itemName = fileName.substring(0, extSeparatorIdx);
	        this.extension = fileName.substring(extSeparatorIdx + 1);   // do not include '.'
		}
		
		if(this.folderPath.length > 0 && this.itemName.length > 0)
		{
			this.fullItemPath = folderPath + fileName;
			
			this._getItemSummary(this.fullItemPath);
		}
		
		if (!this.folderPath.indexOf("IBFS:/EDA") == 0 && !this.folderPath.indexOf("IBFS:/WEB") == 0 && !this.folderPath.indexOf("IBFS:/FILE") == 0)	// not EDA or WEB or FILE
		{	
			if(this.fullItemPath)
				this._getEditorServerEnv(this.fullItemPath);
			else
				this._getEditorServerEnv(this.folderPath);
		}
	},
	
	_getItemSummary:function(ibfsPath)
	{
		var uriExec = sformat("{1}"+editorActionHandler, applicationContext);
		var randomnum = Math.floor(Math.random() * 100000);	
		var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_GET_ITEM_SUMMARY",		
	 		path: encodeURIComponent(ibfsPath),
	 		IBI_random: randomnum				 		
	 	};
 	
		$.get({	"url": uriExec,	"context": this,"data": argument})
			.done(function( data ) 
			{				
				var item_summary = $("item_summary", data);

				el = $(item_summary);
				
				var rFullPath = el.attr("fullpath");
				var rPath = el.attr("path");
				var rName = el.attr("name");
				var rExtension = el.attr("extension");
				var rDescription = el.attr("description");
				var rTool = el.attr("tool");
				var rType = el.attr("type");
				var rCanChangeServerProps = el.attr("canchangeserverprops");
				
				var pathData = {"_path":rPath};
				this.element.trigger("CHECK_PATH_EVENT", pathData);
				
				this.folderPath = pathData._path;
				this.fullName = rName + "." + rExtension;
				this.itemName = rName;
				this.extension = rExtension;
				this.itemDescription = rDescription;	
				this.tool = rTool;
				this.type = rType;				
				this.canchangeserverprops = rCanChangeServerProps == "true";
/*
				if(this.canchangeserverprops)
					this._editorEnvironment.element.ibxWidget("member", "_menuOptions").show();
				else
					this._editorEnvironment.element.ibxWidget("member", "_menuOptions").hide();
*/				
				var item_content = $("item_content", data);
				el = $(item_content);				
				var fText = el.text();
				fText = this._decodeCDATAEncoding(fText);
				
				this.edWid.content(fText); 
				
				this.edWid.resetUndoManager(); // to prevent UNDO of file content placed in editor on open
				this.edWid.setClean(); // to prevent editor "dirty" state on file content placed in editor on open
				
				this.element.ibxWidget("option", {"tabOptions": {"text": decodeHtmlEncoding(this.itemDescription), 'glyphClasses':this._supportedFormatIcons[this.extension]}});
				this.edWid.setCursorPositionInfo();
				this.setEditorFocus();
				this._refresh();
			});
	},
	
	_getEditorServerEnv:function(ibfsPath)
	{			
		var uriExec = sformat("{1}"+editorActionHandler, applicationContext);
		var randomnum = Math.floor(Math.random() * 100000);	
		var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_EDITOR_ENV",		
	 		path: encodeURIComponent(ibfsPath),
	 		IBI_random: randomnum				 		
	 	};
 	
		$.get(uriExec, argument)
			.done(function( data ) 
			{								
				var status =  $("status", data);
				el = $(status);
				var result =  el.attr("result");

				if(result != "success")
				{
					if (result != "n/a")
					{
						var message = el.attr("message");
						
						var options = 
						{
							type:"std error",
							caption:ibx.resourceMgr.getString("BT_ERROR"),
							buttons:"ok",
							messageOptions:
							{
								text:sformat(ibx.resourceMgr.getString("BT_EDA_ERROR2"), message)
							}
						};
						var dlg = $.ibi.ibxDialog.createMessageDialog(options);
						dlg.ibxDialog("open");	
					}
					return;
				}
				else
				{
					var servers = $("server", data);
					
					servers.each(function(idx, el)
					{
						el = $(el);
						
						var srv = el.attr("name");					
						this.editor_options.servers.push(srv);
						
					}.bind(this));
					
					var defServerElement = $("defServer", data);
					el = $(defServerElement);
					
					var defServer = el.attr("name");
					var isChecked = el.attr("assigned") == "true";
					
					this.editor_options.server = defServer;
					this.editor_options.srvChk = isChecked;

					
					var defAppElement = $("defApp", data);
					el = $(defAppElement);
					
					var defApp = el.attr("name");
					var isAppChecked = el.attr("assigned") == "true";
					
					this.editor_options.appPath = defApp;
					this.editor_options.appChk = isAppChecked;					
					
					var paramPromptElement = $("paramPrompt", data);
					el = $(paramPromptElement);
					var paramPrompt = el.attr("value") == "true";					
					this.editor_options.paramPrompt = paramPrompt;
					
					var casterStdAloneElement = $("casterStdAlone", data);
					el = $(casterStdAloneElement);
					var casterStdAlone = el.attr("value") == "true";	
					this.editor_options.casterStdAlone = casterStdAlone;
					
					if(this.editor_options.casterStdAlone)
						this.extension = "htm";					
					
					var autoLinkTargetElement = $("autoLinkTarget", data);
					el = $(autoLinkTargetElement);
					var autoLinkTarget = el.attr("value") == "true";	
					this.editor_options.autoLinkTarget = autoLinkTarget;
				}           		
				
			}.bind(this));
	},
	
	_currentFolderPath:function(path)
	{
		var data = {"_currentFolderPath":null};
		if(path)
			data = {"_currentFolderPath":path};
		this.element.trigger("CURRENT_FOLDER_PATH_EVENT", data);		
		
		return data._currentFolderPath;
	},
	
	saveFileAs:function(e)
	{		
		var saveFileTypes = this._getEditorSaveTypes();
		var currentFolderPath = this._currentFolderPath();
		var appPath = this.editor_options.appPath;
		
		// TODO - get this locally hardcoded from event
		var defaultServerPath = "IBFS:/EDA/";
		var defaultClientPath = "IBFS:/WFC/Repository/";
		
		var serverContextPath = defaultServerPath + this.editor_options.server;
		var clientContextPath = defaultClientPath;
		
		var ctxPath = [serverContextPath, clientContextPath];
		var tabTitles = [ibx.resourceMgr.getString("home_server"), ibx.resourceMgr.getString("str_distMR")];
		
		if(currentFolderPath.indexOf(defaultServerPath) > -1)
		{
			serverContextPath = currentFolderPath;
		}
		else
		{
			clientContextPath = currentFolderPath;
			ctxPath = [clientContextPath, serverContextPath];
			tabTitles = [ibx.resourceMgr.getString("str_distMR"), ibx.resourceMgr.getString("home_server")];			
		}
		
		var saveDlg = ibx.resourceMgr.getResource('.open-dialog-resources', true);
		saveDlg.ibxWidget({
			okbuttonText: ibx.resourceMgr.getString("bid_save"),
			fileTypes:saveFileTypes, 
			alwaysShowFiletypes:true,
			dlgType:"save", 
			title: ibx.resourceMgr.getString("bid_save_as"), 
			ctxPath:ctxPath,
			appPath: appPath,
			tabTitles:tabTitles
			});
		
		saveDlg.ibxWidget('open');
		
		saveDlg.ibxWidget('fileName', decodeHtmlEncoding(this.itemName));
        saveDlg.ibxWidget('fileTitle', decodeHtmlEncoding(this.itemDescription));
		
		saveDlg.data("mode", "saveas");
		
		saveDlg.on("ibx_close", function (e, closeData)
		{
			if(closeData == "ok") 
			{
				this._saveResource(e, saveDlg);
			}
			
		}.bind(this));
		
	},
	
	saveFile:function()
	{
		if (this.edWid.isClean() && !this.newDoc) // nothing changed so no save action, unless it is a new doc. allow to save empty file
			return;
		
		if (this.newDoc)
		{		
			this.saveFileAs();			
		}
		else
		{
			this._saveResource(null);
		} 	
	},

	content: function (content)
	{
		if (typeof content === 'undefined')
			return this.edWid.content();
		else
			this.edWid.content(content);
	},
	
	resetUndoStack: function ()
	{
      this.edWid.resetUndoManager();
	},
	
	_doSave:function(mode)
	{
		if (this.edWid.isClean() && !this.newDoc) // nothing changed so no save action, unless it is a new doc. allow to save empty file
			return;
		
		var fexText = this.edWid.content();
	 	var uriExec = sformat("{1}"+editorActionHandler, applicationContext);
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument = {};
	 	
	 	argument["BIP_REQUEST_TYPE"] = "BIP_EDITOR_SAVE";		

	 	argument["folder"] = decodeHtmlEncoding(this.folderPath);
	 	argument["itemName"] = decodeHtmlEncoding(this.itemName);	 	
	 	argument["itemDesc"] = decodeHtmlEncoding(this.itemDescription);
	 	argument["newItem"] = this.overWrite ? false : this.newDoc;
	 	argument["iaSave"] = this.iaSave;
		if (mode == "saveas" && this.iaSave)
		{
			argument["mode"] = mode;
			argument["oldname"] = decodeHtmlEncoding(this.orgName);
		}
	 	argument["extension"] = this.extension;
	 	argument["paramPrompt"] = this.editor_options.paramPrompt;
	 	argument["fexData"] = encodeURIComponent(fexText); 	
		if (this.editor_options.srvChk)
			argument["server"] = this.editor_options.server;
		if (this.editor_options.appChk)
			argument["appPath"] = decodeHtmlEncoding(this.editor_options.appPath);
	 	argument["myReport"] = false;
	 	argument["IBI_random"] = randomnum;
	 	argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();		

	 	$.post(uriExec, argument)  
	 		.done(function( data ) 
	 		{
	 			this._gotSaveResponse(data);	 			
	 		}.bind(this));
	},

	_saveSetup:function(mode)
	{
		var summary = null;
		this.iaSave = false;
		this.toolLost = false;

		if ((!this.newDoc || mode=="saveas") && this.tool &&  (this.tool != "editor" && this.tool != "htmlcanvas"))		
		{

			var uriExec = sformat("{1}"+editorActionHandler, applicationContext);
			var randomnum = Math.floor(Math.random() * 100000);	
			var argument=
		 	{
		 		BIP_REQUEST_TYPE: "BIP_FOCEXEC_IA_PARSE",		
		 		ibfsPath: decodeHtmlEncoding(this.folderPath) + decodeHtmlEncoding(this.fullName),
		 		fexText:this._editorWidget.ibxWidget("content"),
		 		repType:this.type,		 		
		 		IBI_random: randomnum				 		
		 	};
			
			argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();
	 	
			$.post({	"url": uriExec,	"context": this,"data": argument})
				.done(function( data ) 
				{				
					var status =  $("status", data);
					el = $(status);
					var result =  el.attr("result");

					if(result != "success")
					{	
						this._onIaParseError(data);
					}
					else
					{
						this.iaSave = true;
						this._doSave(mode);
					}

				}.bind(this));
		}
		else
		{
			this._doSave(mode);
		}
	},
	
	_onIaParseError:function(data)
	{	

		var status =  $("status", data);
		el = $(status);
		var msg =  el.attr("message");
		msg = decodeHtmlEncoding(msg);			
			
		var options = 
		{		
			type:"std error",
			caption:ibx.resourceMgr.getString("BT_ERROR"),
			buttons:"okcancel",
			moveable:false,
			closeButton:false,
			messageOptions:{text:msg}
		};
		
		var dlg = $.ibi.ibxDialog.createMessageDialog(options);		
		dlg.ibxDialog("open");
		
		dlg.on("ibx_close", function (e, closeData)
			{						
				if (closeData == "ok") 
				{
					var options = 
					{		
						type:"std warning",
						caption:ibx.resourceMgr.getString("BT_WARNING"),
						buttons:"okcancel",
						moveable:false,
						closeButton:false,
						messageOptions:{text:ibx.resourceMgr.getString("BT_LOSE_TOOL")}
					};
					
					var dlg = $.ibi.ibxDialog.createMessageDialog(options);		
					dlg.ibxDialog("open");
					
					dlg.on("ibx_close", function (e, closeData)
					{						
						if (closeData == "ok") 
						{
							this.iaSave = false;
							this.toolLost = true;
							this._doSave();
			            }
					}.bind(this));
	            }
			}.bind(this));
	},

	_saveResource:function(e, saveDlg)
	{	
		var mode = null;

		if (saveDlg != null)  // this routine can be called via a dialog or straight (with a null event)
		{			
			mode = saveDlg.data("mode");
			
			var fileName = saveDlg.ibxWidget('fileName');	
			var fileTitle = saveDlg.ibxWidget('fileTitle');				
			var fileExists = saveDlg.ibxWidget('fileExists');
			//var path = saveDlg.ibxWidget('path');
	        var pathSeparatorIdx = fileName.lastIndexOf("/");
			var path = fileName.substring(0, pathSeparatorIdx + 1);
			
			var data = {"_path":path};
			this.element.trigger("CHECK_PATH_EVENT", data);
			
			path = data._path;

			if (mode == "saveas")
			{	   
				this.newDoc = true;
				this.orgName = this.itemName;
			}
			
	        if (!fileName)
	        {
	        	this.currentAction = 0;
	        	if (this.newWindow && this.fromClose)
	        	{
	        		window.close();
	        	}
	        	return;
	        }
	        
	        if (path.split("/").length <= 3)
	        {
	        	// navigated to WFC root, to which items are forbidden
				var options = 
				{
					type:"std error",
					caption:ibx.resourceMgr.getString("BT_ERROR"),
					buttons:"ok",
					messageOptions:
					{
						text:ibx.resourceMgr.getString("BT_NO_ROOT_SAVE")
					}
				};
				var dlg = $.ibi.ibxDialog.createMessageDialog(options);
				dlg.ibxDialog("open");
	        	return;
	        }
	        
	        if (fileTitle.charAt(0) == '~') // SEC-56 - ibfs uses '~' as prefix for mycontent folders
	        {
				var options = 
				{
					type:"std error",
					caption:ibx.resourceMgr.getString("BT_ERROR"),
					buttons:"ok",
					messageOptions:
					{
						text:ibx.resourceMgr.getString("BT_INVALID_STR_CHAR")
					}
				};
				var dlg = $.ibi.ibxDialog.createMessageDialog(options);
				dlg.ibxDialog("open");
	        	e.preventDefault();
	        	return;
	        }
           
	        if (fileExists)
        	   this.overWrite = true;
	           	
	        this.itemDescription = fileTitle;
    
	        var extSeparatorIdx = fileName.lastIndexOf(".");
    
	        this.itemName = fileName.substring(pathSeparatorIdx + 1, extSeparatorIdx);
	        this.extension = fileName.substring(extSeparatorIdx + 1);   // do not include '.'
	        this.folderPath = path;
   
	        if (!e || !this.closing)	// cannot access caption during closing
				this.element.ibxWidget("option", {"tabOptions": {"text": decodeHtmlEncoding(this.itemDescription), 'glyphClasses':this._supportedFormatIcons[this.extension]}});
		}

		this._saveSetup(mode);     
		
		this.overWrite = false;
	},
	
	_gotSaveResponse:function(data)
	{
		if (this.newDoc)
		{			
			if ($(data).find('status').attr('result') != 'success')
			{
				var options = 
				{		
					type:"medium warning",
					caption:ibx.resourceMgr.getString("BT_WARNING"),
					buttons:"ok",
					moveable:false,
					closeButton:false,
					messageOptions:{text: ibx.resourceMgr.getString("ted_save_failed")}
				};
				
				var dlg = $.ibi.ibxDialog.createMessageDialog(options);						
				dlg.ibxDialog("open");
				dlg.on('ibx_close', function(e)
				{
					this.element.ibxWidget('option', 'tabOptions', {'text': ibx.resourceMgr.getString(this.options.orgTitle)});
				}.bind(this));
				return;
			}
			
			if(this._callbackFunc)
			{
				this._callbackFunc.call();
			}
			
			var data = {"_extension":this.extension, "_mode":""};
			this.element.trigger("GET_EDITOR_MODE_BY_EXTENSION_EVENT", data);			
			
			if(data._mode)
		        this.edWid.option("mode", data._mode);

            // Get options of current editor tab, for options menu
			this.getEditorOptions();

			if(window.opener) // [WEBDEV-86]
			{
				$(window.opener.document).dispatchEvent( 'FORCE_ACTION_ON_CURRENT_FOLDER', {"detail":this.folderPath}, true, false, null, window.opener.document);
			}
		}
		
		if(this.toolLost)// refresh folder to update item menu
		{
			$(window.opener.document).dispatchEvent( 'FORCE_ACTION_ON_CURRENT_FOLDER', {"detail":this.folderPath}, true, false, null, window.opener.document);
		}
		
		this._currentFolderPath(this.folderPath);		
		this.fullItemPath = this.folderPath + this.itemName + "." + this.extension;
		
		if (!this.closing)
		{
			this.setEditorFocus();
			this.element.ibxWidget("option", {"tabOptions": {"text": decodeHtmlEncoding(this.itemDescription), 'glyphClasses':this._supportedFormatIcons[this.extension]}});
			this.element.ibxWidget("setTabTitle", this.fullItemPath);
		}
		
		this.newDoc = false;
		this._editorWidget.ibxWidget("setClean"); // remove editor "dirty" state but preserving UndoManager history
		
		if(this.currentAction == 1)
		{
			this.currentAction = 0;		
			this.newDoc = true;
			this.setEditorFocus();
			this._editorWidget.ibxWidget("setCursorPositionInfo");
		}
		else if(this.currentAction == 2)
		{
			this.currentAction = 0;
			this._onOpenDialog();
		}
		else if(this.currentAction == 3) // from Close
		{
			this.element.trigger('REMOVE_TAB_PAGE_EVENT');
		}
		else if(this.currentAction == 4)
		{
			this.currentAction = -1;
			this.close();      
		}
	},
	
	onFileOpen:function(e)
	{		
		var openFileTypes = this._getEditorOpenTypes();
		var currentFolderPath = this._currentFolderPath();
	
		// TODO - get this locally hardcoded from event
		var defaultServerPath = "IBFS:/EDA/";
		var defaultClientPath = "IBFS:/WFC/Repository/";
		
		var serverContextPath = defaultServerPath + this.editor_options.server;
		var clientContextPath = defaultClientPath;

		var ctxPath = [serverContextPath, clientContextPath];
		var tabTitles = [ibx.resourceMgr.getString("home_server"), ibx.resourceMgr.getString("str_distMR")];
		
		if(currentFolderPath.indexOf(defaultServerPath) > -1)
		{
			serverContextPath = currentFolderPath;
		}
		else
		{
			clientContextPath = currentFolderPath;
			ctxPath = [clientContextPath, serverContextPath];
			tabTitles = [ibx.resourceMgr.getString("str_distMR"), ibx.resourceMgr.getString("home_server")];			
		}
		
		var openDlg = ibx.resourceMgr.getResource('.open-dialog-resources', true);
		openDlg.ibxWidget({
			fileTypes:openFileTypes, 
			dlgType:"open", 
			alwaysShowFiletypes:true,
			title: ibx.resourceMgr.getString("bid_open"), 
			ctxPath:ctxPath,
			tabTitles:tabTitles
			});
		
		openDlg.ibxWidget('open');
		
		openDlg.on("ibx_close", function (e, closeData)
		{			
			this._onFileOpenDialogResult(openDlg, closeData);
		}.bind(this));
	},
	
	_onFileOpenDialogResult:function(openDlg, closeData)
	{
		if(closeData == "ok")
		{
			var ibfsItems = openDlg.ibxWidget('ibfsItems');	
			//var folderPath = this._checkFolderPath( (ibfsItems.length > 0 )? ibfsItems[0].parentPath : "");
			var folderPath = (ibfsItems.length > 0 )? ibfsItems[0].parentPath : "";
			
			var pathData = {"_path":folderPath};
			this.element.trigger("CHECK_PATH_EVENT", pathData);
			folderPath = pathData._path;
			
			var fileName = (ibfsItems.length > 0 )? ibfsItems[0].name : "";	
			var itemExtension = (ibfsItems.length > 0 )? ibfsItems[0].extension : "";	

			var data = {"rootPath":this.rootPath, 'folderPath':folderPath, 'fileName':fileName};		
			this.element.trigger("EDITOR_OPEN_NEW_TAB_EVENT", data);
		}
	},
	
	fileReset:function(e)
	{
		//this._editorWidget.ibxWidget("deleteSelectedText");
		
		if( !this.edWid.isClean())
		{
			var options = 
			{		
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"okcancel",
				moveable:false,
				closeButton:false,
				messageOptions:{text:ibx.resourceMgr.getString("BT_RESET")}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);						
			dlg.ibxDialog("open");
			
			dlg.on("ibx_close", function (e, closeData)
			{						

				if (closeData == "ok") 
				{
					this._getItemSummary(this.fullItemPath);			
	            }
			}.bind(this));
		}
	},
	
	closeFile:function(e)
	{
		if( !this.edWid.isClean())
		{
			var options = 
			{		
				type:"std warning",
				caption:ibx.resourceMgr.getString("BT_WARNING"),
				buttons:"okcancelapply",
				moveable:false,
				closeButton:false,
				messageOptions:{text:ibx.resourceMgr.getString("BT_CONFIRM_CANCEL")}
			};
			
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			
			dlg.ibxWidget("member", "btnOK").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_yes"));
			dlg.ibxWidget("member", "btnApply").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_no"));
			dlg.ibxWidget("member", "btnCancel").ibxWidget("option", "text", ibx.resourceMgr.getString("bid_cancel"));
			
			dlg.ibxDialog("open");
			
			dlg.on("ibx_apply", function(e, closeData)
			{
				// NO
				dlg.ibxWidget("close");
				
				this.element.trigger("REMOVE_TAB_PAGE_EVENT");
				
			}.bind(this)).on("ibx_close", function (e, closeData)
			{
				if (closeData == "ok") // YES
				{
					if (!this.iaMode )
					{
	                    this.fromClose = true;
					}
	                this.closing = true;							
					this.currentAction = 3;
					this.saveFile(e);				
	            }				
				else if (closeData == "cancel") // CANCEL
				{	
					this.currentAction = 0;
		 			this.setEditorFocus();
				}
			}.bind(this));
		}
		else
		{
			this.element.trigger("REMOVE_TAB_PAGE_EVENT");
		}
		if (e)
		  e.stopPropagation();
	},
	
	getIsFileNew:function(e)
	{
		return this.newDoc;
	},
	
	editorRedo:function(e)
	{
		this._editorWidget.ibxWidget("editorRedo");
	},
	
	editorUndo:function(e)
	{
		this._editorWidget.ibxWidget("editorUndo");
	},
	
	editorCut:function(e)
	{
		this._editorWidget.ibxWidget("editorCut");
	},
	
	editorCopy:function(e)
	{
		this._editorWidget.ibxWidget("editorCopy");
	},
	
	editorPaste:function(editorClipboardData)
	{
		this._editorWidget.ibxWidget("editorPaste", editorClipboardData);
	},
	
	runFile:function()
	{
		var randomnum = Math.floor(Math.random() * 100000);	
		var fexText = this._editorWidget.ibxWidget("content");
		var width = 800;
		var height = 600;
		var top = (screen.height-height)/2;
		var left = (screen.width-width)/2; 	 		
		
		var action = location.protocol + applicationContext + editorActionHandler;

		var win = window.open("", "_blank", "status=yes," + "width=" + width + ", height=" + height + ", top=" + top + ", left=" + left + ", resizable=yes, scrollbars=yes");
		var doc = win.document;
		
		if (this.newDoc) // [WEBDEV-111]
		{
			if (this.extension == "html" || this.extension == "htm")
				fexText = "-HTMLFORM BEGIN\n" + fexText + "\n-HTMLFORM END";
		}
		
		var options =
		{
	        "action":action,
	        "fields":
	        {
	        	"BIP_REQUEST_TYPE": "BIP_RUN_ADHOC",
	        	"BIP_folder":encodeURIComponent(decodeHtmlEncoding(this.folderPath)),
				"BIP_fexText":encodeURIComponent(fexText),
				"BIP_paramPrompt":this.editor_options.paramPrompt,
				"BIP_server":encodeURIComponent(this.editor_options.server),
				"BIP_appPath":encodeURIComponent(decodeHtmlEncoding(this.editor_options.appPath)),
	        }
		};
		
		options.fields[WFGlobals.getSesAuthParm()]=WFGlobals.getSesAuthVal();
		options.fields[IBI_random]=randomnum;
		
		if (!this.newDoc)
	    {
			options.fields["IBFS_edItem_path"] = encodeURIComponent(decodeHtmlEncoding(this.folderPath) + decodeHtmlEncoding(this.itemName) + "." + this.extension);
	    }
		
		var form = $("<form>").ibxForm(options).ibxForm("submit", doc);
	},
	
	toggleSearchPanel:function(e)
	{
		var isVisible = this._searchPanel.is(":visible");
		
		if (isVisible)
		{
			this._searchPanel.hide();
			this._editorWidget.ibxWidget("refreshEditor");
			this.setEditorFocus();
			return;
		}

		var selection = this.edWid.getEditor().session.getTextRange(this.edWid.getEditor().getSelectionRange());
		
		this._cbMatchCase.ibxWidget("checked", this._defaultSearchOptions.caseSensitive);
		this._cbMatchWholeWord.ibxWidget("checked", this._defaultSearchOptions.wholeWord);
		this._cbWrapAround.ibxWidget("checked", this._defaultSearchOptions.wrap);
		
		if(selection.length > 0)
		{
			this._findText.ibxWidget("option", "text", selection);
			
			this._btnFindNext.ibxWidget("option", "disabled", false);
			this._btnReplaceNext.ibxWidget("option", "disabled", false);	
			this._btnReplaceAll.ibxWidget("option", "disabled", false);	
		}
						
		this._searchPanel.show();		
		this.edWid.refreshEditor();
		this._findText.focus();		
	},
	
	_findNext:function()
	{
		var findText = this._findText.ibxWidget("option", "text");
		
		if(findText && findText.length > 0)
		{
			var range = this.edWid.getEditor().find(findText, this._defaultSearchOptions);
			
			if(!range)
			{
				var options = 
				{		
					type:"std information",
					caption:ibx.resourceMgr.getString("BT_MESSAGE"),
					buttons:"ok",
					moveable:false,
					closeButton:false,
					messageOptions:{text:sformat(ibx.resourceMgr.getString("BT_SEARCH_TEXT_NOT_FOUND"), findText)}
				};
				
				var dlg = $.ibi.ibxDialog.createMessageDialog(options);						
				dlg.ibxDialog("open");
			}
		}
	},
	
	_replaceNext:function()
	{	 
		var selectedRange = this.edWid.getEditor().selection.getRange();	
		
		if(selectedRange.start.row != selectedRange.end.row || selectedRange.start.column != selectedRange.end.column) //check if range is not empty to avoid just inserting replacement value at the cursor
		{
			var findText = this._findText.ibxWidget("option", "text");

			if(findText && findText.length > 0)
			{
				var selection = this.edWid.getEditor().session.getTextRange(this.edWid.getEditor().getSelectionRange());
				var caseSensitive = this._defaultSearchOptions.caseSensitive;
				
				if(!caseSensitive)
				{
					findText = findText.toLowerCase();
					selection = selection.toLowerCase();
				}
				
				if(selection && selection.length > 0 && findText == selection)
				{
					var replaceWith = this._replaceText.ibxWidget("option", "text");
					this.edWid.getEditor().getSession().getDocument().remove(selectedRange);	
					this.edWid.getEditor().insert(replaceWith);
				}
			}
		}
		
		this._findNext();
	},	
	
	_replaceAll:function()
	{
		var findText = this._findText.ibxWidget("option", "text");
		
		if(findText && findText.length > 0)
		{
			var replaceWith = this._replaceText.ibxWidget("option", "text");
			
			this.edWid.getEditor().find(findText, this._defaultSearchOptions);
			this.edWid.getEditor().replaceAll(replaceWith);
		}
	},
	
	_findTextChange:function(e)
	{
		
		var findText = this._findText.ibxWidget("option", "text");
		
		if(findText && findText.length > 0)
		{
			this._btnFindNext.ibxWidget("option", "disabled", false);
			this._btnReplaceNext.ibxWidget("option", "disabled", false);
			this._btnReplaceAll.ibxWidget("option", "disabled", false);
		}
		else
		{
			this._btnFindNext.ibxWidget("option", "disabled", true);
			this._btnReplaceNext.ibxWidget("option", "disabled", true);
			this._btnReplaceAll.ibxWidget("option", "disabled", true);
		}
	},
	
	_setMatchCase:function(e)
	{
		this._defaultSearchOptions.caseSensitive = this._cbMatchCase.ibxWidget("checked");
	},
	
	_setMatchWholeWord:function(e)
	{
		this._defaultSearchOptions.wholeWord = this._cbMatchWholeWord.ibxWidget("checked");
	},
	
	_setWrapAround:function()
	{
		this._defaultSearchOptions.wrap = this._cbWrapAround.ibxWidget("checked");
	},
	
	isClean:function()
	{
		return this.edWid.isClean();
	},

	setClean: function ()
	{
		this.edWid.setClean();
	},
	
	toggleDisplayIndentGuides:function()
	{		
		var disp = this.edWid.option("displayIndentGuides");
		this.edWid.option("displayIndentGuides", !disp);
	},
	
	toggleLineNumbering:function()
	{	
		var show = this.edWid.option("showLineNumbers");
        this.edWid.option("showLineNumbers", !show);
	},
	
	toggleCodeFolding:function()
	{	 
		var show = this.edWid.option("showFoldWidgets");
        this.edWid.option("showFoldWidgets", !show);
	},
	
	toggleAutocomplete:function()
	{	
		var ac = this.edWid.option("enableLiveAutocompletion");
        this.edWid.option("enableLiveAutocompletion", !ac);
	    this.edWid.option("enableBasicAutocompletion", !ac);
	    this.edWid.option("enableSnippets", !ac);

	},
	
	getStatusBarInfo:function()
	{		
		this._editorWidget.ibxWidget("setInsertStatusLabel");
		this._editorWidget.ibxWidget("setCursorPositionInfo");
	},
	
	getEditorOptions:function()
	{		
		this._editorWidget.ibxWidget("broadcastEditorOptions");
	},
	
	onUndoManagerChange:function()
	{		
		this._editorWidget.ibxWidget("onUndoManagerChange");
	},
	
	_decodeCDATAEncoding:function (text)
	{
		text = text.replace(/IBI_CDATA_START_PATTERN/g, "<![CDATA");
		text = text.replace(/IBI_CDATA_END_PATTERN/g, "]]>");	
		return text;
	}
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------


$.widget("ibi.textEditor", $.ibi.ibxWidget, 
{
	options:
	{
		config:
		{
	        "enableStatusBar": true			
		},
	},
	
	_widgetClass:"text-editor",

	_create:function()
	{
		this._super();
		
		this._editorMode = "hp";
		
		if(window.location.href.toLowerCase().indexOf("designer") > -1)
			this._editorMode = "pd";
				
		this._supportedFormats = 
		{
				"*":["allType"],
				"txt":["txtType"],
				"fex":["focexecType"],
				"mas":["masterType"],
				"man":["manifestType"],
				"js":["jsType"],
				"htm":["htmlType"],
				"html":["htmlType"],
				"css":["cssType"],
				"sty":["wfStyleType"],
				"r":["rType"],
				"py":["pythonType"],
				"sql":["sqlType"],
				"prop":["propertyType"]
		};	    
		
		this._saveFileTypes = [[ibx.resourceMgr.getString(this._getEditorFormatName("fex")), "fex"],
						      //[ibx.resourceMgr.getString(this._getEditorFormatName("mas")), "mas"],	
				              [ibx.resourceMgr.getString(this._getEditorFormatName("sty")), "sty"],
				              [ibx.resourceMgr.getString(this._getEditorFormatName("css")), "css"],				              
				              [ibx.resourceMgr.getString(this._getEditorFormatName("htm")), "htm"],		
							  [ibx.resourceMgr.getString(this._getEditorFormatName("sql")), "sql"],
							  [ibx.resourceMgr.getString(this._getEditorFormatName("js")), "js"],				              
		                      [ibx.resourceMgr.getString(this._getEditorFormatName("txt")), "txt"],
							  [ibx.resourceMgr.getString(this._getEditorFormatName("r")), "r"],
							  [ibx.resourceMgr.getString(this._getEditorFormatName("py")), "py"]];
	
		this._openFileTypes = this._saveFileTypes.slice();
		this._openFileTypes.unshift([ibx.resourceMgr.getString(this._getEditorFormatName("*")), "*.*"]);
			
		this._runModes = ["focexec", "html"];
		
	    this._supportedThemes = ["light", "dark"];
		//this._supportedThemes = ["textmate","github","chaos","cobalt"];

		this._editorClipboard = "";

		this.rootPath = "";
	    this.currentFolderPath = "";
		this.bipActionHandler = "/views.bip";
		this.checkServerAccessHandler = "/chksrvacc.bip";
		this.resourceContext = applicationContext;
					
		if(this._editorMode == "hp")
		{
			if(window.opener && window.opener.home_globals && !window.opener.home_globals.tedWindowHandle) // in case Editor Window/Tab gets refreshed by F5
			{
				window.opener.home_globals.tedWindowHandle = window;
			}		
		}
	    
		$(window).on('beforeunload', this._onBeforeUnload.bind(this));
		$(window).on('unload', this._onUnload.bind(this));
		$(window).on('keydown', this._onKeyDown.bind(this));
		this.element.on("SET_STATUS_BAR_CURSOR_METADATA", this._onSetStatusBarCursorMetadata.bind(this));
		this.element.on("SET_STATUS_BAR_INSERT_KEY_METADATA", this._onSetStatusBarInsertKeyMetadata.bind(this)); 
		this.element.on("SET_STATUS_BAR_NUM_KEY_METADATA", this._onSetStatusBarNumlockKeyMetadata.bind(this)); 
		this.element.on("SET_STATUS_BAR_CAPS_KEY_METADATA", this._onSetStatusBarCapslockKeyMetadata.bind(this)); 
		this.element.on("EDITOR_OPTIONS_CHANGED_EVENT", this._onEditorOptionsChanged.bind(this));
		this.element.on("SET_EDITOR_CLIPBOARD_METADATA", this._onSetEditorClipdoardMetadata.bind(this));     
		this.element.on("PASTE_EDITOR_CLIPBOARD_METADATA", this._onMenuButtonPaste.bind(this)); 
		this.element.on("REMOVE_TAB_PAGE_EVENT", this._removeTabPage.bind(this));
		this.element.on("GET_EDITOR_FORMAT_BY_EXTENSION_EVENT", this._getEditorFormatByExtensionEventHandler.bind(this));
		this.element.on("GET_EDITOR_MODE_BY_EXTENSION_EVENT", this._getEditorModeByExtensionEventHandler.bind(this));
		this.element.on("GET_EDITOR_SAVE_TYPES_EVENT", this._getEditorSaveTypesEventHandler.bind(this));
		this.element.on("GET_EDITOR_OPEN_TYPES_EVENT", this._getEditorOpenTypesEventHandler.bind(this));
		this.element.on("CHECK_PATH_EVENT", this._checkFolderPathEventHandler.bind(this));
		this.element.on("CURRENT_FOLDER_PATH_EVENT", this._currentFolderPathEventHandler.bind(this));
		this.element.on("EDITOR_UNDO_MANAGER_CHANGE_EVENT", this._onEditorUndoManagerChangeEventHandler.bind(this));
		this.element.on("EDITOR_OPEN_NEW_TAB_EVENT", this._onEditorOpenNewTabEventHandler.bind(this));
		this.element.on("copy", function (e){
			try{
				var text = e.originalEvent.clipboardData.getData("text");
				this._onSetEditorClipdoardMetadata(e, {_editorClipboardData: text});
			}
			catch(e){}
		}.bind(this));
		this.element.on("cut", function (e){
			try{
				var text = e.originalEvent.clipboardData.getData("text");
				this._onSetEditorClipdoardMetadata(e, {_editorClipboardData: text});
			}
			catch(e){}
		}.bind(this));
	
		//this._fileNew.on("ibx_menu_item_click", this._onMenuFileNew.bind(this));
		
		this._fileNewR = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString('bid_editor_new_file_r')}, 'userValue': "r"});
		this._fileNewPY = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString('bid_editor_new_file_py')}, 'userValue': "py"});
		this._fileNewTXT = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString('bid_editor_new_file_txt')}, 'userValue': "txt"});
		this._fileNewMAS = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString('bid_editor_new_file_mas')}, 'userValue': "mas"});
		this._fileNewFEX = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString('bid_editor_new_file_fex')}, 'userValue': "fex"});
		this._fileNewHTM = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString('bid_editor_new_file_htm')}, 'userValue': "htm"});
		this._fileNewSTY = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString('bid_editor_new_file_sty')}, 'userValue': "sty"});
		this._fileNewCSS = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString('bid_editor_new_file_css')}, 'userValue': "css"});
		this._fileNewSQL = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString('bid_editor_new_file_sql')}, 'userValue': "sql"});
		this._fileNewJS = $("<div class='te-menu-item'>").ibxMenuItem({'labelOptions':{'text': ibx.resourceMgr.getString('bid_editor_new_file_js')}, 'userValue': "js"});

		this._fileNewR.on("click", this._onMenuFileNew.bind(this));
		this._fileNewPY.on("click", this._onMenuFileNew.bind(this)); 
		this._fileNewTXT.on("click", this._onMenuFileNew.bind(this)); 
		this._fileNewMAS.on("click", this._onMenuFileNew.bind(this)); 
		this._fileNewFEX.on("click", this._onMenuFileNew.bind(this)); 
		this._fileNewHTM.on("click", this._onMenuFileNew.bind(this)); 
		this._fileNewSTY.on("click", this._onMenuFileNew.bind(this)); 
		this._fileNewCSS.on("click", this._onMenuFileNew.bind(this));
		this._fileNewSQL.on("click", this._onMenuFileNew.bind(this));
		this._fileNewJS.on("click", this._onMenuFileNew.bind(this));

        this._fileNewSubmenu.ibxWidget("add", this._fileNewFEX);
        //this._fileNewSubmenu.ibxWidget("add", this._fileNewMAS);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewHTM);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewJS);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewSTY);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewCSS);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewTXT);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewSQL);        
        this._fileNewSubmenu.ibxWidget("add", this._fileNewR);
        this._fileNewSubmenu.ibxWidget("add", this._fileNewPY);		
		
		this._fileOpen.on("ibx_menu_item_click", this._onMenuFileOpen.bind(this));
		this._fileSave.on("ibx_menu_item_click", this._onMenuFileSave.bind(this));
		this._fileSaveAs.on("ibx_menu_item_click", this._onMenuFileSaveAs.bind(this));
		//this._filePreferences.on("_filePreferences", this._onMenuFilePreferences.bind(this));
		this._fileClose.on("ibx_menu_item_click", this._onMenuFileClose.bind(this));
		this._fileExit.on("ibx_menu_item_click", this._onMenuFileExit.bind(this));
		this._menuSave.on("click", this._onMenuButtonSave.bind(this));
		this._menuReset.on("click", this._onMenuButtonReset.bind(this));
		this._menuUndo.on("click", this._onMenuButtonUndo.bind(this));
		this._menuRedo.on("click", this._onMenuButtonRedo.bind(this));
		this._menuCut.on("click", this._onMenuButtonCut.bind(this));
		this._menuCopy.on("click", this._onMenuButtonCopy.bind(this));
		this._menuPaste.on("click", this._onMenuButtonPaste.bind(this));
		this._menuRun.on("click", this._onMenuButtonRun.bind(this));
		this._menuSearch.on("click", this._onMenuSearch.bind(this));
		this._optionsLineNumbering.on("click", this._onMenuOptionsLineNumbering.bind(this));
		this._optionsDisplayIndentGuides.on("click", this._onMenuOptionsDisplayIndentGuides.bind(this));
		this._optionsCodeFolding.on("click", this._onMenuOptionsCodeFolding.bind(this));
		this._optionsAutocomplete.on("click", this._onMenuOptionsAutocomplete.bind(this));
		this._optionsStatusBar.on("click", this._onMenuOptionsStatusBar.bind(this));
		this._menuHelp.on("click", this._onMenuButtonHelp.bind(this));		
		this._editorTabPane.on("ibx_change", this._editorTabPaneChanged.bind(this));
	},
	
	_init:function()
	{
		this._super();
		this._editorTabPane.ibxWidget("option", "tabBarOptions", {"showPrevButton": true,"showNextButton": true});
		this._menuCopy.ibxWidget("option", "disabled", true);
		this._menuCut.ibxWidget("option", "disabled", true);
		this._menuPaste.ibxWidget("option", "disabled", true);
		
		var temp = this.element.ibxWidget("option", "config");
		var temp2 = temp.enableStatusBar;
		
		this._optionsStatusBar.ibxWidget("option", "checked", temp2);
	},
    _setOption: function (key, value)
    {
        this._super(key, value);
        
        if (key == "preventExit")
        {       
        	if (value)
        		this._fileExit.hide();
        	else
        		this._fileExit.show();
		}
		else if (key == "containerInterface")
		{
			this._fileExit.hide();
			this._fileNew.hide();
		}
    },

	// window event handlers	
	_onBeforeUnload:function(e)
	{
		if(this._editorMode == "hp")
		{

			if(this.isDirty())
			{
		      return "prompt";
			}
			else 
			{
				if(window.opener && window.opener.home_globals && window.opener.home_globals.tedWindowHandle)
				{
					window.opener.home_globals.tedWindowHandle = null;
				}
				
				return undefined;
			}
		}
	},
	
	_onUnload:function(e)
	{		
		if(this._editorMode == "hp")
		{
			if(window.opener && window.opener.home_globals && window.opener.home_globals.tedWindowHandle)
			{
				window.opener.home_globals.tedWindowHandle = null;
			}
		}
	},
	
	// keydown event of the document
	_onKeyDown:function(e)
	{
		var charCode = e.which || e.keyCode;			
		var shifton = e.shiftKey;
		var ctrlKey = e.ctrlKey;
		var altKey = e.altlKey;

		if (ctrlKey && (charCode == 70 || charCode == 72)) 
		{
	        e.preventDefault();

	        this._toggleSearchPanel(e);
		}
	
	},
	// menu items event handlers
	_onMenuFileNew:function(e)
	{
		this.currentAction = 1;
		this._onNewFunction(e);
	},
	
	_onMenuFileOpen:function(e)
	{
		if (this.options.containerInterface)
		{
			this.options.containerInterface.open(e);
			return;
		}
		this.currentAction = 2;
		this._onFileOpen(e);
	},
	
	_onMenuFileSave:function(e)
	{
		if (this.options.containerInterface)
		{
			this.options.containerInterface.save(e);
			return;
		}
		this._onSaveFileFunction(e);
	},
	
	_onMenuFileSaveAs:function(e)
	{
		if (this.options.containerInterface)
		{
			this.options.containerInterface.saveas(e);
			return;
		}
		this._onSaveAsFunction(e);
	},
	
	_onMenuFilePreferences:function(e)
	{
		alert("_onMenuFilePreferences");
	},
	
	_onMenuFileClose:function(e)
	{
		if (this.options.containerInterface)
		{
			this.options.containerInterface.close(e);
			return;
		}
		this.currentAction = 3;
		this._onCloseFile(e);
	},
	
	_onMenuFileExit:function(e)
	{
    	this.currentAction = 4;
    	this._onExitFunction(e);
	},
	
	_onMenuButtonRedo:function(e)
	{
		this._onEditorRedoFunction(e);
	},
	
	_onMenuButtonUndo:function(e)
	{
		this._onEditorUndoFunction(e);
	},

	_onMenuButtonCut:function(e)
	{
		this._onEditorCutFunction(e);		
		document.execCommand("cut");
	},
	_onMenuButtonCopy:function(e)
	{
		document.execCommand("copy");
		this._onEditorCopyFunction(e);		
	},
	_onMenuButtonPaste:function(e)
	{
		this._onEditorPasteFunction(e);		
	},
	
	_onMenuButtonSave:function(e)
	{
		if (this.options.containerInterface)
		{
			this.options.containerInterface.save(e);
			return;
		}
    	this._onSaveFileFunction(e);
	},
	
	_onMenuButtonRun:function(e)
	{
    	this._onRunFunction(e);
	},
	
	_onMenuButtonReset:function(e)
	{
		this._onReset(e);
	},
	
	_onMenuSearch:function(e)
	{
    	this._toggleSearchPanel(e);
	},
	
	_onMenuGoToLine:function(e)
	{
		alert("_onMenuhGoToLine");
    	//this._toggleGoToLine(e);
	},

	_onMenuOptionsDisplayIndentGuides:function(e)
	{		
		this._toggleDisplayIndentGuides(e);
	},
	
	_onMenuOptionsLineNumbering:function(e)
	{		
		this._toggleLineNumbering(e);
	},
	_onMenuOptionsCodeFolding:function(e)
	{		
		this._toggleCodeFolding(e);
	},
	_onMenuOptionsAutocomplete:function(e)
	{		
		this._toggleAutocomplete(e);
	},
	_onMenuOptionsStatusBar:function(e)
	{
		this._toggleStatusBar(e);
	},
	_onMenuButtonHelp:function(e)
	{
		if (this.options.containerInterface)
		{
			this.options.containerInterface.help(e);
			return;
		}
		this._onHelp(e);
	},	

	_editorTabPaneChanged:function(e)
	{
		this._onEditorTabPaneChanged(e);
	},
	//---------------------------------------------------------------------------------------------------------	
	setCallbackFunction:function(f)
	{
		this._callbackFunc = f;
	},
		
	openEditorTab:function(rootPath, folderPath, fileName, fileExtension, options) // Public method to open Editor Tab.
	{
		this.rootPath = this._checkFolderPath(rootPath);
		
		var tabBar = this._editorTabPane.ibxWidget("tabBar");
		var tabBtns = tabBar.ibxWidget("children");
		
		for (var i = 0; i < tabBtns.length; i++)
		{
			var tabBtn = $(tabBtns.get(i));
			var tabPg =  tabBtn.ibxWidget("option", "tabPage"); 
			var oldPath = tabPg.ibxWidget("getFullItemPath");
			var newPath = folderPath+fileName;
			
			if(oldPath == newPath)
			{
				this._editorTabPane.ibxWidget("selected", tabPg);
				return;
			}
		}
			
		var mode = null;// mode is a path to JS module
		var titleKey = "bid_editor_new_fex";
		
		if(fileExtension)
		{
			mode = this._getEditorModeByExtension(fileExtension);
			titleKey = "bid_editor_new_"+fileExtension;
		}
		else
		{
	    	if(fileName && fileName.length > 0)
	    	{
	    		mode = this._getEditorModeByPath(fileName);
	    		var extSeparatorIdx = fileName.lastIndexOf(".");
		        var extension = fileName.substring(extSeparatorIdx + 1);   // do not include '.'
		        titleKey = "bid_editor_new_"+extension;
	    	}
	    }		

		var tabOptions = $.extend({}, options, { tabOptions:  { 'text': ibx.resourceMgr.getString(titleKey), 'glyph': '', 'glyphClasses': '' } });
		var newTab = $("<div class='text-editor-tab-page'>").textEditorTabPage(tabOptions);
		newTab.ibxWidget('option', 'orgTitle', titleKey);
		this._editorTabPane.ibxWidget("add", newTab);// has to be added to DOM before initEditor()
		newTab.ibxWidget("initEditor", this.rootPath, folderPath, fileName, fileExtension, mode);
		newTab.ibxWidget("setTabTitle", folderPath + fileName);
		this._onEditorTabPaneChanged(); // to pickup settings from initEditor()
	},
	
	_onEditorOpenNewTabEventHandler:function(e, data)
	{
		var rootPath = data.rootPath;
		var folderPath = data.folderPath;
		var fileName = data.fileName;
		var fileExtension = data.fileExtension;
		
		this.openEditorTab(rootPath, folderPath, fileName, fileExtension);
	},
	
	_onEditorUndoManagerChangeEventHandler:function(e, data)
	{		
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;

		var labelValue = data._isClean ? '' : '*';
		tabPage.ibxWidget("setDirtyLabelValue", labelValue);
		
		var enableSave = data._isClean && !this._getIsFileNewFunction();
		
		// [WEBDEV-122]
		//this._menuSave.ibxWidget("option", "disabled", enableSave);
		//this._fileSave.ibxWidget("option", "disabled", enableSave);
		
		this._menuReset.ibxWidget("option", "disabled", data._isClean || this._getIsFileNewFunction());		
		this._menuUndo.ibxWidget("option", "disabled", !data._isUndo);
		this._menuRedo.ibxWidget("option", "disabled", !data._isRedo);

		tabPage.ibxWidget("setUndoRedoCotextMenu", data._isUndo, data._isRedo);
	},
	
	_checkFolderPathEventHandler:function(e, data)
	{
		data._path = this._checkFolderPath(data._path);
	},
	
	_currentFolderPathEventHandler:function(e, data)
	{
		if(data._currentFolderPath && data._currentFolderPath.length > 0)
			this.currentFolderPath = data._currentFolderPath;
		else
			data._currentFolderPath = this.currentFolderPath;
	},
	
	_getEditorFormatByExtensionEventHandler:function(e, data)
	{
		data._format = this._getEditorFormatName(data._extension);
	},
	
	_getEditorModeByExtensionEventHandler:function(e, data)
	{
		data._mode = this._getEditorModeByExtension(data._extension);
	},
	
	_getEditorSaveTypesEventHandler:function(e, data)
	{
		var folderPath = data._folderPath;
		var fileExtension = data._fileExtension;
		var types = [];
		var sftLength = this._saveFileTypes.length;
		
		for (var i = 0, l = sftLength; i < l; i++) 
		{
			if(fileExtension)
			{
				if(fileExtension == this._saveFileTypes[i][1])
					types.unshift(this._saveFileTypes[i]);	
				else
					types.push(this._saveFileTypes[i]);
			}
			else
			{
				types.push(this._saveFileTypes[i]);
			}
		}
		
		if (folderPath && folderPath.indexOf("/WFC/") != -1) 			    
		{			    	
			if (WFGlobals.isFeatureEnabled("ApplicationProperties") || WFGlobals.isFeatureEnabled("IBXPage"))			    		
				types.push([ibx.resourceMgr.getString(this._getEditorFormatName("prop")), "prop"]);
			    	
			if (WFGlobals.isFeatureEnabled("EditManifest") )			    		
				types.push([ibx.resourceMgr.getString(this._getEditorFormatName("man")), "man"]);		    	
		}
		
		data._saveTypes = types;
	},
	
	_getEditorOpenTypesEventHandler:function(e, data)
	{
		var folderPath = data._folderPath;
		var fileExtension = data._fileExtension;
		var types = [];
		var sftLength = this._openFileTypes.length;
		
		for (var i = 0, l = sftLength; i < l; i++) 
		{
			if(fileExtension)
			{
				if(fileExtension == this._openFileTypes[i][1])
					types.unshift(this._openFileTypes[i]);	
				else
					types.push(this._openFileTypes[i]);
			}
			else
			{
				types.push(this._openFileTypes[i]);
			}
		}
		
		if (folderPath && folderPath.indexOf("/WFC/") != -1) 			    
		{			    	
			if (WFGlobals.isFeatureEnabled("ApplicationProperties") || WFGlobals.isFeatureEnabled("IBXPage"))			    		
				types.push([ibx.resourceMgr.getString(this._getEditorFormatName("prop")), "prop"]);
			    	
			if (WFGlobals.isFeatureEnabled("EditManifest") )			    		
				types.push([ibx.resourceMgr.getString(this._getEditorFormatName("man")), "man"]);		    	
		}
		
		data._openTypes = types;
	},
	
	_getEditorModeByExtension:function(extension)
	{
		return this._getEditorModeByPath("/myfile."+extension);
	},
	
	_getEditorModeByPath:function(p)
	{
	    var modelist = ace.require(aceModelist);
	    return modelist.getModeForPath(p).mode;
	},
	
	_onEditorTabPaneChanged:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		var options = tabPage.ibxWidget("option");
		
		if(options.preventOpen)
		{
			this._fileOpen.hide();
		}
		else
		{
			this._fileOpen.show();
		}
		
		if(options.preventSave)
		{
			this._fileSave.hide();
		}
		else
		{
			this._fileSave.show();
		}
				
		if(options.preventSaveAs)
		{
			this._fileSaveAs.hide();
		}
		else
		{
			this._fileSaveAs.show();
		}
				
		if(options.preventReset)
		{
			this._menuReset.hide();
		}	
		else
		{
			this._menuReset.show();
		}
				
		if(options.preventRun)
		{
			this._menuRun.hide();
			this._menuRunSeparator.hide();
		}
		else
		{
			this._menuRun.show();
			this._menuRunSeparator.show();
		}		

		tabPage.ibxWidget("getStatusBarInfo");
		tabPage.ibxWidget("getEditorOptions");
		tabPage.ibxWidget("onUndoManagerChange");
		tabPage.ibxWidget("setEditorFocus");
	}, 
	
	_onNewFunction:function(e)
	{		
		var extensionValue = $(e.currentTarget).ibxWidget("option", "userValue");		
		this.openEditorTab(this.rootPath, this.currentFolderPath, "" , extensionValue);
	},
	
	_onFileOpen:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("onFileOpen");
	},

	_onSaveFileFunction:function(e)
	{
		this._onSaveFile();		
	},
	_onSaveAsFunction:function(e)
	{
		this._onSaveFileAs(e);
	},
	
	_getIsFileNewFunction:function()
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		var isFileNew = false;
		
		if(!tabPage)
			return isFileNew;
		
		isFileNew = tabPage.ibxWidget("getIsFileNew");
		 
		return isFileNew;
	},
	
	_onEditorRedoFunction:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("editorRedo");
	},
	
	_onEditorUndoFunction:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("editorUndo");
	},
	
	_onReset:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("fileReset");
	},

	_onSetEditorClipdoardMetadata:function(e, data)
	{
		this._editorClipboard = data._editorClipboardData;
		this._menuPaste.ibxWidget("option", "disabled", false);
	},
	
	_onEditorCutFunction:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("editorCut");
		
		this._menuPaste.ibxWidget("option", "disabled", false);
	},
	
	_onEditorCopyFunction:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("editorCopy");
		
		this._menuPaste.ibxWidget("option", "disabled", false);
	},
	
	_onEditorPasteFunction:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("editorPaste", this._editorClipboard);
	},
	
	_onRunFunction:function(e)
	{
		var tabPage =  this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("runFile");
	},	
	
	_onExitFunction:function(e)
	{
		this._onExit();
	},	
	
	_onHelp:function(e)
	{
		var url = IBI_HELP_CONTEXT + "/advanced/redirect.jsp?topic=/com.ibi.help/help.htm#editor";
		var specs = "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=400, height=400";
		
		window.open(url, "_blank", specs, true);
	},	
	
	_onSaveFileAs:function(e)
	{		           
		var tabPage =  this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("saveFileAs");		
	},

	editorWidget: function (){
		return this._editorTabPane.ibxWidget("selected");
	},

	content: function (content)
	{
		if (typeof content === 'undefined')
			return this._editorTabPane.ibxWidget("selected").ibxWidget("content");
		else
		this._editorTabPane.ibxWidget("selected").ibxWidget("content", content);
	},
	
	_onSaveFile:function(e)
	{						
		var tabPage =  this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("saveFile");
	},

	_onCloseFile:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("closeFile");
	},
	
	_removeTabPage:function()
	{		
		var tabPage = this._editorTabPane.ibxWidget("selected");
		
		this._editorTabPane.ibxWidget("remove", tabPage, true, true);

		tabPage = this._editorTabPane.ibxWidget("selected");
	    
		if(!tabPage) // if no opened tabs - close editor as per [WEBDEV-16]
		{
			if(this.options.preventExitOnLastTabClose)
			{
				return;
			}
			else
			{
				this._onExit();		
			}
		}
	},

	isDirty:function(e)
	{
        var tabBar = this._editorTabPane.ibxWidget("tabBar");        
        var tabBtns = tabBar.ibxWidget("children");
  
        for (var i = 0; i < tabBtns.length; i++)
        {
        	var tabBtn = $(tabBtns.get(i));
        	var tabPg = tabBtn.ibxWidget("option", "tabPage");
               
        	if (!tabPg.ibxWidget("isClean"))
        		return true;
        }
        
        return false;
	},

	clean: function ()
	{
        var tabBar = this._editorTabPane.ibxWidget("tabBar");        
        var tabBtns = tabBar.ibxWidget("children");
        
        for (var i = 0; i < tabBtns.length; i++)
        {
        	var tabBtn = $(tabBtns.get(i));
        	var tabPg = tabBtn.ibxWidget("option", "tabPage");
               
        	if (!tabPg.ibxWidget("setClean"))
        		return true;
        }
	},
	
	_onExit:function()
	{
		if(window.opener)
			window.close();
	},

	_resetStatusBarInfo:function(e)
	{	
		this._lengthLbl.ibxWidget("option", "text", "");		
		this._linesLbl.ibxWidget("option", "text", "");		
		this._linePosLbl.ibxWidget("option", "text", "");		
		this._columnPosLbl.ibxWidget("option", "text", "");
		this._insertLbl.ibxWidget("option", "text", "");
	},
	
	_onSetStatusBarCursorMetadata:function (e, data)
	{  	
		this._lengthLbl.ibxWidget("option", "text", data.contentLength);		
		this._linesLbl.ibxWidget("option", "text", data.lineCount);		
		this._linePosLbl.ibxWidget("option", "text", data.linePosition);		
		this._columnPosLbl.ibxWidget("option", "text", data.columnPosition);
		
		if(data.rangeSelected)
		{
			this._menuCopy.ibxWidget("option", "disabled", false);
			this._menuCut.ibxWidget("option", "disabled", false);
		}
		else
		{
			this._menuCopy.ibxWidget("option", "disabled", true);
			this._menuCut.ibxWidget("option", "disabled", true);
		}
	},
	
	_onSetStatusBarInsertKeyMetadata:function (e, data)
	{
		this._insertLbl.ibxWidget("option", "text", data.insertKeyStatus);
	},
	
	_onSetStatusBarNumlockKeyMetadata:function (e, data)
	{   
		this._numlockLbl.ibxWidget("option", "text", data.numlockKeyStatus);
	},
	
	_onSetStatusBarCapslockKeyMetadata:function (e, data)
	{   
		this._capslockLbl.ibxWidget("option", "text", data.capslockKeyStatus);
	},
	
	_onEditorOptionsChanged:function(e, data)
	{
		this._optionsLineNumbering.ibxWidget("option", "checked", data._config.showLineNumbers);
		this._optionsCodeFolding.ibxWidget("option", "checked", data._config.showFoldWidgets);
		this._optionsAutocomplete.ibxWidget("option", "checked", data._config.enableLiveAutocompletion);
		this._optionsDisplayIndentGuides.ibxWidget("option", "checked", data._config.displayIndentGuides);

		var mode = data._config.mode;
		
		if(mode && mode.length > 0)
		{
			var idxModePrefix = mode.indexOf(modePrefix);
			
			if(idxModePrefix > -1)
			{
				mode = mode.substring(idxModePrefix+modePrefix.length);
				
				if(this._runModes.indexOf(mode) > -1)
				{
					this._menuRun.ibxWidget("option", "disabled", false);
				}
				else
				{
					this._menuRun.ibxWidget("option", "disabled", true);
				}
			}
		}
	},
	
	_toggleSearchPanel:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("toggleSearchPanel");		
	},

	_toggleStatusBar:function(e)
	{
		//var isVisible = this._statusBar.is(":visible");
		
		var editorConfig = this.element.ibxWidget("option", "config");
		var enableStatusBar = editorConfig.enableStatusBar;		
		
		if (enableStatusBar)
		{
			this._statusBar.hide();
			editorConfig.enableStatusBar = false;
			this.element.ibxWidget("option", "config", editorConfig);
			return;
		}
		
		this._statusBar.show();
		editorConfig.enableStatusBar = true;
		this.element.ibxWidget("option", "config", editorConfig);
	},
	
	_toggleDisplayIndentGuides:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("toggleDisplayIndentGuides");		
	},
	
	_toggleLineNumbering:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("toggleLineNumbering");		
	},
	
	_toggleCodeFolding:function(e)
	{
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("toggleCodeFolding");		
	},
	
	_toggleAutocomplete:function(e)
	{		
		var tabPage = this._editorTabPane.ibxWidget("selected"); 
		
		if(!tabPage)
			return;
		
		tabPage.ibxWidget("toggleAutocomplete");		
	},
	
	_getEditorFormatName:function(ext)
	{		
	    var formatName = this._supportedFormats[ext];
	    return formatName;
	},

	_checkFolderPath:function(path)
	{
		if( path.indexOf("/", path.length - 1) == -1) // valid folder path must end with '/'
			path += "/";
			
		return path;
	},
	
	_destroy:function()
	{
		this._super();
	},
	
	_refresh:function()
	{
		this._super();
	}
});

//# sourceURL=wf_ace_editor.js