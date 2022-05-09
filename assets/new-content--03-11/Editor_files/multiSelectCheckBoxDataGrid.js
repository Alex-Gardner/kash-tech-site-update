/*
 * MSCBDataGrid = multi-select, checkbox data grid where a column, usually the first, is just a checkbox
 * The state of the checkbox is determined by the row's selected state and it's cannot be changed by itself
 * The checkbox is thus just a visual indication of selection
 * Hat tip to Julian for the code
 */

$.widget("ibi.multiSelectCheckBoxDataGrid", $.ibi.ibxDataGrid,
{
	options:
	{
		'cbCellNum': 0,		// usually
		'rowSelector': "",
		'selType': "multi",
	},

	_create: function()
	{
		this._super();

		this.element.on("ibx_selchange", function(e)
        {
			// set the check box to the state of the returned row set
            var data = e.originalEvent.data;            
            for(var i = 0; i < data.items.length; ++i)
            {
                var row = $(data.items[i]);
                var cb  = row.ibxDataGridRow('getCell', this.options.cbCellNum)
                cb.ibxWidget("option", "checked", data.selected);                   
            }
        }.bind(this));
	},
	
	addRows:function(rows, sibling, before)
	{
		this._super(rows, sibling, before);
		
		// for the rows added, find the configured checkbox and add a change handler
		$.each(rows, function(idx, row)
		{
			row = $(row);
            var cb  = row.ibxDataGridRow('getCell', this.options.cbCellNum)
            cb.on("ibx_change", function(cb, e)
            {
                var row = cb.closest(this.options.rowSelector);	// find the enclosing row by configured selector
                var sm = this.element.ibxWidget("getSelectionManager");
                var isSelected = sm.isSelected(row);
                cb.ibxWidget("option", "checked", isSelected);	// set the checkbox to the row's state
            }.bind(this, cb));
		}.bind(this));
	},
});