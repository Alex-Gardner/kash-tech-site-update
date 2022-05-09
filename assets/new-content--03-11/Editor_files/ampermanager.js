/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.28 $:
/* global Ibfs, SharedUtil, WFGlobals, WFDescribe */

function ibxAmperManager(context, sesAuthParm, sesAuthVal, ibfs) {
    this._ibfs = ibfs;
    this._WFDescribeList = new Map();
    this._deferredList = new Map();
    this._ampers = [];
    this._context = context;
    this._sesAuthParm = sesAuthParm;
    this._sesAuthVal = sesAuthVal;
    this._timeZoneOverride = '';
    if (!ibfs)
        Ibfs.load(context, sesAuthParm, sesAuthVal).done(() => this._ibfs = new Ibfs(context, sesAuthParm, sesAuthVal, { 'errorHandling': false }));
}

var _p = ibxAmperManager.prototype;

_p.setTimeZoneOverride = function (timeZoneOverride) {
    this._timeZoneOverride = timeZoneOverride;
}

_p.getTimeZoneOverride = function () {
    return this._timeZoneOverride;
}

_p.getTimeZoneCount = function () {
    const ampers = [];
    this._ampers.map(amper => {
        if (amper.bound && amper.info.isDateTime)
            ampers.push(amper);
    });
    if (ampers.length === 2 && ampers[0].control && ampers[1].control && ampers[0].control === ampers[1].control)
        return 1;
    else
        return ampers.length;
}

_p.getTimeZoneAmpers = function (){
    const ampers = [];
    this._ampers.map(amper => {
        if (amper.bound && amper.info.isDateTime)
            ampers.push(amper.info);
    });
    return ampers;
}

_p.getTimeZoneFexes = function () {
    const res = [];
    const fexes = new Set();
    const ampers = this.getTimeZoneAmpers();
    for (var i = 0; i < ampers.length; i++) {
        var amperInfo = this.getAmperInfo(ampers[i]);
        if (amperInfo) {
            amperInfo.fexes.forEach(function (_, key) {
                fexes.add(key);
            }.bind(this));
        }
    }
    fexes.forEach(fex => res.push(fex));
    return res;
}

_p.clear = function () {
    this._WFDescribeList = new Map();
    this._deferredList = new Map();
    this._ampers = [];
};

_p.removeWFDescribe = function (path) {
    this._WFDescribeList.delete(path);
};

_p.addWFDescribe = function (path, describe) {
    this._WFDescribeList.set(path, describe);
};

_p.checkWFDescribe = function (path) {
    return this._WFDescribeList.has(path);
};

_p.getWFDescribe = function (path) {
    return this._WFDescribeList.get(path);
};

_p.getWFDescribeList = function () {
    return this._WFDescribeList;
}

_p.addDeferred = function (path, deferred) {
    this._deferredList.set(path, deferred);
};

_p.removeDeferred = function (path) {
    this._deferredList.delete(path);
};

_p.isPending = function (path) {
    return this._deferredList.has(path);
};

_p.getDeferred = function (path) {
    return this._deferredList.get(path);
};

_p.describeFex = function (info) {

    if (info.isAutoprompt && info.describe) {
        let deferred = $.Deferred();
        const doc = (new DOMParser()).parseFromString(info.describe, "text/xml");
        const wfDescribe = new WFDescribe(this._context, WFGlobals ? WFGlobals.language : "");
        wfDescribe.load(doc, true);
        this._addAmpers(info.path, wfDescribe, info.replace);
        this.addWFDescribe(info.path, wfDescribe);
        info.wfDescribe = wfDescribe;
        deferred.resolve(info);
        return deferred;
    }

    if (!this.isPending(info.path) && (info.update || !this.checkWFDescribe(info.path))) {
        const deferred = $.Deferred();
        this.addDeferred(info.path, deferred);
        const doubleAmpers = [];
        if (info.doubleAmpers) {
            for (var i = 0; i < info.doubleAmpers.length; i++) {
                var doublAmpersEntry = info.doubleAmpers[i];
                if (doublAmpersEntry.path == info.path) {
                    doubleAmpers.push({ "amperName": doublAmpersEntry.amperName, "doubleAmperName": doublAmpersEntry.doubleAmperName });
                }
            }
        }
        const ret = this._ibfs.describeFex(info.realPath, doubleAmpers, !SharedUtil.isLazyLoading());
        ret.deferred.done(function (info, exInfo) {
            const document = exInfo.result;
            const wfDescribe = new WFDescribe(this._context, WFGlobals ? WFGlobals.language : "");
            wfDescribe.load(document, true);
            this._addAmpers(info.path, wfDescribe, info.replace);
            this.addWFDescribe(info.path, wfDescribe);
            info.wfDescribe = wfDescribe;
            const deferred = this.getDeferred(info.path);
            this.removeDeferred(info.path);
            deferred.resolve(info);
        }.bind(this, info));
        ret.deferred.always(function (info) {
            deferred.resolve(info);
        });
        return deferred;
    }
    else {
        if (this.isPending(info.path))
            return this.getDeferred(info.path);
        else {
            const deferred = $.Deferred();
            deferred.resolve(info);
            return deferred;
        }
    }
};

_p.removeAmperFexes = function (fexes) {
    for (var i = 0; i < fexes.length; i++) {
        var fex = fexes[i];

        for (var j = 0; j < this._ampers.length; j++) {
            var amper = this._ampers[j];
            amper.fexes.delete(fex);
        }
    }
};

_p.removeFex = function (path) {
    this.removeWFDescribe(path);
    for (var i = this._ampers.length - 1; i >= 0; i--) {
        var amper = this._ampers[i];
        amper.fexes.delete(path);
        if (amper.fexes.size == 0) {
            var removed = this._ampers.splice(i, 1);
            if (removed[0].dummyPanel)
                removed[0].dummyPanel.remove();
        }
    }

    this._fixChains();
};

_p._addAmpers = function (path, wfDescribe, replace) {
    var chainMap = wfDescribe.getChainMap();
    for (var key in chainMap) {
        var chainInfo = chainMap[key];
        var fields = chainInfo.fields;
        for (var i = 0; i < fields.length; i++) {
            var amperInfo = fields[i];
            this._addAmper(path, wfDescribe, amperInfo, replace);

        }
    }

    this._fixChains();
};

_p._fixChains = function () {
    this._ampers.map(amper => {
        if (amper.info.chainParent) {
            const chainParent = this.findChainParentAmper(amper.info.chainParent);
            if (!chainParent) {
                const parentAmper = this._ampers.find(innerAmper => this._isSameAmper(innerAmper.info, amper.info.chainParent));
                if (parentAmper) {
                    amper.info.chainParent = parentAmper.info;
                    if (amper.bound && amper.widget)
                        amper.widget.setChainParent(parentAmper.widget);
                }
                else {
                    // De facto orphan
                    amper.info.chainParent = null;
                    amper.info.chainIdxIn = -1;
                    if (amper.bound && amper.widget)
                        amper.widget.setChainParent(null);
                }
            }
        }
    });
};

_p.removeOrphanAmpers = function () {
    for (var i = this._ampers.length - 1; i >= 0; i--) {
        var amper = this._ampers[i];
        if (amper.fexes.size == 0) {
            var removed = this._ampers.splice(i, 1);
            if (removed[0].dummyPanel)
                removed[0].dummyPanel.remove();
        }
    }
};

_p._isSameAmper = function (amperInfo1, amperInfo2) {
    // We assume an amper that has the same name, format, and multiselect it's the same
    // even if it comes from different fexes
    return (amperInfo1.name == amperInfo2.name &&
        amperInfo1.format == amperInfo2.format &&
        amperInfo1.multiselect == amperInfo2.multiselect);
};

_p._getAmper = function (amperInfo) {
    for (var i = 0; i < this._ampers.length; i++) {
        var amper = this._ampers[i];
        if (this._isSameAmper(amperInfo, amper.info))
            return amper;
    }

    return null;
};

_p.findAmper = function (name, format, multiselect) {
    for (var i = 0; i < this._ampers.length; i++) {
        var amper = this._ampers[i];
        if (this._isSameAmper(amper.info, { 'name': name, 'format': format, 'multiselect': (null === multiselect) ? amper.info.multiselect : multiselect }))
            return amper;
    }

    return null;
};

_p.isAmperBound = function (amperInfo) {
    for (var i = 0; i < this._ampers.length; i++) {
        var amper = this._ampers[i];
        if (this._isSameAmper(amperInfo, amper.info))
            return amper.bound;
    }
    return false;
}

_p.findChainParentAmper = function (chainParent) {
    for (var i = 0; i < this._ampers.length; i++) {
        var amper = this._ampers[i];
        if (amper.info === chainParent)
            return amper;
    }
    return null;
}

_p.getAmperHierarchyInfo = function (amper) {
    const chainParentAmper = this.findChainParentAmper(amper.info.chainParent);
    return {
        name: amper.info.name,
        format: amper.info.format,
        multiselect: amper.multiselect || amper.info.multiselect,
        parent: chainParentAmper ? {
            name: chainParentAmper.info.name,
            format: chainParentAmper.info.format,
            multiselect: chainParentAmper.multiselect || chainParentAmper.info.multiselect,
        } : null,
    };
}

_p.getAmperInfo = function (amper) {
    for (var i = 0; i < this._ampers.length; i++) {
        if (amper == this._ampers[i].info)
            return this._ampers[i];
    }
    return null;
};

_p.addFexToAmper = function (amper, path) {
    amper.fexes.set(path, true);
};

_p._addAmper = function (path, wfDescribe, amperInfo, replace) {
    var foundAmper = this._getAmper(amperInfo);
    if (foundAmper) {
        if (replace) {
            if (foundAmper.bound && foundAmper.widget) {
                if (foundAmper.info == foundAmper.widget.options.amper) {
                    foundAmper.widget.options.amper = amperInfo;
                    foundAmper.widget.options.wfDescribe = wfDescribe;
                }
                else if (foundAmper.info == foundAmper.widget.options.amper1) {
                    foundAmper.widget.options.amper1 = amperInfo;
                    foundAmper.widget.options.wfDescribe1 = wfDescribe;
                }
                else if (foundAmper.info == foundAmper.widget.options.amper2) {
                    foundAmper.widget.options.amper2 = amperInfo;
                    foundAmper.widget.options.wfDescribe2 = wfDescribe;
                }
                foundAmper.widget.chainChange();
            }
            foundAmper.wfDescribe = wfDescribe;
            foundAmper.info = amperInfo;
        }
        this.addFexToAmper(foundAmper, path);
    }
    else {
        var amper = {};
        amper.bound = null;
        amper.info = amperInfo;
        amper.wfDescribe = wfDescribe;
        amper.fexes = new Map();
        amper.fexes.set(path, true);
        this._ampers.push(amper);
    }
};

_p.getAllAmpers = function () {
    return this._ampers;
};

_p.getUnboundAmpers = function () {
    var ampers = [];
    for (var i = 0; i < this._ampers.length; i++) {
        var amper = this._ampers[i];
        if (!amper.bound)
            ampers.push(amper);
    }
    return ampers;
};

_p.getUnboundAmpersCount = function () {
    var count = 0;
    for (var i = 0; i < this._ampers.length; i++) {
        var amper = this._ampers[i];
        if (!amper.bound)
            count++;
    }
    return count;
};

_p.getAmperNames = function (path) {
    var ampers = [];
    for (var i = 0; i < this._ampers.length; i++) {
        var amper = this._ampers[i];
        if (amper.fexes.has(path))
            ampers.push(amper.info.name);
    }
    return ampers;
};

_p.getAmpersForPath = function (path) {
    var ampers = [];
    for (var i = 0; i < this._ampers.length; i++) {
        var amper = this._ampers[i];
        if (amper.fexes.has(path))
            ampers.push(amper);
    }
    return ampers;
};

_p._patchTimeZone = function (val, amperInfo) {
    if (amperInfo.defValue !== val && val !== "_FOC_NULL" && amperInfo.isDateTime){
        const timeZone = this._timeZoneOverride ? `${this._timeZoneOverride === 'none' ? '' : `@${this._timeZoneOverride}`}` : (amperInfo.hasTimeZone ? `@${amperInfo.timeZone}` : '');
        let timePart = amperInfo.timePart || amperInfo.addedTimePart || "00:00:00.000";
        return `${val} ${timePart}${timeZone}`;
    }
    else
        return val;
}

_p.getBoundAmperObject = function (path, asArray) {
    var amperObject = {};
    for (var i = 0; i < this._ampers.length; i++) {
        var amper = this._ampers[i];
        // Only process bound ampers
        if (!amper.bound)
            continue;
        // Dont' send the amper if no value, or the value is the same as the default
        // Send it when there's a user value set as default and it's different than the real default (isDefUserValue is true)
        let focValue = this._patchTimeZone(amper.info.focValue, amper.info);
        const defValue = WFDescribe.getStringValue(amper.info, amper.info.defValue);
        if (SharedUtil.isLazyLoading() && !focValue && defValue)
            focValue = defValue;
        if (!focValue || (!amper.info.isDefUserValue && defValue === focValue))
            continue;

        if (amper.fexes.has(path)) {
            if (asArray && amper.info.curValue instanceof Array) {
                amper.info.curValue.forEach(function (val) {
                    amperObject[this.IBIencode(amper.info.name)] = this.IBIencode(this._patchTimeZone(val, amper.info));
                }.bind(this));
            }
            else
                amperObject[this.IBIencode(amper.info.name)] = this.IBIencode(focValue);
        }
    }
    return amperObject;
};

_p.getBoundAmpersString = function (path, asArray) {
    var amperString = "";
    for (var i = 0; i < this._ampers.length; i++) {
        var amper = this._ampers[i];
        // Only process bound ampers
        if (!amper.bound)
            continue;
        // Dont' send the amper if no value, or the value is the same as the default
        // Send it when there's a user value set as default and it's different than the real default (isDefUserValue is true)
        let focValue = this._patchTimeZone(amper.info.focValue, amper.info);
        const defValue = WFDescribe.getStringValue(amper.info, amper.info.defValue);
        if (SharedUtil.isLazyLoading() && !focValue && defValue)
            focValue = defValue;
        if (!focValue || (!amper.info.isDefUserValue && defValue === focValue))
            continue;

        if (amper.fexes.has(path)) {
            if (asArray && amper.info.curValue instanceof Array) {
                amper.info.curValue.forEach(function (val) {
                    amperString += '&' + this.IBIencodeURI(amper.info.name) + '=' + this.IBIencodeURI(this._patchTimeZone(val, amper.info));
                }.bind(this));
            }
            else
                amperString += '&' + this.IBIencodeURI(amper.info.name) + '=' + this.IBIencodeURI(focValue);
        }
    }
    return amperString;
};

_p.restore = function (serialization) {
    const hier = JSON.parse(serialization);
    hier.map(amperHier => {
        const amper = this.findAmper(amperHier.name, amperHier.format, amperHier.multiselect);
        if (amper) {
            const parent = amperHier.parent;
            amper.options = amperHier.options;
            if (parent) {
                const parentAmper = this.findAmper(parent.name, parent.format, parent.multiselect);
                amper.info.chainParent = parentAmper ? parentAmper.info : null;
            }
            else
                amper.info.chainParent = null;
            amper.info.chainIdxIn = amper.info.chainParent ? 1 : 0;
        }
    });
};


/* Jira PD-258 and PD-257 */
_p.IBIencodeURI = function (str) {
    if (str !== null) {
        str = escape(str);
        str = str.replace(/%u/g, '%25u').replace(/%([89A-F])/g, '%25u00$1');
        str = unescape(str);
        str = encodeURIComponent(str);
    }

    return str;
};

/* Jira PD-788  The following function is for POST method */
_p.IBIencode = function (str) {
    if (str !== null) {
        str = escape(str);
        str = str.replace(/%u/g, '%25u').replace(/%([89A-F])/g, '%25u00$1');
        str = unescape(str);
    }

    return str;
};

//# sourceURL=ampermanager.js