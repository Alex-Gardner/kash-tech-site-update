/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
/* $Revision: $: */

/**
 * Shared utility class
 */

/*global dfMediator, jQuery, ibxBusy, WFGlobals, */

function SharedUtil() {
}

SharedUtil._uiChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
SharedUtil._uiEpoch = (new Date(0));
SharedUtil._uiRandomSequenceLength = 8;
SharedUtil._lastTimestampUsed = null;
SharedUtil._counterSeq = 1;

SharedUtil._baseN = function (val) {
	if (val == 0)
		return "";
	var rightMost = val % SharedUtil._uiChars.length;
	var rightMostChar = SharedUtil._uiChars.charAt(rightMost);
	var remaining = Math.floor(val / SharedUtil._uiChars.length);
	return SharedUtil._baseN(remaining) + rightMostChar;
};

SharedUtil.getUniqueId = function (prefix) {
	var now = (new Date()).getTime() - SharedUtil._uiEpoch;
	var suffixval = SharedUtil._baseN(now);

	SharedUtil._counterSeq = ((now == SharedUtil._lastTimestampUsed) ? SharedUtil._counterSeq + 1 : 1);
	suffixval += SharedUtil._counterSeq;

	for (var i = 0; i < this._uiRandomSequenceLength; i++)
		suffixval += SharedUtil._uiChars.charAt(Math.floor(Math.random() * SharedUtil._uiChars.length));
	var moresuffix = Math.floor(Math.random() * Math.random() * 10000);
	suffixval += moresuffix;

	SharedUtil._lastTimestampUsed = now;

	if (prefix)
		suffixval = prefix + "-" + suffixval;
	return suffixval;
};

SharedUtil.escapeJSON = function (strId, value) {
	var o = {};
	o[strId] = value;
	var str = JSON.stringify(o);
	return str.substring(1, str.length - 1);
};

SharedUtil.escapeXml = function (str) {
	if (!str)
		return "";
	else
		str = "" + str;
	return str.replace(/[<>&'\n"]/g, function (c) {
		switch (c) {
			case '\n': return '&#10;';
			case '<': return '&lt;';
			case '>': return '&gt;';
			case '&': return '&amp;';
			case '\'': return '&apos;';
			case '"': return '&quot;';
		}
	});
};

SharedUtil.htmlEncode = function (value) {
	return $('<div/>').text(value).html();
};

SharedUtil.escapeRegExp = function (str) {
	// eslint-disable-next-line no-useless-escape
	return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Returns the dfMediator instance walking up the DOM tree from passed element
 * if no element passed, or cannot find one walking up the tree, the global dfMediator is returned, or null if none set
 * This is the safe function to call when there's a possibility that DF runs in the context of a portal, and multiple instances
 * of the DFMediator class exist simultaneously.
 */
SharedUtil.getDFMediator = function (element) {

	if (element) {
		var framework = $(element).closest(".designer-framework-run,.designer-framework");
		if (framework.length > 0)
			return framework[0]._dfMediator;
	}

	if (typeof dfMediator !== 'undefined')
		return dfMediator;
	else
		return null;
}

/**
 * Helper function when you just need to check that there is a DF or not
 */
SharedUtil.isDFMediator = function (element) {
	return null != SharedUtil.getDFMediator(element);
}

SharedUtil.unsubscribe = function (element, id) {
	var dfMediator = SharedUtil.getDFMediator(element);
	if (dfMediator) {
		dfMediator.unsubscribe(id);
	}
}

SharedUtil._standardThemes = [];
SharedUtil._customThemes = [];
SharedUtil._themesLoaded = false;
/**
 * @description Return the available themes via a Deferred
 * @param {Object} ibfs An ibfs object used for listItems
 * @param {Bool} refresh Force a reload of all themes
 */
SharedUtil.getThemes = function (ibfs, refresh) {
	var def = $.Deferred();
	if (!refresh && SharedUtil._themesLoaded) {
		def.resolve({ standard: SharedUtil._standardThemes, custom: SharedUtil._customThemes });
		return def;
	}

	var defStandard = ibfs.listItems("IBFS:/WFC/Global/Themes/Standard/*.*", -1, true, { asJSON: true, clientSort: false }).deferred;
	var defCustom = ibfs.listItems("IBFS:/WFC/Global/Themes/Custom/*.*", -1, true, { asJSON: true, clientSort: false }).deferred;

	defStandard.done(function (exInfo) {
		var items = new Map();
		$.each(exInfo.result, function (_, item) {
			items.set(item.fullPath, item.description);
			if (item.name == "theme.css")
				SharedUtil._standardThemes.push({ description: items.get(item.fullPath.slice(0, item.fullPath.lastIndexOf("/"))), path: item.fullPath });
		});
	});
	defCustom.done(function (exInfo) {
		var items = new Map();
		$.each(exInfo.result, function (_, item) {
			items.set(item.fullPath, item.description);
			if (item.name == "theme.css")
				SharedUtil._customThemes.push({ description: items.get(item.fullPath.slice(0, item.fullPath.lastIndexOf("/"))), path: item.fullPath });
		});
	});

	$.when.apply($, [defStandard, defCustom]).always(function () {
		SharedUtil._themesLoaded = true;
		def.resolve({ standard: SharedUtil._standardThemes, custom: SharedUtil._customThemes });
	});


	return def;
}

/**
 * Use jQuery UI datepicker to parse a string into a date.
 * See jQuery UI doc for valid formats: https://api.jqueryui.com/datepicker
 * @param {String} val - value to be parsed
 * @param {String} format - format for parsing
 * @return {date | null} Returns the parsed date object, or null if cannot parse
 */
SharedUtil.parseDate = function (val, format) {

	try {
		return $.datepicker.parseDate(format, val);
	}
	catch (ex) {
		return null;
	}
}


/* Jira PD-258 and PD-257 */
SharedUtil.IBIencodeURI = function (str) {
	if (str !== null) {
		str = escape(str);
		str = str.replace(/%u/g, '%25u').replace(/%([89A-F])/g, '%25u00$1');
		str = unescape(str);
		str = encodeURIComponent(str);
	}

	return str;
};

/* Jira PD-788  The following function is for POST method */
SharedUtil.IBIencode = function (str) {
	if (str !== null) {
		str = escape(str);
		str = str.replace(/%u/g, '%25u').replace(/%([89A-F])/g, '%25u00$1');
		str = unescape(str);
	}

	return str;
};

/* Jira DF-1242  Decode %unnnn to char */
SharedUtil.IBIdecode = function (str) {
	if (str !== null) {
		if (str instanceof Array) {
			for(var i=0; i<str.length; i++ ) {
				if (str[i] !== null && str[i] !== '') {
					str[i] = escape(str[i]);
					str[i] = str[i].replace(/%25u/g, '%u');
					str[i] = unescape(str[i]);
				}
			}
		}
		else {
			if( str !== '' ) {
				str = escape(str);
				str = str.replace(/%25u/g, '%u');
				str = unescape(str);
			}
		}
	}

	return str;
};

SharedUtil.ShowWaitWidget = function (element, widgetOptions) {
	var dfMediator = SharedUtil.getDFMediator(element);
	var options = Object.assign({ createInstance: false }, widgetOptions);

	if (dfMediator) {
		var actionElement = element;
		if (typeof element === 'string' || element instanceof String)
			actionElement = $(element).get(0);
		else
			if (element instanceof jQuery)
				actionElement = element.get(0);

		if (options.createInstance) {
			var busyWidget = new ibxBusy();
			busyWidget.show(true, actionElement, options.config);
			return busyWidget;
		}
		else
			if (options.existingWidget)
				options.existingWidget.show(true, actionElement, options.config);
			else
				ibxBusy.busy.show(true, actionElement, options.config);
		return ibxBusy.busy;
	}
	else {
		var waitWidget = ibx.waitStart(element, (options.config) ? options.config.message : "");
		waitWidget.ibxWidget("option", options);
		return waitWidget;
	}
};

SharedUtil.HideWaitWidget = function (element, widgetIntance) {
	var dfMediator = SharedUtil.getDFMediator(element);
	if (dfMediator) {
		if (widgetIntance)
			widgetIntance.show(false);
		else
			ibxBusy.busy.show(false);
	}
	else
		ibx.waitStop(element);

}

SharedUtil.ApplyClassToWaitWidget = function (widgetIntance, classString, querySelect) {
	if (widgetIntance instanceof ibxBusy) {
		if (querySelect)
			$(widgetIntance.getElement().querySelector(querySelect)).addClass(classString);
		else
			$(widgetIntance.getElement()).addClass(classString);
	}
	else
		widgetIntance.addClass(classString);
}

/*
This function builds a form in a window's DOM document, given the action and parms.
The parms arg is built as an object: parms = {a:b, c:d};
Returning the form object The last getElementById("myForm") rather than the var form seems (or at least seemed) to be necessary
in order for the caller to do the submit()
*/
SharedUtil.buildForm = function (doc, action, parms, method) {
	var body = doc.getElementsByTagName("body")[0];
	if (!body)											// iframe documents are completely empty
	{
		var html = doc.createElement("HTML");
		doc.appendChild(html);

		body = doc.createElement("BODY");
		html.appendChild(body);
	}

	var form = doc.createElement("FORM");
	form.setAttribute("id", "myForm");
	form.setAttribute("method", (method ? method : "POST"));
	form.setAttribute("action", action);
	form.setAttribute("name", "myForm");
	form.setAttribute("enctype", "application/x-www-form-urlencoded; charset=utf-8");
	body.appendChild(form);

	if (!method || method.toLowerCase() == "post") {
		parms[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();
	}

	for (var parm in parms) {
		var field = doc.createElement("INPUT");
		field.setAttribute("type", "hidden");
		field.setAttribute("name", parm);
		field.setAttribute("value", parms[parm]);
		form.appendChild(field);
	}

	form = doc.getElementById("myForm");
	return form;
};

SharedUtil.isLazyLoading = function () { return WFGlobals.isFeatureEnabled("AmperLazyLoading"); };

/* from util.ibx.js */
SharedUtil.sformat = function () {
	var s = arguments[0];
	var i = arguments.length;
	while (i--) {
		var val = (arguments[i] === undefined || arguments[i] === null) ? "" : arguments[i];
		s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), val);
	}
	return s;
}

SharedUtil.findParentWindow = function()
{
	try{
	var rtn = {
			homePage : null,
			legacyHomePage : null
	};
	var w;
	var parent = window.opener;
	var i = 0;
	
	while (parent && !parent.closed && i < 20 )
	{
		if(parent.home_globals)
		{
			w = parent;
			break;
		}
		parent = parent.opener;
		i++
	}	
	if(!w)
	{	
		parent = window.parent;
		i = 0;
		while (parent && !parent.closed && i < 20)
		{
			if(parent.home_globals)
			{
				w = parent;
				break;
			}
			parent = parent.parent;
			i++;
		}
	}
	if(!w)
	{
		parent = window.parent;
		i = 0;
		while (parent && !parent.closed && i < 20)
		{
			if(parent.home_globals)
			{
				w = parent;
				break;
			}
			parent = parent.opener;
			i++;
		}			
	}
	if(!w)
	{
		parent = window.opener;
		i = 0;
		while (parent && !parent.closed && i < 20)
		{
			if(parent.home_globals)
			{
				w = parent;
				break;
			}
			parent = parent.parent;
			i++;
		}			
	}	
	
	rtn.homePage = w;

	if (window.opener && window.opener.application)
		w = window.opener;
	else if (window.parent && window.parent.opener && window.parent.opener.application)
		w = window.parent.opener;	
	
	rtn.legacyHomePage = w;
	return rtn;
	}
	catch(e){
		return null;
	}
};

SharedUtil.notifyHomePage = function (eventName, localPath) {
	const path = localPath.substr(0, localPath.lastIndexOf("/"));
	window.localStorage.setItem("wf_notification", JSON.stringify({"type": eventName, "detail": path}));

	var homeWindow = SharedUtil.findParentWindow();
	if(homeWindow)
	{
		var homepageWindow = homeWindow.homePage;
		if (homepageWindow)
		{
			SharedUtil.triggerEventx(homepageWindow.document, eventName, { "detail": path });
			return true;
		}
	}
	return false;
}

SharedUtil.triggerEventx = function (el, eventName, options) 
{
	var event;
	if (el.createEvent)
	{
		event = el.createEvent("CustomEvent");
		event.initCustomEvent(eventName, true, true, options);
	}
	else
		event = new CustomEvent(eventName, options);

	el.dispatchEvent(event);

};

