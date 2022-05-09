/*------------------------------------------------------------------
* Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.
*
* _Name_        ===> ace/mode-master.js
* _Description_ ===>
*
* _History_:
*  Date  Time Who Proj       Project Title
* ====== ==== === ====== ===========================================
* 190207 1530 dpd 209887 Text editor: Phase 2 epic
* 181231 1405 skc 210100 wcf: create calculator resource bundle
* 181017 1640 dpd 204738 WCF:Text editor
* 181012 1559 dpd 204738 IBX:Text editor
* 181011 1052 dpd 204738 IBX:Text editor
* 180913 1735 dpd 204738 IBX:Text editor
* 180905 1453 dpd 204738 IBX:Text editor
* 180829 1112 dpd 204738 IBX:Text editor
* 180824 1712 dpd 204738 IBX:Text editor
* 180823 1055 dpd 204738 IBX:Text editor
* 180822 1609 dpd 204738 IBX:Text editor
* 180815 1657 dpd 204738 IBX:Text editor
* 180813 1745 dpd 204738 IBX:Text editor
* 180810 1700 dpd 204738 IBX:Text editor
* 180808 1709 dpd 204738 IBX:Text editor
* 180806 1739 dpd 204738 IBX:Text editor
* 180803 1634 dpd 204738 IBX:Text editor
* 180802 1116 dpd 204738 IBX:Text editor
*
* END %&$
*-------------------------------------------------------------------*/

/*
 * Copyright (c) 2010, Ajax.org B.V. * 
 * Redistributions of source code must retain the above copyright
 * Redistributions in binary form must reproduce the above copyright  
 * The Ace source code is hosted on GitHub and released under the BSD license 
 * https://ace.c9.io/
 */

function WcMasEditMasterKeywords(keygroup) {
    var kwords = {
      "keywords" : "ACCESS|ACCESSFILE|ACTUAL|ALIAS|CAPTION|CAPTION_|CODEPAGE|CRFILE|CRFILENAME|CRKEY|CRSEGNAME|CRSEGMENT|CURRENCY|DATASET|DESC|DEFCENT|DEFINITION|DESCRIPTION|DESC|DFC|DIMENSION|ELEMENTS|FDEFCENT|FDFC|FIELD|FIELDNAME|FILENAME|FOLDER|FORMAT|FYRTHRESH|GROUP|GROUPNAME|HELPMESSAGE|HIERARCHY|HRY_DIMENSION|MEASGRPDIM|MEASURE_GROUP|MEASUREGROUP|MESSAGE|MFD_PROFILE|OCCURS|SEGCOUNT|OCCURS_SEGLEN|PARENT|PARENT_FIELD|POSITION|REFERENCE|REMARKS|SEGMENT|SEGNAME|SEGMENT|SEGREF|SEGREFNAME|SEGSUFFIX|STARTFIELD|SUFFIX|SYNONYM|TABDESCRIP|TITLE|TITLE_|TRANS_FILE|USAGE|VIEW_OF|VKEY|WITHIN|XDEFAULT|YRTHRESH|LASTFIELD|ENDFIELD|BELONGS_TO_SEGMENT|STYLE|USE_STYLE|KPI|KPI_STATUS_ICON|KPI_TREND_ICON|PROMPT|DEFAULT|CRTAG|NAME|END",

    // keys that only take quoted str as value
      "qKeywords" : "DATEPATTERN",

      "simpleValKeywords" : "PROPERTY|DV_ROLE|TEMPORAL_PROPERTY|GEOGRAPHIC_ROLE|CURRENCY_DISPLAY|CURRENCY_ISO_CODE",

      "segtypeKeys" : "SEGTYPE",
      "segtypeVals" : "S|U|SH|KU|KM|KL|KLU|DKU|DKM|DKL|DKLU",

      "fieldtypeKeys" : "FIELDTYPE|INDEX",
      "fieldtypeVals" : "INDEX|I|R|IR|RI|Y|N",

      "missingDef" : "MISSING",
      "missingVals" : "DATA|PRESENT|IS|NEEDS|ON|OFF|SOME|ALL|ALWAYS",

      // keywords that only take ON or OFF as their value
      "onoffKeys" : "QUOTED|REVERSE_SIGN|BV_NAMESPACE|ENCRYPT|MISSING",
      "onoffVals" : "ON|OFF",

      "yesnoKeys" : "MANDATORY|DV_INCLUDE",
      "yesnoVals" : "YES|NO|Y|N",
 
      "andorKeys" : "SELECTOP",
      "andorVals" : "AND|OR",

      "selectKeys" : "SELECT", 
      "selectVals" : "MULTI|SINGLE",

      "rollupKeys" : "ROLLUP_BY_VISUALTOTALS", 
      "rollupVals" : "DEFAULT|ON|OFF",

      "jointypeKeys" : "CRJOINTYPE|JOIN_TYPE", 
      "jointypeVals" : "LEFT_OUTER|FULL_OUTER|RIGHT_OUTER|INNER",

      "byteorderKeys" : "BYTEORDER",
      "byteorderVals" : "BE|LE",

      "hrystructureKeys" : "HRY_STRUCTURE",
      "hrystructureVals" : "STANDARD|RECURSIVE",

      "iotypeKeys" :  "IOTYPE",
      "iotypeVals" : "BINARY|STREAM",

      "crincludeKeys" : "CRINCLUDE",
      "crincludeVals" : "ALL|NONE",

      "dimtypeKeys" : "DIM_TYPE",
      "dimtypeVals" : "TIME|CURRENCY|SCENARIO|QUANTITATIVE|ACCOUNTS|CUSTOMERS|PRODUCTS|UTILITY|RATES|CHANNEL|PROMOTION|ORGANIZATION|BILL_OF_MATERIALS|GEOGRAPHY",

      "accessPropKeys" : "ACCESS_PROPERTY",

      "accessPropVals" : "NEED_VALUE|INTERNAL|VALUE|RANGE|AUTHRESP|AUTHTOKEN|MULTIVALUES|ARRAY_ITEM|ENCRYPTED|AUTHUSER|AUTHPSWD",

      //keywords that start expression definitions: KEYWORD ident=exp; 
      "define" : "DEFINE|COMPUTE|VALIDATE|FILTER",

       "defineBeforeEqKeyList" : "REDEFINES|YRTHRESH|YRT|WITH|DEFCENT|DFC|MISSING|CURRENCY|TITLE|TITLE_|DEFINITION|DESCRIPTION|DESC|DESC_|INPUTFIELD|XDEFAULT|TEMPORAL_PROPERTY|CURRENCY_DISPLAY|CURRENCY|CURRENCY_ISO_CODE|MANDATORY",
       "defineBeforeEqKeyVals" : "SOME|DATA|IS|PRESENT|ALL|ALWAYS|ON|NEEDS|OFF|YES|NO",

      // VARIABLE NAME=xxx, key2=val, ...
      "variable" : "VARIABLE",

      // JOINWHERE = exp,
      "joinwhere" : "JOIN_WHERE|SUB_QUERY",

      // SORTOBJ XXX = .... ,
      "sortobj" : "SORTOBJ",

      "acceptKeys" : "ACCEPT|ACCEPTS|ACCEPTABLE",
      "acceptRhsKeys" : "DECODE|FOCEXEC|FIND|SYNONYM|IN|TO|OR|AS|END|MISSING|NA",
        // to do: begin/end style

        // DBA section
      "dbaKeywords" : "DBA|DBAFILE|FILENAME|USER|PASS|NAME|VALUE|END",
      "dbaKeywordsAccess" :"ACCESS",
      "dbaKeywordsRestrict" :"RESTRICT",
      "dbaKeywordsAccess_vals" : "R|U|W|RW",
      "dbaKeywordsRestrict_vals" : "FIELD|SEGMENT|SAME|VALUE|VALUE_WHERE|NOPRINT",
    };

    kwords["defineParDefKeys"] = kwords["defineBeforeEqKeyList"] + "|" + 
         "GEOGRAPHIC_ROLE|AGGREGATABLE";
    kwords["defineBeforeEqKeys"] = kwords["defineBeforeEqKeyList"] + "|" + 
                                   kwords["defineBeforeEqKeyVals"];  

    if (keygroup)
      return(kwords[keygroup]);
    else
      return(kwords);    
};

ace.define("ace/mode/master", function(require, exports, module) {
    var oop = require("ace/lib/oop");
    var TextMode = require("ace/mode/text").Mode;
    var MasterFoldMode = require("ace/mode/folding/master_folding").FoldMode;
    var MasterHighlightRules = require("ace/mode/master_highlight_rules").MasterHighlightRules;
    var langTools = require("ace/ext/language_tools");
    var MasterCompletions = require("ace/mode/master_completions").MasterCompletions;

    var Mode = function() {
        this.HighlightRules = MasterHighlightRules;
        this.foldingRules = new MasterFoldMode;
        this.$completer = new MasterCompletions
   };
    oop.inherits(Mode, TextMode);
    (function() {
        this.lineCommentStart = "-*";
        
        this.getCompletions = function(state, session, pos, prefix, callback) {
            return this.$completer.getCompletions(state, session, pos, prefix, callback)
        }
    }).call(Mode.prototype);
    exports.Mode = Mode
});
ace.define("ace/mode/master_completions", ["require", "exports", "module", "ace/token_iterator"], function(require, exports, module) {
        var MasterCompletions = function() {};

        var mk = WcMasEditMasterKeywords();
        var fk  = WcFexEditFuncKeywords();

        var keywordsMasterGeneral = mk["keywords"] + "|" +
             mk["qKeywords"] +  "|" + mk["simpleValKeywords"] + "|" + 
             mk["segtypeKeys"] + "|" +  mk["fieldtypeKeys"] + "|" +  
             mk["missingDef"] + "|" + mk["onoffKeys"] + "|" + 
             mk["yesnoKeys"] + "|" +  mk["andorKeys"] + "|" + 
             mk["selectKeys"]+ "|" +
             mk["dimtypeKeys"] + "|" + mk["accessPropKeys"]  + "|" + 
             mk["rollupKeys"] + "|" + mk["jointypeKeys"]  + "|" +
             mk["byteorderKeys"] + "|" + mk["hrystructureKeys"]  + "|" + 
             mk["iotypeKeys"] + "|" + mk["crincludeKeys"] + "|" +
             mk["define"] + "|" +mk["variable"] + "|" + 
             mk["joinwhere"] + "|"+ 
             mk["sortobj"] + "|" + mk["acceptKeys"];

        var dbaKeywordsGeneral = mk["dbaKeywords"] + "|" + mk["dbaKeywordsAccess"]  + "|" + mk["dbaKeywordsRestrict"];

        var exprKeys = fk["operators"] + "|" + fk["exprLogic"] + "|" + fk["functions"];

     var stateKeys = {
      //state           : [ valid keywords/idents,        meta str]
      "start"           : [keywordsMasterGeneral,         "MASTER"],
      "dimtypeVal"      : [mk["dimtypeVals"],             "DIM_TYPE"],
      "expression"      : [exprKeys,             ibx.resourceMgr.getString('aceeditor.expression')],
      "acceptKeysRhs"   : [mk["acceptRhsKeys"],           "ACCEPT"],
      "segtypeVal"      : [mk["segtypeVals"],             "SEGTYPE"],
      "fieldtypeVal"    : [mk["fieldtypeVals"],           "FIELDTYPE"],
      "onoffVal"        : [mk["onoffVals"],               "ON/OFF"],
      "yesnoVal"        : [mk["yesnoVals"],               "YES/NO"],
      "andorVal"        : [mk["andorVals"],               "AND/OR"],
      "selectVal"       : [mk["selectVals"],              "SELECT"],
      "rollupVal"       : [mk["rollupVals"],              "ROLLUP"],
      "jointypeVal"     : [mk["jointypeVals"],            "JOIN_TYPE"],
      "byteorderVal"    : [mk["byteorderVals"],           "BYTEORDER"],
      "hrystructureVal" : [mk["hrystructureVals"],        "HRY_STRUCTURE"],
      "iotypeVal"       : [mk["iotypeVals"],              "IOTYPE"],
      "crincludeVal"    : [mk["crincludeVals"],           "CRINCLUDE"],
      "accessPropVal"   : [mk["accessPropVals"],          "ACCESS_PROPERTY"],
      "accessPropList"  : [mk["accessPropVals"],          "ACCESS_PROPERTY"],
      "accessPropList2thru_n"  : [mk["accessPropVals"],   "ACCESS_PROPERTY"],
      "defineIdent"     : [ibx.resourceMgr.getString('aceeditor.ident'), ""],
      "defineBeforeEq"  : [mk["defineBeforeEqKeys"],      "DEFINE"],
      "defineFormat"    : [mk["defineBeforeEqKeys"],      "DEFINE"],
      "defineEqOnly"    : ["=",                           ""],
      "pardef_opts"     : [mk["defineParDefKeys"],        "DEFINE"],
      "dbaSection"      : [dbaKeywordsGeneral,            "DBA"],
      "dbaAccess"       : [mk["dbaKeywordsAccess_vals"],  "ACCESS"],
      "dbaRestrict"     : [mk["dbaKeywordsRestrict_vals"],  "RESTRICT"],
      "keyVal"          : ["", ""],
      "dbaKeyVal"       : ["", ""],
      "simpleKeyVal"    : ["", ""],
      "pardef_key"      : ["=", ""],
      "pardef_eq"       : ["", ""],
      "valPairEnd"      : ["\,|\,\$", ""]
     };

    (function() {
        this.getCompletions = function(lineStateAtEnd, session, pos, prefix, callback) {
        var lineStateAtCurs = "";
        var metaStr = "";
        var wordList = "";

        if (typeof lineStateAtEnd === "string")
            lineStateAtCurs = lineStateAtEnd;
        else if (lineStateAtEnd[0])
            lineStateAtCurs = lineStateAtEnd[0];
        else
            lineStateAtCurs = "start";

        var ln = session.getLine(pos.row);
        var lnToCrs = ln.slice(0, pos.column);
        if (pos.column < ln.length)  
        {
          // Cursor is not at end. ACE only saves one state per line:
          // the last state, as if cursor were at end of line.
          // Tokenize line only up to cursor to get correct state.

          // ACE tokenizer only works with buffer lines. Save/restore
          // buffer line before/after retokenization
          session.doc.$lines[pos.row] = lnToCrs; 
          session.bgTokenizer.$tokenizeRow(pos.row);
          lineStateAtEnd = session.bgTokenizer.getState(pos.row);
          session.doc.$lines[pos.row] = ln;  // restore orig line
          session.bgTokenizer.$tokenizeRow(pos.row);
          if (typeof lineStateAtEnd === "string")
              lineStateAtCurs = lineStateAtEnd;
          else if (lineStateAtEnd[0])
            lineStateAtCurs = lineStateAtEnd[0];
          else
            lineStateAtCurs = "start";
        }

        var wordListInfo = stateKeys[lineStateAtCurs];
        if (wordListInfo)
        {
          wordList = wordListInfo[0];
          metaStr =  wordListInfo[1];
        }
        else
        {
          wordList = keywordsMasterGeneral;
          metaStr = "MASTER";
        }

        var wordListSorted = wordList.split("|").sort();

        return wordListSorted.map(function(word) {
         return {
                  caption: word,
                  value: word,
                  meta: metaStr,
                  score: Number.MAX_VALUE
              }
          })
        }
    }).call(MasterCompletions.prototype);
    exports.MasterCompletions = MasterCompletions
});

ace.define("ace/mode/master_highlight_rules", function(require, exports, module) {
    var oop = require("ace/lib/oop");
    var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
    var MasterHighlightRules = function() {

        var commentRe =  "(^\\s*-\\*.*$|^\\s*\\$.*$)";

        var stringRe = "('[^']*')+";

        var numericRe = "\\b[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b";

        // to do: more valid chars and qstrs with emebedded spaces
        var defcompNameRe = "[A-Za-z_][A-Za-z0-9_]*";

        var defcompFormatRe = /(\/)(\s*[A-Za-z][A-Za-z0-9\.]*\b)/;

        var mk = WcMasEditMasterKeywords();
        var fk  = WcFexEditFuncKeywords();

        var exprKeys = fk["operators"] + "|" + fk["exprLogic"] + "|" + fk["functions"];

        this.$rules = {
            "start": [
                {
                    token: "comment",
                    regex: commentRe
                }
                ,{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["keywords"] + ")\\b(\\s*\\=\\s*)",
                    next: "keyVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["qKeywords"] + ")\\b(\\s*\\=\\s*)",
                    next: "qKeyVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["simpleValKeywords"] + ")\\b(\\s*\\=\\s*)",
                    next: "simpleKeyVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["segtypeKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "segtypeVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["fieldtypeKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "fieldtypeVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["onoffKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "onoffVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["yesnoKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "yesnoVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["andorKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "andorVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["selectKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "selectVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["rollupKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "rollupVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["jointypeKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "jointypeVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["byteorderKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "byteorderVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["hrystructureKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "hrystructureVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["iotypeKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "iotypeVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["crincludeKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "crincludeVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["dimtypeKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "dimtypeVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["accessPropKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "accessPropVal"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["joinwhere"] + ")\\b(\\s*\\=\\s*)",
                    next: "expression"
                },{
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["acceptKeys"] + ")\\b(\\s*\\=\\s*)",
                    next: "acceptKeysRhs"
                },{
                    token: "keyword",
                    regex: "\\b(" + mk["define"] + ")\\b",
                    next: "defineIdent"
                },{
                    token: "keyword",
                    regex: "\\b(" + mk["sortobj"] + ")\\b",
                    next: "sortobjKeyVal"
                },
                {
                    token: "keyword",
                    regex: "\\b(" + mk["variable"] + ")\\b",
                },
                {
                    token: "keyword",
                    regex: "^\\s*(END)\\s*$",
                    next: "dbaSection"
                },
                {
                    token: ["operator", "comment"],
                    regex: "(\\$)(.*$)"
                },
                {
                    token: "text",
                    regex: "\\s+"
                },{
                    defaultToken: "identifier"
                }
          ],
         "keyVal": [
               {
                    token: "string",
                    regex: stringRe,
                    next: "valPairEnd"
                },
                {
                    token: "constant.numeric",
                    regex: numericRe,
                    next: "valPairEnd"
                },
                {
                    token: "identifier",
                    regex: "[^,]*",   
                    next: "valPairEnd"
                }
          ],
         "qKeyVal": [
                {
                    token: "string",
                    regex: stringRe,
                    next: "valPairEnd"
                }
          ],
         "simpleKeyVal": [
                {
                    token: "string",
                    regex: stringRe,
                    next: "valPairEnd"
                },
                {
                    token: "constant.numeric",
                    regex: "[\\-]?[0-9]+\\b",
                    next: "valPairEnd"
                },
                {
                    token: "identifier",
                    regex: "[^,]+", // to do: [a-zA-z0-9\\-\\.]+   ?
                    next: "valPairEnd"
                }
          ],
          "segtypeVal": [
                {
                    token: ["keyword", "operator"],
                    regex: "\\b(" + mk["segtypeVals"] + ")\\b(\\s*,|\\s*$)",
                    next: "valPairEnd"
                },
                {
                    token: "keyword",
                    regex: "\\b(" + "S" + "\\&\\&" + "[^,]+" + ")\\b\\s*",
                    next: "valPairEnd"
                },
                {
                    token: "keyword",
                    regex: "\\b(" + "(S|U|SH)" + "[0-9]*" + ")\\b\\s*", 
                    next: "valPairEnd"
                },

          ],
          "fieldtypeVal": [
                {
                    token: "keyword",
                    regex: "\\b(" + mk["fieldtypeVals"] + ")\\b\\s*(?=(,|$))",
                    next: "valPairEnd"
                }
          ],
          "dimtypeVal": [
                {
                    token: "keyword",
                    regex: "\\b(" + mk["dimtypeVals"] + ")\\b\\s*(?=(,|$))",
                    next: "valPairEnd"
                }
          ],
          "onoffVal": [
                {
                    token:  "keyword",
                    regex: "\\b(" + mk["onoffVals"] + ")\\b\\s*(?=(,|$))",
                    next: "valPairEnd"
                }
          ],
          "yesnoVal": [
                {
                    token: "keyword",
                    regex: "\\b(" + mk["yesnoVals"] +")\\b\\s*(?=(,|$))", 
                    next: "valPairEnd"
                }
          ],
          "andorVal": [
                {
                    token: "keyword",
                    regex: "\\b(" + mk["andorVals"] + ")\\b\\s*(?=(,|$))",
                    next: "valPairEnd"
                }
          ],
          "selectVal": [
                {
                    token: "keyword",
                    regex: "\\b(" + mk["selectVals"] + ")\\b\\s*(?=(,|$))",
                    next: "valPairEnd"
                }
          ],
          "rollupVal": [
                {
                    token: "keyword",
                    regex: "\\b(" + mk["rollupVals"] + ")\\b\\s*(?=(,|$))",
                    next: "valPairEnd"
                }
          ],
          "jointypeVal": [
                {
                    token: "keyword",
                    regex: "\\b(" + mk["jointypeVals"] + ")\\b\\s*(?=(,|$))",
                    next: "valPairEnd"
                }
          ],
          "byteorderVal": [
                {
                    token: "keyword",
                    regex: "\\b(" + mk["byteorderVals"] + ")\\b\\s*(?=(,|$))",
                    next: "valPairEnd"
                }
          ],
          "hrystructureVal": [
                {
                    token: "keyword",
                    regex: "\\b(" + mk["hrystructureVals"] + ")\\b\\s*(?=(,|$))",
                    next: "valPairEnd"
                }
          ],
          "iotypeVal": [
                {
                    token: "keyword",
                    regex: "\\b(" + mk["iotypeVals"] + ")\\b\\s*(?=(,|$))",
                    next: "valPairEnd"
                }
          ],
          "crincludeVal": [
                {
                    token: "keyword",
                    regex: "\\b(" + mk["crincludeVals"] + ")\\b\\s*(?=(,|$))",
                    next: "valPairEnd"
                }
          ],
          "accessPropVal": [
                {
                    token: "keyword",
                    regex: "\\b(" + mk["accessPropVals"] + ")\\b\\s*(?=(,|$))",
                    next: "valPairEnd"
                },
                {
                  token: "keyword.operator",
                  regex: /\(/,
                  next: function(currentState, stack) 
                    { stack.unshift("accessPropList"); return stack[0]; }
                }
          ],
          "accessPropList": [        
                {
                  token: "keyword",
                  regex: "\\s*\\b(" + mk["accessPropVals"] + ")\\b\\s*",
                  next: function(currentState, stack) 
                    { stack.unshift("accessPropList2thru_n"); return stack[0]; }
                },
                {
                  token: "keyword.operator",
                  regex: /\)/,
                  next: function(currentState, stack) 
                    { stack.shift(); return "start"; }
                }
           ],
           "accessPropList2thru_n": [
                {
                  token: ["keyword.operator", "keyword"],
                  regex: "(\\s*,\\s*)\\b(" + mk["accessPropVals"] + ")\\b"
                },
                {
                  token: "keyword.operator",
                  regex: /\)/,
                  next: function(currentState, stack) 
                    { stack.shift(); stack.shift(); return "start"; }
                }
           ],
          "valPairEnd": [
                {
                    token: ["operator", "comment"],
                    regex: "(,\\s*\\$)(.*$)?",
                    next: "start"
                }
                ,
                {
                    token: "operator",
                    regex: ",",
                    next: "start"
                }
                ,
                {
                    token: "operator",
                    regex: "",
                    next: "start"
                }
          ],
          "defineIdent": [
              {
                token: "identifier",  // the define name
                regex: defcompNameRe + "\\s*" , // to do: more valid chars and qstrs with emebedded spaces
                next: "defineFormat"  
              },
              {
                defaultToken: "identifier"          
              }
           ],
          "defineFormat": [
              {
                token: ["keyword.operator", "keyword"],
                regex: defcompFormatRe,
                next: "defineBeforeEq"
              },{
                token: "keyword.operator",
                regex: "="  + "\\s*",       // no format. Go to exp rules
                next: "expression"  
              },{
                token: "keyword",
                regex: "(" + mk["defineBeforeEqKeys"] + ")\\b",
                next: "defineBeforeEq"  
              },
           ],
          "defineBeforeEq": [
                {
                    token: "keyword",
                    regex:  "\\b(" + mk["defineBeforeEqKeys"] + ")\\b"
                },
                {
                  token: "keyword.operator",
                  regex: /\(/,
                  next: function(currentState, stack) 
                    { stack.unshift("pardef_opts"); return stack[0]; }
                },
                {
                  token: "string",
                  regex: "(" + stringRe + ")+" + "\\s*"
                },
                {
                    token: "constant.numeric",
                    regex: numericRe,
                },
                {
                    token: "operator",
                    regex:  "=",
                    next: "expression"
                }
          ],
           "pardef_opts": [
                {
                  token: "keyword",
                  regex: "\\s*\\b(" + mk["defineParDefKeys"] + ")\\b\\s*",
                  next: function(currentState, stack) 
                    { stack.unshift("pardef_key"); return stack[0]; }
                }
           ],
           "pardef_key": [
               {
                  token: "keyword.operator",
                  regex: /\=/,
                  next: function(currentState, stack) 
                    { stack.unshift("pardef_eq"); return stack[0]; }
                },
           ],
           "pardef_eq": [
                {
                    token: "string",
                    regex:  stringRe
               },
               {
                  token: "keyword.operator",
                  regex: /,/,
                  next: function(currentState, stack) 
                    { stack.shift(); stack.shift(); return stack[0]; }
                },
                {
                  token: "keyword.operator",
                  regex: /\)/,
                  next: function(currentState, stack) 
                    { stack.shift(); stack.shift(); stack.shift(); 
                      return "defineEqOnly"; }
                }
           ],
          "defineEqOnly": [
                {
                    token: "operator",
                    regex:  /\=/,
                    next: "expression"
                }
          ],
         "sortobjKeyVal": [
                {
                    token: ["identifier", "keyword.operator","text","keyword.operator"],
                    regex: "([^=]+)(\\s*\\=\\s*)([^;]+)(;)",
                    next: "start"
                },
                {
                    token: "operator",
                    regex:  "=",
                    next: "expression"
                },
                {
                    defaultToken: "text"
                }
          ],
          "expression": [
                {
                    token: "keyword.operator",
                    regex:  "\\b(" + exprKeys + ")\\b"
                },
                {
                    token: "string",
                    regex:  stringRe
                },
                {
                    token: "constant.numeric",
                    regex: numericRe
                },
                {
                    token: "operator",
                    regex: ";",
                    next: "start"
                },
                {
                    defaultToken: "text"
                }
          ],
        "acceptKeysRhs": [
               {
                    token: "string",
                    regex: stringRe,
                },
                {
                    token: "keyword",
                    regex: "\\b(" + mk["acceptRhsKeys"] + ")\\b",
                },
                {
                    token: ["operator", "comment"],
                    regex: "(,\\s*\\$)(.*$)?",
                    next: "start"
                },
                { 
                     token: "operator",
                     regex: ",",
                     next: "start"
                }
                ,
                {
                  defaultToken: "text"
                }
           ],
         "dbaSection": [
               {
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["dbaKeywords"] + ")\\b(\\s*\\=\\s*)",
                    next: "dbaKeyVal"
               },
               {
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["dbaKeywordsAccess"] + ")\\b(\\s*\\=\\s*)",
                    next: "dbaAccess"
               },
               {
                    token: ["keyword", "keyword.operator"],
                    regex: "\\b(" + mk["dbaKeywordsRestrict"] + ")\\b(\\s*\\=\\s*)",
                    next: "dbaRestrict"
               }
               ,{
                    defaultToken: "identifier"
                }
            ],
         "dbaKeyVal": [
                {
                    token: "string",
                    regex: stringRe,
                    next: "dbaValPairEnd"
                },
                {
                    token: "constant.numeric",
                    regex: numericRe,
                    next: "dbaValPairEnd"
                },
                {
                    token: "identifier",
                    regex: "[^,]*",   
                    next: "dbaValPairEnd"
                }
               ],
          "dbaAccess": [
               {
                    token: "keyword",
                    regex: "\\b(" + mk["dbaKeywordsAccess_vals"] + ")\\b",
                    next: "dbaValPairEnd"
                }
               ],
          "dbaRestrict": [
               {
                    token: "keyword",
                    regex: "\\b(" + mk["dbaKeywordsRestrict_vals"] + ")\\b",
                    next: "dbaValPairEnd"
                }
               ],
           "dbaValPairEnd": [
                {
                    token: "operator",
                    regex: ",",
                    next: "dbaSection"
                },
                {
                    token: "operator",
                    regex: "",
                    next: "dbaSection"
                }
          ]
       };
    };
    oop.inherits(MasterHighlightRules, TextHighlightRules);
    exports.MasterHighlightRules = MasterHighlightRules
});
ace.define("ace/mode/folding/master_folding", function(require, exports, module) {
    var oop = require("ace/lib/oop");
    var Range = require("ace/range").Range;
    var BaseFoldMode = require("ace/mode/folding/fold_mode").FoldMode;
    var FoldMode = exports.FoldMode = function(commentRegex) {
        if (commentRegex) {
            this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start));
            this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end))
        }
    };
    oop.inherits(FoldMode,
        BaseFoldMode);
    (function() {
        this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
        this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
        this.singleLineBlockCommentRe = /^\s*(\-\*).*\*\/\s*$/;
        this.startRegionRe = /(^\s*SEGNAME\b|^\s*SEGMENT\b|^\s*FOLDER\b|^\s*END)/;
        this._getFoldWidgetBase = this.getFoldWidget;
        this.getFoldWidget = function(session, foldStyle, row) {
            var line = session.getLine(row);
            if (this.singleLineBlockCommentRe.test(line))
                if (!this.startRegionRe.test(line)) return "";
            var fw = this._getFoldWidgetBase(session, foldStyle,
                row);
            if (!fw && this.startRegionRe.test(line)) return "start";
            return fw
        };
        this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
            var line = session.getLine(row);
            if (this.startRegionRe.test(line)) return this.getCommentRegionBlock(session, line, row);
            var match = line.match(this.foldingStartMarker);
            if (match) {
                var i = match.index;
                if (match[1]) return this.openingBracketBlock(session, match[1], row, i);
                var range = session.getCommentFoldRange(row, i + match[0].length, 1);
                if (range && !range.isMultiLine())
                    if (forceMultiline) range =
                        this.getSectionRange(session, row);
                    else if (foldStyle != "all") range = null;
                return range
            }
            if (foldStyle === "markbegin") return;
            var match = line.match(this.foldingStopMarker);
            if (match) {
                var i = match.index + match[0].length;
                if (match[1]) return this.closingBracketBlock(session, match[1], row, i);
                return session.getCommentFoldRange(row, i, -1)
            }
        };
        this.getSectionRange = function(session, row) {
            var line = session.getLine(row);
            var startIndent = line.search(/\S/);
            var startRow = row;
            var startColumn = line.length;
            row = row + 1;
            var endRow = row;
            var maxRow =
                session.getLength();
            while (++row < maxRow) {
                line = session.getLine(row);
                var indent = line.search(/\S/);
                if (indent === -1) continue;
                if (startIndent > indent) break;
                var subRange = this.getFoldWidgetRange(session, "all", row);
                if (subRange)
                    if (subRange.start.row <= startRow) break;
                    else if (subRange.isMultiLine()) row = subRange.end.row;
                else if (startIndent == indent) break;
                endRow = row
            }
            return new Range(startRow, startColumn, endRow, session.getLine(endRow).length)
        };
        this.getCommentRegionBlock = function(session, line, row) {
            var startColumn = line.search(/\s*$/);
            var maxRow = session.getLength();
            var startRow = row;
            var re = /(^\s*SEGNAME\b|^\s*SEGMENT\b|^\s*FOLDER\b|^\s*END)/;
            var depth = 1;
            while (++row < maxRow) {
                line = session.getLine(row);
                var m = re.exec(line);
                if (!m) continue;
                if (m[1]) depth--;
                else depth++;
                if (!depth) break
            }
            var endRow = row - 1;
            line =  session.getLine(endRow);
            if (endRow > startRow) return new Range(startRow, startColumn, endRow, line.length)
        }
    }).call(FoldMode.prototype)
});

//# sourceURL=mode-master.js
