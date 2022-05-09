/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.3 $:

$.widget("ibi.outputViewer", $.ibi.ibxPopup,
{
	options:
	{
        "modal":true,
        "uri": "",
        "popOutCallback": null, // optional callback for popout.
	},
	_widgetClass:"output-viewer",
    _init: function ()
    {
        this._super();
        this.element.find(".output-viewer-close-button").on("click", function(e)
        {
            this.close();
        }.bind(this));
        
        this.element.find(".output-viewer-popout-button").on("click", function(e)
        {
            if (this.options.popOutCallback)
                this.options.popOutCallback();
            else
                window.open(this.options.uri);		
            this.close();
        }.bind(this));	
    }
});

$.ibi.outputViewer.runInWindow = function (item)
{
    var uri;

    if (item.name.lastIndexOf(".prtl") > 0)
    {
        //IBFS:/WFC/Repository/ 
        var path = item.parentPath.substring(21);
        var name = item.name.substring(0, item.name.lastIndexOf(".prtl"));
        uri = sformat("{1}/portal/{2}/{3}", applicationContext, path, name);
    }
    else
    {
        uri = sformat("{1}/run.bip?BIP_REQUEST_TYPE=BIP_LAUNCH&BIP_folder={2}&BIP_item={3}", applicationContext,
            encodeURIComponent(encodeURIComponent(item.parentPath)), encodeURIComponent(encodeURIComponent(item.name)));
        if (item.clientInfo && item.clientInfo.properties.parmrpt)
            uri += "&IBFS_wfDescribe=XMLRUN";
        if (item.params)
            uri += item.params;
    }
    window.open(uri);        
}

$.ibi.outputViewer.run = function(item)
{
    var uri;

    if (item.name.lastIndexOf(".prtl") > 0)
    {
        //IBFS:/WFC/Repository/ 
        var path = item.parentPath.substring(21);
        var name = item.name.substring(0, item.name.lastIndexOf(".prtl"));
        uri = sformat("{1}/portal/{2}/{3}", applicationContext, path, name);
    }
    else
    {
        uri = sformat("{1}/run.bip?BIP_REQUEST_TYPE=BIP_LAUNCH&BIP_folder={2}&BIP_item={3}", applicationContext,
		encodeURIComponent(encodeURIComponent(item.parentPath)), encodeURIComponent(encodeURIComponent(item.name)));
        if (item.clientInfo && item.clientInfo.properties.parmrpt)
            uri += "&IBFS_wfDescribe=XMLRUN";
        if (item.params)
            uri += item.params;
    }

    var viewer = ibx.resourceMgr.getResource('.output-viewer');
    viewer.ibxWidget("option", "uri", uri);
    viewer.find(".output-viewer-label").ibxWidget("option", "text", item.description);	
    viewer.ibxWidget("open");
    var iframe = viewer.find(".output-viewer-frame");
	ibx.waitStart(iframe);	
    iframe.on("load", function(){ ibx.waitStop(this);});
    iframe.ibxWidget("option", "src", uri);
    return viewer;
}

$.ibi.outputViewer.runUrl = function(url, description, popOutCallback)
{
    var viewer = ibx.resourceMgr.getResource('.output-viewer');
    if (popOutCallback)
        viewer.ibxWidget("option", "popOutCallback", popOutCallback);
    viewer.ibxWidget("option", "uri", url);
    viewer.find(".output-viewer-label").ibxWidget("option", "text", description || "");	
    viewer.ibxWidget("open");
    var iframe = viewer.find(".output-viewer-frame");
	ibx.waitStart(iframe);	
    iframe.on("load", function(){ ibx.waitStop(this);});
    iframe.ibxWidget("option", "src", url);
    return viewer;
}

$.ibi.outputViewer.downloadUrl = function(url){
    // Remove previous instance if any
    $("body").find('viewer-download-url').remove();
    // Create new instance and add it to body to start download.
    var iframe = $("<iframe class='viewer-download-url' src='" + encodeURI(url) + "' style='width:0px; height:0px;'>");
    $("body").append(iframe);
}


//# sourceURL=outputviewer.js
