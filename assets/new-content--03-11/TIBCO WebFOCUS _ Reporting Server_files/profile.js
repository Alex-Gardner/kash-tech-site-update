/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/

const dfProfiler = {
    _widgetMap: {},
    startWidgetCreationProfiling () {
        if (this._oldCreateWidget)
            this._stopWidgetCreationProfiling();
        const widgetMap = this._widgetMap = {};
        window.localStorage.removeItem("widgetCreationProfiling");
        const oldCreateWidget = this._oldCreateWidget = $.ibi.ibxWidget.prototype._createWidget;
        $.ibi.ibxWidget.prototype._createWidget = function (...args){
            const widgetFullName = this.widgetFullName || "unknown";
            if (!widgetMap[widgetFullName])
                widgetMap[widgetFullName] = {count: 0, time: 0};
            const entry = widgetMap[widgetFullName];
            entry.count++;
            const timeStart = Date.now();
            const ret = oldCreateWidget.apply(this, args);
            entry.time += (Date.now() - timeStart);
            return ret;
        }
    },
    stopWidgetCreationProfiling (){
        if (this._oldCreateWidget){
            $.ibi.ibxWidget.prototype._createWidget = this._oldCreateWidget;
            this._oldCreateWidget = null;
        }
    },
    saveWidgetCreationProfiling (){
        window.localStorage.setItem("widgetCreationProfiling", JSON.stringify(this._widgetMap));
    },
};


