/*
 * JWChat, a web based jabber client
 * Copyright (C) 2003-2004 Stefan Strigler <steve@zeank.in-berlin.de>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 *
 * Please visit http://jwchat.sourceforge.net for more information!
 */

/*
 * This is the main configuration file for the chat client itself.
 * You have to edit this before you can use jwchat on your website!
 *
 * Have a look at the README for hints and troubleshooting!
 */

var JABBERSERVER = "jabber.zeank.in-berlin.de";
var DEFAULTRESOURCE = "jwchat";

/* sWCS2
 * url of wcs service (the port where http component listens on
 * depends on how you configured your jabber server (due to firewall
 * restrictions using port 8080 instead of the standard port 5280 is
 * highly recommended
 */
var sWCS2 = "http://jabber.zeank.in-berlin.de:5280/";

/* sWCS
 * redirect address for wcs (depends on how you configured
 * mod_rewrite/mod_proxy on your web-server - this is used for
 * Gecko based browsers
 */
var sWCS = "http://jabber.zeank.in-berlin.de/wcs/";

/* comment out next line if you don't want any browser to connect
 * directly on wcs port (not recommended)
 */
//var sWCS2 = sWCS;

var timerval = 2000; // poll frequency in msec
var timeout = 150; // timeout of wcs

var stylesheet = "wcs.css";
var THEMESDIR = "themes";

/* USERHISTORYURL
 * Can be used if you have some sort of message logging on
 * your server. you could write a simple cgi-based application to let
 * your users access this information.
 *
 * Have a look at openUserHistory() [jwchat.html] to understand what
 * I'm talking about
 */
var USERHISTORYURL = "http://jabber.zeank.in-berlin.de/na.html";

var ICQTRANSPORT = "icq.jabber.zeank.in-berlin.de";
var ICQUSERURL = "http://wwp.icq.com/$user";

var DEFAULTCONFERENCESERVER = "conference.zeank.in-berlin.de";

var DEBUG = true; // turn debugging on
var DEBUG_LVL = 1; // debug-level 0..4 (4 = very noisy)

var USE_DEBUGJID = false; // if true only DEBUGJID gets the debugger
var DEBUGJID = "zeank@jabber.zeank.in-berlin.de"; // which user get's debug messages
