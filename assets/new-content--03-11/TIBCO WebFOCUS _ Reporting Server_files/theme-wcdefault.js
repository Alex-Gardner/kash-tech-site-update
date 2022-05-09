/*------------------------------------------------------------------
* Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.
*
* _Name_        ===> ace/theme-wcdefault.js
* _Description_ ===>
*
* _History_:
*  Date  Time Who Proj       Project Title
* ====== ==== === ====== ===========================================
* 190708 1249 dpd 214926 Text Editor: diff / merge tool
* 190415 1736 dpd 212545 Text Editor: use editor to view trace files
* 181011 1130 dpd 207711 Edaprint viewer to enhanced with editor features
* 180913 1735 dpd 204738 IBX:Text editor
* 180913 1044 dpd 204738 IBX:Text editor
*
* END %&$
*-------------------------------------------------------------------*/

ace.define("ace/theme/wcdefault",[], function(require, exports, module) {
"use strict";

exports.isDark = false;
exports.cssClass = "ace-wcdefault";
exports.cssText = ".ace-wcdefault .ace_gutter {\
background: #f0f0f0;\
color: #333;\
}\
.ace-wcdefault .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-wcdefault .ace_fold {\
background-color: #6B72E6;\
}\
.ace-wcdefault {\
background-color: #FFFFFF;\
color: black;\
}\
.ace-wcdefault .ace_cursor {\
color: black;\
}\
.ace-wcdefault .ace_invisible {\
color: rgb(191, 191, 191);\
}\
.ace-wcdefault .ace_storage,\
.ace-wcdefault .ace_keyword {\
color: blue;\
}\
.ace-wcdefault .ace_constant {\
color: rgb(197, 6, 11);\
}\
.ace-wcdefault .ace_constant.ace_buildin {\
color: rgb(88, 72, 246);\
}\
.ace-wcdefault .ace_constant.ace_language {\
color: rgb(88, 92, 246);\
}\
.ace-wcdefault .ace_constant.ace_library {\
color: rgb(6, 150, 14);\
}\
.ace-wcdefault .ace_invalid {\
background-color: rgba(255, 0, 0, 0.1);\
color: red;\
}\
.ace-wcdefault .ace_support.ace_function {\
color: rgb(60, 76, 114);\
}\
.ace-wcdefault .ace_support.ace_constant {\
color: rgb(6, 150, 14);\
}\
.ace-wcdefault .ace_support.ace_type,\
.ace-wcdefault .ace_support.ace_class {\
color: rgb(109, 121, 222);\
}\
.ace-wcdefault .ace_keyword.ace_operator {\
color: rgb(104, 118, 135);\
}\
.ace-wcdefault .ace_string {\
color: rgb(1, 97, 8);\
}\
.ace-wcdefault .ace_comment {\
color: rgba(20, 125, 29, 0.77);\
}\
.ace-wcdefault .ace_comment.ace_doc {\
color: rgb(0, 102, 255);\
}\
.ace-wcdefault .ace_comment.ace_doc.ace_tag {\
color: rgb(128, 159, 191);\
}\
.ace-wcdefault .ace_constant.ace_numeric {\
color: rgb(0, 0, 205);\
}\
.ace-wcdefault .ace_variable {\
color: rgb(144,95,3);\
}\
.ace-wcdefault .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-wcdefault .ace_entity.ace_name.ace_function {\
color: #0000A2;\
}\
.ace-wcdefault .ace_heading {\
color: rgb(12, 7, 255);\
}\
.ace-wcdefault .ace_sql {\
color:rgb(185, 6, 144);\
}\
.ace-wcdefault .ace_timestamp {\
color: blue;\
}\
.ace-wcdefault .ace_component {\
color:rgb(185, 6, 144)\
}\
.ace-wcdefault .ace_edaprint_inf {\
color: #669900;\
}\
.ace-wcdefault .ace_edaprint_warning {\
background: #CCFFCC;\
color: #FF6600;\
font-weight: bold;\
}\
.ace-wcdefault .ace_edaprint_error {\
background: #FFCCFF;\
color: red;\
font-weight: bold;\
}\
.ace-wcdefault .ace_meta.ace_tag {\
color:rgb(0, 22, 142);\
}\
.ace-wcdefault .ace_string.ace_regex {\
color: rgb(255, 0, 0)\
}\
.ace-wcdefault .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-wcdefault.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px white;\
}\
.ace-wcdefault .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-wcdefault .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-wcdefault .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-wcdefault .ace_marker-layer .ace_active-line {\
background: #fef590;\
}\
.ace-wcdefault .ace_gutter-active-line {\
background-color : #dcdcdc;\
}\
.ace-wcdefault .ace_marker-layer .ace_selected-word {\
background: rgb(250, 250, 255);\
border: 1px solid rgb(200, 200, 250);\
}\
.ace-wcdefault .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
}\
.acediff__wrap {\
	display: -webkit-box;\
	display: -ms-flexbox;\
	display: flex;\
	-webkit-box-orient: horizontal;\
	-webkit-box-direction: normal;\
	-ms-flex-direction: row;\
	flex-direction: row;\
	position: absolute;\
	bottom: 0;\
	top: 0;\
	left: 0;\
	height: 100%;\
	width: 100%;\
	overflow: auto\
}\
.ace-wcdefault .acediff__gutter {\
	-webkit-box-flex: 0;\
	-ms-flex: 0 0 60px;\
	flex: 0 0 60px;\
	border-left: 1px solid #bcbcbc;\
	border-right: 1px solid #bcbcbc;\
	overflow: hidden\
}\
.ace-wcdefault .acediff__gutter,\
.ace-wcdefault .acediff__gutter svg {\
	background-color: #efefef\
}\
.acediff__left,\
.acediff__right {\
	height: 100%;\
	-webkit-box-flex: 1;\
	-ms-flex: 1;\
	flex: 1\
}\
.ace-wcdefault .acediff__diffLine {\
	background-color: #d8f2ff;\
	border-top: 1px solid #a2d7f2;\
	border-bottom: 1px solid #a2d7f2;\
	position: absolute;\
	z-index: 4\
}\
.ace-wcdefault .acediff__diffLine.targetOnly {\
	height: 0!important;\
	border-top: 1px solid #a2d7f2;\
	border-bottom: 0;\
	position: absolute\
}\
.ace-wcdefault .acediff__connector {\
	fill: #d8f2ff;\
	stroke: #a2d7f2\
}\
.acediff__copy--left,\
.acediff__copy--right {\
	position: relative\
}\
.ace-wcdefault .acediff__copy--left div,\
.ace-wcdefault .acediff__copy--right div {\
	color: #000;\
	text-shadow: 1px 1px hsla(0, 0%, 100%, .7);\
	position: absolute;\
	margin: 2px 3px;\
	cursor: pointer\
}\
.ace-wcdefault .acediff__copy--right div:hover {\
	color: #004ea0\
}\
.acediff__copy--left {\
	float: right\
}\
.acediff__copy--left div {\
	right: 0\
}\
.ace-wcdefault .acediff__copy--left div:hover {\
	color: #c98100\
}\
";
exports.$id = "ace/theme/wcdefault";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
                (function() {
                    ace.require(["ace/theme/wcdefault"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            
