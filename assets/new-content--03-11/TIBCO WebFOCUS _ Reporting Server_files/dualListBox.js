/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/

/* DEV NOTES:
 * This control embeds 2 singleListBox controls. This and the embedded singleListBox controls are not very usable as-is (by design).
 * To be useful, your code must use the 'addListControls' function (or the individual addAllOptionsListControl and addSelectedItemsListControl functions)
 * to add the actual components of your choosing (i.e. list, grid, bucket, tree, etc.), with css to specify size for the embedded component and overall size
 * for this dualListBox control.  Your code must also provide event listener code to handle all the button events that this control and the embedded
 * singleListBox controls dispatch.  
 * See examples in \webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\ibxtools\wfcomponents\filterdialog\testing\dualListRefactoredTester.jsp
 * Also see the singleListBoxTester.jsp and dualListBoxTester.jsp files that are used for Cypress testing.  They also provide code for provide sample code for adding 
 * the list components and event listener code to handle events for singleDataGrid/ibxDataGrid.
 *
 * The buttons on this control are configurable via the following:
 * LoadLink button - can be turned on/off either via the 'displayLoadLink' option when creating the control, or dynamically in your code via the 'displayLoadLink' function
 * Add/Remove buttons - can be enabled/disabled via the 'enableAddButton and 'enableRemoveButton' functions
 * Exclude checkbox - the 'enableExcludeCheckbox' function can be used to control visibility and enable/disable state.
 * Additional options since 10/01/19: 
 **** 	removeSelectedOnAdd - false (default) to copy&add selected rows from left to right and just remove selected/all from left
 **** 	removeSelectedOnAdd - true (to support old design) to move selected rows from left to right and remove&re-insert selected/all from left to right
 ****   isDefaultAdd - false: widget client listen to add/remove/clear events and manages rows being moved left <=> right
 ****	isDefaultAdd - true: this widget adds/removes rows left <=> right
 * Also see comments in singleListBox.js for controlling the visibility and enable/disable states for the singleListBox toolbar and toolbar buttons.
 */


// $Revision: 1.5 $:
$.widget("ibi.dualListBox", $.ibi.ibxVBox, {
	options: {
		"nameRoot": true,
		"displayLoadLink": true,
		"displayLoadLinkRight": false,
		"enableAddButton": true,
		"enableRemoveButton": true,
		"displayExcludeCheckbox": true,
		"enableExcludeCheckbox": true,
		"removeSelectedOnAdd": false,
		"isDefaultAdd": true,
		"leftListOptions": {},
		"rightListOptions": {},
	},
	_widgetClass: "dual-list-box",
	_create: function () {
		this._super();
		this._loadWidgetTemplate(".wfc-duallistbox-container");
		this._addEventHandlers();
	},
	_init: function () {
		this._super();
	},
	sourceList: function () {
		return this.wfcSourceItemsList;
	},
	targetList: function () {
		return this.wfcSelectedItemsList;
	},
	_addEventHandlers: function () {
		this.wfcLoadLinkLeft.on('click', () => {
			this.element.dispatchEvent($.ibi.dualListBox.LOAD_DATA);
			this.element.dispatchEvent($.ibi.dualListBox.LOAD_DATA_LEFT);
		});
		this.wfcLoadLinkRight.on('click', () => {
			this.element.dispatchEvent($.ibi.dualListBox.LOAD_DATA_RIGHT);
		});
		this.wfcAddItems.on('click', function (e) { this._addSelections(e); }.bind(this));
		this.wfcRemoveItems.on('click', function (e) { this._removeSelections(e); }.bind(this));
		this.wfcExcludeCheckbox.on("ibx_change", function (e) { this._excludeSelection(e) }.bind(this));

		this.element.on($.ibi.singleDataGrid.ROW_DOUBLE_CLICK, function(e) {
			if (e.originalEvent.data.grid[0] ===  $(this.element.find('.wfc-singlelistbox-source'))[0])
				this._addSelectionsHelper([e.originalEvent.data.row.clone(true)]);
			else
				this._removeSelectionsHelper([e.originalEvent.data.row]);
		}.bind(this));
	},
	_loadData: function (e) {
		this.element.dispatchEvent($.ibi.dualListBox.LOAD_DATA);
	},
	_excludeSelection: function (e) {
		const checked = this.wfcExcludeCheckbox.ibxWidget("checked");
		this.element.dispatchEvent($.ibi.dualListBox.EXCLUDE_SELECTIONS, { "exclude": checked });
		this.applyStrikeThrough($('.wfc-singlelistbox-target').ibxWidget('getRow').toArray(), checked);
	},
	_addSelectionsHelper: function (rows) {
		this.element.dispatchEvent($.ibi.dualListBox.ADD_SELECTIONS);
		if (this.options.isDefaultAdd) {
			//TODO: check out wfc-singlelistbox-source/target types
			var _sourcelist = $(this.element.find('.wfc-singlelistbox-source'));
			var _targetList = $(this.element.find('.wfc-singlelistbox-target'));
			var bAddRemove = this.options.removeSelectedOnAdd;//removes selected rows from the source grid
			if (rows.length > 0) {
				if (this.options.displayExcludeCheckbox) {
					if ($(this.wfcExcludeCheckbox).ibxWidget("checked"))
						this.applyStrikeThrough(rows, true);
				}
				_targetList.ibxWidget("addRemoveRows", { "rows": rows, "bAdd": true, "bMoved": bAddRemove });
				_sourcelist.ibxWidget("deselectAllItems");
			}
		}
		this.element.dispatchEvent($.ibi.dualListBox.AFTER_ADD_SELECTIONS);
	},
	_addSelections: function () {
		if (this.options.isDefaultAdd) {
			var _sourcelist = $(this.element.find('.wfc-singlelistbox-source'));
			var rows = _sourcelist.ibxWidget("getSelectedObjects", !this.options.removeSelectedOnAdd);
			this._addSelectionsHelper(rows);

		} else {
			this.element.dispatchEvent($.ibi.dualListBox.ADD_SELECTIONS);
			this.element.dispatchEvent($.ibi.dualListBox.AFTER_ADD_SELECTIONS);

		}
	},
	_removeSelectionsHelper: function (rows){
		this.element.dispatchEvent($.ibi.dualListBox.REMOVE_SELECTIONS);
		//TODO: check out wfc-singlelistbox-source/target types
		var _sourcelist = $(this.element.find('.wfc-singlelistbox-source'));
		var _targetList = $(this.element.find('.wfc-singlelistbox-target'));
		if (rows.length > 0) {
			if (this.options.removeSelectedOnAdd) {
				_sourcelist.ibxWidget("addRemoveRows", { "rows": rows, "bAdd": true, "bMoved": true });//remove from target &insert into source
			}
			else
				_targetList.ibxWidget("addRemoveRows", { "rows": rows, "bAdd": false });//remove from target and update checkboxes
		}
		this.element.dispatchEvent($.ibi.dualListBox.AFTER_REMOVE_SELECTIONS);
	},
	_removeSelections: function (e) {
		if (this.options.isDefaultAdd) {
			const _targetList = $(this.element.find('.wfc-singlelistbox-target'));
			const rows = _targetList.ibxWidget("getSelectedObjects", false);
			this._removeSelectionsHelper(rows);

		} else {
			this.element.dispatchEvent($.ibi.dualListBox.REMOVE_SELECTIONS);
			this.element.dispatchEvent($.ibi.dualListBox.AFTER_REMOVE_SELECTIONS);
		}
	},
	applyStrikeThrough: function (rows, bOn) {
		$.each(rows, function (index, row) {
			$(row).css("text-decoration", bOn ? "line-through" : "none");
		}.bind(this));
	},
	addAllOptionsListControl: function (allOptionsListControl) {
		this.wfcSourceItemsList.ibxWidget("addListControl", allOptionsListControl);
		$(allOptionsListControl).addClass('wfc-singlelistbox-source');
		$(allOptionsListControl).on("dblclick", function (e) { this._addSelections(e); }.bind(this));
	},
	addSelectedItemsListControl: function (selectedItemsListControl) {
		this.wfcSelectedItemsList.ibxWidget("addListControl", selectedItemsListControl);
		$(selectedItemsListControl).addClass('wfc-singlelistbox-target');
	},
	addListControls: function (allOptionsListControl, selectedItemsListControl) {
		this.addAllOptionsListControl(allOptionsListControl);
		this.addSelectedItemsListControl(selectedItemsListControl);
	},
	autoSelectValues: function (values){

		const _sourcelist = $(this.element.find('.wfc-singlelistbox-source'));
		const _targetList = $(this.element.find('.wfc-singlelistbox-target'));
		_targetList.ibxWidget('removeAll');
		const addRows = [];
		_sourcelist.ibxWidget('getRow').toArray().map(row => {
			const userData = $(row).data().userData;
			if (values.findIndex(val => val === userData) >= 0)
				addRows.push($(row).clone(true));
		});
		if (addRows.length > 0)
			_targetList.ibxWidget("addRemoveRows", { "rows": addRows, "bAdd": true, "bMoved": this.options.removeSelectedOnAdd });
	},
	_refresh: function () {
		this._super();

		this.wfcSourceItemsList.ibxWidget('option', this.options.leftListOptions);
		this.wfcSelectedItemsList.ibxWidget('option', this.options.rightListOptions);

		this.wfcLoadLinkLeft.css("visibility", (this.options.displayLoadLink) ? "visible" : "hidden");
		this.wfcLoadLinkRight.css("visibility", (this.options.displayLoadLinkRight) ? "visible" : "hidden");
		if (!this.options.displayLoadLink && !this.options.displayLoadLinkRight) {
			this.wfcLoadLinkLeft.css("display", "none");
			this.wfcLoadLinkRight.css("display", "none");
		}
		else {
			this.wfcLoadLinkLeft.css("display", "");
			this.wfcLoadLinkRight.css("display", "");
		}
		this.wfcAddItems.ibxWidget("option", "disabled", !this.options.enableAddButton);
		this.wfcRemoveItems.ibxWidget("option", "disabled", !this.options.enableRemoveButton);
		this.wfcExcludeCheckbox.css("display", this.options.displayExcludeCheckbox ? "" : "none");
		this.wfcExcludeCheckbox.ibxWidget("option", "disabled", !this.options.enableExcludeCheckbox);
		this.element.find('.wfc-duallistbox-exclude-checkbox-placeholder').css("display", this.options.displayExcludeCheckbox ? "" : "none")
	}
});

$.ibi.dualListBox.LOAD_DATA = "wfc_dual_listbox_load_data";
$.ibi.dualListBox.LOAD_DATA_LEFT = "wfc_dual_listbox_load_data_left";
$.ibi.dualListBox.LOAD_DATA_RIGHT = "wfc_dual_listbox_load_data_right";
$.ibi.dualListBox.ADD_SELECTIONS = "wfc_dual_listbox_add_selections";
$.ibi.dualListBox.REMOVE_SELECTIONS = "wfc_dual_listbox_remove_selections";
$.ibi.dualListBox.AFTER_ADD_SELECTIONS = "wfc_dual_listbox_after_add_selections";
$.ibi.dualListBox.AFTER_REMOVE_SELECTIONS = "wfc_dual_listbox_after_remove_selections";
$.ibi.dualListBox.EXCLUDE_SELECTIONS = "wfc_dual_listbox_exclude_selections";

// # sourceURL=dualListBox.wfc.js
