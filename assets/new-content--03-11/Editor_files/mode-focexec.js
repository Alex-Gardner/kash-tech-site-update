/*------------------------------------------------------------------
* Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.
*
* _Name_        ===> ace/mode-focexec.js
* _Description_ ===>
*
* _History_:
*  Date  Time Who Proj       Project Title
* ====== ==== === ====== ===========================================
* 191015 1239 dpd 209887 Text editor: Phase 2 epic
* 190619 1041 dpd 209887 Text editor: Phase 2 epic
* 190606 1750 dpd 209887 Text editor: Phase 2 epic
* 190103 1544 dpd 209887 Text editor: Phase 2 epic
* 181231 1405 skc 210100 wcf: create calculator resource bundle
* 181217 1214 dpd 207728 WFD/+: Ability to prompt DBMS credentials at runtime
* 181213 1716 dpd 204738 WCF:Text editor
* 181128 1516 dpd 93584  Comments (inline) reviw for different sub- languages
* 181127 1608 dpd 204738 WCF:Text editor
* 181121 1524 dpd 204738 WCF:Text editor
* 181115 1638 dpd 204738 WCF:Text editor
* 181109 1602 dpd 93584  Comments (inline) reviw for different sub- languages
* 181101 1652 dpd 204738 WCF:Text editor
* 181016 1645 dpd 204738 WCF:Text editor
* 181012 1559 dpd 204738 IBX:Text editor
* 181011 1052 dpd 204738 IBX:Text editor
* 181004 1626 dpd 204738 IBX:Text editor
* 180920 1518 dpd 204738 IBX:Text editor
* 180913 1735 dpd 204738 IBX:Text editor
* 180911 1812 dpd 204738 IBX:Text editor
* 180906 1747 dpd 204738 IBX:Text editor
* 180905 1453 dpd 204738 IBX:Text editor
* 180831 1527 dpd 204738 IBX:Text editor
* 180829 1112 dpd 204738 IBX:Text editor
* 180827 1608 dpd 204738 IBX:Text editor
* 180824 1712 dpd 204738 IBX:Text editor
* 180823 1055 dpd 204738 IBX:Text editor
* 180822 1609 dpd 204738 IBX:Text editor
* 180815 1657 dpd 204738 IBX:Text editor
* 180813 1745 dpd 204738 IBX:Text editor
* 180810 1700 dpd 204738 IBX:Text editor
* 180808 1709 dpd 204738 IBX:Text editor
* 180806 1739 dpd 204738 IBX:Text editor
* 180803 1634 dpd 204738 IBX:Text editor
* 180801 1552 dpd 204738 IBX:Text editor
* 180725 1335 dpd 204738 IBX:Text editor
* 180724 1704 dpd 204738 IBX:Text editor
* 180724 1549 dpd 204738 IBX:Text editor
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



function WcFexEditFocusKeywords(keygroup) { // FOCUS + TABLE keywords
    var kwords = {
        "keywordsFocusBase" : "DEFINE|COMPUTE|FILE|FILES|TYPE|TABLE|TABLEF|RETYPE|MODIFY|SET|EX|EXEC|EDARPC|SNAP|BULKLOAD|CHECK|BULKLOAD|CHECK|ANALYSE|FILTER|APP|MAINTAIN|SCAN|FSCAN|FS|ENCRYPT|DECRYPT|SQL|ENGINE|MATCH|GRAPH|PLOT|LOAD|UNLOAD|POSTSTAT|SHH|CREATE|DYNAM|REBUILD|FI|FILEDEF|USE|COMBINE|JOIN|MNTCON|COMPILE|COMPILE_C|WHENCE|LET|RESTRICT|COMPOUND|XCOMPOUND|DROP|REFRESH|EMBED|HOLD|PCHOLD|SAVE|SAVB|END|FIN|MORE|STATE|DOS|UNIX|MVS|TSO|NTMAS|WINNT|DBMSTART|RUNJAVA|FONTMAP|SOAP|DB2X|NGPREP|DRAWHTML|GIT|SHARE|SLEEP|SET_JSON"
        + "|" +
       "CALLINF|CALLODBC|CALLORA|CALLPGM|CALLSYB|CNS|DIMENSIONS|EX3GL|EX4GL|GKE|IBIWEB|MPAINT|OFFLINE|OLAP|ENDOLAP|ONLINE|REMOTE|REPLOT|STORE|TSGU|UNLOAD|WINDOW|WINFORM|XFER|LAYOUT",
        "keywordsFocusTabletalk" : "TABLETAL|TABLETALK|FILETALK|MODIFYTA|MODIFYTALK|GRAPHTAL|GRAPHTALK|PLOTTALK",
        "keywordsFocusSmplData" : "SMPLDATA|PROFDATA|CNTDATA|PKEYDATA|DSTDATA|DUPLDATA|OTLRDATA|PTRNDATA|SMPLINS",
        "focusParms" : "NOMSG|DROP",
        "keywordFocusEnd" : "END|MORE",
        "keywordsUse" : "AS|ON|NEW|READ|IBIONLY|LOCAL|TEMP|ADD|CLEAR|REPLACE|IN|CATALOG|REMOVE|SAV|WITH|INDEX",
        "checkKind" : "FILE|STYLE|MASTER",
        "checkKeys" : "EXTENDED|EXE|PICTURE|PICT|RETRIEVAL|RETRIEVE|RETR|HOLD|DUPLICATE|DUPL|JOIN|TEMP|ALL|AS|FOCE|FOCEXEC",

        "maintainKeys" : "IF|ON|FOR|GOTO|TYPE|BEGIN|STACK|REPEAT|ENDREPEAT|DELETE|INCLUDE|NEXT|UPDATE|REVISE|MOVE|COPY|INFER|ASK|CASE|COMMIT|COMPUTE|DECLARE|DESCRIBE|DUMP|ENDCASE|EVENT|CALL|EXEC|EXECSQL|MATCH|MODULE|NOMATCH|REPOSITION|RETURN|ROLLBACK|SAY|SQL|TRIGGER|WAIT|WINFORM|ELSE|THEN|ENDDESCRIBE|ALL|AS|AT|BIND|BY|CFUN|CLASS|CLEAR|CONTENTS|DECODE|DEPENDENTS|DFC|DROP|ENDBEGIN|EXIT|EXITREPEAT|FALSE|FILE|FILES|FIND|FROM|HIGHEST|HOLD|INTO|KEEP|MISSING|NOWAIT|PATH|PERFORM|RESET|RETURNS|SORT|TAKES|TO|TOP|TRUE|UNTIL|USING|WHERE|WHILE|YRT|OR|AND|XOR|EQ|IS|EQ_MASK|NE|IS_NOT|NE_MASK|LT|IS_LESS_THAN|GT|EXCEEDS|LE|GE|IN|NOT_IN|CONTAINS|OMITS|LIKE|UNLIKE|ESCAPE|DIV|MOD|NOT|SELECTS|OF|IMPORT|ERRORS|FOCCOMP|EXPORT|NEEDS|DATA|OFF|SOME|SET|GET",

       "keywordsEx" : "EDAMAIL|CMASAP|EDACPY|EDADEL|EDAGET|EDAPUT",

       "fiStart"    : "FI|FILEDEF|FOCDEF",
       "fiKeywords" : "DISK|PRINTER|TERMINAL|TERM|TERMY|DUMMY|DIR|LRECL|RECFM|APPEND|LOWCASE|LOWER|UPCASE|CLEAR|LIST|REMOVE|CATALOG|HTTP|HTTPS|CONCAT|SQL|CC|NOCC|MEMORY|OPTIONS|UPDATE|LOG|REPLACE",

       "createSynStart" : "SYNONYM",
       "createSynKeywords" : "AT|MODEL|DBMS|KEYS|REMARKS|FORMAT|DATABASE|NOCOLS|NOALIAS|DROP|IDOCSEGMENTS|DISEGMENTS|ODBCFIELDS|NATIVE|DYNAMIC|DEFINES|CROSSCLIENT|EDIOFF|ALPHA|LOADPROC|DBALIAS|CHECKNAMES|UNIQUENAMES|DBSYNONYM|FOREIGNKEYS|STOREDPROCEDURE|DBNICKNAME|DBMVIEW|SQLSTR|FOR_SUBQUERY|MEMORY|FOR|SCHEMA|SYNONYM|TABLE|LDB|FM|IDOC|BAPI|WITHSTATS|PARMS|EXTENSION|QUERY|USERGROUP|DIRECTINPUT|HIERARCHIES|STRUCTURE_DIMENSIONS|LANGUAGE|MIGRATE|CODEPAGE|BYTEORDER|FIELDNAME|CASE|ONEPARTNAME|CURRENCY|DATEFMT|NOFEX|PRESERVECASE|SYSHIER|INCLUDE_VARIANTS|DBMSLOG|FILELISTENER|ADD_LEVEL0|SAVEREF|SYNC|DENORMALIZE|UNIQUEIDS|PERSPECTIVE",
       "createFileStart"    : "FILE", 
       "createFileKeywords" : "DROP|NOMSG|WITHINDEXES|INDEXESONLY|WITHFK|DDLONLY|NEW",
       "createKind" : "SYNONYM|FILE|ADMIN|EDACFG|MODLDBM",

        "refreshKeywords" : "REFRESH|FILE|ADMIN|EDACFG|MODLDBM|SYNONYM|WITHSTATS|AS",
        "encrDecrKeywords" : "FILE",

        "rebuildKeywords" : "REBUILD|REORG|INDEX|EXTERNAL|CHECK|TIMESTAMP|DATE|NEW|MDINDEX|MIGRATE|LOAD|DUMP|IF|ADD|NO|YES|N|Y",

       // to do: for NOPRINT$ : remove esc \\
       "keywordsTableGraph": "PRINT|HEADING|NOPRINT|SUP-PRINT|SUM|STORE|ADD|COUNT|WRITE|BY|ACROSS|IF|ON|LIST|FOOTING|CENTER|FOR|RANKED|WHERE|WHERE_GROUPED|AFTER|DATA|WITHIN|RUNNING_WITHIN|IN|AS_SPAN|ADD|AS|SUBHEAD|SUBFOOT|OVER|RUN|FILE|PARTITION_AGGR|PARTITION_REF|STDDEV|CORRELATION|AND|END|MORE|ROW-TOTAL|COLUMN-TOTAL",

        // to do: ON TABLE COMPUTE ... WHEN ?


      "keywordsModify" : "ON|OFF|AT|GETHOLD|MATCH|SEG|NOMATCH|CASE|TYPE|GOSUB|PROMPT|CRTFORM|TED|SORTHOLD|ACTIVATE|DEACTIVATE|COMMIT|ROLLBACK|IF|NEXT|WITH-UNIQUES|INTO|ENDCASE|LOG|MSG|CHECK|START|STOP|DATA|VIA|MODE|CONTINUE|FORM|FREEFORM|DELETE|INCLUDE|REJECT|UPDATE|REPEAT|ENDREPEAT|HOLD|REPOSITION|SQL|SET|NOINDEX|TIMES|NOHOLD|VALID|INVALID|NONEXT",  // includes MODIFY...ON and ...REPEAT kwds
       // to do: * as keyword?
      "keywordsModifyFlgs" : "ECHO|TRACE",

      "keywordsModifyFixform" : "FIXFORM",
      "keywordsModifyFixformKeys" : "ON|FROM|PROPAGATE|NAME|ALIAS|MODE",

      "keywordsModifyPrompt" : "PROMPT",
      "keywordsModifyPromptKeys" : "START",

      "keywordsModifyCrtform" : "CRTFORM",
      "keywordsModifyCrtformKeys" : "CLEAR|NOCLEAR|LOWER|LINE|WIDTH|HEIGHT|UPPER|TYPE|KEYS|NONKEYS|SEG",  // to do: * / D.* T.* as keyword

      "keywordsModifyGoto" : "GOTO|PERFORM",
      "keywordsModifyGotoVals" : "TOP|ENDCASE|ENDREPEAT|EXITREPEAT|EXIT|CRTFORM",
      "keywordsModifyLog" : "NOMATCH|INVALID|FORMAT|DUPL|TRANS|ACCEPT|DBMSERR",

       "keywordsModifyTmpfldEnd" : "DATA|FORM|UPDATE|INCLUDE|DELETE|MATCH|LOG|CHECK|ON|NOMATCH|PROMPT|START|STOP|FREEFORM|LOOKUP|FIXFORM|CRTFORM|TYPE|CASE|ENDCASE|GOTO|IF|NEXT|ECHO|TRACE|REPT|INIT|HOLD|ENDREPEAT|GOSUB|GETHOLD|DEACTIVATE|REPEAT|REPOSITION|ACTIVATE|PERFORM|DO|RESTORE|AUTO|AUTORUN|FOCUS|NEXT|SORTHOLD|COMMIT|ROLLBACK|TED|NOINDEX|COMPUTE|VALIDATE|END|SQL",

       "defineBeforeEqKeyList" : "REDEFINES|YRTHRESH|YRT|WITH|DEFCENT|DFC|MISSING|CURRENCY|CURR|TITLE|TITLE_|DEFINITION|DESCRIPTION|DESC|DESC_|INPUTFIELD|XDEFAULT|TEMPORAL_PROPERTY|CURRENCY_DISPLAY|CURRENCY|CURRENCY_ISO_CODE|MANDATORY",
       "defineBeforeEqKeyVals" : "SOME|DATA|IS|PRESENT|ALL|ALWAYS|ON|NEEDS|OFF|YES|NO",
       "compRecStart" : "COMPUTE|RECAP",
       "whereStart" : "WHERE|WHERE_GROUPED",
       "ifKeywords" : "FILE|EQ|IS|IS-NOT|NE|IS-LESS-THAN|LT|IS-MORE-THAN|GT|EXCEEDS|IS-FROM|FROM|GE|TO|LE|CONTAINS|OMITS|INCLUDES|EXCLUDES|EXACTLY|NOT-FROM|LIKE|UNLIKE|IDESC|NOESCAPE|ESCAPE|DT|FILE|COUNT|IS|TOTAL|NOT|IN|PRESENT|MISSING|OR|OUTPUTLIMIT|RECORDLIMIT",
       "whereKeywordsExt" : "AND",
       "whereFuncs" : "PARTITION_AGGR|AVE|CNT|MAX|FST|LST|PARTITION_REF|STDDEV|MAX|MIN|EDIT|DECODE|CORRELATION",
        "byKeywords" : "IN-GROUPS-OF|IN-RANGES-OF|IN-RANGE-OF|TILES|PLUS|OTHER|OTHERS|PCSEND|ROWS|HIERARCHY|SHOW|SUMMARIZE|TOP|HIGHEST|LOWEST|UNDER-LINE|NOPRINT|SUP-PRINT|MULTILINES|NOSPLIT|PAGEBREAK|REPAGE|UNDER-LINE|SKIP-LINE|FOLD-LINE|OVER|BAR|NEWPAGE|AS|TOTAL",
       "acrossKeywords" : "IN-GROUPS-OF|IN-RANGES-OF|IN-RANGE-OF|TILES|HIERARCHY|SHOW|ACROSS-TOTAL|COLUMNS|TOP|SUBTOTAL|SUB-TOTAL",
       "forKeywords" : "LABEL|DATA|POST|PICKUP|GET|WITH|CHILD|CHILDREN|OVER|AS|BAR|NOPRINT|FROM",
       "onTableKeywords" : "PARTITION|USING|SET|MERGE|INTO|WHEN|MATCHING|MATCHED|UPDATE|DELETE|NOT|INSERT|LOAD|AND|ROW-TOTAL|COLUMN-T|COLUMN-TOTAL|SUB-TOTAL|SUBTOTAL|RECOMPUTE|SUMMARIZE|SUBHEAD|SUBFOOT|NOTOTAL|PAGEBREAK|NEWPAGE|STYLE|STYLESHEET|ENDSTYLE",
       "setKeywordsQ" : "ASNAME|ALL.|ASNAMES|AUTOINDEX|AUTOPATH|BINS|BLKCALC|BUSDAYS|BYPANELING|CACHE|CARTESIAN|CDC|CDC_CONTROL_FIELD|CDN|CNVERR|COLUMNSCROLL|CURRENCY_DISP|CURRENCY_ISO_CODE|CURRENCY_PRINT_ISO|DATEDISPLAY|DATEFNS|DATE_ORDER|DATE_SEPARATOR|DATETIME|DEFCENT|DEFECHO|DMH|DMH_CACHING|DMH_INTERACT|DMH_LOOPLIM|DMH_PARSING|DMH_STACKLIM|DUPLICATECOL|EMPTYREPORT|EQTEST|EXCELRELEASE|EXL2KLANG|EXTAGGR|EXTHOLD|EXTRACT|EXTSORT|FIELDNAME|FOC2GIGDB|FOCALLOC|FOCCREATELOC|FOCSTACK|FOCTRANSFORM|FORMFEED|FUSREXXDD|HDAY|HIPERFOCUS|HOLDATTRS|HOLDLIST|HOLDNAMES|HOLDSTAT|HOTMENU|IBMLE|INDEX|JOIN2MEMORY|LANGUAGE|LINES/PAGE|LINES/PRINT|MERGEOPT|MESSAGE|MINIO|MISS_ON|MODE|MORE|MULTIPATH|NFOC|NODATA|ONFIELD|PAGE-NUM|PANEL|PARTITION_ON|PAUSE|PCTFORMAT|PHONETIC_ALGORITHM|POOL|PREFIX|PRFTITLE|PRINT|PRINTPLUS|QUALCHAR|QUALTITLES|REBUILDMSG|RECAP-COUNT|REQSCOPE|SAVEMATRIX|SCD|SCD_ACTIVE_BDATE|SCD_CHANGE_FLAG|SCD_INACTIVE_EDATE|SCD_UPDATE_TYPEI|SCREEN|SHADOW|SMARTMODE|SPACES|SQLENGINE|SUBTOTNAMEPRT|SUMPREFIX|TCPIPINT|TEMP|TERMINAL|TESTDATE|TIME_SEPARATOR|TITLES|TRACKIO|VIEWNAMESIZE|WIDTH|WINPFKEY|XFBINS|XFC|XRETRIEVAL|YRTHRESH",   // ? SET keywords
        "setKeywordsOther" : "RECORDLIMIT|ONLINE-FMT|BYDISPLAY|SHORTPATH|SQUEEZE|HTMLCSS|AUTODRILL|PCOMMA|HOLDMISS", // other SETs (not complete)
       "setValues"   : "ON|OFF|FOCUS|CUBE|MIXED|FLIP|SUBST|SOME|ALL|ACROSS|508|NEW|OLD|REJECT|USD|STARTUP|DEFAULT|STRICT|RELAXED|EXACT|WILDCARD|ASCII|ANSI|UPPER|Y|N|SIMPLE|COMPOUND|PERCENT|SHORT|LONG|ONLINE|LEGACY|LST|TODAY|YYYYMMDD|DOT|COLON|EXTIDXBLD|PASS|PRINTONLY|LEFT_FIXED|LEFT_FIXED_SPACE|LEFT_FLOAT|LEFT_FLOAT_SPACE|TRAILING|TRAILING_SPACE|PENULTIMATE|TABLE|FIRST|METAPHONE|SOUNDEX|NOPAGE|TOP|SQL|CONSOLE|IBM3270|IBM3279|IBM5550|PS55|F6650|HS6020|IGNORE|OUTPUTLIMIT|NOFOCLIST",  // to do. not complete.
        "onTableMatchOnlyKeywords" : "AFTER|MATCH|OLD-OR-NEW|OLD-AND-NEW|OLD-NOT-NEW|NEW-NOT-OLD|OLD-NOR-NEW|OLD|NEW",
        "onKeywords" : "RECAP|RECOMPUTE|SUBTOTAL|SUB-TOTAL|SUMMARIZE|PAGE-BREAK|REPAGE|SKIP-LINE|UNDER-LINE|SUBHEAD|SUBFOOT|WHEN|UNDER-LINE|NOPRINT|SUP-PRINT|MULTILINES|NOSPLIT|PAGEBREAK|REPAGE|UNDER-LINE|SKIP-LINE|FOLD-LINE|OVER|NEWPAGE",
       "joinKeywords" : "FILE|INNER|AS_CHILD|LEFT_OUTER|FULL_OUTER|RIGHT_OUTER|AS_ROOT|ADD_LINK|AS|TO|IN|AT|WITH|ONE|ALL|MULTIPLE|UNIQUE|AND|WHERE|TAG|CLEAR",
       "joinWhereKeywords" : "EQ|IF|IS|MISSING|THEN|ELSE|NE|EQ|GT|LT|AND|OR",
       "sqlKeywords" : "FROM|WHERE|LIKE|SELECT|INTO|TOP|TRUNCATE|TABLE|DISTINCT|INSERT|UPDATE|DELETE|INTO|VALUES|DO|AS|IF|IS|NOT|THEN|ELSE|AND|OR|WHEN|THEN|GROUP|ORDER|BY|NOT|COUNT|BETWEEN|INNER|OUTER|LEFT|RIGHT|FULL|SELF|JOIN|HAVING|EXISTS|ANY|BETWEEN|ALTER|ALL|HAVING|IN|DROP|INDEX|DATABASE|VIEW|CREATE|EXECUTE|GRANT|REVOKE|ON|PUBLIC|USE|RENAME|COMMIT|WORK|PRIMARY KEY|FOREIGN KEY|REFERENCES|ADD|CONSTRAINT|PREPARE|NULL|STRING|CHAR|VARCHAR|LONGVARCHAR|TIME|TIMESTAMP|DECIMAL|NUMERIC|INTEGER|DOUBLE|PRECISION|FLOAT|REAL|UNSIGNED|SMALLINT|TINYINT|BIGINT|DATE|DATETIME|BOOLEAN|BLOB|ASC|DESC|CASE|BEGIN|UNION|USING|FETCH|CLOSE|HELP|SESSION|PURGE|CHARACTER|NO|BEFORE|AFTER|CHECKSUM|DEFAULT|PRIMARY|PROCEDURE|OPEN|TRANSACTION|CURSOR|WITH|RETURN|RETURNS|LANGUAGE|FIRST|LAST|CROSS|MAX|MIN|TO|UNIQUE|SUM|DECLARE|COALESCE|INTERVAL|CAST", 
       "sqlKeywordsOneLine" : "CONNECTION_ATTRIBUTES",
       "sqlKeywordsAttExt" : "CONNECTION_ATTRIBUTES_EXT",
       "appKeywords" :  "CREATE|DELETE|RENAME|LIST|PATH|APPENDPATH|PREPENDPATH|REMOVEPATH|PREPENDWORK|REMOVEWORK|QUERY|RENAMEF|RENAMEFILE|DELETEF|DELETEFILE|ENABLE|DISABLE|HELP|COPY|MOVE|HOLD|EXTENDED|FI|FILEDEF|MAP|COPYF|COPYFILE|MOVEF|MOVEFILE|SHOWPATH|HOLDMETA|HOLDDATA|WHENCE|PROPERTY|LOCATION|RESTRICTPATH|IFEXIST|ALL|ON|OFF|DEF|DEFAULT|METALOCATION_SAME|LOCK|NESTED|ENABLED|HOMEAPPS|FOCCACHE_STATE|NODISPLAY|CODEPAGE|ENCODING|MIXED_CASE|DISK|DROP|REFRESH|LOAD|UNLOAD|DIR|MASTER|TREE|INTERNAL|STAT|DIRONLY|FNNOSORT|NO_CHKXST|XSTONLY|PHYSICAL|NOQA|ISGITREPO|HASSUBFOLDERS|DROP|IFNEXIST|UNIX|WNT|MAC|UER_ONLY|NONE|R|READ|W|WRITE|X|EXECUTE|L|LIST|DISK|DEFAULT|HISTORY|NAME|FAVORITES|SET|FORDISPLAY|ADD|USER_ONLY|PERSIST|CONTENT|PREP|FOCEXEC",
        "scanKeywords" : "TYPE|NEXT|FILE|SAVE|SHOW|TOP|LOCATE|REPLACE|CHANGE|DISPLAY|INPUT|DELETE|UP|BOTTOM|AGAIN|VERIFY|BRIEF|JUMP|X|Y|QUIT|opsys|MARK|BACK|MOVE|TLOCATE|CRTFORM",
        "engineKeywords" : "SET|CREATE|FILE|CONNECTION_ATTRIBUTES",
        "dynamKeywords" : "DATASET|DA|DSNAME|DS|MEMBER|DATACLASS|MGMTCLASS|STORCLASS|PASSWORD|REFDD|IBIREFDD|REFDSN|REFVOL|KEYOFF|PATHNAME|PATHOPTS|OSYNC|OCREAT|OEXCL|ONOCTTY|OTRUNC|ONONBLOCK|ORDONLY|OWRONLY|ORDWR|OAPPEND|CLOSE|RELEASE|RLSE|CONTIG|ROUND|TERMINAL|ALX|MXIG|SECMODEL|RECORG|DSNTYPE|FILEDATA|PATHDISP|PATHDISC|PATHMODE|SISUID|SISGID|SIRUSR|SIWUSR|SIXUSR|SIRWXU|SIRGRP|SIWGRP|SIXGRP|SIRWXG|SIROTH|SIWOTH|SIXOTH|SIRWXO|DEFER|DUMMY|PAGES|MEGABYTES|REUSE|REU|IBINOCLOSE|NOMSG|NOALIAS|PERM|\$SHARE|OLD|MOD|NEW|SHR|FI|FILE|FILENAME|DD|DDNAME|LONGNAME|FILEEXT|ALTFILE|SYSOUT|VOLUME|VOLSER|MSVGP|SPACE|PRIMARY|SECONDARY|TRACK|TRACKS|TRKS|CYLINDERS|CYLS|BLOCKS|BLKS|BLKSIZE|OUTLIM|OUTPUT|USER|DEST|DIR|LIKE|HOLD|UNIT|PARALLEL|LABEL|POSITION|MAXVOL|MCOUNT|UCOUNT|PRIVATE|RELEASE|ROUND|UNCATLG|UNCATALOG|CATLG|CATALOG|DELETE|KEEP|UNCATLG|CATLG|CATALOG|DELETE|KEEP|BFALN|BFTEK|BUFL|BUFNO|BUFNI|BUFOFF|DEN|EROPT|DSORT|KEYLEN|LIMCT|LRECL|BUFND|NCP|RECFM|TRTCH|INPT|OUTPT|RETPD|EXPDT|FCB|ALIGN|VERIFY|PROTECT|ACCODE|BURST|NOBURST|CHARS|COPIES|FLASH|MODIFY|OPTCD|FORMS|UCS|WRITER|\$HIPER|HIPER|SUBSYSTEM|SUBSPARM|DATASET|DSNAME|DDNAME|FILE|FILENAME|LONGNAME|PATHNAME|SET|TEMPALLOC|HFS|MVS|TYPE|APP|SKIP|CREATE|POSTFIX|LRECL|BLKSIZE|RECFM|TRKS|CYLS|CYLINDERS|SPACE|DIR|VOLUME|VOLSER|DSNTYPE|DEFAULT|HOLD|HOLDMAST|SAVE|FOCUS|FOCCOMP|HOLDACC|OFFLINE|FOCSORT|REBUILD|FOCSML|FOCSTACK|SESSION|TRF|FOCPOOLT|MDI|FMU|FUSION|FOC\$HOLD|EXTINDEX|ALLOCATE|ALLOC|FREE|CONCATEN|SUBMIT|DELETE|RENAME|XDC|COPY|COMPRESS|COPYDD|TRACER|STOPMEMT|TEST|IBMC|CLOSE|MEMORY|HIPER|OFF|FOR|NOALIAS|APPEND|FORCE|TRUNCATE|REPLACE|KEYMOD|LONGSYNM|MATCH",
        "shareKeywords": "UPDATE|REVOKE|EXECUTE",
        "combineKeywords" : "FILE|FILES|PREFIX|TAG|AND|AS",
        "filterKeywordsBase"  : "CLEAR|ADD|NAME|DESC|DESCRIPTION|WHERE|IF",
        "subtOpersAcr" : "SUM.|AVE.|MAX.|MIN.|FST.|LST.|CNT.|ASQ.",
        "subtOpersPrintBase" : "PCT.|RPCT.|DST.|RNK.|MDN.|MDE.|TOT.|TOTCNT.|TOTMAX.|TOTMIN.|TOTAVE.",
        "subtOpersOnTabBase" : "SUM_IMP.|ROLL.|ROLL.SUM.|ROLL.AVE.|ROLL.MAX.|ROLL.MIN.|ROLL.FST.|ROLL.LST.|ROLL.CNT.|ROLL.ASQ.",
        "ampKeysReg" : "QUOTEDSTRING|LENGTH|EXIST|BYTELENGTH|TYPE|DATE_LOCALE|VALIDATE", // to do VALIDATE.
        "ampKeysEval" : "EVAL",
        "embed" : "BEGIN|MAIN|COMPONENT|END"
     };

     kwords["setKeywords"] = kwords["setKeywordsQ"] + "|" + 
                             kwords["setKeywordsOther"];
     kwords["setKeywordsRe"] = kwords["setKeywords"].replace(/\./g, "\\.");

     kwords["subtOpersAcrRe"] = kwords["subtOpersAcr"].replace(/\./g, "\\.");
     kwords["subtOpersPrintBaseRe"] = kwords["subtOpersPrintBase"].replace(/\./g, "\\.");
     kwords["subtOpersOnTabBaseRe"] = kwords["subtOpersOnTabBase"].replace(/\./g, "\\.");
     kwords["subtOpersPrintRe"] =  kwords["subtOpersAcrRe"] + "|" + 
                                   kwords["subtOpersPrintBaseRe"];
     kwords["subtOpersPrint"] =    kwords["subtOpersAcr"] + "|" + 
                                   kwords["subtOpersPrintBase"];

     kwords["subtOpersOnTabRe"] =  kwords["subtOpersAcrRe"] + "|" + 
                                   kwords["subtOpersOnTabBaseRe"];
     kwords["subtOpersOnTab"] =    kwords["subtOpersAcr"] + "|" + 
                                   kwords["subtOpersOnTabBase"];

     kwords["defineParDefKeys"] = kwords["defineBeforeEqKeyList"] + "|" + 
         "GEOGRAPHIC_ROLE|AGGREGATABLE";
     kwords["defineBeforeEqKeys"] = kwords["defineBeforeEqKeyList"] + "|" + 
                                    kwords["defineBeforeEqKeyVals"];  
 
     kwords["keywordsFocus"] = kwords["keywordsFocusBase"] + "|" + 
                               kwords["keywordsFocusTabletalk"] + "|" + 
                               kwords["keywordsFocusSmplData"];

     kwords["filterKeywords"] = kwords["filterKeywordsBase"] + "|" + 
                                kwords["ifKeywords"];

     kwords["modifyKeys"] =  // for now, include all MODIFY phrases in one pool
         kwords["keywordsModify"] + "|" + kwords["keywordsModifyFlgs"] + "|" + 
         kwords["keywordsModifyFixform"] + "|" + 
         kwords["keywordsModifyFixformKeys"] + "|" +
         kwords["keywordsModifyPrompt"] + "|" + 
         kwords["keywordsModifyPromptKeys"] + "|" +
         kwords["keywordsModifyCrtform"] + "|" + 
         kwords["keywordsModifyCrtformKeys"] + "|" +
         kwords["keywordsModifyGoto"] + "|" + 
         kwords["keywordsModifyGotoVals"] + "|" + 
         kwords["keywordsModifyLog"] + "|COMPUTE";

     if (keygroup)
       return(kwords[keygroup]);
     else
       return(kwords);
};

function WcFexEditHoldKeywords(keygroup) {
    var kwords = {
      "keywordsHoldStart" :
                "HOLD|PCHOLD|SAVE|SAVB",
      "keywordsHold" : 
                "AS|DATASET|VIA|MERGE|TABLENAME|CONNECTION|TARGET|TYPE|VERSION|DESTINATION|LOCATION|HEADER|LOCATION|DELIMITER|RDELIMITER|HEADER|ENCLOSURE|KEY",
      "keywordsHoldFormat" : "FORMAT",
      "keywordsHoldFormatReg" : "DIF|ALPHA|IFPS|SYLK|DOC|BINARY|HTMTABLE|COMMA|COMT|COM|TAB|TABT|LOTUS|VISDIS|VISDISAE|DFIX|GIF|JPEG|SVG|PNG|EXCEL|WK1|GRAPH|SCREEN|EXL97|INTERVAL|DBASE|DBASEII|XML|XMLR|SAME_DB|IRTABLE|AHTMLTAB|SQL_SCRIPT|SCL_SCRI|JSON|SFDC",
      "keywordsHoldFormatWp" : "WP",
      "keywordsHoldFormatCalc" : "CALC|CALCC",
      "keywordsHoldFormatFocus" : "FOCUS|XFOCUS|XFC|XFOC|DATREC",
      "keywordsHoldFormatSS" : "POSTSCRIPT|POSTSC|POSTSCRI|PS|HTML|PDF|PDF_GIF|DHTML|IRPT|AHTML|PPT|AFSWF|FLEX|XLSX|APDF|PPTX|INFOGRPH|IGIMAGE|IGPDF",
      "keywordsHoldFormatSSPiv" : "EXL2|EXL2K|EXCEL2K",
      "keywordsHoldFormatXbrl" : "XBRL",
      "keywordsHoldFormatFxf" : "FXF",
      "keywordsHoldIndex" : "INDEX|MDEX|PAGEFIELDS|CACHEFIELDS",
      "keywordsHoldKeyParm" : "MISSING|PERSISTENCE",
      "keywordsHoldNoParms" : "DROP|NOTITLE|APPEND|NOKEYS|WITHFK|AT|CLIENT|FORMATTED|PIVOT",
      "keywordsHoldParms" : "ON|OFF|VOLATILE|GLOBAL_TEMPORARY|PERMANENT|STAGE",

       // to do: separate from reg hold opts
       //"keywordsHoldFormatPivKey" : "PIVOT",
       //"keywordsHoldFormatPivAttr" : "PAGEFIELDS|CACHEFIELDS",
      "keywordsHoldFormatSSopts" : "TITLE|TEMPLATE",
      "keywordsHoldFormatSSoptsNum": "SHEETNUM|SHEETNUMBER|SLIDENUM|SLIDENUMBER", 
      "keywordsHoldFormatSSoptsNoParms" : "BYTOC|NUMBYTOC|OPEN|CLOSE|NOBREAK|NOTOC|NUMTOC|MERGE|FORMULA|DISPALL"
     };

     kwords["keywordsHoldRegPlusSS"] = kwords["keywordsHold"] +
       "|" + kwords["keywordsHoldFormatSSopts"];

     kwords["keywordsHoldFormatTypeAll"] = kwords["keywordsHoldFormatReg"] + 
       "|" + kwords["keywordsHoldFormatWp"] +
       "|" + kwords["keywordsHoldFormatCalc"] + 
       "|" + kwords["keywordsHoldFormatFocus"] + 
       "|" + kwords["keywordsHoldFormatSS"] + 
       "|" + kwords["keywordsHoldFormatSSPiv"] + 
       "|" + kwords["keywordsHoldFormatXbrl"] + 
       "|" + kwords["keywordsHoldFormatFxf"];

     kwords["keywordsHoldNoParmsAll"] = kwords["keywordsHoldNoParms"] +
       "|" + kwords["keywordsHoldFormatSSoptsNoParms"];
     if (keygroup)
       return(kwords[keygroup]);
     else
       return(kwords);

};

function WcFexEditDmKeywords(keygroup) {
    var kwords = {
      "keywordsDM_commandsBase"    : "CLOSE|CRTFORM|CRTCLEAR|DEFAULT|DEFAULTS|DEFAULTH|DEFAULTP|EXIT|FOCSTACK|GOTO|HTMLFORM|IF|INCLUDE|OLAP|OS|PASS|PROMPT|REMOTE|QUIT|READ|READFILE|REPEAT|RUN|SET|SYSTEM|TYPE|TYPE0|TYPE1|WINDOW|WRITE",
      "dmPlat" : "MVS|TSO|CMS|WINNT|DOS|UNIX",
      "dmSet" : "SET",
      "dmBeginEnd" : "BEGIN|END",
      "keywordsDM_repeat" : "FOR|WHILE|TIMES",
      "keywordsDM_repeatFor" : "FROM|TO|STEP",
      "keywordsHtmlform" : "BEGIN|END|NOEVAL|SAVE|AS"
    };
    kwords["keywordsDM_commands"] = kwords["keywordsDM_commandsBase"] + "|" +
                                    kwords["dmPlat"];
    kwords["dmQmark"] = kwords["dmPlat"] + "|" + kwords["dmSet"];

    var cmd_sep = kwords["keywordsDM_commands"].split("|");
    var cmdnum = 0;
    kwords["keywordsDM_commandsDash"] = "-" + cmd_sep[0];
    while (cmdnum < cmd_sep.length)
    {
      kwords["keywordsDM_commandsDash"] += "|\-" + cmd_sep[cmdnum];
      cmdnum++;
    }

    if (keygroup)
      return(kwords[keygroup]);
    else
      return(kwords); 
};

ace.define("ace/mode/focexec", function(require, exports, module) {

    var oop = require("ace/lib/oop");
    var TextMode = require("ace/mode/text").Mode;
    var FocexecFoldMode = require("ace/mode/folding/focexec_folding").FoldMode;
    var FocexecHighlightRules = require("ace/mode/focexec_highlight_rules").FocexecHighlightRules;
    var langTools = require("ace/ext/language_tools");
    var FocexecCompletions = require("ace/mode/focexec_completions").FocexecCompletions;

    var Mode = function(options) {
        this.HighlightRules = FocexecHighlightRules;
        this.foldingRules = new FocexecFoldMode;
        this.$completer = new FocexecCompletions
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

ace.define("ace/mode/focexec_completions", ["require", "exports", "module", "ace/token_iterator"], function(require, exports, module) {

    var acIdent = ibx.resourceMgr.getString('aceeditor.ident');
    var acIdentAndVar = ibx.resourceMgr.getString('aceeditor.ident') + "|&var";

    var FocexecCompletions = function() {};

    var tk  = WcFexEditFocusKeywords();
    var hk  = WcFexEditHoldKeywords();
    var dmk = WcFexEditDmKeywords();
    var fk  = WcFexEditFuncKeywords();

    var exprKeys = fk["operators"] + "|" + fk["exprLogic"] + "|" + fk["functions"];

    var holdList =  hk["keywordsHoldRegPlusSS"] + "|" + 
                 hk["keywordsHoldFormatSSoptsNum"] + "|" + 
                 hk["keywordsHoldIndex"] + "|" +
                 hk["keywordsHoldNoParmsAll"] + "|" + 
                 hk["keywordsHoldKeyParm"] + "|" + 
                 hk["keywordsHoldFormat"];

    var holdIndexList =  acIdent + "|" + holdList;

    var tableKeys = tk["keywordsTableGraph"] + "|" + tk["keywordsHoldStart"];

    var whereKwdsAll = tk["ifKeywords"] + "|" + tk["whereKeywordsExt"] + "|" +
                       tk["whereFuncs"];

    var hasAncestor = function(stack, ancestor_state) {  
        var walknum = 0;
        while (stack[walknum]) {
          if (stack[walknum] === ancestor_state)
            return true;
          walknum++;
        }
        return false;
    };

    var stateKeys = {
      //state    :       [ valid keywords/idents,        meta str]
      "start"              : [tk["keywordsFocus"] + "|\?F|\?FF", "FOCUS"],
      "b*_table_file_body" : [tk["keywordsTableGraph"] + "|" + 
                              tk["subtOpersPrint"] + "|COMPUTE", "TABLE/GRAPH"],
      "b*_compute" : ["FILE" , ""],
      "b*_compute_inl" : [acIdent , ""],
      "b*_compute_inl_2thru_n_table"    : [acIdent , ""],
      "b*_compute_inl_2thru_n_modify"   : [acIdent , ""],
      "b*_compute_inl_2thru_n_maintain" : [acIdent , ""],
      "b*_define_lines" : ["END|" + acIdent, ""],
      "b*_define_function" : ["END|" + acIdent, ""],
      "b*_where"  : [whereKwdsAll, "WHERE"],
      "b*_if"     : [tk["ifKeywords"], "IF"],
      "b*_by"     : [tk["byKeywords"] , "BY"],
      "b*_across" : [tk["acrossKeywords"] + "|" + tk["subtOpersAcr"], "ACROSS"],
      "b*_for"    : [tk["forKeywords"] , "FOR"],
      "b*_on"     : [tk["onKeywords"] + "|TABLE|COMPUTE", "ON"],
      "b*_modify_body"   : [tk["modifyKeys"], "MODIFY"],
      "b*_maintain_body" : [tk["maintainKeys"], "MAINTAIN"],
      "b*_dm_htmlform_contents" : ["&var|html", ""],
      "b*_on_table_set_style"   : ["", ""],
      "b*_join_file_body" : [tk["joinKeywords"], "JOIN"],
      "join_where" : [tk["joinWhereKeywords"], "JOIN WHERE"], // to do: add more
      "join_file"         : [tk["joinKeywords"], "JOIN"],
      "on_table"        : [ tk["onTableKeywords"] + "|"+
                            hk["keywordsHoldStart"] + "|END",  "ON TABLE"],
      "b*_on_table_misc" : [ tk["onTableKeywords"] + "|" + tk["subtOpersOnTab"]+
                             "|FILE|END",    "ON TABLE"],
      "define_exp" :    [exprKeys, ibx.resourceMgr.getString('aceeditor.expression')],
      "exp" :           [exprKeys, ibx.resourceMgr.getString('aceeditor.expression')],
      "define_format" : [tk["defineBeforeEqKeys"], "DEFINE/COMPUTE"],
      "define_eq" :     [tk["defineBeforeEqKeys"], "DEFINE/COMPUTE"],
      "compute_inl_format" : [tk["defineBeforeEqKeys"], "DEFINE/COMPUTE"],
      "compute_inl_eq" : [tk["defineBeforeEqKeys"], "DEFINE/COMPUTE"],
      "pardef_opts"    : [tk["defineParDefKeys"], "DEFINE/COMPUTE"],
      "define_file"    : ["FILE|FUNCTION", "DEFINE"],
      "table_file"     : ["FILE|ON", "TABLE"],
      "maintain_file"  : ["FILE", "MAINTAIN"],
      "modify_file"    : ["FILE", "MODIFY"],
      "table_file_name"    : [acIdentAndVar , ""],
      "modify_file_aft"    : [acIdentAndVar , ""],
      "define_file_aft"    : [acIdentAndVar , ""],
      "define_function_aft"    : [acIdentAndVar , ""],
      "maintain_file_name" : [acIdentAndVar , ""],
      "holdIdentParm" : [acIdentAndVar , ""],
      "ex" : [tk["keywordsEx"] + "|" + "-LINES", "EX"],
      "ex_content_lines" : ["&var", ""],
      "dm_set" : ["&var", ""],
      "dm_set_eq" : ["=" , ""],
      "b*_hold"     : [holdList + "|END", "HOLD"],
      "holdKeyParm" : [hk["keywordsHoldParms"] , "HOLD"],
      "holdFormat"  : [hk["keywordsHoldFormatTypeAll"], ibx.resourceMgr.getString('aceeditor.holdformat')],
      "holdIndex"   : [holdIndexList + "|END",  "HOLD"],
      "sql" : [tk["sqlKeywords"] + "|SET|FMI|PING", "SQL"],
      "b*_sql_body_multiline" : [tk["sqlKeywords"] + "|SET", "SQL"],
      "sql_body_oneline_or_ext" : [tk["sqlKeywordsOneLine"] + "|" +
                                   tk["sqlKeywordsAttExt"], "SQL"],
      "b*_sql_case" : [tk["sqlKeywords"], "SQL"],
      "sql_extra" : [tk["keywordsFocus"] + "|\?F|\?FF", "FOCUS"],
      "app" : [tk["appKeywords"], "APP"],
      "app_deletef" : ["DEFAULT", "APP"],
      "engine" : [tk["engineKeywords"] + "|" + 
                  tk["sqlKeywordsAttExt"], "ENGINE"],
      "b*_json_end" : ["&var", "JSON"],
      "b*_dynam" : [tk["dynamKeywords"], "DYNAM"],
      "b*_combine" : [tk["combineKeywords"], "COMBINE"],

      "b*_scan" : [tk["scanKeywords"], "SCAN"],
      "when"      : [exprKeys, "Expression"], 
      "create"            : [tk["createKind"], "CREATE"],
      "create_file"       : [acIdentAndVar , ""],
      "create_file_body"  : [tk["createFileKeywords"], "CREATE FILE"],
      "create_synonym" : [tk["createSynKeywords"], "SYNONYM"],
      "dm_htmlform" : [dmk["keywordsHtmlform"] + "|" + acIdent,"HTMLFORM"],
      "dm_htmlform_opts" : [dmk["keywordsHtmlform"] + "|" + acIdent,"HTMLFORM"],
      "dm_repeat_body"     : [dmk["keywordsDM_repeat"], "REPEAT"],
      "dm_repeat_for"      : [acIdentAndVar , ""],
      "dm_repeat_for_body" : [dmk["keywordsDM_repeatFor"], "REPEAT...FOR"],
      "dm_write_rhs" : ["NOCLOSE|&var", "WRITE"],
      "dm_read_rhs" :  ["NOCLOSE|&var", "READ"],
      "b*_use" :  [tk["keywordsUse"], "USE"],
      "check_file"       :  [tk["checkKind"], "CHECK"],
      "check_file_name"  :  [acIdentAndVar , ""],
      "check_file_parms" :  [tk["checkKeys"], "CHECK FILE"],
      "filedef" :   [acIdentAndVar , ""],
      "filedef_body" :   [tk["fiKeywords"], "FILEDEF"],
      "b*_rebuild" :   [tk["rebuildKeywords"], "REBUILD"],
      "dm_type"    : ["&var", "TYPE"],
      "dm_begend"  : ["BEGIN|END", ""],
      "dm_qmark"    : [dmk["dmQmark"], "-?"],
      "dm_command" : [dmk["keywordsDM_commandsDash"] + "|\-?", "Dialogue Manager"],
      "refresh" :   [tk["refreshKeywords"], "REFRESH"],
      "encr_decr" : [tk["encrDecrKeywords"], "ENCRYPT/DECRYPT"],
      "tabletalk" : [tk["encrDecrKeywords"], "TABLETALK"],
      "b*_filter" : [tk["filterKeywords"], "FILTER"],
      "b*_sql_extra_2nd" : ["WHERE|IF|ON|FILE", "TABLE"],
      "share_verb"  : [tk["shareKeywords"], "SHARE"],
      "on_table_set"  : [tk["setKeywords"] + "|STYLE", "SET"],
      "set"  : [tk["setKeywords"], "SET"],
      "set_value"  : [tk["setValues"] + "|" + hk["keywordsHoldFormatTypeAll"], "SET"],
      "on_table_set_value"  : [tk["setValues"] + "|" + hk["keywordsHoldFormatTypeAll"], "SET"],
      "amp_parm" : [tk["ampKeysReg"] + "|" + tk["ampKeysEval"], ""],
      "amp_after_parens" : [tk["ampKeysReg"], ""],
      "embed" : [tk["embed"], "EMBED"],
      "embed_begin" : ["HOLD|PCHOLD", "EMBED"]
    };

    (function() {
        this.getCompletions = function(lineStateAtEnd, session, pos, prefix, callback) {
            var lineStateAtCurs = "";
            var metaStr = "";
            var wordList = "";
            var focus_dm = false;

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

            if ((lineStateAtCurs === "b*_table_file_body")      &&
                hasAncestor(lineStateAtEnd, "match_file_name"))
            {
              wordList += "|" + tk["onTableMatchOnlyKeywords"];
              metaStr = "MATCH";
            } else if (((lineStateAtCurs === "on_table")      ||
                        (lineStateAtCurs === "b*_on_table_misc"))      &&
                       hasAncestor(lineStateAtEnd, "match_file_name"))
            {
              wordList += "|" + tk["onTableMatchOnlyKeywords"];
            }


            if (lineStateAtCurs === "start") 
            { // after matching regex /$/, ACE assigns line state to "start".
              if (lnToCrs.match(/^[ ]*(HOLD|PCHOLD|SAVE|SAVB)[ ]+/))
              {  
                wordList = stateKeys["b*_hold"][0];
                metaStr  = stateKeys["b*_hold"][1];
              }
              else if (lnToCrs.match(/^[ ]*DYNAM[ ]+/))
              {  
                wordList = stateKeys["b*_dynam"][0];
                metaStr  = stateKeys["b*_dynam"][1];
              }
              else if (lnToCrs.match(/^\s*-.*/))
              {
                wordList = "";
                metaStr  = ""
              }
            }

            if ((lineStateAtCurs.match("^b\\*_") ||   // base state or start? 
                 (lineStateAtCurs === "start"))           &&   
                (lnToCrs.match(/^\s*-\*/)))           // in a comment?
            { 
              wordList = "";
              metaStr  = ""
            }

            // no autocomplete words for states not listed in stateKeys list

            if ((lineStateAtCurs.match("^b\\*_") ||   // base state or start? 
                 (lineStateAtCurs === "start"))           &&   
                (lnToCrs.match(/^[ ]?-([A-Z0-9]*)$/)))  // mid of DM cmd?
            { 
              wordList = stateKeys["dm_command"][0];
              metaStr = stateKeys["dm_command"][1];
            }

            var wordListSplit = wordList.split("|");

            var wmap =  wordListSplit.map(function(word) {
              return {
                  caption: word,
                  value: word,
                  meta: metaStr,
                  score: Number.MAX_VALUE
              }
            });

            if ((lineStateAtCurs.match("^b\\*_") ||   // base state? 
                 (lineStateAtCurs === "start"))           &&   
                (pos.column === 0))         // cursor at 1st position? 
            {
                    // add DM commands
              var wmap_dm_list = stateKeys["dm_command"][0];
              var wmap_dm = wmap_dm_list.split("|").map(function(word) {
                return {
                  caption: word,
                  value: word,
                  meta: stateKeys["dm_command"][1],
                  score: Number.MAX_VALUE
                }
              });
              wmap = wmap.concat(wmap_dm);
            }

            // Is state a table cmd state AND cursor is before any toks on line?
            // If so, add other TABLE cmds
            if (((lineStateAtCurs === "b*_where")   ||
                 (lineStateAtCurs === "b*_if")      ||
                 (lineStateAtCurs === "b*_by")      ||
                 (lineStateAtCurs === "b*_across")  ||
                 (lineStateAtCurs === "b*_for")     ||
                 (lineStateAtCurs === "b*_on"))                  &&
                (lnToCrs.match(/^\s*[a-zA-Z]*$/)))
            {
              var wmap_table_list = stateKeys["b*_table_file_body"][0];
              if (hasAncestor(lineStateAtEnd, "match_file_name"))
              {
                wmap_table_list += "|" + tk["onTableMatchOnlyKeywords"];
                metaStr = "MATCH";
              }
              else 
                metaStr =  stateKeys["b*_table_file_body"][1];
             
              var wmap_table = wmap_table_list.split("|").map(function(word) {
                return {
                  caption: word,
                  value: word,
                  meta: metaStr,
                  score: Number.MAX_VALUE
                }
              });
              wmap = wmap.concat(wmap_table);
            }

            wmap.sort(function(a,b) {
              if (a["caption"] === b["caption"]) {
                return 0;
              }
              else {
                return (a["caption"] < b["caption"]) ? -1 : 1;
              }
            });
            return (wmap);
      }
    }).call(FocexecCompletions.prototype);
    exports.FocexecCompletions = FocexecCompletions
 });
ace.define("ace/mode/focexec_highlight_rules", function(require, exports, module) {
    var oop = require("ace/lib/oop");
    var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
    var FocexecHighlightRules = function() {

    var starCommentRe =  "^\\s*\\*.*$";

    var commentAnywhereBase =  "-\\*.*$";

    var commentAnywhereRe =  "\\s*" + commentAnywhereBase;

    var commentRe =  "^[ ]{0,1}" + commentAnywhereBase;

    var cCommentRule = [{
                token: "comment",
                regex: /\/\*/,
                push: [
                    {
                      token: "comment",
                      regex: /\*\//,
                      next: "pop"
                    },
                    {defaultToken: "comment"}
                  ]
              } ];

    var cCommentRuleBeforeDefExp = function(expstate) {
         var rules = [
              {  /* single line only, for now */
                regex: /\/\*([^*]|(\*)(?!\/))*\*\//, 
                onMatch: function(val, state, stack) {
                if (expstate === "define_exp") {
                  return("comment");
                  } else {
                  return("identifier");
                  }
                }
              } 
         ];
         return (rules);
    };

    var tk  = WcFexEditFocusKeywords();
    var hk  = WcFexEditHoldKeywords();
    var dmk = WcFexEditDmKeywords();
    var fk  = WcFexEditFuncKeywords();

    var sqlCommentRe =  /(^[ ]*\-\-.*$|\-\-.*$)/;

    var ampKindRe = "[&]{1,2}";

    var idSqlNameRe =  "[A-Za-z0-9_$@]+";

    var idNameRe =  "[A-Za-z0-9_$%#@!\\^\\*\\-|\\.+\"\\?\\{\\}:~`]+";

    var defcompNameRe =  "[A-Za-z_][A-Za-z0-9_$%#@!\\^\\*\\-|\\.+\"\\?\\{\\}:~`]*";

    var defcompFormatRe = /(\/)(\s*[A-Za-z][A-Za-z0-9\.%\-:\|!]*)(?=(\s|=|\(|$))/;

    // to do: find out why #, % and other punct chars cannot be last char
    var ampNameReBasic = "[^-.,()+><&*;=/|'\" ]+\\b"; 
    var ampNameRe = "(" + ampNameReBasic + ")";

    var ampKeys = tk["ampKeysReg"] + "|" + tk["ampKeysEval"];

    // In push/pop states, highlighting can be different
    // for different kinds of tokens in parens (see mode-xml.js)
    var ampParens  = "(\\(([a-zA-Z_]+\\([^\\)]*\\))?[^\\)]*\\)[\\.])";
    var ampFmt = "([AI][0-9]{1,5})";

    var ampParmRe =
         "(" +
              "([\\.]((" + ampFmt + ")" + "|" +
                     "((" + ampParens + ")?(("+ ampKeys + "))?)))" +
          ")?";

    // single state rule or amp
    var ampRe = ampKindRe + ampNameRe  + ampParmRe;

    // to do: multistate rules for -READ amps
    // to do: use similar rule for TABLE FILE &xxx?
    var ampReadRe = ampKindRe + ampNameRe + "\\.(([AI]?[0-9]{1,5}[B]?[\\.]?)|(EVAL))\\s*";

    var numericBody  = "\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b";
    var numericRe    = "((\\-[.]?)|\\.|\\b)" + numericBody;
    var numericExpRe = "([.]|\\b)" + numericBody;

    var builtinConstants = "true|false|null|NULL"; // to do: add to autocompl?

    var exprKeys = fk["operators"] + "|" + fk["exprLogic"] + "|" + fk["functions"];
    var tableStart = "TABLE[F]?|GRAPH|MATCH";

    var matchOnly_bodyKeys = tk["onTableMatchOnlyKeywords"] + "|" +
                             tk["matchOnlyKeywords"];

    var whereKwdsAll = tk["ifKeywords"] + "|" + tk["whereKeywordsExt"] + "|" +
                       tk["whereFuncs"];

    var afterFldCompTableGraphKwds =  tk["keywordsTableGraph"] + "|" + "COMPUTE";

    var htmlformEscs = "AMP|GLB|AML|GLL|FIL|FILNP|OBJ|SET";

    var jsonKwds = "true|false|null";

    var unshiftState = function(state) {
      var clos = function( currentState, stack) {
        stack.unshift(state); return stack[0]; 
      }
      return (clos);
    };

    var dmCommandrule = [{
                token: "keyword",
                regex: /^[ ]?-/,
                next: unshiftState("dm_command")
              } ];

    var idRuleSp = [{
                token: "identifier",
                regex: idNameRe + "\\s*"
              } ];

    var idSqlRuleSp = [{
                token: "identifier",
                regex: idSqlNameRe + "\\s*"
              } ];

    var commentRule = [{
                token: "comment",
                regex: commentRe
              } ];

    var starCommentRule = [{
                token: "comment",
                regex: starCommentRe
              } ];

    var commentAnywhereRule = [{
                token: "comment",
                regex: commentAnywhereRe
              } ];

    var commentRuleAll = [
              commentAnywhereRule,
              cCommentRule
              ];

    var stringRuleSp = [{
                  token: "string",
                  regex: '\\s*\'',
                  next: unshiftState("strBody")
                }];

    var singStringRuleSp = [{  // SQL single-line single-quoted strings
                  token: "string",
                  regex: '\\s*\'',
                  next: unshiftState("singStrBody")
                }];

    var dbStringRuleSp = [{  // JSON and SQL dbl-quoted single-line strings
                  token: "string",
                  regex: '\\s*"',
                  next: unshiftState("dbStrBody")
                }];

   var stringMultiSp = [{
                  token: "string",
                  regex: '\\s*\'',
                  next: unshiftState("strMultiBody")
                }];

   var stringMultiSetExpRuleSp = [{
                  token: "string",
                  regex: '\\s*\'',
                  next: unshiftState("strMultiBodySetExp")
                }];

  var dbStringMultilineRule = [{
                  token: "string",
                  regex: '^\\s*"',
                  next: unshiftState("dbStrMultiBody")
                }];

  var dbStringMultilineRuleAnyPos = [{
                  token: "string",
                  regex: '"',
                  next: unshiftState("dbStrMultiBody")
                }];

   var numericExpRule = [{
                token: "constant.numeric",
                regex: numericExpRe
              } ];

   var numericRule = [{
                token: "constant.numeric",
                regex: numericRe
              } ];

   var numericExpRuleSp = [{
                token: "constant.numeric",
                regex: numericExpRe + "\\s*",
              } ];

   var numericRuleSp = [{
                token: "constant.numeric",
                regex: numericRe + "\\s*",
              } ];


   var nextTablePhraseState = [
              commentRuleAll,
              dmCommandrule,
              {   
                token: "identifier", 
                regex: "\\s*\\b(" + tk["keywordsTableGraph"] + ")(?=(&))",
              },
              {   
                token: "keyword", 
                regex: "(?=(\\s*\\b(" + tk["keywordsTableGraph"] + ")\\b))",
                next: function(currentState, stack) {
                    if (hasAncestor(stack, "embed"))
                      return(shiftToStart(null, stack));
                    while (stack[0] && (stack[0] !== "b*_table_file_body"))
                      stack.shift();
                    return stack[0] || "start"; }
              },
              {
                regex: "\\s*\\b(" + tk["onTableMatchOnlyKeywords"] + ")\\b\\s*",
                onMatch: function(val, state, stack) {
                if (hasAncestor(stack, "match_file_name")) {
                  return("keyword");
                  } else {
                  return("identifier");
                  } 
                },
                next: function(currentState, stack) {
                  if (hasAncestor(stack, "embed"))
                    return(shiftToStart(null, stack));
                  if (hasAncestor(stack, "match_file_name")) {
                    while (stack[0] && (stack[0] !== "b*_table_file_body"))
                      stack.shift();
                  }
                  return stack[0] || "start" 
                }
              },
              {
                token: "keyword",
                regex: "\\s*\\b(" + tk["compRecStart"]  + ")\\b\\s*", 
                next: function(currentState, stack) {
                  if (hasAncestor(stack, "embed"))
                    return(shiftToStart(null, stack));
                  while (stack[0] && 
                         ((stack[0] !== "b*_table_file_body") &&
                          (stack[0] !== "b*_for")))
                    stack.shift();
                  stack.unshift("b*_compute_inl"); return stack[0]; }
              },
         ];


   var choose2thru_n_state = function(stack) {
                      if (stack[0] === "b*_compute_inl")
                      {  stack.shift();
                         var walknum = 0;
                         var state2_thru_n = "b*_compute_inl_2thru_n_table";
                         while(stack[walknum])
                         {
                           if (stack[walknum] === "b*_modify_body")
                           {
                             state2_thru_n = "b*_compute_inl_2thru_n_modify";
                             break;
                           }
                           else if (stack[walknum] === "b*_table_file_body")
                           {
                                   state2_thru_n = "b*_compute_inl_2thru_n_table";
                             break;
                           }
                           else if (stack[walknum] === "b*_maintain_body")
                           {
                             state2_thru_n = "b*_compute_inl_2thru_n_maintain";
                             break;
                           }
                           else if ((stack[walknum] === "b*_for") ||
                                    (stack[walknum] === "b*_on"))
                           {
                             while(walknum) 
                               { walknum--; stack.shift();}
                             state2_thru_n = null;
                             break;
                           }
                           walknum++;
                         }
                         if (state2_thru_n) 
                           stack.unshift(state2_thru_n);  
                      }
                      return stack[0] || "start";
   };

   var defcompFmtCommonRules = function(eqstate, expstate) {
         var rules = [
              cCommentRuleBeforeDefExp(expstate),
              {
                token: "variable",
                regex: ampRe + "\\s*",
                next: unshiftState(eqstate)
              },
              {
                token: ["keyword.operator", "keyword", "keyword"],
                regex: defcompFormatRe,
                next: unshiftState(eqstate)
              },{
                token: "keyword.operator",
                regex: "="  + "\\s*",       // no format. Go to exp rules
                next: unshiftState(expstate)
              },
              {
                token: "keyword",
                regex: "(" + tk["defineBeforeEqKeys"] + ")\\b",
                next: unshiftState(eqstate)
              },
              {
                token : "keyword.operator",
                regex : /;/, // inline compute can omit eq sign
                next: function(currentState, stack) {
                      if (stack[0] === "compute_inl_format")
                        shiftToBaseState(currentState, stack);
                      return(choose2thru_n_state(stack));
                  }
              },
              {  
                token: "identifier",
                regex: "(?=(\\s*\\b(" + afterFldCompTableGraphKwds + ")\\b))",
                next: function(currentState, stack) {
                  if ((stack[0] === "compute_inl_format") &&
                      (hasAncestor(stack, "b*_compute_inl_2thru_n_table")))  {
                         while (stack[0] && (stack[0] !== "b*_table_file_body"))
                         stack.shift();
                  }
                  else
                    stack.unshift("compute_inl_eq");
                  return stack[0] || "start"; 
                }
              }
         ];
         return (rules);
   };

   var defcompEqCommonRules = function(expstate) {
         var rules = [
                cCommentRuleBeforeDefExp(expstate),
                {
                  token: "keyword",
                  regex: "\\b(" + tk["defineBeforeEqKeys"] + ")\\b",
                },
                {
                  token: "keyword.operator",
                  regex: /\(/,
                  next: unshiftState("pardef_opts")
                },
                ampRule,
                stringRuleSp,
                {
                  token: "keyword.operator",
                  regex: "="  + "\\s*",
                  next: unshiftState(expstate)
                },
                {
                  token : ["keyword.operator", "comment"],
                  regex : /(;)(.*$)/, // inline compute can omit eq sign
                  next: function(currentState, stack) {
                      if (stack[0] === "compute_inl_eq")
                        shiftToBaseState(currentState, stack);
                      return(choose2thru_n_state(stack));
                    }
                }
           ];
         return (rules);
   };

   // Next state callback that allows state to either queue specified
   // state on stack or shift down to specified base state on stack
   var altNext = function(nextstate, basestate)
   {
     var nextCB = function(currentState, stack) 
     {
       if (basestate)
       { 
         while (stack[0] && (stack[0] !== basestate)) 
           stack.shift(); 
         return basestate   
       }
       else if (nextstate)
       {
         stack.unshift(nextstate); return stack[0];
       }
       else  // default action: just return to previous state 
       { 
         stack.shift(); return stack[0] || "start"; 
       }
     }
     return(nextCB);
   };

   var strBodyCreate = function(nextstate, basestate) {
             var rules = [
                    {
                      token: "identifier",
                      regex: ampRe + '\\s*$',
                      next: altNext(nextstate, basestate)
                    },
                    ampRule, 
                    {
                      token: "string",
                      regex: /&/
                    },
                    {
                      token: "string",
                      regex: '\'(?=$)',
                      next: altNext(nextstate, basestate)
                    },
                    {
                      token: "string",
                      regex: '\'\\s*',
                      next: altNext(nextstate, basestate)
                    },
                    {
                      token: "identifier",
                      regex: '[^\'&]+$',
                      next: altNext(nextstate, basestate)
                    },
                    {
                      token: "string",
                      regex: '[^\'&]+'
                    },
                    {
                      token: "identifier",
                      regex: '^',
                      next: altNext(nextstate, basestate)
                    }
               ];
              return rules;
   };

   var compoundLitVarRules = function(nextstate, basestate) {
        var rules = [
             { 
                token: "string",
                regex: '\\s*\'',
                next: function(currentState, stack) 
                  { 
                    if (nextstate)
                      stack.unshift("strBody_" + nextstate); 
                    else if (basestate === "b*_hold")
                      stack.unshift("strBody_holdIdentParm"); 
                    return stack[0]; 
                  } 
             },{ 
                token: "identifier",
                regex: /(\|([^&\s]+)?(?=\s|$)|\s+)/,
                next: altNext(nextstate, basestate)
             },{
                token: "variable",
                regex: "(" + ampRe + ")(?=\\s|$)",  // to do...just & + name
                next: altNext(nextstate, basestate)
             },{
                token: "identifier",
                regex: /\|([^&\s]+)?/
             },{
                token: "identifier",
                regex: /([^&\s]+)(?=\s|$)/,
                next: altNext(nextstate, basestate)
             },{
                token: "identifier",
                regex: /([^&\s]+)/
             },
             ampRule
           ];
         return (rules);
   };

   var compute_inl_2thru_n = [
              commentRule,
              {       
                  token: "variable",
                  regex:  ampKindRe + ampNameRe + "\\s*",
                  next: unshiftState("compute_inl_format")
              },
              dmCommandrule,
              {      
                  token: "identifier",
                  regex:  defcompNameRe + "\\s*", 
                  next: unshiftState("compute_inl_format")
              } ];

    var escStrBody = function(quot) {
      var rules = [
           {
             token: "identifier",
             regex: ampRe + '\\s*$',  // unclosed string
             next: function(currentState, stack) 
               { stack.shift(); return stack[0] || "start"; }
           },
           ampRule,
           {
             token: "string",
             regex: /&/
           },
           {
             regex: "\\\\[" + quot + "\\\\bnfrt]", // escaped chars
             onMatch: function(val, state, stack) {
               if ((stack.length > 1) && (stack[1] === "b*_json_end"))
                 return("constant"); // change highlight color for JSON
               else 
                 return("string");
             }
           },
           {
             token: "string",
             regex: /\\/,      // not allowed for JSON
             next: function(currentState, stack) 
             {
               if ((stack.length > 1) && (stack[1] === "b*_json_end"))
                 stack.shift();
               return stack[0] || "start"
             }
           },
           {
             token: "string",
             regex: quot + "\\s*",                 // closed string
             next: function(currentState, stack) 
               { stack.shift(); return stack[0] || "start"; }
           },
           {
             token: "identifier",
             regex: "[^" + quot + "&\\\\]*$",      // unclosed string
             next: function(currentState, stack) 
               { stack.shift(); return stack[0] || "start"; }
           },
           {
             token: "string",
             regex: "[^" + quot + "&\\\\]+"
           }
       ];
       return (rules);
    };
    var tablePhrase = function(kwds) {
         var rules = [
              {
                regex: "\\s*\\b(" + tk["subtOpersAcrRe"] + ")",
                onMatch: function(val, state, stack) {
                  if (stack[0] === "b*_across")
                    return("keyword");
                  else 
                    return("identifier");
                }
              },
              {
                token: "identifier", 
                regex: "\\s*\\b(" + kwds + ")(?=(&))",
              },
              {
                token: "keyword", 
                regex: "\\s*\\b(" + kwds + ")\\b(?=(\\s|$))",
              },
              nextTablePhraseState,
              ampRule,
              stringRuleSp,
              dbStringMultilineRule,
              numericRuleSp,
              idRuleSp
         ];
         return (rules);     
    };

    var onTableMatchOnlyKeywords = function() {
      var rule = {
          regex: "\\b(" + tk["onTableMatchOnlyKeywords"] + ")\\b(?=(\\s|$))",
          onMatch: function(val, state, stack) {
            if (hasAncestor(stack, "match_file_name")) {
              return("keyword");
            } else {
              return("identifier");
            } 
          }
      }
      return (rule);
    };

    var hasAncestor = function(stack, ancestor_state) {  
        var walknum = 0;
        while (stack[walknum]) {
          if (stack[walknum] === ancestor_state)
            return true;
          walknum++;
        }
        return false;
    };

    // shifts down to nearest base state (starts with "b*" ) on stack 
    var shiftToBaseState = function(curstate, stack) {  
      while (stack[0] && (!(stack[0].match("^b\\*_"))))
        stack.shift();
      return stack[0] || "start";
    };

    var shiftToStart = function(currentState, stack) {
       while (stack[0])  stack.shift(); return "start"; 
    };

    // After an amper var, move to appropriate state based on stack.
    var shiftOutOfAmp = function(currentState, stack) {
      if (stack[0])
      {
        if (stack[0] === "amp_parm")
           stack.shift();               // return to state that the amp var started from
        else if (stack[0] === "amp_after_parens")
        {
          stack.shift(); stack.shift(); // return to state that the amp var started from
        }

        if ((stack[0] === "holdFormat") || (stack[0] === "holdKeyParm"))
        {
         while (stack[0] && stack[0] !== "b*_hold")
           stack.shift();
        }
      }
      return stack[0] || "start"; 
    };

    var ampRuleCreate = function(shiftOutFunc) {
       var ampRule = [
              {   
                token: "variable",
                regex: ampKindRe + ampNameRe + "\\.",
                next: unshiftState("amp_parm")
              },
              {    
                token: "variable",
                regex: ampKindRe + ampNameRe,
                next:  shiftOutFunc ? shiftOutOfAmp : undefined
              }
            ]; 
       return ampRule;
    }

    // multistate rule for amp with autocomplete for EVAL/LENGTH etc.
    var ampRule = ampRuleCreate();

    // Multistate amper rule for ampers that need to shift somewhere else after 
    // the amper
    var ampRuleValPos = ampRuleCreate(shiftOutOfAmp);
        
   
    var setValRuleCreate = function(shiftOutFunc) {
      var setRule = [
             {
               token: "operator",
               regex:  /^/,
               next: shiftOutFunc
             },
             ampRule,
             stringRuleSp,
             numericRuleSp,
             {
                token: "keyword",
                regex: "\\b(" + tk["setValues"] + "|" + hk["keywordsHoldFormatTypeAll"] + ")\\b\\s*",
                next: shiftOutFunc 
             },
             {
                token: "keyword.operator",
                regex: /\=/
             }
     ]; 
     return setRule;
   }
   
   this.$rules = {
      "start": [
                commentRule,
                cCommentRule,
                starCommentRule,
                dmCommandrule,
                {
                    token: "keyword",
                    regex: /(^\s*(TABLE[F]?|PLOT)\b\s*)/,
                    next: unshiftState("table_file")
                },
                {
                    token: "keyword",
                    regex: /(^\s*GRAPH\s+FILE\b\s*)/, //to do: table_file? 
                    next: unshiftState("table_file_name")
                },
                {
                    token: "keyword",
                    regex: /(^\s*MATCH\s+FILE\b\s*)/, //to do: table_file?
                    next: unshiftState("match_file_name")
                },
                {
                    token: "keyword",
                    regex: "(^\\s*(" + hk["keywordsHoldStart"] + ")\\b\\s*)",
                    next: unshiftState("b*_hold")
                },
                {
                    token: "keyword",
                    regex: "^\\s*(" +  tk["keywordFocusEnd"] + ")\\s*$",
                },
                {
                    token: "keyword",
                    regex: "^\\s*DEFINE\\b\\s*",
                    next: unshiftState("define_file")
                },
                {
                    token: "keyword",
                    regex: "^\\s*COMPUTE\\b\\s*",
                    next: unshiftState("b*_compute")
                },
                {
                    token: "keyword",
                    regex: /(^\s*APP(?=(\s|$)))/,
                    next: unshiftState("app")
                }
                ,
                {
                    token: "keyword",
                    regex: /(^\s*ENGINE(?=(\s|$)))/,
                    next: unshiftState("engine")
                }
                ,
                {
                    token: "keyword",
                    regex: /(^\s*DYNAM(?=(\s|$)))/,
                    next: unshiftState("b*_dynam")
                }
                ,
                {
                    token: "keyword",
                    regex: /(^\s*COMBINE(?=(\s|$)))/,
                    next: unshiftState("b*_combine")
                }
                ,
                {
                    token: "keyword",
                    regex: /(^\s*SCAN(?=(\s|$)))/,
                    next: unshiftState("b*_scan")
                }
                ,
                {
                    token: "keyword",
                    regex: /(^\s*SQL(?=(\s|$)))/,
                    next: unshiftState("sql")
                }
                ,
                {
                    token: "keyword",
                    regex: /(^\s*EX\s+\*\s*)/,
                    next: unshiftState("ex_star")
                },
                {
                   token: "keyword", 
                    regex: /(^\s*EX\b\s+)/,
                    next: unshiftState("ex")
                },
                {
                    token: "keyword",
                    regex: /(^\s*CREATE\b\s+)/,
                    next: unshiftState("create")
                },
                {
                    token: "keyword",
                    regex: /(^\s*JOIN\s+)/,
                    next: unshiftState("join_file")
                },
                {
                    token: "keyword",
                    regex: /(^\s*MODIFY\s+)/,
                    next: unshiftState("modify_file")
                },
                {
                    token: "keyword",
                    regex: /(^\s*MAINTAIN\b\s*)/,
                    next: unshiftState("maintain_file")
                },
                {
                    token: "keyword",
                    regex: /(^\s*USE\b\s*)/,
                    next: unshiftState("b*_use")
                },
                {
                    token: "keyword",
                    regex: /(^\s*CHECK\b\s*)/,
                    next: unshiftState("check_file")
                },
                {
                    token: "keyword",
                    regex: "(^\\s*(" + tk["fiStart"] + ")\\b\\s*)",
                    next: unshiftState("filedef")
                },
                {
                    token: "keyword",
                    regex: "(^\\s*(REBUILD)\\b\\s*)",
                    next: unshiftState("b*_rebuild")
                },
                {
                    token: "keyword",
                    regex: "(^\\s*(REFRESH)\\b\\s*)",
                    next: unshiftState("refresh")
                },
                {
                    token: "keyword",
                    regex: "^\\s*(ENCRYPT|DECRYPT)\\b\\s*",
                    next: unshiftState("encr_decr")
                },
                {
                    token: "keyword",
                    regex: "^\\s*(" + tk["keywordsFocusTabletalk"] + ")\\b\\s*",
                    next: unshiftState("tabletalk")
                },
                {
                    token: "keyword",
                    regex: /(^\s*FILTER\b\s*)/,
                    next: unshiftState("b*_filter")
                },
                {
                    token: "keyword",
                    regex: /(^\s*SHARE\b\s*)/,
                    next: unshiftState("share_verb")
                },
                {
                    token: "keyword",
                    regex: /(^\s*SET\b\s*)/,
                    next: unshiftState("set")
                },
                {
                    token: "keyword",
                    regex: /(^\s*EMBED\b\s*)/,
                    next: unshiftState("embed")
                },
                stringRuleSp,
                numericRule,
                {
                    token: "keyword",
                    regex: /^\s*\?(\s+|F\b|FF\b)/
                }, 
                { 
                    token: "keyword",
                    regex: "(^\\s*(" + tk["keywordsFocus"] + ")\\b\\s*)",
                    next: unshiftState("focus_misc")
                }, 
                ampRule
           ],
            "focus_misc": [ // all misc focus commands are treated as 1-liners 
              ampRule,
              stringRuleSp,
              numericRuleSp,
              {
                token: "identifier",
                regex: /^/,
                next: shiftToStart 
              }
           ],
            "ex_star": [   
              ampRule,
              {
                token: "keyword",
                regex: /^\s*END\*.*$/,
                next: shiftToStart
              }
           ],
            "ex": [   
              ampRule,
              stringRuleSp,
              numericRule,
              {
                token: "keyword",
                regex: /\-LINES\s+/,
                caseInsensitive: true,
                next: unshiftState("ex_lines_num")
              },
              {
                token: "keyword",
                regex: "\\b(" + tk["keywordsEx"] + ")\\b",
                next: shiftToStart
              },
              {
                token: "identifier",
                regex: "^",
                next: shiftToStart
              }
           ],
           "ex_lines_num": [  
              {
                token: "variable",
                regex: ampRe + "\\s*", // can't resolve the amp w/o fex parse.
                next: shiftToStart
              },
              {
                token: "operator",
                regex: /\*/,
                next: function(currentState, stack) 
                     { stack.unshift("ex_content"); 
                       stack.unshift( "ex_lines_edaput"); return stack[0]; }
              },
              {
                regex: /[0-9]+/,
                onMatch: function(val, state, stack) {
                  var linesCount = parseInt(val);
                  while (linesCount > 1)
                  {
                    stack.unshift("ex_content_lines");
                    linesCount--;
                  }
                  stack.unshift( "ex_lines_edaput");
                  return("constant.numeric");
                },
                next: function(currentState, stack) {
                  if (stack[0] === "ex_lines_num")
                    shiftToStart(currentState, stack);
                  else
                    return stack[0]; 
                }
              }
           ],
           "ex_lines_edaput": [   
             {
                token: "keyword",
                regex: "\\s+(EDAPUT|EDAMAIL)\\b\\s*",
                next: unshiftState("ex_lines_edaput_tail_1st_line")
             },
             {
                token: "identifier",
                regex: /(?=.)/,
                next: unshiftState("ex_lines_edaput_tail_1st_line")
             }
           ],
           "ex_lines_edaput_tail_1st_line": [   
             ampRule,
             stringRuleSp,
             numericRule,
             {
                token: "comment",
                regex: /(-\*.*|\$.*)$/,
                next: function(currentState, stack) 
                    { stack.shift(); stack.shift(); return stack[0]; }
             },
             {
                token: "identifier",
                regex: "$",
                next: function(currentState, stack) 
                    { stack.shift(); stack.shift(); return stack[0]; }
             }
           ],
           "ex_content": [   
                      // All content of EX cmd is currently unhighlighted 
                      // except for ampers.
                      // Change of highlight rules is necessary for MAS or ACX
              ampRule,
              {
                token: "keyword",
                regex: /^[ ]?(\-RUN)\b\s*/,
                next: shiftToStart 
              },
              {
                token: "keyword",
                regex: /^\s*EDAPUT\*\s*$/,
                next: shiftToStart
              }
           ],
           "ex_content_lines": [  
              ampRule,
              {
                token: "identifier",
                regex: /$/,
                next: function(currentState, stack) { 
                  stack.shift();
                  if (stack[0] === "ex_lines_num")
                  { 
                    while (stack[0]) stack.shift(); 
                    return "start"; 
                  }
                  else
                    return stack[0];
                }
              }
           ],
           "create": [
              {
                token: "keyword", 
                regex: "\\s*\\b(" + tk["createSynStart"]  + ")\\b(?=(\\s|$))\\s*",
                next: unshiftState("create_synonym")
              },
              {
                token: "keyword", // to do: get correct autocomplete 
                regex: "\\s*\\b(" + tk["createFileStart"] + ")\\b(?=(\\s|$))\\s*",
                next: unshiftState("create_file")
              },
              {
                token: "keyword", // to do: other CREATE commands.
                regex: "\\s*\\b" + tk["createKind"]  + "\\b(?=(\\s|$))",
                next: shiftToStart
              },
                ampRule,
                stringRuleSp,
                numericRuleSp,
              {
                token: "identifier", 
                regex: ".*$",
                next: shiftToStart
              }
           ],
           "create_synonym": [
              {
                token: "keyword", 
                regex: "\\s*\\b(" + tk["createSynKeywords"] + ")\\b\\s*"
              },
              {
                 token: "keyword",
                 regex: "^\\s*(" +  tk["keywordFocusEnd"] + ")\\s*$",
                 next: function(currentState, stack) {
                   while (stack[0])  stack.shift(); return "start"; }     
              },
                ampRule,
                stringMultiSp,
                numericRuleSp
           ],
           "create_file": [
             compoundLitVarRules("create_file_body", null)
           ],
           "strBody_create_file_body": [
             strBodyCreate("create_file_body", null)
           ],
           "create_file_body": [
              commentRule,
              {
                token: "keyword", 
                regex: "\\s*\\b(" + tk["createFileKeywords"] + ")\\b\\s*"
              },
              {
                 token: "keyword",
                 regex: "^(?=(\\s*(" + tk["keywordsFocus"] + ")))",
                 next: shiftToStart
              },
              {
                 token: "keyword",
                 regex: "^\\s*(" +  tk["keywordFocusEnd"] + ")\\s*$",
                 next: function(currentState, stack) {
                   while (stack[0])  stack.shift(); return "start"; }     
              },
              {
                token: "operator",
                regex: /^[ ]?-/, 
                next: function(currentState, stack) {
                            while (stack[0])  stack.shift();
                        stack.unshift("dm_command"); return stack[0]; }
              },
                ampRule,
                stringRuleSp,
                numericRuleSp
           ],
           "b*_where": [
              {
                token: "keyword.operator",            
                regex:  "\\s*\\b(" + tk["whereFuncs"] + ")\\b(?=(\\s|\\(|$))"
              },   
              {
                token: "keyword",
                regex: "\\s*\\b(" + whereKwdsAll + ")\\b(?=(\\s|$))"
              },
              {
                token: "identifier",
                regex:  /;/,
                next: function(currentState, stack) {
                   stack.shift();
                   return(shiftToBaseState(currentState, stack));
                }
              },
              nextTablePhraseState,
              ampRule,
              stringRuleSp,
              numericRuleSp,
              {
                token: "keyword.operator",
                regex: /\+|\-|\/|\*|=/
              },
              idRuleSp
           ],
           "b*_on": [
              {
                token: "keyword",
                regex: "\\s*\\bWHEN\\b(?=(\\s|$))",
                next: unshiftState("when")
              },
              {
                token: "keyword",
                regex: "\\s*\\bRECAP\\b\\s*", 
                next: unshiftState("b*_compute_inl")
              },
              {
                token: "keyword",
                regex: "\\s*\\bSUMMARIZE\\b\\s*", 
                next: unshiftState("b*_on_table_misc")
              },
              {
                token: "keyword",
                regex: "\\s*\\b(" + tk["onKeywords"] + ")\\b(?=(\\s|$))"
              },
              nextTablePhraseState,
              ampRule,
              stringRuleSp,
              dbStringMultilineRule,
              numericRuleSp,
              idRuleSp
           ],
           "b*_if": [ 
             tablePhrase(tk["ifKeywords"])
           ],
           "b*_by": [
             tablePhrase(tk["byKeywords"])
           ],
           "b*_across": [
             tablePhrase(tk["acrossKeywords"])
           ],
           "b*_for": [
             tablePhrase(tk["forKeywords"])
           ],
           "b*_hold": [
              stringRuleSp,
              {
                token: "keyword",
                regex: "\\s*\\b(" + hk["keywordsHoldRegPlusSS"] + ")\\b(?=(\\s|$))\\s*",
                next: unshiftState("holdIdentParm")
              },
              {
                token: "keyword",
                regex: "\\s*\\b(" + hk["keywordsHoldFormatSSoptsNum"] + ")\\b(?=(\\s|$))\\s*",
                next: unshiftState("holdNum")
              },
              {
                token: "keyword",
                regex: "\\s*\\b(" + hk["keywordsHoldIndex"] + ")\\b(?=(\\s|$))",
                next: unshiftState("holdIndex")
              },
              {
                token: "keyword",
                regex: "\\s*\\b(" + hk["keywordsHoldFormat"] + ")\\b(?=(\\s|$))",
                next: unshiftState("holdFormat")
              },
              {
                token: "keyword",
                regex: "\\s*\\b(" + hk["keywordsHoldKeyParm"] + ")\\b(?=(\\s|$))",
                next: unshiftState("holdKeyParm")
              },
              {
                token: "keyword",
                regex: "\\s*\\b(" + hk["keywordsHoldNoParmsAll"] + ")\\b(?=(\\s|$))",
              },
              {
                token: "keyword",
                regex: "^(?=(\\s*(" + tk["keywordFocusEnd"] + ")))",
                next: shiftToStart
              },
              {
                regex: "^(?=(\\s*(" + tk["keywordsFocus"] + ")))",
                onMatch: function(val, state, stack) {
                  if (hasAncestor(stack, "embed")) { 
                    return("keyword");
                  } 
                  else
                    return("identifier");
                },
                next: function(currentState, stack) {
                  if (hasAncestor(stack, "embed")) 
                    shiftToStart(null, stack); 
                  else if ((stack.length === 1) || (stack[1] === "start"))
                    stack.shift(); // standalone HOLD cmd; one line only
                  else
                    stack.unshift("dummyNonKeyword"); // to avoid infinite loop with "^(?=...)" rule
                  return stack[0] || "start";
                }

              },
              nextTablePhraseState, 
              ampRule,
              numericRuleSp
           ],
           "dummyNonKeyword" : [  // eats a non-keyword that the "^(?=...)" lookahead rule in
                                  // b*_hold did not. Avoids infinite loop b/c the above "^" rule
                                  // doesn't advance ptr
             { 
                token: "identifier",
                regex: "\\s*(" + tk["keywordsFocus"] + ")",
                next: function(currentState, stack) {
                    stack.shift(); return stack[0] || "start"; 
                }
             }
           ],
           "holdNum" : [
              {
                token: "constant.numeric",
                regex: numericRe,
                next: function(currentState, stack) {
                      while (stack[0] && stack[0] !== "b*_hold")
                          stack.shift();
                    return stack[0] || "start";
                  }
              }
           ],
           "holdIdentParm": [
             compoundLitVarRules(null, "b*_hold") 
           ],
           "strBody_holdIdentParm": [
             strBodyCreate(null, "b*_hold")
           ],
           "holdFormat": [
              ampRuleValPos,
              {
                token: "keyword",
                regex: "\\s*\\b(" + hk["keywordsHoldFormatTypeAll"] + ")\\b(?=(\\s|$))",
                next: function(currentState, stack) {
                      while (stack[0] && stack[0] !== "b*_hold")
                          stack.shift();
                    return stack[0] || "start";
                  }
              },
              {
                token: "identifier",
                regex: "\\S+" + "\\s*",
                next: function(currentState, stack) {
                      while (stack[0] && stack[0] !== "b*_hold")
                          stack.shift();
                    return stack[0] || "start";
                  }
              }
           ],
           "holdIndex": [
              ampRule,
              {
                token: "keyword",
                regex:  "\\b(" + hk["keywordsHoldRegPlusSS"] + ")\\b(?=(\\s|$))",
                next: function(currentState, stack) {
                      while (stack[0] && stack[0] !== "b*_hold")
                          stack.shift();
                      stack.unshift("holdIdentParm");
                      return stack[0];
                  }
              },
              {
                token: "keyword",
                regex: "\\b(" + hk["keywordsHoldIndex"] + ")\\b(?=(\\s|$))",
                next: function(currentState, stack) {
                      while (stack[0] && stack[0] !== "b*_hold")
                          stack.shift();
                      stack.unshift("holdIndex");
                      return stack[0];
                  }
              },
              {
                token: "keyword",
                regex: "\\s*\\b(" + hk["keywordsHoldFormat"] + ")\\b(?=(\\s|$))",
                next: function(currentState, stack) {
                      while (stack[0] && stack[0] !== "b*_hold")
                          stack.shift();
                      stack.unshift("holdFormat");
                      return stack[0];
                  }
              },
              {
                token: "keyword",
                regex: "\\b(" + hk["keywordsHoldKeyParm"] + ")\\b(?=(\\s|$))",
                next: function(currentState, stack) {
                      while (stack[0] && stack[0] !== "b*_hold")
                          stack.shift();
                      stack.unshift("holdKeyParm");
                      return stack[0];
                  }
              },
              {
                token: "keyword",
                regex: "\\b(" + hk["keywordsHoldNoParms"] + ")\\b(?=(\\s|$))",
                next: function(currentState, stack) {
                      while (stack[0] && stack[0] !== "b*_hold")
                          stack.shift();
                    return stack[0] || "start";
                  }
              },
              nextTablePhraseState
            ],
            "holdKeyParm": [
              ampRuleValPos, 
              {
                token: "keyword",
                regex: "\\b(" + hk["keywordsHoldParms"] + ")\\b(?=(\\s|$))",
                next: function(currentState, stack) {
                      while (stack[0] && stack[0] !== "b*_hold")
                          stack.shift();
                    return stack[0] || "start";
                  }
              }
              ],
           "sql": [
             {
                token: "keyword",
                regex: "\\b(" + "APT" + ")\\b",
                next: unshiftState("focus_misc")
             },
             {
                token: "keyword",
                regex: "\\b(" + "FMI|SET|PING|END" + ")\\b",  // to do: find more
                next: unshiftState("sql_body_oneline_or_ext")
             },
             {
                token: ["sql", "sql"],
                regex: "(\\bCOMMIT\\b)(\\s+WORK\\b)?",
                next: unshiftState("sql_body_oneline_or_ext")  // to do: sep state?
             },
             {
                token: "sql",
                regex: "\\b(" + tk["sqlKeywords"] + ")\\b",
                caseInsensitive: true,
                next: unshiftState("b*_sql_body_multiline")
             },
             {
                token : "keyword.operator",
                regex : /;\s*/, 
                next: function(currentState, stack) {
                    while (stack[0])  stack.shift(); 
                    stack.unshift("sql_extra"); return stack[0];        }
              },
             ampRule,
             stringRuleSp,
             numericRuleSp
           ],
           "b*_sql_body_multiline": [
              {
                token: "keyword",
                regex: /^\s*END\s*$/,
                next: shiftToStart
              },
              {
                token : "keyword.operator",
                regex : /;\s*/, 
                next: function(currentState, stack) {
                    while (stack[0])  stack.shift(); 
                    stack.unshift("sql_extra"); return stack[0];        }
              },
              {
                token: "comment",
                regex: sqlCommentRe
              },
              commentRuleAll,
              dmCommandrule, 
              {
                token: "sql",
                regex: "\\b(CASE|BEGIN)\\b",
                caseInsensitive: true,
                next: unshiftState("b*_sql_case")
              },
              {
                token: "sql",
                regex: "\\b(" + tk["sqlKeywords"] + "|SET" + ")\\b",
                caseInsensitive: true
                },
              ampRule,
              singStringRuleSp,
              dbStringRuleSp,
              numericRuleSp,
              idSqlRuleSp
           ],
           "sql_body_oneline_or_ext": [
              {
                token: "keyword",
                regex: "\\b(" + tk["sqlKeywordsOneLine"] + ")\\b"
              },
              {
                token: "keyword",
                regex: "\\b(" + tk["sqlKeywordsAttExt"] + ")\\b",
                next: unshiftState("b*_json_end")
              },
              ampRule,
              singStringRuleSp,
              dbStringRuleSp,
              numericRuleSp,
              {
                token: "idenfifier",
                regex: /^/,
                next: shiftToStart
              },
              idSqlRuleSp,
              {
                token: "identifier",
                regex: "[^\\s&]+"
              }
           ],
           "sql_extra": [
             commentRuleAll,
             {
                token : "keyword",
                regex : "\\bTABLE\\b\\s*($)?",
                next: unshiftState("b*_sql_extra_2nd")
             },
             {
                token : "keyword",
                regex : "\\bECHO\\s+(ON|OFF)\\b\\s*($)?",
                next: shiftToStart
             },
             {
                token : "identifier",
                regex : /(?=.)/,
                next: shiftToStart
             }
           ],
           "b*_sql_extra_2nd": [
             commentRuleAll,
             dmCommandrule,
             {
                token : "keyword",
                regex : "\\s*\\bWHERE\\b\\s*",
                next: function(currentState, stack) { 
                    stack.unshift("b*_table_file_body");
                    stack.unshift("b*_where"); return stack[0];  }
             },
             {
                token : "keyword",
                regex : "\\s*\\bIF\\b\\s*",
                next: function(currentState, stack) { 
                    stack.unshift("b*_table_file_body");
                    stack.unshift("b*_if"); return stack[0];  }
             },
             {
                token : "keyword",
                regex : "\\s*\\bON\\s+(" + tableStart + ")\\b\\s*",
                next: function(currentState, stack) { 
                    stack.unshift("b*_table_file_body");
                    stack.unshift("on_table"); return stack[0];  }
             },
             {
                token : "keyword",
                regex : "\\s*\\bFILE\\b\\s*",
                next: function(currentState, stack) {
                    while (stack[0])  stack.shift();
                    stack.unshift("table_file");
                    stack.unshift("table_file_name"); return stack[0];  }
             },
             {
                token : "identifier",
                regex : /(?=.)/,
                next: shiftToStart
             }
           ],

           "when": [
             stringRuleSp,
             {
                token : "identifier",
                regex : /^/,
                next: shiftToBaseState
             },
             ampRule,
             numericRuleSp,
             {
                token: "keyword.operator",            
                regex:  "\\b(" + exprKeys + ")\\b"
             }   
             ,{
                token: "keyword.operator",
                regex: "\\*|\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
             }
           ],
           "b*_sql_case":[
              commentRuleAll,
              {
                token: "comment",
                regex: sqlCommentRe    // to do: rule 
              },
              {
                token: "sql",
                regex: "\\b(CASE|BEGIN)\\b",
                caseInsensitive: true,
                next: unshiftState("b*_sql_case")
              },
              {
                token: "sql",
                regex: "\\b(" + tk["sqlKeywords"] + ")\\b",
                caseInsensitive: true
              },
              ampRule,
              singStringRuleSp,
              dbStringRuleSp,
              numericRuleSp,
              {
                token: "sql",
                regex: "\\b(END)\\b",
                next: function(currentState, stack) {
                        stack.shift(); return stack[0]; }
              },
              dmCommandrule
           ], 
           "app": [
              {
                token: "keyword",
                regex: "\\bDELETEF(ILE)?\\b",
                next: unshiftState("app_deletef")
              },
              {
                token: "keyword",
                regex: "\\b(" + tk["appKeywords"] + ")\\b"
              },
              ampRule,
              stringRuleSp,
              numericRuleSp,
              {
                token: "identifier",
                regex: /^/,  // EOL rule. ACE assigns "start" as autocomplete
                             // state if /$/ is used.
                next: shiftToStart
              },
              idRuleSp
           ],
            "app_deletef": [
              ampRule,
              stringRuleSp,
              numericRuleSp,
              {
                token: "keyword",
                regex: "\\bDEFAULT\\b"
              },
              {
                token: "identifier",
                regex: /^/,
                next: shiftToStart 
              }
           ],
           "engine": [ 
              {
                token: "identifier",
                regex: /^/,  // EOL rule. ACE assigns "start" as autocomplete
                             // state if /$/ is used.
                next: shiftToStart 
              },
              {
                token: "keyword",
                regex: "\\b(" + tk["engineKeywords"] + ")\\b"
              },
              {
                token: "keyword",
                regex: "\\b(" + tk["sqlKeywordsAttExt"] + ")\\b",
                next: unshiftState("b*_json_end")
              },
              numericRuleSp,
              {
                token: "identifier",
                regex: "[^\\s&]+"
              },
              ampRule,
              stringRuleSp
           ],
           "b*_json_end": [  // JSON block followed by END 
              {
                token: "identifier",
                regex: /:\{\}/
              },
              dmCommandrule,
              ampRule,
              dbStringRuleSp,
              numericRuleSp,
              {
                token: "keyword",
                regex: /^\s*END\s*$/,
                next: shiftToStart
              },
              {
                token: "keyword",
                regex: "\\s*\\b(" + jsonKwds  + ")\\b\\s*" 
              }
           ],
           "b*_dynam": [   
              dmCommandrule,
              {
                token: "keyword",
                regex: "((\\$SHARE|\\$HIPER|\\bFOC\\$HOLD)|\\b(" + tk["dynamKeywords"] + "))\\b"
              },
              ampRule,
              numericRuleSp,
              {
                token: "identifier",
                regex: /\-$/,  
                next: function(currentState, stack) {
                        return stack[0] || "start"; }
              },
              {
                token: "identifier",
                regex: /$/, 
                next: function(currentState, stack) {
                        while (stack[0]) stack.shift(); return "start"; }
              },
              stringRuleSp
           ],
      "b*_combine": [ 
              commentRule,
              cCommentRule,
              {
                token: "keyword",
                regex: "\\bAS\\b",
                next: function(currentState, stack) {
                        while (stack[0]) stack.shift(); return "start"; }
              },
              {
                token: "keyword",
                regex: "\\b(" + tk["combineKeywords"] + ")\\b"
              },
              ampRule,
              stringRuleSp,
              numericRuleSp,
              dmCommandrule
           ],
           "b*_filter": [ 
              commentRule,
              {
                token: "keyword",
                regex: /^\s*END\s*$/,
                next: shiftToStart
              },
              {
                token: "keyword",
                regex: "\\b(" + tk["filterKeywords"] + ")\\b"
              },
              ampRule,
              stringRuleSp,
              numericRuleSp,
              dmCommandrule
           ],
           "b*_scan": [ 
              commentRule,
              {
                token: "keyword",
                regex: "^\\s*(END|QUIT|FILE)\\s*$",
                next: shiftToStart 
              },
              {
                token: "keyword",
                regex: "\\b(" + tk["scanKeywords"] + ")\\b"
              },
              ampRule,
              stringRuleSp,
              numericRuleSp,
              dmCommandrule
           ],
           "b*_use": [
              commentRule,
              cCommentRule,
              {
                token: "keyword",
                regex: "CLEAR\\s*$",
                next: shiftToStart 
              },
              {
                token: "keyword",
                regex: "\\b(" + tk["keywordsUse"] + ")\\b\\s*",
              },
              {
                token: "keyword",
                regex: /^\s*END\s*$/,
                next: shiftToStart
              },
              dmCommandrule, 
              ampRule
           ],
         "check_file": [
              {
                token: "keyword",
                regex: "\\b(" + tk["checkKind"] + ")\\b\\s+",
                next: unshiftState("check_file_name")
              },
              ampRule
           ],
           "check_file_name": [
             compoundLitVarRules("check_file_parms", null)
           ],
           "strBody_check_file_parms": [
             strBodyCreate("check_file_parms", null)
           ],
           "check_file_parms": [
              commentRuleAll,
              {
                token: "keyword",
                regex: "\\b(" + tk["checkKeys"] + ")\\b\\s*"
              },
              {
                token: "operator",
                regex:  /^/,
                next: shiftToStart
              },
              ampRule,
              stringRuleSp,
              idRuleSp
           ],
           "filedef": [
              compoundLitVarRules("filedef_body", null)
           ],
           "strBody_filedef_body": [
             strBodyCreate("filedef_body", null)
           ],
           "filedef_body": [
              {
                token: "keyword.operator",
                regex:  /\(/
              },
              {
                token: "keyword",
                regex: "\\s*(" + tk["fiKeywords"] + ")(?=(\\s|$))",
                caseInsensitive: true
              },
              {
                token: "operator",
                regex:  /^/,
                next: shiftToStart
              },
              numericRuleSp,
              stringRuleSp,
              {
                token: "identifier",
                regex: "[^(\\s&]+"
              },
              ampRule //to do: compound?
           ],
           "b*_rebuild": [
              commentRule,
              cCommentRule,
              {
                token: "keyword",
                regex: "\\s*\\b(" + tk["rebuildKeywords"] + ")\\b\\s*"
              },
              ampRule, 
              numericRuleSp,
              stringRuleSp,
              {
                token: "keyword",
                regex: /^\s*END\s*$/,
                next: shiftToStart
              },
              {
                token: "keyword",
                regex: /^[ ]?-RUN/,
                next: shiftToStart
              },
              dmCommandrule
           ],
           "refresh": [ 
              {
                token: "keyword",
                regex: "\\s*\\b(" + tk["refreshKeywords"] + ")\\b\\s*"
              },
              ampRule, 
              numericRuleSp,
              stringRuleSp,
              {
                token: "keyword",
                regex: /^/,
                next: shiftToStart
              }
           ],
           "encr_decr": [ 
              {
                token: "keyword",
                regex: "\\b(" + tk["encrDecrKeywords"] + ")\\b\\s*"
              },
              ampRule, 
              numericRuleSp,
              stringRuleSp,
              {
                token: "identifier",
                regex: /^/,
                next: shiftToStart
              }
           ],
           "tabletalk": [ 
              {
                  token: "keyword", // TABLETALK uses encr/decr keywords
                regex: "\\b(" + tk["encrDecrKeywords"] + ")\\b\\s*"
              },
              ampRule, 
              numericRuleSp,
              stringRuleSp,
              {
                token: "identifier",
                regex: /^/,
                next: shiftToStart
              }
           ],
          "share_verb": [ 
              {
                token: "keyword",
                regex: "\\b(" + tk["shareKeywords"] + ")\\b\\s*$",
                next: unshiftState("b*_json_end")
              },
              ampRule
           ],
           "b*_compute": [
              {
                token: "keyword",
                regex: "FILE\\s+",
                next: unshiftState("define_file_aft")
              }
           ],
           "b*_compute_inl": [  // inline compute in a TABLE/MODIFY/MAINTAIN cmd
              {       
                  token: "variable",
                  regex:  ampKindRe + ampNameRe + "(\\.EVAL)?",
                  next: unshiftState("compute_inl_format")
              },
              { 
                  token: "identifier",
                  regex:  defcompNameRe + "\\s*", 
                  next: unshiftState("compute_inl_format")
              }
           ],
           "b*_compute_inl_2thru_n_table": [
              // inline compute in a TABLE command, 2nd thru n
              nextTablePhraseState,
              compute_inl_2thru_n
           ],
          "b*_compute_inl_2thru_n_modify": [   
             // inline compute in a MODIFY command 2nd thru n
             {  
                token: "keyword",
                regex: "^(?=\\s*(" + tk["keywordsModifyTmpfldEnd"] + "))",
                next: function(currentState, stack) {
                      while (stack[0] && (stack[0] !== "b*_modify_body"))
                          stack.shift();
                    return stack[0] || "start";
                 }
              },
              compute_inl_2thru_n
           ],
           "b*_compute_inl_2thru_n_maintain": [
             // inline compute in a MAINTAIN command 2nd thru n
             {  
                token: "keyword",
                regex: "^(?=\\s*(" + tk["maintainKeys"] + "))", 
                caseInsensitive: true,
                next: function(currentState, stack) {
                      while (stack[0] && (stack[0] !== "b*_maintain_body"))
                          stack.shift();
                    return stack[0] || "start";
                 }
              },
              {
                  token: "keyword",
                  regex: "^\\s*(" +  tk["keywordFocusEnd"] + ")\\s*$",
                  next: shiftToStart
              },
              compute_inl_2thru_n
           ],
           "define_file": [
              cCommentRule,
              {
                token: "keyword",
                regex: "FILE\\s+",
                next: unshiftState("define_file_aft")
              },
              {
                token: "keyword",
                regex: "FUNCTION\\s+",
                next: unshiftState("define_function_aft")
              },
              {
                token: "identifier",
                regex: "[\\S]+",               // error? 
                next: shiftToStart             // for now
              }
           ],
           "modify_file": [
              cCommentRule,
              {
                token: "keyword",
                regex: "FILE\\s+",
                next: unshiftState("modify_file_aft")
              },
              {
                token: "identifier",
                regex: "[\\S]+",               // error? 
                next: shiftToStart             // for now
              }
           ],
           "table_file": [
              cCommentRule,
              {
                token: "keyword",
                regex: "FILE\\b\\s*",
                next: unshiftState("table_file_name")
              },
              {
                token: "keyword",
                regex: "ON\\s+",
                next: shiftToStart
              },
           ],
           "join_file": [
              commentRule,
              cCommentRule,
              {
                token: "keyword",
                regex: "(" + tk["joinKeywords"]  + ")\\b\\s*",
                next: unshiftState("b*_join_file_body")
              },
              {
                token: "keyword",
                regex: "CLEAR\\s+",
                next: shiftToStart
              },
           ],
           "table_file_name": [
             compoundLitVarRules("b*_table_file_body", null)
           ],
           "strBody_b*_table_file_body": [  
             strBodyCreate("b*_table_file_body", null)
           ], 
           "match_file_name": [
             compoundLitVarRules("b*_table_file_body", null)
           ],
           "strBody_b*_table_file_body": [
             strBodyCreate("b*_table_file_body", null)
           ], 
           "modify_file_aft": [
             compoundLitVarRules("modify_file_which", null)
           ],
           "strBody_modify_file_which": [
             strBodyCreate("modify_file_which", null)
           ], 
           "define_file_aft": [
             compoundLitVarRules("define_file_which", null)
           ],
           "strBody_define_file_which": [
             strBodyCreate("define_file_which", null)
           ], 
           "define_function_aft": [
               {
                 token: "variable",
                 regex: ampRe + "(?=[\\(\\s])",
                 next: "define_function_which"
               },
               ampRule,
               {
                 token: "identifier",
                 regex: /&/
               },
               {
                 token: "identifier",
                 regex: /([^&( ]+)(?=[(\s])/,
                 next: "define_function_which"
               },
               {
                 token: "identifier",
                 regex: /[^&\( ]+/
               }
           ],
           "b*_table_file_body": [
              commentRuleAll,
              {
                token: "identifier",
                regex: /(\s*\b[A-Za-z]+(?=(&)))/,
              }
              ,
              {
                  token: "keyword",  // to do: can be followed by fn char or amp
                regex: "\\s*\\b(" + tk["subtOpersPrintRe"] + ")(?=(\\b|&|@))"
              },
              {
                token: "keyword",
                regex: "(\\s*\\b(" + tk["whereStart"] + ")(?=(\\s|$)))",
                next: unshiftState("b*_where")
              }
              ,
              {
                token: "keyword",
                regex: /(\s*\bIF(?=(\s|$)))/,
                next: unshiftState("b*_if")
              }
              ,
              {
                token: "keyword",
                regex: /(\s*\bBY(?=(\s|$)))/,
                next: unshiftState("b*_by")
              }
              ,
              {
                token: "keyword",
                regex: /(\s*\bACROSS(?=(\s|$)))/,
                next: unshiftState("b*_across")
              }
              ,
              {
                token: "keyword",
                regex: /(\s*\bFOR(?=(\s|$)))/,
                next: unshiftState("b*_for")
              }
              ,
              {
                token: "keyword",
                regex: "\\s*ON\\s+(" + tableStart + ")\\b\\s*",
                next: unshiftState("on_table")
              },
              {
                token: "keyword",
                regex: /\s*\bON\b\s*/,
                next: unshiftState("b*_on")
              },
              {
                token: "keyword",
                regex: "\\s*\\b(" + tk["compRecStart"] + ")\\b\\s*", 
                next: unshiftState("b*_compute_inl")
              },
              dmCommandrule,
              {
                token: "keyword",
                regex: /^\s*END\s*$/,
                next: shiftToStart
              },
              {
                token: "keyword",
                regex: "\\b(" + tk["keywordsTableGraph"]  + ")\\b\\s*"
              },
              onTableMatchOnlyKeywords(),
              ampRule,
              stringRuleSp,
              dbStringMultilineRule,
              numericRuleSp,
              idRuleSp
           ],
           "b*_join_file_body": [
              commentRule,
              cCommentRule,
              {
               token: "keyword",
               regex:  /^[ ]*WHERE/,
               next: unshiftState("join_where")
              },
              {
                token: "keyword",
                regex: "\\s*\\b(" + tk["joinKeywords"]  + ")\\b\\s*"
              },
              {
                token: "keyword",
                regex: /^\s*END\s*$/,
                next: shiftToStart
              },
              {
                token: "keyword",
                regex: /^(?=(\s*\?))/,
                next: shiftToStart
              },
              {
                token: "keyword",
                regex: "^(?=(\\s*(" + tk["keywordsFocus"] + ")\\b))",
                next: shiftToStart
              },
              {
                token: "keyword",
                regex: /^[ ]?-RUN/,
                next: shiftToStart
              },
              dmCommandrule,
              ampRule,
              stringRuleSp,
              numericRuleSp,
              idRuleSp
           ],
           "join_where": [
              commentRule,
              {
               token: "identifier",
               regex:  /;/,
               next: function(currentState, stack) 
                       { stack.shift(); return stack[0] || "start"; }
              },
              {
                token: "keyword",
                regex: "\\b(" + tk["joinWhereKeywords"] + ")\\b"
              },
              ampRule,
              stringRuleSp,
              numericRuleSp,
              idRuleSp
           ],
           "on_table": [
              commentRuleAll,
              ampRule,
              stringRuleSp,
              numericRuleSp,
              {
                token: "keyword",
                regex: "\\b(" + hk["keywordsHoldStart"] + ")\\b(?=(\\s|$))",
                next: unshiftState("b*_hold")
              },
              {
                token: "keyword",
                regex: "\\b(" + "SET"  + ")\\b(?=(\\s|$))",
                next: unshiftState("on_table_set")
              },
              {
                token: "keyword",
                regex: "\\b(" + tk["onTableKeywords"] + ")\\b(?=(\\s|$))",
                next: unshiftState("b*_on_table_misc")
              },
              onTableMatchOnlyKeywords(),
              {
                token: "keyword",
                regex: /^\s*END\s*$/,
                next: shiftToStart 
              }
           ],
           "set": [
             ampRule,
             stringRuleSp,
             numericRuleSp,
             {
               token: "keyword",
               regex: "\\b(" + tk["setKeywordsRe"] + ")(?=(\\s|=|$))",
               next: unshiftState("set_value")
             },
             {
               token: "operator",
               regex:  /^/,
               next: shiftToStart 
             },
           ],
           "set_value": [
             setValRuleCreate(shiftToStart)
           ],
           "on_table_set_value": [  
             setValRuleCreate(shiftToBaseState)
           ],
           "on_table_set": [
             {
             token: "keyword",
                regex: /\s*\bSTYLE\b\s*/,
                next: unshiftState("b*_on_table_set_style")
             },
             {
                token: "keyword",
                regex: "\\b(" + tk["setKeywordsRe"] + ")(?=(\\s|$))",
                next: unshiftState("on_table_set_value")
             },
             {
               token: "operator",
               regex:  /^/,
               next: shiftToBaseState
             },
             numericRuleSp,
             ampRule,
             stringRuleSp
           ],
           
           "b*_on_table_set_style": [
             commentRule,
             ampRule,
             stringRuleSp,
             numericRuleSp,
             {
                token: "keyword",
                regex: /^\s*ENDSTYLE\b/,
                next: function(currentState, stack) {
                   stack.shift();
                   return(shiftToBaseState(currentState, stack));
                }
             },
             {
               token: "keyword",
               regex: /^\s*END\b/,  // END ends STYLE *and* TABLE cmd
               next: shiftToStart 
             },
             dmCommandrule
           ],
           "b*_on_table_misc": [ 
             commentRuleAll,
             dmCommandrule,
             ampRule,
             stringRuleSp,
             dbStringMultilineRuleAnyPos,
             numericRuleSp,
             {
                token: "keyword",
                regex: "\\s*\\b(" + tk["subtOpersOnTabRe"] + ")"
             },
             {
                token: "keyword",
                regex: "\\s*\\b(" + hk["keywordsHoldStart"] + ")\\b(?=(\\s|$))",
                next: unshiftState("b*_hold")
             },
             {
                token: ["keyword","keyword"],
                regex: "(\\s*\\bINTO\\s+)(FILE\\b\\s*)"   // FILE is also a TABLE keyword, but not after INTO
             },
             {
                token: "keyword",
                regex: "\\s*\\b(" + tk["onTableKeywords"]  + ")\\b\\s*"
             },
             onTableMatchOnlyKeywords(),
             { 
                token: "keyword", 
                regex: "(?=(\\s*\\b(" + tk["keywordsTableGraph"] + ")\\b))",
                next: function(currentState, stack) {
                    while (stack[0] && (stack[0] !== "b*_table_file_body"))
                      stack.shift();
                    return stack[0] || "start"; }
              },
              {
                token: "keyword",
                regex: /^\s*END\s*$/,
                next: shiftToStart 
              }
           ],
           "define_file_which": [
              {
                token: "keyword",
                regex: "(\\s*(CLEAR)\\b(?=(\\s|$)))",
                next: unshiftState("define_end")
              },
              {
                token: "keyword",
                regex: "(\\s*(ADD)\\b(?=(\\s|$)))"
              },
              {
                  token: "identifier",
                  regex: "\\s*",
                  next: unshiftState("b*_define_lines")
              }
           ],
           "define_function_which": [
              {
                token: "keyword",
                regex: "(\\s*(CLEAR)\\b(?=(\\s|$)))",
                next: shiftToStart 
              }, 
              {
                token: "identifier",
                regex: /\s*\([^\)]*\)\s*$/,
                next: unshiftState("b*_define_function")
              }
           ],
           "maintain_file": [
              {
                token: "keyword",
                regex: "FILE\\b\\s*",
                next: unshiftState("maintain_file_name")
              },
              {
                token: "identifier",
                regex: /^(?=.)/,
                next: unshiftState("b*_maintain_body")
              }
           ],
           "maintain_file_name": [
             compoundLitVarRules("b*_maintain_body", null)
           ],
           "strBody_b*_maintain_body": [
             strBodyCreate("b*_maintain_body", null)
           ], 
           "b*_maintain_body": [
              commentAnywhereRule,
              ampRule,
              numericRuleSp,
              stringRuleSp,
              dbStringMultilineRuleAnyPos,
              {  
                  token: "keyword",
                regex: "^\\s*COMPUTE\\s*",
                caseInsensitive: true,
                next: unshiftState("b*_compute_inl")
              },
              {
                token: "keyword", // all maintain keywords in the same state
                regex: "\\s*\\b(" + tk["maintainKeys"] + ")\\b\\s*",
                caseInsensitive: true
              }, 
              {
                token: "keyword",
                regex: "^\\s*(" +  tk["keywordFocusEnd"] + ")\\s*$",
                next: shiftToStart 
              },
              dmCommandrule
           ],
           "modify_file_which": [
              {
                token: "keyword",
                regex: "(\\s*(" + tk["keywordsModifyFlgs"] + ")\\b)?",
                next: unshiftState("b*_modify_body")
              }
           ],
          "b*_modify_body": [
              commentRule,
              cCommentRule,
              ampRule,
              numericRuleSp,
              stringRuleSp,
              dbStringMultilineRuleAnyPos,
              {
                token: "identifier", 
                regex: "\\s*\\b(" + tk["modifyKeys"] + ")(?=(&))",
              },
              {
                token: "keyword", 
                regex: "\\s*\\bCOMPUTE\\s*$",
                next: unshiftState("modify_compute_nl")
              },
              {  // to do: VALIDATE
                    token: "keyword",
                    regex: "\\s*COMPUTE\\b\\s*",
                    next: unshiftState("b*_compute_inl")
              },
              {
                token: "keyword", // all modify keywords in the same state
                regex: "\\s*\\b(" + tk["modifyKeys"] + ")\\b\\s*"
              },
              {
                token: "keyword",
                regex: "^\\s*(" +  tk["keywordFocusEnd"] + ")\\s*$",
                next: shiftToStart 
              },
              dmCommandrule,
              idRuleSp
           ],
            "modify_compute_nl": [ 
              {
                token: "keyword", 
                regex: "(?=(" + tk["modifyKeys"] + ")\\b)",
                      next: function(currentState, stack) {
                  stack.shift(); return stack[0]; }
              },
              {
                token: "identifier", 
                regex: "(?=(" + defcompNameRe + ")\\b)",
                next: function(currentState, stack) {
                   stack.shift(); stack.unshift("b*_compute_inl"); 
                   return stack[0]; }

              },
            ],
            "define_end": [ 
              {
                token: "keyword",
                regex: /^\s*END\s*$/,
                next: shiftToStart 
              },
           ],
           "b*_define_lines": [
              commentRuleAll, 
              ampRule,
              {
                token: "keyword",
                regex: /^\s*END\s*$/,
                next: shiftToStart 
              },
              dmCommandrule,
              {
                token: "identifier",  // the define name
                regex:  defcompNameRe + "\s*", 
                next: unshiftState("define_format")
              }
           ],
          "b*_define_function": [
              commentRuleAll, 
              ampRule,
              {
                token: "keyword",
                regex: /^\s*END\s*$/,
                next: shiftToStart 
              },
              dmCommandrule,
              {
                  token: "identifier",  // the function name
                  regex:  defcompNameRe + "\s*",  
                  next: unshiftState("define_format")
              }
           ],
           "compute_inl_format": [
                  defcompFmtCommonRules("compute_inl_eq", "define_exp")
           ],
           "compute_inl_eq": [
                  defcompEqCommonRules("define_exp")
           ],
           "define_format": [
                  defcompFmtCommonRules("define_eq", "define_exp")
           ],
           "define_eq": [
                  defcompEqCommonRules("define_exp")
           ]
           ,
           "pardef_opts": [
                cCommentRule,
                {
                  token: "keyword",
                  regex: "\\s*\\b(" + tk["defineParDefKeys"] + ")\\b\\s*",
                  next: unshiftState("pardef_key")
                }
           ],
          "pardef_key": [
               cCommentRule,
               {
                  token: "keyword.operator",
                  regex: /\=/,
                  next: unshiftState("pardef_eq")
                },
           ],
          "pardef_eq": [
               cCommentRule,
               stringRuleSp,
               ampRule,
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
                    { stack.shift(); stack.shift(); stack.shift(); return stack[0]; }
                },
           ],
           "define_exp": [           // DEFINE or COMPUTE exp
             cCommentRule,
             stringRuleSp,
             {
                token : "keyword.operator",
                regex : /;/,
                     next: function(currentState, stack) {
                     shiftToBaseState(currentState, stack);
                     return(choose2thru_n_state(stack));
                }
             },
             {
                regex: /^\s*END\s*$/, // no semi on last DEFINE.
                onMatch: function(val, state, stack) {
                  if (hasAncestor(stack, "b*_define_lines")) {
                    while (stack[0]) stack.shift(); 
                    return("keyword");
                  } 
                  else
                    return("identifier");
                },
                next: function(currentState, stack) {
                  return stack[0] || "start" 
                }
             },
              ampRule,
              numericExpRule,
             {
                token: "keyword.operator",    
                regex:  "\\b" + "(" + exprKeys + ")" + "\\b"
             },{
                token: "keyword.operator",
                regex: "\\*|\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
             }
           ],
           "dm_command": [
              {
                token: "keyword",
                regex:  "SET\\s",
                next: unshiftState("dm_set")
              },{
                token: "keyword",
                regex:  "IF\\s",
                next: unshiftState("exp")
              },{
                token: "keyword",
                regex:  "HTMLFORM\\s",
                next: unshiftState("dm_htmlform")
              },{
                token: ["keyword", "comment"],
                regex:  "(RUN\\b)(\\s+.*$|$)",
                next: shiftToBaseState
              },{
                token: "keyword",
                regex:  "(TYPE[\+]?|TYPE0|TYPE1)\\s",
                next: unshiftState("dm_type")
              },{
                token: "keyword",
                regex:  "READ\\s+",
                next: unshiftState("dm_read")
              },{
                token: "keyword",
                regex:  "WRITE\\s",
                next: unshiftState("dm_write")
              },{
                token: "keyword",
                regex:  "REPEAT(?=\\s|$)\s*",
                next: unshiftState("dm_repeat")
              },{
                token: "keyword",
                regex:  "(REMOTE|FOCSTACK)(?=\\s|$)\s*",
                next: unshiftState("dm_begend")
              },{
                token: "keyword",
                regex:  /\?/,
                next: unshiftState("dm_qmark")
              },{
                token: "keyword",
                regex: "(" + dmk["keywordsDM_commands"] + ")\\b\\s*",  
                next: unshiftState("dm_general")
                // other DM commands: to do  
              },{
                token: "identifier",
                regex: "[\\S]+.*(?=$)",     // it's a label.
                next: shiftToBaseState
                // to do: -mylabel CMD?
              }
           ]
           ,
           "dm_general": [
                ampRule,
                stringRuleSp,
                numericRule,
                {
                    token: "identifier",
                    regex:  /^/,
                    next: shiftToBaseState
                }
           ]
           ,
           "dm_htmlform": [
                {
                    token: "keyword",
                    regex: /\b(BEGIN)\b/,
                    next: unshiftState("dm_htmlform_opts")
                },
                ampRule,
                stringRuleSp,
                numericRule,
                {
                  token: "identifier",
                  regex:  /^/,
                  next: shiftToBaseState
                }
           ]
           ,
           "dm_htmlform_opts": [
                {
                  token: "keyword",
                  regex: /\b(NOEVAL|SAVE|AS)\b/
                   },
                ampRule,
                stringRuleSp,
                numericRule,
                {
                  token: "identifier",
                  regex:  /^/,
                  next: unshiftState("b*_dm_htmlform_contents")
                }
           ]
           ,
           "b*_dm_htmlform_contents": [
                {
                  token: "keyword",
                  regex: /^\s*\-HTMLFORM\s+END\s*$/,
                  next: shiftToStart 
                },
                dmCommandrule,
                {
                   token: "variable",
                   regex: ampKindRe + ampNameRe + "\\.EVAL",
                },
                {
                   token: "variable",
                   regex: "!IBI\\.(" + htmlformEscs + ")\\.[^;\\s]+\\s*;"
                }
           ]
           ,
           "dm_read": [
              compoundLitVarRules("dm_read_rhs", null) 
           ],
           "strBody_dm_read_rhs": [
             strBodyCreate("dm_read_rhs", null)
           ],
          "dm_read_rhs": [
                {
                  token: "keyword",
                  regex: /\bNOCLOSE\b\s*/,
                },
                {
                  token: "variable",
                  regex: ampReadRe,
                },
                {
                  token: "operator",
                  regex: ";",
                  next: shiftToBaseState
                },
                {
                  token: "operator",
                  regex: /^[ ]?-[,]?\s*/
                }
           ]
           ,
           "dm_write": [
                {
                  token: "identifier",
                  regex: /\s+/,      // ws after ampers will match here too
                  next: unshiftState("dm_write_rhs")
                },
                ampRule
           ]
           ,
          "dm_write_rhs": [
                {
                  token: "keyword",
                  regex: /\bNOCLOSE\b\s*/
                   },
                ampRule,
                {
                  token: "operator",
                  regex:  /^/,
                  next: shiftToBaseState
                },
                {
                  token: "operator",
                  regex: /,\s*$/,
                  next: unshiftState("dm_write_cont")
                }
           ]
           ,
          "dm_write_cont": [
               {
                  token: "operator",
                  regex: "^[ ]?-",
                  next: function(currentState, stack) 
                    { stack.shift(); return stack[0]; }
               }
           ]
           ,
          "dm_begend": [
             {
                token: "keyword",
                regex:  dmk["dmBeginEnd"] +"(?=\\s|$)\\s*"
             },
             ampRule,
             stringRuleSp,
             numericRuleSp,
             {
               token: "identifier",
               regex:  /^/,
               next: shiftToBaseState
             }
           ],
           "dm_repeat": [
              compoundLitVarRules("dm_repeat_body", null) 
           ],
           "strBody_dm_repeat_body": [
             strBodyCreate("dm_repeat_body", null)
           ], 

           "dm_repeat_body": [
              {
                token: "keyword",
                regex:  /WHILE(?=\s|$)\s*/,
                next: unshiftState("exp")
              }
              ,
               {
                token: "keyword",
                regex:  /FOR(?=\s|$)\s*/,
                next: unshiftState("dm_repeat_for")
              }
              ,
              {
                token:  ["constant.numeric", "keyword"],
                regex:  /(\-?[0-9]+\s+)(TIMES\s*)/,
                next: shiftToBaseState
              }
              ,
              {
                token:  ["variable", "keyword"],
                regex:  "(" + ampKindRe + ampNameReBasic + ")(\\s+TIMES\\s*)",
                next: shiftToBaseState
              }
              ,
              {
                token:  ["variable", "variable", "keyword"],
                regex:  "(" + ampKindRe + ampNameReBasic + ")(\\.EVAL)?(\\s+TIMES\\s*)",
                next: shiftToBaseState
              }
           ]
           ,
         "dm_repeat_for": [
              compoundLitVarRules("dm_repeat_for_body", null) 
              ],
         "strBody_dm_repeat_for_body": [
           strBodyCreate("dm_repeat_for_body", null)
         ], 
         "dm_repeat_for_body": [
              {
                token: "keyword",
                regex:  "(" + dmk["keywordsDM_repeatFor"] + ")(?=\\s|$)\s*"
              }
              ,
              ampRule,
              {
                token:  "constant.numeric",
                regex:  /[0-9]+\s*/
              },
              {
                token:  "identifier",
                regex:  /^/,
                next: shiftToBaseState
              }
           ]
           ,
          "dm_type": [
             ampRule,
             stringRuleSp,
             {
                 token: "identifier",
                 regex: /^/,
                 next: shiftToBaseState
             }
           ]
           ,
         "dm_qmark": [
             ampRule,
             stringRuleSp,
             numericRuleSp,
             {
                token: "keyword",
                regex: "(" + dmk["dmQmark"] + ")\\b\\s*", 
             },{
                 token: "identifier",
                 regex: /^/,
                 next: shiftToBaseState
             }
           ]
           ,
           "dm_set": [{
                token: "variable",
                regex: "(" + ampKindRe + ")?" + ampNameRe +
                       "(\\.EVAL)?" +  "\\s*",
                next: unshiftState("dm_set_eq")
                }
             ,
             {
                token: "identifier",
                regex: /&/,
                next: unshiftState("dm_set_eq")
             }
           ]
           ,
           "dm_set_eq": [{
                token: "keyword.operator",
                regex: /=\s*/,
                next: unshiftState("exp")
             }
           ]
           ,
           "exp": [  // must end with a semicolon
             cCommentRule,
             stringMultiSetExpRuleSp,
             {
                token : "keyword.operator",
                regex : /;/,
                next: function(currentState, stack) {
                      shiftToBaseState(currentState, stack);
                      return(choose2thru_n_state(stack));
                }
             }
             ,
             ampRule,
             numericExpRuleSp,
             {
                token: "keyword.operator",            
                regex:  "\\b(" + exprKeys + ")\\b"
             }   
             ,{
                token: "keyword.operator",
                regex: "\\*|\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
             }
          ],
          "embed": [
             ampRule,
             numericRuleSp,
             commentAnywhereRule,
             {
                token : "keyword",
                regex : "\\s*\\b(MAIN|END)\\b\\s*",
                next: shiftToStart
             },
             {
                token : "keyword",
                regex : "\\s*\\b(BEGIN)\\b\\s+",
                next: unshiftState("embed_begin")
             },
             {
                token : "keyword",
                regex : "\\s*\\b(COMPONENT)\\b\\s*",
                next: unshiftState("b*_hold")
             },
             {
                token: "operator",
                regex:  /^/,
                next: shiftToStart
             },
          ],
          "embed_begin": [
             ampRule,
             numericRuleSp,
             {
                token : "keyword",
                regex : "\\s*\\b(HOLD|PCHOLD)\\b\\s*",
                next: unshiftState("b*_hold")
             },
             {
                token: "operator",
                regex:  /^/,
                next: shiftToStart
             }
          ],
          "dbStrMultiBody": [
                    ampRule,
                    {
                      token: "string",
                      regex: /&/
                    },
                    {
                      token: "string",
                      regex: '"',
                      next: function(currentState, stack) 
                          { stack.shift(); return stack[0]; }
                    },
                    {
                      token: "string",
                      regex: '[^"&]+',
                    }
          ],
         "strMultiBodySetExp": [
                    {
                      token: "variable",
                      regex: ampKindRe + ampNameRe + "\\.EVAL",
                    },
                    {
                      token: "string",
                      regex: /&/
                    },
                    {
                      token: "string",
                      regex: '\'',
                      next: function(currentState, stack) 
                          { stack.shift(); return stack[0]; }
                    },
                    {
                      token: "string",
                      regex: '[^\'&]+',
                    }
          ],
         "strMultiBody": [
                    ampRule,
                    {
                      token: "string",
                      regex: /&/
                    },
                    {
                      token: "string",
                      regex: '\'',
                      next: function(currentState, stack) 
                          { stack.shift(); return stack[0]; }
                    },
                    {
                      token: "string",
                      regex: '[^\'&]+',
                    }
          ],
          "strBody": [  // single line string body
            strBodyCreate(null, null)
          ],
          "singStrBody": [    // SQL single line single-quoted string body
             escStrBody("\'")
          ],
          "dbStrBody": [     
             escStrBody("\"") // JSON / SQL single line dbl-quoted string body
          ],
          "amp_parm": [
                  {
                      token: "variable",
                      regex: ampParens,
                      next: unshiftState("amp_after_parens")
                    },
                    {
                      token: "variable",
                      regex: "\\b(" + tk["ampKeysReg"] + ")\\b",
                      next: shiftOutOfAmp
                    },
                    {
                      token: "variable", 
                      regex: "\\b(" + tk["ampKeysEval"] + ")",
                      next: shiftOutOfAmp
                    },
                    {
                      token: "variable",
                      regex: "(" +ampFmt + ")\\.",
                      next: unshiftState("amp_after_parens")
                    },
                    {
                      token: "variable",
                      regex: "(" +ampFmt + ")\\b",
                      next: shiftOutOfAmp
                    },
                    {
                      token: "variable",
                      regex: /(?=\W)/,
                      next: shiftOutOfAmp
                    },
                    {  
                      token: "operator",
                      regex: /^/,           // Can't be keyword. 
                      next: shiftOutOfAmp
                    }

          ],
          "amp_after_parens": [
                    {
                      token: "variable",
                      regex: "\\b(" + tk["ampKeysReg"] + ")\\b",
                      next: shiftOutOfAmp
                    },
                    {
                      token: "variable",
                      regex: /(?=\W)/,
                      next: shiftOutOfAmp
                    },
                    {  
                      token: "operator",
                      regex: /^/,           // Can't be keyword. 
                      next: shiftOutOfAmp
                    }
          ]
        };
        this.normalizeRules();
    };
    oop.inherits(FocexecHighlightRules, TextHighlightRules);
    exports.FocexecHighlightRules = FocexecHighlightRules
});


ace.define("ace/mode/folding/focexec_folding", function(require, exports, module) {
    var oop = require("ace/lib/oop");
    var Range = require("ace/range").Range;
    var BaseFoldMode = require("ace/mode/folding/fold_mode").FoldMode;
    var FoldMode = exports.FoldMode = function() {};

    oop.inherits(FoldMode, BaseFoldMode);
    (function() {
        this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$/;
        this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])/;
           
        this.startRegionSqlRe = /^\s*(SQL\b(?!(\s+(APT\b|([^\s]+\s+(FMI\b|SET\b|PING\b|COMMIT\b|END\b))))))/;
        this.sqlIgnoreCommentRe = /(^[ ]?-\*|--).*(;|\bEND\b)/i;
        this.endRegionSqlRe = /(;|^\s*\bEND\b)/;  // to do: skip semi in quotes
        this.filedefRe = /^\s*(FILEDEF|FI|APP)\s/;
        this.semiRe = /;/;
        this.startRegionSqlInsideRe = /^[ ]*[^\-].*\b(CASE|BEGIN)\b/i;
        this.stopRegionSqlInsideRe = /(\bEND\b)/i;

        this.keywordsDM_commands = WcFexEditDmKeywords("keywordsDM_commands");

        var dmLabel = "[\\S]+";

        this.dmRe = new RegExp("^[ ]?-((" + this.keywordsDM_commands + "|" + dmLabel + ")\\b|\\?)");
                
        this.foldMarkers = [
        {
          "ruleId":"wf_fex",
          "foldStartMarker":/^\s*(TABLE[F]?\s+FILE\b|DEFINE\s+FILE\b|COMPUTE\s+FILE\b|GRAPH\s+FILE\b|MATCH\s+FILE\b|MODIFY\b|MAINTAIN\b)/,
          "foldStopMarker": /(^\s*END\s*$)/,
        },
        {
          "ruleId":"wf_single_line_comments",
          "foldStartMarker":/^\s*(\-\*)/,
          "foldStopMarker":""
        },
        {
          "ruleId":"wf_style",
          "foldStartMarker":/(^\s*ON\s+TABLE\s+SET\s+STYLE(SHEET)?\b|^\s*ON\s+GRAPH\s+SET\s+STYLE(SHEET)?\b)/,
          "foldStopMarker":/(^\s*ENDSTYLE\b|^\s*END\s*$)/
        },
        {   
          "ruleId":"wf_dm",
          "foldStartMarker": this.dmRe,
          "foldStopMarker":/^[ ]?-/
        },
        {
          "ruleId":"wf_dm_htmlform",
          "foldStartMarker":/^[ ]?-HTMLFORM\s+BEGIN\b/,
          "foldStopMarker":/^[ ]?-HTMLFORM\s+END\b/
        },
        {
          "ruleId":"table_after_sql",
          "foldStartMarker":/^\s*TABLE\s+(ON|WHERE)\b/,
          "foldStopMarker":/(^\s*END\s*$)/
        }
      ];

      this.getFoldMarkersWithEnd = function()
      {
        var foldMarkersWithEnd = this.foldMarkers.filter(function(markEl) {
            return ((markEl.ruleId !== "wf_dm")                        &&
                    ((typeof markEl.foldStopMarker !== "string") || 
                     (markEl.foldStopMarker.length > 0))               &&
                    markEl.foldStopMarker.test("END"));
        });
        return foldMarkersWithEnd;
      };

      this.foldMarkersWithEnd = this.getFoldMarkersWithEnd();
      
      this._getFoldWidgetBase = this.getFoldWidget;
      this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
        if (!fw && this.testLineForStartMarker(session, "", row, line))
          return "start";
        if (!fw && this.startRegionSqlRe.test(line) &&  
            (!this.semiRe.test(line))) // not a single line SQL cmd?
          return "start";
        if (fw && this.filedefRe.test(line))
            fw = ""; // FILEDEF had an open paren but no optional close.

        // Show closing code fold markers for SQL block     
        if (!fw && foldStyle == "markbeginend" && 
            (this.isSqlStopMarker(line) === true))
        {
          var rangeObj = this.getSqlContentFoldRangeBackward(session, line, row);
          if (rangeObj !== null)
          {
            if (rangeObj.blockType === "sql")
              return "end";
            else
              return fw;
          }
        }

        // Show closing code fold markers  
        var stopBlockType = this.testLineForStopMarker(session, foldStyle, row, line);  
        if (!fw && foldStyle == "markbeginend" && stopBlockType)
        {
          if (this.getContentFoldRangeBackward(session, line, row, stopBlockType) !== null)
            return "end";
        }

        return fw
      };


      this.canEndWithEnd = function(blockType)
      {
        for (var i = 0; i < this.foldMarkersWithEnd.length; i++)
        {
          if (this.foldMarkersWithEnd[i].ruleId === blockType) 
            return true;
        }
        return false;
      }

      this.testLineForStartMarker = function (session, foldStyle, row, line)
      {
        var startMarker = false;
        var ruleId = "";
        var ruleStartMarkerRE = null;
        var ruleStopMarkerRE = null;
        
        var foldingMarkersLength = this.foldMarkers.length;
        
        for(var i = 0; i < foldingMarkersLength; i++)
        {
          ruleId = this.foldMarkers[i].ruleId;
          ruleStartMarkerRE = this.foldMarkers[i].foldStartMarker;
          ruleStopMarkerRE = this.foldMarkers[i].foldStopMarker;
           
          if(ruleId == "wf_dm" || ruleId == "wf_single_line_comments")
          {
            var currentLineStatus = ruleStartMarkerRE.test(line);
             
            if(currentLineStatus)
            {
              var prevline = session.getLine(row-1);
              var nextline = session.getLine(row+1);
               
              var prevLineStatus = ruleStartMarkerRE.test(prevline);
              var nextLineStatus = ruleStartMarkerRE.test(nextline);
  
              startMarker = !prevLineStatus && nextLineStatus;
            }
          }
          else
          {
            startMarker = ruleStartMarkerRE.test(line);
            if ((startMarker === true)         &&
                (ruleId === "table_after_sql") && 
                ((row < 1) || (!this.semiRe.test(session.getLine(row - 1)))))
              startMarker = false;
          }
           
          if(startMarker)
            break;
        }
        
        return startMarker ? ruleId : undefined;
      };     


      this.testLineForStopMarker = function (session, foldStyle, row, line)
      {
        var stopMarker = false;
        var ruleId = "";
        var ruleStartMarkerRE = null;
        var ruleStopMarkerRE = null;
        
        var foldingMarkersLength = this.foldMarkers.length;
        
        for (var i = 0; i < foldingMarkersLength; i++)
        {
          ruleId = this.foldMarkers[i].ruleId;
          ruleStartMarkerRE = this.foldMarkers[i].foldStartMarker;
          ruleStopMarkerRE = this.foldMarkers[i].foldStopMarker;
           
          if(ruleId == "wf_dm" || ruleId == "wf_single_line_comments")
          {
            var currentLineStatus = ruleStartMarkerRE.test(line);
             
            if(currentLineStatus)
            {
              var prevline = session.getLine(row-1);
              var nextline = session.getLine(row+1);
               
              var prevLineStatus = ruleStartMarkerRE.test(prevline);
              var nextLineStatus = ruleStartMarkerRE.test(nextline);
  
              stopMarker = prevLineStatus && !nextLineStatus;
            }
          }
          else
            stopMarker = ruleStopMarkerRE.test(line);
           
          if (stopMarker)
             break;
        }
        
        return stopMarker ? ruleId : undefined;
      };


      this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) 
      {
        var line = session.getLine(row);

        var startBlockType = this.testLineForStartMarker(session, foldStyle, row, line);
        if (startBlockType)
          return this.getContentFoldRange(session, line, row, startBlockType);

        if (this.startRegionSqlRe.test(line)) 
        {
          sqlrange = this.getRegionBlockSql(session, line, row);
          if (sqlrange) return (sqlrange);
        }
        var match = line.match(this.foldingStartMarker);
        if ((match) && (!(this.filedefRe.test(line))))
        {
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

        // SQL blocks cannot be nested inside any other block, so check for SQL block first.
        if (this.isSqlStopMarker(line) === true)
        {
          var rangeObj = this.getSqlContentFoldRangeBackward(session, line, row);
          if (rangeObj && rangeObj.blockType === "sql")
            return(rangeObj.range); 
        }

        var stopBlockType = this.testLineForStopMarker(session, foldStyle, row, line);
        if (stopBlockType)
          return this.getContentFoldRangeBackward(session, line, row, stopBlockType);

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
          var maxRow = session.getLength();
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

      this.getContentFoldRange = function(session, line, row, startBlockType)
      {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        var depth = 1;
        
        while (++row < maxRow) 
        {
              line = session.getLine(row);

              var foundStartBlockType = this.testLineForStartMarker(session, "", row, line);
              var foundStopBlockType = this.testLineForStopMarker(session, "", row, line);

                    if (!this.canEndWithEnd(startBlockType))
                    {
                      if (foundStopBlockType === startBlockType)
                        break;
                      else 
                        continue;
                    }
                    else
                    {
                      if (foundStartBlockType && (!this.canEndWithEnd(foundStartBlockType)))
                        continue;
                      if (foundStopBlockType && (!this.canEndWithEnd(foundStopBlockType)))
                        continue;
                    }

              if (foundStartBlockType) depth++;
              else if (foundStopBlockType) depth--;

              if (!depth) break;
          }

          var endRow = row;
          if (endRow > startRow) {
              return new Range(startRow, startColumn, endRow, line.length);
          }
      };

      this.getContentFoldRangeBackward = function(session, line, row, stopBlockType)
      {
        var endColumn = line.length;
        var endRow = row;
        var depth = 1;
        
        while (--row > -1) 
        {
              line = session.getLine(row);

              var foundStartBlockType = this.testLineForStartMarker(session, "", row, line);
              var foundStopBlockType = this.testLineForStopMarker(session, "", row, line);

                    if (foundStartBlockType)
                    { 
                      if ((stopBlockType === foundStartBlockType) && 
                          (!this.canEndWithEnd(stopBlockType)) && (depth === 1))
                        break;
                      // Match the block type of stop marker to that of the start marker
                      if (stopBlockType !== foundStartBlockType)
                      {
                        if (!this.canEndWithEnd(stopBlockType))
                          continue;
                        // check rules that can have END as stop marker
                        var canStopBlkTypHaveEnd = false, canStartBlkTypHaveEnd = false;
                        for (var i = 0; i < this.foldMarkersWithEnd.length; i++)
                        {
                          if (this.foldMarkersWithEnd[i].ruleId === stopBlockType)
                            canStopBlkTypHaveEnd = true;
                          if (this.foldMarkersWithEnd[i].ruleId === foundStartBlockType)
                            canStartBlkTypHaveEnd = true;
                        }
                        if (!canStopBlkTypHaveEnd || !canStartBlkTypHaveEnd)  // to do: use canEndWithEnd() ? 
                        {  
                          foundStartBlockType = undefined;
                        }
                      }
                    }
 
                    if (foundStartBlockType) 
                      depth--;
                    else if (foundStopBlockType)
                    {  
                      if (this.canEndWithEnd(stopBlockType) !== this.canEndWithEnd(foundStopBlockType))
                        continue;
                      depth++; 
                    }

              if (!depth) break;
          }

          var startRow = row;
          var startColumn = line.length;

          if (startRow < endRow) {
                    if (startRow < 0 && depth > 0)
                      return null;
              return new Range(startRow, startColumn, endRow, endColumn);
          }
      };

      this.isSqlStopMarker = function(line) {
        return (this.endRegionSqlRe.test(line) &&
                (this.sqlIgnoreCommentRe.test(line) === false) &&
                (this.dmRe.test(line) === false));
      };

      this.getSqlContentFoldRangeBackward = function(session, line, row) 
      {
        var endColumn = line.length;
        var endRow = row;
        var depth = 1;
        var isStartMarker, foundRegStartMarker, isStopMarker;
        
        while (--row > -1) 
        {
          line = session.getLine(row);

          foundRegStartBlockType = this.testLineForStartMarker(session, "", row, line);
          if (foundRegStartBlockType && (foundRegStartBlockType !== "wf_dm") &&
              (foundRegStartBlockType !== "wf_single_line_comments"))
            return (null);    // end marker is not part of SQL block
                      
          isStartMarker = this.startRegionSqlRe.test(line);
          if (isStartMarker)
          {
            if (depth > 1) 
              return null;  // End marker is not part of previous SQL block
            else
              break;  // End marker ends an SQL block.
          }
          isStopMarker = this.isSqlStopMarker(line);
          if (!isStopMarker && (this.sqlIgnoreCommentRe.test(line) === false) &&
              (this.dmRe.test(line) === false))
          { 
            isStartMarker = this.startRegionSqlInsideRe.test(line);
            isStopMarker = this.stopRegionSqlInsideRe.test(line);
          }

          if (isStartMarker) depth--;
          else if (isStopMarker) depth++;

          if (!depth) break;
        }

        var startRow = row;
        var startColumn = line.length;

        if (startRow < endRow) 
        {
          if (startRow < 0 && depth > 0)  
            return null;    // Orphan END or semi at top of file
          if (depth < 1)
            return {"blockType": "case"};
          return {
                   "blockType": "sql", 
                   "range": new Range(startRow, startColumn, endRow, endColumn) 
                 };
        }
      };

      this.getRegionBlockSql = function(session, line, row) {
            var startColumn = line.search(/\s*$/);
            var maxRow = session.getLength();
            var startRow = row;
            var re = /(;|^\s*END\b)/; 
            var depth = 1;
            var caseDepth = 0;
            var m = null;
            for ( ; row < maxRow; row++)  {
                line = session.getLine(row);
                if (this.startRegionSqlInsideRe.test(line))
                    caseDepth++;
                if (caseDepth)
                { 
                  if (line.match(/^[ ]*-[\-*]/))
                    m = null; // skip comment line.  
                  else
                    m = this.stopRegionSqlInsideRe.exec(line);
                }
                else
                {
                  if (line.match(/^[ ]?-/) ||
                      line.match(/^[ ]*-[\-*]/))
                    m = null;  // skip DM/comment line. Could have semi or 'end'
                  else
                    m = re.exec(line);
                }
                if (!m)
                  continue;
                if (m && caseDepth > 0)
                {
                  caseDepth--; 
                  continue;
                }
                else if (m && caseDepth == 0)
                  break;
                if (m[1]) depth--;
                else depth++;
                if (!depth) break;
            }
            var endRow = row;
            if (endRow > startRow) return new Range(startRow, startColumn, endRow, line.length)
            else
              return null;
        }
    }).call(FoldMode.prototype)
});

//# sourceURL=mode-focexec.js
