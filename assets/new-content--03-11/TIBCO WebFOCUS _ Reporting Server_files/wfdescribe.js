/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/


//Simple string formatting function
function sformat()
{
    var s = arguments[0];
    var i = arguments.length;
    while (i--)
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    return s;
}

/****
	WebFOCUS Describe encapsulation class
	This can take all the meta data from a WFDescribe and turn it into a simple to use javascript class.
****/
function WFDescribe(appContext, language)
{
    this.appContext = appContext || "/ibi_apps";
    this.language = language || "en";

    //initialize the string bundle.
    if (!WFDescribe.DEFINES.STRINGS.AP2_LANGUAGE_CODE)
    {
        var uri = sformat("{1}/rb/json/{2}/com.ibi.intl.{3}.{3}.res", this.appContext, this.language, "autoprompt_jqm");
        var strings = $.ajax({ async: false, url: uri }).responseText;
        WFDescribe.DEFINES.STRINGS = JSON.parse(strings.replace(/\\'/g, "'"));
    }

    //setup amper validation stuff
    if (!WFDescribe._ctrlValidation)
    {
        WFDescribe._ctrlValidation = $("<input style='display:none;'>").attr(
            {
                "type": "hidden",
                "name": "AMPER_VALIDATION_CONTROL"
            });
        $(document.documentElement).append(WFDescribe._ctrlValidation);
    }
}
var _p = WFDescribe.prototype;

WFDescribe.DEFINES =
    {
        FOC_NO_VAL: "_FOC_NULL",
        FOC_ALL_VAL: "FOC_ALL",
        EMPTY_AMPER_VAL: "EMPTY_AMPER_VAL",
        AMPER_DEFAULT_DISPLAY: "AMPER_DEFAULT_VALUE",
        NBSP: "\u00A0",
        DEFERRED_DESC_MAX_LEN: 256,
        MULTI_SELECT_KEYS: ["AND", "OR", "BY", "ACROSS", ","],
        PDF_OBJECT_CLSID: "clsid:8856F961-340A-11D0-A96B-00C04FD705A2",
        UI_TYPES:
        {
            INTERNAL: "INTERNAL",
            TEXT: "TEXT",
            DATE: "DATE",
            SLIDER: "SLIDER",
            PINNEDSLIDER: "PINNEDSLIDER",
            SELECT: "SELECT",
            CHECKBOX: "CHECKBOX",
            RADIO: "RADIO",
            BUTTONSET: "BUTTONSET"
        },
        EVENTS:
        {
            "WFD_INFO_LOADED": "WFD_INFO_LOADED",
            "WFD_FEX_SAVED": "WFD_FEX_SAVED"
        },
        MESSAGES:
        {
            "MSG_GET_AMPER_VALUES": "MSG_GET_AMPER_VALUES"
        },
        STRINGS: {}
    };

WFDescribe.getStringValue = function (amperInfo, val){
    if (val instanceof Array)
    {
        if (val.length == 0)
            return "";
        else if (val.length === 1)
            return val[0];
        else
            return sformat("'{1}'", val.join(sformat("' {1} '", amperInfo.operation ? amperInfo.operation : "OR")));
    }
    else
        return val;
}   


//Align the current amper value(s) with the UI control value(s).
WFDescribe.updateAmperValue = function (amperInfo, val)
{
	if (typeof val == "number")
	{
		amperInfo.focValue = val;
		amperInfo.curValue = val;
		return amperInfo;
	}
	
    val = val || ""; //some controls make value null if nothing selected...default to empty.
    amperInfo.focNull.selected = (-1 != val.indexOf(WFDescribe.DEFINES.FOC_NO_VAL));
    val = amperInfo.focNull.selected ? amperInfo.focNull.value : val;
    if (val instanceof Array)
    {
        if (val.length == 0)
            amperInfo.focValue = "";
        else
            amperInfo.focValue = sformat("'{1}'", val.join(sformat("' {1} '", amperInfo.operation ? amperInfo.operation : "OR")));
        amperInfo.curValue = $.extend([], val);
    }
    else
        amperInfo.focValue = amperInfo.curValue = val;

    //[CLRPT-708] UI uses placeholder for empty values...must put them back to empty here.
    amperInfo.focValue = amperInfo.focValue.replace(new RegExp(WFDescribe.DEFINES.EMPTY_AMPER_VAL, "g"), "");

    //align the all the values selection states with the actual current selection
    $.each(amperInfo.values, function (idx, valInfo)
    {
        valInfo.selected = (-1 != amperInfo.curValue.indexOf(valInfo.value));
    });
    return amperInfo;
};

//[CLRPT-693]validate a value for an amper
WFDescribe._ctrlValidation = null;
WFDescribe.validateAmperValue = function (format, value, minValue, maxValue)
{
    return true;
    /*
    var validator = new ibiFormControlValidate();
    var isValid = validator.validate(WFDescribe._ctrlValidation.attr(
        {
            "ibiformat": format,
            "validRangeLow": minValue || "",
            "validRangeHigh": maxValue || ""
        }).val(value)[0]);
    return isValid;
    */
};

//return an array of the currently selected values.
WFDescribe.getSelectedValues = function (amper, bValsOnly)
{
    var retVals = [];
    $(amper.values).each(function (idx, valInfo)
    {
        if (valInfo.selected)
            retVals.push(bValsOnly ? valInfo.value : valInfo);
    });
    return retVals;
};

WFDescribe.findValueInfo = function (amper, val)
{
    var retVal = { "parentValue": null, "value": null, "display": null, "selected": false };
    for (var i = 0; i < amper.values.length; ++i)
    {
        valInfo = amper.values[i];
        if (valInfo.value == val)
        {
            retVal = $.extend({}, valInfo);
            break;
        }
    }
    return retVal;
};

WFDescribe.isPinnedSlider = function (amperInfo)
{
    return (undefined !== WFDescribe.getUserValue(amperInfo, "COMPARATOR"));
};

WFDescribe.isValidSlider = function (amperInfo)
{
    if (undefined !== WFDescribe.getUserValue(amperInfo, "COMPARATOR"))
    {
        
        return true;    
    }
    else
        return $.isNumeric(amperInfo.min) && $.isNumeric(amperInfo.max) && 
                amperInfo.min != amperInfo.max/* && amperInfo.defValue && amperInfo.defValue != WFDescribe.DEFINES.FOC_NO_VAL && amperInfo.defValue != ""*/;
};
/**
 * Return the user value for the name, or undefined if not found
 */
WFDescribe.getUserValue = function (amperInfo, name)
{
    for (var i = 0; i < amperInfo.userValues.length; i++)
    {
        var entry = amperInfo.userValues[i];
        if (entry.name == name)
            return entry.value;
    }
    return undefined;
};

_p._$xDoc = null;
_p.getDescribeDoc = function () { return this._$xDoc; };
_p.load = function load(xDoc, bNoUI)
{
    //show loading ui if desired.
    if (!bNoUI)
        $.mobile.loading("show", { "text": WFDescribe.DEFINES.STRINGS.AP2_LOADING_MESSAGE, "textVisible": true });

    //build the describe object.
    var $doc = this._$xDoc = $(xDoc);
    this._buildBindingMap($doc);
    this._buildChainMap($doc);

    //save meta information about the fex prompts...mostly for portal usage.
    this.nUserPrompts = parseInt($doc.find("[nrOfPromptVars]").first().attr("nrOfPromptVars"), 10);//[CLRPT-788]
    this.nDefaultedUserPrompts = parseInt($doc.find("[nrOfDefaultVars]").first().attr("nrOfDefaultVars"), 10);//[CLRPT-788]
    this.redirectReportURL = $doc.find("[redirectedReportURL]").first().attr("redirectedReportURL");

    //show the loading image for half a second.  This just looks better than not showing any load/reload UI.
    if (!bNoUI)
    {
        window.setTimeout(function ()
        {
            $.mobile.loading("hide");
        }, 500);
    }

    //let interested parties know the load completed.
    $(window).trigger(WFDescribe.DEFINES.EVENTS.WFD_INFO_LOADED);
};

_p._bindingMap = null;
_p.getBindingMap = function () { return this._bindingMap; };
_p._buildBindingMap = function _buildBindingMap($doc)
{
    var self = this;
    var bindingMap = this._bindingMap = {};
    $doc.find("bindingInfo > item").each(function (idx, elt)
    {
        var $elt = $(elt);
        var name = $elt.attr("name");
        var value = $elt.attr("value");
        bindingMap[name] = { "name": name, "value": value, "required": ($elt.attr("isReqParm") == "YES") };
    }.bind(this));
};

_p._chainMap = {};
_p.getChainMap = function () { return this._chainMap; };
_p._buildChainMapLazy = function ($doc){
    var chainMap = this._chainMap = {};

    let currentIndex = 0;
    while (true){
        // Find all nodes in the chain
        const nodes = $doc.find(`amper[chainIdx=${currentIndex}]`).toArray();
        if (nodes.length === 0)
            break;

        const chainInfo = { "chain": null, "fields": [] };

        // Sort by idxInChain
        nodes.sort((a, b) => {
            const aIndex = parseInt($(a).attr("idxInChain"), 10);
            const bIndex = parseInt($(b).attr("idxInChain"), 10);
            return aIndex-bIndex;
        }).map((amper, idx) => {
            let $el = $(amper);
    
            var amperName = $el.attr("name");
            var amperInfo = this.getAmperInfo(amperName);
            amperInfo.chainInfo = chainInfo;
            if (idx === 0)
                chainInfo.chain = $el;
            if (amperInfo.required)
            {
                const parent = chainInfo.fields[chainInfo.fields.length - 1];
                amperInfo.chainParent = parent;
                chainInfo.fields.push(amperInfo);
            }
        });            
        chainMap[`chain_ ${currentIndex}`] = chainInfo;

        currentIndex++;            
    }

    chainMap.orphans = { "chain": null, "fields": [] };
    $doc.find("ampers > amper[chainIdx=-1]").each(function (idx, el)
    {
        var $el = $(el);
        var fieldName = $el.attr("name");
        var amperInfo = this.getAmperInfo(fieldName);
        if (amperInfo.required)
            chainMap.orphans.fields.push(amperInfo);
    }.bind(this));
};
_p._buildChainMap = function _buildChainMap($doc)
{
    if (SharedUtil.isLazyLoading())
        return this._buildChainMapLazy($doc);

    var chainMap = this._chainMap = {};
    var $chains = $doc.find("tableChainList > chain").each(function (idx, el)
    {
        var chainInfo = { "chain": $(el), "fields": [] };
        chainInfo.chain.find("fields > field").each(function (idx, el)
        {
            var $el = $(el);
            var fieldName = $el.attr("name");
            var amperInfo = this.getAmperInfo(fieldName);
            amperInfo.chainInfo = chainInfo;
            if (amperInfo.required)
            {
                var parent = chainInfo.fields[chainInfo.fields.length - 1];
                amperInfo.chainParent = parent;
                chainInfo.fields.push(amperInfo);
            }
        }.bind(this));
        chainMap["chain_" + idx] = chainInfo;
    }.bind(this));

    chainMap.orphans = { "chain": null, "fields": [] };
    $doc.find("ampers > amper[chainIdx=-1]").each(function (idx, el)
    {
        var $el = $(el);
        var fieldName = $el.attr("name");
        var amperInfo = this.getAmperInfo(fieldName);
        if (amperInfo.required)
            chainMap.orphans.fields.push(amperInfo);
    }.bind(this));
};

_p._onControlValueChange = function _onControlValueChange(e, amperInfo)
{
};

//Encapsulate the information about an amper variable in an object. 
_p.getAmperInfo = function getAmperInfo(amperName)
{
    var server = '';
    var $serverNode = this._$xDoc.find("bindingInfo > item[name='IBIC_server']");
    if ($serverNode.length > 0)
        server = $serverNode[0].getAttribute('value');

	let app = '';
    let $appNode = this._$xDoc.find("bindingInfo > item[name='IBIAPP_app']");
    if ($appNode.length > 0)
        app = $appNode[0].getAttribute('value');	

    var $value = this._$xDoc.find(sformat("ampers > amper[name='{1}']", amperName));
    var amperInfo =
        {
            "name": $value.attr("name"),
            "type": $value.attr("type"),
            "operation": $value.attr("operation"),
            "format": $value.attr("format"),
            "initialSelection": $value.attr("initialSelection"),
            "min": parseFloat($value.attr("min")),
            "max": parseFloat($value.attr("max")),
            "focNull": { "isValid": false, selected: false, "value": WFDescribe.DEFINES.FOC_NO_VAL, "display": WFDescribe.DEFINES.STRINGS.AP2_FOC_NO_VALUE/*[CLRPT-756]Localize string on client.*/ },
            "chainIdxIn": Number($value.attr("idxInChain")),
            "chainIdx": Number($value.attr("chainIdx")),
            "chainInfo": null,
            "required": ($value.attr("inForm") == "true"),
            "values": [],
            "userValues": [],
            "nodeName": server,
			"appName": app,
            "dynFile" : $value.attr("dynFile"),
            "dynField": $value.attr("dynField"),
            "dynDisplayField": $value.attr("dynDisplayField"),
            "sortOrder": $value.attr("sortOrder"),
            "displayType": $value.attr("displayType")
        };

    var userValues = $value.find("userParameters > parameter");
    var title = "";
    userValues.each(function (index, value){
        var name = value.getAttribute("name");
        var value = value.getAttribute("value");
        if (name == "TITLE")
            title = value;
        amperInfo.userValues.push({"name": name, "value": value});
    });

    var dispType = $value.attr("displayType");
    var valInfo = amperInfo.valueInfo =
        {
            sortAscending: ($value.attr("sortOrder") != "DESCENDING"),
            displayType: dispType,
            isDynamic: (dispType == "find"),
            isStatic: (dispType == "staticType"),
            isPrompt: (dispType == "prompt"),
            field: $value.attr("dynDisplayField"),
            file: $value.attr("dynFile")
        };
    valInfo.isLookup = valInfo.isDynamic ? !!(valInfo.file.length) : false;

    //Misc amper info
    amperInfo.description = title ? title : ($value.attr("description") || amperInfo.name);
    amperInfo.isDate = (amperInfo.format.search(/[Yy]/g) != -1);
    amperInfo.multiselect = (WFDescribe.DEFINES.MULTI_SELECT_KEYS.indexOf(amperInfo.operation) != -1);//[CLRPT-879]Added other keys...moved to array of OK values.
    amperInfo.curValue = null;

    //save the default values...like curValue, keep array only if multiselect.
    amperInfo.isDefUserValue = false; // Used to check if the amper should be passed all the time or not
    amperInfo.defValue = '';
    var defValueMap = $.map($value.find("defValues > item"), function (item, idx) { return $(item).attr("value"); });
    var dvLength = defValueMap.length;
    var defUserValueMap = $.map($value.find("userDefValues > item"), function (item, idx) { return $(item).attr("value"); });
    var duvLength = defUserValueMap.length;
    if (duvLength > 0)
        amperInfo.defValue = amperInfo.multiselect ? defUserValueMap : defUserValueMap[0];
    else if (dvLength > 0)
        amperInfo.defValue = amperInfo.multiselect ? defValueMap : defValueMap[0];
    if (duvLength > 0 && duvLength != dvLength) // If there's a user value, and it's different than def value, pass the amper value all the time
        amperInfo.isDefUserValue = true;
    if (duvLength == dvLength){
        // If user value is equal with def value, don't pass the amper if the selected value is def value
        var diff = false;
        for (var i = 0; i < defValueMap.length; i++){
            if (defValueMap[i] != defUserValueMap[i])
            {
                diff = true;
                break;
            }
        }
        if (diff)
            amperInfo.isDefUserValue = true;
    }

    // Check for focNull valid:
    // First check if noSelection is set to "true"
    // Then if not, search values, as it can be added as a static value, like in Retatil Samples / Retail Sales Data:
    // WHERE WF_RETAIL_LITE.WF_RETAIL_STORE_SALES.STORE_TYPE EQ &STORE_TYPE.(<Store Front,Store Front>, <Web,Web>, <_FOC_NULL,_FOC_NULL> |FORMAT=A11V).Store Type:.QUOTEDSTRING;
    if ($value.attr("noSelection") === "true")
    {
        amperInfo.focNull.isValid = true;
    }
    else{
        //TEMPORARY METHOD OF FIGURING OUT _FOC_NULL...Waiting for AM to provide attributes on the 'value' node!
        var focNull = $value.find(sformat("values > item[value='{1}']", WFDescribe.DEFINES.FOC_NO_VAL));
        if (focNull.length || amperInfo.defValue == WFDescribe.DEFINES.FOC_NO_VAL)
            amperInfo.focNull.isValid = true;
    }

    //If date format, and NOT a static list, we put up the date control...otherwise, it'll be a popup.
    //if(/^(?:YYMD|YYDM|MYYD|MDYY|DYYM|DMYY)$/.test(amperInfo.format) && $value.find("values > entry").length == 0)
    var hasYY = (amperInfo.format.search("YY") != -1);
    var hasM = (amperInfo.format.search("M") != -1);
    var hasD = (amperInfo.format.search("D") != -1);
    if (hasYY && hasM && hasD && ($value.find("values > item").length == 0) && !valInfo.isDynamic)
    {
        amperInfo.ui_type = WFDescribe.DEFINES.UI_TYPES.DATE;
        amperInfo.focNull.display = WFDescribe.DEFINES.STRINGS.AP2_ALL_DATES;

        amperInfo.isDateTime = false;
        amperInfo.hasTime = false;
        amperInfo.hasTimeZone = false;
        amperInfo.datePart = amperInfo.defValue;
        amperInfo.timePart = '';
        amperInfo.timeZone = '';

        if (amperInfo.format.charAt(0)  === 'H')
        {
            amperInfo.isDateTime = true;
            const comparator = WFDescribe.getUserValue(amperInfo, "COMPARATOR");
            if (comparator !== undefined)
                amperInfo.comparator = comparator;
            // UTC+11 = "@Etc/GMT-11" 
            // UTC-11 = "@Etc/GMT+11"
            // UTC = "@UTC"
            // Bucharest = "@Europe/Bucharest"

            //           hours/mins/sec   fractions of sec  timezone                  UTC offset
            // < time:   (<digit> | ":")* ("." (<digit>)*)? ("@" <ident> "/" <ident> (("+" | "-")<digit>(<digit>)?)? )?  >                
            const atIndex = amperInfo.defValue.search(/(@UTC|@.+\/.+)/);
            amperInfo.hasTimeZone = atIndex > 0;
            if (atIndex > 0){
                amperInfo.timeZone = amperInfo.defValue.slice(atIndex + 1).trim();
                amperInfo.datePart = amperInfo.defValue.slice(0, atIndex).trim();
            }

            
            const spaceIndex = amperInfo.datePart.search(/\d\d:\d\d:\d\d\.\d\d\d/);
            if (spaceIndex > 0){
                amperInfo.hasTime = true;
                amperInfo.timePart = amperInfo.datePart.slice(spaceIndex).trim();
                amperInfo.datePart = amperInfo.datePart.slice(0, spaceIndex).trim();
            }
        }
    }
    else
    {
        if (WFDescribe.isPinnedSlider(amperInfo))
            amperInfo.ui_type = WFDescribe.DEFINES.UI_TYPES.PINNEDSLIDER;
        else
        {
            if ((amperInfo.chainIdxIn != -1) || $value.find("values").children().length)//[CLRPT-828]
                amperInfo.ui_type = WFDescribe.DEFINES.UI_TYPES.SELECT;
            else if (WFDescribe.isValidSlider(amperInfo))
                amperInfo.ui_type = WFDescribe.DEFINES.UI_TYPES.SLIDER;
            else if (valInfo.isPrompt)
                amperInfo.ui_type = WFDescribe.DEFINES.UI_TYPES.TEXT;
            else
                amperInfo.ui_type = WFDescribe.DEFINES.UI_TYPES.SELECT;
                
        }
    }

    return amperInfo;
};


/****
Get the values for the amper variable...based on the chain parent value(s).
This function looks a little weird because depending on where the values come from in the document we need
to look in different places.  Don't yell at me, I didn't create this document!
****/
_p.getAmperValues = function(amper, amperParent)
{
    var requireSort = false;
	//select the values
	var values = $();
	if(amper.chainIdxIn == -1 || !amper.chainInfo)
		values = this._$xDoc.find(sformat("ampers > amper[name='{1}'] > values > item", amper.name));
	else if(amper.chainIdxIn == 0){
        values = this._$xDoc.find(sformat("ampers > amper[name='{1}'] > values > item", amper.name));
        if (values.length === 0)
    		values = amper.chainInfo.chain.find(sformat("entries > item[name='{1}']", amper.name));
    }
	else if(amper.chainIdxIn > 0 && amperParent)
	{
        requireSort = true;
		//[CLRPT-1133]have to go back a generation to ensure this field is filtered correctly.
		var grandParent = amperParent ? amperParent.chainParent : null;
		var filterVals = amper.chainInfo.chain;
		if(grandParent)
		{
			var grandParentVals = "";
			if(grandParent.multiselect || grandParent.focNull.selected)
				$(grandParent.values).each(function(idx, value)
				{
					if(value.selected || grandParent.focNull.selected)
						grandParentVals += sformat("[parentValue='{1}'],", value.display.replace(/'/g, "\\'"));
				}.bind(this));
			else
				grandParentVals = sformat("[parentValue='{1}']", grandParent.curValue.replace(/'/g, "\\'"));
			grandParentVals = grandParentVals.replace(/,$/, "");
			filterVals = filterVals.find(grandParentVals);
		}
		else
			filterVals = filterVals.find("entries > item");
	
	
		var parentVal = amperParent.focNull.selected ? $.map(amperParent.values, function(valInfo, idx){return valInfo.value;}) : amperParent.curValue;
		var parentVals = $();
		if(amperParent.multiselect || amperParent.focNull.selected)
		{
			var filter = "";
			for(var i = 0; i < parentVal.length; ++i)
				filter += sformat("item[name='{1}'][value='{2}'],", amperParent.name, parentVal[i].replace(/'/g, "\\'"));//[CLRPT-788]must escape '
			filter = filter.replace(/,$/, "");
			parentVals = filterVals.filter(filter);
		}
		else
			parentVals = filterVals.filter(sformat("item[name='{1}'][value='{2}']", amperParent.name, parentVal.replace(/'/g, "\\'")));//[CLRPT-788]must escape '
		values = parentVals.find("nextValue");
	}
	
	//create the values
	amper.values = [];
	values.each(function(idx, el)
	{
		el = $(el);
		var display = value = parentValue = "";
		if(amper.chainIdxIn <= 0)
			value = el.attr("value"), display = el.attr("display");
		else if(amper.chainIdxIn > 0)
			value = el.attr("value"), display = el.attr("display"), parentValue = el.attr("parentValue");
	
		//store the value information...[CLRPT-708]Empty values weren't displaying correctly.
		var valInfo = {"parentValue":parentValue, "value":value || WFDescribe.DEFINES.EMPTY_AMPER_VAL, "display":display || WFDescribe.DEFINES.NBSP, "selected":false};
		
		//FOC NULL/ALL don't get added to values array...has special handling.
		if((valInfo.value == WFDescribe.DEFINES.FOC_NO_VAL) || (valInfo.value == WFDescribe.DEFINES.FOC_ALL_VAL) || (valInfo.value == WFDescribe.DEFINES.FOC_NONE_VAL))
			return;
	
		amper.values.push(valInfo);
    }.bind(this));

    if (requireSort){
        // We only sort chained children, as the data sets are return separate for each parent value, and they
        // need to be merged in the browser

        //now sort the values...[CLRPT-690]NOT DATE FIELDS. [CLRPT-731]NOT STATIC VALUES
        if(!amper.isDate && !amper.valueInfo.isStatic && amper.valueInfo.displayType !== "focexec")
        {
            amper.values.sort(function(amper, v1, v2)
            {
                var bIsNumeric = (amper.format.toLowerCase().search(/^[dpif]/) == 0);
                var t1 = (bIsNumeric) ? new Number(v1.value) : v1.display.toLowerCase();//[CLRPT-821]Sort alphas on display value (always when lookup).
                var t2 = (bIsNumeric) ? new Number(v2.value) : v2.display.toLowerCase();//[CLRPT-821]Sort alphas on display value (always when lookup).
        
                if(v1.value == v2.value && v1.display == v2.display)//[CLRPT-829]Flag duplicates for removal
                {
                    v2.duplicate = true;
                    return -1;
                }
                if(v1.value == WFDescribe.DEFINES.EMPTY_AMPER_VAL)//[CLRPT-708]Blanks are sorted to top.
                    return -1;
                if(v2.value == WFDescribe.DEFINES.EMPTY_AMPER_VAL)//[CLRPT-708]Blanks are sorted to top.
                    return 1;
                if(amper.valueInfo.sortAscending)
                {
                    if(t1 <= t2)
                        return -1;
                    if(t1 > t2)
                        return 1;
                }
                else
                {
                    if(t1 >= t2)
                        return -1;
                    if(t1 < t2)
                        return 1;
                }
                return 0;
            }.bind(this, amper));
        }
	
        //remove duplicates.
        amper.values = amper.values.filter(function(item, idx, array)
        {
            return !item.duplicate;
        });
        

    }
    else{
        // No need for sort, just remove duplicates
        const dupMap = new Map();
        const res = [];
        amper.values.map(value => {
            var key = "" + value.value + value.display;
            if (!dupMap.has(key))
            {
                res.push(value);
                dupMap.set(key, true);
            }
        });
        amper.values = res;

    }
    
	//and, return the values
	return amper.values;
};

//Get the content of a the fex needed to run this report with the current amper values.
_p.getParmFex = function getParmFex()
{
    var fexPreDefaults = fexPostDefaults = "";
    var cm = this.getChainMap();
    for (var key in cm)
    {
        $(cm[key].fields).each(function (idx, amperInfo)
        {
            var amperVal = amperInfo.multiselect ? ("'" + amperInfo.focValue.replace(/'/g, "''") + "'") : ("'" + amperInfo.focValue + "'");//[CLRPT-959]quotes around single values.
            var labelName = amperInfo.name;
            if(labelName.length > 56)
                labelName = labelName.substring(0, 56);
            fexPreDefaults += sformat("-IF &{1}.EXIST EQ 1 THEN GOTO {3};\n-DEFAULTS &{1}={2};\n-SET &{1}={2};\n-{3}\n", amperInfo.name, amperVal, labelName + "_END_DEF");
            fexPostDefaults += sformat("-DEFAULTS &{1}={2};\n", amperInfo.name, amperVal);
        });
    }

    //[CLRPT-707]Was -INCLUDING the wrong fex name when saving...wasn't using the original name.
    var fexContent = sformat("-*Generated by WebFOCUS AutoPrompt on {1}\n{2}-INCLUDE {3}\n{4}", new Date(), fexPreDefaults, this._bindingMap.SAVE_PARMRPT.value, fexPostDefaults);
    return fexContent;
};

//Save the fexContent to the Repository with the given name.
_p.saveParmFex = function saveParmFex(fullPath, name, ext, fexContent)
{
    //xml escape the values. 
    escFullPath = fullPath.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    escName = name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

    var bm = this._bindingMap;
    var fexObject =
        "<rootObject _jt='IBFSMRObject' type='FexFile' description='{1}' container='false' fullPath='{2}' name='{3}' binary='false'>" +
        "<content char_set='UTF8'>{4}</content>" +
        "<properties><entry key='parmrpt' value='{5}'/></properties>" +
        "</rootObject>";
    fexObject = sformat(fexObject, escName, escFullPath, escName + ext, window.btoa(unescape(encodeURIComponent(fexContent))), bm.SAVE_PARMRPT.value);
    var xhr = $.ajax(
        {
            "url": this.appContext + "/wfirs",
            "async": false,
            "method": "post",
            "data":
            {
                "IBFS_service": "ibfs",
                "IBIVAL_returnmode": "XMLENFORCE",
                "IBIWF_SES_AUTH_TOKEN": bm.IBIWF_SES_AUTH_TOKEN.value,
                "IBFS_action": "put",
                "IBFS_path": fullPath,
                "IBFS_object": fexObject,
                "IBFS_replace": "true"
            },
            "success": function ()
            {
            },
            "error": function (xhr, status, error) { alert(sformat(WFDescribe.DEFINES.STRINGS.AP2_ERROR_SAVING_FILE, fullPath, error)); }
        });

};

//Show the save as dialog so the user can select where to save the parm fex
_p.saveParmFexAs = function saveParmFexAs()
{
    var bm = this._bindingMap;
    var ctxPath = bm.SAVE_PARMS_PATH ? bm.SAVE_PARMS_PATH.value : ""; //[CLRPT-669]
    var oConfig = {};
    oConfig.bOpen = false;
    oConfig.nFlags = 0x000000002 | 0x000000100 | 0x000000200 | 0x002000000; //see tools/ibfs_explore/ibfs_explore_models.js for full list of flags.
    oConfig.strRootPath = "IBFS:/WFC/Repository";
    oConfig.strContextPath = ctxPath;
    oConfig.strDefaultName = WFDescribe.DEFINES.STRINGS.AP2_DEFAULT_SAVE_NAME;
    oConfig.strDefaultExt = "fex";
    oConfig.typeDefaultExplore = "TYPE_DETAILS";
    oConfig.nFilterIndex = 0;
    oConfig.arFilters = [["FEX Files", "*.fex"]];
    oConfig.arShortcuts = [];

    var fexContent = this.getParmFex();
    var strOptions = sformat("left={1}px,top=200px,width=800px,height=600px,resizable=yes,status=no", window.screenLeft + 200);
    var dlgArgs =
        {
            "fexContent": fexContent,
            "theme": "OceanRounded",
            "oConfig": oConfig,
            "customScriptFilename": null,
            "customClassName":
            {
                dispatchEvent: function (e)
                {
                    var oRet = e.getUserData();
                    var eType = e.getType();
                    if (eType == "CONTEXT_MENU")
                        e.preventDefault();
                }.bind(this)
            },
            "fnReturn": function (oReturn)
            {
                var dlgResult = oReturn.dlgResult;
                if (dlgResult)
                {
                    this.saveParmFex(dlgResult.strFullPathValid, dlgResult.strName, dlgResult.strExt, oReturn.dlgArgs.fexContent);
                    $(window.opener).trigger(WFDescribe.DEFINES.EVENTS.WFD_FEX_SAVED, dlgResult);//[BIP-2348]
                }
                delete window._dlgArgs;
            }.bind(this)
        };
    window.explorerDialogArgs = dlgArgs;
    var dlg = window.open(this.appContext + "/tools/ibfs_explore/resources/markup/ibfs_explore_app.htm", null, strOptions, null);
};

//submit the wfd info to the server.
_p.submit = function submit(target, desc)
{
    //submit the form to the server...then, remove it.
    var form = this.getSubmitForm(desc);
    form.prop("target", target);
    form.appendTo(document.documentElement).submit().remove();
};

//get the form for submission
_p.getSubmitForm = function getSubmitForm(desc)
{
    var form = $(sformat("<form style='display:none;' method='post' action= '{1}' autocapitalize='none' autocorrect='none'></form>", this._bindingMap.SCRIPT_NAME.value));

    //add the required form variables the user DOESN'T deal with.
    $.each(this._bindingMap, function (idx, info)
    {
        if (info.required)
        {
            //[CLRPT-823]Can't be blank, must at least have a space.
            if (info.name == "IBFS_tDesc")
            {
                if (desc)
                    info.value = desc;
                info.value = info.value || " ";
            }

            var input = $("<input>").attr(
                {
                    "type": "hidden",
                    "name": info.name,
                    "value": info.value
                }).appendTo(form);
        }
    });

    //add the other variables the user DOES deal with.
    $.each(this._chainMap, function (idx, chain)
    {
        $.each(chain.fields, function (idx, amperInfo)
        {
            var input = $("<input>").attr(
                {
                    "type": "hidden",
                    "name": amperInfo.name,
                    "value": amperInfo.focValue
                }).appendTo(form);
        });
    });

    return form;
};

_p.getAmpers = function getAmpers()
{
    var ampers = [];

	/*
	//add the required form variables the user DOESN'T deal with.
	$.each(this._bindingMap, function (idx, info)
	{
		if (info.required)
		{
			//[CLRPT-823]Can't be blank, must at least have a space.
			if (info.name == "IBFS_tDesc")
				info.value = info.value || " ";

			ampers.push({ name: info.name, value: info.value });
		}
	});
	*/

    //add the other variables the user DOES deal with.
    $.each(this._chainMap, function (idx, chain)
    {
        $.each(chain.fields, function (idx, amperInfo)
        {
            ampers.push({ name: amperInfo.name, value: amperInfo.focValue });
        });
    });

    return ampers;
};

//# sourceURL=wfdescribe.js