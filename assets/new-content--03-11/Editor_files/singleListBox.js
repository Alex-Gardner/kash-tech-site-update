/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/

/* DEV NOTES:
 * This control is not very usable as-is (by design). It is normally embedded within another dialog or control (such as the dualListBox control).
 * Your code must use the 'addListControl' function to add the actual component of your choosing (i.e. list, grid, bucket, tree, etc.),
 * with css to specify a size for the component.  Your code must also provide event listener code to handle all the button events.
 * See examples in \webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\ibxtools\wfcomponents\filterdialog\testing\dualListRefactoredTester.jsp
 * Also see the singleListBoxTester.jsp and dualListBoxTester.jsp files that are used for Cypress testing.
 * They also provide sample code for adding the list components and event listener code to handle events for singleDataGrid/ibxDataGrid. 
 * 
 * The toolbar and buttons on this control are configurable via the following functions:
 * displayToolbar - make the entire toolbar visible/invisible
 * enableUpButton/enableDownButton/enableClearList - control visibility and enable/disable state for the individual buttons.  Note that the enable
 * 		flag is only used when visibility is on.  If all of the buttons are made invisible, the toolbar will also be made invisible.
 */
// $Revision: 1.5 $:
$.widget("ibi.singleListBox", $.ibi.ibxVBox, {
	options: {
		"nameRoot": true,
		"displayToolbar": true,
		"displayUpButton": true,
		"displayDownButton": true,
		"displayClearList": true,
		"enableUpButton": true,
		"enableDownButton": true,
		"enableClearList": true,
		"pagination": true,
		"paginationTrigger": 50,
		"paginationPage": 25,
		"search": false,
	},
	_widgetClass: "single-list-box",
	_create: function () {
		this._super();
		this._loadWidgetTemplate(".wfc-singlelistbox-container");
		this._addEventHandlers();
		this.listControls = [];
	},
	_init: function () {

		this._super();
		this._gridLoadedBounded = this._gridLoaded.bind(this);
		this._updatePaginationBound = this._updatePagination.bind(this);
		this._setPaginationBound = this._setPagination.bind(this);
		this._droppedBound = this._dropped.bind(this);
	},
	_setPaginationBound: null,
	_setPagination: function () {
		const grid = this.getVisibleControl();
		if (!grid)
			return;
		const count = grid.ibxWidget('getRow').not('.search-from-grid-hide').length;
		let paginationWidget = this.element.find('.single-list-paging');
		if (this.options.pagination) {
			if (count >= this.options.paginationTrigger) {
				if (paginationWidget.length === 0) {
					paginationWidget = $("<div class='single-list-paging'>").paginationForGrid({ showRecordInfo: false, numberPerPage: this.options.paginationPage });
					this.element.append(paginationWidget);
				}
				paginationWidget.ibxWidget('option', {
					"grid": grid,
					"numberPerPage": this.options.paginationPage,
				})
				paginationWidget.ibxWidget('load');
			}
			else {
				if (paginationWidget.length !== 0) {
					paginationWidget.ibxWidget('resetRows');
					paginationWidget.remove();
				}
			}
		}
		else {
			if (paginationWidget.length !== 0) {
				paginationWidget.ibxWidget('resetRows');
				paginationWidget.remove();
			}
		}
	},
	_setSearch: function (grid) {
		grid = grid || this.getVisibleControl();
		if (!grid)
			return;
		let searchWidget = this.element.find('.single-list-search');
		if (this.options.search) {
			if (searchWidget.length === 0) {
				searchWidget = $("<div class='single-list-search'>").searchFromGrid({ "align": "stretch", "originalDataGrid": grid });
				searchWidget.insertAfter(this.element.find('.wfc-singlelistbox-toolbar'));
				searchWidget.on($.ibi.searchFromGrid.AFTER_SEARCH, this._setPaginationBound);
			}
		}
		else {
			if (searchWidget.length !== 0) {
				searchWidget.off($.ibi.searchFromGrid.AFTER_SEARCH, this._setPaginationBound);
				searchWidget.remove();
			}
		}
	},
	_updatePaginationBound: null,
	_updatePagination: function () {
		const paginationWidget = this.element.find('.single-list-paging');
		if (paginationWidget.length > 0) {
			paginationWidget.ibxWidget('load');
		}
	},
	_updateSearch: function () {
		const searchWidget = this.element.find('.single-list-search');
		if (searchWidget.length > 0) {
			searchWidget.ibxWidget('updateSearch');
		}
	},
	_droppedBound: null,
	_dropped: function (e) {
		const { items, target, isPrev } = e.originalEvent.data;
		this._moveItemsUpDown(isPrev, items, target);
	},
	_addEventHandlers: function () {
		this.wfcMoveItemsUp.on('click', () => this._moveItemsUpDown(true));
		this.wfcMoveItemsDown.on('click', () => this._moveItemsUpDown(false));
		this.wfcClearList.on('click', () => this.clearList());
		this.element.on($.ibi.singleDataGrid.ROWS_CHANGED, () => this._rowsAdded());
	},
	_rowsAdded: function (){
		this._setPagination();
		this._updateSearch();
	},
	_moveItemsUpDown: function (bMoveUp, items, target) {

		var listControl = this.getVisibleControl();
		if (!listControl)
			return;
		const selItems = items || listControl.ibxWidget("getSelectionManager").selected();
		const anchorItem = bMoveUp ? selItems.first() : selItems.last();
		const targetItem = target || (bMoveUp ? selItems.first().prev() : selItems.last().next());
		if (targetItem.length === 0)
			return;

		listControl.ibxWidget("addRows", selItems, targetItem, bMoveUp, true);
		let paginationWidget = this.element.find('.single-list-paging');
		if (paginationWidget.length > 0 && !paginationWidget.ibxWidget('isRowInCurrentPage', anchorItem[0])) {
			paginationWidget.ibxWidget(bMoveUp ? 'previousPage' : 'nextPage');
		}
		paginationWidget.ibxWidget('loadList');
		anchorItem[0].scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
		this.element.dispatchEvent($.ibi.singleListBox.MOVE_SELECTED_ITEMS_UPDOWN, { "direction": (bMoveUp ? "up" : "down") });
	},
	resetSearch: function () {
		this.element.find('.single-list-search').ibxWidget('reset', true);
		this._setPagination();
	},
	clearList: function () {
		var listControl = this.getVisibleControl();
		if (listControl)
			listControl.ibxWidget("removeAll");
		this.element.find('.single-list-search').ibxWidget('reset', false);
		this._setPagination();
		this.element.dispatchEvent($.ibi.singleListBox.CLEAR_LIST);
	},
	_gridLoadedBounded: null,
	_gridLoaded: function (e) {
		this._setPagination($(e.currentTarget));
		this._setSearch($(e.currentTarget));
	},
	addListControl: function (listControl) {
		this.wfcSingleListBoxList.ibxWidget("add", listControl);
		listControl.on($.ibi.singleDataGrid.LOAD_COMPLETED, this._gridLoadedBounded);
		listControl.on($.ibi.singleDataGrid.SORTED, this._updatePaginationBound);
		listControl.on($.ibi.singleDataGrid.DROPPED, this._droppedBound);
		this.listControls.push(listControl);
	},
	removeListControl: function (listControl) {
		this.listControls.splice(this.listControls.indexOf(listControl), 1);
		listControl.off($.ibi.singleDataGrid.LOAD_COMPLETED, this._gridLoadedBounded);
		listControl.off($.ibi.singleDataGrid.SORTED, this._updatePaginationBound);
		listControl.off($.ibi.singleDataGrid.DROPPED, this._droppedBound);
		this.wfcSingleListBoxList.ibxWidget("remove", listControl);
	},
	removeAllListControls: function () {
		this.listControls.map(listControl => listControl.off($.ibi.singleDataGrid.LOAD_COMPLETED, this._gridLoadedBounded));
		this.listControls = [];
		this.wfcSingleListBoxList.empty();
		this.element.find('.single-list-search').remove();
		this.element.find('.single-list-paging').remove();
	},
	setVisibleControl: function (control){
		$.each(this.listControls, function (idx, ctrl) {
			if (ctrl[0] === $(control)[0]) {
				this._setPagination();
				this._setSearch();
				return false; //break the loop
			}
		}.bind(this));
	},
	getVisibleControl: function () {
		if (this.listControls.length == 0)
			return null;
		if (this.listControls.length === 1)
			return this.listControls[0];
		var retValue;
		$.each(this.listControls, function (idx, ctrl) {
			if (ctrl.is(":visible")) {
				retValue = ctrl;
				return false; //break the loop
			}
		}.bind(this));
		return retValue;
	},
	_refresh: function () {
		this._super();
		this.wfcSingleListBoxToolbar.css("display", (this.options.displayToolbar) ? "" : "none");
		if (this.options.displayToolbar) {
			this.wfcMoveItemsUp.css("display", (this.options.displayUpButton) ? "" : "none");
			if (this.options.displayUpButton) {
				this.wfcMoveItemsUp.ibxWidget("option", "disabled", !this.options.enableUpButton);
			}
			this.wfcMoveItemsDown.css("display", (this.options.displayDownButton) ? "" : "none");
			if (this.options.displayDownButton) {
				this.wfcMoveItemsDown.ibxWidget("option", "disabled", !this.options.enableDownButton);
			}
			this.wfcClearList.css("display", (this.options.displayClearList) ? "" : "none");
			if (this.options.displayClearList) {
				this.wfcClearList.ibxWidget("option", "disabled", !this.options.enableClearList);
			}
		}
	}
});

$.ibi.singleListBox.MOVE_SELECTED_ITEMS_UPDOWN = "wfc_single_listbox_move_selected_items_updown";
$.ibi.singleListBox.CLEAR_LIST = "wfc_single_listbox_clear_list";

// # sourceURL=singleListBox.wfc.js
