/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.10 $:
//////////////////////////////////////////////////////////////////////////

$.widget("ibi.dateRangePicker", $.ibi.ibxDialog,
{
    options:
    {
        "filter": null,
        "buttons": "applycancel",
        "movable": false,
		"destroyOnClose":false,
    },
    _widgetClass: "date-range-picker",
    _create: function ()
    {
        this._super();
    },
    _init: function ()
    {
        this._super();
        window.addEventListener("orientationchange", function() {
            this.close();
          }.bind(this), false);
        this.element.find(".ibx-dialog-title-box").hide(); // hide the title box
        this.element.find(".drp-control-wrapper").hide(); // hide the control initially
        this._date = this.element.find(".drp-date-range");
        this._rangeList = this._createRangeList();
        this.element.on("ibx_menu_item_click", this._onRangeListSelect.bind(this))
        this.element.find(".ibx-dialog-apply-button").on("click", this._onApply.bind(this));
        this.element.find(".drp-range-list-wrapper").append(this._rangeList);
        this.element.find(".drp-control-wrapper").ibxWidget("add", this.element.find(".ibx-dialog-button-box"));
        this._outDate();
    },
    _outDate: function ()
    {
        var inputs = this._date.find(".ibx-datepicker-input");
        var formatDateFrom = $(inputs[0]).ibxWidget('option', 'text');
        var formatDateTo = $(inputs[1]).ibxWidget('option', 'text');
        if (formatDateFrom || formatDateTo)
            this._text = formatDateFrom + " - " + formatDateTo;
        else
            this._text = "";
    },
    // Override to provide your own menu
    _createRangeList: function ()
    {
        return ibx.resourceMgr.getResource(".drp-range-list", true);
    },
    _onApply: function ()
    {
        this._outDate();
        this._trigger("change", null, { "dateFrom": this._date.ibxWidget("option", "dateFrom"), "dateTo": this._date.ibxWidget("option", "dateTo"), "text": this._text, "userValue": "custom"});
        this.close();
    },
    // Override to provide your own callbacks for your menu
    _onRangeListSelect: function (e)
    {
        // this is the default implementation for the "drp-menu"
        var item = $(e.target);
        var userValue = item.ibxWidget("userValue");
        this.userValue(userValue);
    },
    userValue: function (userValue)
    {
		var dateFrom = new Date();
		var dateTo = new Date();
        var now = new Date();
		switch(userValue)
		{
			default: return;
			case "all":
			{
				this._date.data("ibiIbxWidget")._onClear();
				this._date.data("ibiIbxWidget")._onClear2();
                this._text = ibx.resourceMgr.getString('drp_all');
                this._trigger("change", null, { "dateFrom": "", "dateTo": "", "text": this._text, "userValue": userValue});
                this.close();
                this.element.find(".drp-control-wrapper").hide();
				return;
			}
            case "custom":
            {
                this.element.find(".drp-control-wrapper").show();
                this.element.position(this.options.position);
                return;
            }

            case "month-prev-current":
            {
                this._text = ibx.resourceMgr.getString('drp_month_prev_current');
                dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFrom.setMonth(dateFrom.getMonth() - 1);
                dateTo = new Date(now.getFullYear(), now.getMonth(), 1);
                dateTo.setMonth(dateTo.getMonth() + 1);
                dateTo = new Date(dateTo - 1);
            }
            break;
            case "quarter-prev-current":
            {
                this._text = ibx.resourceMgr.getString('drp_quarter_prev_current');
                var currentQ = this._getCurrentQuarter();
                dateTo = currentQ.dateTo;
                dateFrom = currentQ.dateFrom;
                dateFrom.setMonth(dateFrom.getMonth() - 3);
            }
            break;
            case "year-prev-current":
            {
                this._text = ibx.resourceMgr.getString('drp_year_prev_current');
				dateTo = new Date(now.getFullYear(), 11, 31);
                dateFrom = new Date(now.getFullYear(), 11, 1);
                dateFrom.setMonth(dateFrom.getMonth() - 23);
            }
            break;
            case "year-current":
            {
                this._text = ibx.resourceMgr.getString('drp_year_current');
				dateFrom = new Date(now.getFullYear(), 0, 1);
				dateTo = new Date();
            }
            break;
            case "quarter-last-5":
            {
                this._text = ibx.resourceMgr.getString('drp_quarter_last_5');
                var currentQ = this._getCurrentQuarter();
                dateTo = currentQ.dateTo;
                dateFrom = currentQ.dateFrom;
                dateFrom.setMonth(dateFrom.getMonth() - 12);
            }
            break;
            case "quarter-last-9":
            {
                this._text = ibx.resourceMgr.getString('drp_quarter_last_9');
                var currentQ = this._getCurrentQuarter();
                dateTo = currentQ.dateTo;
                dateFrom = currentQ.dateFrom;
                dateFrom.setMonth(dateFrom.getMonth() - 24);
            }
            break;
            case "month-prev-13":
            {
                this._text = ibx.resourceMgr.getString('drp_month_prev_13');
                dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFrom.setMonth(dateFrom.getMonth() - 12);
                dateTo = new Date(now.getFullYear(), now.getMonth(), 1);
                dateTo.setMonth(dateTo.getMonth() + 1);
                dateTo = new Date(dateTo - 1);
            }
            break;
            case "month-prev-25":
            {
                this._text = ibx.resourceMgr.getString('drp_month_prev_25');
                dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFrom.setMonth(dateFrom.getMonth() - 24);
                dateTo = new Date(now.getFullYear(), now.getMonth(), 1);
                dateTo.setMonth(dateTo.getMonth() + 1);
                dateTo = new Date(dateTo - 1);
            }
            break;
            case "year-prior":
            {
                this._text = ibx.resourceMgr.getString('drp_year_prior');
				dateFrom = new Date(now.getFullYear()-1, 0, 1);
                dateTo = new Date();
                dateTo.setMonth(dateTo.getMonth() - 12);
            }
            break;
            case "days-last-7":
            {
                this._text = ibx.resourceMgr.getString('drp_days_last_7');
                dateFrom = new Date();
                dateFrom.setDate(dateFrom.getDate() - 6);
                dateTo = new Date();
            }
            break;
			case "days-last-30":
			{
                this._text = ibx.resourceMgr.getString('drp_days_last_30');
                dateFrom = new Date();
                dateFrom.setDate(dateFrom.getDate() - 29);
                dateTo = new Date();
			}
			break;
		}
		var df = $.datepicker.formatDate("MM d, yy", dateFrom);
		var dt = $.datepicker.formatDate("MM d, yy", dateTo)
		this._date.ibxWidget('option', 'dateTo', dt);
        this._date.ibxWidget('option', 'dateFrom', df);
        this._trigger("change", null, { 'dateFrom': df, 'dateTo': dt, "text": this._text, "userValue": userValue});
        this.close();
        this.element.find(".drp-control-wrapper").hide();
    },
    _getCurrentQuarter: function ()
    {
        var now = new Date();
        var qStartOffset;
        var qEndOffset;

        switch(now.getMonth())
        {
            case 0: 
            case 3:
            case 6:
            case 9:
                qStartOffset = 0; qEndOffset = 2; break;
            case 1:
            case 4:
            case 7:
            case 10:
                qStartOffset = 1; qEndOffset = 1; break;
            case 2:
            case 5:
            case 8:
            case 11:
                qStartOffset = 2; qEndOffset = 0; break;
        }

        dateFrom = new Date(now.getFullYear(), now.getMonth(), 1); // start or current month
        dateTo = new Date(now.getFullYear(), now.getMonth(), 1);
        dateTo.setMonth(dateTo.getMonth() + 1);
        dateTo.setDate(dateTo.getDate() - 1); // end of current month

        dateFrom.setMonth(dateFrom.getMonth() - qStartOffset);
        dateTo.setMonth(dateTo.getMonth() + qEndOffset);

        return {"dateFrom": dateFrom, "dateTo": dateTo};
    },
    getText: function (bUpdate)
    {
        if (bUpdate)
            this._outDate();
        return this._text;
    },
    getDateControl: function ()
    {
        return this._date;
    },
});

//# sourceURL=daterangepicker.js
