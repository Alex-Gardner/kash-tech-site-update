/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.2 $:
//////////////////////////////////////////////////////////////////////////
function PortalUtil()
{
}

PortalUtil.dispatch = function dispatch ()
{
    var action = arguments[0][0];

    switch (action)
    {
        default:
            return false;
        case 'drillRefresh':
            return PortalUtil.drillRefresh.apply(null, arguments);
    }
};

PortalUtil.drillRefresh = function drillRefresh()
{
    var scope = arguments[0][1];
    switch(scope)
    {
        default:
            return false;
        case 'self':
            return PageUtil.drillRefresh.apply(null, arguments);
    }
};

//# sourceURL=portalutil.js
