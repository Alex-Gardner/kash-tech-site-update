/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.1 $:

/* DEV NOTES:
 * grid - the element grid on which pagination is to be done
 * numberPerPage - number of maximum rows to be displayed per page - by default it's set to 20
 * showRecordInfo - boolean to display record numbers of the displaying rows per page on the right side e.g. 1 - 20 of 200 records
 * showFirstAndLastPageButtons - boolean to display buttons to navigate to first and last page 
 * 
 * For example please refer - /webfocus-webjars-ibxcaster/src/main/resources/META-INF/resources/ibxcaster/emailSchedulerUI/Testing/schedulerGridPaging.jsp
 * */

$.widget("ibi.paginationForGrid", $.ibi.ibxHBox, {
	options: {
		"nameRoot": true,
		"grid": null,
		"numberPerPage": 20,
		"showRecordInfo": true,
		"showFirstAndLastPageButtons": true
	},
	_widgetClass: "paging-for-grid",
	_create: function () {
		this._super();
		this._loadWidgetTemplate(".wfc-paging-for-grid-box");

		this.showJumpOnAPageBox.hide();
		this.showJumpOnAPageBox.ibxWidget("option", "textAlign", "center");

		this.totalRecords = 0;
		this.firstRecordNumberOnThePage = 1;
		this.lastRecordNumberOnThePage = this.options.numberPerPage;
		this.currentPage = 1;
		this.numberOfPages = 1;

		this._addEventHandlers();
	},
	_addEventHandlers: function () {
		this.showFirstPageOfGrid.on("click", this.firstPage.bind(this));
		this.showPreviousPageOfGrid.on("click", this.previousPage.bind(this));
		this.showNextPageOfGrid.on("click", this.nextPage.bind(this));
		this.showLastPageOfGrid.on("click", this.lastPage.bind(this));

		this.showCurrentPageNumberOfGrid.on("click", this.showJumpOnAPage.bind(this));
		this.showJumpOnAPageBox.on("keyup", this.showManuallyEnteredPage.bind(this));
		this.showJumpOnAPageBox.find('input').on("blur", this.showManuallyEnteredPage.bind(this));
	},
	load: function () {
		if (!this.options.showRecordInfo) {
			this.gridRecordInformation.hide();
			this.element.find(".wfc-buttons-to-navigate-pages-of-grid").addClass("buttonsBoxWithoutRecordInfo");
		} else {
			this.element.find(".wfc-buttons-to-navigate-pages-of-grid").removeClass("buttonsBoxWithoutRecordInfo");
		}

		if (!this.options.showFirstAndLastPageButtons) {
			this.showFirstPageOfGrid.hide();
			this.showLastPageOfGrid.hide();
		}

		this.setInitialNumbersForPaging();
		this.setInfoMessages();
		this.updateInfoMessages();

		this.showFirstPageOfGrid.ibxWidget("option", "disabled", true);
		this.showPreviousPageOfGrid.ibxWidget("option", "disabled", true);
		this.showNextPageOfGrid.ibxWidget("option", "disabled", false);
		this.showLastPageOfGrid.ibxWidget("option", "disabled", false);

		this.loadList();
	},
	setInitialNumbersForPaging: function () {

		this.totalRecords = this.options.grid.ibxWidget("getRow").toArray().reduce((count, rowEl) => {
			if (!$(rowEl).hasClass('search-from-grid-hide'))
				count++
			return count;
		}, 0);

		this.numberOfPages = Math.ceil(this.totalRecords / this.options.numberPerPage);

		if (this.totalRecords == 0) {
			this.firstRecordNumberOnThePage = 0;
			this.lastRecordNumberOnThePage = 0;
			this.currentPage = 0;
		} else {
			this.firstRecordNumberOnThePage = 1;
			this.currentPage = 1;
			this.lastRecordNumberOnThePage = this.options.numberPerPage;
		}
	},
	setInfoMessages: function () {
		this.recordInfoMessage = sformat(ibx.resourceMgr.getString("paginationForGrid.recordsInfo"), this.firstRecordNumberOnThePage, this.lastRecordNumberOnThePage, this.totalRecords);
		this.recordInfoMessageTitle = sformat(ibx.resourceMgr.getString("paginationForGrid.recordsInfoTitle"), this.firstRecordNumberOnThePage, this.lastRecordNumberOnThePage, this.totalRecords);
		//this.pageInfoMessage = sformat(ibx.resourceMgr.getString("paginationForGrid.pageInfo"), this.currentPage, this.numberOfPages);
		this.pageInfoMessage = `${this.currentPage}/${this.numberOfPages}`;
		this.pageInfoMessageTitle = sformat(ibx.resourceMgr.getString("paginationForGrid.currentPage"), this.currentPage, this.numberOfPages);
	},
	updateInfoMessages: function () {
		this.gridRecordInformation.ibxWidget("option", "text", this.recordInfoMessage);
		this.showCurrentPageNumberOfGrid.ibxWidget("option", "text", this.pageInfoMessage);

		this.gridRecordInformation.attr("title", this.recordInfoMessageTitle);
		this.showCurrentPageNumberOfGrid.attr("title", this.pageInfoMessageTitle);
	},
	loadList: function () {
		this.showJumpOnAPageBox.hide();
		this.showCurrentPageNumberOfGrid.show();

		this.showJumpOnAPageBox.ibxWidget("option", "text", "");
		this.enableDisableButtons();

		if (this.currentPage == 0)
			return;

		var begin = (this.currentPage - 1) * this.options.numberPerPage;
		var end = begin + this.options.numberPerPage;
		if (end > this.totalRecords)
			end = this.totalRecords;

		this.firstRecordNumberOnThePage = begin + 1;
		this.lastRecordNumberOnThePage = end;

		this.setInfoMessages();
		this.updateInfoMessages();

		// Go over all rows, and hide those not in the range, but skip those not in search pattern
		let count = 0;
		this.options.grid.ibxWidget("getRow").toArray().map(rowEl => {

			const row = $(rowEl);
			if (row.hasClass('search-from-grid-hide'))
				row.addClass('paging-for-grid-hide');
			else {
				if (count >= begin && count < end)
					row.removeClass('paging-for-grid-hide');
				else
					row.addClass('paging-for-grid-hide');
				count++;
			}
		});

	},
	resetRows: function (){
		this.options.grid.ibxWidget("getRow").toArray().map(rowEl => {
			const row = $(rowEl);
			row.removeClass('paging-for-grid-hide');
		});
	},
	isRowInCurrentPage: function (el){
		const index = this.options.grid.ibxWidget("getRow").not('.search-from-grid-hide').toArray().findIndex(rowEl => $(rowEl)[0] === $(el)[0]) + 1;
		return index >= this.firstRecordNumberOnThePage && index <= this.lastRecordNumberOnThePage;
	},
	getCurrentPageRows: function (){
		return this.options.grid.ibxWidget('getRow').not('.paging-for-grid-hide').not('.search-from-grid-hide');
	},
	isFirstPage: function (){
		return this.currentPage === 1;
	},
	isLastPage: function (){
		return this.currentPage === this.numberOfPages;
	},
	firstPage: function () {
		this.currentPage = 1;
		this.loadList();
	},
	previousPage: function () {
		this.currentPage -= 1;
		this.loadList();
	},
	nextPage: function () {
		this.currentPage += 1;
		this.loadList();
	},
	lastPage: function () {
		this.currentPage = this.numberOfPages;
		this.loadList();
	},
	showJumpOnAPage: function () {
		this.showCurrentPageNumberOfGrid.hide();
		this.showJumpOnAPageBox.show();
		this.showJumpOnAPageBox.find('input').focus();
	},
	showManuallyEnteredPage: function (e) {
		if (e.which == 13) {
			this.jumpOnAPage($(e.currentTarget));
		} else if (e.originalEvent.type == "blur") {
			this.jumpOnAPage($(e.currentTarget.parentElement));
		}
	},
	jumpOnAPage: function (element) {
		var pageNumber = element.ibxWidget("option", "text");
		if (pageNumber.trim().length == 0) {
			element.removeClass("invalidPageNumber");
			this.showJumpOnAPageBox.hide();
			this.showCurrentPageNumberOfGrid.show();
		} else if (pageNumber > 0 && pageNumber <= this.numberOfPages) {
			element.removeClass("invalidPageNumber");
			if (isNaN(parseInt(pageNumber))) {
				element.addClass("invalidPageNumber");
				return;
			}
			this.currentPage = parseInt(pageNumber);
			this.loadList();
		} else {
			element.addClass("invalidPageNumber");
			return;
		}
	},
	enableDisableButtons: function () {
		this.showFirstPageOfGrid.ibxWidget("option", "disabled", (this.totalRecords == 0 || this.currentPage == 1) ? true : false);
		this.showPreviousPageOfGrid.ibxWidget("option", "disabled", (this.totalRecords == 0 || this.currentPage == 1) ? true : false);
		this.showNextPageOfGrid.ibxWidget("option", "disabled", (this.totalRecords == 0 || this.currentPage == this.numberOfPages) ? true : false);
		this.showLastPageOfGrid.ibxWidget("option", "disabled", (this.totalRecords == 0 || this.currentPage == this.numberOfPages) ? true : false);
		this.showCurrentPageNumberOfGrid.ibxWidget("option", "disabled", (this.numberOfPages == 0 || this.numberOfPages == 1) ? true : false);
	}

});