/*------------------------------------------------------------------
* Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.
*
* _Name_        ===> ace/wc_fexmas_expr.js
* _Description_ ===>
*
* _History_:
*  Date  Time Who Proj       Project Title
* ====== ==== === ====== ===========================================
* 190802 1427 dpd 209887 Text editor: Phase 2 epic
* 190802 1137 dpd 209887 Text editor: Phase 2 epic
*
* END %&$
*-------------------------------------------------------------------*/

// Expression keywords. Shared by fexes and masters.
function WcFexEditFuncKeywords(keygroup) {
    var kwords = {
      "internalFunctions" : "ABS|ASIS|DMY|MDY|YMD|DECODE|EDIT|FIND|LAST|LOG|LOOKUP|MAX|MIN|SQRT",
      "characterFunctions" : "ARGLEN|ASIS|BITSON|BITVAL|BYTVAL|CHKFMT|CTRAN|CTRFLD|EDIT|GETTOK|LCWORD|LCWORD2|LCWORD3|LJUST|LOCASE|OVRLAY|PARAG|POSIT|REVERSE|RJUST|SOUNDEX|SPELLNM|SQUEEZ|STRIP|STRREP|SUBSTR|TRIM|UPCASE",
      "simplifiedCharacterFunctions" : "CHAR_LENGTH|CONCAT|DIGITS|GET_TOKEN|INITCAP|LOWER|LPAD|LTRIM|PATTERNS|POSITION|REGEX|REPLACE|RPAD|RTRIM|SPLIT|SUBSTRING|TOKEN|TRIM|UPPER",
      "variableLengthCharacterFunctions" : "LENV|LOCASV|POSITV|SUBSTV|TRIMV|UPCASV",
      "dbcsCharacterFunctions" : "DCTRAN|DEDIT|DSTRIP|DSUBSTR|JPTRANS",
      "maintainSpecificCharacterFunctions" : "CHAR2INT|INT2CHAR|LCWORD|LCWORD2|LENGTH|LJUST|LOWER|MASK|MNTGETTOK|NLSCHR|OVRLAY|POSIT|RJUST|SELECTS|STRAN|STRCMP|STRICMP|STRNCMP|SUBSTR|TRIM|TRIMLEN|UPCASE",
      "dataSourseDecodingFunctions" : "DB_EXPR|DB_INFILE|DB_LOOKUP|DECODE|FIND|LAST|LOOKUP",
      "standardDateFunctions" : "DATEADD|DATECVT|DATEDIF|DATEMOV|DATETRAN|DPART|FIYR|FIQTR|FIYYQ|HMASK|TODAY",
      "legacyDateFunctions" : "AYM|AYMD|CHGDAT|DA|DADMY|DADYM|DAMDY|DAMYD|DAYDM|DAYMD|DMY|MDY|YMD|DOWK|DOWKL|DT|DTDMY|DTDYM|DTMDY|DTMYD|DTYDM|DTYMD|GREGDT|JULDAT|YM",
      "dateTimeFunctions" : "HADD|HCNVRT|HDATE|HDIFF|HDTTM|HEXTR|HGETC|HMASK|HHMMSS|HINPUT|HMIDNT|HNAME|HPART|HSETPT|HTIME|HTMTOTS|TIMETOTS",
      "simplifiedDateTimeFunctions" : "DTADD|DTDIFF|DTPART|DTRUNC",
      "maintainSpecificDateTimeFunctions" : "HHMMSS|Initial_HHMMSS|Initial_TODAY|TODAY|TODAY2",
      "maintainSpecificLegacyDateTimeFunctions" : "ADD|DAY|JULIAN|MONTH|QUARTER|SETMDY|SUB|WEEKDAY|YEAR",
      "formatConversionFunctions" : "ATODBL|EDIT|FPRINT|FTOA|HEXBYT|ITONUM|ITOPACK|ITOZ|PCKOUT|PTOA|TSTOPACK|UFMT|XTPACK",
      "numericFunctions" : "ABS|ASIS|BAR|CHKPCK|DMOD|FMOD|IMOD|EXP|EXPN|FMLINFO|FMLLIST|FMLFOR|FMLCAP|INT|LOG|MAX|MIN|MIRR|NORMSDST|NORMSINV|PRDNOR|PRDUNI|RDNORM|RDUNIF|SQRT|XIRR",
      "systemFunctions" : "CLSDDREC|FEXERR|FINDMEM|GETPDS|GETUSER|MVSDYNAM|PUTDDREC|SLEEP|SPAWN|SYSTEM|SYSVAR",
      "statFunctions" : "CORRELATION|KMEANS_CLUSTER|MULTIREGRESS|RSERVE|STDDEV",
       "operators" : "ELSE|EQ|GE|GOTO|GT|IF|IS|LT|LE|NE|THEN|FROM|TO|LIKE|CONTAINS|OMITS",
       "exprLogic" : "AND|OR"
     };
     kwords["functions"] = kwords["internalFunctions"] + "|" + kwords["characterFunctions"] + "|" + kwords["simplifiedCharacterFunctions"] + "|" + kwords["variableLengthCharacterFunctions"] + "|" + kwords["dbcsCharacterFunctions"] + "|" + kwords["maintainSpecificCharacterFunctions"] + "|" + kwords["dataSourseDecodingFunctions"] + "|" + kwords["standardDateFunctions"] + "|" + kwords["legacyDateFunctions"] + "|" + kwords["dateTimeFunctions"] + "|" + kwords["simplifiedDateTimeFunctions"] + "|" + kwords["maintainSpecificDateTimeFunctions"] + "|" + kwords["maintainSpecificLegacyDateTimeFunctions"] + "|" + kwords["formatConversionFunctions"] + "|" + kwords["numericFunctions"] + "|" + kwords["systemFunctions"] + "|" + kwords["statFunctions"];

     if (keygroup)
       return(kwords[keygroup]);
     else
       return(kwords);
};
//# sourceURL=ace%wc_fexmas_expr.js
