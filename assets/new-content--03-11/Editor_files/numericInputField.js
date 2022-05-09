/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/

$.widget("ibi.numericInputField", $.ibi.ibxTextField, 
{
	options:
	{
		"allowDecimal":true,
		"allowNegative": true,
		"decimalSeparator": "."
	},
	_widgetClass: "numeric-input-field",
	_create:function()
	{
		this._super();
		this.element.on("ibx_textchanged", this._onTextFieldKeyDown.bind(this));
	},
	_onTextFieldKeyDown:function(e)
	{
		var pattern = $.ibi.numericInputField.NUMERIC_PATTERN;
		if(!this.options.allowDecimal)
			pattern = pattern.replace(/\./g, '' );
		else
		{
			if(this.options.decimalSeparator != $.ibi.numericInputField.PERIOD)
				pattern = pattern.replace(/\./g, this.options.decimalSeparator);
		}
		if(!this.options.allowNegative)
		{
			var idx = pattern.lastIndexOf('-');
			var subStr = pattern.substr(idx);
			subStr = subStr.replace(/[-]/g,'');
			pattern = pattern.substr(0,idx) + subStr;
		}
		var regExp = new RegExp(pattern, "g");
		var strText = this.options.text.replace(regExp,'');
		if(this.options.allowDecimal)
		{
			var decSep = this.options.decimalSeparator;
			var decRegExp = new RegExp(SharedUtil.escapeRegExp(decSep), "g");
			var replacePattern = new RegExp("[" + SharedUtil.escapeRegExp(decSep) + "]", "g");
			if((strText.match(decRegExp) || []).length > 1)
			{	// allow only one instance of decimal separator
				var index = strText.indexOf(decSep);
				var subStr = strText.substr(index+1);
				subStr = subStr.replace(replacePattern,'');
				strText = strText.substr(0,index+1) + subStr;
			}
		}
		if(this.options.allowNegative)
		{
			if((strText.match(/\-/g) || []).length > 0)
			{	// allow only first character to be '-'
				var index = strText.lastIndexOf('-');
				if(index > 0)
				{
					var subStr = strText.substr(1);
					subStr = subStr.replace(/[-]/g,'');
					strText = strText[0] + subStr;
				}
			}
		}
		this.value(strText);
	},
	_refresh: function()
	{
		this._super();
		if(this.options.decimalSeparator.length != 1 || $.ibi.numericInputField.VALID_DEC_SEPARATORS.indexOf(this.options.decimalSeparator) < 0)
			this.options.decimalSeparator = $.ibi.numericInputField.PERIOD;
	}
});

$.ibi.numericInputField.NUMERIC_PATTERN = "[^\.0-9\-]";
$.ibi.numericInputField.PERIOD ="\.";
$.ibi.numericInputField.VALID_DEC_SEPARATORS ="\.\,\'";
//# sourceURL=numericInputField.js
