function gainSightsLogger() {
	
};

//eventName: 'Designer Drop-Down Navigation' - is the name of an event.
//eventParameters: {"Action type" : action, "Another Parameter": value .... } - json object with as many parameters as needed (name-value).
gainSightsLogger.prototype.logEvent = function (eventName, eventParameters) {
	trackGainSightCustomEvent(eventName, eventParameters);
};

//eventName: 'Designer Drop-Down Navigation' - is the name of an event.
//feature - <string> the name of the feature (designer, home page etc)
//subFeature - <string> the of the sub feature (whatever part of the designer or home page it covers)
//logParams - <object> optional additional parameters  {name1: value1, name2:value2 .... }
gainSightsLogger.prototype.logFeature = function logFeature(eventName, feature, subFeature, logParams) {
	trackFeatureAndSubFeature(eventName, feature, subFeature, logParams);
};