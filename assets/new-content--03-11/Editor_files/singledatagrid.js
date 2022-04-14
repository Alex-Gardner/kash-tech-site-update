/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: $:
/* DEV NOTES:
	 colMap - array of objects describing columns properties: layout, type, size, header title, etc
	 selType - multiple row selection (default is "multi")
	 rowSelect - selection type is row: true/false
	 rowSelectCheckBox - show check box on each row as an indicator that row is selected: true/false
	 rowSelectAllCheckBox - show 'selectAll' header check box to select/deselect all: true/false,			
	 selectionDraggable - enable selection dragging: true/false ( default is false, it had some side-effects on brushing)
	 showColumnHeaders - true/false
	 showRowHeaders - true/false,
	 addDuplicatedRows - prevent/allow duplicate rows being added to the grid true/false ( false is default)
	 
	 load() is a main function expecting array of row objects where row columns match colMap definition
	 See examples in 
	   \webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\ibxtools\wfcomponents\filterdialog\testing\dualListRefactoredTester.jsp
	   \webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\ibxtools\wfcomponents\filterdialog\testing\gridTest.jsp
 */

const rowCheckClickHandler = (e) => {
	const check = $(e.target);
	const grid = check.closest('.single-data-grid').data('ibiSingleDataGrid');
	const rows = grid.getSelectionManager().selected().toArray();
	var isChecked = grid._isChecked(check);
	rows.map(row => {
		const rowCheck = $(row).find(".row-checkbox");
		grid._onToggleCheckImage(rowCheck, !isChecked);
	});
};
const rowDragHandler = (e) => {
	const grid = $(e.target).closest('.single-data-grid').data('ibiSingleDataGrid');
	const originalEvent = e.originalEvent;
	const rows = grid.getSelectionManager().selected();
	//TODO: Should we be allowed to drag non-selected rows?
	if (rows.length === 0) {
		originalEvent.preventDefault();
		originalEvent.stopPropagation();
		return;
	}
	const dt = originalEvent.dataTransfer;
	switch (originalEvent.type) {
		case "ibx_dragstart": {
			grid._grid.ibxAutoScroll('start');
			dt.setData("singleDataGrid", rows);
			dt.setData('sourceGrid', grid.element);
			var txt = SharedUtil.sformat(ibx.resourceMgr.getString(rows.length === 1 ? 'df_grid_dragging_1' : 'df_grid_dragging_2'), rows.length);
			dt.setDragImage($("<div class='row-drag-image'>" + txt + "</div>")[0]);
			originalEvent.stopPropagation();
		}
			break;
		case "ibx_dragend": {
			grid._grid.ibxAutoScroll('stop');
		}
			break;
	}
};

const selectableChildrenHandler = (e) => {
	e.originalEvent.data.items = $(e.target).closest('.single-data-grid').data('ibiSingleDataGrid').getRow();
};

const rowDoubleClickHandler = (e) => {
	const grid = $(e.target).closest('.single-data-grid').data('ibiSingleDataGrid');
	const row = $(e.target).closest('.dgrid-row');
	grid.element.dispatchEvent($.ibi.singleDataGrid.ROW_DOUBLE_CLICK, { row: row, grid: grid.element });
};

$.widget("ibi.singleDataGridSelectionManager", $.ibi.ibxDataGridSelectionManager, {
	options: {
		rubberBand: false,
		cacheSelectableChildren: false,
	},
	selectableChildren: function (selector) {
		var children = this.options.grid.getRow();
		children.ibxAddClass("ibx-sm-selectable");
		return children;
	},
});

let singleDataGridIdCount = 0;

$.widget("ibi.singleDataGrid", $.ibi.ibxDataGrid,
	{
		options:
		{
			checkBoxColIndx: 0,
			colMap: [],
			undoColMap: [],
			selType: "multi",
			rowSelect: true,
			rowSelectCheckBox: false,
			rowSelectAllCheckBox: false,
			selectionDraggable: false,
			showColumnHeaders: true,
			showRowHeaders: false,
			addDuplicatedRows: false,
			defaultColConfig: { "resizable": true },
			reverseOnlySorting: false,
			checkState: true, // when true checking and selecting are separate
		},

		_widgetClass: "single-data-grid",

		_create: function () {
			this._super();
			this._grid.ibxDataGridSelectionManager('destroy');
			this._sm = this._grid.singleDataGridSelectionManager({ grid: this });
			this._sm = this._grid.singleDataGridSelectionManager("instance");
			this.element.on("ibx_dragover ibx_drop ibx_dragleave", (e) => {
				const dt = e.originalEvent.dataTransfer;
				if (!dt || dt.types[0] != 'singleDataGrid')
					return;
				const items = dt.items.singleDataGrid;
				const targetGrid = dt.items.sourceGrid;
				if (targetGrid !== this.element)
					return;
				const target = $(e.originalEvent.target.closest('.dgrid-row'));
				if (target.length === 0) {
					e.stopPropagation();
					return;
				}

				const type = e.originalEvent.type;
				switch (type) {
					case 'ibx_dragover':
						{
							if (!items.toArray().find(item => item === target[0])) {
								dt.dropEffect = "pointer";
								e.preventDefault();
							}
						}
						break;
					case 'ibx_drop':
						{
							const targetBoundingRect = target[0].getBoundingClientRect();
							const isPrev = e.clientY < targetBoundingRect.top + targetBoundingRect.height / 2;
							this.element.dispatchEvent($.ibi.singleDataGrid.DROPPED, { items, target, isPrev });
						}
						break;
				}
				e.stopPropagation();
			});
		},
		_init: function () {
			this._super();
			this._grid.ibxAutoScroll({ direction: 'vertical' });
		},
		_refresh: function () {
			this._super();
			var colmap = this.options.colMap;
			var len = colmap.length;
			if (len == 0)
				return;

			var _headerCheckboxCol = {
				"title": "",
				"displayAs": "rowselector",
				"size": "40px",
				"resizable": false,
				"sortable": false,
				"visible": true,
				"ui": $("<div class='header-checkbox'>")
			};

			var indx = this.options.checkBoxColIndx && this.options.checkBoxColIndx > -1 ? this.options.checkBoxColIndx : 0;
			var targetCol = colmap[indx];
			if (this.options.rowSelectCheckBox && this.options.rowSelectAllCheckBox) {
				var col = this._getHeaderCheckBoxColumn(colmap);
				var colIndx = col ? col.colIndex : -1;

				if (!targetCol && colIndx > -1)//checkBoxColIndx is not specified or doesn't match check box col position in the map
				{
					var lastCol = false;
					if (indx >= len - 1) {
						indx = len - 1;
						lastCol = true;
					}
					targetCol = (colmap[colIndx]);
					targetCol.ui = _headerCheckboxCol.ui;
				}

				if (targetCol) {
					if (indx == 0 && targetCol.displayAs == "rowselector") //index/default index matches position of the column
					{
						targetCol.ui = _headerCheckboxCol.ui;
						if (!targetCol.visible) {
							targetCol.visible = true;
							this.updateHeaders();
						}
					}
					else {
						if (colIndx > -1) //check box col was found in colMap
						{
							colmap.splice(colIndx, 1, colmap.splice(indx, 1, colmap[colIndx])[0]); //swap checkbox column with this.options.colMap[indx]
							if (lastCol)
								colmap[indx].size = "flex";
							this.updateHeaders();
						}
						else //use default col and this.options.checkBoxColIndx as index to insert it
						{
							targetCol = _headerCheckboxCol;
							var len = colmap.length;
							if (indx >= colmap.length) {
								targetCol.size = "flex";
								colmap.push(targetCol);
							}
							else
								colmap.splice(indx, 0, targetCol);
							this.updateHeaders();
						}
					}
				}
				else //use default col and this.options.checkBoxColIndx as index to insert it
				{
					targetCol = _headerCheckboxCol;
					if (indx >= colmap.length) {
						targetCol.size = "flex";
						colmap.push(targetCol);
					}
					else
						colmap.splice(indx, 0, targetCol);
					this.updateHeaders();
				}
			}
			else if (targetCol && (targetCol.displayAs == "rowselector" && targetCol.visible)) {
				targetCol.visible = false;
				this.updateHeaders();
			}
		},
		setSortCallback: function (callbackFunc) {
			this.sortCallback = callbackFunc;
		},
		setSearchCallback: function (callbackFunc) {
			this.searchCallback = callbackFunc;
		},
		uncheckSelectAll: function () {
			if (this.options.rowSelectAllCheckBox && this._isChecked(this._headerCheckBox))
				this._onToggleCheckImage(this._headerCheckBox, false);
		},
		removeAllItems: function () {
			this.removeAll();
			this.uncheckSelectAll();
		},

		deselectAllItems: function (args) {
			if (this.options.checkState) {
				this.updateAllCheckBoxes(false)

			}
			else {
				this.getSelectionManager().deselectAll(true);

			}
			if (this.options.rowSelectAllCheckBox)
				this.onToggleHeaderCheckImage(false);

		},

		selectAllItems: function (args) {
			if (this.options.checkState) {
				this.updateAllCheckBoxes(true)

			}
			else {
				this.getSelectionManager().selectAll(true);

			}
			if (this.options.rowSelectAllCheckBox)
				this.onToggleHeaderCheckImage(true);
		},
		addRows: function (rows, sibling, before, bNotTrigger) {
			this._super(rows, sibling, before);
			for (var i = 0; i < rows.length; i++) {
				const row = $(rows[i]);
				if (this.options.selectionDraggable) {
					row.ibxAddClass("ibx-draggable");
					row.off("ibx_dragstart ibx_dragend", rowDragHandler);
					row.on("ibx_dragstart ibx_dragend", rowDragHandler);
				}
				if (this.options.checkState) {
					const check = row.find('.row-checkbox');
					check.off("click", rowCheckClickHandler);
					check.on("click", rowCheckClickHandler);
				}
				row.off("dblclick", rowDoubleClickHandler);
				row.on("dblclick", rowDoubleClickHandler);
				if (!bNotTrigger){
					row.removeClass('search-from-grid-hide paging-for-grid-hide');
				}
			}
			if (!bNotTrigger){
				this.element.dispatchEvent($.ibi.singleDataGrid.ROWS_CHANGED);
			}
		},

		addRemoveRows: function (args) {
			var rows = args.rows;
			var bChecked = args.bChecked;
			/*
			if(!this.loadCompleted)
			{
				this.load({rData:[]});
				//this.updateRowsAndHeader();
			}*/
			if (args.bAdd) {
				var _rows = this.options.addDuplicatedRows || this.getRowCount() == 0 ? rows : this.filterOutDuplicates(rows);
				if (!_rows || _rows.length == 0)
					return; //duplicates, nothing to add
				this.addRows(_rows, null, null);
				if (this.options.rowSelectCheckBox) {
					if (!args.bMoved)
						this.updateAllCheckBoxes(false);
				}
				if (args.bSort || args.bMoved)
					this.sortRows();
				if (this.options.rowSelectAllCheckBox && !bChecked)
					this.getSelectionManager().deselectAll(true);
			}
			else {
				this.removeRow(rows);
				this.uncheckSelectAll();
			}
		},
		removeRow: function (row) {
			this._super(row);
			this.element.dispatchEvent($.ibi.singleDataGrid.ROWS_CHANGED);
		},
		removeAll: function () {
			this._super();
			this.element.dispatchEvent($.ibi.singleDataGrid.ROWS_CHANGED);
		},
		sortRows: function (header, forceRealSort) {
			var headers = this.getHeaders();
			if (!header && this.currentSortOptions.sortColIndex > -1)
				header = headers[this.currentSortOptions.sortColIndex];

			if (this.currentSortOptions.colInfo === undefined)
				this.currentSortOptions.colInfo = header ? $(header).data("ibxDataGridCol") : $(headers[this.currentSortOptions.sortColIndex]).data("ibxDataGridCol");

			if (!forceRealSort && this.options.reverseOnlySorting) {
				// Support for the case where sorting means just reversing the order of items,
				// so the place of the items that have been moved up/down is preserved
				var rows = this.getRow().toArray().reverse();
				this.removeAll();
				this.addRows($(rows), null, null);
				$(header).data('sortdir', this.currentSortOptions.sortOrder);
				$(header).ibxWidget('option', 'glyphClasses', `ibx-icons ${this.currentSortOptions.sortOrder === 'asc' ? 'ds-icon-arrow-up' : 'ds-icon-arrow-down'}`);
				this.element.dispatchEvent($.ibi.singleDataGrid.SORTED, {});
				return;
			}

			if (this.sortCallback && typeof this.sortCallback === 'function') {
				this.sortCallback({ 'header': header, 'sortOptions': this.currentSortOptions });
			}
			else {
				var rows = this.getRow();
				this.removeAll();
				rows = this._sortRowsByColumn(this.currentSortOptions.colInfo, this.currentSortOptions.sortOrder, rows);
				this.addRows(rows, null, null);
			}
			$(header).data('sortdir', this.currentSortOptions.sortOrder);
			$(header).ibxWidget('option', 'glyphClasses', `ibx-icons ${this.currentSortOptions.sortOrder === 'asc' ? 'ds-icon-arrow-up' : 'ds-icon-arrow-down'}`);
			this.element.dispatchEvent($.ibi.singleDataGrid.SORTED, {});
		},
		getSelectedObjects: function (bCopy) {
			let rows;
			if (this.options.checkState) {
				rows = this.getRow().toArray().filter(row => this._isChecked($(row).children('.row-checkbox')));
			}
			else {
				rows = this.getSelectionManager().selected();
			}
			if (!bCopy)
				return rows;
			var retValue = [];
			for (var i = 0; i < rows.length; i++) {
				retValue.push($(rows[i]).clone(true));
			}
			return retValue;
		},
		filterOutDuplicates: function (rows) {
			var retValue = [];
			if (this.getRowCount() > 0) {
				$.each(rows, function (idx, r) {
					var rdata = $(r).data().userData;
					var elem = this.filterSelectedValues(rdata);
					if (elem && elem.length > 0)
						retValue.push(r);
				}.bind(this));
			}
			return retValue;
		},
		filterSelectedValues: function (value) {
			var rows = this.getRow();
			var filteredValue = value;
			$.each(rows, function (idx, r) {
				var selVal = $(r).data().userData;
				switch (selVal.constructor) {
					case Object:
						filteredValue = filteredValue.filter(function (ele) { return ele.data != selVal });
						break;
					case Array:
						break;
					default:
						if (value == selVal) filteredValue = "";
						break;
				}
				if (filteredValue && filteredValue.length == 0)
					return false;
			});
			return filteredValue;
		},
		load: function (loadArgs) {
			var bKeepRows = loadArgs.bKeepRows;
			var rData = loadArgs.rData;
			var colMap = this.options.colMap;
			var selectRowChck = this.options.rowSelectCheckBox;
			var nCols = colMap.length;
			var nRows = rData.length;

			var rows = [];
			var checkBoxColIndx = -1;
			this.loadCompleted = false;

			for (var i = 0; i < nRows; ++i) {
				var cols = [];
				var jsonRow = rData[i];
				var dataColIndex = 0;
				for (var j = 0; j < colMap.length; j++) {
					var cell = null;
					var cellType = colMap[j].displayAs ? colMap[j].displayAs : "label";
					const jsonCell = jsonRow.cells[dataColIndex];
					switch (cellType) {
						case "checkbox":
							cell = $("<div>").ibxCheckBoxSimple({"checked": jsonCell.data == "1" || jsonCell.data == "true"});
							dataColIndex++;
							cell.on("ibx_change", function (e) {
								this.element.dispatchEvent($.ibi.singleDataGrid.CELL_CHECKBOX_CHANGED,
									{
										"checked": $(e.currentTarget).ibxWidget("option", "checked"),
										"row": this.getCellPos($(e.currentTarget)).row
									});
							}.bind(this));
							break;
						case "radiobutton":
							var display = jsonCell.display;
							cell = $("<div>").ibxRadioButtonSimple({ userValue: display });
							var glyph = jsonCell.glyphClasses;
							var iconPos = jsonCell.iconPosition ? jsonCell.iconPosition : "left";
							if (glyph) {
								cell.find(".ibx-label-text").hide();
								cell.append($(`<div class='ibx-flexbox fbx-inline fbx-row cell-uselect' data-ibxp-icon-position='${iconPos}' data-ibxp-glyph-classes='${glyph}'>`).ibxLabel({ 'text': display }));
							} else {
								cell.ibxWidget("option", "text", display);
							}
							cell.on("ibx_change", function (e) {
								this.element.find(".ibx-radio-button-simple-marker").removeClass("ibx-radio-button-simple-marker-check");
								this.element.find(".ibx-radio-button-simple-marker").addClass("ibx-radio-button-simple-marker-uncheck");
								//this.element.find(".ibx-radio-button-simple-marker").ibxWidget("option", "checked", false);
								$(e.currentTarget).ibxWidget("option", "checked", true);
								this.element.dispatchEvent($.ibi.singleDataGrid.CELL_CHECKBOX_CHANGED,
									{
										"checked": $(e.currentTarget).ibxWidget("option", "checked"),
										"row": this.getCellPos($(e.currentTarget)).row
									});
							}.bind(this));
							var udata = jsonCell.data ? jsonCell.data : display;
							cell.data({ "userData": udata });
							dataColIndex++;
							break;
						case "label":
							var glyph = jsonCell.glyphClasses;
							var iconPos = jsonCell.iconPosition ? jsonCell.iconPosition : "left";
							var display = jsonCell.display;
							var udata = jsonCell.data ? jsonCell.data : display;
							cell = $(`<div class="ibx-flexbox cell-uselect ibx-widget ibx-label icon-${iconPos} ${glyph ? '' : 'ibx-label-no-icon'} fbx-inline fbx-row fbx-nowrap fbx-justify-content-start fbx-justify-items-start fbx-align-items-center fbx-align-content-center fbx-child-sizing-content-box dgrid-cell" id="dgrid-cell-id-${singleDataGridIdCount++}" aria-disabled="false" tabindex="-1" role="gridcell"><div class="ibx-label-glyph ibx-label-icon ${glyph ? glyph + ' ibx-glyph-spacer' : ''}" aria-hidden="true" ${glyph ? '' : 'style="display: none;"'}></div><div class="ibx-label-text" style="white-space: nowrap;">${escapeXmlString(display)}</div></div>`);
							cell.data({ "userData": udata });
							dataColIndex++;
							break;
						case "glyph":
							display = jsonCell.display;
							udata = jsonCell.data ? jsonCell.data : display;
							cell = $(`<div class='${display} cell-uselect'></div>`);
							cell.ibxAddClass("ibx-flexbox fbx-inline fbx-row fbx-align-items-center fbx-aligncontent-center");
							cell.data({ "userData": udata });
							dataColIndex++;
							break;
						case "rowselector":
							cell = $(`<div class='${colMap[j].display ? colMap[j].display : $.ibi.singleDataGrid.ICONS.UNCHECKED} row-checkbox cell-uselect fbx-align-items-center fbx-aligncontent-center'></div>`);
							colMap[j].visible = this.options.rowSelectCheckBox;
							dataColIndex = dataColIndex == 0 ? 0 : --dataColIndex;
							break;
						case "menu":
							display = jsonCell.display;
							udata = jsonCell.data ? jsonCell.data : display;
							cell = display;
							cell.data({ "userData": udata });
							dataColIndex++;
							break;
						default:
							display = jsonCell.display;
							udata = jsonCell.data ? jsonCell.data : display;
							cell = $(`<div class='ibx-flexbox fbx-inline fbx-row fbx-align-items-center fbx-aligncontent-center cell-uselect'>${escapeXmlString(display)}</div>`);
							cell.data({ "userData": udata });
							dataColIndex++;
							break;
					}
					if (cell)
						cols.push(cell[0]);
				}
				var row = $("<div>").ibxDataGridRow();
				row.data({ "userData": jsonRow.data ? jsonRow.data : undefined, "rawData": jsonRow.rawData });
				row.append(cols);
				rows.push(row);
			}
			if (!bKeepRows)
				this.removeAll();
			this.addRows(rows, null, null);
			this.updateRowsAndHeader();

			this.element.dispatchEvent($.ibi.singleDataGrid.LOAD_COMPLETED, {});
			this.loadCompleted = true;
		},
		onToggleHeaderCheckImage: function (bChecked) {
			this._onToggleCheckImage(this._headerCheckBox, bChecked);
		},
		updateRowsAndHeader: function (bLoad) {
			if (bLoad) {
				this.load({ rData: [] });
				return;
			}
			this.updateHeaders();
			var colMap = this.options.colMap;
			var chckColumn = this._getHeaderCheckBoxColumn(colMap);
			var checkBoxColIndx = chckColumn.colIndex; //sort image will be added to the first visible column if checkbox is hidden
			if (this.options.rowSelectCheckBox && this.options.rowSelectAllCheckBox && checkBoxColIndx > -1) {
				this._headerCheckBox = $(this.getHeaders()[checkBoxColIndx]);
				this._headerCheckBox.addClass(sformat("{1} header-checkbox", $.ibi.singleDataGrid.ICONS.UNCHECKED));
				this._keepAllSelected = undefined;
			}
			var headers = this.getHeaders();
			headers.data('sortdir', 'asc'); //default
			headers.find('.ibx-label-text').css('flex', '1 1 auto');
			if (!this.loadCompleted) //this is empty target grid
			{
				var sortOrder = "asc";
				var sIndx = (this.options.rowSelectCheckBox && chckColumn && chckColumn.checkBoxCol && chckColumn.checkBoxCol.visible) ? 0 : -1;//if rowSelectCheckBox == false and header checkbox is hidden 
				var sortIndx = this.options.rowSelectCheckBox ? (checkBoxColIndx > 0 ? 0 : ++sIndx) : sIndx === -1 ? 0 : sIndx;
				var sortColInfo = $(headers[sortIndx]).data("ibxDataGridCol");
				this.currentSortOptions = { "sortOrder": sortOrder, "colInfo": sortColInfo, "sortColIndex": sortIndx }; //save initial state
			}
			var dirGlyph = `ibx-icons ${this.currentSortOptions.sortOrder === 'asc' ? 'ds-icon-arrow-up' : 'ds-icon-arrow-down'}`;
			$(headers[this.currentSortOptions.sortColIndex]).ibxWidget('option', { 'glyphClasses': dirGlyph, 'iconPosition': 'right' });
			this.options.undoColMap = colMap;
			this.options.checkBoxColIndx = checkBoxColIndx;
			/*******************  event handlers ******************************/

			headers.on("click", function (e) {
				var header = $(e.currentTarget);
				var colInfo = header.data("ibxDataGridCol");
				if (colInfo.displayAs == "rowselector") {
					e.stopPropagation();
					this._onSelectAll(e);
					return;
				}
				if (colInfo.sortable == false)
					return;

				var hdrs = this.getHeaders();
				$.each(hdrs, function (idx, hdr) {
					if ($(hdr).hasClass("header-checkbox"))
						return true;
					$(hdr).ibxWidget('option', 'glyphClasses', "");
					$(hdr).ibxWidget('option', 'iconPosition', 'right');
				});

				var direction = header.data('sortdir');
				if (!direction)
					direction = "asc";
				else if (direction == "desc")
					direction = "asc";
				else
					direction = "desc";
				//update sort options
				this.currentSortOptions.sortOrder = direction;
				this.currentSortOptions.colInfo = colInfo;
				this.currentSortOptions.colIndex = -1;
				this.sortRows(header);
			}.bind(this));
			if (!this.options.checkState)
				this.element.on('ibx_selchange', (e) => {
					if (this.options.rowSelectCheckBox) {
						var selInfo = e.originalEvent.data;
						var sm = selInfo.selMgr;
						var cb = selInfo.items.find(".row-checkbox");
						var isSelected = selInfo.selected;
						var selectedRows = this.getSelectionManager().selected().length;
						var rowCount = this.getRowCount();
						this._onToggleCheckImage(cb, isSelected);
						if (!this._headerSelectionChanged && !isSelected && this._isChecked(this._headerCheckBox))
							this._onToggleCheckImage(this._headerCheckBox, isSelected);
						if ((selectedRows == rowCount) && !this._headerSelectionChanged && isSelected && !this._isChecked(this._headerCheckBox))
							this._onToggleCheckImage(this._headerCheckBox, isSelected);
						//e.stopPropagation();
					}
				});
		},
		_getHeaderCheckBoxColumn: function (colMap) {
			var checkBoxCol = colMap.filter(function (col) { return (col.displayAs == "rowselector") })[0];
			var checkBoxColIndx = colMap.indexOf(checkBoxCol);
			return { "checkBoxCol": checkBoxCol, "colIndex": checkBoxColIndx };
		},
		_onSelectAll: function (e) {
			e.stopImmediatePropagation();
			var isChecked = this._isChecked(e.target);
			this._onToggleCheckImage(e.target, !isChecked);
			this._onSelectAllHandler(!isChecked);
		},
		_onToggleCheckImage: function (elem, checked) {
			var isChecked = this._isChecked(elem);
			if (isChecked == checked)
				return;
			$(elem).removeClass(isChecked ? $.ibi.singleDataGrid.ICONS.CHECKED : $.ibi.singleDataGrid.ICONS.UNCHECKED);
			$(elem).addClass(checked ? $.ibi.singleDataGrid.ICONS.CHECKED : $.ibi.singleDataGrid.ICONS.UNCHECKED);
		},
		_isChecked: function (elem) {
			return $(elem).hasClass($.ibi.singleDataGrid.ICONS.CHECKED);
		},
		updateAllCheckBoxes: function (checked) {
			const rows = this.getRow().not('.search-from-grid-hide').toArray();
			rows.map(row => this._onToggleCheckImage($(row).find('.row-checkbox'), checked));
		},
		/************************* utilities ********************************/
		_onSelectAllHandler: function (selectAll) {
			if (this.options.checkState) {
				this.updateAllCheckBoxes(selectAll)
			}
			else {
				if (selectAll && this._keepAllSelected == true)
					this._keepAllSelected = false;
				if (this._keepAllSelected) {
					return;
				}
				this._headerSelectionChanged = true;
				var _sm = this.getSelectionManager();

				if (selectAll) {
					//_sm.deselectAll(true);
					_sm.selectAll(true);
				}
				else
					_sm.deselectAll(true);

				//this.updateAllCheckBoxes(selectAll);
				this._headerSelectionChanged = false;
			}
		},
		_adjustLastColumn: function (fromSelector, colNum, showColumn) //TODO: handle calculations for % 
		{
			this.element.find('.dgrid-grid').css('overflow-x', 'auto');
			var colMap = this.options.colMap;
			var undoColMap = this.options.undoColMap;
			if (fromSelector) {
				for (var i = 0; i < colMap.length; i++)
					colMap[i].size = undoColMap[i].size;

				colMap[colNum].visible = showColumn;
				this.options.colMap = colMap;
			}

			var lastVis = 0;
			var totColWidth = 0;
			var gridWidth = this.element[0].clientWidth;
			for (var c = 0; c < colMap.length; c++) {
				if (colMap[c].visible) {
					lastVis = c;
					totColWidth += parseInt(colMap[c].size, 10);
				}
			}
			if (totColWidth < gridWidth) {
				var inc = gridWidth - totColWidth;
				if (this.element[0].scrollHeight > this.element.find('.dgrid-grid').height()) {
					inc -= 16;
					this.element.find('.dgrid-grid').css('overflow-x', 'hidden');
				}
				var isize = parseInt(colMap[lastVis].size, 10);
				var unit = (colMap[lastVis].size).split(isize)[1];
				var nsize = (isize + inc) + unit;
				colMap[lastVis].size = nsize;
				this.options.colMap = colMap;
			}
			this.updateHeaders("column");
		},
		_sortRowsByColumn: function (colInfo, direction, rows) {
			var colNum = colInfo._ui.idx;
			var type = colInfo.displayAs;

			function revRow(r1, r2) {
				r1 = $(r1);
				r2 = $(r2);
				var rd1 = r1.data();
				var rd2 = r2.data();

				var c1 = rd1.ibxDataGridRow.getCell(colNum);
				var c2 = rd2.ibxDataGridRow.getCell(colNum);

				var cd1 = $(c1).data('userData');
				var cd2 = $(c2).data('userData');

				if (isNaN(cd1)) {
					cd1 = cd1.toLocaleLowerCase();
					cd2 = cd2.toLocaleLowerCase();

					if (direction == 'desc')
						retVal = cd1.localeCompare(cd2) * -1;
					else
						retVal = cd1.localeCompare(cd2);
				}
				else {
					cd1 = Number(cd1);
					cd2 = Number(cd2);
					if (direction == 'desc')
						retVal = (cd1 < cd2 ? 1 : cd1 > cd2 ? -1 : 0);
					else
						retVal = (cd1 < cd2 ? -1 : cd1 > cd2 ? 1 : 0);
				}
				return retVal;
			}
			rows = rows.sort(revRow.bind(this));
			return rows;
		},
	});

$.ibi.singleDataGrid.ICONS = {
	"UNCHECKED": "ibx-icons ds-icon-checkbox-unchecked",
	"CHECKED": "ibx-icons ds-icon-checkbox-checked"
};


$.ibi.singleDataGrid.CELL_CHECKBOX_CHANGED = "grid_cell_checkbox_changed";
$.ibi.singleDataGrid.ROW_SELECTION_CHANGED = "grid_row_selection_changed";
$.ibi.singleDataGrid.SELECT_ALL = "select_all";
$.ibi.singleDataGrid.CLEAR_SELECTION = "clear_selection";
$.ibi.singleDataGrid.LOAD_COMPLETED = "grid_load_completed";
$.ibi.singleDataGrid.SORTED = "grid_sorted";
$.ibi.singleDataGrid.DROPPED = "grid_dropped";
$.ibi.singleDataGrid.ROW_DOUBLE_CLICK = "grid_row_double_click";
$.ibi.singleDataGrid.ROWS_CHANGED = "grid_rows_changed";
//# sourceURL=singledatagrid.js