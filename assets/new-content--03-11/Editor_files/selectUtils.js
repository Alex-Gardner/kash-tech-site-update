/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.2 $:

function SelectUtils() {}
SelectUtils.getSelectText = function(values, limit, total, manualEntry)
{
		var textToShow = "";
		if (values.length == 1)
			return SharedUtil.htmlEncode(values[0]);
		else if (!Array.isArray(values))
			return SharedUtil.htmlEncode(values);
		else if (values.length <= limit)
		{
			var isFirst = true;
			var separator = ibx.resourceMgr.getString('select.value.separator') + ' '; 
			for (var i=0;i<values.length;++i)
			{
				if (!isFirst)
					textToShow += separator
				else
					isFirst = false; 
				textToShow += values[i];
			}
			return SharedUtil.htmlEncode(textToShow);
		}
		else if (manualEntry)
		{			
			return textToShow = sformat(ibx.resourceMgr.getString('filter.readonly.selections'), values.length);
		}		
		else
		{
			return textToShow = sformat(ibx.resourceMgr.getString('select.values.xOfy'), values.length, total);
		}
};
