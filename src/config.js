var JABBERSERVER = "jabber.zeank.in-berlin.de"
var DEFAULTRESOURCE = "wcs";
var sWCS = "http://jabber.zeank.in-berlin.de/wcs/"; // url of wcs service
/* var sWCS2 = "http://jabber.zeank.in-berlin.de:5280/"; */// url of wcs service
var sWCS2 = sWCS;
var timerval = 5000; // poll frequency in msec
var timeout = 150; // timeout of wcs

var stylesheet = "wcs.css";
var THEMESDIR = "themes";

var USERURL = "http://pxxto.zeank.in-berlin.de:8080/user/$user";
var USERHISTORYURL = "http://pxxto.zeank.in-berlin.de:8080/user/history/$user";

var ICQTRANSPORT = "icq.jabber.zeank.in-berlin.de";
var ICQUSERURL = "http://wwp.icq.com/$user";

var DEFAULTCONFERENCESERVER = "conference.zeank.in-berlin.de";

var DEBUG = true; // turn debugging on
var DEBUG_LVL = 2; // debug-level

var USE_DEBUGJID = false; // if true only DEBUGJID gets the debugger
var DEBUGJID = "zeank@jabber.zeank.in-berlin.de"; // which user get's debug messages
