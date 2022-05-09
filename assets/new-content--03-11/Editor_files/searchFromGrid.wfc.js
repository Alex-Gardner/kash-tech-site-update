/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.1 $:

/* DEV NOTES:
 * originalDataGrid - the classname of the grid from which the rows need to be searched
 * userValues - the object of the rows of the grid. This needs to be assigned as soon as the grid is loaded with all the rows. 
 * 				Key = the userData of the row 
 *				Value = the entire row. 
 * shouldLoadRows - this is the boolean to determine how the grid row was loaded.
 * 					e.g. true if -  
 * 					var cols = [
						$("<div>" + name + "</div>"),
						$("<div>" + description + "</div>"),
						$("<div>" + defaultValue + "</div>")
					];
					var row = $("<div>").ibxDataGridRow();
					row.append(cols);
					dataGrid.ibxWidget("addRow", row);
					this.options.userValue[name] = row;
				    
					false if - 
					var rowDataArray.push({
						cells: [{
							data: rowDataValueGeneral[i],
							display: rowDataValueGeneral[i]
						}],
						data: rowDataValueGeneral[i]
					});
					var rowJSON = {
						"rows": rowDataArray
					};
					rData = rowJSON.rows;
					this._sourceGrid.ibxWidget("load", { rData: rData });
				    
 * searchIcon - pass the glyph class for the placeholder button icon at the end of the search textbox
 * 
 * For exmple of the usage of this widget - /webfocus-webjars-ibxcaster/src/main/resources/META-INF/resources/ibxcaster/emailSchedulerUI/schedulerUI.js
 * */

$.widget("ibi.searchFromGrid", $.ibi.ibxHBox, {
	options: {
		"nameRoot": true,
		"originalDataGrid": "",
		"userValues": null,
		"shouldLoadRows": false,
		"searchIcon": "ibx-icons ds-icon-filter"
	},
	_widgetClass: "search-from-grid",
	_create: function () {
		this._super();
		this._loadWidgetTemplate(".wfc-search-from-grid-box");

		this._addEventHandlers();
		this.parameterSearchBtn.ibxWidget("option", "glyphClasses", this.options.searchIcon);
	},

	_addEventHandlers: function () {
		this.parameterSearchText.on("ibx_textchanged", this._searchParameterList.bind(this));
	},

	updateSearch: function () {
		this._doSearch(this.parameterSearchText.ibxWidget("value"));
	},

	_searchParameterList: function (e) {
		if (this._isReset)
			return;
		window.clearTimeout(this.timer);
		this.timer = window.setTimeout(function (e) {
			this._doSearch(this.parameterSearchText.ibxWidget("value"));
		}.bind(this, e), 500); //wait 500ms in case the user types more
	},

	_doSearch: function (searchstr, bNoTrigger) {
		if (this.options.originalDataGrid instanceof String)
			this.originalGridData = this.element.parents().find("." + this.options.originalDataGrid);
		else
			this.originalGridData = this.options.originalDataGrid;

		if (this.originalGridData.ibxWidget("option", "rowSelectAllCheckBox")) {
			this.originalGridData.ibxWidget("deselectAllItems");
			this.originalGridData.ibxWidget("uncheckSelectAll");
			this.originalGridData.ibxWidget("updateAllCheckBoxes");
		}

		const rows = this.originalGridData.ibxWidget("getRow");
		if (searchstr === "") //empty string goes back to full grid
		{
			rows.removeClass('search-from-grid-hide');
		}
		else {
			const reg = new RegExp(searchstr, 'ig');
			rows.each(function (index) {
				const row = $(this);
				const key = row.data().userData;
				row.toggleClass('search-from-grid-hide', !key.match(reg));
			});
		}
		if (!bNoTrigger)
			this.element.dispatchEvent($.ibi.searchFromGrid.AFTER_SEARCH);
	},
	reset: function (bItems) {
		this._isReset = true;
		this.parameterSearchText.ibxWidget('option', 'text', '')
		if (bItems)
			this._doSearch("", true);
		this._isReset = false;
	},
});

$.ibi.searchFromGrid.AFTER_SEARCH = "wfc_search_from_grid_after_search";