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

var JABBERSERVER = "zeank.darktech.org"
var DEFAULTRESOURCE = "jwchat";

//var HTTPBASE = "/cgi-bin/httppoll.cgi?server="+JABBERSERVER+"&port=5222";
var HTTPBASE = "http-poll/";

var timerval = 2000; // poll frequency in msec
var timeout = 150; // timeout of wcs

var stylesheet = "jwchat.css";
var THEMESDIR = "themes";

/* DEFAULTCONFERENCEGROUP + DEFAULTCONFERENCESERVER
 * default values for joingroupchat form
 */
var DEFAULTCONFERENCEROOM = "talks";
var DEFAULTCONFERENCESERVER = "conference.zeank.darktech.org";

/* debugging options */
var DEBUG = false; // turn debugging on
var DEBUG_LVL = 1; // debug-level 0..4 (4 = very noisy)

var USE_DEBUGJID = true; // if true only DEBUGJID gets the debugger
var DEBUGJID = "zeank@zeank.darktech.org"; // which user get's debug messages
