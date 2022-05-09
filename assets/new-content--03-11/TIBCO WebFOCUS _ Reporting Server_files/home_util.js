/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.39 $:

var height = 700;
var width = 1200;
var topPos = ((screen.height - height) / 2)-50;
var left = (screen.width - width) / 2;

$.fn.mirror = function (selector) {	
	
    return this.each(function () {
        var $this = $(this);
        var $selector = $(selector);
        $this.bind('keyup', function () {        	
        	var value = $(this).ibxWidget('option', 'text');
        	value = home_globals.homePage.replaceDisallowedChars(value);	
            $selector.ibxWidget('option', 'text', value);
        });
    });
};

function iscrollIntoView($item, $parent) {
    var borderTop = parseFloat($.css($parent[0], 'borderTopWidth')) || 0,
        paddingTop = parseFloat($.css($parent[0], 'paddingTop')) || 0,
        offset = $item.offset().top - $parent.offset().top - borderTop - paddingTop,
        scroll = $parent.scrollTop(),
        elementHeight = $parent.height(),
        itemHeight = $item.outerHeight();

        if (offset < 0) {
            $parent.scrollTop(scroll + offset);
        } else if (offset + itemHeight > elementHeight) {
            $parent.scrollTop(scroll + offset - elementHeight + itemHeight);
        }
}


function decodeHtmlEncoding(desc)
{
	var isoLatin1 = 
	{
		"&nbsp;" : "&#160;", // non-breaking space 
		"&iexcl;"	:"&#161;",
		"&cent;" : "&#162;", // cent sign 
		"&pound;": "&#163;",
		"&curren;" : "&#164;", // currency sign 
		"&pound;"	:"&#163;",
		"&yen;"		:"&#165;", 
		"&brvbar;" : "&#166;", // broken bar = broken vertical bar 
		"&sect;"	:"&#167;",
		"&uml;" : "&#168;", // diaeresis = spacing diaeresis 
		"&copy;" : "&#169;", // copyright sign 
		"&ordf;" : "&#170;", // feminine ordinal indicator 
		"&laquo;" : "&#171;", // left-pointing double angle quotation mark = left pointing guillemet 
		"&not;" : "&#172;", // not sign 
		"&shy;" : "&#173;", // soft hyphen = discretionary hyphen 
		"&reg;" : "&#174;", // registered trademark sign 
		"&macr;" : "&#175;", // macron = spacing macron = overline = APL overbar 
		"&deg;"		:"&#176;",
		"&plusmn;"  :"&#177;",
		"&sup2;"	:"&#178;",
		"&sup3;"	:"&#179;",
		"&acute;" : "&#180;", // acute accent = spacing acute 
		"&micro;"	:"&#181;",
		"&para;" : "&#182;", // pilcrow sign = paragraph sign 
		"&middot;" : "&#183;", // middle dot = Georgian comma = Greek middle dot 
		"&cedil;" : "&#184;", // cedilla = spacing cedilla 
		"&sup1;" : "&#185;", // superscript one = superscript digit one 
		"&ordm;" : "&#186;", // masculine ordinal indicator 
		"&raquo;" : "&#187;", // right-pointing double angle quotation mark = right pointing guillemet 
		"&frac14;" : "&#188;", // vulgar fraction one quarter = fraction one quarter 
		"&frac12;" : "&#189;", // vulgar fraction one half = fraction one half 
		"&frac34;" : "&#190;", // vulgar fraction three quarters = fraction three quarters 
		"&iquest;"	:"&#191;",
		"&Agrave;"	:"&#192;", 	
		"&Aacute;"	:"&#193;",
		"&Acirc;"	:"&#194;",
		"&Atilde;"	:"&#195;",
		"&Auml;"	:"&#196;", 	
		"&Aring;"	:"&#197;", 	
		"&AElig;"	:"&#198;", 	
		"&Ccedil;"	:"&#199;", 	
		"&Egrave;"	:"&#200;", 	
		"&Eacute;"	:"&#201;",
		"&Ecirc;"	:"&#202;", 	
		"&Euml;"	:"&#203;", 	
		"&Igrave;"	:"&#204;", 	
		"&Iacute;"	:"&#205;",
 		"&Icirc;"	:"&#206;", 	 	
	 	"&Iuml;"	:"&#207;", 	 	
	 	"&ETH;"		:"&#208;", 	 	
		"&Ntilde;"	:"&#209;", 	  	 	 	
	 	"&Ograve;"	:"&#210;", 	
		"&Oacute;"	:"&#211;",
	 	"&Ocirc;"	:"&#212;", 	 
	 	"&Otilde;"	:"&#213;", 	
	 	"&Ouml;"	:"&#214;", 	 	
		"&times;":	"&#215;", // Multiplication
	 	"&Oslash;"	:"&#216;", 	
	 	"&Ugrave;"	:"&#217;", 	
		"&Uacute;"	:"&#218;",
	 	"&Ucirc;"	:"&#219;", 	 
	 	"&Uuml;"	:"&#220;", 	 	
	 	"&Yacute;"	:"&#221;", 	
	 	"&THORN;"	:"&#222;", 	 
	 	"&szlig;"	:"&#223;", 	 
	 	"&agrave;"	:"&#224;", 	
		"&aacute;"	:"&#225;",
	 	"&acirc;"	:"&#226;", 	 
	 	"&atilde;"	:"&#227;", 	
	 	"&auml;"	:"&#228;", 	 	
	 	"&aring;"	:"&#229;", 	 
	 	"&aelig;"	:"&#230;", 	 
	 	"&ccedil;"	:"&#231;", 	
	 	"&egrave;"	:"&#232;", 	
		"&eacute;"	:"&#233;",
	 	"&ecirc;"	:"&#234;", 	 
	 	"&euml;"	:"&#235;", 	 	
	 	"&igrave;"	:"&#236;", 	
		"&iacute;"	:"&#237;",
	 	"&icirc;"	:"&#238;", 	 
	 	"&iuml;"	:"&#239;", 	 	
	 	"&eth;"		:"&#240;", 	 	
		"&ntilde;"	:"&#241;",	  	 	 	
	 	"&ograve;"	:"&#242;", 	
		"&oacute;"	:"&#243;",
	 	"&ocirc;"	:"&#244;", 	 
	 	"&otilde;"	:"&#245;", 	
	 	"&ouml;"	:"&#246;",		
		"&divide;" : "&#247;", // division sign 
	 	"&oslash;"	:"&#248;", 	
	 	"&ugrave;"	:"&#249;", 	
		"&uacute;"	:"&#250;",
	 	"&ucirc;"	:"&#251;", 	 
	 	"&uuml;"	:"&#252;", 	 	
	 	"&yacute;"	:"&#253;", 	
	 	"&thorn;"	:"&#254;", 	 
	 	"&yuml;"	:"&#255;", 	 
		"&Amacr;"	:"&#256;", 
		"&amacr;"	:"&#257;", 
		"&Abreve;"	:"&#258;",
		"&abreve;"	:"&#259;", 
		"&Aogon;"	:"&#260;", 
		"&aogon;"	:"&#261;", 
		"&Cacute;"	:"&#262;", 
		"&cacute;"	:"&#263;",	 
		"&Ccirc;"	:"&#264;", 
		"&ccirc;"	:"&#265;", 
		"&Cdot;"	:"&#266;", 
		"&cdot;"	:"&#267;", 
		"&Ccaron;"	:"&#268;", 
		"&ccaron;"	:"&#269;", 
		"&Dcaron;"	:"&#270;", 
		"&dcaron;"	:"&#271;", 
		"&Dstrok;"	:"&#272;", 
		"&dstrok;"	:"&#273;",	//U00111, LATIN SMALL LETTER D WITH STROKE       , 
		"&Emacr;"	:"&#274;",	//U00112, LATIN CAPITAL LETTER E WITH MACRON     , 
		"&emacr;"	:"&#275;",	//U00113, LATIN SMALL LETTER E WITH MACRON       , 
		"&Edot;"	:"&#278;",	//U00116, LATIN CAPITAL LETTER E WITH DOT ABOVE  , 
		"&edot;"	:"&#279;",	//U00117, LATIN SMALL LETTER E WITH DOT ABOVE    , 
		"&Eogon;"	:"&#280;",	//U00118, LATIN CAPITAL LETTER E WITH OGONEK     , 
		"&eogon;"	:"&#281;",	//U00119, LATIN SMALL LETTER E WITH OGONEK       , 
		"&Ecaron;"	:"&#282;",	//U0011A, LATIN CAPITAL LETTER E WITH CARON      , 
		"&ecaron;"	:"&#283;",	//U0011B, LATIN SMALL LETTER E WITH CARON        , 
		"&Gcirc;"	:"&#284;",	//U0011C, LATIN CAPITAL LETTER G WITH CIRCUMFLEX , 
		"&gcirc;"	:"&#285;",	//U0011D, LATIN SMALL LETTER G WITH CIRCUMFLEX   , 
		"&Gbreve;"	:"&#286;",	//U0011E, LATIN CAPITAL LETTER G WITH BREVE      , 
		"&gbreve;"	:"&#287;",	//U0011F, LATIN SMALL LETTER G WITH BREVE        , 
		"&Gdot;"	:"&#288;",	//U00120, LATIN CAPITAL LETTER G WITH DOT ABOVE  ,
		"&gdot;"	:"&#289;",	//U00121, LATIN SMALL LETTER G WITH DOT ABOVE    , 
		"&Gcedil;"	:"&#290;",	//U00122, LATIN CAPITAL LETTER G WITH CEDILLA    , 
		"&Hcirc;"	:"&#292;",	//U00124, LATIN CAPITAL LETTER H WITH CIRCUMFLEX , 
		"&hcirc;"	:"&#293;",	//U00125, LATIN SMALL LETTER H WITH CIRCUMFLEX   , 
		"&Hstrok;"	:"&#294;",	//U00126, LATIN CAPITAL LETTER H WITH STROKE     , 
		"&hstrok;"	:"&#295;",	//U00127, LATIN SMALL LETTER H WITH STROKE       , 
		"&Itilde;"	:"&#296;",	//U00128, LATIN CAPITAL LETTER I WITH TILDE      , 
		"&itilde;"	:"&#297;",	//U00129, LATIN SMALL LETTER I WITH TILDE        , 
		"&Imacr;"	:"&#298;",	//U0012A, LATIN CAPITAL LETTER I WITH MACRON     , 
		"&imacr;"	:"&#299;",	//U0012B, LATIN SMALL LETTER I WITH MACRON       , 
		"&Iogon;"	:"&#302;",	//U0012E, LATIN CAPITAL LETTER I WITH OGONEK     , 
		"&iogon;"	:"&#303;",	//U0012F, LATIN SMALL LETTER I WITH OGONEK       , 
		"&Idot;"	:"&#304;",	//U00130, LATIN CAPITAL LETTER I WITH DOT ABOVE  , 
		"&imath;"	:"&#305;",	//U00131, LATIN SMALL LETTER DOTLESS I           , 
		"&inodot;"	:"&#305;",	//U00131, LATIN SMALL LETTER DOTLESS I           , 
		"&IJlig;"	:"&#306;",	//U00132, LATIN CAPITAL LIGATURE IJ              , 
		"&ijlig;"	:"&#307;",	//U00133, LATIN SMALL LIGATURE IJ                , 
		"&Jcirc;"	:"&#308;",	//U00134, LATIN CAPITAL LETTER J WITH CIRCUMFLEX , 
		"&jcirc;"	:"&#309;",	//U00135, LATIN SMALL LETTER J WITH CIRCUMFLEX   , 
		"&Kcedil;"	:"&#310;",	//U00136, LATIN CAPITAL LETTER K WITH CEDILLA    ,
		"&kcedil;"	:"&#311;",	//U00137, LATIN SMALL LETTER K WITH CEDILLA      , 
		"&kgreen;"	:"&#312;",	//U00138, LATIN SMALL LETTER KRA                 , 
		"&Lacute;"	:"&#313;",	//U00139, LATIN CAPITAL LETTER L WITH ACUTE      , 
		"&lacute;"	:"&#314;",	//U0013A, LATIN SMALL LETTER L WITH ACUTE        , 
		"&Lcedil;"	:"&#315;",	//U0013B, LATIN CAPITAL LETTER L WITH CEDILLA    , 
		"&lcedil;"	:"&#316;",	//U0013C, LATIN SMALL LETTER L WITH CEDILLA      , 
		"&Lcaron;"	:"&#317;",	//U0013D, LATIN CAPITAL LETTER L WITH CARON      , 
		"&lcaron;"	:"&#318;",	//U0013E, LATIN SMALL LETTER L WITH CARON        , 
		"&Lmidot;"	:"&#319;",	//U0013F, LATIN CAPITAL LETTER L WITH MIDDLE DOT , 
		"&lmidot;"	:"&#320;",	//U00140, LATIN SMALL LETTER L WITH MIDDLE DOT   , 
		"&Lstrok;"	:"&#321;",	//U00141, LATIN CAPITAL LETTER L WITH STROKE     , 
		"&lstrok;"	:"&#322;",	//U00142, LATIN SMALL LETTER L WITH STROKE       , 
		"&Nacute;"	:"&#323;",	//U00143, LATIN CAPITAL LETTER N WITH ACUTE      , 
		"&nacute;"	:"&#324;",	//U00144, LATIN SMALL LETTER N WITH ACUTE        , 
		"&Ncedil;"	:"&#325;",	//U00145, LATIN CAPITAL LETTER N WITH CEDILLA    , 
		"&ncedil;"	:"&#326;",	//U00146, LATIN SMALL LETTER N WITH CEDILLA      , 
		"&Ncaron;"	:"&#327;",	//U00147, LATIN CAPITAL LETTER N WITH CARON      , 
		"&ncaron;"	:"&#328;",	//U00148, LATIN SMALL LETTER N WITH CARON        , 
		"&napos;"	:"&#329;",	//U00149, LATIN SMALL LETTER N PRECEDED BY APOSTROPHE, 
		"&ENG;"		:"&#330;",	//U0014A, LATIN CAPITAL LETTER ENG               , 
		"&eng;"		:"&#331;",	//U0014B, LATIN SMALL LETTER ENG                 , 
		"&Omacr;"	:"&#332;",	//U0014C, LATIN CAPITAL LETTER O WITH MACRON     , 
		"&omacr;"	:"&#333;",	//U0014D, LATIN SMALL LETTER O WITH MACRON       , 
		"&Odblac;"	:"&#336;",	//U00150, LATIN CAPITAL LETTER O WITH DOUBLE ACUTE, 
		"&odblac;"	:"&#337;",	//U00151, LATIN SMALL LETTER O WITH DOUBLE ACUTE , 
		"&OElig;"	:"&#338;",	//U00152, LATIN CAPITAL LIGATURE OE              , 
		"&oelig;"	:"&#339;",	//U00153, LATIN SMALL LIGATURE OE                , 
		"&Racute;"	:"&#340;",	//U00154, LATIN CAPITAL LETTER R WITH ACUTE      , 
		"&racute;"	:"&#341;",	//U00155, LATIN SMALL LETTER R WITH ACUTE        , 
		"&Rcedil;"	:"&#342;",	//U00156, LATIN CAPITAL LETTER R WITH CEDILLA    , 
		"&rcedil;"	:"&#343;",	//U00157, LATIN SMALL LETTER R WITH CEDILLA      , 
		"&Rcaron;"	:"&#344;",	//U00158, LATIN CAPITAL LETTER R WITH CARON      , 
		"&rcaron;"	:"&#345;",	//U00159, LATIN SMALL LETTER R WITH CARON        , 
		"&Sacute;"	:"&#346;",	//U0015A, LATIN CAPITAL LETTER S WITH ACUTE      , 
		"&sacute;"	:"&#347;",	//U0015B, LATIN SMALL LETTER S WITH ACUTE        , 
		"&Scirc;"	:"&#348;",	//U0015C, LATIN CAPITAL LETTER S WITH CIRCUMFLEX , 
		"&scirc;"	:"&#349;",	//U0015D, LATIN SMALL LETTER S WITH CIRCUMFLEX   , 
		"&Scedil;"	:"&#350;",	//U0015E, LATIN CAPITAL LETTER S WITH CEDILLA    , 
		"&scedil;"	:"&#351;",	//U0015F, LATIN SMALL LETTER S WITH CEDILLA      , 
		"&Scaron;"	:"&#352;",	//U00160, LATIN CAPITAL LETTER S WITH CARON      , 
		"&scaron;"	:"&#353;",	//U00161, LATIN SMALL LETTER S WITH CARON        , 
		"&Tcedil;"	:"&#354;",	//U00162, LATIN CAPITAL LETTER T WITH CEDILLA    , 
		"&tcedil;"	:"&#355;",	//U00163, LATIN SMALL LETTER T WITH CEDILLA      , 
		"&Tcaron;"	:"&#356;",	//U00164, LATIN CAPITAL LETTER T WITH CARON      , 
		"&tcaron;"	:"&#357;",	//U00165, LATIN SMALL LETTER T WITH CARON        , 
		"&Tstrok;"	:"&#358;",	//U00166, LATIN CAPITAL LETTER T WITH STROKE     , 
		"&tstrok;"	:"&#359;",	//U00167, LATIN SMALL LETTER T WITH STROKE       , 
		"&Utilde;"	:"&#360;",	//U00168, LATIN CAPITAL LETTER U WITH TILDE      , 
		"&utilde;"	:"&#361;",	//U00169, LATIN SMALL LETTER U WITH TILDE        , 
		"&Umacr;"	:"&#362;",	//U0016A, LATIN CAPITAL LETTER U WITH MACRON     , 
		"&umacr;"	:"&#363;",	//U0016B, LATIN SMALL LETTER U WITH MACRON       , 
		"&Ubreve;"	:"&#364;",	//U0016C, LATIN CAPITAL LETTER U WITH BREVE      , 
		"&ubreve;"	:"&#365;",	//U0016D, LATIN SMALL LETTER U WITH BREVE        , 
		"&Uring;"	:"&#366;",	//U0016E, LATIN CAPITAL LETTER U WITH RING ABOVE , 
		"&uring;"	:"&#367;",	//U0016F, LATIN SMALL LETTER U WITH RING ABOVE   , 
		"&Udblac;"	:"&#368;",	//U00170, LATIN CAPITAL LETTER U WITH DOUBLE ACUTE, 
		"&udblac;"	:"&#369;",	//U00171, LATIN SMALL LETTER U WITH DOUBLE ACUTE , 
		"&Uogon;"	:"&#370;",	//U00172, LATIN CAPITAL LETTER U WITH OGONEK     , 
		"&uogon;"	:"&#371;",	//U00173, LATIN SMALL LETTER U WITH OGONEK       , 
		"&Wcirc;"	:"&#372;",	//U00174, LATIN CAPITAL LETTER W WITH CIRCUMFLEX , 
		"&wcirc;"	:"&#373;",	//U00175, LATIN SMALL LETTER W WITH CIRCUMFLEX   , 
		"&Ycirc;"	:"&#374;",	//U00176, LATIN CAPITAL LETTER Y WITH CIRCUMFLEX , 
		"&ycirc;"	:"&#375;",	//U00177, LATIN SMALL LETTER Y WITH CIRCUMFLEX   , 
		"&Yuml;"	:"&#376;",	//U00178, LATIN CAPITAL LETTER Y WITH DIAERESIS  , 
		"&Zacute;"	:"&#377;",	//U00179, LATIN CAPITAL LETTER Z WITH ACUTE      , 
		"&zacute;"	:"&#378;",	//U0017A, LATIN SMALL LETTER Z WITH ACUTE        , 
		"&Zdot;"	:"&#379;",	//U0017B, LATIN CAPITAL LETTER Z WITH DOT ABOVE  , 
		"&zdot;"	:"&#380;",	//U0017C, LATIN SMALL LETTER Z WITH DOT ABOVE    , 
		"&Zcaron;"	:"&#381;",	//U0017D, LATIN CAPITAL LETTER Z WITH CARON      , 
		"&zcaron;"	:"&#382;",	//U0017E, LATIN SMALL LETTER Z WITH CARON        , 
		"&fnof;"	:"&#402;",	//U00192, LATIN SMALL LETTER F WITH HOOK         , 
		"&imped;"	:"&#437;",	//U001B5, LATIN CAPITAL LETTER Z WITH STROKE     , 
		"&gacute;"	:"&#501;",	//U001F5, LATIN SMALL LETTER G WITH ACUTE        , 
		"&circ;" : "&#710;", // -- modifier letter circumflex accent
		"&tilde;" : "&#732;", // small tilde

		"&Alpha;"	:"&#913;",	 
		"&Beta;"	:"&#914;", 
		"&Gamma;"	:"&#915;", 
		"&Delta;"	:"&#916;", 
		"&Epsilon;"	:"&#917;", 
		"&Zeta;"	:"&#918;", 
		"&Eta;"		:"&#919;", 
		"&Theta;"	:"&#920;", 
		"&Iota;"	:"&#921;", 
		"&Kappa;"	:"&#922;", 
		"&Lambda;"	:"&#923;", 
		"&Mu;"		:"&#924;", 
		"&Nu;"		:"&#925;", 
		"&Xi;"		:"&#926;", 
		"&Omicron;"	:"&#927;", 
		"&Pi;"		:"&#928;", 
		"&Rho;"		:"&#929;", 
		
		"&Sigma;"	:"&#931;",
		"&Tau;"		:"&#932;", 
		"&Upsilon;"	:"&#933;", 
		"&Phi;"		:"&#934;", 
		"&Chi;"		:"&#935;", 
		"&Psi;"		:"&#936;", 
		"&Omega;"	:"&#937;",
		 
		"&alpha;"	:"&#945;",  
		"&beta;"	:"&#946;", 
		"&gamma;"	:"&#947;", 
		"&delta;"	:"&#948;", 
		"&epsilon;"	:"&#949;", 
		"&zeta;"	:"&#950;", 
		"&eta;"		:"&#951;", 
		"&theta;"	:"&#952;", 
		"&iota;"	:"&#953;", 
		"&kappa;"	:"&#954;", 
		"&lambda;"	:"&#955;", 
		"&mu;"		:"&#956;", 
		"&nu;"		:"&#957;", 
		"&xi;"		:"&#958;", 
		"&omicron;"	:"&#959;", 
		"&pi;"		:"&#960;", 
		"&rho;"		:"&#961;",  
		"&sigmaf;"	:"&#962;", 
		"&sigma;"	:"&#963;", 
		"&tau;"		:"&#964;", 
		"&upsilon;"	:"&#965;", 
		"&phi;"		:"&#966;", 
		"&chi;"		:"&#967;", 
		"&psi;"		:"&#968;", 
		"&omega;"	:"&#969;", 

		"&thetasym;":"&#977;", 
		"&upsih;"	:"&#978;", 
		"&piv;"		:"&#982",

		"&ensp;"	:"&#8194;",  // En space
		"&emsp;"	:"&#8195;",  // Em space
		"&thinsp;"	:"&#8201;",  // Thin space
		"&zwnj;"	:"&#8204;",  // Zero width non-joiner
		"&zwj;"		:"&#8205;",  // Zero width joine
		"&lrm;"		:"&#8206;",  // Left-to-right mark
		"&rlm;"		:"&#8207;",  // Right-to-left mark
		"&ndash;"	:"&#8211;",  // En dash
		"&mdash;"	:"&#8212;",  // Em dash
		"&lsquo;"	:"&#8216;",  // Left single quotation mark
		"&rsquo;"	:"&#8217;",  // Right single quotation mark
		"&sbquo;"	:"&#8218;",  // Single low-9 quotation mark
		"&ldquo;"	:"&#8220;",  // Left double quotation mark
		"&rdquo;"	:"&#8221;",  // Right double quotation mark
		"&bdquo;"	:"&#8222;",  // Double low-9 quotation mark
		"&dagger;"	:"&#8224;",  // Dagger
		"&Dagger;"	:"&#8225;",  // Double dagger

		"&ball;"	:"&#8226;",
		"&bull;"	:"&#8226;", //Bullet
		"&hellip;"	:"&#8230;", // horizontal ellipsis = three dot leader

		"&permil;"	:"&#8240;",  // Per mille

		"&prime;"	:"&#8242;", // prime = minutes = feet
		"&Prime;"	:"&#8243;", // double prime = seconds = inches

		"&lsaquo;"	:"&#8249;",  // Single left angle quotation
		"&rsaquo;"	:"&#8250;",  // Single right angle quotation

		"&oline;"	:"&#8254;", // overline = spacing overscore
		"&frasl;"	:"&#8260;", // fraction slash

		"&euro;"	:"&#8364;",
		"&image;"	:"&#8465;", // blackletter capital I = imaginary part
		"&weierp;"	:"&#8472;", // script capital P = power set= Weierstrass p
		"&real;"	:"&#8476;", // blackletter capital R = real part symbol
		"&trade;"	:"&#8482;",
		"&alefsym;"	:"&#8501;",
		"&larr;"	:"&#8592;",
		"&uarr;"	:"&#8593;",
		"&rarr;"	:"&#8594;",
		"&darr;"	:"&#8595;",
		"&harr;"	:"&#8596;",
		"&carr;"	:"&#8629;",
		"&crarr;"	:"&#8629;", // downwards arrow with corner leftwards= carriage return
		"&lArr;"	:"&#8656;",
		"&uArr;"	:"&#8657;",
		"&rArr;"	:"&#8658;",
		"&dArr;"	:"&#8659;",
		"&hArr;"	:"&#8660;",
		"&forall;"	:"&#8704;",
		"&part;"	:"&#8706;",
		"&exist;"	:"&#8707;",
		"&empty;"	:"&#8709;",
		"&nabla;"	:"&#8711;",
		"&isin;"	:"&#8712;",
		"&notin;"	:"&#8713;",
		"&ni;"		:"&#8715;",
		"&prod;"	:"&#8719;",
		"&sum;"		:"&#8721;",
		"&minus;"	:"&#8722;",
		"&lowast;"	:"&#8727;",
		"&radic;"	:"&#8730;",
		"&prop;"	:"&#8733;",
		"&infin;"	:"&#8734;",
		"&ang;"		:"&#8736;", // angle
		"&and;"		:"&#8743;", // logical and = wedge
		"&or;"		:"&#8744;", // logical or = vee
		"&cap;"		:"&#8745;", // intersection = cap
		"&cup;"		:"&#8746;", // union = cup
		"&int;"		:"&#8747;", // integral
		"&there4;"	:"&#8756;", // therefore
		"&sim;"		:"&#8764;", // tilde operator = varies with = similar to
		"&cong;"	:"&#8773;", // approximately equal to
		"&asymp;"	:"&#8776;", // almost equal to = asymptotic to
		"&ne;"		:"&#8800;", // not equal to
		"&equiv;"	:"&#8801;", // identical to
		"&le;"		:"&#8804;", // less-than or equal to
		"&ge;"		:"&#8805;", // greater-than or equal to
		"&sub;"		:"&#8834;", // subset of
		"&sup;"		:"&#8835;", // superset of
		"&nsub;"	:"&#8836;", // not a subset of
		"&sube;"	:"&#8838;", // subset of or equal to
		"&supe;"	:"&#8839;", // superset of or equal to
		"&oplus;"	:"&#8853;", // circled plus = direct sum
		"&otimes;"	:"&#8855;", // circled times = vector product
		"&perp;"	:"&#8869;", // up tack = orthogonal to = perpendicular
		"&sdot;"	:"&#8901;", // dot operator
		"&lceil;"	:"&#8968;", // left ceiling = apl upstile
		"&rceil;"	:"&#8969;", // right ceiling
		"&lfloor;"	:"&#8970;", // left floor = apl downstile
		"&rfloor;"	:"&#8971;", // right floor
		"&lang;"	:"&#9001;", // left-pointing angle bracket = bra
		"&rang;"	:"&#9002;", // right-pointing angle bracket = ket
		"&loz;"		:"&#9674;", // lozenge
		"&spades;"	:"&#9824;", // black spade suit
		"&clubs;"	:"&#9827;", // black club suit = shamrock
		"&hearts;"	:"&#9829;", // black heart suit = valentine
		"&diams;"	:"&#9830;"  // black diamond suit
};		

	function iso1Replace(desc)
	{
		for (var c in isoLatin1)
		{
			var regExp = new RegExp(c, "g");
			desc = desc.replace(regExp, isoLatin1[c]);
		}
		
		return desc;
	}
	
	function fcc(c)
	{
		var s;
		c = c.substring(2, c.length-1);
        if( c > 0xFFFF ) { /* Surrogate character support */ 
        	var c1 = 0xD800 + (((c - 0x10000) >> 10) & 0x3FF);
        	var c2 = 0xDC00 + ((c - 0x10000) & 0x3FF);
        	s = String.fromCharCode(c1) + String.fromCharCode(c2);
        }
        else s = String.fromCharCode(c);
		return s;
	}

	desc = desc.replace(/&lt;/g, "<");
	desc = desc.replace(/&gt;/g, ">");
	desc = desc.replace(/&amp;/g, "&");
	desc = desc.replace(/&apos;/g, "'");
	desc = desc.replace(/&quot;/g, "\"");
	desc = iso1Replace(desc);
	desc = desc.replace(/&#\d+;/g, fcc);
		
	return desc;
} 


function openCenteredWindow(url, name, height, width)
{
	var top = (screen.height - height) / 2;
	var left = (screen.width - width) / 2;
	return window.open(url, name, "top=" + top + " left=" + left + " height=" + height + " width=" + width);
}


function windowCloseWait(e, data)
{
	
	var win = data.window;
	
	function waitForClose()
	{
		try
		{
		if (!win || win.closed)
		{
			clearInterval(id);
			var uri = applicationContext + "/event.bip";			
			var argument = 
			{
				"BIP_REQUEST_TYPE": "BIP_GET_EVENT_DATA",
			};
			argument[IBI_random] = Math.random();
			argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();
			$.when($.post(uri, argument).always(function(data)
			{
				processEventData(data);
			}));
		}}
		catch(e)
		{
			clearInterval(id);
			var uri = applicationContext + "/event.bip";			
			var argument = 
			{
				"BIP_REQUEST_TYPE": "BIP_GET_EVENT_DATA",
			};
			argument[IBI_random] = Math.random();
			argument[WFGlobals.getSesAuthParm()] = WFGlobals.getSesAuthVal();
			$.when($.post(uri, argument).always(function(data)
			{
				processEventData(data);
			}));
		}
	}

	var id = setInterval(waitForClose, 500);
}

function processEventData(data)
{
	if (data)
	{
		/*
		var evd = [
		           {eType:"BIPUTIL_SELECT_PAGE", eValue:{_pageindex:1}, eWait:1},
		           {eType:'FORCE_RECURSIVE_ACTION_ON_FOLDER', eValue:this.json.folder, eWait:1000}, 
		           {eType:"RUN_BY_PATH", eValue:this.json.fullPath, eWait:2000}
		          ];
		
		parms.push("eventData=" + JSON.stringify(evd)); 
		 */
		var evdS = $(data).find("eventData").attr("value");
		
		if (evdS)
		{
			var evd =  JSON.parse(evdS);					
			
			for (var i = 0; i < evd.length; i++)
			{
				var ed = evd[i];
				var eType = ed.eType;
				var eValue = ed.eValue;
				var eWait = ed.eWait;
				
				var event = {"eType": eType, "eValue": eValue, "eWait": eWait};
				scheduledEvents.push(event);
			}
		
			scEvTime = scheduledEvents[0].eWait ? scheduledEvents[0].eWait : 1;
			setTimeout(function ()
			{
				processScheduledEvents();
			}, scEvTime);
		}
	}
}

var scEvTime;
var scheduledEvents = [];

function processScheduledEvents()
{
	var ev = scheduledEvents.shift();
	if (!ev)
		return;
	
	$(document).trigger(ev.eType, ev);
	
	if (scheduledEvents.length == 0)
		return;
	
	scEvTime += (scheduledEvents[0].eWait ? scheduledEvents[0].eWait : 1000);
	setTimeout(function ()
	{
		processScheduledEvents();
	}, scEvTime);
}

var numItems;
function waitForNewItem()
{
	var itemsInterval;
	function waitForItemInRefresh()
	{
		var nitems = home_globals.Items.itemList.length;
		if (nitems > numItems)
		{
			clearInterval(itemsInterval);
			var items = home_globals.Items.itemList;
			var item = items[0];
			for (var i = 1; i < nitems; i++)
			{
				if (items[i].createdOn > item.createdOn)
					item = items[i];
			}
			home_globals.homePage.locateItem(item);
			home_globals.Items.scrollIntoView(item.fullPath);
		}
	}

	itemsInterval = setInterval(waitForItemInRefresh, 200);
}

function waitForNewFolder()
{
	var itemsInterval;
	function waitForFolderInRefresh()
	{
		var nitems = home_globals.Items.folderList.length;
		if (nitems > numItems)
		{
			clearInterval(itemsInterval);
			var items = home_globals.Items.folderList;
			var item = items[0];
			for (var i = 1; i < nitems; i++)
			{
				if (items[i].createdOn > item.createdOn)
					item = items[i];
			}
			home_globals.homePage.locateItem(item);
			var fp = item.fullPath;
			setTimeout(function () {home_globals.Items.scrollIntoView(fp);}, item.parentPath == "IBFS:/WFC/Repository/" ? 3000 : 1000);
		}
	}

	itemsInterval = setInterval(waitForFolderInRefresh, 200);
}

function onHelpAboutDialog()
{
	var aboutWebfocus = ibx.resourceMgr.getResource('.about-webfocus');
    
	aboutWebfocus.on("ibx_close", function(e, btn)
    {
        $(".pvd-right-menu-banner").focus();
    }.bind(this));
	
	
    aboutWebfocus.find('.ibx-dialog-cancel-button ').hide();
		
	aboutWebfocus.find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("hpreboot_helpabout"));

	aboutWebfocus.find(".help-about-edition").ibxWidget('option', 'text', home_globals.home_page_globals["edition"]);
	aboutWebfocus.find(".help-about-product_release").ibxWidget('option', 'text', home_globals.home_page_globals["prduct_release"]);	
	aboutWebfocus.find(".help-about-service_pack").ibxWidget('option', 'text', home_globals.home_page_globals["service_pack"]);	
	aboutWebfocus.find(".help-about-package_id").ibxWidget('option', 'text', home_globals.home_page_globals["package_id"]);	
	aboutWebfocus.find(".help-about-release_id").ibxWidget('option', 'text', home_globals.home_page_globals["release_id"]);
	aboutWebfocus.find(".help-about-build_number").ibxWidget('option', 'text', home_globals.home_page_globals["build_number"]);	
	aboutWebfocus.find(".help-about-build_date").ibxWidget('option', 'text', home_globals.home_page_globals["build_date"]);	
	aboutWebfocus.find(".help-about-application_server").ibxWidget('option', 'text', home_globals.home_page_globals["application_server"]);
	
	aboutWebfocus.find(".ibx-title-bar-close-button").prop('tabindex', '0').prop('title', ibx.resourceMgr.getString("hpreboot_about_close"));
	aboutWebfocus.find(".ibx-dialog-ok-button").prop('title', ibx.resourceMgr.getString("hpreboot_about_ok"));
	aboutWebfocus.find('.ibx-title-bar-close-button').focus();
	aboutWebfocus.ibxWidget('open');

}
function hpsignin()
{
	var win = window.open(applicationContext + "/home","_self");
}
function hpsignout()
{
	var redirect = ""; 
	var redSign = "?";
	
	if (home_globals.home_page_globals["currentPage"] == "portal")
	{ // portal
		var name =  decodeURI(document.location.href).replace(/%2F/g, "/");		// decode %2F as / since uri needs them
		var idx = name.indexOf("/portal/");
		var pname=encodeURI(encodeURI(name.substring(idx)));
		
		if (home_globals.home_page_globals["SignoutRedirect"] == "/")	
			redirect = "webfocus-security-redirect=" + pname;
	}
	
	var signout = home_globals.home_page_globals["LogoutFilterProcessesUrl"];
    if (signout.indexOf("?") != -1)
        redSign = "&"; 

	if (signout.indexOf("http") != 0)
		signout = applicationContext + signout + redSign +redirect;
		
    setTimeout(function() {
    	window.open(signout, "_self");
    }, 200);
}
	
function onRemoveMyCustomizations()
{
	$(document).trigger("PRTLX_REMOVE_MY_CUSTOMIZATION");
}

function onChangePassword()
{
	var changePasswordDlg = ibx.resourceMgr.getResource('.change-password');
	changePasswordDlg.ibxWidget('option', 'posSelector', '.pvd-portal-banner');
	changePasswordDlg.ibxWidget('option', {'closeSelector': ".pvd-right-menu-banner", 'position': { "my": "top", "at": "top+30px", "of": window, "collision": "flip" }}).ibxWidget("open");
	$(changePasswordDlg).ibxWidget('initData',home_globals.home_page_globals["SecurityUserName"]);	
}

function onShowIBIPage()
{
	window.open("https://www.tibco.com/","_tibco");			
}

function setManagerMode(mode)
{
	if (home_globals.home_page_globals["MenuManagerMode"] != mode) // Do nothing. The user click on the current mode twice
	{
		home_globals.home_page_globals["MenuManagerMode"] = mode;
		var uriExec = sformat("{1}/mode.bip", applicationContext);
	 	var randomnum = Math.floor(Math.random() * 100000);	
	 	var argument=
	 	{
	 		BIP_REQUEST_TYPE: "BIP_SET_MODE",
	 		mode: mode
	 	};
	 	argument[IBI_random] = randomnum;
	 	
		$.get(uriExec, argument)
		.done(function( data ) 
		{
			if (home_globals.home_page_globals["currentPage"] == "homepage")
			{	// home page only
				var status = $("status", data);
				var result = status[0].getAttribute("result");
				if (result == "success")
				{
					$(document).trigger(homeEvents.ITEM_SELECTED, {"item": home_globals.rootItem._item});
					home_globals.homePage.refreshfolder(home_globals.rootPath);
					home_globals.managerMode = (mode == "manager" ? true : false);
				}
			}
		});	
	}
}

function StopRequests()
{
	var uriExec = sformat("{1}/stopreq.bip", applicationContext);
		var randomnum = Math.floor(Math.random() * 100000);	
		var argument=
		{
			BIP_REQUEST_TYPE: "BIP_STOP_REQUEST"		
		};
	 	argument[IBI_random] = randomnum;
	
	$.get(uriExec, argument)
	.done(function( data ) 
		{
			var status = $("status", data);			
			var options = 
			{
				type: "medium info",
				caption: ibx.resourceMgr.getString("home_stop_requests"),
				buttons: "ok",
				movable: false,
				messageOptions:
				{
					text: status[0].getAttribute("message")
				}
			};
			var dlg = $.ibi.ibxDialog.createMessageDialog(options);
			dlg.ibxDialog("open");						
		});				
}

function DeferredStatus()
{
	 var DeferredStatus = applicationContext + "/WFServlet?IBIWF_defer=defer&BIDrand=" + Math.floor(Math.random() * 99999);
	 if (home_globals.home_page_globals["MenuManagerMode"] == "manager")
		 DeferredStatus += "&inAdminMode=true"; 
	 window.open(DeferredStatus,"_DeferredStatus");								
}

function PreferencesMessage()
{
	var revertText = ibx.resourceMgr.getString("home_reset_my_preferences_message");
	var options = 
	{
		type:"medium warning",
		caption: ibx.resourceMgr.getString("home_reset_my_preferences"),
		buttons:"okcancel",		
		messageOptions:{text:revertText}
	};
	var dlg = $.ibi.ibxDialog.createMessageDialog(options);	

	dlg.ibxDialog("open").on("ibx_close", function(e, btn)
	{
		if(btn=="ok")
		{
		 	var uriExec = sformat("{1}/resetpreferences.bip", applicationContext);
			var argument=
			{
					"BIP_REQUEST_TYPE": "BIP_RESET_PREFERENCES"
			 };	
		 	argument[IBI_random] = Math.floor(Math.random() * 100000);
		 	argument[home_globals.SesAuthParm] = home_globals.SesAuthParmVal;
			$.post(uriExec, argument , function(retdata, status) 
			{
				if(status=="success") 
				{
					if (home_globals.home_page_globals["currentPage"] == "homepage")
						window.location = window.location.pathname;
					else
						if (home_globals.home_page_globals["currentPage"] == "portal")
						{
							var idx = location.search.indexOf("&IBIWF_language");
							if (idx != -1)
								window.location= location.search.substr(0, idx); // take out IBIWF_language
							else						
								window.location = window.location.pathname;
						}
				}
			});	
		}
	});
}

function Preferences()
{ 
	// show the dialog....
	form = ibx.resourceMgr.getResource('.menu-preferences');
	
	form.on("ibx_close", function(e, btn)
    {
        $(".pvd-right-menu-banner").focus();
    }.bind(this));
		
	form.find(".ibx-title-bar-caption").ibxWidget('option', 'text', ibx.resourceMgr.getString("home_my_preferences"));
	form.find(".form-fill-error-text").hide();
	form.find(".ibx-dialog-ok-button").ibxWidget('option', 'text', ibx.resourceMgr.getString("hpreboot_save"));
	form.find(".ibx-dialog-ok-button").ibxWidget('option','disabled', true);	

	////////////////////  for now hide the display
	form.find(".my-pref-display").hide();
	form.ibxWidget('open');
	// Add Reset Button to the bottom dialog
//	$("<div class='hp-preferences-reset-button'>").ibxButton({"text":ibx.resourceMgr.getString("home_reset_my_preferences")}).prependTo( ".ibx-dialog-button-box" );
/*
	if (home_globals.titleMode)
		$("[data-ibxp-name='rgType']").ibxWidget("selected", $("[data-ibxp-name='preferencesTitle']")); // Set default 
	else
		$("[data-ibxp-name='rgType']").ibxWidget("selected", $("[data-ibxp-name='preferencesName']")); // Set default 
*/		
	var langList = $(".home-properties-language-select-picker");
	langList.ibxWidget("removeControlItem", langList.ibxWidget("children"));
	var selected = 0;// default	
	//this.LanguageArray = this.options.initialData.languages;
	var menuItemString = ""
	for (var i = 0; i < home_page_globals["language_list"].length; i++)
	{
		if (home_page_globals["language_list"][i].name5 == home_page_globals["current_language"])
			 selected = i;

		var selItem = $("<div class='home-pref-language-value'>").ibxSelectItem({ text: home_page_globals["language_list"][i].description, userValue: home_page_globals["language_list"][i].name5});
		langList.ibxWidget("addControlItem", selItem);
		menuItemString = menuItemString.concat((i == 0)? "":" ", home_page_globals["language_list"][i].description);
	}
	var selectLanguage = ibx.resourceMgr.getString("hpreboot_preferences_selectlanguage") + " - " + menuItemString;
	
	$(".home-properties-language-select-picker").attr({"title": selectLanguage,"tabindex":0}).ibxWidget("userValue", home_page_globals["language_list"][selected].name5);
		
	$(".RadioButtonSimpleOrder").on("ibx_change", function(e)
	{
		$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);	
	});		
	
	$(".home-properties-language-select-picker").on("ibx_change", function(e)
	{
		$(form).find(".ibx-dialog-ok-button").ibxWidget('option','disabled', false);	
	});		
		
	
	$(form).find(".ibx-dialog-ok-button").on('click', function (e) 
	{
		$(".form-fill-error-text").empty(); // reset
		
	 	var langList = $(".home-properties-language-select-picker");
	 	var selLang = langList.ibxWidget("selected").ibxWidget("userValue");
//		var titleModeValue = $("[data-ibxp-name='rgType']").ibxWidget("selected").ibxWidget("option", "userValue");
//		home_globals.titleMode = (titleModeValue == "title") ? true : false;

//		home_globals.reloadHomepage = true;		
		if (selLang != home_page_globals["current_language"])
		{
			for (var i = 0; i < home_page_globals["language_list"].length; i++)
			{
				 if (home_page_globals["language_list"][i].name5 == selLang)
					home_globals.reloadHomepageWithLanguage = home_page_globals["language_list"][i].name2;
			}
		}
		$(form).dispatchEvent("savePreferences"); // IE-11 timing problem
	}.bind(this));
					
	$(form).on("ibx_beforeclose", function(e, closeData)
	{				
		if(closeData == "ok")
		{
			e.preventDefault();
		}	
	}.bind(this));
	
	form.prop('title', ibx.resourceMgr.getString("home_my_preferences"));
	form.find('.ibx-title-bar-close-button').prop('tabindex', '0').prop('title', ibx.resourceMgr.getString("hpreboot_preferences_close_dialog"));
	form.find('.ibx-dialog-cancel-button').prop('tabindex', '0').prop('title', ibx.resourceMgr.getString("hpreboot_preferences_cancel_dialog"));
	form.find('.ibx-dialog-ok-button').prop('tabindex', '0').prop('title', ibx.resourceMgr.getString("hpreboot_preferences_save_select"));
	form.find('.ibx-title-bar-close-button').focus();			
}
document.addEventListener("savePreferences", function() 
{
	home_globals.homePage.savePreferences(); 
});

// menu Permission
function initmenuPermission(isSync)
{
	var uriExec = sformat("{1}/perms.bip", applicationContext);
	var randomnum = Math.floor(Math.random() * 100000);	
	var menuPermission;
	var argument=
	{
		BIP_REQUEST_TYPE: "BIP_GET_PERMISSIONS"		
	};
	if (home_globals.home_page_globals["currentPage"] == "portal")
		argument["ibfsPath"] = home_page_globals["portalPath"];
	
 	argument[IBI_random] = randomnum;
	
	$.get({'url': uriExec, 'async': !isSync}, argument)
	.done(function( data ) 
		{
			home_page_globals["menuPermission"] = $("permission", data);	
			// menu Permission
			for (var i = 0; i < home_page_globals["menuPermission"].length; i++)
			{
				var node = home_page_globals["menuPermission"][i];
				var permName = node.getAttribute("name");
				var permValue = node.getAttribute("value");
				switch (permName)
				{
					case "favorites": 
						if (permValue == "false")
							$(".left-main-panel-favorites-button").hide();
						home_page_globals["showFavorites"] = permValue;
						break;
					case "mobileFavorites":
						if (permValue == "false")
							$(".left-main-panel-mobile-favorites-button").hide();
						home_page_globals["showmobileFavorites"] = permValue;					
						break;
					case "showPortals":
						if (permValue == "false")
							$(".left-main-panel-portal-button").hide();
						home_page_globals["showPortals"] = permValue;					
						break;
					case "isAnonymousUser": 
						home_page_globals["isAnonymousUser"] = permValue;
						if (permValue == "true")
						{
							$(".left-main-panel-favorites-button").hide();
							$(".left-main-panel-mobile-favorites-button").hide();
						}
						break;
				}
			}
			
			if(home_page_globals["askWebFOCUS"] != "true")
				$(".left-main-panel-askwebfocus-button").hide();
			$(".left-main-panel-mobile-favorites-button").hide();
			home_page_globals["showmobileFavorites"] = "false";					

		});	
}

function onShowToolMenu(posOf)
{
	if (typeof (home_globals.home_page_globals["mainMenuObject"]) == "undefined" || home_globals.home_page_globals["mainMenuObject"] == null)
	{ 
		menu = ibx.resourceMgr.getResource(".hp-menu-administrator");
		var jqItemMenu = $(menu);

		jqItemMenu.data('ibxWidget').miChangePassword.on("ibx_menu_item_click",function(e)
		{
			onChangePassword();		
		});

		jqItemMenu.data('ibxWidget').miRemoveMyCustomizations.on("ibx_menu_item_click",function(e)
		{
			onRemoveMyCustomizations();		
		});	

		jqItemMenu.data('ibxWidget').miSecurityCenter.on("ibx_menu_item_click",function(e)
		{
			window.open(applicationContext + "/tools/dsstart/dsstart.jsp?closeWindow=show","_SecurityCenter","width=" + width + ", height=" + height + ", top=" + topPos + ", left=" + left + ",toolbar=no,menubar=no,location=no,directories=no,channelmode=no,resizable=yes,scrollbars=yes");
		});

		jqItemMenu.data('ibxWidget').miAdministrationConsole.on("ibx_menu_item_click",function(e)
		{
			window.open(applicationContext + "/admin","_WebFocAdmin");		
		});

		jqItemMenu.data('ibxWidget').miMagnifyConsole.on("ibx_menu_item_click",function(e)
		{
			window.open(applicationContext + "/search/jsp/");						
		});

		jqItemMenu.data('ibxWidget').miManagePrivateResources.on("ibx_menu_item_click",function(e)
		{		
			var uriExec = sformat("{1}/mode.bip", applicationContext);
		 	var randomnum = Math.floor(Math.random() * 100000);	
		 	var argument=
		 	{
		 		BIP_REQUEST_TYPE: "BIP_SET_MODE",
		 		mode: "manager"
		 	};
		 	argument[IBI_random] = randomnum;
		 	
			$.get(uriExec, argument)
			.done(function( data ) 
				{
					var status = $("status", data);
					var result = status[0].getAttribute("result");
					if (result == "success")
					{
						window.open(applicationContext + "/tools/dsstart/dsstart.jsp?type=9&closeWindow=show&mode=manager","_ManagePrivateResources","width=800, height=600, top=100, left=300 ,toolbar=no,menubar=no,location=no,directories=no,channelmode=no,resizable=yes,scrollbars=yes");
					}
				});								

		});

		jqItemMenu.data('ibxWidget').miModeNormal.on("ibx_menu_item_click",function(e)
		{
			setManagerMode("normal");
		});

		jqItemMenu.data('ibxWidget').miModeManager.on("ibx_menu_item_click",function(e)
		{
			setManagerMode("manager");								
		});
		
		jqItemMenu.data('ibxWidget').miViewbuilder.on("ibx_menu_item_click",function(e)
		{
			 window.open(applicationContext + "/Controller?WORP_REQUEST_TYPE=BID_VB_INIT&BID_REQUEST_ORIGIN=welcome","_Viewbuilder");	
		});

		jqItemMenu.data('ibxWidget').miDeferredStatus.on("ibx_menu_item_click",function(e)
		{
			DeferredStatus();
		});

		jqItemMenu.data('ibxWidget').miStopRequests.on("ibx_menu_item_click",function(e)
		{
			StopRequests();			
		});

		jqItemMenu.data('ibxWidget').miSessionViewer.on("ibx_menu_item_click",function(e)
		{
			 window.open(applicationContext + "/util/wfsessionviewer.jsp","_SessionViewer");						
		});

		jqItemMenu.data('ibxWidget').miReportCasterExplorer.on("ibx_menu_item_click",function(e)
		{
			 var ReportCasterExplorer = applicationContext + "/rcex.rc?BIDrand=" + Math.floor(Math.random() * 99999);
			 window.open(ReportCasterExplorer,"_RConsoleExplorer");	  								
		});

		jqItemMenu.data('ibxWidget').miReportCasterStatus.on("ibx_menu_item_click",function(e)
		{
			window.open(applicationContext + "/rcc.rc","_RConsole");					
		});

		jqItemMenu.data('ibxWidget').miMagnifySearch.on("ibx_menu_item_click",function(e)
		{
			window.open(applicationContext + "/search","_search");					
		});
		
		jqItemMenu.data('ibxWidget').miManageEaselLyInfographics.on("ibx_menu_item_click",function(e)
		{
			window.open("https://webfocus.easel.ly/","_easelLy");					
		});		
		
		jqItemMenu.data('ibxWidget').miOnlineHelp.on("ibx_menu_item_click",function(e)
		{
			var onlineHelp = home_globals.home_page_globals["helpPath"] + "/advanced/redirect.jsp?topic=/com.ibi.help/help.htm#wfhelp_welcome";
			window.open(onlineHelp,"_WebFocHelp");
		});

		jqItemMenu.data('ibxWidget').miInformationCenter.on("ibx_menu_item_click",function(e)
		{
			var helpURL=home_globals.home_page_globals["helpURL"];
			window.open(helpURL,"_ibiBusinessIntelligence");		
		});
/*		
		jqItemMenu.data('ibxWidget').miVideoAssist.on("ibx_menu_item_click",function(e)
		{
			window.open("https://webfocusinfocenter.informationbuilders.com/wfappent/video.html","_ibiEducation");							
		});
		
		jqItemMenu.data('ibxWidget').miTechnicalLibrary.on("ibx_menu_item_click",function(e)
		{
			window.open("https://webfocusinfocenter.informationbuilders.com/wfappent/technical-library.html","_ibiTechSupport");							
		});
*/		
		jqItemMenu.data('ibxWidget').miCommunity.on("ibx_menu_item_click",function(e)
		{
			window.open("http://www.informationbuilders.com/support/wf_dev_center.html","_ibiFocalPoint");							
		});
		
		jqItemMenu.data('ibxWidget').miInformationBuildersHome.on("ibx_menu_item_click",function(e)
		{
			window.open("http://www.informationbuilders.com/","_ibicom");								
		});
		
		jqItemMenu.data('ibxWidget').miPreferences.on("ibx_menu_item_click",function(e)
		{
			Preferences();			
		});
		
		jqItemMenu.data('ibxWidget').miAbout.on("ibx_menu_item_click",function(e)
		{
			onHelpAboutDialog();
		});
		
		jqItemMenu.data('ibxWidget').miLicenses.on("ibx_menu_item_click",function(e)
		{
			window.open(applicationContext + "/licenseinfopage.jsp","_WebFocLicenseInfo");						
		});
		
		jqItemMenu.data('ibxWidget').miHomeLegacy.on("ibx_menu_item_click",function(e)
		{
			var legacyhome="/legacyhome";
			if (home_page_globals["isAnonymousUser"] == "true")
				legacyhome="/public/legacyhome";				
			var win = window.open(applicationContext + legacyhome);			
		});

		jqItemMenu.data('ibxWidget').misignin.on("ibx_menu_item_click",function(e)
		{
			hpsignin();	
		});
			
		jqItemMenu.data('ibxWidget').misignout.on("ibx_menu_item_click",function(e)
		{
			e.stopPropagation();
			hpsignout();										
		});
				
		// menu Permission
		
		var isShowRCExplorer, isMagnify, isShowcasterconsole;
		var isEaselly=null;
		var showAdministrationMenu = false;
		for (var i = 0; i < home_page_globals["menuPermission"].length; i++)
		{
			var node = home_page_globals["menuPermission"][i];
			var permName = node.getAttribute("name");
			var permValue = node.getAttribute("value");

			switch (permName)
			{
				case "canManage": 
					if (permValue == "false")
					{
						jqItemMenu.data('ibxWidget').miModeNormalSeparator.hide();
						jqItemMenu.data('ibxWidget').miModeNormal.hide();
						jqItemMenu.data('ibxWidget').miModeManager.hide();									
					}
					else
						showAdministrationMenu = true;
					break;
				case "legacyLinks":
					if (permValue == "false")
						jqItemMenu.data('ibxWidget').miHomeLegacy.hide();
					break;
				case "currentMode": 
					if (permValue == "normal")
						jqItemMenu.data('ibxWidget').miModeNormal.ibxWidget("option", "checked", true);
					else
						jqItemMenu.data('ibxWidget').miModeManager.ibxWidget("option", "checked", true);
					home_globals.home_page_globals["MenuManagerMode"] = permValue;
					break;
				case "aboutHelp": 
					if (permValue == "false")
					{
						jqItemMenu.data('ibxWidget').miAboutSeparator.hide();
						jqItemMenu.data('ibxWidget').miAbout.hide();
						jqItemMenu.data('ibxWidget').miLicenses.hide();
					}
					break;
				case "viewbuilder": 
					if (permValue == "false") 
					{
						jqItemMenu.data('ibxWidget').miViewbuilder.hide();
						jqItemMenu.data('ibxWidget').miViewbuilderSeparator.hide();
					}
					break;
				case "isAnonymousUser": 
					if (permValue == "true")
					{
						jqItemMenu.data('ibxWidget').miChangePassword.hide();
						jqItemMenu.data('ibxWidget').misignout.hide();
						jqItemMenu.data('ibxWidget').miPreferences.hide();									
					}
					else
						jqItemMenu.data('ibxWidget').misignin.hide();								
					break;								
				case "RCExplorer":
					isShowRCExplorer = permValue;
					if (permValue == "false") jqItemMenu.data('ibxWidget').miReportCasterExplorer.hide(); 
					break;
				case "casterconsole": 
					isShowcasterconsole = permValue;
					if (permValue == "false") jqItemMenu.data('ibxWidget').miReportCasterStatus.hide(); 
					break;
				case "magnify": 
					isMagnify = permValue;					
					if (permValue == "false") jqItemMenu.data('ibxWidget').miMagnifySearch.hide(); 
					break;
				case "easelly": 
					isEaselly = permValue;					
					if (permValue == "false") jqItemMenu.data('ibxWidget').miManageEaselLyInfographics.hide(); 
					break;
				case "canCustomizePortal":
					home_page_globals["canCustomizePortal"] = permValue;
					break;
				case "useradmin": 
					if (permValue == "false") 
						jqItemMenu.data('ibxWidget').miSecurityCenter.hide(); 
					else
						showAdministrationMenu = true;
					break;
				case "wfconsole": 
					if (permValue == "false") 
						jqItemMenu.data('ibxWidget').miAdministrationConsole.hide();							
					else
						showAdministrationMenu = true;
					break;
				case "magnifyConsole": 
					if (permValue == "false") 
						jqItemMenu.data('ibxWidget').miMagnifyConsole.hide();
					else
						showAdministrationMenu = true;
					break;
				case "managePrivateTool": 
					if (permValue == "false") 
						jqItemMenu.data('ibxWidget').miManagePrivateResources.hide();
					else
						showAdministrationMenu = true;
					break;
				
				case "deferredStatus": if (permValue == "false") jqItemMenu.data('ibxWidget').miDeferredStatus.hide(); break;
				case "stopRequests": if (permValue == "false") jqItemMenu.data('ibxWidget').miStopRequests.hide(); break;
				case "devTraces": if (permValue == "false") jqItemMenu.data('ibxWidget').miSessionViewer.hide(); break;
				case "showTools": if (permValue == "false") jqItemMenu.data('ibxWidget').miTools.hide(); break;
				case "favorites": 
				case "mobileFavorites": 
					break;
			}
		}

		if (!showAdministrationMenu) 
			jqItemMenu.data('ibxWidget').miAdministration.hide();

		if (isEaselly == null)
		{ // set to default
			isEaselly = "false";
			jqItemMenu.data('ibxWidget').miManageEaselLyInfographics.hide();	
		}

		if (home_page_globals["isCanChangePassword"] == "false")
			jqItemMenu.data('ibxWidget').miChangePassword.hide();							

		if (home_globals.home_page_globals["currentPage"] == "portal")
		{
			jqItemMenu.data('ibxWidget').miHomeLegacy.hide();
			if (home_page_globals["canCustomizePortal"] == "false")
				jqItemMenu.data('ibxWidget').miRemoveMyCustomizations.hide();
		}
		else
			jqItemMenu.data('ibxWidget').miRemoveMyCustomizations.hide();

		if (ibxPlatformCheck.isMobile)
			jqItemMenu.data('ibxWidget').miHomeLegacy.hide();
		
		if (typeof (home_globals.configMode) != "undefined" && home_globals.configMode > -1)
		{
			jqItemMenu.data('ibxWidget').miAdministration.hide(); 
			jqItemMenu.data('ibxWidget').miTools.hide(); 
			jqItemMenu.data('ibxWidget').miPreferences.hide();	
			jqItemMenu.data('ibxWidget').miHomeLegacy.hide();
		}	
	
		if (home_globals.home_page_globals["isMobileFaves"] == "true")
		{
			jqItemMenu.data('ibxWidget').miHomeLegacy.hide();
			jqItemMenu.data('ibxWidget').miChangePassword.hide();
			jqItemMenu.data('ibxWidget').misignout.hide();
		}
		
		if (isShowcasterconsole == "false" && isShowRCExplorer == "false")
			jqItemMenu.data('ibxWidget').miReportCasterSeparator.hide();

		if (isEaselly == "false" && isMagnify == "false")
			jqItemMenu.data('ibxWidget').miMagnifySeparator.hide();
		
		jqItemMenu.ibxMenu("option", {position:{my:"left top", at:"left bottom", of:posOf}});
		jqItemMenu.ibxMenu("open");	
		home_globals.home_page_globals["mainMenuObject"] = jqItemMenu;
	}
	else
		home_globals.home_page_globals["mainMenuObject"].ibxMenu("open"); 
}

//# sourceURL=home_util.js