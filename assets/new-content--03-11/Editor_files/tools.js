/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.2 $:
/**
 * Internal tools
 */

/**
 * Viewer for the components of a pgx folder
 * To start from the console: ibx.resourceMgr.getResource('.pgx-viewer').ibxWidget("open")
 */
$.widget("ibi.pPGXViewer", $.ibi.ibxDialog,
    {
        options:
        {
            "buttons": "cancel",
            'captionOptions': { 'text': "Content Viewer" },
            "autoClose": false,
            defaultAction: null
        },
        _widgetClass: "pgx-viewer",
        _create: function ()
        {
            this._super();
            Ibfs.load(applicationContext, WFGlobals.ses_auth_parm, WFGlobals.ses_auth_val).done(function (ibfs)
            {
                this._ibfs = new Ibfs(applicationContext, WFGlobals.ses_auth_parm, WFGlobals.ses_auth_val, { 'errorHandling': false });
                this._doInit();
            }.bind(this));
        },
        _doInit: function ()
        {
            var splitPath = this._splitPath(this._getStartPath());
            this.element.find(".pgxv-path").ibxWidget("option", "text", splitPath.pathOnly);
            this.element.find(".pgxv-path").on("ibx_change", this._loadPage.bind(this));
            this.element.find(".button-load").on("click", this._loadPage.bind(this));
            this._editor = ibx.resourceMgr.getResource('.text-editor-resources', true);
            this.element.find(".pgx-viewer-output-area").append(this._editor);
            this._editor.find(".ibx-tab-group").hide();
        },
        _getStartPath: function ()
        {
            var dfMediator = SharedUtil.getDFMediator(this.element);
            if (dfMediator)
            {
                return dfMediator.getPageUtil().getPage().ibxWidget("option", "path");
            }
            else
            {
                var pageUtil = $(".pd-tool").ibxWidget("getPageUtil");
                if (pageUtil)
                    return pageUtil.getPage().ibxWidget("option", "path");
                else
                {   
                    var path = $(".home-tree-node.fld-open").last().data("item").fullPath;
                    if (!path)
                        path = "IBFS:/WFC/Repository";
                    return path;
                }
            }
        },
        close: function ()
        {
            this._super();
        },
        _destroy: function ()
        {
            this._super();
        },
        _refresh: function ()
        {
            this._super();
        },
        _loadPage: function ()
        {
            this.element.find(".left-pane").empty();
            var path = this.element.find(".pgxv-path").ibxWidget("option", "text");
            this._ibfs.listItems(path, null, null, { asJSON: true, clientSort: false }).done( function(exInfo)
            {
                $.each(exInfo.result, function(i, item)
                {
                    var entry = $("<div class='item-label'>").ibxLabel({ text: item.name });
                    entry.ibxWidget("option", "path", item.fullPath);
                    entry.on("click", this._onFileClick.bind(this));
                    this.element.find(".left-pane").ibxWidget("add", entry);
                }.bind(this));
            }.bind(this));
        },
        _onFileClick: function (e)
        {
            var path = $(e.currentTarget).ibxWidget("option", "path")
            var splitPath = this._splitPath(path, true);
            var ext = "txt";
            switch (splitPath.ext)
            {
                case "man": ext = "xml"; break;
                default: break;
            }
            this._editor.ibxWidget("openEditorTab", "IBFS:/WFC/Repository", splitPath.pathOnly, "/" + splitPath.fullFileName, ext);
        },
        _splitPath: function (fullPath, isFile)
        {
            var ret = { 'fullPath': fullPath, 'pathOnly': fullPath, 'ext': '', 'fullFileName': '', 'fileName': '', 'wfirsPath': fullPath, 'folder': '' };
            var dotIndex = fullPath.lastIndexOf('.');
            if (isFile && -1 == dotIndex)
            {
                // assume file name doesn't have a dot
                dotIndex = fullPath.length;
            }

            if (dotIndex > 0)
            {
                ret.ext = fullPath.substring(dotIndex + 1);
                var slashIndex = fullPath.lastIndexOf('/');
                if (slashIndex >= 0)
                {
                    ret.fullFileName = fullPath.substring(slashIndex + 1);
                    ret.fileName = fullPath.substring(slashIndex + 1, dotIndex);
                    ret.pathOnly = fullPath.substring(0, slashIndex);
                    if (ret.fullFileName != ret.pathOnly)
                    {
                        var folderSlash = ret.pathOnly.lastIndexOf('/');
                        ret.folder = ret.pathOnly.substring(folderSlash + 1);
                    }
                }
                else
                {
                    ret.fullFileName = fullPath;
                    ret.fileName = fullPath.substring(0, dotIndex);
                    ret.pathOnly = '';
                }
            }
            ret.wfirsPath = ret.pathOnly.replace(":", "");
            ret.fullWfirsPath = ret.fullPath.replace(":", "");
            return ret;
        }
    });



//# sourceURL=tools.js